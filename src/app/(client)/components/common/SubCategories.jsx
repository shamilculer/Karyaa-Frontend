import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { popularSubCategories } from "@/utils";
import { Carousel } from "@/components/ui/carousel";


const SubCategories = () => {
  return (
    <>
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-14">

        {popularSubCategories.map((item, index) => (
          <SubCategoryCard item={item} key={index} />
        ))}
      </div>

      <div className="w-full block md:hidden">
        <SubCategoryCarousel />
      </div>
    </>
  )
}

export default SubCategories


export const SubCategoryCarousel = () => {
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

      {popularSubCategories.map((item, index) => (
        <SubCategoryCard item={item} key={index} />
      ))}

    </Carousel>
  );
};

export const SubCategoryCard = ({ item }) => (
  <Link
    href={`/categories/${item.parent}/${item.slug}`}
    className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
  >
    {/* Image */}
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-72 object-cover rounded-xl"
    />

    {/* Tag */}
    {item.tag && (
      <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-medium text-sm flex items-center gap-1">
        {item.tag}
      </Badge>
    )}

    {/* Title overlay */}
    <div className="absolute bottom-5 left-5 w-full z-10">
      <h4 className="!text-white text-lg !font-medium">
        {item.title}
      </h4>
    </div>

    {/* Hover effect */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent rounded-xl"></div>
  </Link>
)