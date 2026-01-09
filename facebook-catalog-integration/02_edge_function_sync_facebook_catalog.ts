// ============================================
// SUPABASE EDGE FUNCTION: SYNC FACEBOOK CATALOG
// ============================================
// Esta función sincroniza automáticamente productos
// con Facebook Catalog API cuando se crean o actualizan

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Tipos
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    offer_price: number | null;
    stock: number;
    is_offer: boolean;
    images: string[];
    facebook_product_id: string | null;
}

interface FacebookProductData {
    id: string;
    title: string;
    description: string;
    availability: "in stock" | "out of stock";
    condition: "new";
    price: string;
    image_link: string;
    link: string;
    brand: string;
    sale_price?: string;
}

// Función principal
serve(async (req) => {
    try {
        console.log("🚀 Iniciando sincronización con Facebook Catalog...");

        // 1. Obtener configuración desde Supabase Secrets
        const FACEBOOK_ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
        const FACEBOOK_CATALOG_ID = Deno.env.get("FACEBOOK_CATALOG_ID");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const SITE_URL = Deno.env.get("SITE_URL") || "https://tutienda.com";

        // Validar variables de entorno
        if (!FACEBOOK_ACCESS_TOKEN || !FACEBOOK_CATALOG_ID) {
            throw new Error("❌ Faltan credenciales de Facebook en Supabase Secrets");
        }

        if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
            throw new Error("❌ Faltan credenciales de Supabase");
        }

        // 2. Parsear el payload del trigger
        const payload = await req.json();
        const { record, old_record, type } = payload;

        console.log(`📦 Tipo de evento: ${type}`);
        console.log(`📝 Producto ID: ${record.id}`);

        // 3. Crear cliente de Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // 4. Obtener datos completos del producto
        const { data: product, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", record.id)
            .single();

        if (fetchError || !product) {
            throw new Error(`❌ Error obteniendo producto: ${fetchError?.message}`);
        }

        console.log(`✅ Producto obtenido: ${product.name}`);

        // 5. Preparar datos para Facebook
        const finalPrice = product.is_offer && product.offer_price
            ? product.offer_price
            : product.price;

        const availability = product.stock > 0 ? "in stock" : "out of stock";

        const facebookData: FacebookProductData = {
            id: product.id,
            title: product.name,
            description: product.description || product.name,
            availability,
            condition: "new",
            price: `${finalPrice} COP`,
            image_link: product.images?.[0] || `${SITE_URL}/placeholder.jpg`,
            link: `${SITE_URL}/producto/${product.id}`,
            brand: "AMC Market",
        };

        // Si hay oferta, agregar precio de oferta
        if (product.is_offer && product.offer_price && product.offer_price < product.price) {
            facebookData.sale_price = `${product.offer_price} COP`;
        }

        console.log("📊 Datos preparados para Facebook:", facebookData);

        // 6. Sincronizar con Facebook
        let facebookProductId = product.facebook_product_id;
        let syncMethod = "CREATE";

        if (facebookProductId) {
            // ACTUALIZAR producto existente
            syncMethod = "UPDATE";
            console.log(`🔄 Actualizando producto en Facebook: ${facebookProductId}`);

            const updateResponse = await fetch(
                `https://graph.facebook.com/v18.0/${facebookProductId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...facebookData,
                        access_token: FACEBOOK_ACCESS_TOKEN,
                    }),
                }
            );

            if (!updateResponse.ok) {
                const error = await updateResponse.json();
                throw new Error(`❌ Error actualizando en Facebook: ${JSON.stringify(error)}`);
            }

            console.log("✅ Producto actualizado en Facebook");
        } else {
            // CREAR nuevo producto
            console.log("➕ Creando nuevo producto en Facebook Catalog");

            const createResponse = await fetch(
                `https://graph.facebook.com/v18.0/${FACEBOOK_CATALOG_ID}/products`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...facebookData,
                        access_token: FACEBOOK_ACCESS_TOKEN,
                    }),
                }
            );

            if (!createResponse.ok) {
                const error = await createResponse.json();
                throw new Error(`❌ Error creando en Facebook: ${JSON.stringify(error)}`);
            }

            const createResult = await createResponse.json();
            facebookProductId = createResult.id;

            console.log(`✅ Producto creado en Facebook con ID: ${facebookProductId}`);
        }

        // 7. Actualizar registro en Supabase
        const { error: updateError } = await supabase
            .from("products")
            .update({
                facebook_product_id: facebookProductId,
                synced_to_facebook: true,
                last_facebook_sync: new Date().toISOString(),
            })
            .eq("id", product.id);

        if (updateError) {
            console.error("⚠️ Error actualizando estado de sincronización:", updateError);
        } else {
            console.log("✅ Estado de sincronización actualizado en Supabase");
        }

        // 8. Respuesta exitosa
        return new Response(
            JSON.stringify({
                success: true,
                message: `Producto ${syncMethod === "CREATE" ? "creado" : "actualizado"} en Facebook`,
                product_id: product.id,
                facebook_product_id: facebookProductId,
                method: syncMethod,
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (error) {
        console.error("❌ Error en sincronización:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
                details: error.toString(),
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
