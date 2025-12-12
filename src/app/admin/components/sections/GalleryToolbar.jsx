import { Button } from "@/components/ui/button";
import { Upload, Trash2, CheckSquare, XSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addVendorGalleryItemsAction } from "@/app/actions/admin/vendors";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";

export default function GalleryToolbar({
    vendorId,
    onUploadComplete,
    bulkMode,
    setBulkMode,
    selectedCount,
    onDeleteSelected,
    clearSelection,
}) {


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
                <ControlledFileUpload
                    value={[]}
                    onChange={async (urls) => {
                        if (!urls || urls.length === 0) return;
                        if (!urls || urls.length === 0) return;

                        const loadingToast = toast.loading(`Saving ${urls.length} image(s) to gallery...`);
                        try {
                            // Map all URLs to payload items
                            const payload = urls.map(url => ({ url, type: "image" }));
                            const res = await addVendorGalleryItemsAction(vendorId, payload);

                            if (!res.success) {
                                toast.error(res.message || "Failed to save gallery item");
                            } else {
                                toast.success("Image added to gallery");
                                onUploadComplete?.();
                            }
                        } catch (err) {
                            console.error("Gallery save error:", err);
                            toast.error("Failed to save gallery item");
                        } finally {
                            toast.dismiss(loadingToast);
                        }
                    }}
                    folderPath={`vendors/${vendorId}/gallery`}
                    allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                    role="admin"
                    enableCrop={true}
                    multiple={true}
                    customTrigger={({ onClick, disabled, uploading }) => (
                        <Button
                            onClick={onClick}
                            disabled={disabled || uploading}
                        >
                            {(disabled || uploading) ? (
                                <>
                                    <Loader2 className="w-5 mr-2 animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 mr-2" /> Upload Images
                                </>
                            )}
                        </Button>
                    )}
                />
            </div>
        </div>
    );
}
