import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, CheckSquare, XSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addVendorGalleryItems } from "@/app/actions/shared/gallery";
import { useS3Upload } from "@/hooks/useS3Upload";

export default function GalleryToolBar({
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
    const loadingToast = toast.loading("Uploading media...");

    try {
      const uploadedItems = [];
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
      const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

      // Upload files to S3
      for (const file of files) {
        const isImage = file.type.startsWith('image/');
        const isVideo = SUPPORTED_VIDEO_FORMATS.includes(file.type);

        // Validate type
        if (!isImage && !isVideo) {
          toast.error(`Unsupported file type: ${file.name}`);
          continue;
        }

        // Validate video size
        if (isVideo && file.size > MAX_VIDEO_SIZE) {
          toast.error(`Video too large (max 50MB): ${file.name}`);
          continue;
        }

        try {
          const result = await uploadFile(file, {
            folder: `vendors/${vendorId}/gallery`,
            isPublic: false,
            role: 'vendor'
          });

          if (result?.url) {
            uploadedItems.push({
              url: result.url,
              mediaType: isVideo ? 'video' : 'image'
            });
          }
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedItems.length === 0) {
        toast.dismiss(loadingToast);
        setLocalUploading(false);
        return;
      }

      // Save to database
      toast.loading("Saving to gallery...", { id: loadingToast });

      const res = await addVendorGalleryItems(vendorId, uploadedItems);

      toast.dismiss(loadingToast);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${uploadedItems.length} item(s) added!`);
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
        <Button
          variant="destructive"
          disabled={!bulkMode || selectedCount === 0}
          onClick={onDeleteSelected}
          className="max-md:px-3.5 max-md:py-2 max-md:h-auto max-md:text-[0px]"
        >
          <Trash2 className="w-5" /> Delete ({selectedCount})
        </Button>
      </div>

      {/* RIGHT SECTION — Upload */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          disabled={localUploading || uploading}
        />
        <Button
          className="max-md:px-3.5 max-md:py-2 max-md:h-auto"
          onClick={() => fileInputRef.current?.click()}
          disabled={localUploading || uploading}
        >
          {localUploading || uploading ? (
            <>
              <Loader2 className="w-4 md:w-5 animate-spin mr-2" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 md:w-5 mr-2" /> Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
