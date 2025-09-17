import { Badge } from "@/components/ui/badge"
import CategoriesList from "../components/common/CategoriesList"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Share2, BadgeCheck, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { ideasData } from "@/utils"


const IdeasPage = () => {
  return (
    <div className="min-h-screen">
      <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Ideas</h1>
          <p className="mt-2 max-md:text-xs">Ideas, Inspiration & Expert Tips for Every Event</p>
        </div>
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
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="uppercase">Featured Ideas</h2>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {ideasData.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
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
    </div>
  )
}

const IdeaCard = ({ idea }) => {
  return (
    <div className="rounded overflow-hidden">
      <div className="relative group">
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-medium flex items-center gap-1">
          {idea.category}
        </Badge>


        {/* Wishlist Button */}
        <Button className="w-8 h-8 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary absolute top-3 right-3 z-10">
          <Heart />
        </Button>

        <Image
          height={240}
          width={400}
          src={idea.img}
          alt={idea.title}
          className="w-full h-60 object-cover rounded-xl"
        />
      </div>

      <div className="mt-4 px-2 space-y-4">
        {/* Title and Share Button */}
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center">
            <div>
              <h3 className="!text-xl max-md:!text-lg text-[#232536] !font-medium">{idea.title}</h3>
            </div>
          </div>
          <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>

        {/* Description */}
        <p className="line-clamp-3 text-sm text-gray-600">{idea.description}</p>

        <Button asChild>
          <Link href={`/ideas/${idea.slug}`}>Read More</Link>
        </Button>
      </div>
    </div>
  )
}

export default IdeasPage