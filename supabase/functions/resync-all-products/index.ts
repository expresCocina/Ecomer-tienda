import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.94.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge Function para resincronizar todos los productos con Facebook
 * Esto disparará el webhook sync-facebook-catalog para cada producto
 */
serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("DB_SERVICE_KEY");
        const TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
        const CATALOG = Deno.env.get("FACEBOOK_CATALOG_ID");
        const SITE = Deno.env.get("SITE_URL") || "https://cycrelojeria.com";

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TOKEN || !CATALOG) {
            throw new Error("Missing required environment variables");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        console.log("🔄 Iniciando resincronización masiva de productos...");

        // Obtener todos los productos
        const { data: products, error: fetchError } = await supabase
            .from("products")
            .select("id, name, description, price, stock, images, brand, category_id")
            .order("id");

        if (fetchError) {
            throw fetchError;
        }

        if (!products || products.length === 0) {
            return new Response(
                JSON.stringify({ success: true, message: "No hay productos para sincronizar" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`📦 Encontrados ${products.length} productos`);

        const results = {
            total: products.length,
            success: 0,
            failed: 0,
            errors: [] as any[],
        };

        // Procesar cada producto
        for (const product of products) {
            try {
                console.log(`🔄 Sincronizando: ${product.name} (${product.id})`);

                // Obtener nombre de categoría
                let categoryName = "Sin categoría";
                if (product.category_id) {
                    const { data: category } = await supabase
                        .from("categories")
                        .select("name")
                        .eq("id", product.category_id)
                        .single();

                    if (category) {
                        categoryName = category.name;
                    }
                }

                // Preparar datos para Facebook
                const data = {
                    retailer_id: product.id,
                    name: product.name,
                    description: product.description || product.name,
                    availability: product.stock > 0 ? "in stock" : "out of stock",
                    condition: "new",
                    price: (Math.round(product.price * 100)).toString(),
                    currency: "COP",
                    image_url: product.images?.[0] || "",
                    url: `${SITE}/producto/${product.id}`,
                    brand: product.brand || "Generico",
                    product_type: categoryName,
                    google_product_category: categoryName, // ← Categoría corregida
                };

                // Enviar a Facebook
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

                const fb = await res.json();

                if (!res.ok) {
                    console.error(`❌ Error en ${product.name}:`, fb);
                    results.failed++;
                    results.errors.push({
                        product_id: product.id,
                        product_name: product.name,
                        error: fb,
                    });
                } else {
                    console.log(`✅ ${product.name} sincronizado`);
                    results.success++;

                    // Actualizar en Supabase
                    await supabase
                        .from("products")
                        .update({
                            facebook_product_id: fb.id,
                            synced_to_facebook: true,
                            last_facebook_sync: new Date().toISOString(),
                        })
                        .eq("id", product.id);
                }

                // Pequeña pausa para no saturar la API de Facebook
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ Error procesando ${product.name}:`, error);
                results.failed++;
                results.errors.push({
                    product_id: product.id,
                    product_name: product.name,
                    error: error.message,
                });
            }
        }

        console.log("✅ Resincronización completada");
        console.log(`📊 Exitosos: ${results.success}/${results.total}`);
        console.log(`❌ Fallidos: ${results.failed}/${results.total}`);

        return new Response(
            JSON.stringify(results),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (err) {
        console.error("❌ Error General:", err);
        return new Response(
            JSON.stringify({ error: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
