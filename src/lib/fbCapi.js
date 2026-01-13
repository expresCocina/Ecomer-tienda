/**
 * Facebook Conversions API Helper
 * Envía eventos al servidor de Facebook a través de Supabase Edge Function
 */

import { supabase } from './supabase';

/**
 * Envía evento a Facebook Conversions API vía Edge Function
 * @param {string} eventName - Nombre del evento (ViewContent, AddToCart, etc.)
 * @param {Object} eventData - Datos del evento
 * @param {string} eventId - ID único para deduplicación
 */
export const sendToFacebookCAPI = async (eventName, eventData, eventId) => {
    try {
        // Obtener datos del usuario
        const userData = {
            event_source_url: window.location.href,
            client_ip_address: await getClientIP(),
            client_user_agent: navigator.userAgent,
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc')
        };

        // Llamar a Edge Function de Supabase
        const { data, error } = await supabase.functions.invoke('facebook-capi', {
            body: {
                eventName,
                eventData,
                eventId,
                userData
            }
        });

        if (error) {
            console.error('❌ CAPI error:', error);
            return null;
        }

        console.log('✅ CAPI event sent:', eventName, data);
        return data;
    } catch (error) {
        console.error('❌ CAPI error:', error);
        // No bloquear la UI si falla CAPI
        return null;
    }
};

/**
 * Obtiene la IP del cliente
 */
const getClientIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return null;
    }
};

/**
 * Obtiene una cookie por nombre
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * Track ViewContent via CAPI
 */
export const capiViewContent = async (product, eventId) => {
    return sendToFacebookCAPI('ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.offer_price || product.price,
        currency: 'COP'
    }, eventId);
};

/**
 * Track AddToCart via CAPI
 */
export const capiAddToCart = async (product, quantity, eventId) => {
    const value = (product.offer_price || product.price) * quantity;

    return sendToFacebookCAPI('AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: value,
        currency: 'COP',
        num_items: quantity
    }, eventId);
};

/**
 * Track InitiateCheckout via CAPI
 */
export const capiInitiateCheckout = async (items, totalValue, eventId) => {
    return sendToFacebookCAPI('InitiateCheckout', {
        content_ids: items.map(item => item.id),
        contents: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            item_price: item.offer_price || item.price
        })),
        value: totalValue,
        currency: 'COP',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0)
    }, eventId);
};

/**
 * Track Purchase via CAPI
 */
export const capiPurchase = async (orderData, eventId) => {
    return sendToFacebookCAPI('Purchase', {
        content_ids: orderData.items.map(item => item.product_id),
        contents: orderData.items.map(item => ({
            id: item.product_id,
            quantity: item.quantity,
            item_price: item.price
        })),
        value: orderData.total,
        currency: 'COP',
        num_items: orderData.items.reduce((sum, item) => sum + item.quantity, 0)
    }, eventId);
};
