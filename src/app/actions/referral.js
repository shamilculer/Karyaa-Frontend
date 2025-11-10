"use server";

import { apiFetch } from "@/lib/api";

export const postReferral = async (data) => {
    try {
        const referralResponse = await apiFetch("/referrals/new", {
            method: "POST",
            body: data,
        });

        if (referralResponse.success === false) {
            // Throw an error to be caught below, propagating the backend message
            throw new Error(referralResponse.message || "Referral submission failed.");
        }

        return {
            status: 201,
            message: referralResponse.message || "Referral sent successfully!",
            newReferral: referralResponse.data, 
        };

    } catch (error) {
        // --- COMPLETED CATCH BLOCK ---
        console.error("Server Action Error (postReferral):", error);
        
        // Use a default message if the error object doesn't have a clear message
        const errorMessage = error.message || "An unexpected error occurred during referral submission.";

        return {
            status: error.status || 500,
            error: errorMessage,
            newReferral: null,
        };
    }
};