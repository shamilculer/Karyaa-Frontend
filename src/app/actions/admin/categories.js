"use server";
import { apiFetch } from "@/lib/api";

export const getCategoryDetails = async () => {
    try {
        const response = await apiFetch("/admin/manage-categories", {
            role: "admin",
            auth: true
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Something went wrong while getting category data. Please refresh the page!"
            };
        }
        
        return {
            success: true,
            count: response.count,
            categories: response.categories
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again later."
        };
    }
};

export const getSingleCategoryDetails = async (slug) => {
    if (!slug) {
        return {
            success: false,
            message: "Category slug is required"
        };
    }

    try {
        const response = await apiFetch(`/admin/manage-categories/${slug}`, {
            role: "admin",
            auth: true
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to fetch category details. Please try again."
            };
        }
        
        return {
            success: true,
            category: response.category
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An unexpected error occurred while fetching category details."
        };
    }
};

export const addCategory = async (formData) => {
    if (!formData) {
        return {
            success: false,
            message: "Category data is required"
        };
    }

    if (!formData.name) {
        return {
            success: false,
            message: "Category name is required"
        };
    }

    try {
        const response = await apiFetch("/admin/manage-categories/new", {
            method: "POST", 
            role: "admin",
            auth: true,
            body: JSON.stringify(formData)
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to add category. Please check the data and try again."
            };
        }
        
        return {
            success: true,
            message: response.message || "Category added successfully",
            category: response.category // Assuming your backend returns the newly created category
        };
    } catch (error) {
        console.error("Add category server action error:", error);
        return {
            success: false,
            message: "An unexpected error occurred while adding the category."
        };
    }
};

export const updateCategory = async (slug, formData) => {
    if (!slug) {
        return {
            success: false,
            message: "Category slug is required"
        };
    }

    if (!formData) {
        return {
            success: false,
            message: "Category data is required"
        };
    }

    try {
        const response = await apiFetch(`/admin/manage-categories/${slug}`, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(formData)
        });
        
        if (!response.success) {
            return {
                success: false,
                message: response.message || "Failed to update category. Please try again."
            };
        }
        
        return {
            success: true,
            message: response.message || "Category updated successfully",
            category: response.category
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An unexpected error occurred while updating category."
        };
    }
};

export const deleteCategory = async (slug) => {
    if (!slug) {
      return {
        success: false,
        message: "Category slug is required"
      };
    }
  
    try {
      const response = await apiFetch(`/admin/manage-categories/${slug}`, {
        method: "DELETE",
        role: "admin",
        auth: true
      });
      
      if (!response.success) {
        return {
          success: false,
          message: response.message || "Failed to delete category. Please try again."
        };
      }
      
      return {
        success: true,
        message: response.message || "Category deleted successfully"
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting category."
      };
    }
};