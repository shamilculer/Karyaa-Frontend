"use server";

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAdmin = async (data) => {
  try {
    // Send login request to backend
    const response = await apiFetch("/admin/auth/login", {
      method: "POST",
      role: "admin",
      body: data,
    });

    const { accessToken, refreshToken, admin } = response;

    // Set httpOnly cookies in Next.js
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';

    cookieStore.set('accessToken_admin', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes (changed from 1 hour for security)
      path: '/',
    });

    cookieStore.set('refreshToken_admin', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return {
      success: true,
      data: admin,
      message: "Admin logged in successfully!",
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      error:
        error.message ||
        "Login failed. Please check your email and password and try again.",
    };
  }
};

export const logoutAdmin = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken_admin');
  cookieStore.delete('refreshToken_admin');
};
