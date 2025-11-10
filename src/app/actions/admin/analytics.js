"use server";

import { apiFetch } from "@/lib/api";

export const getBundleOverviewStats = async () => {
  try {
    const response = await apiFetch("/admin/analytics/bundle-overview", {
      role: "admin",
      auth: true,
    });

    if (!response.success) {
      return {
        success: false,
        data: null,
        message: response.message || "Error fetching Bundle overview stats",
      };
    }

    return response
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || "Error fetching Bundle overview stats",
    };
  }
};
