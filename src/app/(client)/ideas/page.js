import { Badge } from "@/components/ui/badge"
import CategoriesList from "../components/common/CategoriesList"
// REMOVED: Unused individual Pagination components.
import { Button } from "@/components/ui/button"
import { Share2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { GlobalPagination } from "@/components/common/GlobalPagination"
import { getPublishedIdeasPosts } from "../../actions/ideas"
import CategoryFetcher from "../components/common/CategoryFetcher"

// REMOVED: import { ideasData } from "@/utils" 

// -------------------------------------------
// --- Idea Card Skeleton Component ---
// Used for displaying a loading state
// -------------------------------------------
const IdeaCardSkeleton = () => (
    <div className="rounded overflow-hidden animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
        <div className="mt-4 px-2 space-y-4">
            {/* Title Placeholder */}
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            {/* Description Placeholder */}
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
            {/* Button Placeholder */}
            <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
        </div>
    </div>
);


// -------------------------------------------
// --- IdeasPage Component (Async Server Component) ---
// -------------------------------------------
const IdeasPage = async ({ searchParams }) => {
    // 1. Determine current page and limit from URL search params
    const page = parseInt(searchParams.page) || 1;
    const limit = 12; // Set desired posts per page

    let ideasResponse = {
        success: false,
        Ideas: [], // Ensure key matches the controller response
        total: 0,
        totalPages: 0,
        currentPage: page,
    };

    try {
        // 2. Fetch data using the server action
        const response = await getPublishedIdeasPosts({ limit, page });
        // The server action returns the API response object directly
        ideasResponse = {
            ...response,
            Ideas: response.Ideas || [],
        };

    } catch (e) {
        console.error("Error fetching ideas:", e);
        // ideasResponse remains the initialized fallback object
    }

    const { Ideas, totalPages, currentPage, success } = ideasResponse;

    // 3. Prepare content to render (Ideas or Skeletons)
    const content = success && Ideas.length > 0 ? (
        Ideas.map((idea) => (
            // Ensure the IdeaCard key is based on a unique database field (e.g., _id or slug)
            <IdeaCard key={idea.slug || idea._id} idea={idea} /> 
        ))
    ) : (
        // Render skeletons if fetching failed or while waiting for content
        Array.from({ length: limit }).map((_, i) => (
            <IdeaCardSkeleton key={i} />
        ))
    );

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
                    <CategoryFetcher />
                </div>
            </section>

            <section className="container">
                <div className="relative">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="uppercase">Featured Ideas</h2>
                    </div>

                    {/* Ideas Grid: Render dynamic content or skeletons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {content}
                    </div>

                    {/* 4. Use Global Pagination component */}
                    {totalPages > 1 && (
                        <GlobalPagination 
                            totalPages={totalPages} 
                            currentPage={currentPage} 
                            pageQueryKey="page"
                            className="mt-14"
                        />
                    )}
                </div>
            </section>
        </div>
    )
}


// -------------------------------------------
// --- IdeaCard Component (Minor Adjustment) ---
// -------------------------------------------
const IdeaCard = ({ idea }) => {
    // ADJUSTMENT: Use coverImage from the database schema, with a fallback
    const imgSrc = idea.coverImage || idea.img || '/placeholder-image.jpg';

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
                    src={imgSrc}
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
                <p className="line-clamp-3 text-sm text-gray-600">{idea.metaDescription || idea.description || ""}</p>

                <Button asChild>
                    <Link href={`/ideas/${idea.slug}`}>Read More</Link>
                </Button>
            </div>
        </div>
    )
}


export default IdeasPage