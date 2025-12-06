"use server";

import { apiFetch } from "@/lib/api";

export const getAllIdeasAction = async ({
  page = 1,
  limit = 20, 
  search = "",
  category = "",
  role="user"
} = {}) => {

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  if (search) queryParams.append("search", search);
  if (category) queryParams.append("category", category);

  const endpoint = `/ideas?${queryParams.toString()}`;

  try {
    const response = await apiFetch(endpoint, {
      role: role,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
        pagination: response.pagination || null,
        message: "Ideas fetched successfully.",
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to fetch ideas.",
      };
    }
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return {
      success: false,
      message: error.message || "An unexpected network error occurred.",
    };
  }
};

export const getAllIdeaCategoriesAction = async ({role = "user"}) => {
  const endpoint = `/ideas/categories`; 

  try {
      const response = await apiFetch(endpoint, {
          role: role,
      });

      if (response.success) {
          return {
              success: true,
              data: response.data, // Array of { _id, name } objects
              message: "Idea categories fetched successfully.",
          };
      } else {
          return {
              success: false,
              message: response.message || "Failed to fetch idea categories.",
          };
      }
  } catch (error) {
      console.error("Error fetching idea categories:", error);
      return {
          success: false,
          message: error.message || "An unexpected network error occurred.",
      };
  }
};