"use server";

import { apiFetch } from "@/lib/api";

// Get dashboard overview statistics
export async function getDashboardOverview() {
  try {
    const data = await apiFetch(`/admin/dashboard/overview`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return { success: false, message: error.message };
  }
}

// Get admin action items list
export async function getActionItemsList() {
  try {
    const data = await apiFetch(`/admin/dashboard/action-items`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching action items:", error);
    return { success: false, message: error.message };
  }
}
