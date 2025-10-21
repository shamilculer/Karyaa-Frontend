"use server";

import { apiFetch } from "@/lib/api";

export const getCategories = async () => {
  try {
    const response = await apiFetch("/categories");
    if (response.success) {
      return { success: true, categories: response.categories };
    } else {
      throw new Error(response.message || "Failed to fetch categories.");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, message: error.message };
  }
};

export const getCategoryDetails = async (categorySlug) => {
  try {
    const response = await apiFetch(`/categories/${categorySlug}`);
    return response.category;
  } catch (error) {
    console.error("Error fetching category details:", error);
    return { success: false, message: error.message };
  }
};

export const getSubcategories = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams();

    if (searchParams.mainCategory) {
      params.append("mainCategory", searchParams.mainCategory);
    }

    if (searchParams.isPopular !== undefined) {
      params.append("isPopular", searchParams.isPopular);
    }

    if (searchParams.isNew !== undefined) {
      params.append("isNew", searchParams.isNew);
    }

    const url = `/subcategories?${params.toString()}`;

    const response = await apiFetch(url);
    return response;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const getSubcategoryDetails = async (subcategorySlug) => {
  try {
    const response = await apiFetch(`/subcategories/${subcategorySlug}`);
    return response.subcategory;
  } catch (error) {
    console.error("Error fetching subcategory details:", error);
    return { success: false, message: error.message };
  }
};
