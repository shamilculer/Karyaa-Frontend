// src/app/(client)/actions/auth.js

"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Register a new user
 * Calls Express backend, receives tokens, sets httpOnly cookies
 */
export async function registerUser(data) {
    try {
        // Use apiFetch without credentials (public endpoint)
        const response = await apiFetch('/user/auth/create', {
            method: 'POST',
            body: data,
        });

        const { user, accessToken, refreshToken } = response;

        // Set httpOnly cookies in Next.js
        const cookieStore = await cookies();
        
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return user;
    } catch (err) {
        console.error('Registration failed:', err.message);
        throw err;
    }
}

/**
 * Login user
 * Validates credentials with Express, receives tokens, sets httpOnly cookies
 */
export const loginUser = async (data) => {
    try {
        // Use apiFetch without credentials (public endpoint)
        const response = await apiFetch('/user/auth/login', {
            method: 'POST',
            body: data,
        });

        const { user, accessToken, refreshToken } = response;

        // Set httpOnly cookies in Next.js
        const cookieStore = await cookies();
        
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
            path: '/',
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return user;
    } catch (err) {
        console.error('Login failed:', err.message);
        throw err;
    }
};

/**
 * Logout user
 * Clears httpOnly cookies from Next.js
 */
export const logoutUser = async () => {
    try {
        const cookieStore = await cookies();
        
        // Clear auth-related cookies
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error("Logout Failed:", error.message);
        throw error;
    }
};

/**
 * Check authentication status
 * apiFetch automatically handles token refresh if accessToken expired
 */
export async function checkAuthStatus() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        // If no tokens at all, user is not authenticated
        if (!accessToken && !refreshToken) {
            return { isAuthenticated: false, user: null };
        }

        const data = await apiFetch('/user/auth/session', {
            credentials: 'include',
        });
        
        return { isAuthenticated: true, user: data.user };
    } catch (error) {
        console.error('Auth check failed:', error);
        return { isAuthenticated: false, user: null };
    }
}

/**
 * @desc Fetches the list of vendors saved by the currently authenticated user.
 * @returns {Promise<{data: Array<Object>} | {error: string}>}
 */
export const getSavedVendors = async () => {
    try {
        const url = `/user/saved-vendors`; 
        
        const responseData = await apiFetch(url, {
            credentials: "include"
        }); 
        
        return {
            data: responseData.data?.savedVendors || [],
        };
        
    } catch (error) {
        console.error("Server Action: Error fetching saved vendors:", error);

        const errorMessage = error.message || "Could not retrieve your saved vendors list.";
        
        return {
            error: errorMessage,
            data: [],
        };
    }
}


/**
 * @desc Toggles a vendor's ID in the current user's savedVendors list.
 * @param {string} vendorId - The MongoDB ID of the vendor to save/unsave.
 * @returns {Promise<{success: boolean, message: string, saved: boolean} | {error: string}>}
 */
export const toggleSavedVendor = async (vendorId) => {
    if (!vendorId) {
        return { error: "Vendor ID is required.", success: false };
    }
    
    try {
        const url = `/user/saved-vendors/toggle`; 
        
        const response = await apiFetch(url, {
            method: 'PATCH', 
            body: { vendorId },
            credentials: "include"
        });
        
        revalidatePath('/vendors'); 
        
        return {
            success: true,
            message: response.message,
            saved: response.saved, 
        };
        
    } catch (error) {
        console.error("Server Action: Error toggling saved vendor:", error);
        
        const errorMessage = error.message || "Failed to update saved vendor list.";
        
        return {
            error: errorMessage,
            success: false,
        };
    }
};
// -----------------------------------------------------------------------------------