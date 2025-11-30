"use server";
import { apiFetch } from "@/lib/api";

/**
 * Get enquiries over time analytics
 */
export async function getEnquiriesOverTime(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/leads/enquiries-over-time?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch enquiries data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching enquiries over time:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch enquiries data.",
            data: [],
        };
    }
}

/**
 * Get lead source breakdown
 */
export async function getLeadSourceBreakdown(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/leads/lead-source?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch lead source data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching lead source breakdown:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch lead source data.",
            data: [],
        };
    }
}

/**
 * Get profile view source breakdown
 */
export async function getProfileViewSourceBreakdown(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/profile-view-source?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch profile view source data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching profile view source breakdown:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch profile view source data.",
            data: [],
        };
    }
}

/**
 * Get enquiries by event type
 */
export async function getEnquiriesByEventType(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/leads/by-event-type?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch event type data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching enquiries by event type:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch event type data.",
            data: [],
        };
    }
}

/**
 * Get enquiries by location
 */
export async function getEnquiriesByLocation(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/leads/by-location?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch location data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching enquiries by location:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch location data.",
            data: [],
        };
    }
}

/**
 * Get review insights
 */
export async function getReviewInsights() {
    try {
        const res = await apiFetch(`/analytics/reviews/insights`, {
            method: "GET",
            role: "vendor",
            auth: true,
        });

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch review insights.",
                data: null,
            };
        }

        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        console.error("Error fetching review insights:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch review insights.",
            data: null,
        };
    }
}

/**
 * Track profile view (public - no auth required)
 */
export async function trackProfileView(vendorId, sessionId, referrer = "", source = "direct") {
    try {
        const res = await apiFetch(`/analytics/track-view`, {
            method: "POST",
            body: JSON.stringify({ vendorId, sessionId, referrer, source }),
        });

        return {
            success: res.success || false,
            recorded: res.recorded || false,
        };
    } catch (error) {
        console.error("Error tracking profile view:", error);
        return {
            success: false,
            recorded: false,
        };
    }
}

/**
 * Get profile views over time
 */
export async function getProfileViewsOverTime(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/profile-views?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch profile views data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching profile views:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch profile views data.",
            data: [],
        };
    }
}

/**
 * Get profile views vs enquiries
 */
export async function getViewsVsEnquiries(timeframe = "6M") {
    try {
        const res = await apiFetch(
            `/analytics/views-vs-enquiries?timeframe=${timeframe}`,
            {
                method: "GET",
                role: "vendor",
                auth: true,
            }
        );

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch comparison data.",
                data: [],
            };
        }

        return {
            success: true,
            data: res.data || [],
            timeframe: res.timeframe,
        };
    } catch (error) {
        console.error("Error fetching views vs enquiries:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch comparison data.",
            data: [],
        };
    }
}

/**
 * Get overview stats
 */
export async function getOverviewStats() {
    try {
        const clientDate = new Date().toISOString();
        const res = await apiFetch(`/analytics/vendor/overview-stats?clientDate=${clientDate}`, {
            method: "GET",
            role: "vendor",
            auth: true,
            cache: "no-store",
        });

        if (!res.success) {
            return {
                success: false,
                message: res.message || "Failed to fetch overview stats.",
                data: null,
            };
        }

        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        console.error("Error fetching overview stats:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch overview stats.",
            data: null,
        };
    }
}

/**
 * Track WhatsApp click
 */
export async function trackWhatsAppClick(vendorId) {
    try {
        const res = await apiFetch(`/analytics/track-whatsapp`, {
            method: "POST",
            body: JSON.stringify({ vendorId }),
        });

        return { success: res.success || false };
    } catch (error) {
        console.error("Error tracking WhatsApp click:", error);
        return { success: false };
    }
}
