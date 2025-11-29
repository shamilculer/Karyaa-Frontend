'use client';

import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { logoutVendor } from '@/app/actions/vendor/auth';
import { useVendorStore } from '@/store/vendorStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const LogoutAlertModal = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logout = useVendorStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutVendor();
            logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button ><LogOut /> Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 !text-2xl">
                        Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be signed out of your account and redirected to the login page. Any unsaved changes will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-10">
                    <AlertDialogCancel disabled={isLoggingOut}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutAlertModal;