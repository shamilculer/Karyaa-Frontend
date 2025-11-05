"use server"

import { apiFetch } from "@/lib/api"

export const getAllSupportTicketsAdmin = async ({ 
    page = 1, 
    limit = 15, 
    search = "", 
    status = "",
    category = "",
    priority = "",
} = {}) => {
    
    // 1. Construct the query string from the parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));

    if (search) {
        queryParams.append('search', search);
    }
    if (status) {
        queryParams.append('status', status);
    }
    if (category) {
        queryParams.append('category', category);
    }
    if (priority) {
        queryParams.append('priority', priority);
    }

    // Assuming the API route for the controller is /api/admin/tickets/all
    const endpoint = `/admin/tickets/all?${queryParams.toString()}`;

    try {
        // 2. Fetch data using the dynamic endpoint
        const response = await apiFetch(endpoint, {
            role: "admin",
            auth: true
        });

        // 3. Handle successful response
        // Note: The controller returns an array named 'tickets'
        if (response.success && response.tickets) {
            return {
                success: true,
                data: response.tickets, // Use 'tickets' array from API response
                total: response.total,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                message: "Support tickets fetched successfully."
            };
        } else {
            // Handle cases where API returned a known error state
            return {
                success: false,
                data: null,
                message: response.message || "Failed to fetch support tickets."
            };
        }

    } catch (error) {
        // 4. Handle errors thrown by apiFetch
        console.error("Error fetching all support tickets (Admin):", error);
        
        let message = "An unexpected network or server error occurred.";
        
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'object' && error !== null && error.message) {
            // This captures custom errors thrown by the apiFetch utility
            message = error.message;
        }

        return {
            success: false,
            data: null,
            message: message,
        };
    }
};

export const updateTicketStatusAction = async ({ id, status }) => {
    if (!id || !status) {
        return { success: false, message: "Ticket ID and new status are required." };
    }

    const endpoint = `/admin/tickets/${id}/status`;

    try {
        const response = await apiFetch(endpoint, {
            method: "PUT",
            role: "admin",
            auth: true,
            body: JSON.stringify({ status }),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Ticket status updated successfully.",
            };
        } else {
            // Handle known API errors (e.g., status is invalid)
            return {
                success: false,
                message: response.message || "Failed to update ticket status.",
            };
        }

    } catch (error) {
        console.error("Error updating ticket status:", error);
        return {
            success: false,
            message: error.message || "An unexpected network error occurred.",
        };
    }
};

export const deleteTicketAction = async (id) => {
    if (!id) {
        return { success: false, message: "Ticket ID is required." };
    }

    const endpoint = `/admin/tickets/${id}`;

    try {
        const response = await apiFetch(endpoint, {
            method: "DELETE",
            role: "admin",
            auth: true,
        });

        if (response.success) {
            return {
                success: true,
                message: response.message || "Ticket deleted successfully.",
            };
        }

        return {
            success: false,
            message: response.message || "Failed to delete the ticket.",
        };

    } catch (error) {
        console.error("Error deleting ticket:", error);

        return {
            success: false,
            message:
                error?.message ||
                "An unexpected network or server error occurred while deleting the ticket.",
        };
    }
};