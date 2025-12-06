"use client";

import * as React from 'react';
import { useVendorStore } from '@/store/vendorStore';
import { toast } from 'sonner';

import { syncCurrentVendorDataAction } from '@/app/actions/vendor/auth';

export function VendorDataSync({ currentVendorId }) {

    const setVendor = useVendorStore((state) => state.setVendor);

    React.useEffect(() => {
        if (!currentVendorId) {

            return;
        }

        const syncData = async () => {

            try {
                const data = await syncCurrentVendorDataAction(currentVendorId);

                if (data.success && data.vendor) {
                    setVendor(data.vendor);
                } else if (!data.vendor) {
                    console.warn("Session sync failed:", data.message);
                } else {
                    console.warn("Could not sync vendor data with server:", data.message);
                }

            } catch (error) {
                console.error("An error occurred during vendor synchronization:", error);
            }
        };

        syncData();
    }, [currentVendorId, setVendor]);

    return null;
}
