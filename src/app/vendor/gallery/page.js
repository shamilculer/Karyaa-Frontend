// GalleryPage.jsx
"use client";

import * as React from "react";
import Image from "next/image";
import GalleryToolBar from "../components/sections/GalleryToolbar";
import { useVendorStore } from "@/store/vendorStore";
import { getVendorGalleryItems, deleteVendorGalleryItems } from "@/app/actions/shared/gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ <-- SHADCN CHECKBOX

// 🔥 Skeleton loader for suspense fallback
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
//      Gallery Grid
// =============================
function GalleryContent({ vendorId, refreshKey, bulkMode, selected, setSelected }) {
  const [gallery, setGallery] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

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
      }
      setIsLoading(false);
    }

    fetchGallery();
    return () => (isMounted = false);
  }, [vendorId, refreshKey]);

  // ✅ Toggle selection
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  if (isLoading) return <GallerySkeleton />;

  if (error)
    return (
      <div className="text-center text-red-600 py-20 text-lg">
        Failed to load gallery: {error}
      </div>
    );

  if (gallery.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No gallery items yet.</p>
        <p className="text-gray-400 text-sm mt-1">Upload something to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {gallery.map((item) => {
        const isSelected = selected.includes(item._id);

        return (
          <div
            key={item._id}
            onClick={() => bulkMode && toggleSelect(item._id)} // ✅ whole image clickable
            className={`relative rounded-lg overflow-hidden cursor-pointer group transition-all
                ${bulkMode ? "hover:scale-[1.01]" : ""}
            `}
          >
            {/* ✅ Checkbox visible in bulk mode */}
            {bulkMode && (
              <div
                className="absolute size-7 flex-center top-2 left-2 z-20 bg-white rounded-md shadow p-1"
                onClick={(e) => {
                  e.stopPropagation(); // prevent double-toggle
                  toggleSelect(item._id);
                }}
              >
                <Checkbox checked={isSelected} readOnly className="border-gray-400" />
              </div>
            )}

            {/* ✅ White overlay when selected */}
            {bulkMode && isSelected && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10" />
            )}

            {item.mediaType === 'video' ? (
              <div className="relative h-72 w-full">
                <video
                  src={item.url}
                  className="h-72 w-full object-cover rounded-lg"
                  preload="metadata"
                  muted
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <Image
                src={item.url}
                alt="Gallery Image"
                width={300}
                height={300}
                className="h-72 w-full object-cover rounded-lg transition-all"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================
//          PAGE ROOT
// =============================
export default function GalleryPage() {
  const { vendor } = useVendorStore();
  const vendorId = vendor?.id;

  // ✅ Selection state
  const [selected, setSelected] = React.useState([]);
  const [bulkMode, setBulkMode] = React.useState(false);

  // ✅ Refresh key
  const [refreshKey, setRefreshKey] = React.useState(0);

  // ✅ Hydration check
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => setIsHydrated(true), []);

  // ✅ After upload
  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ Delete
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
        setBulkMode={setBulkMode}
        selectedCount={selected.length}
        onDeleteSelected={handleBulkDelete}
        clearSelection={() => setSelected([])}
      />

      <React.Suspense fallback={<GallerySkeleton />}>
        <GalleryContent
          vendorId={vendorId}
          refreshKey={refreshKey}
          bulkMode={bulkMode}
          selected={selected}
          setSelected={setSelected}
        />
      </React.Suspense>
    </div>
  );
}
