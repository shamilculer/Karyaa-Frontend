"use server";

import { apiFetch } from "@/lib/api";

export const subscribeToNewsletterAction = async (data) => {
    try {
        const response = await apiFetch(
            "/newsletter/subscribe",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        return {
            success: true,
            message: "Thank you for subscribing! Please check your email for confirmation.",
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Failed to subscribe. Please try again.",
        };
    }
};
