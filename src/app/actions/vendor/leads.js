"use server";
import { apiFetch } from "@/lib/api";

/**
 * @desc Server Action to fetch vendor-specific leads with pagination and filters.
 * @param {object} params - Optional query parameters for filtering and pagination.
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.search]
 * @param {string} [params.status]
 * @param {string} [params.eventType]
 * @returns {Promise<{success: boolean, message: string, data?: object, pagination?: object}>}
 */
export const getVendorLeads = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const path = `/leads/vendor?${searchParams}`;
    const res = await apiFetch(path, {
      method: "GET",
      role: "vendor",
      auth: true,
    });
    if (!res.success) {
      return {
        success: false,
        message:
          res.message ||
          "Something went wrong while fetching leads, please try again.",
      };
    }
    return {
      success: res.success,
      message: res.message || "Leads fetched successfully.",
      data: res.data,
      pagination: res.pagination,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Something went wrong while fetching leads, please try again.",
    };
  }
};

/**
 * @desc Server Action to update lead status (single or bulk).
 * @param {string|string[]} leadIds - Single lead ID or array of lead IDs
 * @param {string} status - New status value ("New", "Contacted", "Closed - Won", "Closed - Lost")
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 */
export const updateLeadStatus = async (leadIds, status) => {
  try {
    // Validate inputs
    if (!leadIds || (Array.isArray(leadIds) && leadIds.length === 0)) {
      return {
        success: false,
        message: "Lead ID(s) are required.",
      };
    }

    if (!status) {
      return {
        success: false,
        message: "Status is required.",
      };
    }

    const validStatuses = ["New", "Contacted", "Closed - Won", "Closed - Lost"];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}`,
      };
    }

    const path = "/leads/status";
    const res = await apiFetch(path, {
      method: "PATCH",
      role: "vendor",
      auth: true,
      body: JSON.stringify({
        leadIds,
        status,
      }),
    });

    if (!res.success) {
      return {
        success: false,
        message:
          res.message ||
          "Something went wrong while updating lead status, please try again.",
      };
    }

    return {
      success: res.success,
      message: res.message || "Lead status updated successfully.",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Something went wrong while updating lead status, please try again.",
    };
  }
};


export const deleteLead = async (leadIds) => {
  try {
    if (!leadIds || (Array.isArray(leadIds) && leadIds.length === 0)) {
      return {
        success: false,
        message: "Lead ID(s) are required.",
      };
    }

    const path = "/leads/delete";
    const res = await apiFetch(path, {
      method: "DELETE",
      role: "vendor",
      auth: true,
      body: JSON.stringify({
        leadIds,
      }),
    });

    if (!res.success) {
      return {
        success: false,
        message:
          res.message ||
          "Something went wrong while deleting lead(s), please try again.",
      };
    }

    return {
      success: res.success,
      message: res.message || "Lead(s) deleted successfully.",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Something went wrong while deleting lead(s), please try again.",
    };
  }
};