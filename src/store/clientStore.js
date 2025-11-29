import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useClientStore = create(
  persist(
    (set) => ({
      user: null,             // logged-in client user
      isAuthenticated: false, // true if user is logged in

      // --- actions ---
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Update user profile (merge with existing data)
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "client-store", // key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for cross-tab persistence
    }
  )
);