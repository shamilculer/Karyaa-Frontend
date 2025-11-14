"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // 🟢 REMOVED: Not needed if we use the callback
import { Trash, Loader2 } from "lucide-react";
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
import { deletePackage } from "@/app/actions/vendor/packages";

// 🟢 UPDATED: Accepts onDelete callback
export default function DeletePackageModal({
    packageId,
    packageName,
    onDelete,
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);
    // const router = useRouter(); // 🟢 REMOVED: Not needed

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const res = await deletePackage(packageId);

            if (!res.success) {
                toast.error(res.message || "Failed to delete package");
                setIsDeleting(false);
                return;
            }

            // Success toast
            toast.success(`${packageName} deleted successfully.`);

            // 🟢 EXECUTE onDelete callback
            if (onDelete) {
                onDelete();
            }

            // Close modal
            setOpen(false);

            // ❌ REMOVED: router.refresh() is replaced by the onDelete callback
            // router.refresh(); 

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
                        {" "}and remove all associated data from our servers.
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
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </span>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}