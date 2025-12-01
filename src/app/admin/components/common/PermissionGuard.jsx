"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * PermissionGuard Component
 * 
 * Protects admin pages by checking if the current admin has the required permission.
 * If the admin is a super admin (adminLevel === "admin"), they have access to everything.
 * If the admin is a moderator, their accessControl permissions are checked.
 * 
 * @param {Object} props
 * @param {string} props.requiredPermission - The permission key required to access this page (e.g., "vendorManagement")
 * @param {React.ReactNode} props.children - The page content to render if permission is granted
 */
export function PermissionGuard({ requiredPermission, children }) {
    const router = useRouter();
    const { admin } = useAdminStore();

    // Check if admin has permission
    const hasPermission = () => {
        if (!admin) return false;

        // Super admins have access to everything
        if (admin.adminLevel === "admin") return true;

        // For moderators, check specific permission
        // Dashboard and adminSettings are always accessible
        if (requiredPermission === "dashboard" || requiredPermission === "adminSettings") {
            return true;
        }

        return admin.accessControl?.[requiredPermission] === true;
    };

    const isAuthorized = hasPermission();

    // If not authorized, show access denied message
    if (!isAuthorized) {
        return (
            <div className="dashboard-container flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Access Denied</CardTitle>
                        <CardDescription>
                            You don't have permission to access this page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This page requires <span className="font-semibold">{requiredPermission}</span> permission.
                            Please contact your administrator if you believe you should have access.
                        </p>
                        <Button
                            onClick={() => router.push("/admin/dashboard")}
                            className="w-full"
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If authorized, render the page content
    return <>{children}</>;
}
