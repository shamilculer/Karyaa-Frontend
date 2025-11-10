import Link from "next/link";
import {
  BadgeCheckIcon,
  Plus,
  Star,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveVendors } from "@/app/actions/vendors";

// Sorters
import {
  VendorPriceSorter,
  VendorOccasionSorter,
  VendorRatingSorter,
} from "./VendorSorter";

import VendorShareButton from "./VendorShareButton";
import VendorSaveButton from "./VendorSaveButton";
import { checkAuthStatus } from "@/app/actions/user/user";
import { getInitials } from "@/utils";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import VendorsMapView from "./VendorMapView";
import ViewToggle from "./ViewToggle";

// ------------------------------------------
// Helper: generate consistent avatar BG color
// ------------------------------------------
function getBgColor(name) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// ------------------------------------------
// Skeleton (Suspense Fallback)
// ------------------------------------------
export const VendorListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="rounded overflow-hidden space-y-4">
          <Skeleton className="w-full h-60 rounded-xl" />

          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          <div className="flex justify-between mt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ------------------------------------------
// Improved Empty State
// ------------------------------------------
const VendorEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-10 min-h-[400px] text-center">
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
      No Matching Vendors
    </h2>
    <p className="text-gray-600 mb-6 max-w-xs">
      Try adjusting your filters to discover more great vendors.
    </p>
  </div>
);

// ------------------------------------------
// 📌 MAIN SERVER COMPONENT
// (Suspense-Compatible)
// ------------------------------------------
const VendorsList = async ({ showControls, filters }) => {
  const authResult = await checkAuthStatus();
  const savedVendorIds = authResult.user?.savedVendors || [];

  const requestFilters = {
    page: filters?.page || 1,
    limit: filters?.limit || 12,
    search: filters?.search,
    mainCategory: filters?.mainCategory,
    subCategory: filters?.subCategory,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    location: filters?.location,
    serviceArea: filters?.serviceArea,
    hasPackages: filters?.hasPackages,
    isSponsored: filters?.isSponsored,
    rating: filters?.rating,
    sort: filters?.sort,
    occasion: filters?.occasion,
  };

  // ✅ if server throws, ErrorBoundary catches it
  const vendorResult = await getActiveVendors(requestFilters);

  if (vendorResult.error) {
    throw new Error(vendorResult.error);
  }

  const vendors = vendorResult.data || [];
  const totalPages = vendorResult.totalPages || 1;
  const currentPage = Number(requestFilters.page) || 1;
  const viewMode = filters?.view || 'list'; // 'list' or 'map'

  return (
    <div className="w-full relative">
      {showControls && (
        <div className="w-full flex justify-end items-center mt-3 gap-4 md:absolute -top-[84px] right-0 max-md:mb-5 flex-wrap">
          <VendorPriceSorter />
          <VendorRatingSorter />
          <VendorOccasionSorter />
          <ViewToggle currentView={viewMode} />
        </div>
      )}

      {/* ✅ Zero State */}
      {vendors.length === 0 ? (
        <VendorEmptyState />
      ) : (
        <>
          {viewMode === 'map' ? (
            <div className="space-y-6">
              <VendorsMapView vendors={vendors} />
              {totalPages > 1 && (
                <GlobalPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  pageQueryKey="page"
                />
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {vendors.map((vendor) => (
                  <VendorsCard
                    key={vendor._id}
                    vendor={vendor}
                    isAuthenticated={authResult.isAuthenticated}
                    isInitialSaved={savedVendorIds.includes(vendor._id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <GlobalPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  pageQueryKey="page"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

// ------------------------------------------
// Card (unchanged)
// ------------------------------------------
export const VendorsCard = ({ vendor, isAuthenticated, isInitialSaved }) => {
  const initials = getInitials(vendor.businessName);
  const bgColor = getBgColor(vendor.businessName);
  const vendorId = vendor._id || vendor.id;

  return (
    <div className="rounded overflow-hidden">
      <div className="relative group">
        {vendor.isRecommended && (
          <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-semibold text-sm flex items-center gap-1">
            <BadgeCheckIcon className="w-5 h-5" />
            Recommended
          </Badge>
        )}

        <VendorSaveButton
          vendorId={vendorId}
          isInitialSaved={isInitialSaved}
        />

        {vendor?.gallery?.length > 0 ? (
          <Carousel
            spaceBetween={0}
            loop
            slidesPerView={1}
            className="w-full h-60"
            navigationInside
            withPagination={false}
            navigationStyles="size-7 p-0 opacity-50"
          >
            {vendor.gallery.map((img, idx) => (
              <Image
                key={idx}
                fill
                src={img.url}
                alt={`${vendor.businessName} cover ${idx + 1}`}
                className="w-full h-60 object-cover rounded-xl"
              />
            ))}
          </Carousel>
        ) : (
          <Image
            height={240}
            width={300}
            src="/new-banner-2.jpg"
            alt={vendor.businessName}
            className="w-full blur-xs h-60 object-cover rounded-xl"
          />
        )}
      </div>

      <div className="mt-4 px-2 space-y-4 w-full">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex items-center w-full">
            <Avatar className="w-14 h-14 rounded-full border mr-3 border-gray-300">
              <AvatarImage
                className="object-cover rounded-full"
                src={vendor.businessLogo}
                alt={vendor.businessName}
              />
              <AvatarFallback
                className={`${bgColor} text-white font-bold flex items-center justify-center`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <h3 className="!text-xl max-md:!text-lg text-[#232536] !font-medium truncate">
                {vendor.businessName}
              </h3>
              <div className="w-full flex-between">
                <span className="mt-1.5 rounded-lg px-1 py-0.5 bg-gray-100 text-sm flex items-center gap-2 w-fit">
                  <MapPin className="w-4 h-4 mb-1" /> {vendor.address.city}, UAE
                </span>

                <VendorShareButton
                  businessName={vendor.businessName}
                  slug={vendor.slug}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="font-medium md:mt-2 text-primary !text-xs">
          Price Starting from{" "}
          <span className="font-bold text-sm">AED {vendor.pricingStartingFrom}</span>
        </p>

        <p className="line-clamp-2 text-sm">{vendor.businessDescription}</p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
            <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">
              {vendor.averageRating}/5
            </p>
          </div>
        </div>

        <div className="w-full flex-between">
          <Button asChild>
            <Link href={`/vendors/${vendor.slug}`}>Know More</Link>
          </Button>

          <Link
            className="!font-semibold flex-center gap-1 text-sm"
            href={`/compare?vendors=${vendor.slug}`}
          >
            Compare <Plus className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorsList;