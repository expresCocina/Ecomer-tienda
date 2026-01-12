import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Configuración y Claves
        const FB_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
        // Usamos Service Role Key para poder leer/borrar de la tabla de cola sin restricciones RLS
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!FB_TOKEN) throw new Error("Missing FACEBOOK_ACCESS_TOKEN");
        if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
        if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        console.log("🔄 Iniciando proceso de eliminación en lote...");

        // 2. Obtener items de la cola (Límite 50 para no exceder timeouts)
        const { data: queueItems, error: queueError } = await supabase
            .from("facebook_delete_queue")
            .select("*")
            .limit(50);

        if (queueError) throw queueError;

        if (!queueItems || queueItems.length === 0) {
            console.log("✨ No hay productos para eliminar en la cola.");
            return new Response(
                JSON.stringify({ message: "Queue is empty" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`📋 Procesando ${queueItems.length} items de la cola...`);
        const results = [];

        // 3. Procesar cada item
        for (const item of queueItems) {
            try {
                const fbId = item.facebook_product_id;
                console.log(`🗑️ Eliminando ID Facebook: ${fbId}`);

                // Llamada a Facebook Graph API
                const fbRes = await fetch(
                    `https://graph.facebook.com/v21.0/${fbId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${FB_TOKEN}`,
                        },
                    }
                );

                // Si es 200 OK o 400/404 (ya no existe), lo marcamos como éxito para sacarlo de la cola
                // Un error 404 significa que ya se borró, así que clean up.
                const isSuccess = fbRes.ok || fbRes.status === 404 || fbRes.status === 400;

                if (isSuccess) {
                    // Borrar de la cola
                    await supabase
                        .from("facebook_delete_queue")
                        .delete()
                        .eq("id", item.id);

                    results.push({ id: item.id, fbId, status: "deleted" });
                } else {
                    const errorJson = await fbRes.json();
                    console.error(`❌ Error FB para ${fbId}:`, errorJson);

                    // ESCRIBIR ERROR EN DB PARA DIAGNÓSTICO
                    await supabase.from("debug_sync_log").insert({
                        msg: `Error borrando ${fbId}: ${JSON.stringify(errorJson)}`
                    });

                    results.push({ id: item.id, fbId, status: "error", error: errorJson });
                }

            } catch (err) {
                console.error(`❌ Error procesando item ${item.id}:`, err);
                results.push({ id: item.id, status: "error", error: err.message });
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                processed: results.length,
                details: results
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
