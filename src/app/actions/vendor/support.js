"use server";

import { apiFetch } from "@/lib/api";

/**
 * Posts a support ticket to the backend
 * @param {Object} data - Ticket form data
 */
export const postTicket = async (data) => {
  try {
    const response = await apiFetch("/support-tickets", {
      method: "POST",
      role: "vendor",
      body: JSON.stringify(data),
      auth: true
    });

    if (!response.success) {

      const errData = response.message;
      throw new Error(errData?.message || "Failed to submit support ticket.");
    }

    return {
      success: true,
      message: response.message || "Support ticket created successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error("Error posting support ticket:", error);
    return {
      success: false,
      message: error.message || "Unable to submit your ticket. Please try again.",
    };
  }
};
