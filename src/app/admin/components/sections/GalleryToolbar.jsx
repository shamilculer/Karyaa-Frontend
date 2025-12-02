import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, CheckSquare, XSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addVendorGalleryItemsAction } from "@/app/actions/admin/vendors";
import { useS3Upload } from "@/hooks/useS3Upload";

export default function GalleryToolbar({
    vendorId,
    onUploadComplete,
    bulkMode,
    setBulkMode,
    selectedCount,
    onDeleteSelected,
    clearSelection,
}) {
    const fileInputRef = useRef(null);
    const { uploadFile, uploading } = useS3Upload();
    const [localUploading, setLocalUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (!vendorId) {
            toast.error("Vendor ID missing — refresh and try again.");
            return;
        }

        setLocalUploading(true);
        const loadingToast = toast.loading("Uploading images...");

        try {
            const uploadedUrls = [];

            // Upload files to S3
            for (const file of files) {
                // Validate type
                if (!file.type.startsWith('image/')) {
                    toast.error(`Skipping invalid file: ${file.name}`);
                    continue;
                }

                try {
                    const result = await uploadFile(file, {
                        folder: `vendors/${vendorId}/gallery`,
                        isPublic: true
                    });

                    if (result?.url) {
                        uploadedUrls.push(result.url);
                    }
                } catch (err) {
                    console.error(`Failed to upload ${file.name}:`, err);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (uploadedUrls.length === 0) {
                toast.dismiss(loadingToast);
                setLocalUploading(false);
                return;
            }

            // Save to database
            toast.loading("Saving to gallery...", { id: loadingToast });

            const payload = uploadedUrls.map((url) => ({
                url,
                type: "image",
            }));

            const res = await addVendorGalleryItemsAction(vendorId, payload);

            toast.dismiss(loadingToast);

            if (!res.success) {
                toast.error(res.message || "Failed to save gallery items");
            } else {
                toast.success(`${payload.length} image(s) added!`);
                onUploadComplete?.();
            }
        } catch (err) {
            console.error("Gallery upload error:", err);
            toast.dismiss(loadingToast);
            toast.error("Failed to save gallery items");
        } finally {
            setLocalUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={localUploading || uploading}
                />
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={localUploading || uploading}
                >
                    {localUploading || uploading ? (
                        <>
                            <Loader2 className="w-5 mr-2 animate-spin" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 mr-2" /> Upload Images
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
