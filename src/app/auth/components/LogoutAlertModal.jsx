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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/app/actions/user/user';
import { useClientStore } from '@/store/clientStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const LogoutAlertModal = ({ isMobile = false }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logout = useClientStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutUser();
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
                {isMobile ? (
                    // For mobile sheet - use a Button
                    <Button variant="destructive" size="sm" className="w-auto">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                ) : (
                    // For desktop dropdown - use DropdownMenuItem
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <LogOut className='w-4 h-4 mr-2' /> 
                        Logout
                    </DropdownMenuItem>
                )}
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