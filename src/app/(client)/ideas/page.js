import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { GlobalPagination } from "@/components/common/GlobalPagination";
import { getPublishedIdeasPosts } from "../../actions/ideas";
import CategoryList from "../components/common/CategoriesList/CategoriesList";

// -------------------------------------------
// Skeleton for Idea Cards using ShadCN Skeleton
// -------------------------------------------
const IdeaCardSkeleton = () => (
  <div className="rounded overflow-hidden space-y-4 animate-pulse">
    <Skeleton className="w-full h-60 rounded-xl" />
    <div className="px-2 space-y-2">
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-5/6 rounded" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  </div>
);

// -------------------------------------------
// Server Component: Fetch and render ideas
// -------------------------------------------
async function IdeasList({ page = 1, limit = 12 }) {
  let ideasResponse = { success: false, Ideas: [], total: 0, totalPages: 0, currentPage: page };

  try {
    const response = await getPublishedIdeasPosts({ limit, page });
    ideasResponse = { ...response, Ideas: response.Ideas || [] };
  } catch (e) {
    console.error("Error fetching ideas:", e);
  }

  const { Ideas, success } = ideasResponse;

  if (!success || Ideas.length === 0) {
    return Array.from({ length: limit }).map((_, i) => <IdeaCardSkeleton key={i} />);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
        {Ideas.map((idea) => <IdeaCard key={idea.slug || idea._id} idea={idea} />)}
    </div>
  ) 
}

// -------------------------------------------
// Main IdeasPage
// -------------------------------------------
const IdeasPage = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="!m-0 bg-[url('/new-banner-10.jpg')] bg-cover bg-center h-72 md:h-96 flex items-center justify-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Ideas</h1>
          <p className="mt-2 max-md:text-xs">
            Ideas, Inspiration & Expert Tips for Every Event
          </p>
        </div>
      </section>

      {/* Ideas Grid */}
      <section className="container">
        <div className="relative">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="uppercase">Featured Ideas</h2>
          </div>

          <Suspense fallback={<IdeasSkeletonGrid count={12} />}>
            {/* @ts-expect-error Async Server Component */}
            <IdeasList page={page} />
          </Suspense>

          {/* Pagination */}
          <GlobalPagination totalPages={1} currentPage={page} pageQueryKey="page" className="mt-14" />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mt-14">
        <div className="relative">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="uppercase">Popular Categories</h2>
          </div>
          <Suspense fallback={<Skeleton className="h-12 w-full rounded" />}>
            {/* @ts-expect-error Async Server Component */}
            <CategoryList />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

// -------------------------------------------
// ShadCN Skeleton for Ideas Grid
// -------------------------------------------
const IdeasSkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
    {Array.from({ length: count }).map((_, i) => (
      <IdeaCardSkeleton key={i} />
    ))}
  </div>
);

// -------------------------------------------
// IdeaCard Component
// -------------------------------------------
const IdeaCard = ({ idea }) => {
  const imgSrc = idea.coverImage || idea.img || "/placeholder-image.jpg";

  return (
    <div className="rounded overflow-hidden">
      <div className="relative group">
        <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-medium flex items-center gap-1">
          {idea.category}
        </Badge>
        {/* <Button className="w-8 h-8 p-2 rounded-full bg-white hover:bg-red-700 hover:text-white flex items-center justify-center text-primary absolute top-3 right-3 z-10">
          <Heart />
        </Button> */}
        <Image
          height={240}
          width={400}
          src={imgSrc}
          alt={idea.title}
          className="w-full h-60 object-cover rounded-xl"
        />
      </div>

      <div className="mt-4 px-2 space-y-4">
        <div className="flex justify-between items-center gap-6">
          <h3 className="!text-xl max-md:!text-lg text-[#232536] !font-medium">{idea.title}</h3>
          <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>
        <p className="line-clamp-3 text-sm text-gray-600">{idea.metaDescription || idea.description || ""}</p>
        <Button asChild>
          <Link href={`/ideas/${idea.slug}`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
};

export default IdeasPage;
