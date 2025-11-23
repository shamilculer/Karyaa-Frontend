import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set) => ({
      vendor: null,            // logged-in vendor user
      isAuthenticated: false,  // true if vendor is logged in

      // --- actions ---
      setVendor: (vendor) => set({ vendor, isAuthenticated: !!vendor }),
      
      // Update vendor profile (merge with existing data)
      updateVendor: (updates) => set((state) => ({
        vendor: state.vendor ? { ...state.vendor, ...updates } : null
      })),
      
      logout: () => set({ vendor: null, isAuthenticated: false }),
    }),
    {
      name: "vendor-store", // key in sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);
