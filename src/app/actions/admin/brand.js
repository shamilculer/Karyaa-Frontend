"use server";

import { apiFetch } from "@/lib/api";

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
