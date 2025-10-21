import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import BlogPosts from "../components/common/BlogPosts";
import Link from "next/link";
import Image from "next/image";
import { initialBlogParams } from "@/utils";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import SubCategoriesWrapper from "../components/common/SubCategories";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen">
      <section className="!m-0 bg-[url('/new-banner-6.jpg')] bg-cover bg-center h-72 md:h-96 flex-center relative">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-4xl lg:!text-7xl">Categories</h1>
          {/* <p className="mt-2 max-md:text-xs">Explore our diverse range of categories</p> */}
        </div>
      </section>

      <section className="container !mb-14">
        <PageSearchBar />
      </section>

      <section className="container !mt-0">
        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold uppercase">Popular Categories</h2>
          </div>
          <CategoryList />
        </div>
      </section>

      <section className="container !mt-0">
        <div className="relative space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold uppercase">Popular Sub-Categories</h2>
          </div>
          <div>
            <SubCategoriesWrapper searchParams={{ isPopular: true }} />
          </div>
        </div>
      </section>


      <section className="container divide-y divide-gray-300 !mb-0">
        <div className="w-full flex-between !items-end pb-5">
          <div>
            <h6 className="uppercase !font-medium">Blog</h6>
            <h2 className="uppercase">What to read next</h2>
          </div>

          <Link href="/blog" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="pt-5">
          <BlogPosts searchParams={initialBlogParams} showPagination={false} />
        </div>
      </section>

      <section className="container flex-center flex-col gap-8">
        <h2 className="texxt-center">Plan your perfect celebration with Karyaa</h2>

        <div className="max-w-7xl grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-20 items-baseline">
          <div className="flex-center flex-col gap-6">
            <Image width={310} height={210} src="/plan-banner-1.jpg" alt="Plan your event with karyaa" />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Discover your vibe</h4>
              <p className="text-[#6A6A6A]">We’ll help you find venues, décor, and experiences that match your personality.</p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image width={310} height={210} src="/plan-banner-2.jpg" alt="Plan your event with karyaa" />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Customize every detail</h4>
              <p className="text-[#6A6A6A]">From photographers to performers, explore a handpicked list of trusted vendors. Compare their portfolios, read reviews, and shortlist the ones that align with your vision.</p>
            </div>
          </div>

          <div className="flex-center flex-col gap-6">
            <Image width={310} height={210} src="/plan-banner-3.jpg" alt="Plan your event with karyaa" />
            <div className="text-center space-y-2">
              <h4 className="text-2xl">Connect with confidence</h4>
              <p className="text-[#6A6A6A]">Once you're ready, reach out directly to our vendor partners. Ask questions, check availability, and get quotes—Karyaa makes it smooth, simple, and stress-free.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;