"use server";

/**
 * Get public content by key
 * Uses direct fetch instead of apiFetch since it's a public endpoint
 */
export const getPublicContentByKeyAction = async (key) => {
    if (!key) {
        return { success: false, message: "Content key is required." };
    }

    // Use direct fetch with full URL for public endpoint
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const endpoint = `${baseUrl}/content/${key}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Don't cache to ensure fresh data
        });

        if (!response.ok) {
            console.error(`Failed to fetch content for key "${key}":`, response.status, response.statusText);
            return {
                success: false,
                data: null,
                message: `Failed to fetch content: ${response.statusText}`
            };
        }

        const result = await response.json();

        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Content fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: result.message || "Failed to fetch content."
            };
        }
    } catch (error) {
        console.error(`Error fetching public content ${key}:`, error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};
