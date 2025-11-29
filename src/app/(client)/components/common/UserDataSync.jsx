"use client";

import * as React from 'react';
import { useClientStore } from '@/store/clientStore';
import { toast } from 'sonner';

import { syncCurrentUserDataAction } from '@/app/actions/user/user';

export function UserDataSync({ currentUserId }) {

    const { user, logout, setUser } = useClientStore();

    React.useEffect(() => {
        // 1. Sync across tabs (listen for localStorage changes)
        const handleStorageChange = (e) => {
            if (e.key === 'client-store') {
                useClientStore.persist.rehydrate();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // 2. Sync with Server (Cookies)
        if (!currentUserId && user) {
            // Server says logged out (no cookie), but client says logged in -> Logout client
            console.log("UserDataSync: Server cookie missing, logging out client.");
            logout();
            return;
        }

        if (!currentUserId) {
            return;
        }

        // 3. Fetch latest data if logged in
        const syncData = async () => {
            try {
                // Check if we are still authenticated with the server
                const data = await syncCurrentUserDataAction(currentUserId);

                if (data.success && data.user) {
                    // We are valid, update store if needed
                    if (!user || JSON.stringify(user) !== JSON.stringify(data.user)) {
                        setUser(data.user);
                    }
                } else {
                    // Server says we are NOT authenticated (or user invalid)
                    // But client thinks we are logged in -> Force Logout
                    if (user) {
                        console.warn("Session sync failed: Server session invalid. Logging out.");
                        logout();
                    }
                }
            } catch (error) {
                console.error("An error occurred during user synchronization:", error);
            }
        };

        // Initial Sync
        if (currentUserId) {
            syncData();
        }

        // 4. Re-validate on Window Focus (User comes back to tab)
        const handleFocus = () => {
            if (currentUserId) {
                syncData();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, [currentUserId, setUser, logout, user]);

    return null;
}
