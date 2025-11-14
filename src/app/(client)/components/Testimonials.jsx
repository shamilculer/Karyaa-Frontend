"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonialsData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400",
    name: "Arjun Mehta",
    text: "“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400",
    name: "James Walker",
    text: "“Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”",
  },
  {
    id: 3,
    img: "/testimonial-3.jpg",
    name: "Olivia Hayes",
    text: "“Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.”",
  },
];

const Testimonials = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".testimonials-prev",
          nextEl: ".testimonials-next",
        }}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 20, centeredSlides: true },
          1024: { slidesPerView: 2, spaceBetween: 20 },
        }}
        className="w-full pb-8"
      >
        {testimonialsData.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="flex flex-col md:flex-row items-start md:gap-4 rounded-lg border border-gray-200">
              <Image
                width={240}
                height={240}
                className="w-full md:w-60 h-72 object-cover rounded-lg"
                src={t.img}
                alt={t.name}
              />
              <div className="flex flex-col h-full justify-center p-5">
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-yellow-500" stroke="0" />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-4">{t.text}</p>
                </div>
                <p className="mt-4 font-medium">{t.name}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - BELOW Swiper */}
      <div className="flex gap-4 mt-4">
        <Button className="testimonials-prev bg-white h-10 w-10 text-2xl rounded-full border border-gray-300 hover:bg-gray-100 transition p-0">
          <ChevronLeft className="text-gray-700" />
        </Button>
        <Button className="testimonials-next bg-white h-10 w-10 text-2xl rounded-full border border-gray-300 hover:bg-gray-100 transition p-0">
          <ChevronRight className="text-gray-700" />
        </Button>
      </div>
    </div>
  );
};

export default Testimonials;
