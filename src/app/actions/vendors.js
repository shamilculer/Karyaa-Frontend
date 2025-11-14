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
        const params = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            const value = filters[key];

            // ❌ Remove deprecated filter
            if (key === "hasPackages") return;

            // ✅ Append only valid values
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        });

        const queryString = params.toString();
        
        const url = `/vendors/active?${queryString}`;

        const responseData = await apiFetch(url);

        return {
            data: responseData.data || [],
            pagination: responseData.pagination || {
                totalVendors: 0,
                totalPages: 0,
                currentPage: 1,
                limit: 10,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
        
    } catch (error) {
        console.error("Server Action: Error fetching active vendors:", error);

        return {
            error: error.message || "Failed to fetch vendor list.",
            data: [],
            pagination: {
                totalVendors: 0,
                totalPages: 0,
                currentPage: 1,
                limit: 10,
                hasNextPage: false,
                hasPrevPage: false,
            },
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
        const url = `/vendors/${identifier}`;
        
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
 * @desc Fetches full details for a list of vendors based on their slugs.
 * Calls: GET /api/vendors/compare?slugs=...
 */
export async function getVendorsBySlugs(slugs) {
    if (!slugs || slugs.length === 0) {
        return { success: true, data: [], error: null };
    }
    
    try {
        const slugsParam = slugs.join(',');
       
        
        const responseData = await apiFetch(`/vendors/compare?slugs=${slugsParam}`); 


        if (responseData.success) {
            return { success: true, data: responseData.data || [], error: null };
        } else {
            return { success: false, data: null, error: responseData.message || "Failed to load vendor comparison data." };
        }
    } catch (error) {
        console.error("❌ Server Action: Error fetching vendors by slugs:", error);
        return { success: false, data: null, error: error.message || "Failed to connect to API." };
    }
}

/**
 * @desc Fetches minimal data for all vendors to populate the Combobox dropdowns.
 */
export async function getAllVendorOptions({ query = '', limit = 50 } = {}) {
    try {
        // Update API endpoint to include search query and limit
        const responseData = await apiFetch(`/vendors/options?q=${encodeURIComponent(query)}&limit=${limit}`);

        if (responseData.success) {
            return { success: true, data: responseData.data || [], error: null };
        } else {
            return { success: false, data: null, error: responseData.message || "Failed to load vendor options." };
        }
    } catch (error) {
        return { success: false, data: null, error: error.message || "Failed to connect to API." };
    }
}

// --- 7. GET VENDOR CITIES (For Filter Dropdown) ---
export const getVendorCitiesAction = async ({role = "user"}) => {
    const endpoint = `/vendors/cities`;

    try {
        const response = await apiFetch(endpoint, {
            role: role,
            auth: true
        });

        if (response.success) {
            return {
                success: true,
                data: response.data || [],
                message: "Cities fetched successfully."
            };
        } else {
            return {
                success: false,
                data: [],
                message: response.message || "Failed to fetch cities."
            };
        }
    } catch (error) {
        console.error("Error fetching vendor cities:", error);
        return {
            success: false,
            data: [],
            message: error.message || "An unexpected network error occurred."
        };
    }
};
