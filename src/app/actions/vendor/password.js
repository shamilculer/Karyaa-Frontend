"use server";

import { apiFetch } from "@/lib/api";

/**
 * Request password reset for vendor
 * @param {string} email
 */
export async function requestVendorPasswordReset(email) {
    try {
        const res = await apiFetch("/vendors/auth/forgot-password", {
            method: "POST",
            body: { email },
        });

        return {
            success: res.success || false,
            message: res.message || "If an account exists, a reset link has been sent.",
        };
    } catch (error) {
        console.error("Error requesting password reset:", error);
        return {
            success: false,
            message: error.message || "Failed to request password reset",
        };
    }
}

/**
 * Reset vendor password with token
 * @param {string} token
 * @param {string} newPassword
 */
export async function resetVendorPassword(token, newPassword) {
    try {
        const res = await apiFetch("/vendors/auth/reset-password", {
            method: "POST",
            body: { token, newPassword },
        });

        return {
            success: res.success || false,
            message: res.message || "Password reset successful",
        };
    } catch (error) {
        console.error("Error resetting password:", error);
        return {
            success: false,
            message: error.message || "Failed to reset password",
        };
    }
}


/**
 * Update vendor password
 */
export async function updateVendorPassword(currentPassword, newPassword) {
    try {
        const res = await apiFetch("/vendors/password/update", {
            method: "PUT",
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
            auth: true,
            role: "vendor",
        });

        return {
            success: res.success || false,
            message: res.message || "Password updated successfully",
        };
    } catch (error) {
        console.error("Error updating password:", error);
        return {
            success: false,
            message: error.message || "Failed to update password",
        };
    }
}
