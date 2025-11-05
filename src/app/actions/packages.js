"use server";

import { apiFetch } from "@/lib/api";

export const getVendorPackages = async (vendorId) => {

  try {
    const data = await apiFetch(`/packages/${vendorId}`); 

    return {
      success: data.success ?? true,
      message: data.message || "Packages fetched successfully",
      data: data.data || [],
    };

  } catch (error) {
    console.error("Error fetching vendor packages:", error);

    return {
      success: false,
      message: error?.message || "Internal error fetching packages",
      data: [],
    };
  }
};
