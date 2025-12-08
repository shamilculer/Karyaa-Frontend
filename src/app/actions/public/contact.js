"use server";

import { apiFetch } from "@/lib/api";

export const sendContactForm = async (data) => {
  try {
    const response = await apiFetch(
      "/contact/new",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // Return the actual response from the API
    return response;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to send the message. Please try again.",
    };
  }
};
