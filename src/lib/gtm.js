/**
 * Utilidades para Google Tag Manager
 * Permite enviar eventos personalizados al dataLayer
 */

/**
 * Envía un evento al dataLayer de GTM
 * @param {string} event - Nombre del evento
 * @param {object} data - Datos adicionales del evento
 */
export const gtmEvent = (event, data = {}) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event,
            ...data
        });
    }
};

/**
 * Eventos predefinidos para e-commerce
 */
export const GTMEvents = {
    // Eventos de producto
    viewProduct: (product) => {
        gtmEvent('view_item', {
            ecommerce: {
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    item_category: product.category,
                    item_brand: product.brand || 'C&J Relojería'
                }]
            }
        });
    },

    addToCart: (product, quantity = 1) => {
        gtmEvent('add_to_cart', {
            ecommerce: {
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    quantity: quantity,
                    item_category: product.category,
                    item_brand: product.brand || 'C&J Relojería'
                }]
            }
        });
    },

    removeFromCart: (product, quantity = 1) => {
        gtmEvent('remove_from_cart', {
            ecommerce: {
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    quantity: quantity
                }]
            }
        });
    },

    beginCheckout: (items, value) => {
        gtmEvent('begin_checkout', {
            ecommerce: {
                items: items.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                value: value
            }
        });
    },

    purchase: (orderId, items, value) => {
        gtmEvent('purchase', {
            ecommerce: {
                transaction_id: orderId,
                value: value,
                currency: 'COP',
                items: items.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            }
        });
    },

    // Eventos de navegación
    pageView: (pageName, pageUrl) => {
        gtmEvent('page_view', {
            page_name: pageName,
            page_url: pageUrl
        });
    },

    // Eventos de interacción
    clickWhatsApp: () => {
        gtmEvent('click_whatsapp', {
            event_category: 'engagement',
            event_label: 'WhatsApp Widget'
        });
    },

    submitContactForm: () => {
        gtmEvent('submit_contact_form', {
            event_category: 'engagement',
            event_label: 'Contact Form'
        });
    },

    search: (searchTerm) => {
        gtmEvent('search', {
            search_term: searchTerm
        });
    },

    // Eventos de ofertas
    viewPromotion: (promotionName) => {
        gtmEvent('view_promotion', {
            promotion_name: promotionName
        });
    }
};
