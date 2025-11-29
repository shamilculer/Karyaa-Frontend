"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Helper function to clear auth cookies for a specific role and redirect.
 * This pattern ensures cookie mutations are finalized before redirect() is called.
 * @param {string} role - 'user' | 'vendor' | 'admin'
 * @param {string} path - The path to redirect to (e.g., '/auth/login')
 */
function clearAuthAndRedirect(role, path) {
    const cookieStore = cookies();

    // Clear the specific role-based cookies
    cookieStore.delete(`accessToken_${role}`);
    cookieStore.delete(`refreshToken_${role}`);

    // Perform the redirect, which must be the last step
    redirect(path);
}

/**
 * Get login URL for a role
 */
function getLoginUrl(role) {
    const loginUrls = {
        user: '/auth/login',
        vendor: '/auth/vendor/login',
        admin: '/auth/admin/login',
    };
    return loginUrls[role] || '/auth/login';
}

/**
 * Universal API wrapper for server-side requests
 * Handles multi-tenant auth (user/vendor/admin)
 * * @param {string} url - API endpoint
 * @param {object} options - Request options
 * @param {string} [options.role='user'] - 'user' | 'vendor' | 'admin'
 * @param {boolean} [options.auth=false] - Require authentication
 * @param {number} [options.retries=1] - Retry attempts
 */
export async function apiFetch(url, options = {}) {
    const {
        role = 'user',
        auth = false,
        retries = 1,
        ...fetchOptions
    } = options;

    const fullUrl = url.startsWith('/')
        ? `${process.env.BACKEND_URL}${url}`
        : url;

    // Get cookie store ONCE at the beginning - this is crucial!
    const cookieStore = await cookies();

    // Get tokens if auth required
    let accessToken = null;
    let refreshToken = null;

    if (auth) {
        accessToken = cookieStore.get(`accessToken_${role}`)?.value;
        refreshToken = cookieStore.get(`refreshToken_${role}`)?.value;

        if (!accessToken && !refreshToken) {
            // Return error object instead of redirecting
            // This allows client components to show proper toast messages
            return {
                success: false,
                error: 'Authentication required. Please log in to continue.',
                requiresAuth: true,
                redirectTo: getLoginUrl(role)
            };
        }
    }

    // Smart body handling - stringify objects, leave strings/FormData alone
    let body = fetchOptions.body;
    let contentType = 'application/json';

    if (body) {
        if (typeof body === 'string') {
            contentType = 'application/json';
        } else if (body instanceof FormData) {
            contentType = null; // Browser handles it
        } else if (body instanceof URLSearchParams) {
            contentType = 'application/x-www-form-urlencoded';
        } else {
            body = JSON.stringify(body);
            contentType = 'application/json';
        }
    }

    const headers = {
        ...(contentType && { 'Content-Type': contentType }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...fetchOptions.headers,
    };

    // Attempt request with retries
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(fullUrl, {
                ...fetchOptions,
                headers,
                body,
                cache: fetchOptions.method !== 'GET' ? 'no-store' : fetchOptions.cache,
            });

            // Handle 401 - try token refresh once
            if (response.status === 401 && auth && refreshToken) {
                // Try to refresh the token
                const refreshResponse = await fetch(`${process.env.BACKEND_URL}/util/refresh-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

                    // Update cookies using the SAME cookieStore instance
                    const isProduction = process.env.NODE_ENV === 'production';

                    cookieStore.set(`accessToken_${role}`, newAccessToken, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: 'lax',
                        maxAge: 15 * 60,
                        path: '/',
                    });

                    cookieStore.set(`refreshToken_${role}`, newRefreshToken, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: 'lax',
                        maxAge: 30 * 24 * 60 * 60,
                        path: '/',
                    });

                    // Retry original request with new token
                    const retryResponse = await fetch(fullUrl, {
                        ...fetchOptions,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                        body,
                    });

                    if (retryResponse.ok) {
                        return await retryResponse.json().catch(() => ({}));
                    }
                }

                // Refresh failed - return error object instead of redirecting
                return {
                    success: false,
                    error: 'Session expired. Please log in again.',
                    requiresAuth: true,
                    redirectTo: getLoginUrl(role)
                };
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json().catch(() => ({}));

        } catch (error) {
            if (error.message === 'NEXT_REDIRECT') throw error;

            const isNetworkError = error.name === 'FetchError' || error.message.includes('network');
            if (isNetworkError && attempt < retries) {
                await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
                continue;
            }

            throw error;
        }
    }
}