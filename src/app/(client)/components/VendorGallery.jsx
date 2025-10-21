"use client";

import React, { useRef, useMemo } from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";

// LightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// LightGallery plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { Button } from "@/components/ui/button";

// --- MODIFIED: Accept dynamic 'gallery' prop ---
export default function VendorGallery({ gallery }) {
  const lightGalleryRef = useRef(null);

  // Use memo to format the gallery data for LightGallery
  const images = useMemo(() => 
    gallery?.map(item => ({ src: item.url, thumb: item.url })) || [],
    [gallery]
  );
  
  // Placeholder images if gallery is empty
  const placeholderImages = [
    { src: "/covers/cover-1.jpg", thumb: "/covers/cover-1.jpg" },
    { src: "/covers/cover-2.jpg", thumb: "/covers/cover-2.jpg" },
    { src: "/covers/cover-3.jpg", thumb: "/covers/cover-3.jpg" },
    { src: "/covers/cover-4.jpg", thumb: "/covers/cover-4.jpg" },
  ];
  
  // Use a sensible set of images (dynamic or placeholder) for the grid display
  const displayImages = images.length >= 4 ? images : placeholderImages;
  
  // If the gallery is completely empty, render a simple message
  if (images.length === 0) {
      return (
          <div className="w-full h-[420px] flex items-center justify-center bg-gray-100 rounded-xl text-gray-500">
              <p>No gallery images uploaded yet.</p>
          </div>
      );
  }

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  return (
    <div className="w-full">
      {/* Custom Grid Layout - Optimized for responsiveness using dynamic content */}
      <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-2 h-[300px] sm:h-[420px] rounded-lg overflow-hidden">
        
        {/* First image - tall left column (Always visible) */}
        <a
          href={displayImages[0].src}
          onClick={(e) => {
            e.preventDefault();
            openGallery(0);
          }}
          className="relative col-span-2 md:col-span-1 row-span-2 overflow-hidden block"
        >
          <Image
            src={displayImages[0].thumb}
            alt="Gallery Image 1"
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority // Prioritize the largest image
          />
        </a>
        
        {/* Second image - middle column (Hidden on small screens to save space) */}
        <a
          href={displayImages[1].src}
          onClick={(e) => {
            e.preventDefault();
            openGallery(1);
          }}
          className="relative col-span-1 row-span-2 overflow-hidden hidden md:block"
        >
          <Image
            src={displayImages[1].thumb}
            alt="Gallery Image 2"
            fill
            sizes="33vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </a>
        
        {/* Third image - top right (Always visible) */}
        <div className="relative col-span-1 row-span-1 overflow-hidden hidden sm:block">
          <a
            href={displayImages[2].src}
            onClick={(e) => {
              e.preventDefault();
              openGallery(2);
            }}
            className="block w-full h-full"
          >
            <Image
              src={displayImages[2].thumb}
              alt="Gallery Image 3"
              fill
              sizes="33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </a>
        </div>
        
        {/* Fourth image - bottom right with overlay button (Always visible on all but small screens) */}
        <div className="relative col-span-1 row-span-1 overflow-hidden">
          <a
            href={displayImages[3].src}
            onClick={(e) => {
              e.preventDefault();
              openGallery(3);
            }}
            className="block w-full h-full"
          >
            <Image
              src={displayImages[3].thumb}
              alt="Gallery Image 4"
              fill
              sizes="33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </a>
          {/* Only show "SEE ALL" if there are more than 4 images, or if we are using the placeholders */}
          {(images.length > 4 || images.length >= 4) && (
            <Button
              onClick={() => openGallery()}
              className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-black text-sm px-3 !py-1 !h-auto rounded-lg hover:bg-white transition-colors z-10"
            >
              SEE ALL ({images.length})
            </Button>
          )}
        </div>
      </div>

      {/* LightGallery is now dynamic based on the 'images' array */}
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