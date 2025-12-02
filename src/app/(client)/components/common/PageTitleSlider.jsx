"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

export default function PageTitleSlider({ banners, defaultTitle, defaultTagline, isAutoHeight = false }) {
    return (
        <Carousel
            slidesPerView={1}
            loop={true}
            autoplay={true}
            withNavigation={false}
            withPagination={true}
            className={`w-full ${isAutoHeight ? 'h-auto' : 'h-full absolute inset-0'}`}
        >
            {banners.map((banner) => {
                const destinationLink =
                    banner.isVendorSpecific && banner.vendorSlug
                        ? `/vendors/${banner.vendorSlug}`
                        : banner.customUrl || "#";

                const displayTitle = banner.title || defaultTitle;
                const displayTagline = banner.tagline || defaultTagline;
                const showOverlay = (banner.showOverlay !== false) && !!(displayTitle || displayTagline);
                const isAuto = banner.displayMode === 'auto';
                const isVideo = banner.mediaType === 'video';

                return (
                    <CarouselItem key={banner._id} className={`w-full ${isAuto ? 'h-auto' : 'h-full relative'} p-0`}>
                        <Link href={destinationLink} className={`${isAuto ? 'block w-full' : 'block w-full h-full relative'}`}>
                            {isVideo ? (
                                // Video rendering
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster={banner.imageUrl}
                                    className={isAuto ? "w-full h-auto" : "w-full h-full object-cover"}
                                >
                                    <source src={banner.videoUrl} type="video/mp4" />
                                    {/* Fallback to image if video fails */}
                                    {isAuto ? (
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name || displayTitle || "Banner"}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-auto"
                                        />
                                    ) : (
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name || displayTitle || "Banner"}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </video>
                            ) : (
                                // Image rendering
                                <>
                                    {/* Desktop Image */}
                                    {isAuto ? (
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name || displayTitle || "Banner"}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className={`w-full h-auto ${banner.mobileImageUrl ? "hidden md:block" : ""}`}
                                            priority
                                        />
                                    ) : (
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name || displayTitle || "Banner"}
                                            fill
                                            className={`object-cover ${banner.mobileImageUrl ? "hidden md:block" : ""}`}
                                            priority
                                            sizes="100vw"
                                        />
                                    )}
                                    {/* Mobile Image */}
                                    {banner.mobileImageUrl && (
                                        isAuto ? (
                                            <Image
                                                src={banner.mobileImageUrl}
                                                alt={banner.name || displayTitle || "Banner"}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-auto md:hidden"
                                                priority
                                            />
                                        ) : (
                                            <Image
                                                src={banner.mobileImageUrl}
                                                alt={banner.name || displayTitle || "Banner"}
                                                fill
                                                className="object-cover md:hidden"
                                                priority
                                                sizes="100vw"
                                            />
                                        )
                                    )}
                                </>
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
