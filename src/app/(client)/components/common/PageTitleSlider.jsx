"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

export default function PageTitleSlider({ banners, title }) {
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

                return (
                    <CarouselItem key={banner._id} className="w-full h-full relative p-0">
                        <Link href={destinationLink} className="block w-full h-full relative">
                            <Image
                                src={banner.imageUrl}
                                alt={banner.name || title || "Banner"}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />
                        </Link>
                    </CarouselItem>
                );
            })}
        </Carousel>
    );
}
