"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const deleteSubcategories = async (ids) => {
    try {
        const idArray = Array.isArray(ids) ? ids : [ids];

        const response = await apiFetch(`/admin/manage-categories/subcategory/delete`, {
            method: "DELETE",
            body: JSON.stringify({ ids: idArray }),
            role: "admin",
            auth: true,
        });

        if (!response || !response.success) {
            return {
                success: false,
                message: response?.message || "Failed to delete sub-categories.",
            };
        }

        // Optional: Revalidate your list page
        revalidatePath("/admin/category-management");

        return {
            success: true,
            deletedCount: response.deletedCount,
            message: `Successfully deleted ${response.deletedCount} Sub-category(s).`,
        };

    } catch (error) {
        console.error("Error deleting sub-categories:", error);

        return {
            success: false,
            message: error?.message || "Unexpected server error while deleting sub-categories.",
        };
    }
};

export const toggleSubcategoryFlags = async (ids, flag, value) => {
    try {
        const idArray = Array.isArray(ids) ? ids : [ids];

        // Validate flag
        if (!["isPopular", "isNewSub"].includes(flag)) {
            return {
                success: false,
                message: "Invalid flag provided. Use 'isPopular' or 'isNewSub'.",
            };
        }

        const response = await apiFetch(`/admin/manage-categories/subcategory/toggle-flag`, {
            method: "PATCH",
            body: JSON.stringify({ ids: idArray, flag, value }),
            role: "admin",
            auth: true,
        });

        if (!response || !response.success) {
            return {
                success: false,
                message: response?.message || "Failed to update sub-category flag.",
            };
        }

        // Revalidate the page to reflect changes
        revalidatePath("/admin/category-management");

        return {
            success: true,
            updatedCount: response.updatedCount || 0,
            message: `Updated ${response.updatedCount || 0} sub-category(s) successfully.`,
        };
    } catch (error) {
        console.error("Error updating sub-category flags:", error);
        return {
            success: false,
            message: error?.message || "Unexpected server error while updating flags.",
        };
    }
};

export const addSubcategory = async (formData) => {
    if (!formData.name || !formData.mainCategory || !formData.coverImage) {
        return {
            success: false,
            message: "Subcategory name, main category, and cover image are required."
        };
    }

    try {
        const response = await apiFetch("/admin/manage-categories/subcategory/new", {
            method: "POST",
            role: "admin",
            auth: true,
            body: JSON.stringify(formData)
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to add subcategory. Please check the data and try again."
            };
        }
        
        revalidatePath("/admin/category-management");

        return {
            success: true,
            message: response.message || "Subcategory added successfully",
            subCategory: response.subCategory
        };
    } catch (error) {
        // 5. Handle unexpected errors
        console.error("Add subcategory server action error:", error);
        return {
            success: false,
            message: "An unexpected error occurred while adding the subcategory."
        };
    }
};

export const editSubcategory = async (id, formData) => {
    if (!id) {
        return {
            success: false,
            message: "Subcategory ID is required for editing."
        };
    }
    if (!formData) {
        return {
            success: false,
            message: "Update data is required."
        };
    }

    try {
        const response = await apiFetch(`/admin/manage-categories/subcategory/${id}`, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(formData)
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to update subcategory. Please check the data."
            };
        }
        
        revalidatePath("/admin/category-management");

        return {
            success: true,
            message: response.message || "Subcategory updated successfully",
            subCategory: response.subCategory
        };
    } catch (error) {
        console.error("Edit subcategory server action error:", error);
        return {
            success: false,
            message: "An unexpected error occurred while updating the subcategory."
        };
    }
};