import { create } from 'zustand';

/**
 * Store para estado de la UI (modales, sidebar, etc.)
 */
export const useUIStore = create((set) => ({
    // Estado
    isMobileMenuOpen: false,
    isSearchOpen: false,

    // Acciones

    /**
     * Abre/cierra el menú móvil
     */
    toggleMobileMenu: () => {
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
    },

    /**
     * Cierra el menú móvil
     */
    closeMobileMenu: () => {
        set({ isMobileMenuOpen: false });
    },

    /**
     * Abre/cierra el modal de búsqueda
     */
    toggleSearch: () => {
        set((state) => ({ isSearchOpen: !state.isSearchOpen }));
    },

    /**
     * Cierra el modal de búsqueda
     */
    closeSearch: () => {
        set({ isSearchOpen: false });
    },
}));
