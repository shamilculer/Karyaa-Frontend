"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { decodeJWT } from "@/utils/decodeJWT";

/**
 * Register a new user
 * Calls Express backend, receives tokens, sets httpOnly cookies
 */
export async function registerUser(data) {
    try {
        // Public endpoint - no auth required
        const response = await apiFetch('/user/auth/create', {
            method: 'POST',
            body: data, // Auto-stringified by apiFetch
        });

        const { user, accessToken, refreshToken } = response;

        // Set httpOnly cookies
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('accessToken_user', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        cookieStore.set('refreshToken_user', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return { success: true, user };
    } catch (error) {
        console.error('Registration failed:', error.message);
        return {
            success: false,
            error: error.message || 'Registration failed'
        };
    }
}

/**
 * Login user
 * Validates credentials with Express, receives tokens, sets httpOnly cookies
 */
export async function loginUser(data) {
    try {
        // Public endpoint - no auth required
        const response = await apiFetch('/user/auth/login', {
            method: 'POST',
            body: data, // Auto-stringified by apiFetch
        });

        const { user, accessToken, refreshToken } = response;

        // Set httpOnly cookies
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('accessToken_user', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes (match your token expiry)
            path: '/',
        });

        cookieStore.set('refreshToken_user', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return { success: true, user };
    } catch (error) {
        console.error('Login failed:', error.message);
        return {
            success: false,
            error: error.message || 'Login failed'
        };
    }
}

/**
 * Logout user
 * Clears httpOnly cookies and redirects to login
 */
export async function logoutUser() {
    const cookieStore = await cookies();

    // Clear auth-related cookies
    cookieStore.delete('accessToken_user');
    cookieStore.delete('refreshToken_user');

    // Redirect to login page
    redirect('/auth/login');
}

/**
 * Check authentication status (FAST - no backend call)
 * Decodes JWT locally instead of making expensive API calls
 */
export async function checkAuthStatus(role = 'user') {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(`accessToken_${role}`)?.value;
        const refreshToken = cookieStore.get(`refreshToken_${role}`)?.value;

        if (!accessToken && !refreshToken) {
            return { isAuthenticated: false, user: null };
        }

        // Decode JWT to get user info (no backend call!)
        const user = decodeJWT(accessToken || refreshToken);

        if (!user) {
            return { isAuthenticated: false, user: null };
        }

        return {
            isAuthenticated: true,
            user
        };
    } catch (error) {
        console.error('Auth check failed:', error);
        return { isAuthenticated: false, user: null };
    }
}

/**
 * Fetch the list of vendors saved by the authenticated user
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getSavedVendors() {
    try {
        const responseData = await apiFetch('/user/saved-vendors', {
            auth: true,
            role: 'user',
        });

        return {
            success: true,
            data: responseData.data?.savedVendors || [],
        };
    } catch (error) {
        console.error("Error fetching saved vendors:", error);

        return {
            success: false,
            error: error.message || "Could not retrieve your saved vendors list.",
            data: [],
        };
    }
}

/**
 * Toggle a vendor in the user's saved list
 * @param {string} vendorId - The MongoDB ID of the vendor
 * @returns {Promise<{success: boolean, message?: string, saved?: boolean, error?: string}>}
 */
export async function toggleSavedVendor(vendorId) {
    if (!vendorId) {
        return {
            success: false,
            error: "Vendor ID is required."
        };
    }

    try {
        const response = await apiFetch('/user/saved-vendors/toggle', {
            method: 'PATCH',
            body: { vendorId }, // Auto-stringified by apiFetch
            auth: true,
            role: 'user',
        });

        // Revalidate relevant pages
        revalidatePath('/vendors');
        revalidatePath('/saved-vendors');

        return {
            success: true,
            message: response.message,
            saved: response.saved,
        };
    } catch (error) {
        console.error("Error toggling saved vendor:", error);

        return {
            success: false,
            error: error.message || "Failed to update saved vendor list.",
        };
    }
}