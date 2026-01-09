import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * Store de autenticación
 */
export const useAuthStore = create((set, get) => ({
    // Estado
    user: null,
    profile: null,
    loading: true,
    error: null,

    // Acciones

    /**
     * Inicializa la sesión del usuario
     */
    initialize: async () => {
        try {
            set({ loading: true });

            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Obtener perfil del usuario
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({
                    user: session.user,
                    profile,
                    loading: false,
                });
            } else {
                set({ user: null, profile: null, loading: false });
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            set({ loading: false, error: error.message });
        }
    },

    /**
     * Inicia sesión
     */
    signIn: async (email, password) => {
        try {
            set({ loading: true, error: null });

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Obtener perfil
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            set({
                user: data.user,
                profile,
                loading: false,
            });

            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    /**
     * Cierra sesión
     */
    signOut: async () => {
        try {
            await supabase.auth.signOut();
            set({ user: null, profile: null });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    },

    /**
     * Registra un nuevo usuario
     */
    signUp: async (email, password) => {
        try {
            set({ loading: true, error: null });

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },
}));

// Selectores
export const selectUser = (state) => state.user;
export const selectIsAdmin = (state) => state.profile?.role === 'admin';
export const selectIsAuthenticated = (state) => !!state.user;
