"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'swiper/css/effect-coverflow';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const images = [
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
    "/banner-5.jpg",
    "/banner-6.jpg",
    "/new-banner-7.jpg"
  ];

  return (
    <div className='h-auto md:h-[680px] py-8 md:py-0 flex-center flex-col gap-4 lg:gap-8'>
      <div className='w-full text-center px-4'>
        <h1 className='text-center max-md:!text-3xl'>Your Perfect Event Starts Here. Plan. Connect. Celebrate.</h1>
        <p className="max-md:mt-2 max-md:text-xs">Your one-stop marketplace to find venues, services, and everything in between for weddings, parties, and corporate events.</p>
      </div>

      <div className="w-full max-w-[1600px] relative">
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          effect={'coverflow'}
          grabCursor={true}
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
            // Mobile devices (320px and up)
            320: {
              coverflowEffect: {
                rotate: 0,
                stretch: 100, // Reduced for mobile
                depth: 80,
                modifier: 1.8,
              },
              slidesPerView: "auto",
            },
            // Tablets (768px and up)
            768: {
              coverflowEffect: {
                rotate: 0,
                stretch: 200,
                depth: 5,
                modifier: 1.5,
              },
              slidesPerView: "auto",
            },
            1024: {
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
          {images.map((src, idx) => (
            <SwiperSlide key={idx} className="!w-64 sm:!w-80 md:!w-96 lg:!w-3xl xl:!w-5xl !h-64 sm:!h-64 md:!h-80 lg:!h-[420px] !relative">
              <img
                src={src}
                alt={`slide-${idx}`}
                className="h-full w-full object-cover rounded-2xl shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="w-full flex-center gap-4 mt-4">
          <Button className="hero_slider-prev bg-white h-10 w-10 text-2xl rounded-full p-0 hover:bg-gray-100 transition border border-gray-300">
            <ChevronLeft className="text-gray-700" />
          </Button>

          {/* pagination dots */}
          <div className="hero_slider-pagination !w-fit flex gap-2" style={{ transform: "translateX(0%) !important" }}></div>

          <Button className="hero_slider-next bg-white h-10 w-10 text-2xl rounded-full p-0 hover:bg-gray-100 transition border border-gray-300">
            <ChevronRight className="text-gray-700" />
          </Button>

          <div className="pointer-events-none absolute top-0 left-0 h-full w-28 md:w-52 bg-gradient-to-r from-white/85 to-transparent z-10"></div>
          <div className="pointer-events-none absolute top-0 right-0 h-full w-28 md:w-52 bg-gradient-to-l from-white/85 to-transparent z-10"></div>
        </div>
      </div>
    </div >
  );
};

export default Hero;
