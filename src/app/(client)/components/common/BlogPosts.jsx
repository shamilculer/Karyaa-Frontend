import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { getPublishedBlogPosts } from "@/app/actions/public/blog";
import { Skeleton } from "@/components/ui/skeleton";

async function BlogPostsContent({ searchParams, showPagination = true, exclude }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 15);

  // Pass exclude slug/id to backend
  const postResponse = await getPublishedBlogPosts({ limit, page, exclude });

  const { blogs, totalPages, currentPage, success, message } = postResponse;

  // ❌ Fetch Error
  if (!success) {
    return (
      <div className="text-center p-8 text-red-500 text-lg font-medium">
        Failed to load blog posts.
        <br />
        <span className="text-sm opacity-70">{message || "Please try again later."}</span>
      </div>
    );
  }

  // ✅ Safety-net exclude (in case backend didn't filter)
  const filteredBlogs = exclude
    ? blogs.filter((b) => b._id !== exclude && b.slug !== exclude)
    : blogs;

  // Zero State
  if (success && filteredBlogs.length === 0) {
    return (
      <div className="text-center p-12 text-gray-500">
        <h3 className="text-xl font-medium mb-2">No blog posts available</h3>
        <p className="text-sm opacity-80">Check back later for new articles.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.slug || blog._id} blog={blog} />
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

export default function BlogPosts(props) {
  return (
    <Suspense fallback={<BlogPostsFallback />}>
      <BlogPostsContent {...props} />
    </Suspense>
  );
}

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
      ? blog.author.fullName
      : blog.author || "Karyaa Team";

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
