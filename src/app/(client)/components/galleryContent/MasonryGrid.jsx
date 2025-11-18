"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { useEffect, useState, useRef, useMemo } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default function MasonryGrid({ items }) {
    const [mounted, setMounted] = useState(false);
    const lightGalleryRef = useRef(null);

    const gallery = useMemo(
        () => items?.map(item => ({ 
            src: item.url, 
            thumb: item.url,
            subHtml: `<h4>${item.vendor?.businessName || 'Gallery Image'}</h4>`
        })) || [],
        [items]
    );

    useEffect(() => {
        setMounted(true);
        console.log('MasonryGrid received items:', items);
    }, [items]);

    const openGallery = (index = 0) => {
        if (lightGalleryRef.current) {
            lightGalleryRef.current.openGallery(index);
        }
    };

    // Loading skeleton
    if (!mounted) {
        return (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-[1400px] w-full">
                {items?.map((item, index) => (
                    <div key={item._id || index} className="break-inside-avoid mb-6">
                        <div className="relative rounded-xl overflow-hidden shadow-md">
                            <div className="w-full h-80 bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Show message if no items
    if (!items || items.length === 0) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-muted-foreground">No gallery items to display</p>
            </div>
        );
    }

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 max-w-[1600px] w-full">
                {items.map((item, index) => {
                    return (
                        <div
                            key={item._id}
                            className="break-inside-avoid mb-2"
                        >
                            <div 
                                className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group hover:shadow-2xl transition-all duration-300"
                                onClick={() => openGallery(index)}
                            >
                                <div className="relative w-full">
                                    <Image
                                        src={item.url}
                                        alt={item.vendor?.businessName || "Gallery image"}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    />
                                </div>
                                
                                {/* Hover vendor info */}
                                <Link
                                    href={`/vendors/${item.vendor?.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="
                                        absolute bottom-0 left-0 right-0 p-5 z-10 flex items-center gap-3
                                        opacity-0 pointer-events-none translate-y-2
                                        transition-all duration-300
                                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                    "
                                >
                                    <Avatar className="size-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
                                        <AvatarImage
                                            src={item.vendor?.businessLogo}
                                            className="object-cover size-full"
                                        />
                                        <AvatarFallback className="bg-primary text-white text-sm">
                                            {getInitials(item.vendor?.businessName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="!text-white text-lg !font-semibold truncate drop-shadow-lg">
                                            {item.vendor?.businessName}
                                        </h4>
                                    </div>
                                </Link>
                                
                                {/* Dark gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/80 group-hover:via-black/20 rounded-xl transition-all duration-300"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hidden LightGallery Component */}
            <LightGallery
                dynamic
                dynamicEl={gallery}
                plugins={[lgThumbnail, lgZoom]}
                onInit={(ref) => {
                    lightGalleryRef.current = ref.instance;
                }}
            />
        </>
    );
}