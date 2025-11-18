"use client";

import { useState, useCallback, useRef } from "react";
import { Carousel } from "@/components/ui/carousel";
import { getAllGalleryItems } from "@/app/actions/gallery";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { Loader2 } from "lucide-react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { useMemo } from "react";

export default function GalleryCarousel({ initialItems, hasMore: initialHasMore }) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const hasLoadedRef = useRef(false);
  const lightGalleryRef = useRef(null);

  const gallery = useMemo(
    () => items?.map(item => ({ 
      src: item.url, 
      thumb: item.url,
      subHtml: `<h4>${item.vendor?.businessName || 'Gallery Image'}</h4>`
    })) || [],
    [items]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const galleryData = await getAllGalleryItems({ 
        page: nextPage, 
        limit: 60 
      });

      if (galleryData.items && galleryData.items.length > 0) {
        setItems(prev => [...prev, ...galleryData.items]);
        setPage(nextPage);
        setHasMore(galleryData.pagination?.hasNextPage || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        hasLoadedRef.current = false;
      }, 500);
    }
  }, [page, loading, hasMore]);

  const handleSlideChange = (swiper) => {
    // Load more when user is near the end (3 slides before the last)
    const isNearEnd = swiper.activeIndex >= items.length - 3;
    
    if (isNearEnd && hasMore && !loading) {
      loadMore();
    }
  };

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="opacity-60 text-lg">No gallery items found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative">
        <Carousel
          slidesPerView={1}
          spaceBetween={20}
          withNavigation={true}
          autoplay={false}
          onSlideChange={handleSlideChange}
          navigationPosition="top-right"
          className="mt-8"
        >
          {items.map((item, index) => (
            <div 
              key={item._id} 
              className="relative w-full h-[350px] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openGallery(index)}
            >
              <Image
                src={item.url}
                alt={item.vendor?.businessName || "Gallery image"}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index < 3}
              />
              
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/80 group-hover:via-black/20 transition-all duration-300"></div>
            </div>
          ))}
        </Carousel>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}

        {/* End indicator */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">You've reached the end!</p>
          </div>
        )}
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