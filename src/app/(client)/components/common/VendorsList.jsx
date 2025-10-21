import Link from "next/link";
import { BadgeCheckIcon, Plus, Earth, Star, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { getActiveVendors } from "@/app/actions/vendors";
import VendorFilterModal from "../VendorFilterModal";
import VendorSorter from "../VendorSorter";
import VendorShareButton from "../VendorShareButton";
import VendorSaveButton from "../VendorSaveButton";
import { checkAuthStatus } from "@/app/actions/user/user";


// Helper to generate initials
function getInitials(name) {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

// Helper to pick a consistent color from name
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


// --- MAIN SERVER COMPONENT ---
const VendorsList = async ({ showControls, filters, isSubPage }) => {

    // 🌟 STEP 1: Fetch user session data to get saved vendors
    const authResult = await checkAuthStatus();
    // Assuming checkAuthStatus returns { isAuthenticated: boolean, user: { _id: string, savedVendors: string[] } | null }
    const savedVendorIds = authResult.user?.savedVendors || [];


    // 1. Map URL searchParams to the expected filters object
    const requestFilters = {
        page: filters?.page,
        limit: filters?.limit,
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
    };

    // 2. Call the Server Action with the extracted filters object
    const vendorResult = await getActiveVendors(requestFilters);

    const vendors = vendorResult.data || [];
    
    return (
        <div className="w-full">
            {/* 🎯 The Controls are now rendered first, regardless of vendor count */}
            {showControls && (
                <div className="w-full flex justify-end items-center mt-3 gap-4 md:absolute top-0 right-0 max-md:mb-5">
                    <VendorFilterModal isSubPage={isSubPage} mainCategory={requestFilters.mainCategory}/>
                    <VendorSorter currentSort={filters?.sort} />
                </div>
            )}
            
            {/* Conditional Rendering of Vendor Grid or Empty State Message */}
            {vendors.length === 0 ? (
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {vendors.map((vendor, index) => (
                        <VendorsCard 
                            key={index} 
                            vendor={vendor} 
                            isAuthenticated={authResult.isAuthenticated}
                            // Check if the current vendor's ID is in the user's saved array
                            isInitialSaved={savedVendorIds.includes(vendor._id || vendor.id)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export const VendorsCard = ({ vendor, isAuthenticated, isInitialSaved }) => {
    const initials = getInitials(vendor.businessName);
    const bgColor = getBgColor(vendor.businessName);

    // Get the vendor's ID (assuming it's '_id' from MongoDB)
    const vendorId = vendor._id || vendor.id; 

    return (
        <div className="rounded overflow-hidden">
            <div className="relative group">
                {vendor.isSponsored && (
                    <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-semibold text-xs flex items-center gap-1">
                        <BadgeCheckIcon className="w-5 h-5" />
                        Featured Vendor
                    </Badge>
                )}

                {/* 🌟 STEP 3: Integrate the VendorSaveButton Client Component */}
                {isAuthenticated && vendorId && (
                    <VendorSaveButton 
                        vendorId={vendorId} 
                        isInitialSaved={isInitialSaved}
                    />
                )}
                {/* -------------------------------------------------------- */}


                {/* Swiper */}
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
                            alt={`${vendor.name} cover ${idx + 1}`}
                            className="w-full h-60 object-cover rounded-xl"
                        />
                    ))}
                </Carousel>
            </div>

            <div className="mt-4 px-2 space-y-4">
                {/* Vendor Logo + Name */}
                <div className="flex justify-between items-center gap-6">
                    {/* ... (rest of the card content) ... */}
                    <div className="flex items-center">
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
                        <div>
                            <h3 className="!text-xl max-md:!text-lg text-[#232536] !font-medium">{vendor.businessName}</h3>
                            <span className="mt-1.5 rounded-lg px-1 py-0.5 bg-gray-100 text-sm flex items-center gap-2 w-fit">
                                <MapPin className="w-4 h-4 mb-1" /> {vendor.address.city}, UAE
                            </span>
                        </div>
                    </div>
                    <VendorShareButton businessName={vendor.businessName} slug={vendor.slug} />
                </div>

                {/* Tagline */}
                <p className="line-clamp-2 text-sm">{vendor.aboutDescription}</p>

                {/* Rating + Price */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {/* Rating */}
                    <div className="flex items-center">
                        <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                        <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">{vendor.averageRating}/5</p>
                    </div>

                    {/* Price */}
                    <p className="font-medium md:mt-2 text-primary !text-sm md:text-sm">
                        Starting from <span className="font-bold text-base md:!text-lg">AED {vendor.pricingStartingFrom}</span>
                    </p>
                </div>

                <div className="w-full flex-between">
                    <Button asChild>
                        <Link href={`/vendors/${vendor.slug}`}>Know More</Link>
                    </Button>

                    <Link className="!font-semibold flex-center gap-1 text-sm" href={`/compare?vendor1=${vendor.slug}`}>Compare <Plus className="size-5" /></Link>
                </div>
            </div>
        </div>
    );
};

export default VendorsList;