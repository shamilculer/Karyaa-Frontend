"use client";

import * as React from 'react';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';

import { syncCurrentAdminDataAction } from '@/app/actions/admin/auth'; 

export function AdminDataSync({ currentAdminId }) {

    const setAdmin = useAdminStore((state) => state.setAdmin);

    React.useEffect(() => {
        if (!currentAdminId) {
            console.log("AdminDataSync: No admin ID found. Skipping sync.");
            return;
        }

        const syncData = async () => {

            try {
                const data = await syncCurrentAdminDataAction(currentAdminId);
                
                if (data.success && data.admin) {
                    setAdmin(data.admin); 
                } else if (!data.admin) {
                    toast.error(data.message || "Session expired. Please log in again.");
                } else {
                    toast.warning(data.message || "Could not sync admin data with server.");
                }

            } catch (error) {
                toast.error("An error occurred during synchronization attempt.");
            }
        };

        syncData();
    }, [currentAdminId, setAdmin]); 

    return null;
}