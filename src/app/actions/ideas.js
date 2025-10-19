"use server";

import { apiFetch } from "@/lib/api";

export const getPublishedIdeasPosts = async ({
  limit = 15,
  page = 1,
  category,
}) => {
  try {
    const params = new URLSearchParams();

    params.append("limit", limit);

    params.append("page", page);

    if (category) {
      params.append("category", category);
    }

    const url = `/idea/published?${params.toString()}`;

    const ideaResponse = await apiFetch(url);

    return ideaResponse;
  } catch (error) {
    console.error("Error fetching published idea posts:", error);
    return {
      success: false,
      ideas: [], 
      total: 0,
      totalPages: 0,
      currentPage: page,
      error: error.message || "Failed to fetch data",
    };
  }
};

export const getIdeaPost = async (slugOrId) => {
    try {
        const postResponse = await apiFetch(`/idea/${slugOrId}`);
        return postResponse.ideaPost
    } catch (error) {
        console.error("Error fetching published idea post:", error);
        throw error
    }
}