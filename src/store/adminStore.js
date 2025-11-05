import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,            // logged-in admin user
      isAuthenticated: false,  // true if admin is logged in

      // --- actions ---
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    {
      name: "admin-store", // key in localStorage
    }
  )
);
