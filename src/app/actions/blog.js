"use server"

import { apiFetch } from "@/lib/api";

export const getPublishedBlogPosts = async ({ limit = 15, page = 1 }) => { 
    try {
        const params = new URLSearchParams();
        
        params.append('limit', limit);
        
        params.append('page', page); 

        const url = `/blog/published?${params.toString()}`;

        const blogResponse = await apiFetch(url); 
        
        return blogResponse;

    } catch(error) {
        console.error("Error fetching published blog posts:", error);
        return {
            success: false,
            blogs: [],
            total: 0,
            totalPages: 0,
            currentPage: page,
            error: error.message || "Failed to fetch data"
        };
    }
}

export const getBlogPost = async (nameOrSlug) => {
    try {
        const postResponse = await apiFetch(`/blog/${nameOrSlug}`);
        return postResponse.blog
    } catch (error) {
        console.error("Error fetching published blog post:", error);
        throw error
    }
}