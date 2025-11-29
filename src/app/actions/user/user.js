"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { decodeJWT } from "@/utils/decodeJWT";
import { success } from "zod";

/**
 * Register a new user
 * Calls Express backend, receives tokens, sets httpOnly cookies
 */
export async function registerUser(data) {
  try {
    const response = await apiFetch("/user/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { success, user, accessToken, refreshToken, message } = response;

    // If backend explicitly returned failure
    if (success === false) {
      return {
        success: false,
        error: message || "Registration failed",
      };
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken_user", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set("refreshToken_user", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return { success: true, user };
  } catch (error) {
    console.error("Registration failed:", error.message);

    return {
      success: false,
      error: error.message || "Registration failed",
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
    const response = await apiFetch("/user/auth/login", {
      method: "POST",
      body: data, // Auto-stringified by apiFetch
    });

    console.log("resp--------------------------------------------", response);
    if (!response.success) {
      return {
        success: false,
        message: response.message || "Internal server error. Please try again!",
      };
    }

    const { user, accessToken, refreshToken } = response;

    // Set httpOnly cookies
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken_user", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes (match your token expiry)
      path: "/",
    });

    cookieStore.set("refreshToken_user", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return { success: true, user };
  } catch (error) {
    console.error("Login failed:", error.message);
    return {
      success: false,
      error: error.message || "Internal server error. Please try again!",
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
  cookieStore.delete("accessToken_user");
  cookieStore.delete("refreshToken_user");

  // Redirect to login page
  redirect("/auth/login");
}

/**
 * Check authentication status (FAST - no backend call)
 * Decodes JWT locally instead of making expensive API calls
 * Also fetches savedVendors for authenticated users
 */
export async function checkAuthStatus(role = "user") {
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

    // Fetch savedVendors from backend for authenticated users
    if (role === "user") {
      try {
        const profileResponse = await apiFetch("/user/profile", {
          auth: true,
          role: "user",
        });

        // Merge savedVendors into user object
        if (profileResponse?.user?.savedVendors) {
          console.log("DEBUG: savedVendors from profile:", profileResponse.user.savedVendors);
          user.savedVendors = profileResponse.user.savedVendors;
        } else {
          console.log("DEBUG: No savedVendors in profile response");
        }
      } catch (error) {
        console.error("Failed to fetch savedVendors:", error);
        // Don't fail auth check if savedVendors fetch fails
        user.savedVendors = [];
      }
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Fetch the list of vendors saved by the authenticated user
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getSavedVendors(categorySlug) {
  try {
    // Build query string with category filter (single category only)
    let url = "/user/saved-vendors";

    if (categorySlug) {
      url += `?categories=${encodeURIComponent(categorySlug)}`;
    }

    const responseData = await apiFetch(url, {
      auth: true,
      role: "user",
    });

    console.log(responseData)

    return {
      success: true,
      data: responseData.data?.savedVendors || [],
      results: responseData.results || 0,
    };
  } catch (error) {
    console.error("Error fetching saved vendors:", error);
    return {
      success: false,
      error: error.message || "Could not retrieve your saved vendors list.",
      data: [],
      results: 0,
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
      error: "Vendor ID is required.",
    };
  }

  try {
    const response = await apiFetch("/user/saved-vendors/toggle", {
      method: "PATCH",
      body: { vendorId }, // Auto-stringified by apiFetch
      auth: true,
      role: "user",
    });

    // Check if authentication is required
    if (response.requiresAuth) {
      return response; // Return the auth error to client
    }

    // Revalidate relevant pages
    revalidatePath("/vendors");
    revalidatePath("/saved-vendors");
    revalidatePath("/vendors/[vendor]", "page"); // Revalidate vendor detail pages

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

/**
 * Get user profile
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function getUserProfile() {
  try {
    const response = await apiFetch("/user/profile", {
      auth: true,
      role: "user",
    });

    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    console.error("Get profile failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to fetch profile",
    };
  }
}

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @param {string} data.username - User's name
 * @param {string} data.emailAddress - User's email
 * @param {string} data.mobileNumber - User's mobile number
 * @param {string} data.location - User's location
 * @param {string} data.profileImage - User's profile image URL
 * @returns {Promise<{success: boolean, user?: object, message?: string, error?: string}>}
 */
export async function updateUserProfile(data) {
  try {
    const response = await apiFetch("/user/profile", {
      method: "PATCH",
      body: data,
      auth: true,
    });

    revalidatePath("/", "layout");
    revalidatePath("/profile");

    return {
      success: true,
      user: response.user,
      message: response.message || "Profile updated successfully",
    };
  } catch (error) {
    console.error("Update profile failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

/**
 * Change user password
 * @param {Object} data - Password change data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function changePassword(data) {
  const { currentPassword, newPassword } = data;

  // Client-side validation
  if (!currentPassword || !newPassword) {
    return {
      success: false,
      error: "Current password and new password are required",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      error: "New password must be at least 6 characters",
    };
  }

  try {
    const response = await apiFetch("/user/profile/change-password", {
      method: "PATCH",
      body: { currentPassword, newPassword },
      auth: true,
    });

    return {
      success: true,
      message: response.message || "Password changed successfully",
    };
  } catch (error) {
    console.error("Change password failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to change password",
    };
  }
}

/**
 * Delete user account
 * @param {string} password - User's password for confirmation
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function deleteUserAccount(password) {
  if (!password) {
    return {
      success: false,
      error: "Password is required to delete account",
    };
  }

  try {
    const response = await apiFetch("/user/profile", {
      method: "DELETE",
      body: { password },
      auth: true,
    });

    // Clear auth cookies
    const cookieStore = await cookies();
    cookieStore.delete("accessToken_user");
    cookieStore.delete("refreshToken_user");

    return {
      success: true,
      message: response.message || "Account deleted successfully",
    };
  } catch (error) {
    console.error("Delete account failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to delete account",
    };
  }
}

/**
 * Sync current user data from server
 * @param {string} userId
 */
export async function syncCurrentUserDataAction(userId) {
  try {
    const response = await apiFetch(`/util/user/${userId}/me`, {
      method: "GET",
      auth: true,
      role: "user"
    });

    return response;

  } catch (error) {
    console.error("Sync user data error:", error);
    return {
      success: false,
      message: error.message || "Failed to sync user data."
    };
  }
}
