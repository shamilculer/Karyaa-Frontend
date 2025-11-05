"use server";

import { apiFetch } from "@/lib/api";

// --- 2. CREATE IDEA ---
export const createIdeaAction = async (formData) => {

  if (!formData.title || !formData.description || !formData.category || !Array.isArray(formData.gallery) || formData.gallery.length === 0) {
    return { success: false, message: "Title, description, category, and gallery (must contain images) are required." };
  }

  const endpoint = `/admin/ideas/new`;

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      role: "admin",
      auth: true,
      body: JSON.stringify(formData), 
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Idea created successfully.",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to create idea.",
      };
    }
  } catch (error) {
    console.error("Error creating idea:", error);
    return {
      success: false,
      message: error.message || "An unexpected network error occurred.",
    };
  }
};

// --- 3. UPDATE IDEA ---
export const updateIdeaAction = async (id, formData) => {
  if (!id) {
    return { success: false, message: "Idea ID is required for update." };
  }

  const endpoint = `/admin/ideas/${id}`;

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
        message: response.message || "Idea updated successfully.",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to update idea.",
      };
    }
  } catch (error) {
    console.error(`Error updating idea ${id}:`, error);
    return {
      success: false,
      message: error.message || "An unexpected network error occurred.",
    };
  }
};

// --- 4. DELETE IDEA ---
export const deleteIdeaAction = async (id) => {
  if (!id) {
    return { success: false, message: "Idea ID is required for deletion." };
  }

  // Endpoint path updated to match the route: router.delete("/ideas/delete/:id", ...)
  const endpoint = `/admin/ideas/delete/${id}`;

  try {
    const response = await apiFetch(endpoint, {
      method: "DELETE",
      role: "admin",
      auth: true,
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || "Idea deleted successfully.",
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to delete idea.",
      };
    }
  } catch (error) {
    console.error(`Error deleting idea ${id}:`, error);
    return {
      success: false,
      message: error.message || "An unexpected network error occurred.",
    };
  }
}