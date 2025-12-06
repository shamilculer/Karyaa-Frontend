"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getAllAdminsAction = async ({
  page = 1,
  limit = 15,
  search = "", // Aligned with the controller's expected field name
  adminLevel = "", // Aligned with the controller's expected field name
  isActive = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  if (search) queryParams.append("search", search);

  if (adminLevel) queryParams.append("adminLevel", adminLevel);

  if (isActive !== "") queryParams.append("isActive", isActive);

  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  const endpoint = `/admin/admins/all?${queryParams.toString()}`;

  try {
    const response = await apiFetch(endpoint, {
      role: "admin",
      auth: true,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: "Admins fetched successfully.",
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.message || "Failed to fetch admins.",
      };
    }
  } catch (error) {
    console.error("Error fetching admins list:", error);
    return {
      success: false,
      data: null,
      message: error.message || "An unexpected network error occurred.",
    };
  }
};

export const toggleAdminStatusAction = async (adminId) => {
    if (!adminId) {
        return {
            success: false,
            message: "Admin ID is required for this action.",
        };
    }

    const endpoint = `/admin/admins/${adminId}/status`;

    try {

        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
        });

        if (response.success) {

            revalidatePath("/dashboard/admin-users");

            return {
                success: true,
                admin: response.admin,
                message: response.message || "Administrator status toggled successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to toggle administrator status.",
            };
        }
    } catch (error) {
        console.error(`Error toggling status for admin ${adminId}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred while updating status.",
        };
    }
};

export const deleteAdminAction = async (adminId) => {
    if (!adminId) {
        return {
            success: false,
            message: "Admin ID is required for deletion.",
        };
    }

    const endpoint = `/admin/admins/${adminId}/delete`;

    try {

        const response = await apiFetch(endpoint, {
            method: "DELETE", 
            role: "admin",
            auth: true,
        });

        if (response.success) {
            revalidatePath("/dashboard/admin-users");

            return {
                success: true,
                message: response.message || "Administrator deleted successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to delete administrator.",
            };
        }
    } catch (error) {
        console.error(`Error deleting admin ${adminId}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred while attempting deletion.",
        };
    }
};

export const updateAdminPermissionsAction = async (adminId, permissions) => {
    if (!adminId || !permissions) {
        return {
            success: false,
            message: "Admin ID and permissions data are required.",
        };
    }

    const endpoint = `/admin/admins/${adminId}/access-control`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ accessControl: permissions }),
        });

        if (response.success) {
            revalidatePath("/dashboard/admin-users"); 

            return {
                success: true,
                admin: response.admin,
                message: response.message || "Permissions updated successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update permissions.",
            };
        }
    } catch (error) {
        console.error(`Error updating permissions for admin ${adminId}:`, error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred while updating permissions.",
        };
    }
};

// Update admin profile (name, email, phone number)
export const updateAdminProfileAction = async (profileData) => {
    if (!profileData) {
        return {
            success: false,
            message: "Profile data is required.",
        };
    }

    const endpoint = `/admin/admins/profile/update`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(profileData),
        });

        if (response.success) {
            revalidatePath("/admin/settings");

            return {
                success: true,
                admin: response.admin,
                message: response.message || "Profile updated successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update profile.",
            };
        }
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred while updating profile.",
        };
    }
};

// Update admin password
export const updateAdminPasswordAction = async (passwordData) => {
    if (!passwordData || !passwordData.currentPassword || !passwordData.newPassword) {
        return {
            success: false,
            message: "Current password and new password are required.",
        };
    }

    const endpoint = `/admin/admins/password/update`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify(passwordData),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Password updated successfully.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to update password.",
            };
        }
    } catch (error) {
        console.error("Error updating admin password:", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred while updating password.",
        };
    }
};