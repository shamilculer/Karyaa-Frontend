// GalleryPage.jsx
"use client";

import * as React from "react";
import GalleryToolBar from "../components/sections/GalleryToolbar";
import { useVendorStore } from "@/store/vendorStore";
import {
  getVendorGalleryItems,
  deleteVendorGalleryItems,
  updateVendorGalleryItem,
  reorderVendorGalleryItems,
} from "@/app/actions/shared/gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageCropModal from "@/components/common/ImageCropModal";
import SortableGalleryGrid from "@/components/common/SortableGalleryGrid";
import { useS3Upload } from "@/hooks/useS3Upload";
import {
  GripVertical,
  SortAsc,
  SortDesc,
  FlipHorizontal2,
  Save,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 🔥 Skeleton loader
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-72 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// =============================
//      Gallery Grid Container
// =============================
function GalleryContent({
  vendorId,
  refreshKey,
  bulkMode,
  selected,
  setSelected,
  reorderMode,
}) {
  const [gallery, setGallery] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { uploadFile } = useS3Upload();
  const [cropOpen, setCropOpen] = React.useState(false);
  const [cropImages, setCropImages] = React.useState([]);
  const [editingItemId, setEditingItemId] = React.useState(null);
  const [isReplacing, setIsReplacing] = React.useState(false);

  // Track whether the local order has diverged from the server
  const [localGallery, setLocalGallery] = React.useState([]);
  const [hasUnsavedOrder, setHasUnsavedOrder] = React.useState(false);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);

  // ✅ Fetch gallery
  React.useEffect(() => {
    if (!vendorId) return;
    let isMounted = true;

    async function fetchGallery() {
      setIsLoading(true);
      const data = await getVendorGalleryItems(vendorId);
      if (!isMounted) return;
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setGallery(data.items);
        setLocalGallery(data.items);
        setHasUnsavedOrder(false);
      }
      setIsLoading(false);
    }

    fetchGallery();
    return () => (isMounted = false);
  }, [vendorId, refreshKey]);

  // ─── Crop / edit ───────────────────────────────────────
  const urlToFile = (url) => {
    const nameFromUrl = (() => {
      try {
        const u = new URL(url);
        const last = u.pathname.split("/").pop() || "image";
        return last.includes(".") ? last : `${last}.jpg`;
      } catch {
        return "image.jpg";
      }
    })();
    const ext = nameFromUrl.split(".").pop()?.toLowerCase();
    const type =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const emptyBlob = new Blob([], { type });
    return new File([emptyBlob], nameFromUrl, { type, lastModified: Date.now() });
  };

  const openCropForItem = async (item) => {
    try {
      setIsReplacing(true);
      setEditingItemId(item._id);
      const file = urlToFile(item.url);
      setCropImages([{ id: item._id, src: item.url, file }]);
      setCropOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load image for editing.");
      setEditingItemId(null);
    } finally {
      setIsReplacing(false);
    }
  };

  const handleCropComplete = async (files) => {
    const file = files?.[0];
    if (!file || !editingItemId) return;

    setIsReplacing(true);
    const loadingToast = toast.loading("Updating image...");
    try {
      const uploadRes = await uploadFile(file, {
        folder: `vendors/${vendorId}/gallery`,
        isPublic: false,
        role: "vendor",
      });
      if (!uploadRes?.url) throw new Error("Upload failed");

      const updateRes = await updateVendorGalleryItem(editingItemId, { url: uploadRes.url });
      if (updateRes?.error) throw new Error(updateRes.error);

      toast.success("Image updated.");
      const data = await getVendorGalleryItems(vendorId);
      if (!data.error) {
        setGallery(data.items);
        setLocalGallery(data.items);
        setHasUnsavedOrder(false);
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to update image.");
    } finally {
      toast.dismiss(loadingToast);
      setIsReplacing(false);
      setCropOpen(false);
      setCropImages([]);
      setEditingItemId(null);
    }
  };

  // ─── Bulk select ────────────────────────────────────────
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // ─── Reorder helpers ────────────────────────────────────
  const handleOrderChange = (newItems) => {
    setLocalGallery(newItems);
    setHasUnsavedOrder(true);
  };

  const handleQuickSort = (type) => {
    let sorted;
    switch (type) {
      case "reverse":
        sorted = [...localGallery].reverse();
        break;
      case "newest":
        sorted = [...localGallery].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sorted = [...localGallery].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        return;
    }
    setLocalGallery(sorted);
    setHasUnsavedOrder(true);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    const loadingToast = toast.loading("Saving order...");
    try {
      const orderedIds = localGallery.map((i) => i._id);
      const res = await reorderVendorGalleryItems(orderedIds);
      if (res.error) throw new Error(res.error);
      setGallery(localGallery);
      setHasUnsavedOrder(false);
      toast.success("Gallery order saved!");
    } catch (e) {
      toast.error(e.message || "Failed to save order.");
    } finally {
      toast.dismiss(loadingToast);
      setIsSavingOrder(false);
    }
  };

  const handleDiscardOrder = () => {
    setLocalGallery(gallery);
    setHasUnsavedOrder(false);
  };

  // ─── Render ─────────────────────────────────────────────
  if (isLoading) return <GallerySkeleton />;

  if (error)
    return (
      <div className="text-center text-red-600 py-20 text-lg">
        Failed to load gallery: {error}
      </div>
    );

  if (localGallery.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No gallery items yet.</p>
        <p className="text-gray-400 text-sm mt-1">Upload something to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Reorder toolbar — shown only in reorder mode */}
      {reorderMode && (
        <div className="flex flex-wrap items-center gap-3 pb-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <GripVertical className="h-4 w-4" />
            <span>Drag to reorder, or use quick-sort:</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Quick Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleQuickSort("newest")}>
                <SortDesc className="h-4 w-4 mr-2" /> Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickSort("oldest")}>
                <SortAsc className="h-4 w-4 mr-2" /> Oldest First
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleQuickSort("reverse")}>
                <FlipHorizontal2 className="h-4 w-4 mr-2" /> Reverse Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasUnsavedOrder && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardOrder}
                disabled={isSavingOrder}
              >
                <X className="h-4 w-4 mr-1" /> Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSaveOrder}
                disabled={isSavingOrder}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSavingOrder ? "Saving..." : "Save Order"}
              </Button>
            </div>
          )}
        </div>
      )}

      <SortableGalleryGrid
        items={localGallery}
        reorderMode={reorderMode}
        bulkMode={bulkMode}
        selected={selected}
        onToggleSelect={toggleSelect}
        onEdit={openCropForItem}
        isEditDisabled={isReplacing}
        onOrderChange={handleOrderChange}
      />

      <ImageCropModal
        open={cropOpen}
        onClose={() => {
          if (isReplacing) return;
          setCropOpen(false);
          setCropImages([]);
          setEditingItemId(null);
        }}
        images={cropImages}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}

// =============================
//          PAGE ROOT
// =============================
export default function GalleryPage() {
  const { vendor } = useVendorStore();
  const vendorId = vendor?.id;

  const [selected, setSelected] = React.useState([]);
  const [bulkMode, setBulkMode] = React.useState(false);
  const [reorderMode, setReorderMode] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => setIsHydrated(true), []);

  const handleUploadComplete = () => setRefreshKey((prev) => prev + 1);

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    const loading = toast.loading("Deleting items...");
    const res = await deleteVendorGalleryItems(selected);
    toast.dismiss(loading);
    if (res.error) return toast.error(res.error);
    toast.success("Items deleted!");
    setSelected([]);
    setBulkMode(false);
    setRefreshKey((prev) => prev + 1);
  };

  // Modes are mutually exclusive
  const toggleReorderMode = () => {
    setReorderMode((prev) => !prev);
    setBulkMode(false);
    setSelected([]);
  };

  const toggleBulkMode = (val) => {
    setBulkMode(val);
    if (val) {
      setReorderMode(false);
    }
  };

  if (!isHydrated || !vendorId) {
    return (
      <div className="dashboard-container mb-10 space-y-8">
        <div className="flex items-end lg:gap-6 w-full max-lg:flex-wrap">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <GallerySkeleton />
      </div>
    );
  }

  return (
    <div className="mb-10 dashboard-container space-y-8">
      <GalleryToolBar
        vendorId={vendorId}
        onUploadComplete={handleUploadComplete}
        bulkMode={bulkMode}
        setBulkMode={toggleBulkMode}
        selectedCount={selected.length}
        onDeleteSelected={handleBulkDelete}
        clearSelection={() => setSelected([])}
        reorderMode={reorderMode}
        onToggleReorder={toggleReorderMode}
      />

      <React.Suspense fallback={<GallerySkeleton />}>
        <GalleryContent
          vendorId={vendorId}
          refreshKey={refreshKey}
          bulkMode={bulkMode}
          selected={selected}
          setSelected={setSelected}
          reorderMode={reorderMode}
        />
      </React.Suspense>
    </div>
  );
}
