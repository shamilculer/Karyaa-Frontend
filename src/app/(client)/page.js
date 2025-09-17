import Image from "next/image"
import Link from "next/link"

import Hero from "./components/Hero"
import PageSearchBar from "./components/common/PageSearchBar"
import CategoriesList from "./components/common/CategoriesList"
import BlogPosts from "./components/common/BlogPosts"
import { Button } from "@/components/ui/button"
import Adbanner from "./components/Adbanner"
import Testimonials from "./components/Testimonials"
import { Carousel } from "@/components/ui/carousel"
import { VendorsCard } from "./components/common/VendorsList"

import { vendors } from "@/utils"

export default function LandingPage() {
  return (
    <div>
      <div>
        <section className="!m-0">
          <Hero />
        </section>

        <section className="container !mt-10">
          <PageSearchBar />
        </section>

        <section className="container">
          <div className="relative">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="uppercase">Popular Categories</h2>
            </div>
            <CategoriesList />
          </div>
        </section>

        <section className="container">
          <div className="relative">
            <div className="flex justify-between items-center max-lg:items-end mb-6 md:mb-8">
              <h2 className="uppercase">KARYAA Recommends</h2>
              <Button asChild variant="ghost" className="text-gray-700 font-medium text-base hover:underline">
                <Link href="/vendors">View All</Link>
              </Button>
            </div>
            <Carousel
              spaceBetween={60}
              slidesPerView={3}
              autoplay
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 50 },
              }}

              className="w-[93%] lg:w-full mx-auto !pb-10"
            >
              {vendors.map((vendor) => (
                <VendorsCard
                  key={vendor.slug}
                  vendor={vendor}
                />
              ))}
            </Carousel>
          </div>
        </section>

        <section className="mx-auto w-full max-lg:px-4 lg:max-w-7xl">
          <div className="w-full flex max-lg:flex-col justify-center items-center gap-8 lg:gap-16">
            <div className="w-full lg:w-[55%]">
              <Image src="/banner-2.jpg" alt="" width={500} height={500} className="w-full h-80 lg:h-[30rem] object-cover rounded-lg" />
            </div>
            <div className="w-full lg:w-[45%] flex flex-col items-start gap-4 lg:gap-5">
              <h6 className="uppercase !font-medium max-lg:!text-sm">Why choose us ?</h6>
              <h2>Why thousands trust us</h2>
              <p>
                Karyaa is a UAE-based online platform that connects users with trusted event vendors — all in one place. Whether it’s a wedding, birthday, or corporate event, you can easily find and compare planners, caterers, photographers, venues, and more.<br /><br />

                We cater to both individuals and businesses, offering a smart, streamlined way to plan any event. Karyaa helps local vendors grow while making event planning simple, fast, and stress-free.
              </p>
              <Button>Find Your Vendor</Button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-lg:px-4 lg:max-w-7xl">
          <div className="w-full flex max-lg:flex-col-reverse justify-center items-center gap-8 lg:gap-16">
            <div className="w-full lg:w-[45%] flex flex-col justify-center gap-5">
              <h6 className="uppercase max-lg:!text-sm !font-medium">How it works ?</h6>
              <h2>Plan Your Event in 3 Easy Steps</h2>
              <p>
                We cater to both individuals and businesses, offering a smart, streamlined way to plan any event. Karyaa helps local vendors grow while making event planning simple, fast, and stress-free.
              </p>
            </div>
            <div className="w-full lg:w-[55%]">
              <Image src="/why-partner-with-us.webp" alt="" width={500} height={500} className="w-full h-80 lg:h-[30rem] object-cover rounded-lg" />
            </div>
          </div>
        </section>

        <section>
          <div className="w-full">
            <Adbanner />
          </div>
        </section>

        <section className="container divide-y divide-gray-300">
          <div className="w-full flex-between !items-end pb-5">
            <div>
              <h6 className="uppercase max-lg:!text-sm !font-medium">Blog</h6>
              <h2 className="uppercase">What to read next</h2>
            </div>

              <Button asChild variant="ghost" className="text-gray-700 font-medium text-base hover:underline max-md:hidden">
                <Link href="/vendors">View All</Link>
              </Button>
          </div>

          <div className="pt-5">
            <BlogPosts />
          </div>
        </section>

        <section className="container space-y-10 !mb-0">
          <div className="w-full flex-center flex-col">
            <h6 className="uppercase max-md:text-sm !font-medium">TESTIMONIALs</h6>
            <h2 className="uppercase text-center">What people say about us</h2>
          </div>
          <Testimonials />
        </section>
      </div>
    </div>
  )
};