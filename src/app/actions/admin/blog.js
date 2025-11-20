"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const createBlogPost = async (formData) => {
  try {
    // Assume the API endpoint for creating a blog post is /admin/blog
    const response = await apiFetch("/admin/blog/new", {
      method: "POST",
      body: JSON.stringify(formData),
      role: "admin", // Ensures admin credentials are used for API call
      auth: true,
    });

    if (response?.success) {
      revalidatePath("/admin/content-moderation/blog");
      return {
        success: true,
        message: response.message || "Blog post created successfully!",
        blog: response.blog,
      };
    }

    return {
      success: false,
      message:
        response?.message ||
        "Failed to create blog post. Please check the provided data.",
    };
  } catch (error) {
    console.error("createBlogPost error:", error);
    // Handle network/unexpected errors
    return {
      success: false,
      message:
        error.message || "An unexpected network or server error occurred.",
    };
  }
};

export const editBlogPost = async (id, formData) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Blog post ID is required for editing.",
      };
    }

    // Validate status is a valid enum value
    if (formData.status && !["draft", "published"].includes(formData.status)) {
      return {
        success: false,
        message: "Invalid status. Status must be 'draft' or 'published'.",
      };
    }

    const response = await apiFetch(`/admin/blog/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      role: "admin",
      auth: true,
    });

    if (response?.success) {
      revalidatePath("/admin/content-moderation/blog");
      revalidatePath(`/blog/${response.blog.slug}`);

      return {
        success: true,
        message: response.message || "Blog post updated successfully!",
        blog: response.blog,
      };
    }

    return {
      success: false,
      message:
        response?.message ||
        "Failed to update blog post. Please check the provided data.",
    };
  } catch (error) {
    console.error("editBlogPost error:", error);
    return {
      success: false,
      message:
        error.message ||
        "An unexpected network or server error occurred while updating the post.",
    };
  }
};

export const getAllBlogPosts = async ({
  page = 1,
  limit = 15,
  search = "",
  status = "",
} = {}) => {
  // Set default values for robust calls
  // 1. Construct the query string from the parameters
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));

  if (search) {
    queryParams.append("search", search);
  }
  if (status) {
    queryParams.append("status", status);
  }

  const endpoint = `/admin/blog/all?${queryParams.toString()}`;

  try {
    // 2. Fetch data using the dynamic endpoint
    const response = await apiFetch(endpoint, {
      role: "admin",
      auth: true,
    }); // 3. Handle successful response

    if (response.success && response.blogs) {
      return {
        success: true,
        data: response.blogs,
        total: response.total,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        message: "Blog posts fetched successfully.",
      };
    } else {
      // Handle cases where API returned a known error state
      return {
        success: false,
        data: null,
        message: response.message || "Failed to fetch blog posts.",
      };
    }
  } catch (error) {
    // 4. Handle errors thrown by apiFetch
    console.error("Error fetching all blog posts (Admin):", error);
    let message = "An unexpected network or server error occurred.";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null && error.message) {
      message = error.message;
    }

    return {
      success: false,
      data: null,
      message: message,
    };
  }
};

export const getBlogPostAsAdmin = async (nameOrSlug) => {
  try {
    const postResponse = await apiFetch(`/admin/blog/${nameOrSlug}`, {
      role: "admin",
      auth: true,
    });
    return postResponse.blog;
  } catch (error) {
    console.error("Error fetching published blog post:", error);
    throw error;
  }
};

export const deleteBlogPosts = async (ids) => {
  try {
    const idArray = Array.isArray(ids) ? ids : [ids];
    const response = await apiFetch(`/admin/blog/delete`, {
      method: "DELETE",
      body: JSON.stringify({ ids: idArray }),
      role: "admin",
      auth: true,
    });
    if (!response || !response.success) {
      return {
        success: false,
        message: response?.message || "Failed to delete blog posts.",
      };
    } // Optional: Revalidate your list page
    revalidatePath("/admin/content-moderation/blog");
    return {
      success: true,
      deletedCount: response.deletedCount,
      message: `Successfully deleted ${response.deletedCount} blog post(s).`,
    };
  } catch (error) {
    console.error("Error deleting blog posts:", error);
    return {
      success: false,
      message:
        error?.message || "Unexpected server error while deleting blogs.",
    };
  }
};

export const toggleBlogStatusAction = async ({ id, ids, status }) => {
  try {
    // Validate status
    if (!status || !["draft", "published"].includes(status)) {
      return {
        success: false,
        message: "Invalid status value. Use 'draft' or 'published'.",
      };
    } // Validate id / ids
    if (!id && (!Array.isArray(ids) || ids.length === 0)) {
      return {
        success: false,
        message: "Provide either 'id' or 'ids[]'.",
      };
    }
    const payload = id ? { id, status } : { ids, status };
    const response = await apiFetch("/admin/blog/toggle-status", {
      method: "PATCH",
      body: JSON.stringify(payload),
      role: "admin",
      auth: true,
    });
    if (response?.success) {
      return {
        success: true,
        message: response.message || "Blog status updated.",
      };
    }
    return {
      success: false,
      message: response?.message || "Failed to update status.",
    };
  } catch (error) {
    console.error("toggleBlogStatusAction error:", error);
    return {
      success: false,
      message: error.message || "Unexpected error occurred.",
    };
  }
};
