"use client";

import { useEffect, useState } from "react";
import { VendorsCard } from "./vendorsList/VendorsList";
import { Carousel } from "@/components/ui/carousel";
import { getSavedVendors } from "@/app/actions/user/user";

/**
 * Client-side wrapper for VendorsCarousel that handles saved vendor state
 * This component fetches saved vendors client-side to avoid cookie modification errors
 * 
 * @param {string} sourceType - The source context for tracking (e.g., "recommended", "vendor_page")
 */
export function VendorsCarouselClient({ vendors, isAuthenticated, currentVendor, sourceType = "other" }) {
    const [savedVendorIds, setSavedVendorIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSavedVendors() {
            if (!isAuthenticated) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await getSavedVendors();
                if (result.success && result.data) {
                    const ids = result.data.map(v => v._id || v.id);
                    setSavedVendorIds(ids);
                }
            } catch (error) {
                console.error("Failed to fetch saved vendors:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSavedVendors();
    }, [isAuthenticated]);

    // Filter out current vendor if specified
    const filteredVendors = currentVendor
        ? vendors.filter(vendor => vendor._id !== currentVendor)
        : vendors;

    return (
        <Carousel
            slidesPerView={1}
            spaceBetween={60}
            autoplay={true}
            withNavigation={true}
            withPagination={true}
            navigationPosition="top-right"
            breakpoints={{
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }}
            className="!pb-10 max-md:!mt-10"
        >
            {filteredVendors.map((vendor) => (
                <VendorsCard
                    key={vendor._id}
                    vendor={vendor}
                    isAuthenticated={isAuthenticated}
                    isInitialSaved={savedVendorIds.includes(vendor._id)}
                    source={sourceType}
                />
            ))}
        </Carousel>
    );
}
