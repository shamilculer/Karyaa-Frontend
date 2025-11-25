"use server";

import { apiFetch } from "@/lib/api";

// Get total revenue and overview stats
export async function getTotalRevenue(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/revenue/overview?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return { success: false, message: error.message };
  }
}

// Get revenue breakdown by bundle
export async function getRevenueByBundle(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/revenue/by-bundle?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching revenue by bundle:", error);
    return { success: false, message: error.message };
  }
}

// Get revenue over time
export async function getRevenueOverTime(timeframe = "6M") {
  try {
    const data = await apiFetch(`/admin/analytics/revenue/over-time?timeframe=${timeframe}`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching revenue over time:", error);
    return { success: false, message: error.message };
  }
}

// Get bundle performance
export async function getBundlePerformance() {
  try {
    const data = await apiFetch(`/admin/analytics/revenue/bundle-performance`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching bundle performance:", error);
    return { success: false, message: error.message };
  }
}

// Get subscription metrics
export async function getSubscriptionMetrics() {
  try {
    const data = await apiFetch(`/admin/analytics/revenue/subscriptions`, {
      role: "admin",
      auth: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching subscription metrics:", error);
    return { success: false, message: error.message };
  }
}
