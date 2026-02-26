"use server";

import { apiFetch } from "@/lib/api";

// --- GET ALL SUBSCRIBERS (Admin - Paginated/Filtered) ---
export const getAllSubscribersAction = async ({
    page = 1,
    limit = 15,
    search = "",
} = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    if (search) queryParams.append('search', search);

    const endpoint = `/admin/newsletter/subscribers?${queryParams.toString()}`;

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
                message: "Subscribers fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch subscribers."
            };
        }
    } catch (error) {
        console.error("Error fetching subscribers list (Admin):", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

// --- EXPORT ALL SUBSCRIBERS TO EXCEL (Admin - Filtered) ---
export const exportSubscribersAction = async ({
    search = "",
} = {}) => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);

    const endpoint = `/admin/newsletter/subscribers/export?${queryParams.toString()}`;

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
                filename: `newsletter_subscribers_${Date.now()}.xlsx`
            };
        } else if (response.success === false) {
             return response; // Pass through error from apiFetch
        } else {
            throw new Error("Unexpected response type");
        }
    } catch (error) {
        console.error("Error exporting subscribers list (Admin):", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred."
        };
    }
};
