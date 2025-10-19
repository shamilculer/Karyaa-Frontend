import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { GlobalPagination } from "@/components/common/GlobalPagination";

import { getPublishedBlogPosts } from "../../../actions/blog";

const BlogPosts = async ({ searchParams, showPagination=true }) => {

    const page = parseInt(searchParams.page) || 1;
    const limit = parseInt(searchParams.limit) || 15;

    const postResponse = await getPublishedBlogPosts({ limit, page });

    const { blogs, totalPages, currentPage, success } = postResponse;

    // Handle fetch error
    if (!success) {
        return <div className="text-center p-8 text-lg text-red-500">Error loading posts. Please refresh the page.</div>;
    }

    const content = blogs.length > 0 ? (
        blogs.map(blog => (
            <BlogCard key={blog.slug || blog._id} blog={blog} />
        ))
    ) : (
        Array.from({ length: limit }).map((_, i) => (
            <BlogCardSkeleton key={i} />
        ))
    );

    return (
        <div className="w-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                {content}
            </div>


            {showPagination && (
                <GlobalPagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    pageQueryKey="page"
                />
            )}
        </div>
    );
}

// --- Blog Card Component ---
export const BlogCard = ({ blog }) => {

    const authorName = typeof blog.author === 'object' && blog.author !== null
        ? blog.author.username // Use username if populated
        : blog.author;          // Use the ID string if not populated (or other logic)

    const displayDate = new Date(blog.publishedAt || blog.date).toLocaleDateString('en-US');

    return (
        <div className="rounded-lg space-y-5">
            <Image
                width={300}
                height={288}
                src={blog.image || blog.coverImage}
                alt={blog.title}
                className="w-full h-60 md:h-72 object-cover rounded-lg"
            />
            <div className="space-y-2 lg:space-y-5">
                <div className="text-xs">
                    {/* FIX HERE: Use the string property, not the whole object */}
                    <span>By {authorName}</span> |
                    <span>{displayDate}</span>
                </div>
                <h3 className="!text-2xl max-md:!text-xl !font-medium">{blog.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{blog.metaDescription || 'Read the full blog post for more details.'}</p>
            </div>
            <Button asChild>
                <Link href={`/blog/${blog.slug}`}>Read More</Link>
            </Button>
        </div>
    )
}

// --- Blog Card Skeleton Component ---
export const BlogCardSkeleton = () => (
    <div className="rounded-lg space-y-5 animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full h-60 md:h-72 bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
            {/* Metadata Placeholder */}
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
            {/* Title Placeholder */}
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            {/* Excerpt Placeholder */}
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>
        {/* Button Placeholder */}
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
    </div>
);


export default BlogPosts