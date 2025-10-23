"use server";

import { apiFetch } from "@/lib/api";

/**
 * @description Server action to post a new lead/inquiry to the backend API.
 * @param {object} data - The lead data object.
 * @returns {object} - An object containing status and message/error.
 */
export const postLead = async (data) => {
    try {
        const leadResponse = await apiFetch("/leads/new", {
            method: "POST",
            body: data,
            credentials: "include"
        });

        if (leadResponse.success === false) {
             throw new Error(leadResponse.message || "Lead submission failed.");
        }

        return {
            status: 201,
            message: leadResponse.message || "Inquiry sent successfully!",
            newLead: leadResponse.data, 
        };

    } catch (error) {
        // --- COMPLETED CATCH BLOCK ---
        console.error("Server Action Error (postLead):", error);
        const errorMessage = error.message || "An unexpected error occurred during submission.";

        return {
            status: error.status || 500,
            error: errorMessage,
            newLead: null,
        };
    }
};