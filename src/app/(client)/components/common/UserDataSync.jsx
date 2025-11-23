"use client";

import * as React from 'react';
import { useClientStore } from '@/store/clientStore';
import { toast } from 'sonner';

import { syncCurrentUserDataAction } from '@/app/actions/user/user';

export function UserDataSync({ currentUserId }) {

    const setUser = useClientStore((state) => state.setUser);

    React.useEffect(() => {
        if (!currentUserId) {
            console.log("UserDataSync: No user ID found. Skipping sync.");
            return;
        }

        const syncData = async () => {

            try {
                const data = await syncCurrentUserDataAction(currentUserId);

                if (data.success && data.user) {
                    setUser(data.user);
                } else if (!data.user) {
                    // Only show error if it's a real failure, not just "not logged in"
                    // But if currentUserId is passed, they SHOULD be logged in.
                    console.warn("Session sync failed:", data.message);
                } else {
                    console.warn("Could not sync user data with server:", data.message);
                }

            } catch (error) {
                console.error("An error occurred during user synchronization:", error);
            }
        };

        syncData();
    }, [currentUserId, setUser]);

    return null;
}
