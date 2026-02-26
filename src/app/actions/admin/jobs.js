"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getJobPostingsAction = async () => {
    try {
        const response = await apiFetch(`/admin/job-postings`,{
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getJobPostingByIdAction = async (id) => {
    try {
        const response = await apiFetch(`/admin/job-postings/${id}`, {
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const createJobPostingAction = async (data) => {
    try {
        const response = await apiFetch(`/admin/job-postings`, {
            method: "POST",
            body: JSON.stringify(data),
            role: "admin",
            auth: true
        });
        if (response.success) {
            revalidatePath('/careers');
            revalidatePath('/careers/jobs/[slug]', 'page');
        }
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateJobPostingAction = async (id, data) => {
    try {
        const response = await apiFetch(`/admin/job-postings/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            role: "admin",
            auth: true
        });
        if (response.success) {
            revalidatePath('/careers');
            revalidatePath('/careers/jobs/[slug]', 'page');
        }
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteJobPostingAction = async (id) => {
    try {
        const response = await apiFetch(`/admin/job-postings/${id}`, {
            method: "DELETE",
            role: "admin",
            auth: true
        });
        if (response.success) {
            revalidatePath('/careers');
            revalidatePath('/careers/jobs/[slug]', 'page');
        }
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getJobApplicationsAction = async () => {
    try {
        const response = await apiFetch(`/admin/job-applications`, {
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getJobApplicationByIdAction = async (id) => {
    try {
        const response = await apiFetch(`/admin/job-applications/${id}`, {
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteJobApplicationAction = async (id) => {
    try {
        const response = await apiFetch(`/admin/job-applications/${id}`, {
            method: "DELETE",
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const bulkDeleteJobApplicationsAction = async (ids) => {
    try {
        const response = await apiFetch(`/admin/job-applications/bulk-delete`, {
            method: "POST",
            body: JSON.stringify({ ids }),
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateJobApplicationStatusAction = async (id, status) => {
    try {
        const response = await apiFetch(`/admin/job-applications/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
            role: "admin",
            auth: true
        });
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};
