/**
 * Formatea un número como precio con moneda
 * @param {number} price - Precio
 * @param {string} currency - Código de moneda (USD, COP, etc.)
 * @returns {string} Precio formateado
 */
export const formatPrice = (price, currency = 'USD') => {
    const currencySymbols = {
        USD: '$',
        COP: '$',
        EUR: '€',
        MXN: '$'
    };

    const symbol = currencySymbols[currency] || currency;

    if (currency === 'COP') {
        // Para pesos colombianos, sin decimales
        return `${symbol}${Math.round(price).toLocaleString('es-CO')}`;
    }

    return `${symbol}${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Calcula el descuento porcentual
 * @param {number} originalPrice - Precio original
 * @param {number} offerPrice - Precio con oferta
 * @returns {number} Porcentaje de descuento
 */
export const calculateDiscount = (originalPrice, offerPrice) => {
    if (!offerPrice || offerPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
};

/**
 * Formatea una fecha
 * @param {string|Date} date - Fecha
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formatea una fecha y hora
 * @param {string|Date} date - Fecha
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Genera un slug a partir de un texto
 * @param {string} text - Texto
 * @returns {string} Slug
 */
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

/**
 * Valida un email
 * @param {string} email - Email
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Genera un rating visual con estrellas
 * @param {number} rating - Rating (0-5)
 * @returns {string} Estrellas
 */
export const generateStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

/**
 * Clase helper para construir nombres de clase condicionales
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
