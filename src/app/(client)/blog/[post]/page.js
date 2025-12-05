// Individual blog posts fetch content server-side and may trigger cookie reads via shared helpers; force dynamic.
export const dynamic = 'force-dynamic';

import Image from "next/image";
import BlogPosts, { BlogCarousel } from "../../components/common/BlogPosts";
import { getBlogPost } from "@/app/actions/public/blog";
import { initialBlogParams } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { post } = await params;
  const blogPost = await getBlogPost(post);

  if (!blogPost) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Use custom meta title/description if available, otherwise fall back to title
  const metaTitle = blogPost.metaTitle || blogPost.title;
  const metaDescription = blogPost.metaDescription || blogPost.title;
  const keywords = blogPost.seoKeywords || [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: blogPost.coverImage ? [blogPost.coverImage] : [],
      type: 'article',
      publishedTime: blogPost.publishedAt || blogPost.createdAt,
      authors: [blogPost.author?.username || 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: blogPost.coverImage ? [blogPost.coverImage] : [],
    },
  };
}

const BlogPostPage = async ({ params }) => {
  const { post } = await params;

  const blogPost = await getBlogPost(post);

  const ctaUrl = blogPost.ctaLink?.trim();
  const isExternal = ctaUrl?.startsWith("http");

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Blog not found</h2>
          <p className="text-gray-600">
            We couldn’t find the article you’re looking for.
          </p>
        </div>
      </div>
    );
  }

  // 🧩 Handle author name safely
  const authorName =
    typeof blogPost.author === "object" && blogPost.author !== null
      ? blogPost.author.username
      : blogPost.author;

  // 🗓️ Format publish date
  const publishedDate = new Date(blogPost.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen  px-4 sm:px-6 lg:px-8">
      {/* ---- Blog Header ---- */}
      <section className="!mt-8 mb-16 space-y-6 max-w-6xl mx-auto">
        <div>
          <span className="font-medium uppercase text-primary text-[11px] md:text-sm tracking-widest">
            Blog / {blogPost.slug.replace(/-/g, " ")}
          </span>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mt-2 capitalize">
            {blogPost.title}
          </h1>

          <p className="max-md:text-xs text-gray-600 mt-2">
            By <span className="font-medium">{authorName || "Admin"}</span> |{" "}
            Published on {publishedDate}
          </p>
        </div>

        {/* ---- Cover Image ---- */}
        {blogPost.coverImage && (
          <div>
            <Image
              src={blogPost.coverImage}
              alt={blogPost.title}
              width={1200}
              height={600}
              className="w-full h-80 md:h-[450px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* ---- Blog Content ---- */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900 
            prose-h1:!text-4xl prose-h1:font-bold prose-h1:mb-2.5
            prose-h2:!text-3xl prose-h2:font-semibold prose-h2:mt-2.5 prose-h2:mb-2.5
            prose-h3:!text-2xl prose-h3:font-semibold prose-h3:mt-2.5 prose-h3:mb-2.5
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-2.5
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-2.5 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-2.5 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 
            prose-code:rounded prose-code:text-sm prose-code:text-gray-800
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 
            prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-img:rounded-lg prose-img:shadow-md
            prose-hr:my-7"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        ></div>

        <div className="mt-10">
          {ctaUrl ? (
            isExternal ? (
              <Button asChild>
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                  {blogPost.ctaText} <CircleArrowRight />
                </a>
              </Button>
            ) : (
              <Button asChild>
                <Link href={ctaUrl}>
                  {blogPost.ctaText} <CircleArrowRight />
                </Link>
              </Button>
            )
          ) : null}
        </div>
      </section>

      {/* ---- Related Articles ---- */}
      <section className="container">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-semibold uppercase">More Articles</h2>
        </div>
        <BlogPosts
          searchParams={initialBlogParams}
          showPagination={false}
          exclude={blogPost._id}
        />
      </section>
    </div>
  );
};

export default BlogPostPage;
