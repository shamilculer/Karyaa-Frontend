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
      // Dispatch event to open popup on map
      const event = new CustomEvent('openMapPopup', { detail: hoveredVendorId });
      window.dispatchEvent(event);
    }
    // Don't close when hoveredVendorId becomes null - let it stay open
  }, [hoveredVendorId]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-full">
      {/* LEFT SIDE: Scrollable List with 2-column grid */}
      <div className="xl:w-1/2 overflow-y-auto xl:pr-4">
        <div className="hidden xl:grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              onMouseEnter={() => setHoveredVendorId(vendor._id)}
              onMouseLeave={() => setHoveredVendorId(null)}
              className="transition-transform hover:scale-[1.02]"
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
      <div className="xl:w-1/2 xl:sticky xl:top-4 h-[600px] xl:h-[calc(100vh - 100px)]">
        <VendorsMapView
          vendors={vendors}
          isAuthenticated={isAuthenticated}
          savedVendorIds={savedVendorIds}
        />
      </div>
    </div>
  );
};