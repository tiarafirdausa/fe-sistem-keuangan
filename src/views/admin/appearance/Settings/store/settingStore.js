// src/views/admin/appearance/Settings/store/settingsStore.js
import { create } from 'zustand';

const useSettingsStore = create((set) => ({
    settings: {},
    isLoading: true,
    error: null,
    setSettings: (settings) => set({ settings, isLoading: false, error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
}));

export default useSettingsStore;