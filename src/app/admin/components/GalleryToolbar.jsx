"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, CheckSquare, XSquare } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { addVendorGalleryItemsAction } from "@/app/actions/admin/vendors";

export default function GalleryToolbar({
    vendorId,
    onUploadComplete,
    bulkMode,
    setBulkMode,
    selectedCount,
    onDeleteSelected,
    clearSelection,
}) {
    const uploadedBatchRef = useRef([]);

    // Collect uploaded items
    const handleUploadSuccess = (result) => {
        if (typeof result.info !== "object") return;
        const url = result.info.secure_url;
        uploadedBatchRef.current.push(url);
    };

    // When uploading finishes
    const handleQueuesEnd = async (result, { widget }) => {
        widget.close();

        if (!vendorId) {
            toast.error("Vendor ID missing — refresh and try again.");
            uploadedBatchRef.current = [];
            return;
        }

        if (uploadedBatchRef.current.length === 0) return;

        const loadingToast = toast.loading("Saving images...");

        const payload = uploadedBatchRef.current.map((url) => ({
            url,
            type: "image",
        }));

        try {
            const res = await addVendorGalleryItemsAction(vendorId, payload);

            toast.dismiss(loadingToast);

            if (!res.success) toast.error(res.message || "Failed to save gallery items");
            else {
                toast.success(`${payload.length} image(s) added!`);
                onUploadComplete?.();
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Failed to save gallery items");
        } finally {
            uploadedBatchRef.current = [];
        }
    };

    if (!vendorId) {
        return (
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <Button disabled>Bulk Select</Button>
                <Button disabled>
                    <Upload className="w-5 mr-2" /> Loading...
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-end justify-between gap-4 flex-wrap">
            {/* LEFT SECTION */}
            <div className="flex gap-3 items-center">
                {/* Toggle Bulk Select Mode */}
                <Button
                    variant={bulkMode ? "destructive" : "outline"}
                    onClick={() => {
                        if (bulkMode) clearSelection();
                        setBulkMode(!bulkMode);
                    }}
                    className="max-md:px-3.5 max-md:py-2 max-md:h-auto max-md:text-[0px]"
                >
                    {bulkMode ? (
                        <>
                            <XSquare className="w-5" /> Cancel
                        </>
                    ) : (
                        <>
                            <CheckSquare className="w-5" /> Bulk Select
                        </>
                    )}
                </Button>

                {/* Delete Selected */}
                {bulkMode && selectedCount > 0 && (
                    <Button
                        variant="destructive"
                        onClick={onDeleteSelected}
                        className="max-md:px-3.5 max-md:py-2 max-md:h-auto max-md:text-[0px]"
                    >
                        <Trash2 className="w-5 mr-2" />
                        Delete ({selectedCount})
                    </Button>
                )}
            </div>

            {/* RIGHT SECTION - UPLOAD */}
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    multiple: true,
                    folder: `vendor-gallery/${vendorId}`,
                    resourceType: "image",
                }}
                onSuccess={handleUploadSuccess}
                onQueuesEnd={handleQueuesEnd}
            >
                {({ open }) => (
                    <Button onClick={() => open()}>
                        <Upload className="w-5 mr-2" /> Upload Images
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    );
}
