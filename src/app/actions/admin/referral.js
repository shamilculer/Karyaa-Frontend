"use server";
import { apiFetch } from "@/lib/api";

const buildQueryString = (params) => {
    if (!params) return '';
    const query = new URLSearchParams();
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            query.append(key, String(params[key]));
        }
    }
    return query.toString();
};

export const getReferralsAction = async (params = {}) => {
    try {
        const queryString = buildQueryString(params);
        const url = `/admin/referrals${queryString ? '?' + queryString : ''}`;

        const response = await apiFetch(url, {
            method: 'GET',
            role: "admin",
            auth: true
        });

        if (response.error || !response.success) {
            return {
                error: response.message || "Failed to fetch referral data.",
            };
        }

        return {
            data: response.data || [],
            pagination: response.pagination || {},
        };
    } catch (error) {
        console.error("Error fetching referrals:", error);
        return {
            error: "An unexpected error occurred while fetching referrals.",
        };
    }
};

export const updateReferralStatusAction = async (data) => {
    try {
        const { ids, status } = data;

        if (!ids || (Array.isArray(ids) && ids.length === 0)) {
            return {
                error: "Invalid request. 'ids' is required.",
            };
        }

        if (!status || !["Pending", "Completed", "Canceled"].includes(status)) {
            return {
                error: "Invalid status. Must be 'Pending', 'Completed', or 'Canceled'.",
            };
        }

        const response = await apiFetch('/admin/referrals/status', {
            method: 'PATCH',
            role: "admin",
            auth: true,
            body: JSON.stringify({ ids, status })
        });

        if (response.error || !response.success) {
            return {
                error: response.message || "Failed to update referral status.",
            };
        }

        return {
            success: true,
            message: response.message,
            data: response.data || {},
        };
    } catch (error) {
        console.error("Error updating referral status:", error);
        return {
            error: "An unexpected error occurred while updating referral status.",
        };
    }
};

export const deleteReferralsAction = async (data) => {
    try {
        const { ids } = data;

        if (!ids || (Array.isArray(ids) && ids.length === 0)) {
            return {
                error: "Invalid request. 'ids' is required.",
            };
        }

        const response = await apiFetch('/admin/referrals/delete', {
            method: 'DELETE',
            role: "admin",
            auth: true,
            body: JSON.stringify({ ids })
        });

        if (response.error || !response.success) {
            return {
                error: response.message || "Failed to delete referral(s).",
            };
        }

        return {
            success: true,
            message: response.message,
            data: response.data || {},
        };
    } catch (error) {
        console.error("Error deleting referrals:", error);
        return {
            error: "An unexpected error occurred while deleting referral(s).",
        };
    }
};
