"use server"

import { apiFetch } from "@/lib/api"

// --- 1. GET STATIC PAGES SEO ---
export const getStaticSeoDataAction = async () => {
    const endpoint = `/admin/seo/static`;
    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Static pages SEO data fetched successfully."
            };
        } else {
            return {
                success: false,
                data: [],
                message: response.message || "Failed to fetch static pages SEO."
            };
        }
    } catch (error) {
        console.error("Error fetching static SEO:", error);
        return {
            success: false,
            data: [],
            message: error.message || "An unexpected error occurred."
        };
    }
};

// --- 2. GET CATEGORIES SEO ---
export const getCategoriesSeoDataAction = async () => {
    const endpoint = `/admin/seo/categories`;
    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Categories SEO data fetched successfully."
            };
        } else {
            return {
                success: false,
                data: [],
                message: response.message || "Failed to fetch categories SEO."
            };
        }
    } catch (error) {
        console.error("Error fetching categories SEO:", error);
        return {
            success: false,
            data: [],
            message: error.message || "An unexpected error occurred."
        };
    }
};

// --- 3. GET SUBCATEGORIES SEO ---
export const getSubCategoriesSeoDataAction = async () => {
    const endpoint = `/admin/seo/subcategories`;
    try {
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: "Subcategories SEO data fetched successfully."
            };
        } else {
            return {
                success: false,
                data: [],
                message: response.message || "Failed to fetch subcategories SEO."
            };
        }
    } catch (error) {
        console.error("Error fetching subcategories SEO:", error);
        return {
            success: false,
            data: [],
            message: error.message || "An unexpected error occurred."
        };
    }
};

// --- 4. UPDATE STATIC PAGE SEO ---
export const updateStaticPageSeoAction = async (identifier, data) => {
    if (!identifier) return { success: false, message: "Page identifier is required." };

    const endpoint = `/admin/seo/static/${identifier}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(data)
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: response.message || "Static page SEO updated successfully."
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update static page SEO."
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred."
        };
    }
};

// --- 5. UPDATE CATEGORY SEO ---
export const updateCategorySeoAction = async (id, data) => {
    if (!id) return { success: false, message: "Category ID is required." };

    const endpoint = `/admin/seo/categories/${id}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(data)
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: response.message || "Category SEO updated successfully."
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update category SEO."
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred."
        };
    }
};

// --- 6. UPDATE SUBCATEGORY SEO ---
export const updateSubCategorySeoAction = async (id, data) => {
    if (!id) return { success: false, message: "Subcategory ID is required." };

    const endpoint = `/admin/seo/subcategories/${id}`;
    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(data)
        });

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: response.message || "Subcategory SEO updated successfully."
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update subcategory SEO."
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || "An unexpected error occurred."
        };
    }
};
