import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,            // logged-in admin user
      isAuthenticated: false,  // true if admin is logged in

      // --- actions ---
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      
      // Update admin profile (merge with existing data)
      updateAdmin: (updates) => set((state) => ({
        admin: state.admin ? { ...state.admin, ...updates } : null
      })),
      
      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    {
      name: "admin-store", // key in sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);
