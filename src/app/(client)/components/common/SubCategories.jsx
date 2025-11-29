import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubcategories } from "@/app/actions/public/categories";

/* --------------------- */
/*   Main Exported Component with Suspense  */
/* --------------------- */
export default function SubCategoriesWrapper({ items, searchParams = {} }) {
  return (
    <Suspense fallback={<SubCategoriesFallback count={items?.length || 8} />}>
      <SubCategories items={items} searchParams={searchParams} />
    </Suspense>
  );
}

/* --------------------- */
/*   Carousel Wrapper with Suspense */
/* --------------------- */
export const SubCategoryCarouselWrapper = ({ items, searchParams = {} }) => {
  return (
    <Suspense fallback={<SubCategoriesFallbackCarousel count={items?.length || 4} />}>
      <SubCategoryCarousel items={items} searchParams={searchParams} />
    </Suspense>
  );
};

/* --------------------- */
/*   Async Server Component  */
/* --------------------- */
async function SubCategories({ items, searchParams = {} }) {
  let subcategories = items;

  // Fetch if not provided
  if (!subcategories) {
    const response = await getSubcategories(searchParams);
    subcategories = response?.subcategories || [];
  }

  if (!subcategories.length)
    return <p className="text-center py-10">No subcategories found.</p>;

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-14">
        {subcategories.map((item, index) => (
          <SubCategoryCard item={item} key={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="w-full block md:hidden">
        <SubCategoryCarouselWrapper items={subcategories} />
      </div>
    </>
  );
}

/* --------------------- */
/*   Carousel View       */
/* --------------------- */
const SubCategoryCarousel = async ({ items, searchParams = {} }) => {
  let subcategories = items;

  // Fetch if not provided
  if (!subcategories) {
    const response = await getSubcategories(searchParams);
    subcategories = response?.subcategories || [];
  }

  if (!subcategories.length)
    return <p className="text-center py-10">No subcategories found.</p>;

  return (
    <Carousel
      spaceBetween={20}
      slidesPerView={1.2}
      breakpoints={{
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 },
      }}
      withPagination
      className="!pb-10"
      autoplay
      navigationPosition="top-right"
    >
      {subcategories.map((item, index) => (
        <SubCategoryCard item={item} key={index} />
      ))}
    </Carousel>
  );
};

/* --------------------- */
/*   Card Layout         */
/* --------------------- */
export const SubCategoryCard = ({ item }) => (
  <Link
    href={`/categories/${item.mainCategory?.slug || "unknown"}/${item.slug}`}
    className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
  >
    <Image
      src={item.coverImage || "/placeholder.webp"}
      alt={item.name}
      height={300}
      width={300}
      className="w-full h-72 object-cover rounded-xl"
    />

    {item.isNewSub && (
      <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-medium text-sm flex items-center gap-1">
        New
      </Badge>
    )}
    {item.isPopular && !item.isNewSub && (
      <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-medium text-sm flex items-center gap-1">
        Popular
      </Badge>
    )}

    <div className="absolute bottom-5 left-5 w-full z-10">
      <h4 className="!text-white text-lg !font-medium">{item.name}</h4>
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent rounded-xl"></div>
  </Link>
);

/* --------------------- */
/*   Skeleton Fallbacks  */
/* --------------------- */
function SubCategoriesFallback({ count = 8 }) {
  return (
    <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-14">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

function SubCategoriesFallbackCarousel({ count = 4 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-72 w-48 rounded-xl flex-shrink-0" />
      ))}
    </div>
  );
}
