"use server";

import { apiFetch } from "@/lib/api";

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
