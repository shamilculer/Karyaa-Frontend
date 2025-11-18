"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CategoriesListClient = ({ isSavedPage, initialCategories }) => {
  const categories = initialCategories;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || categories?.length === 0) return; 
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories?.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused, categories?.length]);

  // If no categories, return null or a message
  if (categories?.length === 0) {
      return <p className="text-center py-8 text-gray-500">No popular categories found.</p>;
  }

  return (
    <div
      className="w-full"
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile/Small Tablet Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-3">
        {categories.map((cat) => (
          <CategoryMobileCard key={cat.slug || cat._id} category={cat} isSavedPage={isSavedPage} /> 
        ))}
      </div>

      {/* Desktop Accordion Layout */}
      <div className="hidden lg:flex gap-2 lg:gap-4">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={cat.slug || cat._id}
            idx={idx}
            category={cat}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setPaused={setPaused}
            isSavedPage={isSavedPage}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesListClient;

// Mobile Category Card Component
export const CategoryMobileCard = ({ isSavedPage, category }) => {
  const imgSrc = category.coverImage || category.img || '/placeholder-category.jpg';
  
  return (
    <Link
      href={!isSavedPage ? `/categories/${category.slug}` : `/saved-vendors?category=${category.slug}`}
      className="relative h-32 sm:h-40 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
    >
      <Image
        src={imgSrc} 
        alt={category.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
        <span className="text-white text-lg md:text-2xl font-medium font-body text-center px-2 leading-tight">
          {category.name}
        </span>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-all duration-300"></div>
    </Link>
  );
};

// Desktop Category Card Component
export const CategoryCard = ({
  category,
  idx,
  activeIndex,
  setActiveIndex,
  setPaused,
  isSavedPage
}) => {
  const imgSrc = category.coverImage || category.img || '/placeholder-category.jpg';
    
  return (
    <Link
      href={!isSavedPage ? `/categories/${category.slug}` : `/saved-vendors?category=${category.slug}`}
      onMouseEnter={() => {
        setActiveIndex(idx);
        setPaused(true);
      }}
      className={`relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ${
        activeIndex === idx ? "flex-[3.2]" : "flex-1"
      }`}
    >
      <Image
        src={imgSrc}
        alt={category.name}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
        <span
          className={`text-white text-2xl font-medium lg:text-[32px] font-heading delay-200 duration-200 transition-opacity ${
            activeIndex === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          {category.name}
        </span>
      </div>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-all duration-300 ${
          activeIndex === idx ? "opacity-55" : "opacity-25"
        }`}
      ></div>
    </Link>
  );
};


export const CategoryGridCard = ({ category }) => {
  const imgSrc = category.coverImage || category.img || '/placeholder-category.jpg';
  
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="relative h-56 md:h-[350px] bg-gray-200 rounded-xl xl:rounded-4xl overflow-hidden cursor-pointer group"
    >
      <Image
        src={imgSrc} 
        alt={category.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute left-3 xl:left-5 bottom-3 xl:bottom-6 z-10">
        <span className="text-white text-lg xl:text-xl font-medium font-heading text-center xl:px-2 leading-tight">
          {category.name}
        </span>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent rounded-xl"></div>
    </Link>
  );
};

export const CategoryGridClient = ({ initialCategories }) => {
  const categories = initialCategories;
  return (
    <div className="w-full xl:w-[90%] max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 xl:gap-6">
        {categories.map((cat) => (
          <CategoryGridCard key={cat.slug || cat._id} category={cat} /> 
        ))}
    </div>
  )
}