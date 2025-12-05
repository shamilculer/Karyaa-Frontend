"use client";

import * as React from 'react';
import { useClientStore } from '@/store/clientStore';
import { checkAuthStatus } from '@/app/actions/user/user';

export function UserDataSync({ currentUserId }) {
    const { setUser, logout } = useClientStore();

    React.useEffect(() => {
        // 1. Sync across tabs (listen for localStorage changes)
        const handleStorageChange = (e) => {
            if (e.key === 'client-store') {
                useClientStore.persist.rehydrate();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // 2. Perform Auth Check on Mount (Refresh)
        const performAuthCheck = async () => {
            try {
                const { isAuthenticated, user } = await checkAuthStatus("user", false);

                if (isAuthenticated && user) {
                    setUser(user);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            }
        };

        performAuthCheck();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [setUser, logout]);

    return null;
}
