"use server";
import { apiFetch } from "@/lib/api";

/**
 * Fetch active bundles for registration
 * @returns {Promise<{bundles: Array} | {error: string}>}
 */
export const getBundleOptions = async () => {
  try {
    const response = await apiFetch('/bundles/registration-options', {
      method: 'GET',
    });

    if (response.error || !response.success) {
      return {
        error: response.message || "Failed to fetch bundle options.",
        bundles: []
      };
    }

    return {
      bundles: response.data || []
    };
  } catch (error) {
    console.error("Error fetching bundle options:", error);
    return {
      error: "An unexpected error occurred while fetching bundles.",
      bundles: []
    };
  }
};

export const getAllActiveBundles = async () => {
  try {
    const response = await apiFetch('/bundles/active', {
      role: "vendor",
      auth: true
    });

    if (response.error || !response.success) {
      return {
        error: response.message || "Failed to fetch all active bundles.",
        bundles: []
      };
    }

    return {
      success: true,
      bundles: response.data || []
    };
  } catch (error) {
    console.error("Error fetching all active bundles:", error);
    return {
      error: "An unexpected error occurred while fetching bundles.",
      bundles: []
    };
  }
};

export const sendBundleEnquiryAction = async (bundleId) => {
    try {
        const responseData = await apiFetch('/bundles/enquiry', {
            method: 'POST',
            body: {
              bundle : bundleId
            },
            auth: true,
            role: "vendor"
        });

        if (responseData.success) {
            return {
                success: true,
                message: responseData.message || "Your bundle enquiry has been successfully sent! We will connect with you shortly.",
            };
        } else {
            return {
                success: false,
                message: responseData.message || "Failed to submit enquiry. Please try again.",
            };
        }

    } catch (error) {
        return {
            success: false,
            message: "An unexpected system error occurred while submitting your enquiry.",
        };
    }
};

export const getVendorSubscriptionStatusAction = async () => {
  try {
    const response = await apiFetch('/bundles/status', {
      method: 'GET',
      role: "vendor",
      auth: true
    });

    if (response.error || !response.success) {
      return {
        error: response.message || "Failed to fetch vendor subscription status.",
      };
    }

    return {
      data: response.data || {},
    };
  } catch (error) {
    console.error("Error fetching vendor subscription status:", error);
    return {
      error: "An unexpected error occurred while fetching your subscription details.",
    };
  }
};