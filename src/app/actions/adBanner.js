"use server";

import { apiFetch } from "@/lib/api";

export const getActiveBanners = async (placement) => {
    try {
        const queryString = placement ? `?placement=${encodeURIComponent(placement)}` : '';
        
        const response = await apiFetch(`/banners/${queryString}`);

        if (!response.success) {
            return {
                success: false,
                data: [],
                message: response.message || "Failed to retrieve active banners from API."
            };
        }

        return {
            success: true,
            data: response.data || [],
            message: "Active banners fetched successfully."
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Network or Server Action error: " + error.message,
        };
    }
}