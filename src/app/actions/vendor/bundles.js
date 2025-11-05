"use server";
import { apiFetch } from "@/lib/api";

/**
 * Fetch active bundles for registration
 * @returns {Promise<{bundles: Array} | {error: string}>}
 */
export const getBundleOptions = async () => {
  try {
    const response = await apiFetch('/bundles/registration-options', {
      method: 'GET',
    });

    if (response.error || !response.success) {
      return {
        error: response.message || "Failed to fetch bundle options.",
        bundles: []
      };
    }

    return {
      bundles: response.data || []
    };
  } catch (error) {
    console.error("Error fetching bundle options:", error);
    return {
      error: "An unexpected error occurred while fetching bundles.",
      bundles: []
    };
  }
};