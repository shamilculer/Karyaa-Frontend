import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => ({
      user: null,             // logged-in admin user
      isAuthenticated: false, // true if user is logged in

      // --- actions ---
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "admin-store",
    }
  )
);
