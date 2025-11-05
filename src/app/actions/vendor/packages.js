"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createPackage(data) {
  const res = await apiFetch("/packages/new", {
    method: "POST",
    body: JSON.stringify(data),
    role: "vendor",
    auth: true
  });

  if (!res.success) {
    throw new Error(res.message);
  }

  return {
    success: res.success,
    message: res.message,
  };
}

export async function updatePackage(packageId, data) {
  try {
    const response = await apiFetch("/packages/update", {
      method: "PUT",
      body: JSON.stringify({ packageId, ...data }),
      role: "vendor",
      auth: true,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to update package",
      };
    }

    revalidatePath("/vendor/packages");

    return {
      success: true,
      message: response.message || "Package updated successfully",
      package: response.package, // Return updated package data
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

export async function deletePackage(packageId) {
  try {
    const response = await apiFetch("/packages/delete", {
      method: "DELETE",
      body: JSON.stringify({ packageId }),
      role: "vendor",
      auth: true,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to delete package",
      };
    }

    revalidatePath("/vendor/packages");

    return {
      success: true,
      message: response.message || "Package deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}