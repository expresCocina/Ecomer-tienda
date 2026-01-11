import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackAddToCart } from '../lib/fbPixel';
import { capiAddToCart } from '../lib/fbCapi';

/**
 * Store del carrito de compras con persistencia en localStorage
 */
export const useCartStore = create(
    persist(
        (set, get) => ({
            // Estado
            items: [],
            isOpen: false,

            // Acciones

            /**
             * Añade un producto al carrito
             * Si ya existe, incrementa la cantidad
             */
            addItem: (product, quantity = 1) => {
                // Track AddToCart event (Pixel + CAPI)
                const eventId = trackAddToCart(product, quantity);
                capiAddToCart(product, quantity, eventId);

                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                name: product.name,
                                price: product.offer_price || product.price,
                                image: product.images?.[0] || null,
                                quantity,
                                product_id: product.id,
                            },
                        ],
                    };
                });
            },

            /**
             * Remueve un producto del carrito
             */
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },

            /**
             * Actualiza la cantidad de un producto
             */
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },

            /**
             * Incrementa la cantidad de un producto
             */
            incrementQuantity: (productId) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                }));
            },

            /**
             * Decrementa la cantidad de un producto
             */
            decrementQuantity: (productId) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId
                            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                            : item
                    ),
                }));
            },

            /**
             * Limpia el carrito
             */
            clearCart: () => {
                set({ items: [] });
            },

            /**
             * Abre el sidebar del carrito
             */
            openCart: () => {
                set({ isOpen: true });
            },

            /**
             * Cierra el sidebar del carrito
             */
            closeCart: () => {
                set({ isOpen: false });
            },

            /**
             * Toggle del sidebar
             */
            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },
        }),
        {
            name: 'cart-storage', // Nombre de la key en localStorage
            partialize: (state) => ({ items: state.items }), // Solo persistir items, no isOpen
        }
    )
);

// Selectores para usar fuera del store
export const selectTotalItems = (state) =>
    state.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0);
