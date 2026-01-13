import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const FACEBOOK_PIXEL_ID = '734516679726171'
const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { eventName, eventData, eventId, userData } = await req.json()

        if (!FACEBOOK_ACCESS_TOKEN) {
            throw new Error('FACEBOOK_ACCESS_TOKEN not configured')
        }

        // Enviar a Facebook CAPI
        const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`

        const payload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: userData.event_source_url,
                action_source: 'website',
                user_data: {
                    client_ip_address: userData.client_ip_address,
                    client_user_agent: userData.client_user_agent,
                    fbp: userData.fbp,
                    fbc: userData.fbc
                },
                custom_data: eventData
            }],
            access_token: FACEBOOK_ACCESS_TOKEN
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()

        return new Response(
            JSON.stringify({ success: true, result }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error) {
        console.error('CAPI Error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
