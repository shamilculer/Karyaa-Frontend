"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getFlaggedReviews = async (page = 1, limit = 10, status = "All", search = "") => {
    try {
        let query = `?page=${page}&limit=${limit}`;
        if (status && status !== "All") query += `&status=${status}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;

        const response = await apiFetch(`/reviews/admin/flagged${query}`, {
            auth: true,
            role: 'admin'
        });

        if (response.error) {
            return { error: response.message || "Failed to fetch flagged reviews" };
        }

        return response;
    } catch (error) {
        console.error("Error fetching flagged reviews:", error);
        return { error: "An unexpected error occurred" };
    }
};

export const adminUpdateReview = async (reviewId, data) => {
    try {
        const response = await apiFetch(`/reviews/admin/${reviewId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            auth: true,
            role: 'admin'
        });

        if (response.error) {
            return { error: response.message || "Failed to update review" };
        }

        revalidatePath("/admin/flagged-reviews");
        revalidatePath("/admin/review-management");
        return { success: true, message: response.message };
    } catch (error) {
        console.error("Error updating review:", error);
        return { error: "An unexpected error occurred" };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await apiFetch(`/reviews/admin/${reviewId}`, {
            method: "DELETE",
            auth: true,
            role: 'admin'
        });

        if (response.error) {
            return { error: response.message || "Failed to delete review" };
        }

        revalidatePath("/admin/flagged-reviews");
        revalidatePath("/admin/review-management");
        return { success: true, message: response.message };
    } catch (error) {
        console.error("Error deleting review:", error);
        return { error: "An unexpected error occurred" };
    }
};

export const getAllReviews = async (page = 1, limit = 10, status = "All", search = "", flagged = false) => {
    try {
        let query = `?page=${page}&limit=${limit}`;
        if (status && status !== "All") query += `&status=${status}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (flagged) query += `&flagged=true`;

        const response = await apiFetch(`/reviews/admin/all${query}`, {
            auth: true,
            role: 'admin'
        });

        if (response.error) {
            return { error: response.message || "Failed to fetch reviews" };
        }

        return response;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { error: "An unexpected error occurred" };
    }
};
