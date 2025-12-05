// Category pages fetch server-side data (category details) and may access cookies via shared helpers.


import { SubCategoryCarouselWrapper } from "../../components/common/SubCategories";
import PageSearchBar from "../../components/common/PageSearchBar/PageSearchBar";
import Image from "next/image";
import { getCategoryDetails } from "@/app/actions/public/categories";
import VendorsListWrapper from "../../components/common/vendorsList/VendorListWrapper";
import PageTitle from "../../components/common/PageTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlogPosts from "../../components/common/BlogPosts";
import { initialBlogParams } from "@/utils";
import { getMetaData } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { category } = await params;
  return await getMetaData("category", category);
}

const CategoryPage = async ({ params, searchParams }) => {
  const { category } = await params;
  const filters = await searchParams || {};

  const categoryData = await getCategoryDetails(category);
  return (
    <div>

      <PageTitle
        placement={`Category: ${categoryData?.name}`}
        imgUrl={categoryData?.coverImage}
        title={categoryData?.name}
      />

      <section className="container">
        <PageSearchBar />
      </section>

      <section className="container !mb-0">
        <div className="relative space-y-8">
          <div className="flex items-center">
            <h2 className="max-md:!text-[26px] font-semibold uppercase">
              Sub-Categories
            </h2>
          </div>
          <div>
            <SubCategoryCarouselWrapper
              items={categoryData.subCategories}
            />
          </div>
        </div>
      </section>

      <section className="container !mt-5">
        <div className="relative">
          <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
            <h2 className=" font-semibold uppercase">
              KARYAA Recommends
            </h2>
          </div>

          <VendorsListWrapper showControls={false} filters={{ mainCategory: category, isRecommended: true, ...filters }} />

        </div>
      </section>

      <section className="container divide-y divide-gray-300">
        <div className="w-full flex-between !items-end pb-5">
          <div>
            <h6 className="uppercase max-lg:!text-sm !font-medium">Blog</h6>
            <h2 className="uppercase">What to read next</h2>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-gray-700 font-medium text-base hover:underline max-md:hidden"
          >
            <Link href="/blog">View All</Link>
          </Button>
        </div>

        <div className="pt-5">
          <BlogPosts
            searchParams={initialBlogParams}
            showPagination={false}
          />
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
