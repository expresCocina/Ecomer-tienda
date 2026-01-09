import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * Store de configuración del negocio
 */
export const useSettingsStore = create((set) => ({
    settings: null,
    loading: false,

    // Cargar configuración
    loadSettings: async () => {
        try {
            set({ loading: true });
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            set({ settings: data, loading: false });
            return data;
        } catch (error) {
            console.error('Error loading settings:', error);
            set({ loading: false });
            return null;
        }
    },
}));
