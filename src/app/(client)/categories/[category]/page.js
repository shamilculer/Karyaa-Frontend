import { SubCategoryCarouselWrapper } from "../../components/common/SubCategories";
import PageSearchBar from "../../components/common/PageSearchBar/PageSearchBar";
import Image from "next/image";
import { getCategoryDetails } from "@/app/actions/categories";
import VendorsList from "../../components/common/VendorsList";

const CategoryPage = async ({ params, searchParams }) => {
  const { category } = await params;
  const filters = await searchParams || {};

  console.log(filters)

  const categoryData = await getCategoryDetails(category);
  return (
    <div>
      <section
        className="!m-0 bg-cover bg-center h-72 md:h-96 flex-center relative px-4"
        style={{ backgroundImage: `url(${categoryData.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-4xl lg:!text-7xl">
            {categoryData.name}
          </h1>
          {/* <p className="mt-2 max-md:text-xs">Explore our diverse range of categories</p> */}
        </div>
      </section>

      <section className="container">
        <div className="relative space-y-8">
          <div className="flex items-center">
            <h2 className="max-md:!text-[26px] font-semibold uppercase">
              Popular Sub-Categories In {categoryData.name}
            </h2>
          </div>
          <div>
            <SubCategoryCarouselWrapper
              items={categoryData.subCategories}
            />
          </div>
        </div>
      </section>

      <section className="container">
        <PageSearchBar />
      </section>

      <section className="container">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
            <h2 className=" font-semibold uppercase">
              Featured Partners In {category}
            </h2>
          </div>

            <VendorsList showControls={true} filters={{ mainCategory: category, ...filters }} />

        </div>
      </section>

      <section className="container flex-center flex-col gap-8">
        <h2 className="texxt-center">
          Plan your perfect celebration with Karyaa
        </h2>

        <div className="max-w-7xl grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-20 items-baseline">
          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-1.jpg"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Discover your vibe</h4>
              <p className="text-[#6A6A6A]">
                We’ll help you find venues, décor, and experiences that match
                your personality.
              </p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-2.webp"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Customize every detail</h4>
              <p className="text-[#6A6A6A]">
                From photographers to performers, explore a handpicked list of
                trusted vendors. Compare their portfolios, read reviews, and
                shortlist the ones that align with your vision.
              </p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image
              width={310}
              height={210}
              src="/plan-banner-3.jpg"
              alt="Plan your event with karyaa"
            />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Connect with confidence</h4>
              <p className="text-[#6A6A6A]">
                Once you're ready, reach out directly to our vendor partners.
                Ask questions, check availability, and get quotes—Karyaa makes
                it smooth, simple, and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
