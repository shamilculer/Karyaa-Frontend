
"use server"

import { apiFetch } from "@/lib/api";

/**
 * @desc Fetches a list of subcategories from the backend API.
 * @param {Object} filters - Optional object containing query parameters.
 * @param {string} [filters.search] - Text to search subcategory names by.
 * @param {string} [filters.mainCategory] - Slug of the main category to filter by.
 * @param {boolean} [filters.isPopular] - Filter by popular status (true/false).
 * @param {boolean} [filters.isNew] - Filter by new status (true/false).
 * @returns {Promise<{subcategories: Array<Object>, count: number} | {error: string}>}
 */
export const getSubcategories = async (filters = {}) => {
    try {
        // 1. Construct Query String from the passed filters object
        const params = new URLSearchParams();
        
        // Map boolean filters to string values expected by the controller
        if (filters.isPopular !== undefined) {
            params.set('isPopular', filters.isPopular.toString());
        }
        if (filters.isNew !== undefined) {
            params.set('isNew', filters.isNew.toString());
        }
        
        // Map string filters directly
        if (filters.search) {
            params.set('search', filters.search);
        }
        if (filters.mainCategory) {
            params.set('mainCategory', filters.mainCategory);
        }

        const queryString = params.toString();
        
        // 2. Fetch the data from the Express endpoint
        const url = `/subcategories?${queryString}`;

        console.log(url)
        
        // Assuming apiFetch handles the GET request and returns the JSON body
        const responseData = await apiFetch(url); 


        // 3. Return the successful data (matching the controller's response structure)
        return {
            subcategories: responseData.subcategories || [],
            count: responseData.count || 0,
        };
        
    } catch (error) {
        // 4. Handle Errors
        console.error("Server Action: Error fetching subcategories:", error);

        const errorMessage = error.message || "Failed to fetch subcategory list.";
        
        return {
            error: errorMessage,
            subcategories: [], 
            count: 0,
        };
    }
}