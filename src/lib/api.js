// src/lib/api.js

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// Assuming AuthError is defined in '@/utils/error'
// import { AuthError } from '@/utils/error';

// ----------------------------------------------------------------------
// 1. PUBLIC, CACHEABLE API FETCH (Used for non-authenticated GET requests)
//    - This is the function that will be called as `apiFetch` by default.
// ----------------------------------------------------------------------

/**
 * Universal fetch wrapper for PUBLIC API calls (GET only).
 * This version avoids using `cookies()` or `headers()` to enable Next.js Static Rendering.
 * * @param {string} url - API path (e.g., '/api/v1/subcategories')
 * @param {object} [options={}] - Fetch options
 * @returns {Promise<object>} Parsed JSON response data
 */
export async function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith("/")
    ? `${process.env.BACKEND_URL}${url}`
    : url;

  if (url.startsWith("/") && !process.env.BACKEND_URL) {
    throw new Error("❌ BACKEND_URL environment variable is not set.");
  }

  // Default headers for public requests
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Final request options
  const finalOptions = {
    method: "GET", // Always assume GET for public cacheable requests
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // IMPORTANT: The default cache is 'force-cache', which allows SSG/ISR
    // If the caller provides 'next: { revalidate: X }', that will be used.
    cache: options.cache || "force-cache",
    next: options.next,
    signal: options.signal,
  };

  const MAX_RETRIES = options.retries ?? 1;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(fullUrl, finalOptions);

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {} // Ignore non-JSON errors

        throw new Error(message);
      }

      try {
        return await response.json();
      } catch {
        return { success: true, message: "No content" };
      }
    } catch (error) {
      // ... (Network error and retry logic simplified/omitted for brevity,
      // but can be added back if needed, ensuring no cookies/redirects are used) ...

      if (attempt === MAX_RETRIES) {
        if (process.env.NODE_ENV === "development") {
          console.error(`❌ Public API Fetch Error (${fullUrl}):`, error);
        }
        throw error;
      }

      // Retry logic:
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `⚠️ Network error, retrying (${attempt + 1}/${MAX_RETRIES})...`
        );
      }
      await new Promise((res) => setTimeout(res, 300 * (attempt + 1)));
      continue;
    }
  }
}

// ----------------------------------------------------------------------
// 2. DYNAMIC, AUTHENTICATED API FETCH (Your original function, now renamed)
//    - Should only be used when `credentials: 'include'` is explicitly set.
// ----------------------------------------------------------------------

/**
 * Universal fetch wrapper for ALL API calls requiring authentication or dynamic data.
 * **NOTE: Uses cookies() and is always Dynamic (Server-Side Rendered)**
 * * @param {string} url - API path or Full URL
 * @param {object} [options={}] - Fetch options
 * @param {string} [options.credentials] - 'include' | 'omit' | 'same-origin' (Must be 'include' for auth)
 * @returns {Promise<object>} Parsed JSON response data
 */
export async function apiFetchDynamic(url, options = {}) {
  // Determine if this is an internal API call or external
  const isInternalAPI = url.startsWith("/");

  // Build full URL for internal APIs
  const fullUrl = isInternalAPI ? `${process.env.BACKEND_URL}${url}` : url;

  if (isInternalAPI && !process.env.BACKEND_URL) {
    throw new Error("❌ BACKEND_URL environment variable is not set.");
  }

  // Check if credentials should be included
  const includeCredentials = options.credentials === "include";

  // 🚨 THIS IS THE LINE THAT MAKES THE ROUTE DYNAMIC 🚨
  let accessToken = null;
  const cookieStore = cookies(); // Dynamic Function Call
  if (includeCredentials) {
    accessToken = cookieStore.get("accessToken")?.value;
  }

  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    // Include Authorization header only if token exists and credentials: 'include'
    ...(accessToken &&
      includeCredentials && { Authorization: `Bearer ${accessToken}` }),
  };

  // Final request options
  const finalOptions = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Correct cache logic: No-store for mutating requests, caller sets for GET
    cache: options.method !== "GET" ? "no-store" : options.cache || "no-store", // 🚨 Changed default GET cache to 'no-store' here since it's an authenticated dynamic fetch
    body:
      options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
    signal: options.signal,
    next: options.next, // Allow passing revalidate options for dynamic GETs too
  };

  // Optional retry mechanism for transient errors
  const MAX_RETRIES = options.retries ?? 1;
  const redirectOn401 = options.redirectOn401 ?? true; // Default to true

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(fullUrl, finalOptions);

      // Handle non-successful responses
      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
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

        // Handle 401 Unauthorized
        if (response.status === 401 && includeCredentials) {
          const refreshToken = cookieStore.get("refreshToken")?.value;

          if (refreshToken) {
            try {
              // --------------------- TOKEN REFRESH LOGIC ---------------------
              const refreshResponse = await fetch(
                `${process.env.BACKEND_URL}/user/auth/refresh`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refreshToken }),
                  // Use no-store to ensure we get a fresh token
                  cache: "no-store",
                }
              );

              if (refreshResponse.ok) {
                const {
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                } = await refreshResponse.json();

                // Update cookies with new tokens
                // Set cookie options correctly
                const cookieOptions = {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  path: "/",
                };
                cookieStore.set("accessToken", newAccessToken, {
                  ...cookieOptions,
                  maxAge: 15 * 60,
                });
                cookieStore.set("refreshToken", newRefreshToken, {
                  ...cookieOptions,
                  maxAge: 30 * 24 * 60 * 60,
                });

                // Retry the original request with the new token
                const retryHeaders = {
                  ...finalOptions.headers,
                  Authorization: `Bearer ${newAccessToken}`,
                };

                const retryResponse = await fetch(fullUrl, {
                  ...finalOptions,
                  headers: retryHeaders,
                  cache: "no-store", // Must be no-store for a reliable retry
                });

                if (retryResponse.ok) {
                  try {
                    return await retryResponse.json();
                  } catch {
                    return { success: true, message: "No content after retry" };
                  }
                }
                // If retry fails, fall through to clear cookies and redirect
              }
              // If refresh token endpoint returns 401/403 or other error
            } catch (refreshError) {
              if (process.env.NODE_ENV === "development") {
                console.error("Token refresh failed:", refreshError);
              }
              // Fall through to clear cookies and redirect
            }
          }

          // Token refresh failed or no refresh token available
          // Clear cookies and redirect to login if enabled
          cookieStore.delete("accessToken");
          cookieStore.delete("refreshToken");

          if (redirectOn401) {
            redirect("/auth/login");
          }
          // If redirectOn401 is false, it throws an error below.
        }

        // Throw generic error for other status codes (or failed 401 attempts)
        throw new Error(message);
      }

      // Try parsing JSON response (fallback for no-content responses)
      try {
        return await response.json();
      } catch {
        return { success: true, message: "No content" };
      }
    } catch (error) {
      // Check for Next.js redirect errors (which must not be retried)
      if (error && error.message === "NEXT_REDIRECT") {
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
        console.error(`❌ Dynamic API Fetch Error (${fullUrl}):`, error);
      }

      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}
