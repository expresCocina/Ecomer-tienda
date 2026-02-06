import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.94.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
        const CATALOG = Deno.env.get("FACEBOOK_CATALOG_ID");
        const SITE = Deno.env.get("SITE_URL") || "https://cycrelojeria.com";
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("DB_SERVICE_KEY");

        if (!TOKEN || !CATALOG || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing secrets (TOKEN, CATALOG, URL, SERVICE_KEY)");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const payload = await req.json();
        const record = payload.record;

        if (!record) {
            throw new Error("No 'record' found in payload");
        }

        console.log(`🔄 Sincronizando producto: ${record.name} (${record.id})`);

        // Obtener nombre de categoría
        let categoryName = "Sin categoría";
        if (record.category_id) {
            const { data: category } = await supabase
                .from("categories")
                .select("name")
                .eq("id", record.category_id)
                .single();

            if (category) {
                categoryName = category.name;
            }
        }

        console.log(`📁 Categoría: ${categoryName}`);

        // Filtrar y limpiar imágenes
        const allImages = (record.images || [])
            .filter((url: string) => url && url.trim() !== "")
            .filter((url: string, index: number, self: string[]) => self.indexOf(url) === index);

        console.log(`📸 Total de imágenes únicas: ${allImages.length}`);

        if (allImages.length === 0) {
            throw new Error("Producto sin imágenes válidas");
        }

        // Primera imagen como principal
        const mainImage = allImages[0];
        // Resto de imágenes como adicionales (máximo 20 según Facebook)
        const additionalImages = allImages.slice(1, 20);

        console.log(`🖼️ Imagen principal: ${mainImage.substring(0, 60)}...`);
        if (additionalImages.length > 0) {
            console.log(`📸 Imágenes adicionales: ${additionalImages.length}`);
            additionalImages.forEach((img, i) => {
                console.log(`  ${i + 1}. ${img.substring(0, 60)}...`);
            });
        }

        // Preparar datos para Facebook
        const data: any = {
            retailer_id: record.id,
            name: record.name,
            description: record.description || record.name,
            availability: record.stock > 0 ? "in stock" : "out of stock",
            condition: "new",
            price: (Math.round(record.price * 100)).toString(),
            currency: "COP",
            image_url: mainImage,
            url: `${SITE}/producto/${record.id}`,
            brand: record.brand || "Generico",
            product_type: categoryName,
            google_product_category: categoryName,
        };

        // Agregar imágenes adicionales si existen
        if (additionalImages.length > 0) {
            data.additional_image_urls = additionalImages;
        }

        console.log(`📦 Sincronizando producto con Facebook...`);

        // Verificar si el producto ya existe en Facebook
        let productExists = false;
        if (record.facebook_product_id) {
            console.log(`🔍 Verificando si producto existe en Facebook (ID: ${record.facebook_product_id})...`);
            const checkRes = await fetch(
                `https://graph.facebook.com/v21.0/${record.facebook_product_id}`,
                {
                    headers: { "Authorization": "Bearer " + TOKEN }
                }
            );
            productExists = checkRes.ok;
            console.log(productExists ? `✅ Producto existe, actualizando...` : `⚠️ Producto no existe, creando nuevo...`);
        } else {
            console.log(`⚠️ Sin facebook_product_id, creando nuevo producto...`);
        }

        // Preparar datos para enviar
        let res;

        if (productExists) {
            console.log(`🔄 Actualizando producto DIRECTAMENTE por ID: ${record.facebook_product_id}...`);
            // Imprimir payload para debug
            console.log("Payload Update:", JSON.stringify(data));

            // Actualización directa al nodo del producto
            res = await fetch(
                `https://graph.facebook.com/v21.0/${record.facebook_product_id}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + TOKEN,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data), // No necesitamos method: UPDATE aquí, ni retailer_id (ya lo tiene)
                }
            );
        } else {
            console.log(`✨ Creando producto NUEVO en catálogo...`);
            // Creación en el catálogo
            res = await fetch(
                `https://graph.facebook.com/v21.0/${CATALOG}/products`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + TOKEN,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
        }

        const fb = await res.json();

        if (!res.ok) {
            console.error("❌ Error en Facebook API:", fb);
            throw new Error(`Facebook Error: ${JSON.stringify(fb)}`);
        }

        console.log("✅ Producto sincronizado exitosamente");
        console.log(`   ID de Facebook: ${fb.id}`);
        console.log(`   Imágenes totales: ${allImages.length} (1 principal + ${additionalImages.length} adicionales)`);

        // Guardar facebook_product_id en la base de datos
        // Esto es CRÍTICO para que el trigger de eliminación funcione
        console.log(`💾 Guardando facebook_product_id en la base de datos...`);

        const { error: updateError } = await supabase
            .from("products")
            .update({ facebook_product_id: fb.id })
            .eq("id", record.id);

        if (updateError) {
            console.error("⚠️ Error guardando facebook_product_id:", updateError);
            // No lanzamos error porque el producto ya se sincronizó exitosamente
        } else {
            console.log(`✅ facebook_product_id guardado: ${fb.id}`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                fb_id: fb.id,
                images_count: allImages.length
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("❌ Error General:", err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
