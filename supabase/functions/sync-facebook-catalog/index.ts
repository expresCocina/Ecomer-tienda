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
            console.log(`🔍 Buscando categoría con ID: ${record.category_id}`);
            const { data: category, error: categoryError } = await supabase
                .from("categories")
                .select("name")
                .eq("id", record.category_id)
                .single();

            if (categoryError) {
                console.error(`❌ Error al obtener categoría:`, categoryError);
            } else if (category) {
                categoryName = category.name;
                console.log(`✅ Categoría encontrada: ${categoryName}`);
            } else {
                console.log(`⚠️ Categoría no encontrada para ID: ${record.category_id}`);
            }
        } else {
            console.log(`⚠️ Producto sin category_id asignado`);
        }

        console.log(`📁 Categoría final: ${categoryName}`);

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
        // IMPORTANTE: Facebook requiere price (precio original) y sale_price (precio con descuento)
        const finalPrice = record.offer_price || record.price;
        const hasDiscount = record.offer_price && record.offer_price < record.price;

        // Objeto data para Batch API (SIN retailer_id, SIN google_product_category)
        const data: any = {
            name: record.name,
            description: record.description || record.name,
            availability: record.stock > 0 ? "in stock" : "out of stock",
            condition: "new",
            price: (Math.round(record.price * 100)).toString(),
            currency: "COP",
            image_url: mainImage,
            url: `${SITE}/producto/${record.id}`,
            brand: record.brand || "Generico",
            product_type: categoryName,  // Necesario para reglas dinámicas de Facebook
        };

        // Agregar precio con descuento si existe (SIN sale_price_effective_date)
        if (hasDiscount) {
            data.sale_price = (Math.round(record.offer_price * 100)).toString();
            console.log(`💰 Precio original: $${record.price.toLocaleString()} → Descuento: $${record.offer_price.toLocaleString()}`);
        } else {
            console.log(`💰 Precio: $${record.price.toLocaleString()}`);
        }

        // Agregar imágenes adicionales si existen
        // Batch API requiere additional_image_urls (plural)
        if (additionalImages.length > 0) {
            data.additional_image_urls = additionalImages;
            console.log(`🖼️ Campo additional_image_urls configurado con ${additionalImages.length} URLs`);
        }

        // Log del payload completo para debugging
        console.log(`📋 PAYLOAD COMPLETO:`, JSON.stringify(data, null, 2));

        console.log(`📦 Sincronizando producto con Facebook usando Batch API...`);

        // BATCH API: retailer_id va FUERA de data, al mismo nivel que method
        const batchRequest = {
            method: "UPDATE",
            retailer_id: record.id,
            data: data
        };

        console.log(`📋 Batch Request:`, JSON.stringify(batchRequest, null, 2));

        const res = await fetch(
            `https://graph.facebook.com/v21.0/${CATALOG}/batch`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + TOKEN,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requests: [batchRequest]
                }),
            }
        );

        const fb = await res.json();

        console.log(`📤 Respuesta de Facebook:`, JSON.stringify(fb, null, 2));


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
