/**
 * Facebook Pixel Helper con Generador de Parámetros
 * Funciones para trackear eventos en Facebook Pixel con soporte para fbc y fbp
 */

/**
 * Obtiene el valor de la cookie _fbc (Facebook Click ID)
 * Esta cookie se crea cuando un usuario hace clic en un anuncio de Facebook
 */
export const getFbc = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;

    try {
        const fbcCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('_fbc='));

        return fbcCookie ? fbcCookie.split('=')[1] : null;
    } catch (error) {
        console.error('Error getting fbc:', error);
        return null;
    }
};

/**
 * Obtiene el valor de la cookie _fbp (Facebook Browser ID)
 * Esta cookie identifica de forma única al navegador del usuario
 */
export const getFbp = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;

    try {
        const fbpCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('_fbp='));

        return fbpCookie ? fbpCookie.split('=')[1] : null;
    } catch (error) {
        console.error('Error getting fbp:', error);
        return null;
    }
};

/**
 * Genera un event_id único para deduplicación entre Pixel y CAPI
 */
export const generateEventId = () => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Obtiene datos de usuario para Advanced Matching
 * @param {Object} userData - Datos opcionales del usuario
 */
const getUserData = (userData = {}) => {
    const data = {};

    if (userData.email) data.em = userData.email;
    if (userData.phone) data.ph = userData.phone;
    if (userData.firstName) data.fn = userData.firstName;
    if (userData.lastName) data.ln = userData.lastName;
    if (userData.city) data.ct = userData.city;
    if (userData.state) data.st = userData.state;
    if (userData.zipCode) data.zp = userData.zipCode;
    if (userData.country) data.country = userData.country;

    return data;
};

/**
 * Track ViewContent event
 * @param {Object} product - Producto visualizado
 */
export const trackViewContent = (product) => {
    if (typeof window.fbq === 'undefined') return;

    const eventId = generateEventId();

    window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.offer_price || product.price,
        currency: 'COP'
    }, { eventID: eventId });

    return eventId;
};

/**
 * Track AddToCart event
 * @param {Object} product - Producto agregado
 * @param {number} quantity - Cantidad
 */
export const trackAddToCart = (product, quantity = 1) => {
    if (typeof window.fbq === 'undefined') return;

    const eventId = generateEventId();
    const value = (product.offer_price || product.price) * quantity;

    window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: value,
        currency: 'COP',
        num_items: quantity
    }, { eventID: eventId });

    return eventId;
};

/**
 * Track InitiateCheckout event
 * @param {Array} items - Items en el carrito
 * @param {number} totalValue - Valor total
 */
export const trackInitiateCheckout = (items, totalValue) => {
    if (typeof window.fbq === 'undefined') return;

    const eventId = generateEventId();

    window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(item => item.id),
        contents: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            item_price: item.offer_price || item.price
        })),
        value: totalValue,
        currency: 'COP',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0)
    }, { eventID: eventId });

    return eventId;
};

/**
 * Track Purchase event
 * @param {Object} orderData - Datos de la orden
 */
export const trackPurchase = (orderData) => {
    if (typeof window.fbq === 'undefined') return;

    const eventId = generateEventId();

    window.fbq('track', 'Purchase', {
        content_ids: orderData.items.map(item => item.product_id),
        contents: orderData.items.map(item => ({
            id: item.product_id,
            quantity: item.quantity,
            item_price: item.price
        })),
        value: orderData.total,
        currency: 'COP',
        num_items: orderData.items.reduce((sum, item) => sum + item.quantity, 0)
    }, { eventID: eventId });

    return eventId;
};

/**
 * Track Search event
 * @param {string} searchQuery - Término de búsqueda
 */
export const trackSearch = (searchQuery) => {
    if (typeof window.fbq === 'undefined') return;

    const eventId = generateEventId();

    window.fbq('track', 'Search', {
        search_string: searchQuery
    }, { eventID: eventId });

    return eventId;
};
