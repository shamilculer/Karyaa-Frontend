
"use server"

import { apiFetch } from "@/lib/api";
/**
 * Get content by key (Public)
 */
export const getContentByKeyAction = async (key) => {
    if (!key) {
        return { success: false, message: "Content key is required." };
    }

    const endpoint = `/content/${key}`;

    try {
        const response = await apiFetch(endpoint);

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Content fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Content not found."
            };
        }
    } catch (error) {
        console.error(`Error fetching content ${key}:`, error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

/**
 * Get multiple contents by keys (Public)
 */
export const getBulkContentAction = async (keys) => {
    if (!Array.isArray(keys) || keys.length === 0) {
        return { success: false, message: "Keys array is required." };
    }

    const endpoint = `/content/bulk`;

    try {
        const response = await apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify({ keys }),
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Contents fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch contents."
            };
        }
    } catch (error) {
        console.error("Error fetching bulk content:", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};