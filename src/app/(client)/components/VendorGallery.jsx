"use client";

import React, { useRef, useMemo } from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { Button } from "@/components/ui/button";

export default function VendorGallery({ gallery }) {
  const lightGalleryRef = useRef(null);

  // Prepare gallery images for LightGallery
  const images = useMemo(
    () => gallery?.map(item => ({ src: item.url, thumb: item.url })) || [],
    [gallery]
  );

  const totalImages = images.length;

  // If no images, show fallback message
  if (totalImages === 0) {
    return (
      <div className="w-full h-[300px] blur-xs bg-[url('/new-banner-4.jpg')] bg-cover bg-center">
      </div>
    );
  }

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  // Determine which images to show in the preview grid (Max 4)
  const previewImages = images.slice(0, 4);

  // --- Grid Class Logic based on totalImages ---
  let gridClasses = "grid gap-2 rounded-lg overflow-hidden w-full h-[250px] md:h-[400px]";

  if (totalImages === 1) {
    // 1 image: 1 full column, 1 full row (3/3)
    gridClasses += " grid-cols-1 grid-rows-1";
  } else if (totalImages === 2) {
    // 2 images: 2 columns, 1 row (50% split)
    gridClasses += " grid-cols-2 grid-rows-1";
  } else if (totalImages === 3) {
    // 3 images: 2 columns, 2 rows (50% split in both directions)
    // First image: col-span-1 row-span-2 (left half)
    // Next 2 images: col-span-1 row-span-1 (right quarter sections)
    gridClasses += " grid-cols-2 grid-rows-2";
  } else if (totalImages >= 4) {
    // 4+ images (Max 4 displayed): 3 columns, 2 rows
    // First 2 images: col-span-1 row-span-2 each (left two-thirds)
    // Next 2 images: col-span-1 row-span-1 each (right quarter sections)
    gridClasses += " grid-cols-3 grid-rows-2";
  }

  return (
    <div className="w-full">
      <div
        className={gridClasses}
      >
        {previewImages.map((img, index) => {
          let itemClasses = "relative overflow-hidden cursor-pointer w-full h-full";

          // --- Image Spanning Logic based on index and totalImages ---
          if (totalImages === 1) {
            itemClasses += " col-span-1 row-span-1";
          } else if (totalImages === 2) {
            itemClasses += " col-span-1 row-span-1";
          } else if (totalImages === 3) {
            if (index === 0) {
              itemClasses += " col-span-1 row-span-2"; // Left 50%
            } else {
              itemClasses += " col-span-1 row-span-1"; // Right 50% split
            }
          } else if (totalImages >= 4) {
            if (index === 0 || index === 1) {
              itemClasses += " col-span-1 row-span-2"; // Left two 1/3 sections
            } else {
              itemClasses += " col-span-1 row-span-1"; // Right 1/3 section split
            }
          }

          // Apply special class to the last cell that might contain the "SEE ALL" button
          const isLastVisibleCell = index === (Math.min(totalImages, 4) - 1);
          const needsOverlayButton = isLastVisibleCell && totalImages > 4;

          return (
            <div
              key={index}
              className={itemClasses}
              onClick={() => openGallery(index)}
            >
              <Image
                src={img.thumb}
                alt={`Gallery Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />

              {/* Show the SEE ALL button on the last preview image if there are more than 4 */}
              {needsOverlayButton && (
                <div className="absolute inset-0 flex items-end justify-end p-3">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            openGallery();
                        }}
                        className="bg-white/90 backdrop-blur-sm text-black text-sm !px-3 !py-1 h-auto rounded-lg hover:bg-white transition-colors z-10"
                    >
                        SEE ALL ({totalImages})
                    </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox viewer */}
      <LightGallery
        dynamic
        dynamicEl={images}
        plugins={[lgThumbnail, lgZoom]}
        onInit={(ref) => {
          lightGalleryRef.current = ref.instance;
        }}
      />
    </div>
  );
}