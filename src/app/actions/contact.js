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

    console.log(response);

    return {
        success: true,
        message: "Message sent successfully!",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: error.message || "Failed to send the message. Please try again.",
    };
  }
};
