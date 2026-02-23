"use server"

import { apiFetch } from "@/lib/api"

// --- 1. GET ALL VENDORS (Admin - Paginated/Filtered) ---
export const getAllVendorsAction = async ({
    page = 1,
    limit = 15,
    search = "",
    vendorStatus = "",
    city = "",
    expiryStatus = "",
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
    if (expiryStatus) queryParams.append('expiryStatus', expiryStatus);
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

// --- 1.B. EXPORT ALL VENDORS TO EXCEL (Admin - Filtered) ---
export const exportVendorsAction = async ({
    search = "",
    vendorStatus = "",
    city = "",
    expiryStatus = "",
    isInternational = "",
    sortBy = "createdAt",
    sortOrder = "desc"
} = {}) => {

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (vendorStatus) queryParams.append('vendorStatus', vendorStatus);
    if (city) queryParams.append('city', city);
    if (expiryStatus) queryParams.append('expiryStatus', expiryStatus);
    if (isInternational !== "") queryParams.append('isInternational', isInternational);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    const endpoint = `/admin/vendors/export?${queryParams.toString()}`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true,
            responseType: "blob" 
        });

        if (response instanceof Blob) {
            const arrayBuffer = await response.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString('base64');
            
            return {
                success: true,
                data: base64String,
                contentType: response.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                filename: `vendors_export_${Date.now()}.xlsx`
            };
        } else if (response.success === false) {
             return response; // Pass through error from apiFetch
        } else {
            throw new Error("Unexpected response type");
        }
    } catch (error) {
        console.error("Error exporting vendors list (Admin):", error);
        return {
            success: false,
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
        if (typeof customDuration.value !== 'number' || !customDuration.unit) {
            return {
                success: false,
                message: "customDuration must include 'value' (number) and 'unit'"
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

// --- 7. UPDATE VENDOR DOCUMENTS ---
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

// --- 8. UPDATE VENDOR DETAILS ---
export const updateVendorDetailsAction = async (id, updateData) => {
    if (!id) return { success: false, message: "Vendor ID is required." };
    const endpoint = `/admin/vendors/${id}/details`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(updateData),
        });
        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to update vendor details." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 9. UPDATE VENDOR BUNDLE ---
export const updateVendorBundleAction = async (id, bundleData) => {
    if (!id) return { success: false, message: "Vendor ID is required." };
    const endpoint = `/admin/vendors/${id}/bundle`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(bundleData),
        });
        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to update vendor bundle." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 10. GET VENDOR GALLERY ---
export const getVendorGalleryAction = async (id) => {
    if (!id) return { success: false, message: "Vendor ID is required." };
    const endpoint = `/admin/vendors/${id}/gallery`;
    try {
        const response = await apiFetch(endpoint, { role: "admin", auth: true });
        if (response.success) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: response.message || "Failed to fetch gallery." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 11. ADD VENDOR GALLERY ITEM ---
export const addVendorGalleryItemAction = async (id, galleryData) => {
    if (!id) return { success: false, message: "Vendor ID is required." };

    const { url, isFeatured, orderIndex } = galleryData;

    if (!url) {
        return { success: false, message: "Image URL is required." };
    }

    const endpoint = `/admin/vendors/${id}/gallery`;
    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify({ url, isFeatured, orderIndex }),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to add gallery item." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 12. UPDATE VENDOR GALLERY ITEM ---
export const updateVendorGalleryItemAction = async (id, itemId, updateData) => {
    if (!id || !itemId) return { success: false, message: "IDs required." };

    const endpoint = `/admin/vendors/${id}/gallery/${itemId}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(updateData),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to update gallery item." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 13. DELETE VENDOR GALLERY ITEM ---
export const deleteVendorGalleryItemAction = async (id, itemId) => {
    if (!id || !itemId) return { success: false, message: "IDs required." };
    const endpoint = `/admin/vendors/${id}/gallery/${itemId}`;
    try {
        const response = await apiFetch(endpoint, { method: "DELETE", role: "admin", auth: true });
        if (response.success) {
            return { success: true, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to delete gallery item." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 14. ADD VENDOR GALLERY ITEMS (Bulk) ---
export const addVendorGalleryItemsAction = async (vendorId, items) => {
    if (!vendorId) return { success: false, message: "Vendor ID is required." };
    if (!items || !Array.isArray(items) || items.length === 0) {
        return { success: false, message: "Items array is required." };
    }

    const endpoint = `/admin/vendors/${vendorId}/gallery/bulk`;
    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify({ items }),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to add gallery items." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 15. DELETE VENDOR GALLERY ITEMS (Bulk) ---
export const deleteVendorGalleryItemsAction = async (vendorId, itemIds) => {
    if (!vendorId) return { success: false, message: "Vendor ID is required." };
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return { success: false, message: "Item IDs array is required." };
    }

    const endpoint = `/admin/vendors/${vendorId}/gallery/bulk`;
    try {
        const response = await apiFetch(endpoint, {
            method: "DELETE",
            role: "admin",
            auth: true,
            body: JSON.stringify({ itemIds }),
        });

        if (response.success) {
            return { success: true, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to delete gallery items." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 16. GET VENDOR PACKAGES ---
export const getVendorPackagesAction = async (id) => {
    if (!id) return { success: false, message: "Vendor ID is required." };
    const endpoint = `/admin/vendors/${id}/packages`;
    try {
        const response = await apiFetch(endpoint, { role: "admin", auth: true });
        if (response.success) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: response.message || "Failed to fetch packages." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 17. ADD VENDOR PACKAGE ---
export const addVendorPackageAction = async (id, packageData) => {
    if (!id) return { success: false, message: "Vendor ID is required." };

    const {
        coverImage,
        name,
        subheading,
        description,
        priceStartingFrom,
        services,
        includes
    } = packageData;

    // Validate required fields
    if (!coverImage || !name || !description || !services?.length ||
        priceStartingFrom === undefined || priceStartingFrom === null) {
        return {
            success: false,
            message: "Missing required fields: coverImage, name, description, services, priceStartingFrom"
        };
    }

    const endpoint = `/admin/vendors/${id}/packages`;
    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify(packageData),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to add package." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 18. UPDATE VENDOR PACKAGE ---
export const updateVendorPackageAction = async (id, packageId, packageData) => {
    if (!id || !packageId) return { success: false, message: "IDs required." };

    const endpoint = `/admin/vendors/${id}/packages/${packageId}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(packageData),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to update package." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 19. DELETE VENDOR PACKAGE ---
export const deleteVendorPackageAction = async (id, packageId) => {
    if (!id || !packageId) return { success: false, message: "IDs required." };
    const endpoint = `/admin/vendors/${id}/packages/${packageId}`;
    try {
        const response = await apiFetch(endpoint, { method: "DELETE", role: "admin", auth: true });
        if (response.success) {
            return { success: true, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to delete package." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// ==================== ADMIN COMMENTS ====================

// --- 20. ADD ADMIN COMMENT ---
export const addAdminCommentAction = async (vendorId, message) => {
    if (!vendorId || !message) return { success: false, message: "Vendor ID and message are required." };

    const endpoint = `/admin/vendors/${vendorId}/comments`;
    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify({ message }),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to add comment." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 21. UPDATE ADMIN COMMENT ---
export const updateAdminCommentAction = async (vendorId, commentId, message) => {
    if (!vendorId || !commentId || !message) return { success: false, message: "Vendor ID, comment ID, and message are required." };

    const endpoint = `/admin/vendors/${vendorId}/comments/${commentId}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ message }),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to update comment." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 22. DELETE ADMIN COMMENT ---
export const deleteAdminCommentAction = async (vendorId, commentId) => {
    if (!vendorId || !commentId) return { success: false, message: "IDs required." };

    const endpoint = `/admin/vendors/${vendorId}/comments/${commentId}`;
    try {
        const response = await apiFetch(endpoint, { method: "DELETE", role: "admin", auth: true });
        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to delete comment." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// ==================== ADDITIONAL DOCUMENTS ====================

// --- 23. ADD ADDITIONAL DOCUMENT ---
export const addAdditionalDocumentAction = async (vendorId, documentData) => {
    if (!vendorId) return { success: false, message: "Vendor ID is required." };

    const { documentName, documentUrl } = documentData;
    if (!documentName || !documentUrl) {
        return { success: false, message: "Document name and URL are required." };
    }

    const endpoint = `/admin/vendors/${vendorId}/additional-documents`;
    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify({ documentName, documentUrl }),
        });

        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to add document." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 24. DELETE ADDITIONAL DOCUMENT ---
export const deleteAdditionalDocumentAction = async (vendorId, documentId) => {
    if (!vendorId || !documentId) return { success: false, message: "IDs required." };

    const endpoint = `/admin/vendors/${vendorId}/additional-documents/${documentId}`;
    try {
        const response = await apiFetch(endpoint, { method: "DELETE", role: "admin", auth: true });
        if (response.success) {
            return { success: true, data: response.data, message: response.message };
        } else {
            return { success: false, message: response.message || "Failed to delete document." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

// --- 25. DELETE VENDOR ---
export const deleteVendorAction = async (id) => {
    if (!id) return { success: false, message: "Vendor ID is required." };

    const endpoint = `/admin/vendors/${id}`;
    try {
        const response = await apiFetch(endpoint, { method: "DELETE", role: "admin", auth: true });
        if (response.success) {
            return { success: true, message: response.message || "Vendor deleted successfully." };
        } else {
            return { success: false, message: response.message || "Failed to delete vendor." };
        }
    } catch (error) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};
