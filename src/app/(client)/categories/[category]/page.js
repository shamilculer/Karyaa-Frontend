import { ArrowUpDown, Earth, ListFilter } from "lucide-react";
import { SubCategoryCarousel } from "../../components/common/SubCategories";
import { VendorsCard } from "../../components/common/VendorsList";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import PageSearchBar from "../../components/common/PageSearchBar";
import Image from "next/image";
import { vendors } from "@/utils";


const CategoryPage = ({ params }) => {
    const { category } = params;

    return (
        <div>
            <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
                <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
                <div className="relative z-10 text-white text-center">
                    <h1 className="!text-white !text-4xl lg:!text-7xl">{category}</h1>
                    {/* <p className="mt-2 max-md:text-xs">Explore our diverse range of categories</p> */}
                </div>
            </section>

            <section className="container">
                <div className="relative space-y-8">
                    <div className="flex items-center">
                        <h2 className="max-md:!text-[26px] font-semibold uppercase">Popular Sub-Categories In {category}</h2>
                    </div>
                    <div>
                        <SubCategoryCarousel />
                    </div>
                </div>
            </section>

            <section className="container">
                <PageSearchBar />
            </section>

            <section className="container">
                <div className="relative">
                    <div className="flex max-md:flex-col md:justify-between items-center gap-5 mb-8">
                        <h2 className=" font-semibold uppercase">Featured Partners In {category}</h2>
                        <div className="flex-center gap-4">
                            <Button className="bg-[#F2F4FF] border border-gray-300 text-primary hover:bg-gray-300 !px-6 ">
                                <Earth />Map View
                            </Button>

                            <Button className="bg-[#F2F4FF] border border-gray-300 text-primary hover:bg-gray-300 !px-6 ">
                                <ListFilter /> Filter
                            </Button>

                            <Select>
                                <SelectTrigger
                                    id="sort"
                                    className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold "
                                >
                                    <ArrowUpDown />
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="rating-high">Highest Rated</SelectItem>
                                    <SelectItem value="rating-low">Lowest Rated</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {vendors.map((vendor, index) => (
                            <VendorsCard key={index} vendor={vendor} />
                        ))}
                    </div>

                    <Pagination className="mt-14">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" className="text-base" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base" isActive>1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base">
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base">4</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base">5</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="text-base">6</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" className="text-base" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

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

export default CategoryPage;