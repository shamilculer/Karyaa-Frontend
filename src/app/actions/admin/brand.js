"use server";

import { apiFetch } from "@/lib/api";

/**
 * Fetch branding Details
 */
export async function getBrandDetailsAction() {
  try {
    const res = await apiFetch(`/admin/brand-details`, {
      method: "GET",
      auth: true,
      role: "admin",
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

/**
 * Update branding Details
 */
export async function updateBrandDetailsAction(payload) {
  try {
    const res = await apiFetch(`/admin/brand-details`, {
      method: "PUT",
      auth: true,
      role: "admin",
      body: JSON.stringify(payload),
    });

    if (res?.error) {
      return { error: res.error };
    }

    return { success: true, data: res.data };
  } catch (err) {
    console.error("UPDATE BRAND Details ACTION ERROR:", err);
    return { error: "Something went wrong while updating data." };
  }
}
