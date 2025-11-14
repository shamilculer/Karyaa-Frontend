// Vendor profile page performs server-side auth and data fetching using cookies; mark dynamic.
export const dynamic = 'force-dynamic';

import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Globe,
  MapPin,
  Plus,
  Star,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import VendorsCarousel from "../../components/common/VendorsCarousel";
import VendorContact from "../../components/VendorContact";
import ScrollHeaderWrapper from "../../components/ScrollHeaderWrapper";
import VendorGalleryWrapper from "../../components/vendorGallery/VendorGalleryWrapper";
import { getSingleVendor } from "@/app/actions/vendors";
import StarRating from "../../components/StarRating";
import { getInitials } from "@/utils";
import { checkAuthStatus } from "@/app/actions/user/user";
import VendorSaveButton from "../../components/common/vendorsList/VendorSaveButton";
import VendorShareButton from "../../components/common/vendorsList/VendorShareButton";
import { getVendorReviews } from "@/app/actions/reviews";
import Reviews from "../../components/Reviews";
import ReviewFormModal from "../../components/ReviewFormModal";
import { Suspense } from "react";
import { getVendorPackages } from "@/app/actions/packages";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ViewPackageModal from "../../components/ViewPackageModal";
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp, IconBrandX } from "@tabler/icons-react";

const VendorPage = async ({ params }) => {
  const { vendor: vendorSlug } = await params;

  const vendorDataResponse = await getSingleVendor(vendorSlug);
  const authResult = await checkAuthStatus();
  const vendorData = vendorDataResponse.data;
  const savedVendorIds = authResult.user?.savedVendors || [];

  // Handle case where vendor is not found (simple early exit for robustness)
  if (!vendorData) {
    return (
      <div className="min-h-screen container pt-20 text-center">
        <h1 className="text-3xl font-bold">Vendor Not Found</h1>
        <p className="mt-4">
          The profile you are looking for does not exist or has been made
          inactive.
        </p>
        <Link href="/vendors">
          <Button className="mt-6">Back to Vendors</Button>
        </Link>
      </div>
    );
  }

  const packageData = await getVendorPackages(vendorData._id);
  const packages = packageData?.data;

  // 1. CONDITIONAL REVIEW FETCHING
  let reviews = [];
  if (vendorData.reviewCount > 0) {
    const reviewsResult = await getVendorReviews(vendorData._id);
    reviews = reviewsResult.reviews || [];
  }

  const ownerInitials = getInitials(vendorData.ownerName);
  // Function to safely calculate the percentage for the progress bar width
  const getProgressBarValue = (count, total) => {
    if (total === 0 || count === 0) return 0;
    // We keep the percentage logic here only to drive the visual width of the bar
    return Math.round((count / total) * 100);
  };

  const getWhatsAppLink = (number) => {
    if (!number) return null;

    // remove everything except digits
    const cleaned = number.replace(/[^0-9]/g, "");

    return `https://wa.me/${cleaned}`;
  };

  const hasPackages = packages.length > 0;

  return (
    <div className="min-h-screen">
      {/* ScrollHeaderWrapper (Assuming it includes VendorPopupHeader) */}
      <ScrollHeaderWrapper
        vendorData={{
          businessName: vendorData.businessName,
          ownerName: vendorData.ownerName,
          businessLogo: vendorData.businessLogo,
        }}
        hasPackages={hasPackages}
        whatsappLink = {getWhatsAppLink(vendorData?.whatsAppNumber)}
      />

      {/* Gallery Section - Now passing dynamic data */}
      <div className="container rounded-xl overflow-hidden">
        <Suspense
          fallback={
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
          }
        >
          <VendorGalleryWrapper vendorId={vendorData._id} />
        </Suspense>
      </div>

      <div className="container flex flex-col lg:flex-row gap-6 lg:gap-12 !px-4 sm:!px-6 md:!px-10 relative">
        {/* Vendor Logo & Info - Optimized for responsiveness */}
        <div className="flex-shrink-0 size-28 sm:size-40 -translate-y-6 lg:mt-0">
          <Avatar className="size-full rounded-lg border-4 border-white shadow-lg">
            <AvatarImage
              className="object-cover size-full"
              src={vendorData.businessLogo}
              alt={`${vendorData.businessName} Logo`}
            />
            <AvatarFallback className="bg-gray-200 text-xl font-bold">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Header Content */}
        <div className="w-full flex items-start lg:items-center -mt-6 lg:mt-0">
          <div className="w-full pr-0 lg:pr-10 relative">
            <h1 className="!text-[32px] md:text-4xl leading-tight font-bold !capitalize">
              {vendorData.businessName}
            </h1>
            <p className="uppercase !text-sm text-gray-600">
              {vendorData.tagline}
            </p>
            <div className="w-full flex flex-wrap items-center justify-between gap-x-7 gap-y-3 sm:gap-y-2 mt-4">
              <div className="flex items-center flex-wrap gap-4">
                {/* Rating */}
                <div className="flex items-center">
                  {/* Replaced with simple StarRating component for cleaner code */}
                  <StarRating rating={vendorData.averageRating} size={5} />
                  <p className="ms-2 text-xs md:text-sm font-bold text-gray-900">
                    {vendorData.averageRating}/5 ({vendorData.reviewCount}{" "}
                    Reviews)
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

              <Link
                className="!font-medium font-heading flex items-center gap-1"
                href={`/compare`}
              >
                <Plus /> Compare {vendorData.businessName}
              </Link>
            </div>

            {/* Action Buttons - Repositioned for responsiveness */}
            <div className="absolute top-0 right-0 flex items-center gap-3 max-lg:-top-16 max-lg:right-2">
                <VendorSaveButton
                  vendorId={vendorData._id}
                  isInitialSaved={savedVendorIds.includes(
                    vendorData._id || vendorData.id
                  )}
                  isVendorPage={true}
                />
              <VendorShareButton
                businessName={vendorData.businessName}
                slug={vendorData.slug}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="container !mt-0 md:!mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16 !px-4 sm:!px-6 md:!px-10">
        <div className="w-full lg:w-[65%] order-2 lg:order-1">
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
            {hasPackages && (
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
              <div className="flex items-center justify-between gap-10">
                <h2 className="uppercase text-2xl font-bold">About</h2>

                <div className="flex items-center gap-4">
                  {vendorData?.websiteLink && (
                    <Button asChild variant="ghost" className="p-0">
                      <Link href={vendorData.websiteLink} target="_blank">
                        <Globe className="text-primary" />
                      </Link>
                    </Button>
                  )}

                  {vendorData?.facebookLink && (
                    <Button asChild variant="ghost" className="p-0">
                      <Link href={vendorData.facebookLink} target="_blank">
                        <IconBrandFacebook className="text-primary" />
                      </Link>
                    </Button>
                  )}

                  {vendorData?.instagramLink && (
                    <Button asChild variant="ghost" className="p-0">
                      <Link href={vendorData.instagramLink} target="_blank">
                        <IconBrandInstagram className="text-primary" />
                      </Link>
                    </Button>
                  )}

                  {vendorData?.twitterLink && (
                    <Button asChild variant="ghost" className="p-0">
                      <Link href={vendorData.twitterLink} target="_blank">
                        <IconBrandX className="text-primary" />
                      </Link>
                    </Button>
                  )}

                  <Button asChild variant="ghost" className="p-0">
                    <Link href={getWhatsAppLink(vendorData?.whatsAppNumber)} target="_blank">
                      <IconBrandWhatsapp className="text-primary" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {vendorData.businessDescription}
                </p>
              </div>

              {/* Owner Info - Added for detail */}
              <div className="mt-6 flex items-center text-sm text-gray-600">
                <User className="size-5 mr-2" />
                Owned by:{" "}
                <span className="font-semibold ml-1">
                  {vendorData.ownerName}
                </span>
              </div>
            </div>

            {/* Services Section */}
            <div id="services">
              <h2 className="uppercase text-2xl font-bold">Services</h2>
              <div className="mt-4 flex gap-3 sm:gap-5 flex-wrap">
                {vendorData.subCategories?.map((sub) => (
                  <span
                    key={sub.slug}
                    className="py-1 px-2.5 sm:py-2 sm:px-4 border border-gray-300 rounded-full text-xs sm:text-sm uppercase text-[#191D23] transition-colors hover:bg-gray-100"
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
                {authResult.isAuthenticated && (
                  <ReviewFormModal vendorId={vendorData._id} />
                )}
              </div>

              {vendorData.reviewCount > 0 ? (
                <div className="w-full">
                  <div className="mt-4 w-full flex flex-col md:flex-row gap-8 md:gap-14 pb-8">
                    <div className="w-full md:w-1/5 flex-center flex-col gap-3 flex-shrink-0">
                      <div className="text-5xl font-heading text-[#121217] font-medium">
                        {vendorData.averageRating}
                        <span className="text-2xl">/5</span>
                      </div>

                      <StarRating rating={vendorData.averageRating} size={5} />

                      <div className="text-sm text-gray-600">
                        {vendorData.reviewCount} Reviews
                      </div>
                    </div>

                    <div className="w-full md:w-4/5">
                      <div className="max-w-md space-y-3">
                        {/* Rating Distribution Breakdown */}
                        {[5, 4, 3, 2, 1].map((star) => {
                          // Get the count for the current star level (default to 0 if not found)
                          const starCount =
                            vendorData.ratingBreakdown?.[star] || 0;

                          // Calculate the percentage width for the progress bar (Visual only)
                          const percentage = getProgressBarValue(
                            starCount,
                            vendorData.reviewCount
                          );

                          return (
                            <div
                              key={star}
                              className="w-full flex items-center gap-3"
                            >
                              {/* Star Label */}
                              <div className="flex items-center">
                                {star}{" "}
                                <Star className="text-yellow-300 fill-yellow-300 w-3 h-3" />
                              </div>

                              {/* Progress Bar - Value used for visual width */}
                              <Progress
                                value={percentage}
                                className="h-2 flex-1 bg-gray-200"
                              />

                              {/* Count Display (The requested output) */}
                              <span className="text-sm font-medium text-gray-700 text-right">
                                {starCount}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 w-full">
                    <Reviews reviews={reviews} />
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-8 border rounded-lg text-center text-gray-500 bg-gray-50">
                  <p>
                    No reviews to show yet. Be the first to review this vendor!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Contact Sticky Sidebar) */}
        <div className="w-full lg:w-[35%] order-1 lg:order-2">
          {/* VendorContact component should likely be a sticky/fixed client component */}
          <div>
            <VendorContact
              vendorInfo={{
                businessName: vendorData.businessName,
                ownerName: vendorData.ownerName,
                ownerLogo: vendorData.ownerProfileImage,
                vendorId: vendorData._id,
              }}
              user={authResult}
            />
          </div>
        </div>
      </section>

      {/* Similar Vendors Section */}
      <section id="packages" className="container my-10">
        {/* Packages Section - Conditional Rendering */}
        {hasPackages && (
          <div className="mb-10">
            <h2 className="uppercase text-2xl font-bold">Packages</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Dynamically Map Packages */}
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className="min-h-[570px] p-3 border-0 shadow-none gap-2 relative"
                >
                  <CardHeader className="p-0">
                    <Image
                      src={pkg.coverImage}
                      width={300}
                      height={300}
                      alt={pkg.name}
                      className="w-full object-cover rounded-xl h-64"
                    />
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-2">
                      {pkg.services?.slice(0, 3).map((service) => (
                        <Badge
                          key={service}
                          className="text-xs rounded-full bg-gray-200 text-gray-600"
                        >
                          {service.name}
                        </Badge>
                      ))}

                      {pkg.services && pkg.services.length > 3 && (
                        <Badge className="text-xs rounded-full bg-gray-200 text-gray-600">
                          & {pkg.services.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <h3 className="!text-[20px] mt-5 leading-5 line-clamp-1">
                      {pkg.name}
                    </h3>
                    <span className="leading-0 !text-sm">{pkg.subheading}</span>

                    <div className="my-3">
                      <p className="!text-sm !font-medium font-heading text-gray-700 mb-2">
                        This package includes:
                      </p>

                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                        {pkg.includes?.slice(0, 3).map((item, index) => (
                          <li key={index} className="truncate">
                            {item}
                          </li>
                        ))}

                        {pkg.includes?.length > 5 && (
                          <li className="list-none pl-4 text-gray-400">....</li>
                        )}
                      </ul>
                    </div>

                    <div className="w-full">
                      <ViewPackageModal packageData={pkg} />
                    </div>
                  </CardContent>

                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="relative">
          <div className="flex justify-between items-center max-lg:items-end mb-6 md:mb-8">
            <h2 className="uppercase text-2xl font-bold">Similar Vendors</h2>
          </div>
          <VendorsCarousel currentVendor={vendorData._id} />
        </div>
      </section>
    </div>
  );
};

export default VendorPage;
