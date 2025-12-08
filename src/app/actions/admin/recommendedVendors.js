"use server"

import { apiFetch } from "@/lib/api"

/**
 * Get all recommended vendors
 * Fetches vendors where isRecommended === true
 */
export const getRecommendedVendorsAction = async ({
    page = 1,
    limit = 15,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc"
} = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('isRecommended', 'true'); // Filter for recommended vendors only
    if (search) queryParams.append('search', search);
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
                message: "Recommended vendors fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch recommended vendors."
            };
        }
    } catch (error) {
        console.error("Error fetching recommended vendors:", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};
