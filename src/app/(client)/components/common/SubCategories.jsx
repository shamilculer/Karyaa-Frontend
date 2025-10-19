import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "@/components/ui/carousel";
import { getSubcategories } from "../../../actions/categories";

const SubCategories = async ({ searchParams = {} }) => {
  // Fetch from backend
  const response = await getSubcategories(searchParams);
  const subcategories = response?.subcategories || [];

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
        <SubCategoryCarousel items={subcategories} />
      </div>
    </>
  );
};

export default SubCategories;

/* --------------------- */
/*     Carousel View     */
/* --------------------- */
export const SubCategoryCarousel = async ({ items, searchParams = {} }) => {
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
    >
      {subcategories.map((item, index) => (
        <SubCategoryCard item={item} key={index} />
      ))}
    </Carousel>
  );
};

/* --------------------- */
/*      Card Layout      */
/* --------------------- */
export const SubCategoryCard = ({ item }) => (
  <Link
    href={`/categories/${item.mainCategory?.slug || "unknown"}/${item.slug}`}
    className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
  >
    {/* Image */}
    <Image
      src={item.coverImage || "/placeholder.webp"}
      alt={item.name}
      height={300}
      width={300}
      className="w-full h-72 object-cover rounded-xl"
    />

    {/* Tag */}
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

    {/* Title Overlay */}
    <div className="absolute bottom-5 left-5 w-full z-10">
      <h4 className="!text-white text-lg !font-medium">{item.name}</h4>
    </div>

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent rounded-xl"></div>
  </Link>
);
