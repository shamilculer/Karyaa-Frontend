import Image from "next/image";
import { getIdeaPost } from "../../../actions/ideas";
import DOMPurify from "isomorphic-dompurify"; // ✅ safer for both SSR and client


const IdeaPage = async ({ params }) => {
  const { idea } = await params;

  const ideaPost = await getIdeaPost(idea);

  if (!ideaPost) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Idea not found</h2>
          <p className="text-gray-600">
            We couldn’t find the idea you’re looking for.
          </p>
        </div>
      </div>
    );
  }

  // 🧩 Handle author name safely
  const authorName =
    typeof ideaPost.author === "object" && ideaPost.author !== null
      ? ideaPost.author.username
      : ideaPost.author;

  // 🗓️ Format publish date
  const publishedDate = new Date(ideaPost.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // 🧼 Sanitize HTML safely (SSR + Client)
  const sanitizedContent = DOMPurify.sanitize(ideaPost.content);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ---- Idea Header ---- */}
      <section className="!mt-8 mb-16 space-y-6">
        <div>
          <span className="font-medium uppercase text-primary text-[11px] md:text-sm tracking-widest">
            Ideas / {ideaPost.category || "Inspiration"} /{" "}
            {ideaPost.slug.replace(/-/g, " ")}
          </span>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mt-2 capitalize">
            {ideaPost.title}
          </h1>

          <p className="max-md:text-xs text-gray-600 mt-2">
            By <span className="font-medium">{authorName || "Admin"}</span> |{" "}
            Published on {publishedDate}
          </p>
        </div>

        {/* ---- Cover Image ---- */}
        {ideaPost.coverImage && (
          <div>
            <Image
              src={ideaPost.coverImage}
              alt={ideaPost.title}
              width={1200}
              height={600}
              className="w-full h-80 md:h-[450px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* ---- Idea Content ---- */}
        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </section>
    </div>
  );
};

export default IdeaPage;
