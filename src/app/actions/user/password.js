"use server";

import { apiFetch } from "@/lib/api";

/**
 * Request password reset for user
 * @param {string} email
 */
export async function requestUserPasswordReset(email) {
    try {
        const res = await apiFetch("/user/auth/forgot-password", {
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
 * Reset user password with token
 * @param {string} token
 * @param {string} newPassword
 */
export async function resetUserPassword(token, newPassword) {
    try {
        const res = await apiFetch("/user/auth/reset-password", {
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
