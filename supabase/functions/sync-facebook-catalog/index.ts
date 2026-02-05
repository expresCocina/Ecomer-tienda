import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.94.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Elimina todas las variantes de un producto de Facebook
 */
async function deleteProductVariants(productId: string, TOKEN: string, CATALOG: string) {
    try {
        console.log(`🗑️ Buscando variantes antiguas del producto ${productId}...`);

        // Buscar todas las variantes con este item_group_id
        const searchRes = await fetch(
            `https://graph.facebook.com/v21.0/${CATALOG}/products?filter={"item_group_id":{"eq":"${productId}"}}`,
            {
                headers: { "Authorization": "Bearer " + TOKEN }
            }
        );

        if (!searchRes.ok) {
            console.log(`⚠️ No se pudieron buscar variantes (puede ser primera vez)`);
            return;
        }

        const { data } = await searchRes.json();

        if (!data || data.length === 0) {
            console.log(`✅ No hay variantes antiguas para eliminar`);
            return;
        }

        console.log(`🗑️ Eliminando ${data.length} variantes antiguas...`);

        // Eliminar cada variante
        for (const variant of data) {
            await fetch(
                `https://graph.facebook.com/v21.0/${variant.id}`,
                {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + TOKEN }
                }
            );
            console.log(`  ✅ Variante ${variant.id} eliminada`);
        }

        console.log(`✅ Todas las variantes antiguas eliminadas`);
    } catch (err) {
        console.error(`⚠️ Error eliminando variantes (continuando):`, err.message);
    }
}

/**
 * Crea variantes de producto en Facebook (una por cada imagen)
 */
async function createProductVariants(
    record: any,
    categoryName: string,
    images: string[],
    TOKEN: string,
    CATALOG: string,
    SITE: string
) {
    const results = [];

    console.log(`📦 Creando ${images.length} variantes del producto...`);

    for (let i = 0; i < images.length; i++) {
        const isMainVariant = i === 0;

        const data: any = {
            retailer_id: record.id, // MISMO ID para todas las variantes
            item_group_id: record.id,
            name: record.name, // MISMO nombre para todas
            description: record.description || record.name,
            availability: record.stock > 0 ? "in stock" : "out of stock",
            condition: "new",
            price: (Math.round(record.price * 100)).toString(),
            currency: "COP",
            image_url: images[i],
            url: `${SITE}/producto/${record.id}`,
            brand: record.brand || "Generico",
            product_type: categoryName,
            google_product_category: categoryName,
            // Diferenciar variantes por color (Facebook agrupa por este campo)
            color: `Vista ${i + 1}`,
        };

        console.log(`  📸 Variante ${i + 1}/${images.length}: ${images[i].substring(0, 60)}...`);

        const res = await fetch(
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

        const result = await res.json();

        if (!res.ok) {
            console.error(`  ❌ Error en variante ${i + 1}:`, result);
            results.push({ success: false, error: result, index: i });
        } else {
            console.log(`  ✅ Variante ${i + 1} creada: ${result.id}`);
            results.push({ success: true, id: result.id, index: i });
        }

        // Pequeño delay para evitar rate limiting
        if (i < images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return results;
}

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

        // PASO 1: Eliminar variantes antiguas
        await deleteProductVariants(record.id, TOKEN, CATALOG);

        // PASO 2: Crear nuevas variantes
        const results = await createProductVariants(
            record,
            categoryName,
            allImages,
            TOKEN,
            CATALOG,
            SITE
        );

        // PASO 3: Verificar resultados
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        console.log(`\n📊 Resumen:`);
        console.log(`  ✅ Variantes creadas: ${successCount}/${allImages.length}`);
        if (failCount > 0) {
            console.log(`  ❌ Variantes fallidas: ${failCount}`);
        }

        if (successCount === 0) {
            throw new Error("No se pudo crear ninguna variante");
        }

        return new Response(
            JSON.stringify({
                success: true,
                variants_created: successCount,
                variants_failed: failCount,
                results: results
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
