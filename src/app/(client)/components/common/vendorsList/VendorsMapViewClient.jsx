"use client";
import { useState, useEffect } from "react";
import { VendorsCard } from "./VendorsList";
import VendorsMapView from "./VendorMapView";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { useSearchParams } from "next/navigation";

export const VendorsMapViewWrapper = ({ vendors, isAuthenticated, savedVendorIds }) => {
  const [hoveredVendorId, setHoveredVendorId] = useState(null);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(vendors.length / 12); // Adjust based on your pagination

  useEffect(() => {
    if (hoveredVendorId) {
      // Dispatch event to open popup on map (this will close others automatically)
      const event = new CustomEvent('openMapPopup', { detail: hoveredVendorId });
      window.dispatchEvent(event);
    } else {
      // When hovering out, close the popup
      const event = new CustomEvent('closeMapPopup');
      window.dispatchEvent(event);
    }
  }, [hoveredVendorId]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-full">
      {/* LEFT SIDE: Scrollable List with 2-column grid */}
      <div className="w-full lg:w-1/2 overflow-y-auto xl:pr-4">
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6 max-xl:h-[calc(100vh-100px)] overflow-y-auto">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              onMouseEnter={() => setHoveredVendorId(vendor._id)}
              onMouseLeave={() => setHoveredVendorId(null)}
            >
              <VendorsCard
                vendor={vendor}
                isAuthenticated={isAuthenticated}
                isInitialSaved={savedVendorIds.includes(vendor._id)}
                compact={true}
              />
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-6">
            <GlobalPagination
              totalPages={totalPages}
              currentPage={currentPage}
              pageQueryKey="page"
            />
          </div>
        )}
      </div>
      {/* RIGHT SIDE: Sticky Map */}
      <div className="w-full lg:w-1/2 xl:sticky lg:top-20 h-[600px] lg:h-[calc(100vh-100px)]">
        <VendorsMapView
          vendors={vendors}
          isAuthenticated={isAuthenticated}
          savedVendorIds={savedVendorIds}
        />
      </div>
    </div>
  );
};