import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { getPublishedBlogPosts } from "../../../actions/blog";
import { Skeleton } from "@/components/ui/skeleton";

// --- Async Server Component (suspends while fetching) ---
async function BlogPostsContent({ searchParams, showPagination = true }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = parseInt(searchParams.limit) || 15;

  const postResponse = await getPublishedBlogPosts({ limit, page });
  const { blogs, totalPages, currentPage, success } = postResponse;

  // Handle fetch error
  if (!success) {
    return (
      <div className="text-center p-8 text-lg text-red-500">
        Error loading posts. Please refresh the page.
      </div>
    );
  }

  const hasBlogs = blogs?.length > 0;

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
        {hasBlogs
          ? blogs.map((blog) => (
              <BlogCard key={blog.slug || blog._id} blog={blog} />
            ))
          : Array.from({ length: limit }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
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

// --- Main Exported Component with Suspense Boundary ---
export default function BlogPosts(props) {
  return (
    <Suspense fallback={<BlogPostsFallback />}>
      <BlogPostsContent {...props} />
    </Suspense>
  );
}

// --- Suspense Fallback Skeleton ---
function BlogPostsFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
      {Array.from({ length: 9 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

// --- Blog Card Component ---
export const BlogCard = ({ blog }) => {
  const authorName =
    typeof blog.author === "object" && blog.author !== null
      ? blog.author.username
      : blog.author;

  const displayDate = new Date(
    blog.publishedAt || blog.date
  ).toLocaleDateString("en-US");

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
          <span>By {authorName}</span> | <span>{displayDate}</span>
        </div>
        <h3 className="!text-2xl max-md:!text-xl !font-medium">
          {blog.title}
        </h3>
        <p className="text-gray-600 mt-2 line-clamp-2">
          {blog.metaDescription ||
            "Read the full blog post for more details."}
        </p>
      </div>
      <Button asChild>
        <Link href={`/blog/${blog.slug}`}>Read More</Link>
      </Button>
    </div>
  );
};

// --- Blog Card Skeleton Component ---
export const BlogCardSkeleton = () => (
  <div className="rounded-lg space-y-5">
    <Skeleton className="w-full h-60 md:h-72 rounded-lg" />

    <div className="space-y-4">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>

    <Skeleton className="h-10 w-24 rounded-md" />
  </div>
);
