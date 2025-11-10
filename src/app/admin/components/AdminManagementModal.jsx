"use client"

import * as React from "react"
// Added AlertDialog components and necessary icons
import { Mail, Shield, UserCog, Lock, Trash2, Zap, AlertTriangle, Info, Save } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getInitials } from "@/utils"


import {
    deleteAdminAction,
    toggleAdminStatusAction,
    updateAdminPermissionsAction
} from "@/app/actions/admin/admin"


export function AdminManagementModal({ isOpen, onClose, admin, currentUserLevel, onStatusUpdate, onDeletion, fetchData, currentAdminId }) {
    const canManage = currentUserLevel === 'admin';

    if (!admin) return null;
    const adminId = admin._id || admin.id;

    // --- STATE MANAGEMENT ---
    const [pendingPermissions, setPendingPermissions] = React.useState(admin.accessControl || {});
    const [hasChanges, setHasChanges] = React.useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

    React.useEffect(() => {
        // Check if pendingPermissions deviates from the original admin.accessControl
        const originalAccessControl = admin.accessControl || {};
        const changesDetected = Object.keys(pendingPermissions).some(key =>
            pendingPermissions[key] !== originalAccessControl[key]
        );
        setHasChanges(changesDetected);
    }, [pendingPermissions, admin.accessControl]);


    React.useEffect(() => {
        // Reset permissions when modal opens/changes admin
        setPendingPermissions(admin.accessControl || {});
        setHasChanges(false);
    }, [admin, isOpen]);
    // --- END STATE MANAGEMENT ---

    // --- ACTION HANDLERS ---

    const handlePermissionToggle = (key, checked) => {
        setPendingPermissions(prev => ({
            ...prev,
            [key]: checked,
        }));
        // setHasChanges(true) is handled by the useEffect above
    };

    const handleSavePermissions = async () => {

        try {
            toast.info(`Saving permissions for ${admin.fullName}...`);

            const res = await updateAdminPermissionsAction(adminId, pendingPermissions);

            if (res.success) {
                setHasChanges(false);
                toast.success(res.message);
                // 3. 🟢 PASS UPDATED ADMIN OBJECT (or simply tell parent to re-fetch)
                if (onStatusUpdate) onStatusUpdate(res.admin); // Pass the updated admin object
                if (fetchData) fetchData(); // Guarantee refresh
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during save.");
        }
    }

    // 🎯 INTEGRATING toggleAdminStatusAction
    const handleToggleStatus = async () => {
        toast.info(`Toggling status for ${admin.fullName}...`);

        try {
            // 🚀 ACTUAL SERVER ACTION CALL
            const res = await toggleAdminStatusAction(adminId);

            if (res.success) {
                toast.success(res.message);
                if (onStatusUpdate) onStatusUpdate(res.admin); // Pass updated admin object to parent
                onClose();
                if (fetchData) fetchData(); // Guarantee refresh
            } else {
                // Display the failure message returned by the server action
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred during status update.");
        }
    };

    // 🎯 INTEGRATING deleteAdminAction
    const handleDeleteAdmin = async () => {
        // Frontend self-deletion guard
        if (adminId === currentAdminId) {
            toast.error("You cannot delete your own account.");
            setIsDeleteConfirmOpen(false);
            return;
        }

        toast.info(`Sending request to delete admin ${admin.fullName}...`);
        setIsDeleteConfirmOpen(false);

        try {
            // 🚀 ACTUAL SERVER ACTION CALL
            const res = await deleteAdminAction(adminId);

            if (res.success) {
                toast.success(res.message);
                if (onDeletion) onDeletion(adminId);
                onClose();
                if (fetchData) fetchData(); // Guarantee refresh
            } else {
                // Display the failure message returned by the server action
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected server error occurred during deletion.");
        }
    };

    // --- RENDER ---
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">

                {/* ... Dialog Header (unchanged) ... */}
                <DialogHeader className="flex flex-row pt-5 justify-between gap-10">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 shadow-lg">
                            <AvatarImage src={admin.profileImage} alt={admin.fullName} />
                            <AvatarFallback className="text-xl bg-purple-500 text-white">
                                {getInitials(admin.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <UserCog className="w-6 h-6 text-gray-700" />
                                {admin.fullName}
                            </DialogTitle>
                            <DialogDescription className="text-md text-purple-600 font-medium capitalize">
                                Role: {admin.adminLevel}
                            </DialogDescription>
                        </div>
                    </div>
                    <div>
                        {admin.isActive ? (
                            <Badge variant="outline" className={`py-1 px-2 font-semibold bg-green-100 text-green-900`}>
                                Active
                            </Badge>
                        ) : (
                            <Badge variant="outline" className={`py-1 px-2 font-semibold bg-red-300 text-red-900`}>
                                Inactive
                            </Badge>
                        )}
                        <div className="mt-4 flex items-center text-sm space-x-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700">{admin.email}</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <Separator />

                    {/* Access Permissions Display/Edit */}
                    <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h4 className="font-medium !text-lg flex items-center gap-2 text-gray-700">
                            <Lock className="w-5 h-5" /> Assigned Permissions
                        </h4>
                        {admin.adminLevel === 'admin' ? (
                            <div className="flex items-center p-3 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
                                <Shield className="w-5 h-5 mr-2" />
                                <span className="font-medium">Super Admin:</span> This user has **unrestricted access** to all modules.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(pendingPermissions).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <Label className="capitalize font-medium text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}:</Label>

                                        {!canManage ? (
                                            <Badge variant={value ? "default" : "secondary"} className={`text-xs ${value ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {value ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        ) : (
                                            <Switch
                                                id={key}
                                                checked={value}
                                                onCheckedChange={(checked) => handlePermissionToggle(key, checked)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* SAVE PERMISSIONS BUTTON */}
                        {canManage && hasChanges && admin.adminLevel !== 'admin' && ( // Prevent saving for Super Admins
                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleSavePermissions}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Permissions
                                </Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* --- ADMIN MANAGEMENT CONTROLS (CONDITIONAL EDITING) --- */}
                    {canManage ? (
                        <>
                            <h3 className="!text-lg font-bold text-red-600 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Admin Management Actions
                            </h3>

                            {/* Status Control Button */}
                            <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-yellow-50">
                                <h4 className="font-semibold !text-base flex items-center gap-2 text-yellow-700">
                                    <Zap className="w-5 h-5" /> Status Control
                                </h4>
                                <Button
                                    onClick={handleToggleStatus}
                                    variant={admin.isActive ? "outline" : "default"}
                                    className={admin.isActive ? "border-yellow-600 text-yellow-700 hover:text-yellow-700 hover:bg-yellow-100" : "bg-green-600 hover:bg-green-700"}
                                >
                                    {admin.isActive ? 'Deactivate Admin' : 'Activate Admin'}
                                </Button>
                            </div>

                            {/* Danger Zone with AlertDialog (unchanged structure) */}
                            <div className="space-y-3 p-4 border border-red-100 rounded-lg bg-red-50">
                                <h4 className="font-semibold text-lg flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                                </h4>
                                <p className="!text-sm text-red-600">
                                    Permanently delete this admin account. This action cannot be undone.
                                </p>

                                <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete Admin
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                                                <AlertTriangle className="w-6 h-6" /> Confirm Permanent Deletion
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are about to permanently delete the admin account for **{admin.fullName}** ({admin.email}).
                                                <br /><br />
                                                **This action is irreversible and cannot be undone.**
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteAdmin}
                                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Continue and Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </>
                    ) : (
                        // Message for non-admin users
                        <div className="flex items-center p-3 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50" role="alert">
                            <Info className="w-5 h-5 mr-2" />
                            <span className="font-medium">Read-Only View:</span> Administrative actions are only available to **Admin-level** users.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}