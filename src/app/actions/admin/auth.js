"use server";

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { CreateAdminSchema } from "@/lib/schema";

export const loginAdmin = async (data) => {
  try {
    // Send login request to backend
    const response = await apiFetch("/admin/auth/login", {
      method: "POST",
      role: "admin",
      body: data,
    });

    console.log(response)

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


export const createAdminAction = async (formData) => {
    const data = Object.fromEntries(formData.entries());

    // 1. Manual parsing of the 'accessControl' JSON string
    try {
        if (data.accessControl && typeof data.accessControl === 'string') {
            data.accessControl = JSON.parse(data.accessControl);
        }
    } catch (e) {
        // If parsing fails, treat it as a bad request
        return {
            success: false,
            error: "Invalid access control data format.",
            errors: { accessControl: ["Invalid data format."] },
        };
    }

    try {
        // Zod validation on the Server Side
        const validatedDataResult = CreateAdminSchema.safeParse(data);

        if (!validatedDataResult.success) {
            const errors = validatedDataResult.error.flatten().fieldErrors;
            return { 
                success: false, 
                message: "Validation failed.", 
                errors 
            };
        }

        const adminData = validatedDataResult.data;
        
        // 2. Adjust data based on adminLevel *before* sending to the API
        if (adminData.adminLevel === 'admin' && adminData.accessControl) {
            // For 'admin' level, if the client sends permissions, we delete them 
            // so the backend can apply its full-access defaults.
            delete adminData.accessControl;
        }

        // --- Call to Express Backend ---
        const response = await apiFetch("/admin/admins/new", { // Corrected endpoint based on your code
            method: "POST",
            // Send the *parsed* and *validated* object data directly
            body: adminData, 
            role: "admin",
            auth: true
        });

        // ... success handling ...
        const { admin, message } = response;

        return {
            success: true,
            data: admin,
            message: message || `Admin ${admin.fullName} successfully created.`,
        };
        
    } catch (error) {
        // ... error handling ...
        console.error("Admin creation error:", error);
        
        const errorMessage = error.message || "Failed to create admin due to a server error.";

        return {
            success: false,
            error: errorMessage,
            errors: {},
        };
    }
};


export async function syncCurrentAdminDataAction(adminId) {
    if (!adminId) {
        return { success: false, message: "Admin ID is required for sync." };
    }
    
    const endpoint = `/util/admin/${adminId}/me`; 
    
    try {
        const response = await apiFetch(endpoint, {
            method: "GET",
        });

        if (response.success) {
            return {
                success: true,
                admin: response.admin,
                message: "Admin data synchronized.",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to fetch synchronization data.",
            };
        }
    } catch (error) {
        console.error("Server Action Sync Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred during data synchronization.",
        };
    }
}

export const logoutAdmin = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken_admin');
  cookieStore.delete('refreshToken_admin');
};
