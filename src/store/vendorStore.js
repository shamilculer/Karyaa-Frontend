import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set) => ({
      user: null,             // logged-in vendor user
      isAuthenticated: false, // true if user is logged in

      // --- actions ---
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "vendor-store",
    }
  )
);
