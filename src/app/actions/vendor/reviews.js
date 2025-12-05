"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Fetch vendor review statistics
 * @param {string} vendorId
 * @returns {Promise<{averageRating:number,totalReviews:number,ratingBreakdown:Object} | {error:string}>}
 */
export const getReviewStats = async (vendorId) => {
  try {
    if (!vendorId) {
      return { error: "Vendor ID is required." };
    }

    const response = await apiFetch(`/vendors/review-stats/${vendorId}`, {
      role: "vendor",
    });

    // Backend should return error in response, handle gracefully
    if (response.error) {
      return {
        error: response.message || "Failed to fetch vendor review stats.",
      };
    }

    return {
      averageRating: response.averageRating ?? 0,
      totalReviews: response.totalReviews ?? 0,
      ratingBreakdown: response.ratingBreakdown ?? {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching vendor review stats:", error);

    return {
      error: "An unexpected error occurred while fetching review stats.",
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: {},
    };
  }
};

/**
 * Server Action: Flag a review for removal (vendor action)
 *
 * @param {string} reviewId - The review to flag.
 * @returns {Promise<{success?: boolean, message: string, error?: string}>}
 */
export const flagReviewForRemoval = async (reviewId) => {
  try {
    if (!reviewId) {
      return {
        error: "Review ID missing.",
        message: "Invalid review reference.",
      };
    }

    const response = await apiFetch(`/reviews/flag/${reviewId}`, {
      method: "PATCH",
      role: "vendor",
      auth: true
    });

    // Normalize backend shape
    if (!response || response.error || response.status >= 400) {
      return {
        error: response?.message || "Failed to flag review for removal.",
      };
    }

    // Revalidate vendor dashboard
    revalidatePath("/vendor/dashboard/reviews");

    return {
      success: true,
      message:
        response.message || "Review flagged successfully and pending review.",
    };

  } catch (error) {
    console.error("Server Action -> flagReviewForRemoval:", error);

    return {
      error: "Unexpected server issue while flagging review.",
      message: "Try again later.",
    };
  }
};

/**
 * Server Action: Unflag a review (remove flag - vendor action)
 *
 * @param {string} reviewId - The review to unflag.
 * @returns {Promise<{success?: boolean, message: string, error?: string}>}
 */
export const unflagReview = async (reviewId) => {
  try {
    if (!reviewId) {
      return {
        error: "Review ID missing.",
        message: "Invalid review reference.",
      };
    }

    const response = await apiFetch(`/reviews/unflag/${reviewId}`, {
      method: "PATCH",
      role: "vendor",
      auth: true
    });

    // Normalize backend shape
    if (!response || response.error || response.status >= 400) {
      return {
        error: response?.message || "Failed to unflag review.",
      };
    }

    // Revalidate vendor dashboard
    revalidatePath("/vendor/reviews");

    return {
      success: true,
      message:
        response.message || "Review flag removed successfully.",
    };

  } catch (error) {
    console.error("Server Action -> unflagReview:", error);

    return {
      error: "Unexpected server issue while unflagging review.",
      message: "Try again later.",
    };
  }
};
