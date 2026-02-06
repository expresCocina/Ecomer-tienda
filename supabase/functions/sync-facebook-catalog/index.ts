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

        // Helper: Asegurar que las URLs sean absolutas con HTTPS
        const ensureAbsoluteUrl = (url: string): string => {
            if (!url) return "";

            // Si ya es una URL absoluta, retornarla
            if (url.startsWith("http://") || url.startsWith("https://")) {
                return url;
            }

            // Si es una ruta de Supabase Storage, construir URL completa
            // Formato esperado: /storage/v1/object/public/...
            if (url.startsWith("/storage/")) {
                return `${SUPABASE_URL}${url}`;
            }

            // Si es solo el path del bucket, construir URL completa
            // Formato: product-images/abc123.jpg
            return `${SUPABASE_URL}/storage/v1/object/public/${url}`;
        };

        // Filtrar, limpiar y validar imágenes
        const allImages = (record.images || [])
            .filter((url: string) => url && url.trim() !== "")
            .map((url: string) => ensureAbsoluteUrl(url))
            .filter((url: string) => url.startsWith("https://")) // Solo HTTPS válidas
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
            additionalImages.forEach((img: string, i: number) => {
                console.log(`  ${i + 1}. ${img.substring(0, 60)}...`);
            });
        }

        // Preparar datos para Facebook
        // IMPORTANTE: Facebook requiere price (precio original) y sale_price (precio con descuento)
        const finalPrice = record.offer_price || record.price;
        const hasDiscount = record.offer_price && record.offer_price < record.price;

        // Objeto data para Batch API
        const data: any = {
            name: record.name,
            description: record.description || record.name,
            availability: record.stock > 0 ? "in stock" : "out of stock",
            condition: record.condition || "new",  // Usar condición de BD
            price: (Math.round(record.price * 100)).toString(),
            currency: "COP",
            image_url: mainImage,
            url: `${SITE}/producto/${record.id}`,
            brand: record.brand || "Generico",
            product_type: categoryName,  // Necesario para reglas dinámicas de Facebook
        };

        // Agregar metadatos opcionales de catálogo
        if (record.google_product_category) {
            data.google_product_category = record.google_product_category;
        }
        if (record.gender) {
            data.gender = record.gender;
        }
        if (record.age_group) {
            data.age_group = record.age_group;
        }
        if (record.material) {
            data.material = record.material;
        }

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

        console.log(`📦 Sincronizando producto con Facebook usando Modelo Parent-Child...`);

        // SISTEMA HÍBRIDO: Detectar si hay variantes reales o usar imágenes
        const hasRealVariants = record.variants && Array.isArray(record.variants) && record.variants.length > 0;

        let batchRequests;

        if (hasRealVariants) {
            // VARIANTES REALES: Usar datos de la base de datos
            console.log(`✅ Producto con ${record.variants.length} variantes reales`);

            batchRequests = record.variants.map((variant: any, index: number) => {
                // CRÍTICO: Usar ID único real, no genérico
                const variantId = variant.id || `${record.id}_var_${index + 1}_${Date.now()}`;
                const variantPrice = variant.price || record.price;
                const variantStock = variant.stock !== undefined ? variant.stock : record.stock;
                const variantAvailability = (variantStock || 0) > 0 ? "in stock" : "out of stock";

                // Asegurar que la imagen de la variante sea URL absoluta
                let variantImageUrl = variant.image_url || allImages[index] || mainImage;
                variantImageUrl = ensureAbsoluteUrl(variantImageUrl);

                const variantData: any = {
                    id: variantId,  // ✅ DEBE SER IDÉNTICO AL retailer_id
                    item_group_id: record.id,  // ✅ TAMBIÉN EN DATA
                    name: `${record.name} - ${variant.name || `Variante ${index + 1}`}`,
                    description: record.description || record.name,
                    condition: record.condition || "new",
                    price: Math.round(variantPrice * 100),
                    currency: "COP",
                    image_url: variantImageUrl,
                    url: `${SITE}/producto/${record.id}`,
                    brand: record.brand || "Generico",
                    product_type: categoryName
                };

                // Agregar metadatos de catálogo opcionales
                if (record.gender) {
                    variantData.gender = record.gender;
                }
                if (record.age_group) {
                    variantData.age_group = record.age_group;
                }

                // ✅ DIFERENCIADORES OBLIGATORIOS - Facebook necesita al menos uno para agrupar
                if (variant.color) {
                    variantData.color = variant.color;
                } else if (variant.name) {
                    // Si no hay color, usar el nombre de la variante como diferenciador
                    variantData.color = variant.name;
                }

                if (variant.size) variantData.size = variant.size;
                if (variant.material) variantData.material = variant.material;

                // Precio con descuento - SOLO si offer_price > 0
                if (variant.offer_price && variant.offer_price > 0 && variant.offer_price < variantPrice) {
                    variantData.sale_price = Math.round(variant.offer_price * 100);
                } else if (record.offer_price && record.offer_price > 0 && record.offer_price < record.price) {
                    variantData.sale_price = Math.round(record.offer_price * 100);
                }

                // Construir objeto de respuesta
                const batchItem: any = {
                    method: "UPDATE",
                    retailer_id: variantId,  // ✅ IDÉNTICO A data.id
                    item_group_id: record.id,
                    availability: variantAvailability,
                    inventory: variantStock || 0,  // ✅ AGREGAR STOCK NUMÉRICO EN RAÍZ
                    google_product_category: record.google_product_category || '512',
                    data: variantData
                };

                // ✅ SOLO agregar style si tiene valor real (no undefined)
                if (variant.style && variant.style.trim() !== '') {
                    batchItem.style = variant.style;
                }

                return batchItem;
            });
        } else {
            // VARIANTES POR IMAGEN: Modelo actual (fallback)
            console.log(`📸 Sin variantes reales, creando ${allImages.length} variantes por imagen`);

            batchRequests = allImages.map((imageUrl: string, index: number) => {
                // CRÍTICO: Usar ID único real
                const variantId = `${record.id}_img_${index + 1}_${Date.now()}`;
                const variantAvailability = record.stock > 0 ? "in stock" : "out of stock";

                const variantData: any = {
                    id: variantId,  // ✅ DEBE SER IDÉNTICO AL retailer_id
                    item_group_id: record.id,  // ✅ TAMBIÉN EN DATA
                    name: record.name,
                    description: record.description || record.name,
                    condition: record.condition || "new",
                    price: Math.round(record.price * 100),
                    currency: "COP",
                    image_url: imageUrl,  // Ya viene validada como HTTPS absoluta
                    url: `${SITE}/producto/${record.id}`,
                    brand: record.brand || "Generico",
                    product_type: categoryName,
                    // ✅ DIFERENCIADOR: Usar el índice de vista como color para agrupar
                    color: `Vista ${index + 1}`
                };

                // Agregar metadatos de catálogo opcionales
                if (record.gender) {
                    variantData.gender = record.gender;
                }
                if (record.age_group) {
                    variantData.age_group = record.age_group;
                }

                // Precio con descuento - SOLO si offer_price > 0
                if (record.offer_price && record.offer_price > 0 && record.offer_price < record.price) {
                    variantData.sale_price = Math.round(record.offer_price * 100);
                }

                return {
                    method: "UPDATE",
                    retailer_id: variantId,  // ✅ IDÉNTICO A data.id
                    item_group_id: record.id,
                    availability: variantAvailability,
                    inventory: record.stock || 0,  // ✅ AGREGAR STOCK NUMÉRICO EN RAÍZ
                    google_product_category: record.google_product_category || '512',
                    // ❌ NO agregar style aquí (no es necesario para variantes por imagen)
                    data: variantData
                };
            });
        }

        console.log(`📋 Creando ${batchRequests.length} variantes para item_group_id: ${record.id}`);
        console.log(`📋 Batch Requests:`, JSON.stringify(batchRequests, null, 2));

        const res = await fetch(
            `https://graph.facebook.com/v21.0/${CATALOG}/batch`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + TOKEN,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requests: batchRequests
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
