"use server"

import { apiFetch } from "@/lib/api"

export const getAllBundlesAction = async ({ 
    page = 1, 
    limit = 15, 
    search = "", 
    status = "",
    isAvailableForInternational = "",
    sortBy = "displayOrder",
    sortOrder = "asc"
} = {}) => {
    
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 15);
    
    const queryParams = new URLSearchParams();
    
    // Use safePage and safeLimit for the API call
    queryParams.append('page', String(safePage));
    queryParams.append('limit', String(safeLimit));
    
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);
    if (isAvailableForInternational !== "") queryParams.append('isAvailableForInternational', isAvailableForInternational);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    const endpoint = `/admin/bundles/all?${queryParams.toString()}`;

    try {
        // Assuming apiFetch is your wrapper around fetch
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                pagination: response.pagination,
                message: "Bundles fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch bundles."
            };
        }
    } catch (error) {
        console.error("Error fetching bundles list (Admin):", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

export const getBundleByIdAction = async (id) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required." };
    }

    const endpoint = `/admin/bundles/${id}`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Bundle details fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Bundle not found."
            };
        }
    } catch (error) {
        console.error(`Error fetching bundle ${id}:`, error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

export const createBundleAction = async (formData) => {
    if (!formData || typeof formData !== "object") {
        return { success: false, message: "Invalid bundle payload." };
    }

    // Validate required fields
    if (!formData.name) {
        return { success: false, message: "Bundle name is required." };
    }
    if (!formData.duration || !formData.duration.value || !formData.duration.unit) {
        return { success: false, message: "Duration must include both value and unit." };
    }
    if (formData.price === undefined || formData.price === null) {
        return { success: false, message: "Bundle price is required." };
    }

    // Validate duration unit
    if (!["days", "months", "years"].includes(formData.duration.unit)) {
        return { success: false, message: "Duration unit must be 'days', 'months', or 'years'." };
    }

    // Validate bonus period
    if (formData.bonusPeriod && formData.bonusPeriod.value) {
        if (!["days", "months", "years"].includes(formData.bonusPeriod.unit)) {
            return { success: false, message: "Bonus period unit must be 'days', 'months', or 'years'." };
        }
    }

    // Validate max vendors
    if (formData.maxVendors !== undefined && formData.maxVendors !== null && formData.maxVendors < 1) {
        return { success: false, message: "maxVendors must be at least 1 or null for unlimited." };
    }

    const endpoint = `/admin/bundles/new`;

    try {
        // Backwards compatibility: if frontend sends `isAddon`, also include `isPopular` for the API
        const payload = { ...formData };
        if (payload.isAddon !== undefined && payload.isPopular === undefined) {
            payload.isPopular = payload.isAddon;
        }

        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify(payload),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Bundle created successfully.",
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to create bundle.",
            };
        }

    } catch (error) {
        console.error(`Error creating bundle:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const updateBundleAction = async (id, formData) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required for update." };
    }

    // Validate duration if being updated
    if (formData.duration) {
        if (!formData.duration.value || !formData.duration.unit) {
            return { success: false, message: "Duration must include both value and unit." };
        }
        if (!["days", "months", "years"].includes(formData.duration.unit)) {
            return { success: false, message: "Duration unit must be 'days', 'months', or 'years'." };
        }
    }

    // Validate bonusPeriod if being updated
    if (formData.bonusPeriod && formData.bonusPeriod.value) {
        if (!["days", "months", "years"].includes(formData.bonusPeriod.unit)) {
            return { success: false, message: "Bonus period unit must be 'days', 'months', or 'years'." };
        }
    }

    // Validate maxVendors if being updated
    if (formData.maxVendors !== undefined && formData.maxVendors !== null && formData.maxVendors < 1) {
        return { success: false, message: "maxVendors must be at least 1 or null for unlimited." };
    }

    const endpoint = `/admin/bundles/${id}`;

    try {
        // Backwards compatibility: if frontend sends `isAddon`, also include `isPopular` for the API
        const payload = { ...formData };
        if (payload.isAddon !== undefined && payload.isPopular === undefined) {
            payload.isPopular = payload.isAddon;
        }

        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(payload),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Bundle updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update bundle.",
            };
        }

    } catch (error) {
        console.error(`Error updating bundle ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const deleteBundleAction = async (id) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required for deletion." };
    }

    const endpoint = `/admin/bundles/delete/${id}`;

    try {
        const response = await apiFetch(endpoint, {
            method: "DELETE",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Bundle deleted successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to delete bundle.",
            };
        }

    } catch (error) {
        console.error(`Error deleting bundle ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const toggleBundleStatusAction = async (id) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required." };
    }

    const endpoint = `/admin/bundles/${id}/status`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Bundle status updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to toggle bundle status.",
            };
        }

    } catch (error) {
        console.error(`Error toggling bundle status ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const toggleBundleInternationalAvailabilityAction = async (id) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required." };
    }

    const endpoint = `/admin/bundles/${id}/toggle-international`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PATCH",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Bundle international availability updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to toggle international availability.",
            };
        }

    } catch (error) {
        console.error(`Error toggling bundle international availability ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};