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
        // This handles all the filtering and sorting parameters correctly.
        const params = new URLSearchParams();
        
        // Only append non-null/non-undefined/non-empty values
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        });

        const queryString = params.toString();
        
        // Final URL includes all parameters: /vendor/active?page=1&city=Dubai&sort=price-high
        const url = `/vendor/active?${queryString}`;
        
        // Assuming apiFetch is a client-side library/function that makes the actual API call
        // The implementation of apiFetch and the response format must be correct.
        const responseData = await apiFetch(url);

        return {
            data: responseData.data || [],
            pagination: responseData.pagination || { totalVendors: 0, totalPages: 0, currentPage: 1, limit: 10, hasNextPage: false, hasPrevPage: false },
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

/**
 * @desc Fetches a single active vendor by their ID or slug.
 * @param {string} identifier - The slug or MongoDB ID of the vendor.
 * @returns {Promise<{data: Object} | {error: string}>}
 */
export const getSingleVendor = async (identifier) => {
    if (!identifier) {
        return { error: "Vendor identifier is required." };
    }

    try {
        // The URL targets the new Express route: /vendors/:identifier
        const url = `/vendor/${identifier}`;
        
        const responseData = await apiFetch(url); 
        
        // The API returns { success: true, message: ..., data: vendor }
        return {
            data: responseData.data,
        };
        
    } catch (error) {
        console.error(`Server Action: Error fetching vendor ${identifier}:`, error);

        // Assume the API error message is useful for the client
        const errorMessage = error.message || "Could not find the requested vendor.";
        
        return {
            error: errorMessage,
            data: null,
        };
    }
}

/**
 * @desc Fetches full details for a list of vendors based on their slugs from the API.
 * @param {string[]} slugs - Array of vendor slugs (e.g., ['vendor-a', 'vendor-b']).
 * @returns {Promise<{success: boolean, data: object[] | null, error: string | null}>}
 */
export async function getVendorsBySlugs(slugs) {
    if (!slugs || slugs.length === 0) {
        return { success: true, data: [], error: null };
    }
    
    try {
        // Assume your backend has an endpoint like /api/vendors/compare that accepts a list of slugs
        const response = await apiFetch(`/vendor/compare?slugs=${slugs.join(',')}`);

        console.log(response)

        // Assuming response.data is the array of full vendor objects
        return { success: true, data: response.data || [], error: null };
    } catch (error) {
        console.error("Server Action: Error fetching vendors by slugs:", error);
        return { success: false, data: null, error: error.message || "Failed to load vendor data for comparison." };
    }
}

/**
 * @desc Fetches minimal data for all vendors to populate the Combobox dropdowns.
 * @returns {Promise<{success: boolean, data: {slug: string, businessName: string}[] | null, error: string | null}>}
 */
export async function getAllVendorOptions() {
    try {
        // Assume your backend has an endpoint like /api/vendors/options for minimal data
        const response = await apiFetch(`/vendor/options`);

        // Assuming the backend returns an array of { slug, businessName } objects
        return { success: true, data: response.data || [], error: null };
    } catch (error) {
        console.error("Server Action: Error fetching vendor options:", error);
        return { success: false, data: null, error: error.message || "Failed to load vendor options." };
    }
}