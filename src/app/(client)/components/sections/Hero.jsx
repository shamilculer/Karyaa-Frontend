"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'swiper/css/effect-coverflow';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Hero = ({ data } = {}) => {
  const defaultImages = [
    "/new-banner-9.jpg",
    "/new-banner-18.jpg",
    "/cta-2.webp",
    "/new-banner-3.jpg",
    "/new-banner-6.jpg",
    "/new-banner-4.jpg",
    "/new-banner-1.jpg",
    "/banner-1.avif",
    "/new-banner-2.jpg",
    "/banner-3.avif",
    "/new-banner-10.jpg",
    "/banner-4.jpg",
    "/new-banner-8.jpg",
    "/new-banner-5.jpg",
    "/new-banner-6.jpg",
    "/new-banner-7.jpg"
  ];

  // Hardcoded heading and description as fallback
  const heading = data?.heading || "Your Perfect Event Starts Here. Plan. Connect. Celebrate.";
  const description = data?.description || "Your one-stop marketplace to find venues, services, and everything in between for weddings, parties, and corporate events.";

  // Logic to determine final images
  let images = [];

  // 1. Check if we have incoming images from props (banners)
  const incomingImages = Array.isArray(data?.images) ? data.images : [];

  // 2. Normalize incoming images to object structure { src, link, videoUrl, mediaType }
  const normalizedIncoming = incomingImages.map(img => {
    if (typeof img === 'string') return { src: img, link: null, videoUrl: null, mediaType: 'image' };
    return {
      src: img.src,
      link: img.link,
      videoUrl: img.videoUrl || null,
      mediaType: img.mediaType || 'image'
    };
  });

  // 3. Apply logic based on count
  if (normalizedIncoming.length === 0) {
    // No banners -> Use all defaults
    images = defaultImages.map(src => ({ src, link: null, videoUrl: null, mediaType: 'image' }));
  } else if (data?.shouldMergeDefaults) {
    // Less than 6 banners -> Fill with defaults to reach 6
    const needed = Math.max(0, 6 - normalizedIncoming.length);
    const defaultsToAdd = defaultImages.slice(0, needed).map(src => ({ src, link: null, videoUrl: null, mediaType: 'image' }));
    images = [...normalizedIncoming, ...defaultsToAdd];
  } else {
    // 6 or more banners -> Use ONLY banners
    images = normalizedIncoming;
  }

  const MediaContent = ({ item, idx }) => {
    const content = item.mediaType === 'video' && item.videoUrl ? (
      <video
        src={`${item.videoUrl}#t=0.01`}
        poster={item.src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover rounded-2xl shadow-lg"
      />
    ) : (
      <img
        src={item.src}
        alt={`slide-${idx}`}
        className="h-full w-full object-cover rounded-2xl shadow-lg"
      />
    );

    return item.link ? (
      <Link href={item.link} className="block w-full h-full">
        {content}
      </Link>
    ) : (
      content
    );
  };

  return (
    <div className='h-auto md:h-[600px] lg:h-[680px] py-8 md:py-0 flex-center flex-col gap-4 lg:gap-8'>
      <div className='w-full flex-center flex-col text-center px-4'>
        <h1 className='text-center uppercase max-md:!text-[22px] !text-[30px] w-full leading-[1.2em]'>
          {heading.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < heading.split('\n').length - 1 && <br className="max-sm:hidden" />}
            </span>
          ))}
        </h1>
        <div
          className="prose prose-sm max-w-none max-md:mt-2 max-md:!text-xs
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2 prose-p:min-h-[1.5em]
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2 prose-ul:[list-style-position:outside]
            prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2 prose-ol:[list-style-position:outside]
            prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <div className="w-full max-w-[1600px] relative">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute top-0 left-0 h-[calc(100%-60px)] w-28 md:w-52 bg-gradient-to-r from-white/85 to-transparent z-10"></div>
        <div className="pointer-events-none absolute top-0 right-0 h-[calc(100%-60px)] w-28 md:w-52 bg-gradient-to-l from-white/85 to-transparent z-10"></div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
          effect={'coverflow'}
          grabCursor={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 280,
            depth: 100,
            modifier: 2.5,
          }}
          breakpoints={{
            320: {
              coverflowEffect: {
                rotate: 0,
                stretch: 100,
                depth: 80,
                modifier: 1.8,
              },
              slidesPerView: "auto",
            },
            768: {
              coverflowEffect: {
                rotate: 0,
                stretch: 100,
                depth: 75,
                modifier: 1.5,
              },
              slidesPerView: "auto",
            },
            1024: {
              coverflowEffect: {
                rotate: 0,
                stretch: 170,
                depth: 100,
                modifier: 2.5,
              },
              slidesPerView: "auto",
            },
            1119: {
              coverflowEffect: {
                rotate: 0,
                stretch: 200,
                depth: 100,
                modifier: 2.2,
              },
              slidesPerView: "auto",
            },
            1280: {
              coverflowEffect: {
                rotate: 0,
                stretch: 280,
                depth: 100,
                modifier: 2.5,
              },
              slidesPerView: "auto",
            },
          }}
          navigation={{
            prevEl: ".hero_slider-prev",
            nextEl: ".hero_slider-next",
          }}
          pagination={{
            el: ".hero_slider-pagination",
            clickable: true,
          }}
          className="hero-swiper relative"
        >
          {images.map((item, idx) => (
            <SwiperSlide key={idx} className="!w-64 sm:!w-[400px] lg:!w-3xl xl:!w-5xl !h-64 sm:!h-64 md:!h-80 lg:!h-[420px] !relative">
              <MediaContent item={item} idx={idx} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="w-full flex-center gap-2 md:gap-4 mt-4">
          <Button className="hero_slider-prev bg-white h-8 w-8 md:h-10 md:w-10 text-2xl rounded-full p-0 hover:bg-gray-100 transition border border-secondary">
            <ChevronLeft className="text-secondary" />
          </Button>
          {/* pagination dots */}
          <div className="hero_slider-pagination !w-fit hidden md:flex gap-2" style={{ transform: "translateX(0%) !important" }}></div>
          <Button className="hero_slider-next bg-white h-8 w-8 md:h-10 md:w-10 text-2xl rounded-full p-0 hover:bg-gray-100 transition border border-secondary">
            <ChevronRight className="text-secondary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;