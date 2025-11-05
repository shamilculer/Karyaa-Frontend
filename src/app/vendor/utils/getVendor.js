"use server"

import { decodeJWT } from "@/utils/decodeJWT";
import { cookies } from "next/headers";

/**
 * Get vendor data from JWT token (NO BACKEND REQUEST)
 * This is FAST and efficient for displaying vendor info
 * 
 * @returns {Promise<{success: boolean, vendor: object|null, isAuthenticated: boolean}>}
 */
export async function getVendorFromToken() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken_vendor')?.value;
        const refreshToken = cookieStore.get('refreshToken_vendor')?.value;

        // No tokens at all
        if (!accessToken && !refreshToken) {
            return {
                success: true,
                isAuthenticated: false,
                vendor: null
            };
        }

        let vendorData = decodeJWT(accessToken);

        if (!vendorData && refreshToken) {
            vendorData = decodeJWT(refreshToken);
        }

        // Still no valid data
        if (!vendorData) {
            return {
                success: true,
                isAuthenticated: false,
                vendor: null
            };
        }

        // Return vendor data from token payload
        // Note: The exact structure depends on what your backend puts in the JWT
        return {
            success: true,
            isAuthenticated: true,
            vendor: vendorData
        };
    } catch (error) {
        console.error('Error getting vendor from token:', error);
        return {
            success: false,
            isAuthenticated: false,
            vendor: null,
            error: error.message
        };
    }
}