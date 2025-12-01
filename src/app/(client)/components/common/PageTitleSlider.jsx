"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

export default function PageTitleSlider({ banners, defaultTitle, defaultTagline }) {
    return (
        <Carousel
            slidesPerView={1}
            loop={true}
            autoplay={true}
            withNavigation={false}
            withPagination={true}
            className="w-full h-full absolute inset-0"
        >
            {banners.map((banner) => {
                const destinationLink =
                    banner.isVendorSpecific && banner.vendorSlug
                        ? `/vendors/${banner.vendorSlug}`
                        : banner.customUrl || "#";

                const displayTitle = banner.title || defaultTitle;
                const displayTagline = banner.tagline || defaultTagline;
                const showOverlay = !!(displayTitle || displayTagline);

                return (
                    <CarouselItem key={banner._id} className="w-full h-full relative p-0">
                        <Link href={destinationLink} className="block w-full h-full relative">
                            {/* Desktop Image */}
                            <Image
                                src={banner.imageUrl}
                                alt={banner.name || displayTitle || "Banner"}
                                fill
                                className={`object-cover ${banner.mobileImageUrl ? "hidden md:block" : ""}`}
                                priority
                                sizes="100vw"
                            />
                            {/* Mobile Image */}
                            {banner.mobileImageUrl && (
                                <Image
                                    src={banner.mobileImageUrl}
                                    alt={banner.name || displayTitle || "Banner"}
                                    fill
                                    className="object-cover md:hidden"
                                    priority
                                    sizes="100vw"
                                />
                            )}
                        </Link>

                        {/* Conditional Overlay */}
                        {showOverlay && (
                            <>
                                <div className="absolute inset-0 bg-black opacity-30 w-full h-full pointer-events-none z-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <div className="text-white text-center">
                                        {displayTitle && <h1 className="!text-white !text-4xl lg:!text-[55px]">{displayTitle}</h1>}
                                        {displayTagline && (
                                            <p className="mt-2 !text-sm max-md:text-xs">{displayTagline}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </CarouselItem>
                );
            })}
        </Carousel>
    );
}
