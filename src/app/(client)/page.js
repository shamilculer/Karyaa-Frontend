// Landing page uses components that may call server helpers which read cookies (auth/data). Force dynamic rendering
// to prevent build-time prerender errors caused by cookie usage.
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import Hero from "./components/HeroServer";
import PageSearchBar from "./components/common/PageSearchBar/PageSearchBar";
import CategoryList from "./components/common/CategoriesList/CategoriesList";

import BlogPosts from "./components/common/BlogPosts";
import { Button } from "@/components/ui/button";
import Testimonials from "./components/TestimonialsServer";
import WhyChooseUs from "./components/WhyChooseUsServer";
import HowItWorks from "./components/HowItWorksServer";

import { initialBlogParams } from "@/utils";
import VendorsCarousel from "./components/common/VendorsCarousel";
import AdbannerWrapper from "./components/adBanner/AdBannerWrapper";

export default function LandingPage() {
  return (
    <div>
      <div>
        <section className="!m-0">
          <Hero />
        </section>

        <section className="container !mt-0 md:!mt-10">
          <PageSearchBar />
        </section>

        <CategoryList />

        <section className="container">
          <div className="relative">
            <div className="flex justify-between items-center max-lg:items-end mb-6 md:mb-8">
              <h2 className="uppercase">KARYAA Recommends</h2>
            </div>
            <VendorsCarousel filter={{ isRecommended: true }} />
          </div>
        </section>

        <WhyChooseUs />

        <HowItWorks />

        <section>
          <div className="w-full">
            <AdbannerWrapper />
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

        <section className="container space-y-10 !mb-0">
          <div className="w-full flex-center flex-col">
            <h6 className="uppercase max-md:text-sm !font-medium">
              TESTIMONIALs
            </h6>
            <h2 className="uppercase text-center">What people say about us</h2>
          </div>
          <Testimonials />
        </section>
      </div>
    </div>
  );
}
