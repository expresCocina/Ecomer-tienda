import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para trackear la ubicación del usuario en tiempo real
 * Captura la ubicación por IP y actualiza en Supabase cada 2 minutos
 */
export const useLocationTracking = () => {
    const trackingRef = useRef(false);
    const sessionIdRef = useRef(null);

    useEffect(() => {
        // Generar o recuperar ID de sesión
        const getSessionId = () => {
            let sessionId = sessionStorage.getItem('session_id');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('session_id', sessionId);
            }
            return sessionId;
        };

        // Obtener ubicación por IP usando ipapi.co
        const trackLocation = async () => {
            if (trackingRef.current) return;
            trackingRef.current = true;

            try {
                sessionIdRef.current = getSessionId();

                // Llamar a API de geolocalización
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch location');

                const data = await response.json();

                // Guardar en Supabase
                const { error } = await supabase
                    .from('active_sessions')
                    .upsert({
                        session_id: sessionIdRef.current,
                        ip_address: data.ip || null,
                        country: data.country_name || null,
                        country_code: data.country_code || null,
                        city: data.city || null,
                        region: data.region || null,
                        latitude: data.latitude || null,
                        longitude: data.longitude || null,
                        timezone: data.timezone || null,
                        last_seen: new Date().toISOString()
                    }, {
                        onConflict: 'session_id'
                    });

                if (error) {
                    console.error('Error saving location:', error);
                }
            } catch (error) {
                console.error('Error tracking location:', error);
            } finally {
                trackingRef.current = false;
            }
        };

        // Trackear inmediatamente
        trackLocation();

        // Actualizar cada 2 minutos
        const interval = setInterval(trackLocation, 2 * 60 * 1000);

        // Limpiar al desmontar
        return () => {
            clearInterval(interval);
        };
    }, []);

    return sessionIdRef.current;
};
