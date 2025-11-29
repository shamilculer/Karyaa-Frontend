"use client";

import * as React from 'react';
import { useClientStore } from '@/store/clientStore';

export function UserDataSync({ currentUserId }) {

    React.useEffect(() => {
        // Sync across tabs (listen for localStorage changes)
        const handleStorageChange = (e) => {
            if (e.key === 'client-store') {
                useClientStore.persist.rehydrate();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return null;
}
