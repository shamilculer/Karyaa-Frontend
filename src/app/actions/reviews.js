"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Server Action to fetch approved reviews for a specific vendor.
 * It assumes the backend endpoint is structured to return an object 
 * containing a 'reviews' array and a 'count'.
 * * @param {string} vendorId The ID of the vendor to fetch reviews for.
 * @returns {Promise<{reviews: Array<Object>, count: number} | {error: string}>} The reviews data or an error object.
 */
export const getVendorReviews = async (vendorId) => {
    try {
        const reviewsResponse = await apiFetch(`/reviews/vendor/${vendorId}`);

        if (reviewsResponse.error) {
            return { 
                error: reviewsResponse.message || "Failed to fetch vendor reviews from the API." 
            };
        }

        return {
            reviews: reviewsResponse.reviews || [],
            count: reviewsResponse.count || 0
        };

    } catch (error) {
        console.error(`Error fetching reviews for vendor ${vendorId}:`, error);
        
        return {
            reviews: [],
            count: 0,
            error: "An unexpected error occurred while loading reviews."
        };
    }
};


/**
 * Server Action to submit a new review for a vendor.
 * This action handles the 'review already added' error returned by the backend.
 * * @param {string} vendorId The ID of the vendor being reviewed.
 * @param {Object} reviewData The data for the review ({ rating: number, comment: string }).
 * @returns {Promise<{review: Object, message: string} | {error: string, message?: string}>} The created review or an error object.
 */
export const createReview = async (vendorId, reviewData) => {
    try {
        const response = await apiFetch(`/reviews/new/${vendorId}`, {
            method: "POST",
            body: JSON.stringify(reviewData),
            credentials: "include"
        });

        if (response.error || response.status >= 400) {
            return { 
                error: response.message || "Failed to submit review due to an API error." 
            };
        }
        
        // 3. Invalidate the cache for the vendor's page
        revalidatePath(`/vendors/${vendorId}`); 

        // 4. Return the successful response from the backend
        return { 
            review: response.review,
            message: response.message || "Review submitted successfully and vendor statistics updated." 
        };

    } catch (error) {
        // 5. Handle unexpected network errors or other exceptions
        console.error(`Error in createReview Server Action for vendor ${vendorId}:`, error);
        
        return {
            error: "An unexpected error occurred while submitting your review.",
            message: "An unexpected error occurred. Please check your connection."
        };
    }
};