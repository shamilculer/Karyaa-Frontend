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

export const getVendorProfile = async () => {
    try {
        const url = `/vendors/profile`; 
        const responseData = await apiFetch(url, {
            auth: true,
            role: "vendor",
        }); 

        if (responseData.success) {
            return {
                success: true,
                data: responseData.data,
                message: responseData.message || "Vendor profile data fetched successfully."
            };
        } else {
            return {
                success: false,
                data: null,
                error: responseData.message || "Failed to fetch vendor profile for editing."
            };
        }
        
    } catch (error) {
        console.error("Server Action: Error fetching vendor profile for edit:", error);

        return {
            success: false,
            data: null,
            error: error.message || "An unexpected error occurred while fetching profile data.",
        };
    }
}


export const updateVendorProfile = async (vendorId, updateData) => {
    if (!vendorId) {
        return {
            success: false,
            error: "Vendor ID is required.",
            data: null,
        };
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return {
            success: false,
            error: "No update data provided.",
            data: null,
        };
    }

    try {
        const url = `/vendors/${vendorId}`;

        const responseData = await apiFetch(url, {
            method: "PUT",
            body: JSON.stringify(updateData),
            role: "vendor",
            auth: true,
        });

        if (responseData.success) {
            return {
                success: true,
                data: responseData.data,
                message: responseData.message || "Vendor profile updated successfully.",
            };
        } else {
            return {
                success: false,
                data: null,
                error: responseData.message || "Failed to update vendor profile.",
            };
        }
    } catch (error) {
        console.error(`Server Action: Error updating vendor ${vendorId}:`, error);

        return {
            success: false,
            data: null,
            error: error.message || "Failed to update vendor profile.",
        };
    }
};

/**
 * Sync current vendor data from server
 * @param {string} vendorId
 */
export async function syncCurrentVendorDataAction(vendorId) {
    try {
        const response = await apiFetch(`/util/vendor/${vendorId}/me`, {
            method: "GET",
            auth: true, 
            role: "vendor"
        });
  
        return response;
  
    } catch (error) {
        console.error("Sync vendor data error:", error);
        return {
            success: false,
            message: error.message || "Failed to sync vendor data."
        };
    }
  }