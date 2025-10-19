"use server";

import { apiFetch } from "@/lib/api";

/**
 * Register Vendor Server Action
 * @param {Object} data - Complete vendor registration data from all steps
 * @returns {Object} - Success/error response from backend (only on failure, success uses redirect)
 */
export const registerVendor = async (data) => {
  try {
    const response = await apiFetch('/vendor/auth/register', {
      method: 'POST',
      body: data,
    });

    // SUCCESS: Return success object to the client for toast notification and client-side redirect
    return {
      success: true,
      data: response,
      message: "Vendor registered successfully!",
    };
  } catch (error) {
    console.error("Vendor registration error:", error);
    // FAILURE: Return error object to the client
    return {
      success: false,
      error: error.message || "Failed to register vendor. Please try again.",
    };
  }
}