"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function PageTitleSlider({ banners, defaultTitle, defaultTagline }) {
    return (
        <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={banners.length > 1}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            autoHeight={true}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
            className="w-full"
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
                    <SwiperSlide key={banner._id}>
                        <div className={`relative w-full ${isAuto ? '' : 'h-64 md:h-[400px]'}`}>
                            <Link href={destinationLink} className={`block ${isAuto ? 'w-full' : 'absolute inset-0 w-full h-full'}`}>
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
                                        <div className="text-white text-center px-4">
                                            {displayTitle && (banner.showTitle !== false) && <h1 className="!text-white !text-4xl lg:!text-[55px]">{displayTitle}</h1>}
                                            {displayTagline && (
                                                <p className="mt-2 !text-sm max-md:text-xs">{displayTagline}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
