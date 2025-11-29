"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { Button } from "@/components/ui/button";

export default function IdeaGallery({ gallery }) {
  const lightGalleryRef = useRef(null);

  const images = useMemo(
    () => gallery?.map((item) => ({ src: item, thumb: item })) || [],
    [gallery]
  );

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  const totalImages = images.length;
  const previewImages = images.slice(0, 4);

  let gridClasses =
    "grid gap-2 rounded-lg overflow-hidden w-full h-[300px] md:h-[380px]";

  if (totalImages === 1) {
    gridClasses += " grid-cols-1 grid-rows-1";
  } else if (totalImages === 2) {
    gridClasses += " grid-cols-2 grid-rows-1";
  } else if (totalImages === 3) {
    gridClasses += " grid-cols-2 grid-rows-2";
  } else if (totalImages >= 4) {
    gridClasses += " grid-cols-3 grid-rows-2";
  }

  return (
    <div className="w-full">
      <div className={gridClasses}>
        {previewImages.map((img, index) => {
          let cell = "relative overflow-hidden cursor-pointer w-full h-full";

          if (totalImages === 3 && index === 0) {
            cell += " col-span-1 row-span-2";
          }

          if (totalImages >= 4 && (index === 0 || index === 1)) {
            cell += " col-span-1 row-span-2";
          }

          const isLast = index === Math.min(totalImages, 4) - 1;
          const showMore = isLast && totalImages > 4;

          return (
            <div key={index} className={cell} onClick={() => openGallery(index)}>
              <Image
                src={img.thumb}
                alt="Idea Image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />

              {showMore && (
                <div className="absolute inset-0 flex items-end justify-end p-3 z-10">
                  <Button
                    className="bg-white/90 text-black text-xs !px-3 !py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(0);
                    }}
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
        dynamicEl={images}
        plugins={[lgThumbnail, lgZoom]}
        onInit={(ref) => (lightGalleryRef.current = ref.instance)}
      />
    </div>
  );
}
