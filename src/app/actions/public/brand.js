"use server"

import { apiFetch } from "@/lib/api";

export async function getBrandDetailsAction(role) {
  try {
    const res = await apiFetch(`/brand-details`, {
      method: "GET",
      role: role ? role : "user",
    });

    if (res?.error) {
      return { error: res.error };
    }

    return { data: res.data };
  } catch (err) {
    console.error("GET BRAND Details ACTION ERROR:", err);
    return { error: "Something went wrong while fetching data." };
  }
}