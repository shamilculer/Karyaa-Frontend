"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  effect = "slide",
  centeredSlides = false,
  className = "",
  navigationInside = false,
  navigationStyles = "",
  navigationPosition = "center", // "center" | "top-right" | "top-right-mobile"
  onSlideChange = null,
  onSwiper = null,
}) {
  const carouselId = React.useId().replace(/:/g, '');
  const prevBtnClass = `prev-btn-${carouselId}`;
  const nextBtnClass = `next-btn-${carouselId}`;

  const modules = [Navigation, Pagination];
  if (autoplay) modules.push(Autoplay);
  if (effect === "fade") modules.push(EffectFade);

  const swiperProps = {
    modules,
    slidesPerView,
    spaceBetween,
    breakpoints,
    navigation: withNavigation
      ? {
          prevEl: `.${prevBtnClass}`,
          nextEl: `.${nextBtnClass}`,
          enabled: true
        }
      : false,
    pagination: withPagination ? {
      clickable: true,
      enabled: true,
      dynamicBullets: true,
    } : false,
    autoplay: autoplay ? {
      delay: autoplayDelay,
      disableOnInteraction,
      pauseOnMouseEnter,
    } : false,
    loop,
    speed,
    effect,
    centeredSlides,
    className: `${className}`,
    ...(onSlideChange && { onSlideChange }),
    ...(onSwiper && { onSwiper }),
  };

  // Get navigation positioning classes
  const getNavPosition = (type) => {
    const isTopRight = navigationPosition === "top-right";
    const isTopRightMobile = navigationPosition === "top-right-mobile";
    
    if (isTopRight) {
      // Top right for all screens
      return type === "prev"
        ? "-top-10 md:-top-14 right-10 md:right-12"
        : "-top-10 md:-top-14 right-0";
    }
    
    if (isTopRightMobile) {
      // Top right for mobile, center for desktop
      return type === "prev"
        ? "top-4 right-14 md:top-1/2 md:-translate-y-1/2 md:right-auto md:left-3"
        : "top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-3 md:left-auto";
    }
    
    // Default center position
    return type === "prev"
      ? `top-1/2 -translate-y-1/2 ${navigationInside ? "left-3" : "-left-4 md:-left-8"}`
      : `top-1/2 -translate-y-1/2 ${navigationInside ? "right-3" : "-right-4 md:-right-8"}`;
  };

  return (
    <div className="w-full relative group">
      <Swiper {...swiperProps}>
        {React.Children.map(children, (child, index) => {
          if (child?.type === CarouselItem || child?.type?.name === 'SwiperSlide') {
            return child;
          }
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
              "absolute z-20",
              getNavPosition("prev")
            )}
          >
            <Button
              className={cn(
                "bg-white size-8 md:size-10 border border-secondary rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 p-0",
                navigationStyles
              )}
            >
              <ChevronLeft className="text-secondary h-6 w-6 md:h-7 md:w-7" />
            </Button>
          </div>

          {/* Next Button */}
          <div
            className={cn(
              nextBtnClass,
              "absolute z-20",
              getNavPosition("next")
            )}
          >
            <Button
              className={cn(
                "bg-white size-8 md:size-10 border border-secondary rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 p-0",
                navigationStyles
              )}
            >
              <ChevronRight className="text-secondary h-6 w-6 md:h-7 md:w-7" />
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