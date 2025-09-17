"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import Swiper styles - make sure these are also in your main CSS file
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

export function Carousel({
  children,
  slidesPerView = 1.2,
  spaceBetween = 20,
  breakpoints,
  withNavigation = true,
  withPagination = true,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnMouseEnter = true,
  disableOnInteraction = true,
  loop = false,
  speed = 300,
  effect = "slide", // "slide", "fade", "cube", "coverflow", "flip"
  centeredSlides = false,
  className = "",
  navigationInside = false,
  navigationStyles = ""
}) {
  // Generate unique ID for this carousel instance
  const carouselId = React.useId().replace(/:/g, '');
  const prevBtnClass = `prev-btn-${carouselId}`;
  const nextBtnClass = `next-btn-${carouselId}`;

  // Build modules array based on props
  const modules = [Navigation, Pagination];
  if (autoplay) modules.push(Autoplay);
  if (effect === "fade") modules.push(EffectFade);

  return (
    <div className="w-full relative group">
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        navigation={
          withNavigation
            ? {
              prevEl: `.${prevBtnClass}`,
              nextEl: `.${nextBtnClass}`,
              enabled: true
            }
            : false
        }
        pagination={withPagination ? {
          clickable: true,
          enabled: true,
          dynamicBullets: true,
        } : false}
        autoplay={autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction,
          pauseOnMouseEnter,
        } : false}
        loop={loop}
        speed={speed}
        effect={effect}
        centeredSlides={centeredSlides}
        className={`${className}`}
      >
        {React.Children.map(children, (child, index) => {
          // If child is already a CarouselItem/SwiperSlide, return as is
          if (child?.type === CarouselItem || child?.type?.name === 'SwiperSlide') {
            return child;
          }
          // Otherwise wrap it in SwiperSlide
          return <SwiperSlide key={index}>{child}</SwiperSlide>;
        })}
      </Swiper>

      {/* Navigation Buttons */}
      {withNavigation && (
        <>
          {/* Prev Button */}
          <div
            className={cn(
              prevBtnClass,
              "absolute top-1/2 -translate-y-1/2 z-20",
              navigationInside ? "left-3" : "-left-4 md:-left-8"
            )}
          >
            <Button
              className={cn(
                "bg-white h-10 w-10 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 p-0",
                navigationStyles
              )}
            >
              <ChevronLeft className="text-gray-700 h-4 w-4" />
            </Button>
          </div>

          {/* Next Button */}
          <div
            className={cn(
              nextBtnClass,
              "absolute top-1/2 -translate-y-1/2 z-20",
              navigationInside ? "right-3" : "-right-4 md:-right-8"
            )}
          >
            <Button
              className={cn(
                "bg-white h-10 w-10 border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 p-0",
                navigationStyles
              )}
            >
              <ChevronRight className="text-gray-700 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function CarouselItem({ children, className = "" }) {
  return (
    <SwiperSlide className={`${className}`} style={{ height: 'auto' }}>
      {children}
    </SwiperSlide>
  );
}