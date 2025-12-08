"use server";

import { apiFetch } from "@/lib/api";

/**
 * Fetch all Ad Banners with filters
 */
export const getAllBannersAction = async ({
  search = "",
  status = "",
  placement = "",
  page = 1,
  limit = 15,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {

  const queryParams = new URLSearchParams();

  // Only send query params if present
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (placement) queryParams.append("placement", placement);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  const endpoint = `/admin/ad-banner/all?${queryParams.toString()}`;

  try {
    const response = await apiFetch(endpoint, {
      role: "admin",
      auth: true,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data.data || response.data, // handle both formats
        pagination: response.data.pagination || {
          total: response.data.data?.length || 0,
          page: parseInt(page),
          pages: 1,
        },
        message: "Ad Banners fetched successfully.",
      };
    } else {
      return {
        success: false,
        data: null,
        pagination: null,
        message: response.message || "Failed to fetch ad banners.",
      };
    }
  } catch (error) {
    console.error("Error fetching ad banners list (Admin):", error);
    return {
      success: false,
      data: null,
      pagination: null,
      message: error.message || "An unexpected network error occurred.",
    };
  }
};

/**
 * Create Ad Banner
 */
export const createBannerAction = async (formData) => {

  // normalize boolean (FormData sends strings)
  if (typeof formData.isVendorSpecific === "string") {
    formData.isVendorSpecific = formData.isVendorSpecific === "true";
  }

  // minimal validation
  if (!formData.name || !formData.placement?.length) {
    return {
      success: false,
      message: "Name and Placement are required.",
    };
  }

  // Image URL is only required for image banners
  if (formData.mediaType === "image" && !formData.imageUrl) {
    return {
      success: false,
      message: "Image URL is required for image banners.",
    };
  }

  // Video URL is required for video banners
  if (formData.mediaType === "video" && !formData.videoUrl) {
    return {
      success: false,
      message: "Video URL is required for video banners.",
    };
  }

  if (formData.isVendorSpecific && !formData.vendor) {
    return {
      success: false,
      message: "Vendor must be selected when 'Link to Vendor Profile' is enabled.",
    };
  }

  // Custom URL validation removed - it's now optional

  const endpoint = `/admin/ad-banner/new`;

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      role: "admin",
      auth: true,
      body: JSON.stringify(formData),
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Ad Banner created.",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to create banner.",
    };

  } catch (error) {
    console.error("Error creating ad banner:", error);

    return {
      success: false,
      message: error.message || "Unexpected network error.",
    };
  }
};

/**
 * Update Ad Banner
 */
export const updateBannerAction = async (id, formData) => {
  if (!id) {
    return {
      success: false,
      message: "Banner ID is required.",
    };
  }

  // normalize boolean
  if (typeof formData.isVendorSpecific === "string") {
    formData.isVendorSpecific = formData.isVendorSpecific === "true";
  }

  // cleanup
  if (formData.isVendorSpecific) {
    formData.customUrl = null;
  } else {
    formData.vendor = null;
  }

  const endpoint = `/admin/ad-banner/${id}`;

  try {
    const response = await apiFetch(endpoint, {
      method: "PUT",
      role: "admin",
      auth: true,
      body: JSON.stringify(formData),
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Ad Banner updated.",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to update banner.",
    };

  } catch (error) {
    console.error(`Error updating ad banner ${id}:`, error);

    return {
      success: false,
      message: error.message || "Unexpected network error.",
    };
  }
};

/**
 * Toggle Active/Inactive Status
 */
export const toggleBannerStatusAction = async (id) => {
  if (!id) {
    return { success: false, message: "Banner ID is required." };
  }

  const endpoint = `/admin/ad-banner/${id}/status`;

  try {
    const response = await apiFetch(endpoint, {
      method: "PUT",
      role: "admin",
      auth: true,
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Banner status updated.",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to update status.",
    };

  } catch (error) {
    console.error(`Error toggling ad banner status ${id}:`, error);

    return {
      success: false,
      message: error.message || "Unexpected network error.",
    };
  }
};

/**
 * Delete Banner
 */
export const deleteBannerAction = async (id) => {
  if (!id) {
    return {
      success: false,
      message: "Banner ID is required.",
    };
  }

  const endpoint = `/admin/ad-banner/${id}/delete`;

  try {
    const response = await apiFetch(endpoint, {
      method: "DELETE",
      role: "admin",
      auth: true,
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Banner deleted.",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to delete banner.",
    };

  } catch (error) {
    console.error(`Error deleting banner ${id}:`, error);

    return {
      success: false,
      message: error.message || "Unexpected network error.",
    };
  }
};
