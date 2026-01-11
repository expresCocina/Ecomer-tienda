/**
 * Facebook Conversions API Helper
 * Envía eventos al servidor de Facebook para tracking server-side
 */

const FACEBOOK_PIXEL_ID = '734516679726171';
const FACEBOOK_ACCESS_TOKEN = 'EAALK7sFGisIBQS6IorZBEaZCauwY7fIzhRJpWJt5uNdH4PGiZCvQg99ZAZAMPxxCXzZCopidrNZCKIppXq2DwZBpihla6BABWZCoxsHRdwukwA1hm5nmbcqnZArBD4BGF38ZBrtyQLrlXG9RyGX6qcrbqZB6FoRjtmnuHsgC0kAwRUjpope3inKfL3NvjUioHIDjNTXmOAZDZD';

/**
 * Envía evento a Facebook Conversions API
 * @param {string} eventName - Nombre del evento (ViewContent, AddToCart, etc.)
 * @param {Object} eventData - Datos del evento
 * @param {string} eventId - ID único para deduplicación
 */
export const sendToFacebookCAPI = async (eventName, eventData, eventId) => {
    try {
        const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`;

        const payload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: window.location.href,
                action_source: 'website',
                user_data: {
                    client_ip_address: await getClientIP(),
                    client_user_agent: navigator.userAgent,
                    fbp: getCookie('_fbp'),
                    fbc: getCookie('_fbc')
                },
                custom_data: eventData
            }],
            access_token: FACEBOOK_ACCESS_TOKEN
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`CAPI error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ CAPI event sent:', eventName, result);
        return result;
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
