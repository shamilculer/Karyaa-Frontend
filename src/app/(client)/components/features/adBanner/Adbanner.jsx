"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function AdBanner({ vendorAds }) {
  if (!vendorAds || vendorAds.length === 0) return null;

  return (
    <Carousel
      slidesPerView={1}
      spaceBetween={0}
      loop
      autoplay
      className="overflow-hidden group/carousel border-b-2 border-primary/5"
      navigationInside
    >
      {vendorAds.map((ad) => {
        const destinationLink =
          ad.isVendorSpecific && ad.vendorSlug
            ? `/vendors/${ad.vendorSlug}`
            : ad.customUrl;

        const isVideo = ad.mediaType === "video" && ad.videoUrl;
        const isStandard = ad.displayMode !== "auto"; // Default to standard if missing

        const Wrapper = destinationLink ? Link : "div";
        const wrapperProps = destinationLink ? { href: destinationLink } : {};

        return (
          <div key={ad._id} className="w-full h-full">
            <Wrapper
              {...wrapperProps}
              className={cn(
                "block relative w-full h-full overflow-hidden",
                destinationLink && "group cursor-pointer"
              )}
            >
              {isVideo ? (
                <video
                  src={`${ad.videoUrl}#t=0.01`}
                  poster={ad.imageUrl} // Use image as fallback/poster
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={cn(
                    "w-full object-cover transition-transform duration-1000",
                    isStandard ? "h-auto md:h-[500px]" : "h-auto min-h-auto"
                  )}
                />
              ) : (
                <div className={cn("relative w-full overflow-hidden", isStandard ? "h-auto md:h-[500px]" : "h-auto")}>
                  <Image
                    src={ad.imageUrl}
                    alt={ad.name ?? "Vendor Advertisement"}
                    width={1920}
                    height={1080}
                    className={cn(
                      "w-full object-cover transition-transform duration-1000",
                      isStandard ? "h-full" : "h-auto"
                    )}
                    priority={true}
                  />
                </div>
              )}

              {/* Content Overlay */}
              {ad.showOverlay && (ad.title || ad.tagline) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-6 sm:p-12">
                  <div className="text-center text-white max-w-5xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
                    {ad.title && (
                      <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl font-serif">
                        {ad.title}
                      </h2>
                    )}
                    {ad.tagline && (
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-1 w-20 bg-primary/80 rounded-full my-2" />
                        <p className="text-base sm:text-xl md:text-2xl font-medium text-gray-100/95 drop-shadow-lg max-w-3xl leading-relaxed tracking-wide">
                          {ad.tagline}
                        </p>
                      </div>
                    )}

                    {/* Call to Action - Appears on Hover only if there is a link */}
                    {destinationLink && (
                      <div className="pt-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out delay-100">
                        <span className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/40 text-white text-sm font-semibold tracking-widest uppercase hover:bg-white/20 transition-colors shadow-xl">
                          Discover More
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Wrapper>
          </div>
        );
      })}
    </Carousel>
  );
}
