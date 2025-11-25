"use server";

import { apiFetch } from "@/lib/api";

// Get overview statistics
export async function getOverviewStats(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/overview?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    return { success: false, message: error.message };
  }
}

// Get user growth data
export async function getUserGrowth(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/user-growth?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching user growth:", error);
    return { success: false, message: error.message };
  }
}

// Get vendor growth data
export async function getVendorGrowth(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/vendor-growth?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching vendor growth:", error);
    return { success: false, message: error.message };
  }
}

// Get vendor distribution by category
export async function getVendorDistribution(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/vendor-distribution?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching vendor distribution:", error);
    return { success: false, message: error.message };
  }
}

// Get vendor status distribution
export async function getVendorStatusDistribution(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/vendor-status?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching vendor status distribution:", error);
    return { success: false, message: error.message };
  }
}

// Get lead metrics
export async function getLeadMetrics(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/lead-metrics?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching lead metrics:", error);
    return { success: false, message: error.message };
  }
}

// Get engagement metrics
export async function getEngagementMetrics(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/platform/engagement?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return { success: false, message: error.message };
  }
}
