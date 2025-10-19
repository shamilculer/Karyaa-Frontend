import { create } from "zustand";
import { persist } from "zustand/middleware"

export const useClientStore = create(
  persist(
    (set) => ({
      user: null,             // logged-in client user
      isAuthenticated: false, // true if user is logged in

      // --- actions ---
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "client-store", // key in localStorage
    }
  )
);