"use server";

export const getActiveJobsAction = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/jobs`, {
            next: { revalidate: 60 } // optional caching
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getJobBySlugAction = async (slug) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/jobs/${slug}`, {
            next: { revalidate: 60 }
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const submitJobApplicationAction = async (id, data) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/jobs/${id}/apply`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
