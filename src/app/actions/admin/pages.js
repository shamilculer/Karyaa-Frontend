// actions/admin/pages.js
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
                count: response.count,
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
 * Get single content by key (Admin)
 */
export const getContentByKeyAction = async (key) => {
    if (!key) {
        return { success: false, message: "Content key is required." };
    }

    const endpoint = `/admin/content/${key}`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

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
                message: response.message || "Failed to fetch content."
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
 * Get landing page structure (Admin)
 */
export const getLandingPageStructureAction = async () => {
    const endpoint = `/admin/content/landing-page/structure`;

    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Landing page structure fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch landing page structure."
            };
        }
    } catch (error) {
        console.error("Error fetching landing page structure:", error);
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
 * Bulk update multiple sections (Admin)
 */
export const bulkUpdateContentAction = async (sections) => {
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
        return { 
            success: false, 
            message: "Sections array is required and cannot be empty." 
        };
    }

    // Validate each section
    const validTypes = ["page", "section", "faq", "setting"];
    for (const section of sections) {
        if (!section.key) {
            return { success: false, message: "Each section must have a key." };
        }
        if (!section.type) {
            return { success: false, message: `Section ${section.key} is missing a type.` };
        }
        if (!validTypes.includes(section.type)) {
            return { 
                success: false, 
                message: `Section ${section.key} has invalid type. Must be one of: ${validTypes.join(", ")}.` 
            };
        }
        if (!section.content) {
            return { success: false, message: `Section ${section.key} is missing content.` };
        }
    }

    const endpoint = `/admin/content/bulk-update`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ sections }),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "All sections saved successfully.",
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to save sections.",
            };
        }

    } catch (error) {
        console.error("Error bulk updating content:", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

/**
 * Save landing page sections (Admin)
 * Helper function to format and bulk update landing page content
 */
export const saveLandingPageAction = async (contentData) => {
    if (!contentData || typeof contentData !== "object") {
        return { success: false, message: "Invalid landing page data." };
    }

    // Transform contentData object into sections array
    const sections = Object.entries(contentData).map(([key, content]) => ({
        key,
        type: "section",
        content
    }));

    if (sections.length === 0) {
        return { success: false, message: "No sections to save." };
    }

    return await bulkUpdateContentAction(sections);
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