// File: actions/vendorActions.js (Your Server Action)

"use server"

import { apiFetch } from "@/lib/api";

/**
 * @desc Fetches a list of active vendors with pagination and filtering.
 * @param {Object} filters - An object containing optional query parameters 
 * (e.g., { page: 1, limit: 10, city: 'Dubai' }).
 * @returns {Promise<{data: Array<Object>, pagination: Object} | {error: string}>}
 */
export const getActiveVendors = async (filters = {}) => {
    try {
        // Construct Query String from the passed filters object
        const params = new URLSearchParams(filters);
        const queryString = params.toString();
        
        // Final URL includes all parameters: /vendors/active?page=1&city=Dubai
        const url = `/vendor/active?${queryString}`;
        
        const responseData = await apiFetch(url);

        return {
            data: responseData.data,
            pagination: responseData.pagination,
        };
        
    } catch (error) {
        console.error("Server Action: Error fetching active vendors:", error);
        const errorMessage = error.message || "Failed to fetch vendor list.";
        
        return {
            error: errorMessage,
            data: [],
            pagination: { totalVendors: 0, totalPages: 0, currentPage: 1, limit: 10, hasNextPage: false, hasPrevPage: false },
        };
    }
}