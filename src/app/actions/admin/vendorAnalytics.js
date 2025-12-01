"use server";

import { apiFetch } from "@/lib/api";

// Get top performing vendors
export async function getTopPerformingVendors(timeframe = "1M", limit = 5) {
    try {
        const data = await apiFetch(`/admin/analytics/platform/top-vendors?timeframe=${timeframe}&limit=${limit}`, {
            role: "admin",
            auth: true,
        });
        return data;
    } catch (error) {
        console.error("Error fetching top performing vendors:", error);
        return { success: false, message: error.message };
    }
}

// Get vendor status summary
export async function getVendorStatusSummary() {
    try {
        const data = await apiFetch(`/admin/analytics/platform/vendor-summary`, {
            role: "admin",
            auth: true,
        });
        return data;
    } catch (error) {
        console.error("Error fetching vendor status summary:", error);
        return { success: false, message: error.message };
    }
}
