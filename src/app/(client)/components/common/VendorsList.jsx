import Link from "next/link";
import { BadgeCheckIcon, Plus, Earth, Star, MapPin, AlertTriangle, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveVendors } from "@/app/actions/vendors";
// Import the three specific sorters
import { VendorPriceSorter, VendorOccasionSorter, VendorRatingSorter } from "../VendorSorter";
import VendorShareButton from "../VendorShareButton";
import VendorSaveButton from "../VendorSaveButton";
import { checkAuthStatus } from "@/app/actions/user/user";
import { getInitials } from "@/utils";
import { GlobalPagination } from "@/components/common/GlobalPagination";

// Helper to pick a consistent color from name (UNCHANGED)
function getBgColor(name) {
    const colors = [
        "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    ];
    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

export const VendorListSkeleton = ({ count = 6 }) => { // Added count prop for flexibility
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="rounded overflow-hidden space-y-4">
                    {/* Image Placeholder */}
                    <Skeleton className="w-full h-60 rounded-xl" />

                    {/* Avatar/Name Placeholder */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>

                    {/* Tagline/Description Placeholder */}
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                    </div>

                    {/* Rating/Price/Button Placeholder */}
                    <div className="flex justify-between mt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
};


// Component to display when the API call fails (UNCHANGED)
const VendorError = ({ errorMessage }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center p-10 min-h-[400px] text-center bg-red-50 rounded-lg border-2 border-red-200">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-red-800 mb-2">
                Data Fetching Error
            </h2>
            <p className="text-red-600 mb-6">
                We encountered an error loading the vendor list. Please try again.
            </p>
            {errorMessage && (
                <p className="text-sm text-red-500 italic">Details: {errorMessage}</p>
            )}
            <Button variant="destructive" onClick={() => window.location.reload()}>
                Reload Page
            </Button>
        </div>
    );
};

// Component to display when no vendors match the filters (UNCHANGED)
const VendorEmptyState = () => (
    <div className="w-full flex flex-col items-center justify-center p-10 min-h-[400px] text-center">
        <Earth className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Vendors Found
        </h2>
        <p className="text-gray-600 mb-6">
            We couldn't find any vendors matching your current criteria.
            Try adjusting your filters or search terms using the controls above.
        </p>
        <Link href="/vendors">
            <Button variant="outline">
                Browse All Vendors
            </Button>
        </Link>
    </div>
);


// ----------------------------------------------------------------------
// 🌟 MAIN SERVER COMPONENT (VendorsList)
// ----------------------------------------------------------------------
const VendorsList = async ({ showControls, filters, isSubPage }) => {

    // 🌟 STEP 1: Fetch user session data (runs on server)
    const authResult = await checkAuthStatus();
    const savedVendorIds = authResult.user?.savedVendors || [];

    // 1. Map URL searchParams to the expected filters object
    // This correctly extracts the 'sort' parameter from the URL filters
    const requestFilters = {
        page: filters?.page || 1, // Default to page 1
        limit: filters?.limit || 12, // Default limit
        // ... (rest of the filters)
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
        // The sort value set by the Client Components is received here
        sort: filters?.sort, 
    };

    let vendors = [];
    let totalVendors = 0;
    let totalPages = 1;
    let error = null;

    try {
        // 2. Call the Server Action with all filters, including 'sort'
        const vendorResult = await getActiveVendors(requestFilters);

        if (vendorResult.error) {
            error = vendorResult.error;
        } else {
            vendors = vendorResult.data || [];
            // Assuming getActiveVendors returns totalCount and totalPages based on your backend logic
            totalVendors = vendorResult.totalCount || 0;
            totalPages = vendorResult.totalPages || 1;
        }
    } catch (e) {
        console.error("Critical error fetching vendors:", e);
        error = "A critical server error occurred.";
    }

    // Determine the current page number for pagination component
    const currentPage = parseInt(requestFilters.page, 10) || 1;


    return (
        <div className="w-full">
            {/* Controls Section: Now using the three dedicated sorters */}
            {showControls && (
                <div className="w-full flex justify-end items-center mt-3 gap-4 md:absolute top-0 right-0 max-md:mb-5">
                    {/* These Client Components read the current 'sort' param and update it on change */}
                    <VendorPriceSorter /> 
                    <VendorRatingSorter />
                    <VendorOccasionSorter />
                    <Button variant={"ghost"} className="text-base">Show On Maps <ArrowRight /></Button>
                </div>
            )}

            {/* Conditional Rendering of Content (UNCHANGED) */}
            {error ? (
                /* Error State */
                <VendorError errorMessage={error} />
            ) : vendors.length === 0 && totalVendors === 0 ? (
                /* Empty State */
                <VendorEmptyState />
            ) : (
                /* Success State (Vendor Grid + Pagination) */
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {vendors.map((vendor) => (
                            <VendorsCard
                                key={vendor._id || vendor.id}
                                vendor={vendor}
                                isAuthenticated={authResult.isAuthenticated}
                                isInitialSaved={savedVendorIds.includes(vendor._id || vendor.id)}
                            />
                        ))}
                    </div>

                    {/* Pagination - Client Component */}
                    {totalPages > 1 && (
                        <GlobalPagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            pageQueryKey="page"
                        />
                    )}
                </>
            )}
        </div>
    );
};


// ----------------------------------------------------------------------
// VENDOR CARD (VendorsCard) - STAYS A SERVER COMPONENT (UNCHANGED)
// ----------------------------------------------------------------------
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
                {/* Vendor Logo + Name */}
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
                            <h3 className="!text-xl max-md:!text-lg text-[#232536] !font-medium truncate">{vendor.businessName}</h3>
                            <div className="w-full flex-between">
                                <span className="mt-1.5 rounded-lg px-1 py-0.5 bg-gray-100 text-sm flex items-center gap-2 w-fit">
                                    <MapPin className="w-4 h-4 mb-1" /> {vendor.address.city}, UAE
                                </span>

                                <VendorShareButton businessName={vendor.businessName} slug={vendor.slug} />

                            </div>
                        </div>
                    </div>
                </div>

                <p className="font-medium md:mt-2 text-primary !text-xs">
                    Price Starting from <span className="font-bold text-sm">AED {vendor.pricingStartingFrom}</span>
                </p>

                {/* Tagline */}
                <p className="line-clamp-2 text-sm">{vendor.businessDescription}</p>

                {/* Rating + Price */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {/* Rating */}
                    <div className="flex items-center">
                        <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                        <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">{vendor.averageRating}/5</p>
                    </div>


                </div>

                <div className="w-full flex-between">
                    <Button asChild>
                        <Link href={`/vendors/${vendor.slug}`}>Know More</Link>
                    </Button>

                    <Link className="!font-semibold flex-center gap-1 text-sm" href={`/compare?vendors=${vendor.slug}`}>Compare <Plus className="size-5" /></Link>
                </div>
            </div>
        </div>
    );
};

export default VendorsList;