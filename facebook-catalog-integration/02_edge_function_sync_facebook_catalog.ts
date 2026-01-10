import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
        const SITE = Deno.env.get("SITE_URL");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!TOKEN || !CATALOG || !SITE) {
            throw new Error("Missing secrets");
        }

        const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
        const { record } = await req.json();

        const { data: product } = await supabase
            .from("products")
            .select("*")
            .eq("id", record.id)
            .single();

        if (!product) throw new Error("Product not found");

        const data = {
            retailer_id: product.id,
            name: product.name,
            description: product.description || product.name,
            availability: product.stock > 0 ? "in stock" : "out of stock",
            condition: "new",
            price: product.price + " COP",
            image_url: product.images?.[0] || "",
            url: SITE + "/producto/" + product.id,
            brand: product.brand || "AMC",
        };

        const res = await fetch(
            "https://graph.facebook.com/v21.0/" + CATALOG + "/products",
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
            console.error("FB error:", fb);
            throw new Error(JSON.stringify(fb));
        }

        await supabase
            .from("products")
            .update({
                facebook_product_id: fb.id,
                synced_to_facebook: true,
                last_facebook_sync: new Date().toISOString(),
            })
            .eq("id", product.id);

        return new Response(
            JSON.stringify({ success: true, fb }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: corsHeaders }
        );
    }
});
