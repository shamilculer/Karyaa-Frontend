"use server"

import { decodeJWT } from "@/utils/decodeJWT";
import { cookies } from "next/headers";

/**
 * Get Admin data from JWT token (NO BACKEND REQUEST)
 * This is FAST and efficient for displaying Admin info
 * 
 * @returns {Promise<{success: boolean, Admin: object|null, isAuthenticated: boolean}>}
 */
export async function getAdminFromToken() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken_admin')?.value;
        const refreshToken = cookieStore.get('refreshToken_admin')?.value;

        // No tokens at all
        if (!accessToken && !refreshToken) {
            return {
                success: true,
                isAuthenticated: false,
                admin: null
            };
        }

        let adminData = decodeJWT(accessToken);

        if (!adminData && refreshToken) {
            adminData = decodeJWT(refreshToken);
        }

        // Still no valid data
        if (!adminData) {
            return {
                success: true,
                isAuthenticated: false,
                admin: null
            };
        }

        // Return admin data from token payload
        // Note: The exact structure depends on what your backend puts in the JWT
        return {
            success: true,
            isAuthenticated: true,
            admin: adminData
        };
    } catch (error) {
        console.error('Error getting admin from token:', error);
        return {
            success: false,
            isAuthenticated: false,
            admin: null,
            error: error.message
        };
    }
}