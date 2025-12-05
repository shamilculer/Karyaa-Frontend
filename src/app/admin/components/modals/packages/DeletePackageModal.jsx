"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteVendorPackageAction } from "@/app/actions/admin/vendors";

export default function DeletePackageModal({
    vendorId,
    packageId,
    packageName,
    onDelete,
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const res = await deleteVendorPackageAction(vendorId, packageId);

            if (!res.success) {
                toast.error(res.message || "Failed to delete package");
                setIsDeleting(false);
                return;
            }

            // Success toast
            toast.success(`${packageName} deleted successfully.`);

            // Execute onDelete callback
            if (onDelete) {
                onDelete(packageId);
            }

            // Close modal
            setOpen(false);

        } catch (error) {
            console.error("Error deleting package:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="p-0 h-auto hover:text-red-500 transition"
                    disabled={isDeleting}
                >
                    <Trash className="w-4" /> Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        {packageName && (
                            <span className="font-semibold"> "{packageName}"</span>
                        )}
                        and remove all associated data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
