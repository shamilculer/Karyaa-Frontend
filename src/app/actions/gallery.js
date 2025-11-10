"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Server Action to fetch all gallery items for a vendor.
 *
 * @param {string} vendorId - The vendor's ID
 * @param {object} filters - Optional filtering
 * @param {string} filters.category - Category ID
 * @param {"image"|"video"} filters.type - Media type
 * @param {boolean} filters.featured - Featured flag
 *
 * @returns {Promise<{
 *   items: Array<Object>,
 *   count: number,
 *   error?: string
 * }>}
 */
export const getVendorGalleryItems = async (
  vendorId,
  { category, type, featured } = {}
) => {
  try {
    let query = "?";

    if (category) query += `category=${category}&`;
    if (type) query += `type=${type}&`;
    if (featured) query += `featured=true&`;

    const response = await apiFetch(`/gallery/${vendorId}${query}`);

    if (!response || response.error) {
      return {
        items: [],
        count: 0,
        error: response?.message || "Failed to fetch gallery items.",
      };
    }

    return {
      items: response.items || [],
      count: response.count || 0,
    };
  } catch (error) {
    console.error("Error fetching vendor gallery items:", error);

    return {
      items: [],
      count: 0,
      error: "An unexpected error occurred.",
    };
  }
};


/**
 * Server Action to add gallery items for a vendor
 *
 * @param {string} vendorId
 * @param {Array<{ url: string, type?: string, category?: string }>} items
 * @returns {Promise<{ success?: string, error?: string }>}
 */
export const addVendorGalleryItems = async (vendorId, items = []) => {
    console.log(vendorId)
    try {
      if (!vendorId || !Array.isArray(items) || items.length === 0) {
        return {
          error: "Missing vendorId or items payload.",
        };
      }
  
      const response = await apiFetch("/gallery/add", {
        method: "POST",
        body: JSON.stringify({
          vendorId,
          items,
        }),
        role: "vendor",
        auth: true
      });
  
      if (!response || response.error || response.status >= 400) {
        return {
          error:
            response?.message ||
            "Failed to add gallery items due to API error.",
        };
      }
  
      // ✅ Fix syntax error - use parentheses, not backticks
      revalidatePath("/vendor/gallery");
  
      return {
        success:
          response.message || "Gallery items added successfully.",
        items: response.items || [],
        count: response.count || 0,
      };
    } catch (error) {
      console.error("Error adding vendor gallery items:", error);
  
      return {
        error:
          "An unexpected error occurred while adding gallery images.",
      };
    }
  };


  export const deleteVendorGalleryItems = async (ids) => {

    try {
      const response = await apiFetch(`/gallery`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        role: "vendor",
        auth: true
      });

      console.log(response)
  
      if (!response || response.error) {
        return { error: response?.error || "Failed to delete items" };
      }
  
      return { success: true };
    } catch (err) {
      console.error(err);
      return { error: "Unexpected error" };
    }
  };


  export const getAllGalleryItems = async (page = 1, limit = 30) => {
  try {
    const response = await apiFetch(
      `/gallery/?page=${page}&limit=${limit}`
    );

    if (!response || response.error) {
      return {
        items: [],
        count: 0,
        pagination: null,
        error: response?.message || "Failed to fetch gallery items.",
      };
    }

    return {
      items: response.items || [],
      count: response.pagination?.totalItems || 0,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Error fetching gallery items:", error);

    return {
      items: [],
      count: 0,
      pagination: null,
      error: "An unexpected server error occurred.",
    };
  }
};