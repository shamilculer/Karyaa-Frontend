"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const defaultTestimonials = [
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

const Testimonials = ({ testimonials: propTestimonials, heading = "What people say about us" } = {}) => {
  const testimonials = Array.isArray(propTestimonials) && propTestimonials.length > 0 ? propTestimonials : defaultTestimonials;

  return (
    <div className="w-full flex-center flex-col space-y-10">
      <div className="w-full flex-center flex-col">
        <h6 className="uppercase max-md:text-sm !font-medium">
          TESTIMONIALS
        </h6>
        <h2 className="uppercase text-center">
          {heading.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < heading.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h2>
      </div>
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
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
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 1, spaceBetween: 24 },
            1124: { slidesPerView: 2, spaceBetween: 32 },
          }}
          className="w-full pb-8 !px-1"
        >
          {testimonials.map((t, idx) => {
            const imageSrc = t.img || t.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400";

            return (
              <SwiperSlide key={t.id || idx} className="h-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch md:h-[290px] bg-body rounded-xl border border-gray-300 overflow-hidden">
                  {imageSrc && (
                    <div className="relative shrink-0 w-24 h-24 mt-6 sm:mt-0 sm:w-48 sm:h-auto rounded-full sm:rounded-none overflow-hidden border-2 border-gray-100 sm:border-0">
                      <Image
                        fill
                        className="object-cover"
                        src={imageSrc}
                        alt={t.name || "Testimonial"}
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-grow p-6 h-full text-center sm:text-left">
                    <div className="flex-grow">
                      <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 leading-relaxed !text-[15px] line-clamp-6 mb-4">
                        {t.text}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <p className="text-gray-900">{t.name}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons - BELOW Swiper */}
        <div className="flex gap-4 mt-6">
          <Button className="testimonials-prev bg-white h-12 w-12 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all p-0 flex items-center justify-center">
            <ChevronLeft size={24} />
          </Button>
          <Button className="testimonials-next bg-white h-12 w-12 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all p-0 flex items-center justify-center">
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
