import Link from "next/link";
import {
  BadgeCheckIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveVendors } from "@/app/actions/vendors";

// Sorters
import {
  VendorSortBy,
  VendorOccasionFilter,
  VendorLocationFilter,
} from "./VendorSorter";

import VendorShareButton from "./VendorShareButton";
import VendorSaveButton from "./VendorSaveButton";
import { checkAuthStatus } from "@/app/actions/user/user";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import VendorsMapView from "./VendorMapView";
import ViewToggle from "./ViewToggle";
import StarRating from "../../StarRating";
import { VendorsMapViewWrapper } from "./VendorsMapViewClient";

// Helper function
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

// Skeleton
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

// Empty State
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

// 📌 MAIN SERVER COMPONENT
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
    isRecommended: filters?.isRecommended,
    rating: filters?.rating,
    sort: filters?.sort,
    occasion: filters?.occasion,
  };

  const vendorResult = await getActiveVendors(requestFilters);

  if (vendorResult.error) {
    throw new Error(vendorResult.error);
  }

  const vendors = vendorResult.data || [];
  const totalPages = vendorResult.totalPages || 1;
  const currentPage = Number(requestFilters.page) || 1;
  const viewMode = filters?.view || 'list';

  return (
    <div className="w-full relative">
      {showControls && (
        <div className="w-full flex justify-end items-center mt-3 gap-4 md:absolute -top-16 xl:-top-[84px] right-0 max-md:mb-5 flex-wrap">
          <VendorSortBy />
          <VendorLocationFilter />
          <VendorOccasionFilter />
          <ViewToggle currentView={viewMode} />
        </div>
      )}

      {vendors.length === 0 ? (
        <VendorEmptyState />
      ) : (
        <>
          {viewMode === 'map' ? (
            <VendorsMapViewWrapper
              vendors={vendors}
              isAuthenticated={authResult.isAuthenticated}
              savedVendorIds={savedVendorIds}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
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

// 📌 CARD COMPONENT
export const VendorsCard = ({ vendor, isAuthenticated, isInitialSaved, compact = false }) => {
  const vendorId = vendor._id || vendor.id;

  if (compact) {
    return (
      <div className="rounded overflow-hidden">
        <div className="relative group">
          {vendor.isRecommended && (
            <Badge className="absolute top-3 left-3 z-10 bg-white p-0.5 rounded-2xl text-primary font-semibold !text-xs flex items-center gap-1">
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
              spaceBetween={10}
              loop
              slidesPerView={1}
              className="w-full h-48"
              navigationInside
              withPagination={false}
              navigationStyles="size-7 p-0 opacity-50"
            >
              {vendor.gallery.map((img, idx) => (
                <Link key={idx} href={`/vendors/${vendor.slug}`}>
                  <Image
                    fill
                    src={img.url}
                    alt={`${vendor.businessName} cover ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-3xl"
                  />
                </Link>
              ))}
            </Carousel>
          ) : (
            <Link href={`/vendors/${vendor.slug}`}>
              <Image
                height={198}
                width={300}
                src="/new-banner-2.jpg"
                alt={vendor.businessName}
                className="w-full blur-xs h-48 object-cover rounded-3xl"
              />
            </Link>
          )}
        </div>

        <div className="mt-6 px-0.5 space-y-2 w-full">
          <StarRating rating={vendor.averageRating} />
          <p className="font-medium mt-2 text-primary !text-xs">
            Price Starting from{" "}
            <span className="font-bold text-sm">AED {vendor.pricingStartingFrom}</span>
          </p>
          <div className="w-full relative">
            <Link href={`/vendors/${vendor.slug}`} className="!text-lg text-[#232536] font-heading !font-medium truncate">
              {vendor.businessName}
            </Link>
            <div>
              <VendorShareButton
                businessName={vendor.businessName}
                slug={vendor.slug}
              />
            </div>
          </div>

          <p className="line-clamp-1 !text-xs">{vendor.tagline || vendor.businessDescription}</p>

          <div className="w-full flex-between mt-3">
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
  }

  // Default card layout
  return (
    <div className="rounded overflow-hidden">
      <div className="relative group">
        {vendor.isRecommended && (
          <Badge className="absolute top-3 left-3 z-10 bg-white p-1.5 rounded-2xl text-primary font-semibold text-sm flex items-center gap-1">
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
            spaceBetween={10}
            loop
            slidesPerView={1}
            className="w-full h-60"
            navigationInside
            withPagination={false}
            navigationStyles="size-7 p-0 opacity-50"
          >
            {vendor.gallery.map((img, idx) => (
              <Link key={idx} href={`/vendors/${vendor.slug}`}>
                <Image
                  fill
                  src={img.url}
                  alt={`${vendor.businessName} cover ${idx + 1}`}
                  className="w-full h-60 object-cover rounded-3xl"
                />
              </Link>
            ))}
          </Carousel>
        ) : (
          <Link href={`/vendors/${vendor.slug}`}>
            <Image
              height={240}
              width={300}
              src="/new-banner-2.jpg"
              alt={vendor.businessName}
              className="w-full blur-xs h-60 object-cover rounded-3xl"
            />
          </Link>
        )}
      </div>

      <div className="mt-6 px-2 space-y-2 w-full">
        <StarRating rating={vendor.averageRating} />
        <p className="font-medium md:mt-2 text-primary !text-xs">
          Price Starting from{" "}
          <span className="font-bold text-sm">AED {vendor.pricingStartingFrom}</span>
        </p>
        <div className="w-full relative">
          <Link href={`/vendors/${vendor.slug}`} className="!text-2xl max-md:!text-lg text-[#232536] font-heading !font-medium truncate">
            {vendor.businessName}
          </Link>
          <div>
            <VendorShareButton
              businessName={vendor.businessName}
              slug={vendor.slug}
            />
          </div>
        </div>

        <p className="line-clamp-1 text-sm">{vendor.tagline || vendor.businessDescription}</p>

        <div className="w-full flex-between mt-6">
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