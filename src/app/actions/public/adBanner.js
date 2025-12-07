"use server";

import { apiFetch } from "@/lib/api";

export const getActiveBanners = async (placement) => {
    try {
        console.log('🔍 Fetching banners for placement:', placement);
        const queryString = placement ? `?placement=${encodeURIComponent(placement)}` : '';

        const response = await apiFetch(`/banners/${queryString}`, { cache: 'no-store' });

        if (!response.success) {
            console.log('❌ Failed to fetch banners:', response.message);
            return {
                success: false,
                data: [],
                message: response.message || "Failed to retrieve active banners from API."
            };
        }

        console.log('✅ Banners fetched:', response.data?.length || 0, 'banner(s)');
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