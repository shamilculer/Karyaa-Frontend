"use server"

import { apiFetch } from "@/lib/api";

export async function submitComplaintAction(formData) {
    try {
        const res = await apiFetch(`/complaints`, {
            method: "POST",
            body: formData,
        });

        if (res?.success) {
            return { success: true, message: res.message, data: res.data };
        } else {
            return { success: false, error: res.message || "Failed to submit complaint." };
        }

    } catch (err) {
        console.error("SUBMIT COMPLAINT ACTION ERROR:", err);
        return { success: false, error: "Something went wrong while submitting complaint." };
    }
}

export async function getComplaintsAction() {
    try {
        const res = await apiFetch(`/admin/complaints`, {
            method: "GET",
            role: "admin",
            auth: true
        });

        if (res?.success) {
            return { success: true, data: res.data };
        } else {
            return { success: false, error: res.message || "Failed to fetch complaints." };
        }
    } catch (err) {
        console.error("GET COMPLAINTS ACTION ERROR:", err);
        return { success: false, error: "Something went wrong." };
    }
}

export async function updateComplaintStatusAction(id, status) {
    try {
        const res = await apiFetch(`/admin/complaints/${id}/status`, {
            method: "PATCH",
            body: { status },
            role: "admin",
            auth: true
        });

        if (res?.success) {
            return { success: true, message: res.message };
        } else {
            return { success: false, error: res.message || "Failed to update status." };
        }
    } catch (err) {
        console.error("UPDATE COMPLAINT STATUS ERROR:", err);
        return { success: false, error: "Something went wrong." };
    }
}
