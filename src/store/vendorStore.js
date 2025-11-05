import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set) => ({
      vendor: null,            // logged-in vendor user
      isAuthenticated: false,  // true if vendor is logged in

      // --- actions ---
      setVendor: (vendor) => set({ vendor, isAuthenticated: !!vendor }),
      logout: () => set({ vendor: null, isAuthenticated: false }),
    }),
    {
      name: "vendor-store", // key in localStorage
    }
  )
);
