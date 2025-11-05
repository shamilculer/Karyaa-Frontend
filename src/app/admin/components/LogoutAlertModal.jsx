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
import { logoutAdmin } from '@/app/actions/admin/auth';
import { useAdminStore } from '@/store/adminStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const LogoutAlertModal = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logout = useAdminStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutAdmin();
            logout();
            router.push('/auth/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Something went wrong, Please try again!")
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