import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.94.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

type Variant = {
    id?: string;
    sku?: string;
    name?: string;
    price?: number;
    offer_price?: number;
    stock?: number;
    image_url?: string;
    color?: string;
    size?: string;
    material?: string;
    style?: string;
};

type ProductRecord = {
    id: string;
    name: string;
    description?: string;
    price: number;
    offer_price?: number;
    stock?: number;
    condition?: string;
    brand?: string;
    category_id?: string;
    images?: string[];
    variants?: Variant[];

    google_product_category?: string;
    gender?: string;
    age_group?: string;
    material?: string;
    custom_label_0?: string;
};

function toCents(value: number): number {
    return Math.round(value * 100);
}

function safeString(x: unknown, fallback = ""): string {
    return typeof x === "string" && x.trim() ? x.trim() : fallback;
}

function isValidHttpsUrl(u: string): boolean {
    return typeof u === "string" && u.startsWith("https://");
}

function isBlobUrl(u: string): boolean {
    return typeof u === "string" && u.startsWith("blob:");
}

/**
 * Convierte:
 * - https://... => ok
 * - http://... => inválida (Meta pide https) => ""
 * - /storage/... => SUPABASE_URL + /storage/...
 * - bucket/path => SUPABASE_URL/storage/v1/object/public/bucket/path
 * - blob:... => inválida => ""
 */
function normalizeImageUrl(raw: string, supabaseUrl: string): string {
    const u = safeString(raw, "");
    if (!u) return "";

    if (isBlobUrl(u)) return "";
    if (u.startsWith("https://")) return u;
    if (u.startsWith("http://")) return ""; // Meta suele exigir https

    if (u.startsWith("/storage/")) return `${supabaseUrl}${u}`;
    return `${supabaseUrl}/storage/v1/object/public/${u}`;
}

/**
 * Decide si las variantes son "reales" para enviar modelo Shopify:
 * - Deben existir
 * - Deben tener al menos (id/sku/color/name) útil
 */
function hasRealVariants(variants?: Variant[]): boolean {
    if (!Array.isArray(variants) || variants.length === 0) return false;

    // Si todas vienen vacías o sin atributos, no sirven
    const useful = variants.some((v) =>
        Boolean(
            safeString(v.id) ||
            safeString(v.sku) ||
            safeString(v.color) ||
            safeString(v.name),
        )
    );

    return useful;
}

/**
 * Orden estable de variantes (para mapear imágenes por índice):
 * sku => id => name
 */
function sortVariantsStable(variants: Variant[]): Variant[] {
    return [...variants].sort((a, b) => {
        const ak = safeString(a.sku) || safeString(a.id) || safeString(a.name);
        const bk = safeString(b.sku) || safeString(b.id) || safeString(b.name);
        return ak.localeCompare(bk);
    });
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
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("DB_SERVICE_KEY"); // tu secreto

        if (!TOKEN || !CATALOG || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error(
                "Missing secrets (FACEBOOK_ACCESS_TOKEN, FACEBOOK_CATALOG_ID, SUPABASE_URL, DB_SERVICE_KEY)",
            );
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Payload soporta record/new/data.record/data.new
        const payload = await req.json().catch(() => ({}));
        const record: ProductRecord | undefined =
            payload?.record ?? payload?.new ?? payload?.data?.record ?? payload?.data?.new;

        if (!record || !record.id || !record.name) {
            throw new Error("No valid product 'record' found in payload");
        }

        console.log(`🔄 Sincronizando producto: ${record.name} (${record.id})`);

        // categoría (opcional)
        let categoryName = "Sin categoría";
        if (record.category_id) {
            const { data: category, error } = await supabase
                .from("categories")
                .select("name")
                .eq("id", record.category_id)
                .single();

            if (!error && category?.name) categoryName = category.name;
        }
        console.log(`📁 Categoría final: ${categoryName}`);

        // Normalizar imágenes del producto (record.images)
        const rawImages = (record.images ?? []).filter((x) => typeof x === "string");

        const allImages = rawImages
            .map((u) => normalizeImageUrl(u, SUPABASE_URL))
            .filter((u) => isValidHttpsUrl(u))
            .filter((u, idx, self) => self.indexOf(u) === idx);

        console.log(`📸 Total de imágenes únicas HTTPS (record.images): ${allImages.length}`);

        if (allImages.length === 0) {
            throw new Error("Producto sin imágenes HTTPS válidas en record.images");
        }

        const mainImage = allImages[0];
        const additionalImages = allImages.slice(1, 20);

        const baseUrl = `${SITE}/producto/${record.id}`;
        const baseCondition = safeString(record.condition, "new");
        const baseBrand = safeString(record.brand, "Generico");

        // Base data para Meta
        const makeBaseData = () => {
            const data: Record<string, unknown> = {
                name: record.name,
                description: safeString(record.description, record.name),
                condition: baseCondition,
                currency: "COP",
                url: baseUrl,
                brand: baseBrand,
                product_type: categoryName,
            };

            if (record.google_product_category) data.category = String(record.google_product_category);
            if (record.gender) data.gender = record.gender;
            if (record.age_group) data.age_group = record.age_group;
            if (record.age_group) data.age_group = record.age_group;
            if (record.material) data.material = record.material;
            // Colecciones Automáticas (Shopify style)
            if (record.custom_label_0) data.custom_label_0 = record.custom_label_0;

            return data;
        };

        // --- MODO SHOPIFY: SIEMPRE ENVIAR PRODUCTO PADRE ---
        const variantsAreReal = hasRealVariants(record.variants);
        const requests: Array<Record<string, unknown>> = [];

        // 🔴 CRÍTICO: SIEMPRE crear producto padre primero
        console.log(`🏗️  Creando producto PADRE con retailer_id = ${record.id}`);

        const parentStock = record.stock ?? 0;
        const parentAvailability = parentStock > 0 ? "in stock" : "out of stock";

        const parentData = makeBaseData();
        parentData.id = String(record.id);  // ID del producto padre
        parentData.item_group_id = String(record.id);  // Se agrupa consigo mismo
        parentData.image_url = mainImage;
        parentData.price = toCents(record.price);
        parentData.availability = parentAvailability;

        // Agregar imágenes adicionales para galería
        if (additionalImages.length > 0) {
            parentData.additional_image_urls = additionalImages;
        }

        // Sale price del padre
        if (
            typeof record.offer_price === "number" &&
            record.offer_price > 0 &&
            record.offer_price < record.price
        ) {
            parentData.sale_price = toCents(record.offer_price);
        }

        // 🔴 PRODUCTO PADRE (siempre se envía)
        requests.push({
            method: "UPDATE",
            retailer_id: String(record.id),  // ✅ ID del producto (sin sufijos)
            item_group_id: String(record.id),
            availability: parentAvailability,
            inventory: parentStock,
            google_product_category: record.google_product_category || '512',
            data: parentData
        });

        console.log(`✅ Producto padre creado: ${record.id}`);

        // 🟢 Si hay variantes REALES, crear variantes hijas
        if (variantsAreReal) {
            const variants = sortVariantsStable(record.variants!);
            console.log(`🔗 Creando ${variants.length} variantes HIJAS vinculadas al padre`);

            for (let i = 0; i < variants.length; i++) {
                const v = variants[i];

                const retailerId = safeString(v.id)
                    ? String(v.id)
                    : safeString(v.sku)
                        ? `${record.id}_sku_${v.sku}`
                        : `${record.id}_var_${i + 1}`;

                const vPrice = typeof v.price === "number" ? v.price : record.price;
                const vStock =
                    typeof v.stock === "number" ? v.stock : (record.stock ?? 0);

                const availability = vStock > 0 ? "in stock" : "out of stock";

                // Imagen por variante:
                // 1) si v.image_url es https => usarla
                // 2) si v.image_url es blob o inválida => usar allImages[i] (por índice)
                // 3) fallback a mainImage
                let candidate = "";
                const vImgNorm = normalizeImageUrl(safeString(v.image_url, ""), SUPABASE_URL);
                if (isValidHttpsUrl(vImgNorm)) {
                    candidate = vImgNorm;
                } else {
                    candidate = allImages[i] ?? mainImage;
                }

                const data = makeBaseData();

                data.id = retailerId;  // ✅ ID de la variante
                data.item_group_id = String(record.id);  // ✅ Referencia al padre
                data.name = `${record.name} - ${safeString(v.name, `Variante ${i + 1}`)}`;
                data.image_url = candidate;
                data.price = toCents(vPrice);
                data.availability = availability;

                // 🔴 CRÍTICO: retailer_product_group_id vincula al padre
                data.retailer_product_group_id = String(record.id);

                // Diferenciadores (obligatorios para agrupar)
                const color = safeString(v.color, safeString(v.name, `Variante ${i + 1}`));
                data.color = color;
                if (v.size) data.size = v.size;
                if (v.material) data.material = v.material;

                // Sale price
                if (
                    typeof v.offer_price === "number" &&
                    v.offer_price > 0 &&
                    v.offer_price < vPrice
                ) {
                    data.sale_price = toCents(v.offer_price);
                } else if (
                    typeof record.offer_price === "number" &&
                    record.offer_price > 0 &&
                    record.offer_price < vPrice
                ) {
                    data.sale_price = toCents(record.offer_price);
                }

                console.log(`  📸 Variante ${retailerId} -> ${candidate} (color: ${color})`);

                // 🟢 VARIANTE HIJA
                const variantRequest: Record<string, unknown> = {
                    method: "UPDATE",
                    retailer_id: retailerId,  // ✅ ID único de la variante
                    item_group_id: String(record.id),  // ✅ Vinculada al padre
                    availability: availability,
                    inventory: vStock,
                    google_product_category: record.google_product_category || '512',
                    data: data
                };

                // Solo agregar style si tiene valor real
                if (v.style && v.style.trim() !== '') {
                    variantRequest.style = v.style;
                }

                requests.push(variantRequest);
            }
        } else {
            // ✅ Sin variantes: solo el producto padre (ya creado arriba)
            console.log(`🧩 Producto sin variantes: solo padre con ${allImages.length} imágenes`);
        }

        console.log(`📋 Enviando ${requests.length} requests al catálogo ${CATALOG}`);

        const res = await fetch(`https://graph.facebook.com/v21.0/${CATALOG}/batch`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                allow_upsert: true,
                requests,
            }),
        });

        const fb = await res.json().catch(() => ({}));
        console.log(`📤 Respuesta Facebook:`, JSON.stringify(fb, null, 2));

        if (!res.ok) {
            throw new Error(`Facebook Error: ${JSON.stringify(fb)}`);
        }

        const handle = Array.isArray(fb?.handles) ? fb.handles[0] : null;

        return new Response(
            JSON.stringify({
                success: true,
                mode: variantsAreReal ? "variants_shopify" : "single_with_images",
                handle,
                requests_sent: requests.length,
                images_count: allImages.length,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    } catch (err) {
        console.error("❌ Error General:", err);
        return new Response(
            JSON.stringify({ success: false, error: err?.message ?? String(err) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});