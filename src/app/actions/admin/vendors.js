"use server"

import { apiFetch } from "@/lib/api"

// --- 1. GET ALL VENDORS (Admin - Paginated/Filtered) ---
export const getAllVendorsAction = async ({ 
    page = 1, 
    limit = 15, 
    search = "", 
    vendorStatus = "",
    city = "",
    isInternational = "",
    sortBy = "createdAt",
    sortOrder = "desc"
} = {}) => {
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    if (search) queryParams.append('search', search);
    if (vendorStatus) queryParams.append('vendorStatus', vendorStatus);
    if (city) queryParams.append('city', city);
    if (isInternational !== "") queryParams.append('isInternational', isInternational);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    const endpoint = `/admin/vendors/all?${queryParams.toString()}`;

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
                message: "Vendors fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch vendors."
            };
        }
    } catch (error) {
        console.error("Error fetching vendors list (Admin):", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

// --- 2. GET VENDOR BY ID (Detail View) ---
export const getVendorByIdAction = async (id) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    const endpoint = `/admin/vendors/${id}`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Vendor details fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Vendor not found."
            };
        }
    } catch (error) {
        console.error(`Error fetching vendor ${id}:`, error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

// --- 3. UPDATE VENDOR STATUS ---
export const updateVendorStatusAction = async (id, vendorStatus) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    if (!['approved', 'pending', 'rejected', 'expired'].includes(vendorStatus)) {
        return { 
            success: false, 
            message: "Invalid status. Must be 'approved', 'pending', 'rejected', or 'expired'" 
        };
    }

    const endpoint = `/admin/vendors/${id}/status`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ vendorStatus }),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Vendor status updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update vendor status.",
            };
        }

    } catch (error) {
        console.error(`Error updating vendor status ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

// --- 4. UPDATE VENDOR CUSTOM DURATION ---
export const updateVendorDurationAction = async (id, customDuration) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    // Validate customDuration structure
    if (customDuration) {
        if (!customDuration.value || !customDuration.unit) {
            return { 
                success: false, 
                message: "customDuration must include 'value' and 'unit'" 
            };
        }

        if (!['days', 'months', 'years'].includes(customDuration.unit)) {
            return { 
                success: false, 
                message: "unit must be 'days', 'months', or 'years'" 
            };
        }

        // Validate bonusPeriod if provided
        if (customDuration.bonusPeriod && customDuration.bonusPeriod.unit) {
            if (!['days', 'months', 'years'].includes(customDuration.bonusPeriod.unit)) {
                return { 
                    success: false, 
                    message: "bonusPeriod unit must be 'days', 'months', or 'years'" 
                };
            }
        }
    }

    const endpoint = `/admin/vendors/${id}/duration`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PATCH",
            role: "admin",
            auth: true,
            body: JSON.stringify({ customDuration }),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Custom duration updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update custom duration.",
            };
        }

    } catch (error) {
        console.error(`Error updating custom duration for vendor ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

// --- 5. UPDATE VENDOR CUSTOM FEATURES ---
export const updateVendorFeaturesAction = async (id, customFeatures) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    if (!Array.isArray(customFeatures)) {
        return { 
            success: false, 
            message: "customFeatures must be an array of strings" 
        };
    }

    const endpoint = `/admin/vendors/${id}/features`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ customFeatures }),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Custom features updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update custom features.",
            };
        }

    } catch (error) {
        console.error(`Error updating custom features for vendor ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

// --- 6. TOGGLE VENDOR RECOMMENDED STATUS ---
export const toggleVendorRecommendedAction = async (id) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    const endpoint = `/admin/vendors/${id}/toggle-recommendation`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Recommended status toggled successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to toggle recommended status.",
            };
        }

    } catch (error) {
        console.error(`Error toggling recommended status for vendor ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const updateVendorDocumentsAction = async (id, documentData) => {
    if (!id) {
        return { success: false, message: "Vendor ID is required." };
    }

    // Validate that at least one field is provided
    const {
        tradeLicenseCopy,
        emiratesIdCopy,
        businessLicenseCopy,
        passportOrIdCopy,
        tradeLicenseNumber,
        personalEmiratesIdNumber,
    } = documentData;

    const hasAnyField = [
        tradeLicenseCopy,
        emiratesIdCopy,
        businessLicenseCopy,
        passportOrIdCopy,
        tradeLicenseNumber,
        personalEmiratesIdNumber,
    ].some(field => field !== undefined && field !== null);

    if (!hasAnyField) {
        return { 
            success: false, 
            message: "At least one document field must be provided." 
        };
    }

    const endpoint = `/admin/vendors/${id}/documents`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PATCH",
            role: "admin",
            auth: true,
            body: JSON.stringify(documentData),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Vendor documents updated successfully.",
                data: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update vendor documents.",
            };
        }

    } catch (error) {
        console.error(`Error updating documents for vendor ${id}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};