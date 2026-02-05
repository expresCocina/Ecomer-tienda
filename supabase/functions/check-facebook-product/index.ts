import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge Function para consultar un producto en Facebook y ver sus datos reales
 * Esto nos permite verificar qué datos tiene Facebook, sin depender del caché de Commerce Manager
 */
serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
        const CATALOG = Deno.env.get("FACEBOOK_CATALOG_ID");

        if (!TOKEN || !CATALOG) {
            throw new Error("Missing Facebook credentials");
        }

        // Obtener producto_id de la query string
        const url = new URL(req.url);
        const retailer_id = url.searchParams.get("retailer_id");

        if (!retailer_id) {
            return new Response(
                JSON.stringify({ error: "Missing retailer_id parameter" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
            );
        }

        console.log(`🔍 Consultando producto con retailer_id: ${retailer_id}`);

        // Consultar el producto en Facebook
        const res = await fetch(
            `https://graph.facebook.com/v21.0/${CATALOG}/products?filter={"retailer_id":{"eq":"${retailer_id}"}}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + TOKEN,
                },
            }
        );

        const data = await res.json();

        if (!res.ok) {
            console.error("❌ Error de Facebook:", data);
            throw new Error(JSON.stringify(data));
        }

        console.log("✅ Datos recibidos de Facebook:", JSON.stringify(data, null, 2));

        return new Response(
            JSON.stringify(data, null, 2),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (err) {
        console.error("❌ Error:", err);
        return new Response(
            JSON.stringify({ error: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
