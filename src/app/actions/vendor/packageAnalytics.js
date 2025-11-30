"use server";

import { apiFetch } from "@/lib/api";

/**
 * Track package interest (Know More button click)
 */
export async function trackPackageInterest(vendorId, packageId, packageName, sessionId) {
    try {
        const res = await apiFetch(`/analytics/package/interest`, {
            method: "POST",
            body: JSON.stringify({
                vendorId,
                packageId,
                packageName,
                sessionId,
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
                referrer: typeof document !== "undefined" ? document.referrer : "",
            }),
        });

        return {
            success: res.success || false,
        };
    } catch (error) {
        console.error("Error tracking package interest:", error);
        return {
            success: false,
        };
    }
}

/**
 * Get package interests over time
 */
export async function getPackageInterestsOverTime(timeframe = "1M") {
    try {
        const res = await apiFetch(
            `/analytics/package/interests-over-time?timeframe=${timeframe}`,
            {
                method: "GET",
                auth: true,
                role: "vendor"
            },
        );

        return {
            success: res.success || false,
            data: res.data || [],
            timeframe: res.timeframe || timeframe,
        };
    } catch (error) {
        console.error("Error fetching package interests over time:", error);
        return {
            success: false,
            data: [],
            message: error.message || "Failed to fetch package interests",
        };
    }
}

/**
 * Get interests by package
 */
export async function getInterestsByPackage(timeframe = "1M") {
    try {
        const res = await apiFetch(
            `/analytics/package/interests-by-package?timeframe=${timeframe}`,
            {
                method: "GET",
                auth: true,
                role: "vendor"
            }
        );

        return {
            success: res.success || false,
            data: res.data || [],
            timeframe: res.timeframe || timeframe,
        };
    } catch (error) {
        console.error("Error fetching interests by package:", error);
        return {
            success: false,
            data: [],
            message: error.message || "Failed to fetch interests by package",
        };
    }
}
