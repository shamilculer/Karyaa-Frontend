"use server"

import { apiFetch } from "@/lib/api";

export async function submitReviewAction(formData) {
    try {
        const res = await apiFetch(`/reviews/public/new`, {
            method: "POST",
            body: formData,
        });

        // Check if there's an error in the response
        if (res?.error || !res?.message) {
            return { success: false, error: res?.message || "Failed to submit review." };
        }

        return { success: true, message: res.message };

    } catch (err) {
        console.error("SUBMIT REVIEW ACTION ERROR:", err);
        // Extract error message from the error object if available
        const errorMessage = err?.message || "Something went wrong while submitting review.";
        return { success: false, error: errorMessage };
    }
}
