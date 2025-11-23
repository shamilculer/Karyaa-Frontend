"use server";

import { apiFetch } from "@/lib/api";

export async function getAllLeads(page = 1, limit = 20, status = 'All', search = '', vendorId = '') {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status && status !== 'All') {
            params.append('status', status);
        }

        if (search) {
            params.append('search', search);
        }

        if (vendorId) {
            params.append('vendorId', vendorId);
        }

        const response = await apiFetch(`/admin/leads?${params.toString()}`, {
            method: 'GET',
            auth: true,
            role: "admin"
        });

        if (!response.success) {
            return { error: response.message || 'Failed to fetch leads' };
        }

        return {
            leads: response.data,
            totalLeads: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
            currentPage: response.pagination.currentPage,
        };
    } catch (error) {
        console.error('Error fetching leads:', error);
        return { error: 'Failed to fetch leads' };
    }
}

export async function updateLeadStatus(leadIds, status) {
    try {
        const response = await apiFetch('/admin/leads/status', {
            method: 'PATCH',
            body: JSON.stringify({ leadIds, status }),
            auth: true,
            role: "admin"
        });

        if (!response.success) {
            return { error: response.message || 'Failed to update lead status' };
        }

        return { success: true, message: response.message };
    } catch (error) {
        console.error('Error updating lead status:', error);
        return { error: 'Failed to update lead status' };
    }
}

export async function deleteLead(leadIds) {
    try {
        const response = await apiFetch('/admin/leads', {
            method: 'DELETE',
            body: JSON.stringify({ leadIds }),
            auth: true,
            role: "admin"
        });

        if (!response.success) {
            return { error: response.message || 'Failed to delete lead' };
        }

        return { success: true, message: response.message };
    } catch (error) {
        console.error('Error deleting lead:', error);
        return { error: 'Failed to delete lead' };
    }
}
