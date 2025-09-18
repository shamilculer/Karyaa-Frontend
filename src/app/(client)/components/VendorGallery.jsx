"use client";

import React, { useRef } from "react";
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

const images = [
  { src: "/covers/cover-1.jpg", thumb: "/covers/cover-1.jpg" },
  { src: "/covers/cover-2.jpg", thumb: "/covers/cover-2.jpg" },
  { src: "/covers/cover-3.jpg", thumb: "/covers/cover-3.jpg" },
  { src: "/covers/cover-4.jpg", thumb: "/covers/cover-4.jpg" },
  { src: "/covers/cover-5.jpg", thumb: "/covers/cover-5.jpg" },
  { src: "/covers/cover-6.jpg", thumb: "/covers/cover-6.jpg" },
  { src: "/covers/cover-7.jpg", thumb: "/covers/cover-7.jpg" },
  { src: "/covers/cover-8.jpg", thumb: "/covers/cover-8.jpg" },
];

export default function VendorGallery() {
  const lightGalleryRef = useRef(null);

  const openGallery = (index = 0) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.openGallery(index);
    }
  };

  return (
    <div className="w-full">
      {/* Custom Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[420px] rounded-lg overflow-hidden">
  {/* First image - tall left column */}
  <a
    href={images[0].src}
    onClick={(e) => {
      e.preventDefault();
      openGallery(0);
    }}
    className="relative col-span-1 row-span-2 overflow-hidden"
  >
    <Image
      src={images[0].thumb}
      alt=""
      fill
      className="object-cover hover:scale-105 transition-transform duration-300"
    />
  </a>
  
  {/* Second image - middle column */}
  <a
    href={images[1].src}
    onClick={(e) => {
      e.preventDefault();
      openGallery(1);
    }}
    className="relative col-span-1 row-span-2 overflow-hidden"
  >
    <Image
      src={images[1].thumb}
      alt=""
      fill
      className="object-cover hover:scale-105 transition-transform duration-300"
    />
  </a>
  
  {/* Third image - top right */}
  <div className="relative col-span-1 row-span-1 overflow-hidden">
    <a
      href={images[2].src}
      onClick={(e) => {
        e.preventDefault();
        openGallery(2);
      }}
      className="block w-full h-full"
    >
      <Image
        src={images[2].thumb}
        alt=""
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </a>
  </div>
  
  {/* Fourth image - bottom right with overlay button */}
  <div className="relative col-span-1 row-span-1 overflow-hidden">
    <a
      href={images[3].src}
      onClick={(e) => {
        e.preventDefault();
        openGallery(3);
      }}
      className="block w-full h-full"
    >
      <Image
        src={images[3].thumb}
        alt=""
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </a>
    <Button
      onClick={() => openGallery()}
      className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-black text-sm px-3 !py-1 !h-auto rounded-lg hover:bg-white transition-colors z-10"
    >
      SEE ALL ({images.length})
    </Button>
  </div>
</div>

      {/* LightGallery */}
      <LightGallery
        dynamic
        dynamicEl={images.map((img) => ({
          src: img.src,
          thumb: img.thumb,
        }))}
        plugins={[lgThumbnail, lgZoom]}
        onInit={(ref) => {
          lightGalleryRef.current = ref.instance;
        }}
      />
    </div>
  );
}
