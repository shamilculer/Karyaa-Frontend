"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthError } from '@/utils/error';

/**
 * Universal fetch wrapper for ALL API calls (internal backend or external APIs).
 * Automatically handles:
 * - JWT token injection from cookies (only when credentials: 'include')
 * - 401 error handling (clear cookies + redirect)
 * - Network retry logic
 * - Consistent error handling
 * 
 * @param {string} url - Full URL or API path (e.g. '/user/auth/register', 'https://api.example.com/data')
 * @param {object} [options={}] - Fetch options
 * @param {string} [options.method] - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {object|string} [options.body] - Request body
 * @param {object} [options.headers] - Additional headers
 * @param {string} [options.credentials] - 'include' | 'omit' | 'same-origin' (default: 'omit')
 * @param {boolean} [options.redirectOn401=true] - Auto-redirect to login on 401 (default: true)
 * @param {number} [options.retries=1] - Max retry attempts for network errors
 * @returns {Promise<object>} Parsed JSON response data
 */
export async function apiFetch(url, options = {}) {
    // Determine if this is an internal API call or external
    const isInternalAPI = url.startsWith('/');
    
    // Build full URL for internal APIs
    const fullUrl = isInternalAPI 
        ? `${process.env.BACKEND_URL}${url}`
        : url;

    if (isInternalAPI && !process.env.BACKEND_URL) {
        throw new Error("❌ BACKEND_URL environment variable is not set.");
    }

    // Check if credentials should be included
    const includeCredentials = options.credentials === 'include';

    // Get accessToken from cookies only if credentials: 'include'
    let accessToken = null;
    if (includeCredentials) {
        const cookieStore = await cookies();
        accessToken = cookieStore.get('accessToken')?.value;
    }

    // Default headers
    const defaultHeaders = {
        "Content-Type": "application/json",
        // Include Authorization header only if token exists and credentials: 'include'
        ...(accessToken && includeCredentials && { Authorization: `Bearer ${accessToken}` }),
    };

    // Final request options
    const finalOptions = {
        method: options.method || "GET",
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        cache: options.method !== "GET" ? "no-store" : options.cache || "force-cache",
        body: options.body && typeof options.body !== "string"
            ? JSON.stringify(options.body)
            : options.body,
        signal: options.signal,
    };

    // Optional retry mechanism for transient errors
    const MAX_RETRIES = options.retries ?? 1;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(fullUrl, finalOptions);

            // Handle non-successful responses
            if (!response.ok) {
                let message = `Request failed with status ${response.status}`;

                try {
                    // Attempt to parse JSON body for a friendly error message
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch (parseError) {
                    if (process.env.NODE_ENV === "development") {
                        console.warn(
                            `⚠️ Non-JSON error response from ${fullUrl}:`,
                            parseError.message
                        );
                    }
                }

                // Handle 401 Unauthorized (only for authenticated requests)
                if (response.status === 401 && includeCredentials) {
                    // Try to refresh the token before giving up
                    const cookieStore = await cookies();
                    const refreshToken = cookieStore.get('refreshToken')?.value;

                    if (refreshToken) {
                        try {
                            // Attempt to refresh the access token
                            const refreshResponse = await fetch(
                                `${process.env.BACKEND_URL}/user/auth/refresh`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ refreshToken }),
                                }
                            );

                            if (refreshResponse.ok) {
                                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
                                    await refreshResponse.json();

                                // Update cookies with new tokens
                                cookieStore.set('accessToken', newAccessToken, {
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === 'production',
                                    sameSite: 'lax',
                                    maxAge: 15 * 60,
                                    path: '/',
                                });

                                cookieStore.set('refreshToken', newRefreshToken, {
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === 'production',
                                    sameSite: 'lax',
                                    maxAge: 30 * 24 * 60 * 60,
                                    path: '/',
                                });

                                // Retry the original request with the new token
                                const retryHeaders = {
                                    ...finalOptions.headers,
                                    Authorization: `Bearer ${newAccessToken}`,
                                };

                                const retryResponse = await fetch(fullUrl, {
                                    ...finalOptions,
                                    headers: retryHeaders,
                                });

                                if (retryResponse.ok) {
                                    try {
                                        return await retryResponse.json();
                                    } catch {
                                        return { success: true, message: "No content" };
                                    }
                                }

                                // If retry also fails, fall through to clear cookies
                            }
                        } catch (refreshError) {
                            if (process.env.NODE_ENV === "development") {
                                console.error('Token refresh failed:', refreshError);
                            }
                            // Fall through to clear cookies and redirect
                        }
                    }

                    // Token refresh failed or no refresh token available
                    // Clear cookies and redirect to login
                    cookieStore.delete('accessToken');
                    cookieStore.delete('refreshToken');

                    redirect('/auth/login');
                }

                // Throw generic error for other status codes
                throw new Error(message);
            }

            // Try parsing JSON response (fallback for no-content responses)
            try {
                return await response.json();
            } catch {
                return { success: true, message: "No content" };
            }
        } catch (error) {
            // Don't retry redirects or AuthErrors
            if (error instanceof AuthError || error.message === 'NEXT_REDIRECT') {
                throw error;
            }

            // Network error and retry mechanism
            const isNetworkError =
                error.name === "FetchError" || error.message.includes("network");
            const isLastAttempt = attempt === MAX_RETRIES;

            if (isNetworkError && !isLastAttempt) {
                if (process.env.NODE_ENV === "development") {
                    console.warn(
                        `⚠️ Network error, retrying (${attempt + 1}/${MAX_RETRIES})...`
                    );
                }
                await new Promise((res) => setTimeout(res, 300 * (attempt + 1)));
                continue;
            }

            if (process.env.NODE_ENV === "development") {
                console.error(`❌ API Fetch Error (${fullUrl}):`, error);
            }

            // Re-throw the error to be handled by the caller
            throw error;
        }
    }
}