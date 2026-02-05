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
        const SITE = Deno.env.get("SITE_URL") || "https://tu-sitio.com"; // Fallback para evitar crash
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("DB_SERVICE_KEY");

        if (!TOKEN || !CATALOG || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing secrets (TOKEN, CATALOG, URL, SERVICE_KEY)");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Obtenemos el payload del Webhook
        const payload = await req.json();
        const record = payload.record; // Supabase Webhook payload wrapper

        if (!record) {
            throw new Error("No 'record' found in payload");
        }

        console.log(`🔄 Sincronizando producto: ${record.name} (${record.id})`);

        // Obtener nombre de categoría si existe
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

        // Preparar datos para Facebook
        const data = {
            retailer_id: record.id,
            name: record.name,
            description: record.description || record.name,
            availability: record.stock > 0 ? "in stock" : "out of stock",
            condition: "new",
            // Facebook considera COP como "minor unit" (centavos). 
            // 95900 -> 959.00
            // Solución: Multiplicar por 100. 95900 * 100 = 9590000 -> 95900.00
            price: (Math.round(record.price * 100)).toString(),
            currency: "COP",
            image_url: record.images?.[0] || "",
            url: `${SITE}/producto/${record.id}`,
            brand: record.brand || "Generico",
            // NUEVO: Agregar categoría para Product Sets
            product_type: categoryName,
            // CORREGIDO: Enviar nombre de categoría en lugar de ID para que los conjuntos funcionen
            google_product_category: categoryName,
        };

        // Post a Facebook Graph API
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
            console.error("❌ Error en Facebook API:", fb);
            throw new Error(`Facebook Error: ${JSON.stringify(fb)}`);
        }

        console.log("✅ Éxito en Facebook. ID:", fb.id);

        // ACTUALIZACIÓN CRÍTICA: Guardar el ID de Facebook en Supabase
        const { error: updateError } = await supabase
            .from("products")
            .update({
                facebook_product_id: fb.id,
                synced_to_facebook: true,
                last_facebook_sync: new Date().toISOString(),
            })
            .eq("id", record.id);

        if (updateError) {
            console.error("❌ Error guardando ID en DB:", updateError);
            throw updateError;
        }

        return new Response(
            JSON.stringify({ success: true, fb_id: fb.id }),
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
