// actions/content.actions.js
"use server"

import { apiFetch } from "@/lib/api"

/**
 * Get all content (Admin)
 */
export const getAllContentAction = async ({ type = "" } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (type) queryParams.append('type', type);

    const endpoint = `/admin/content?${queryParams.toString()}`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Content list fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch content."
            };
        }
    } catch (error) {
        console.error("Error fetching all content:", error);
        return {
            success: false,
            data: null,
            message: error.message || "An unexpected network error occurred."
        };
    }
};

/**
 * Create or update content (Admin)
 */
export const upsertContentAction = async (key, formData) => {
    if (!key) {
        return { success: false, message: "Content key is required." };
    }

    if (!formData || typeof formData !== "object") {
        return { success: false, message: "Invalid content payload." };
    }

    // Validate required fields
    if (!formData.type) {
        return { success: false, message: "Content type is required." };
    }

    if (!formData.content) {
        return { success: false, message: "Content is required." };
    }

    // Validate type
    const validTypes = ["page", "section", "faq", "setting"];
    if (!validTypes.includes(formData.type)) {
        return { 
            success: false, 
            message: `Content type must be one of: ${validTypes.join(", ")}.` 
        };
    }

    const endpoint = `/admin/content/${key}`;

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
                message: response.message || "Content saved successfully.",
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to save content.",
            };
        }

    } catch (error) {
        console.error(`Error upserting content ${key}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

/**
 * Delete content (Admin)
 */
export const deleteContentAction = async (key) => {
    if (!key) {
        return { success: false, message: "Content key is required for deletion." };
    }

    const endpoint = `/admin/content/${key}`;

    try {
        const response = await apiFetch(endpoint, {
            method: "DELETE",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Content deleted successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to delete content.",
            };
        }

    } catch (error) {
        console.error(`Error deleting content ${key}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

/**
 * Helper: Get all policy pages (Public)
 */
export const getAllPolicyPagesAction = async () => {
    return await getBulkContentAction([
        'privacy-policy',
        'terms-and-conditions',
        'cookie-policy'
    ]);
};

/**
 * Helper: Get all FAQ content (Public)
 */
export const getAllFaqContentAction = async () => {
    return await getBulkContentAction([
        'faq-vendor',
        'faq-customer'
    ]);
};

/**
 * Helper: Get all landing page sections (Public)
 */
export const getLandingPageContentAction = async () => {
    return await getBulkContentAction([
        'hero-section',
        'features-section',
        'how-it-works-section',
        'testimonials-section',
        'cta-section'
    ]);
};

/**
 * Helper: Get site settings (Public)
 */
export const getSiteSettingsAction = async () => {
    return await getBulkContentAction([
        'site-footer-text',
        'site-tagline',
        'contact-email',
        'support-phone'
    ]);
};