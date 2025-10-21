import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock10, Heart, MapPin, Plus, Share2, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import VendorsCarousel from "../../components/common/VendorsCarousel";
import VendorContact from "../../components/VendorContact";
import ScrollHeaderWrapper from "../../components/ScrollHeaderWrapper";
import VendorGallery from "../../components/VendorGallery";
import { getSingleVendor } from "@/app/actions/vendors";
import StarRating from "../../components/StarRating";

// Helper to get initials (to replace the hardcoded 'VNR')
function getInitials(name) {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 3); // Limit to 3 for the fallback
}

const VendorPage = async ({ params }) => {
  const { vendor: vendorSlug } = params;

  // 1. Fetch Vendor Data
  const vendorDataResponse = await getSingleVendor(vendorSlug);
  const vendorData = vendorDataResponse.data;

  // Handle case where vendor is not found (simple early exit for robustness)
  if (!vendorData) {
    return (
      <div className="min-h-screen container pt-20 text-center">
        <h1 className="text-3xl font-bold">Vendor Not Found</h1>
        <p className="mt-4">The profile you are looking for does not exist or has been made inactive.</p>
        <Link href="/vendors"><Button className="mt-6">Back to Vendors</Button></Link>
      </div>
    );
  }

  const ownerInitials = getInitials(vendorData.ownerName);

  return (
    <div className="min-h-screen">
      {/* ScrollHeaderWrapper (Assuming it includes VendorPopupHeader) */}
      <ScrollHeaderWrapper vendorName={vendorData.businessName} />
      
      {/* Gallery Section - Now passing dynamic data */}
      <div className="container rounded-xl overflow-hidden">
        <VendorGallery gallery={vendorData.gallery} />
      </div>

      <div className="container flex flex-col lg:flex-row gap-8 lg:gap-12 !px-4 sm:!px-6 md:!px-10 relative">
        {/* Vendor Logo & Info - Optimized for responsiveness */}
        <div className="flex-shrink-0 size-32 sm:size-40 -translate-y-6 lg:mt-0">
          <Avatar className="size-full rounded-lg border-4 border-white shadow-lg">
            <AvatarImage
              className="object-cover size-full"
              src={vendorData.businessLogo}
              alt={`${vendorData.businessName} Logo`}
            />
            <AvatarFallback className="bg-gray-200 text-xl font-bold">{ownerInitials}</AvatarFallback>
          </Avatar>
        </div>

        {/* Header Content */}
        <div className="w-full flex items-start lg:items-center -mt-6 lg:mt-0">
          <div className="w-full pr-0 lg:pr-10 relative">
            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-bold">{vendorData.businessName}</h1>
            <p className="uppercase !text-sm text-gray-600">{vendorData.tagline}</p>
            <div className="w-full flex flex-wrap items-center gap-x-7 gap-y-2 mt-4">
              {/* Rating */}
              <div className="flex items-center">
                {/* Replaced with simple StarRating component for cleaner code */}
                <StarRating rating={vendorData.averageRating} size={5} /> 
                <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">
                  {vendorData.averageRating}/5 ({vendorData.reviewCount} Reviews)
                </p>
              </div>

              {/* Location */}
              <div className="flex-center gap-2 text-sm text-gray-700">
                <MapPin className="size-5" />{" "}
                <span>
                  {vendorData.address.city}, {vendorData.address.country}
                </span>
              </div>
            </div>

            {/* Action Buttons - Repositioned for responsiveness */}
            <div className="absolute top-0 right-0 flex items-center gap-3 max-lg:top-auto max-lg:bottom-[-40px] max-lg:right-2">
              {/* Wishlist Button (Assuming a Client Component is desired here) */}
              <Button className="size-10 p-3 rounded-full border border-gray-500 bg-white hover:bg-red-700 hover:text-white flex-center text-primary transition-colors">
                <Heart className="size-5" />
              </Button>

              <Button className="size-10 p-3 rounded-full border border-gray-500 bg-white hover:bg-blue-700 hover:text-white flex-center text-primary transition-colors">
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Sections - Flex structure for responsiveness */}
      <section className="container !mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16 !px-4 sm:!px-6 md:!px-10">
        
        {/* Left Column (Content) */}
        <div className="w-full lg:w-[65%] order-2 lg:order-1">
          {/* Sticky Navigation - Responsive and simplified */}
          <div
            id="vendor-nav"
            className="flex items-center gap-4 sm:gap-10 border-b border-[#636387] overflow-x-auto whitespace-nowrap scrollbar-hide"
          >
            <Link
              href="#about"
              className="py-3 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#services"
              className="py-3 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="#reviews"
              className="py-3 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors"
            >
              Reviews
            </Link>
            {vendorData.packages?.length > 0 && (
              <Link
                href="#packages"
                className="py-3 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors"
              >
                Packages
              </Link>
            )}
          </div>

          <div className="space-y-12">
            
            {/* About Section */}
            <div id="about" className="pt-12">
              <h2 className="uppercase text-2xl font-bold">About</h2>
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">{vendorData.aboutDescription}</p>
              </div>
              
              {/* Owner Info - Added for detail */}
              <div className="mt-6 flex items-center text-sm text-gray-600">
                  <User className="size-5 mr-2" />
                  Owned by: <span className="font-semibold ml-1">{vendorData.ownerName}</span>
              </div>
            </div>

            {/* Services Section */}
            <div id="services">
              <h2 className="uppercase text-2xl font-bold">Services</h2>
              <div className="mt-4 flex gap-3 sm:gap-5 flex-wrap">
                {vendorData.subCategories?.map((sub) => (
                  <span
                    key={sub.slug}
                    className="py-2 px-4 border border-gray-300 rounded-full text-xs sm:text-sm uppercase text-[#191D23] transition-colors hover:bg-gray-100"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews">
              <div className="flex justify-between items-center">
                <h2 className="uppercase text-2xl font-bold">Reviews</h2>
                <Button
                  variant="outline"
                  className="rounded-lg p-4 h-auto text-sm hover:bg-secondary hover:text-white transition-colors"
                >
                  Write a Review <Plus className="ml-1 size-5" />
                </Button>
              </div>

              {vendorData.reviewCount > 0 ? (
                <div className="mt-4 w-full flex flex-col md:flex-row gap-8 md:gap-14 border-b pb-8">
                  <div className="w-full md:w-1/5 flex-center flex-col gap-3 flex-shrink-0">
                    <div className="text-5xl font-heading text-[#121217] font-medium">
                      {vendorData.averageRating}
                      <span className="text-2xl">/5</span>
                    </div>

                    <StarRating rating={vendorData.averageRating} size={5} />

                    <div className="text-sm text-gray-600">{vendorData.reviewCount} Reviews</div>
                  </div>

                  <div className="w-full md:w-4/5">
                    {/* Placeholder for dynamic rating breakdown - using dynamic values for progress bar */}
                    <div className="max-w-md space-y-3">
                      {/* Note: In a real app, this data (rating distribution) would be fetched */}
                      {[5, 4, 3, 2, 1].map((star, index) => (
                         <div key={star} className="w-full flex items-center gap-3">
                           <span className="text-sm w-3">{star}</span>
                           <Progress value={(35 - index * 5) % 100} className="h-2 flex-1" />
                           <span className="text-xs font-medium text-gray-500 w-8 text-right">
                             {/* Placeholder: calculate percentage based on dummy data */}
                             {Math.max(0, 35 - index * 5)}% 
                           </span>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-8 border rounded-lg text-center text-gray-500 bg-gray-50">
                    <p>No reviews to show yet. Be the first to review this vendor!</p>
                </div>
              )}

              {/* Review List - Commented out sample remains commented, but added a container for future dynamic reviews */}
              <div className="mt-8">
                {/* Dynamic Review List goes here */}
              </div>
            </div>
            
            {/* Packages Section - Conditional Rendering */}
            {vendorData.packages?.length > 0 && (
                <div id="packages">
                    <h2 className="uppercase text-2xl font-bold">Packages</h2>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {/* Dynamically Map Packages */}
                    {vendorData.packages.map((pkg, index) => (
                        <div key={index} className="rounded overflow-hidden border border-gray-200 p-4 transition-shadow hover:shadow-lg">
                            <div className="relative">
                                <div className="h-52">
                                    <Image
                                        fill
                                        // Use the package image from schema
                                        src={pkg.image || "/placeholder-package.jpg"} 
                                        alt={pkg.name}
                                        className="w-full h-52 object-cover rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Tags - Using Package Features as tags */}
                            <div className="w-full flex items-center flex-wrap gap-2 mt-4 min-h-[40px]">
                                {pkg.features.slice(0, 3).map((feature, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 uppercase text-xs text-[#4B5768] py-1 px-2 rounded-full"
                                    >
                                        {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                                    </span>
                                ))}
                                {pkg.features.length > 3 && (
                                    <span className="bg-gray-100 uppercase text-xs text-[#4B5768] py-1 px-2 rounded-full">
                                        +{pkg.features.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-4">
                                <div>
                                    <h3 className="!text-xl text-[#232536] !font-medium uppercase leading-snug">
                                        {pkg.name}
                                    </h3>
                                    <span className="block text-sm uppercase text-primary font-bold mt-1">
                                       AED {pkg.priceStartsFrom}
                                    </span>
                                </div>

                                <p className="line-clamp-3 !text-sm text-gray-700">
                                    {pkg.description}
                                </p>

                                <div className="w-full flex items-center gap-3">
                                    <Button className="size-10 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex-center text-primary border border-primary transition-colors">
                                        <Heart />
                                    </Button>
                                    <Button className="flex-1" asChild>
                                        <Link href={`/vendors/${vendorSlug}/packages/${index}`}>View Package</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Right Column (Contact Sticky Sidebar) */}
        <div className="w-full lg:w-[35%] order-1 lg:order-2">
          {/* VendorContact component should likely be a sticky/fixed client component */}
          <div className="sticky top-20">
            <VendorContact vendorName={vendorData.businessName} />
          </div>
        </div>
      </section>

      {/* Similar Vendors Section */}
      <section className="container my-10">
        <div className="relative">
          <div className="flex justify-between items-center max-lg:items-end mb-6 md:mb-8">
            <h2 className="uppercase text-2xl font-bold">Similar Vendors</h2>
            <Button
              asChild
              variant="outline"
              className="text-gray-700 font-medium text-base hover:underline"
            >
              <Link href="/vendors">View All</Link>
            </Button>
          </div>
          <VendorsCarousel />
        </div>
      </section>
    </div>
  );
};

export default VendorPage;