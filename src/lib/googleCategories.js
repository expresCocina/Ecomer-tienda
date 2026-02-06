/**
 * Lista de categorías oficiales de Google Product Taxonomy
 * Fuente: https://support.google.com/merchants/answer/6324436
 * 
 * Esta es una lista reducida de las categorías más comunes.
 * Para la lista completa, visita: https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */

export const googleCategories = [
    // Apparel & Accessories
    "Apparel & Accessories",
    "Apparel & Accessories > Clothing",
    "Apparel & Accessories > Clothing > Activewear",
    "Apparel & Accessories > Clothing > Dresses",
    "Apparel & Accessories > Clothing > Outerwear",
    "Apparel & Accessories > Clothing > Pants",
    "Apparel & Accessories > Clothing > Shirts & Tops",
    "Apparel & Accessories > Clothing > Shorts",
    "Apparel & Accessories > Clothing > Skirts",
    "Apparel & Accessories > Clothing > Suits",
    "Apparel & Accessories > Clothing > Swimwear",
    "Apparel & Accessories > Clothing > Underwear & Socks",

    // Jewelry
    "Apparel & Accessories > Jewelry",
    "Apparel & Accessories > Jewelry > Bracelets",
    "Apparel & Accessories > Jewelry > Earrings",
    "Apparel & Accessories > Jewelry > Necklaces",
    "Apparel & Accessories > Jewelry > Rings",
    "Apparel & Accessories > Jewelry > Watches",

    // Shoes
    "Apparel & Accessories > Shoes",
    "Apparel & Accessories > Shoes > Athletic Shoes",
    "Apparel & Accessories > Shoes > Boots",
    "Apparel & Accessories > Shoes > Dress Shoes",
    "Apparel & Accessories > Shoes > Sandals",
    "Apparel & Accessories > Shoes > Sneakers",

    // Electronics
    "Electronics",
    "Electronics > Audio",
    "Electronics > Audio > Headphones",
    "Electronics > Audio > Speakers",
    "Electronics > Cameras & Optics",
    "Electronics > Cameras & Optics > Cameras",
    "Electronics > Computers",
    "Electronics > Computers > Desktops",
    "Electronics > Computers > Laptops",
    "Electronics > Computers > Tablets",
    "Electronics > Electronics Accessories",
    "Electronics > Electronics Accessories > Cables",
    "Electronics > Electronics Accessories > Chargers",
    "Electronics > Video Game Consoles",

    // Home & Garden
    "Home & Garden",
    "Home & Garden > Decor",
    "Home & Garden > Furniture",
    "Home & Garden > Furniture > Beds & Accessories",
    "Home & Garden > Furniture > Chairs",
    "Home & Garden > Furniture > Sofas",
    "Home & Garden > Furniture > Tables",
    "Home & Garden > Kitchen & Dining",
    "Home & Garden > Lighting",

    // Sports & Outdoors
    "Sporting Goods",
    "Sporting Goods > Athletics",
    "Sporting Goods > Exercise & Fitness",
    "Sporting Goods > Outdoor Recreation",

    // Toys & Games
    "Toys & Games",
    "Toys & Games > Games",
    "Toys & Games > Toys",

    // Health & Beauty
    "Health & Beauty",
    "Health & Beauty > Personal Care",
    "Health & Beauty > Personal Care > Cosmetics",
    "Health & Beauty > Personal Care > Hair Care",
    "Health & Beauty > Personal Care > Skin Care",

    // Office Supplies
    "Office Supplies",
    "Office Supplies > Office Equipment",
    "Office Supplies > Office Instruments",
    "Office Supplies > Paper Products",

    // Baby & Toddler
    "Baby & Toddler",
    "Baby & Toddler > Baby Safety",
    "Baby & Toddler > Baby Toys & Activity Equipment",
    "Baby & Toddler > Baby Transport",
    "Baby & Toddler > Diapering",

    // Arts & Entertainment
    "Arts & Entertainment",
    "Arts & Entertainment > Hobbies & Creative Arts",
    "Arts & Entertainment > Musical Instruments",

    // Food, Beverages & Tobacco
    "Food, Beverages & Tobacco",
    "Food, Beverages & Tobacco > Beverages",
    "Food, Beverages & Tobacco > Food Items",
];

/**
 * Buscar categorías que coincidan con el query
 * @param {string} query - Texto de búsqueda
 * @returns {string[]} - Array de categorías que coinciden
 */
export const searchCategories = (query) => {
    if (!query || query.trim() === '') {
        return googleCategories.slice(0, 10);
    }

    const lowerQuery = query.toLowerCase();
    return googleCategories
        .filter(cat => cat.toLowerCase().includes(lowerQuery))
        .slice(0, 10);
};

/**
 * Obtener categorías por nivel
 * @param {number} level - Nivel de categoría (1, 2, 3)
 * @returns {string[]} - Array de categorías del nivel especificado
 */
export const getCategoriesByLevel = (level) => {
    return googleCategories.filter(cat => {
        const parts = cat.split(' > ');
        return parts.length === level;
    });
};
