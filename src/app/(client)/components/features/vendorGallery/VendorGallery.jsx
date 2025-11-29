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

export default function VendorGallery({ images }) {
  const lightGalleryRef = useRef(null);

  const gallery = useMemo(
    () => images?.map(item => ({ src: item.url, thumb: item.url })) || [],
    [images]
  );

  const totalImages = gallery.length;

  if (totalImages === 0) {
    return (
      <div className="w-full h-[50px]"/>
    );
  }

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  const previewImages = gallery.slice(0, 4);

  let gridClasses = "grid gap-2 rounded-lg overflow-hidden w-full h-[250px] md:h-[400px]";

  if (totalImages === 1) gridClasses += " grid-cols-1 grid-rows-1";
  else if (totalImages === 2) gridClasses += " grid-cols-2 grid-rows-1";
  else if (totalImages === 3) gridClasses += " grid-cols-2 grid-rows-2";
  else if (totalImages >= 4) gridClasses += " grid-cols-3 grid-rows-2";

  return (
    <div className="w-full">
      <div className={gridClasses}>
        {previewImages.map((img, i) => {
          let classes = "relative overflow-hidden cursor-pointer w-full h-full";

          if (totalImages === 3 && i === 0) classes += " col-span-1 row-span-2";
          else if (totalImages >= 4 && (i === 0 || i === 1)) classes += " col-span-1 row-span-2";

          const isLast = i === Math.min(totalImages, 4) - 1;
          const showOverlay = isLast && totalImages > 4;

          return (
            <div key={i} className={classes} onClick={() => openGallery(i)}>
              <Image
                src={img.thumb}
                alt={`Gallery Image ${i}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />

              {showOverlay && (
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

      <LightGallery
        dynamic
        dynamicEl={gallery}
        plugins={[lgThumbnail, lgZoom]}
        onInit={(ref) => {
          lightGalleryRef.current = ref.instance;
        }}
      />
    </div>
  );
}
