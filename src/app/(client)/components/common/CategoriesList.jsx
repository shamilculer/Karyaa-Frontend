"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/utils";

const CategoriesList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, categories.length]);

  return (
    <div
      className="w-full"
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile/Small Tablet Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-3">
        {categories.map((cat, idx) => (
          <MobileCategoryCard key={idx} category={cat} />
        ))}
      </div>

      {/* Desktop Accordion Layout */}
      <div className="hidden lg:flex gap-2 lg:gap-4">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={idx}
            idx={idx}
            category={cat}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setPaused={setPaused}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;

// Mobile Category Card Component
export const MobileCategoryCard = ({ category }) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="relative h-32 sm:h-40 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
    >
      <Image
        src={category.img}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
        <span className="text-white text-2xl font-medium font-script text-center px-2 leading-tight">
          {category.name}
        </span>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
    </Link>
  );
};

// Desktop Category Card Component (Your existing accordion behavior)
export const CategoryCard = ({
  category,
  idx,
  activeIndex,
  setActiveIndex,
  setPaused,
}) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      onMouseEnter={() => {
        setActiveIndex(idx);
        setPaused(true);
      }}
      className={`relative h-60 md:h-72 lg:h-80 bg-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ${
        activeIndex === idx ? "flex-[2.5]" : "flex-1"
      }`}
    >
      <Image
        src={category.img}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
        className="object-cover"
      />
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
        <span
          className={`text-white text-2xl lg:text-[42px] font-script delay-200 duration-200 transition-opacity ${
            activeIndex === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          {category.name}
        </span>
      </div>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-all duration-300 ${
          activeIndex === idx ? "opacity-60" : "opacity-30"
        }`}
      ></div>
    </Link>
  );
};