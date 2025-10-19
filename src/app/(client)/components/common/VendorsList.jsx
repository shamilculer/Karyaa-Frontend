import Link from "next/link";
import { Heart, Share2, BadgeCheckIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { getActiveVendors } from "@/app/actions/vendors";

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


const VendorsList = async () => {
    const vendorResult = await getActiveVendors();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {vendorResult.data.map((vendor, index) => (
                <VendorsCard key={index} vendor={vendor} />
            ))}
        </div>
    );
};

export default VendorsList;

export const VendorsCard = ({ vendor }) => {
    const initials = getInitials(vendor.businessName);
    const bgColor = getBgColor(vendor.businessName);


    return (
        <div className="rounded overflow-hidden">
            <div className="relative group">
                {vendor.isSponsored && (
                    <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-semibold text-xs flex items-center gap-1">
                        <BadgeCheckIcon className="w-5 h-5" />
                        Featured Vendor
                    </Badge>
                )}

                {/* Wishlist Button */}
                <Button className="w-8 h-8 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary absolute top-3 right-3 z-10">
                    <Heart />
                </Button>

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
                            <div className="flex items-center gap-3 mt-1">
                                {vendor.mainCategory.slice(0, 2).map((cat, idx) => (

                                    <span key={idx} className="rounded-lg px-1 py-0.5 bg-gray-100 text-sm">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500" />
                </div>

                {/* Tagline */}
                <p className="line-clamp-2 text-sm">{vendor.aboutDescription}</p>

                {/* Rating + Price */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    {/* Rating */}
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
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

                    <Link className="!font-semibold flex-center gap-1 text-sm" href={`/compare?vendor=${vendor.slug}`}>Compare <Plus className="size-5" /></Link>
                </div>
            </div>
        </div>
    );
};

