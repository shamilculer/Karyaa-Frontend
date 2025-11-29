"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Server Action to fetch paginated approved reviews for a vendor.
 *
 * @param {string} vendorId The ID of the vendor to fetch reviews for.
 * @param {number} page The current page number (default: 1)
 * @param {number} limit Number of reviews per page (default: 10)
 * @param {number | null} ratingFilter Optional star rating filter (1-5)
 * @returns {Promise<{
*   reviews: Array<Object>,
*   count: number,
*   page: number,
*   limit: number,
*   totalReviews: number,
*   totalPages: number,
*   error?: string
* }>}
*/
export const getVendorReviews = async (vendorId, page = 1, limit = 10, ratingFilter = null) => {
    try {
        // build query params
        let query = `?page=${page}&limit=${limit}`;

        if (ratingFilter && Number(ratingFilter) >= 1 && Number(ratingFilter) <= 5) {
            query += `&rating=${ratingFilter}`;
        }

        const reviewsResponse = await apiFetch(
            `/reviews/vendor/${vendorId}${query}`
        );

        if (reviewsResponse.error) {
            return {
                error: reviewsResponse.message || "Failed to fetch vendor reviews from the API."
            };
        }

        return {
            reviews: reviewsResponse.reviews || [],
            count: reviewsResponse.count || 0,
            page: reviewsResponse.page,
            limit: reviewsResponse.limit,
            totalReviews: reviewsResponse.totalReviews,
            totalPages: reviewsResponse.totalPages
        };

    } catch (error) {
        console.error(`Error fetching reviews for vendor ${vendorId}:`, error);

        return {
            reviews: [],
            count: 0,
            page: 1,
            limit,
            totalReviews: 0,
            totalPages: 0,
            error: "An unexpected error occurred while loading reviews."
        };
    }
};


/**
 * Server Action to fetch ALL (paginated + filtered + searchable)
 * vendor reviews across any status.
 *
 * @param {string} vendorId
 * @param {number} page
 * @param {number} limit
 * @param {number | null} ratingFilter   (1-5)
 * @param {string | null} searchTerm
 * @param {"Approved"|"Pending"|"Rejected"|"all"|null} statusFilter
 *
 * @returns {Promise<{
*   reviews: Array<Object>,
*   count: number,
*   page: number,
*   limit: number,
*   totalReviews: number,
*   totalPages: number,
*   ratingFilter?: any,
*   statusFilter?: any,
*   search?: string,
*   error?: string
* }>}
*/
export const getAllVendorReviews = async (
    vendorId,
    page = 1,
    limit = 10,
    ratingFilter = null,
    searchTerm = "",
    statusFilter = "all"
) => {
    try {
        // Build query params
        let query = `?page=${page}&limit=${limit}`;

        // ✅ include rating filter if valid
        if (ratingFilter && Number(ratingFilter) >= 1 && Number(ratingFilter) <= 5) {
            query += `&rating=${ratingFilter}`;
        }

        // ✅ include search term
        if (searchTerm && searchTerm.trim().length > 0) {
            query += `&search=${encodeURIComponent(searchTerm.trim())}`;
        }

        // ✅ include status if not "all"
        if (
            statusFilter &&
            statusFilter !== "all" &&
            ["Pending", "Approved", "Rejected"].includes(statusFilter)
        ) {
            query += `&status=${statusFilter}`;
        }

        const reviewsResponse = await apiFetch(
            `/reviews/vendor/all/${vendorId}${query}`,
            {
                role: "vendor",
                auth: true
            }
        );

        if (reviewsResponse.error) {
            return {
                error:
                    reviewsResponse.message ||
                    "Failed to fetch vendor reviews from the API.",
            };
        }

        return {
            reviews: reviewsResponse.reviews || [],
            count: reviewsResponse.count || 0,
            page: reviewsResponse.page,
            limit: reviewsResponse.limit,
            totalReviews: reviewsResponse.totalReviews,
            totalPages: reviewsResponse.totalPages,
            ratingFilter: reviewsResponse.ratingFilter,
            statusFilter: reviewsResponse.statusFilter,
            search: reviewsResponse.searchTerm,
        };
    } catch (error) {
        console.error(
            `Error fetching vendor reviews for vendor ${vendorId}:`,
            error
        );

        return {
            reviews: [],
            count: 0,
            page: 1,
            limit,
            totalReviews: 0,
            totalPages: 0,
            error: "An unexpected error occurred while loading reviews.",
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
            auth: true
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
            message: response.message || "Review submitted successfully."
        };

    } catch (error) {

        console.log(error)

        return {
            error: error || "An unexpected error occurred while submitting your review.",
        };
    }
};