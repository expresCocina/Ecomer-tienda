import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// HELPERS PARA STORAGE
// ============================================

/**
 * Sube una imagen al bucket de productos
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta dentro del bucket (opcional)
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadProductImage = async (file, folder = 'products') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(data.path);

    return publicUrl;
};

/**
 * Elimina una imagen del bucket
 * @param {string} imageUrl - URL de la imagen
 */
export const deleteProductImage = async (imageUrl) => {
    // Extraer el path de la URL
    const urlParts = imageUrl.split('/products/');
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting image:', error);
    }
};

// ============================================
// HELPERS PARA PRODUCTOS
// ============================================

/**
 * Obtiene todos los productos
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<Array>} Lista de productos
 */
export const getProducts = async (filters = {}) => {
    let query = supabase
        .from('products')
        .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
        .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
    }

    if (filters.isOffer) {
        query = query.eq('is_offer', true);
    }

    if (filters.isFeatured) {
        query = query.eq('is_featured', true);
    }

    if (filters.showInCarousel) {
        query = query.eq('show_in_carousel', true);
    }

    if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
    }

    return data;
};

/**
 * Obtiene un producto por ID
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Producto
 */
export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(`Error fetching product: ${error.message}`);
    }

    return data;
};

/**
 * Obtiene productos relacionados (de la misma categoría)
 * @param {string} productId - ID del producto actual
 * @param {string} categoryId - ID de la categoría
 * @param {number} limit - Cantidad de productos a obtener
 * @returns {Promise<Array>} Lista de productos relacionados
 */
export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
    console.log('🔍 Buscando productos relacionados:', { productId, categoryId, limit });

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
        .eq('category_id', categoryId)
        .neq('id', productId) // Excluir el producto actual
        .limit(limit);

    if (error) {
        console.error('❌ Error fetching related products:', error);
        return [];
    }

    console.log('✅ Productos relacionados encontrados:', data);
    return data || [];
};

// ============================================
// HELPERS PARA CATEGORÍAS
// ============================================

/**
 * Obtiene todas las categorías
 * @returns {Promise<Array>} Lista de categorías
 */
export const getCategories = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
    }

    return data;
};

// ============================================
// HELPERS PARA PEDIDOS
// ============================================

/**
 * Crea un nuevo pedido
 * @param {Object} orderData - Datos del pedido
 * @param {Array} items - Items del pedido
 * @returns {Promise<Object>} Pedido creado
 */
export const createOrder = async (orderData, items) => {
    // Crear el pedido
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

    if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Crear los items del pedido
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    return order;
};

/**
 * Obtiene todos los pedidos
 * @returns {Promise<Array>} Lista de pedidos
 */
export const getOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        *
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
    }

    return data;
};

/**
 * Actualiza el estado de un pedido y resta el stock si se marca como entregado
 * @param {string} orderId - ID del pedido
 * @param {string} status - Nuevo estado
 * @param {Array} items - Items del pedido (para restar stock)
 */
export const updateOrderStatus = async (orderId, status, items) => {
    // Actualizar estado del pedido
    const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (orderError) {
        throw new Error(`Error updating order: ${orderError.message}`);
    }

    // Si se marca como entregado, restar stock
    if (status === 'delivered') {
        for (const item of items) {
            if (item.product_id) {
                // Obtener el stock actual
                const { data: product, error: fetchError } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single();

                if (fetchError) continue;

                // Restar el stock
                const newStock = Math.max(0, product.stock - item.quantity);

                await supabase
                    .from('products')
                    .update({ stock: newStock })
                    .eq('id', item.product_id);
            }
        }
    }
};

// ============================================
// HELPERS PARA CONFIGURACIÓN
// ============================================

/**
 * Obtiene la configuración del negocio
 * @returns {Promise<Object>} Configuración
 */
export const getSettings = async () => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error fetching settings: ${error.message}`);
    }

    return data;
};

// ============================================
// HELPERS PARA AUTENTICACIÓN
// ============================================

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>} Perfil del usuario
 */
export const getCurrentUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
    }

    return data;
};

/**
 * Verifica si el usuario es admin
 * @returns {Promise<boolean>} True si es admin
 */
export const isAdmin = async () => {
    const profile = await getCurrentUserProfile();
    return profile?.role === 'admin';
};

// ============================================
// HELPERS PARA RESEÑAS
// ============================================

/**
 * Obtiene todas las reseñas de un producto
 * @param {string} productId - ID del producto
 * @returns {Promise<Array>} Lista de reseñas
 */
export const getProductReviews = async (productId) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching reviews: ${error.message}`);
    }

    return data;
};

/**
 * Crea una nueva reseña
 * @param {Object} reviewData - Datos de la reseña
 * @returns {Promise<Object>} Reseña creada
 */
export const createReview = async (reviewData) => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

    if (error) {
        throw new Error(`Error creating review: ${error.message}`);
    }

    return data;
};

