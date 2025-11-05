"use server";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Register Vendor Server Action
 * @param {Object} data - Complete vendor registration data from all steps
 * @returns {Object} - Success/error response from backend (only on failure, success uses redirect)
 */
export const registerVendor = async (data) => {
  try {
    const response = await apiFetch('/vendors/auth/register', {
      method: 'POST',
      body: data,
    });
    // SUCCESS: Return success object to the client for toast notification and client-side redirect
    return {
      success: true,
      data: response,
      message: "Vendor registered successfully!",
    };
  } catch (error) {
    console.error("Vendor registration error:", error);
    // FAILURE: Return error object to the client
    return {
      success: false,
      error: error.message || "Failed to register vendor. Please try again.",
    };
  }
}

/**
 * @desc Authenticate Vendor & Retrieve Tokens
 * @param {Object} data - { email, password }
 * @returns {Object} - Vendor data with tokens or error message
 */
export const loginVendor = async (data) => {
  try {
    // Send login request to backend
    const response = await apiFetch("/vendors/auth/login", {
      method: "POST",
      body: data,
    });

    const { accessToken, refreshToken, vendor } = response;

    // Set httpOnly cookies in Next.js
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
        
    cookieStore.set('accessToken_vendor', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes (changed from 1 hour for security)
        path: '/',
    });

    cookieStore.set('refreshToken_vendor', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    });

    return {
      success: true,
      data: vendor,
      message: "Vendor logged in successfully!",
    };
  } catch (error) {
    console.error("Vendor login error:", error);
    return {
      success: false,
      error:
        error.message ||
        "Login failed. Please check your email and password and try again.",
    };
  }
};

/**
 * @desc Logout Vendor
 * Clears vendor cookies and redirects to login page
 */
export const logoutVendor = async () => {
  const cookieStore = await cookies();
  
  // Clear vendor auth cookies
  cookieStore.delete('accessToken_vendor');
  cookieStore.delete('refreshToken_vendor');

  // Redirect to vendor login page
  redirect('/auth/vendor/login');
};