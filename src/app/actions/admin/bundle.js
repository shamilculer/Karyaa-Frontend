"use server"

import { apiFetch } from "@/lib/api"

// --- 1. GET ALL BUNDLES (Admin - Paginated/Filtered) ---
export const getAllBundlesAction = async ({ 
    page = 1, 
    limit = 15, 
    search = "", 
    status = "",
    sortBy = "displayOrder",
    sortOrder = "asc"
} = {}) => {
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    const endpoint = `/admin/bundles/all?${queryParams.toString()}`;

    try {
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

// --- 2. GET BUNDLE BY ID (Detail View) ---
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

// --- 3. CREATE BUNDLE ---
export const createBundleAction = async (formData) => {
    if (!formData.name || !formData.price || !formData.duration) {
        return { success: false, message: "Name, price, and duration are required." };
    }

    const endpoint = `/admin/bundles/new`;

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
                message: response.message || "Bundle created successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to create bundle.",
            };
        }

    } catch (error) {
        console.error("Error creating bundle:", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

// --- 4. UPDATE BUNDLE ---
export const updateBundleAction = async (id, formData) => {
    if (!id) {
        return { success: false, message: "Bundle ID is required for update." };
    }

    const endpoint = `/admin/bundles/${id}`;

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

// --- 5. DELETE BUNDLE ---
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

// --- 6. TOGGLE BUNDLE STATUS ---
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