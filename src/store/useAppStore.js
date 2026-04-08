import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAppStore = create(
    persist(
        (set, get) => ({
            // --- Auth State ---
            user: null,
            profile: null,
            isAdminMode: false,
            loading: true,

            setLoading: (loading) => set({ loading }),
            setAdminMode: (value) => set({ isAdminMode: !!value }),

            login: (userData) => {
                set({
                    user: userData,
                    profile: userData,
                    loading: false
                });
            },

            logout: () => {
                set({
                    user: null,
                    profile: null,
                    loading: false
                });
            },

            refreshProfile: () => {
                // In a real app, this might fetch from an API
                // For now, we keep the existing logic of keeping it in sync with state/storage
                const currentProfile = get().profile;
                set({ profile: currentProfile });
            },

            updateProfile: (newData) => {
                set((state) => ({
                    profile: { ...state.profile, ...newData }
                }));
            },

            // --- Service State (Placeholder for global 'Service' state) ---
            services: [],
            selectedService: null,
            setServices: (services) => set({ services }),
            setSelectedService: (service) => set({ selectedService: service }),
            addService: (service) => set((state) => ({ services: [...state.services, service] })),
            removeService: (serviceId) => set((state) => ({
                services: state.services.filter(s => s.id !== serviceId)
            })),
        }),
        {
            name: 'app-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({ user: state.user, profile: state.profile, services: state.services, isAdminMode: state.isAdminMode }), // only persist these fields
            onRehydrateStorage: () => (state) => {
                state.setLoading(false);
            },
        }
    )
);

export default useAppStore;
