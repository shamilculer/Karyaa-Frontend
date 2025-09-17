import Image from "next/image";
import { blogPosts } from "@/utils";
import { BlogCarousel } from "../../components/common/BlogPosts";

const BlogPostPage = ({ params }) => {
    const { post } = params;

    const blogPost = {
        id: 1,
        image: "/why-us-img.webp",
        author: "John Doe",
        date: "Aug 23, 2021",
        title: "Top 10 Event Vendors Trending This Season",
        content: `Planning a wedding in 2025? The theme you choose sets the tone for your entire event. Whether you're aiming for elegance, quirkiness, or tradition with a twist — we’ve curated the most popular themes of the year to inspire your big day.

🎉 Theme 1: Celestial Dreamscape
Think deep blues, gold accents, and cosmic lighting. Perfect for evening weddings under the stars.

Pro Tip: Use star maps and moon phases as decor inspiration!
🌿 Theme 2: Earthy Minimalism
Muted tones, clayware, pampas grass, and natural textures dominate this elegant setup.

🎨 Theme 3: Color-Blocked Desi Fusion
Bold colors like fuchsia, teal, and saffron come alive in modern-meets-traditional decor.

🌸 Theme 4: Vintage Garden Romance
Floral-heavy setups, pastel palettes, and vintage frames for a soft, classic feel.`,
        link: "/blog/top-10-event-vendors-trending-this-season",
        slug: "top-10-event-vendors-trending-this-season",
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="!mt-8 mb-16 space-y-7">
                <div>
                    <span className="font-medium uppercase text-primary text-[11px] md:text-sm tracking-widest">Blog / {post.replace(/-/g, ' ')}</span>
                    <h1>{post.replace(/-/g, ' ')}</h1>
                    <span className="max-md:text-xs">By {blogPost.author} | Publilshed on {blogPost.date}</span>
                </div>

                <div>
                    <Image
                        src={blogPost.image}
                        alt={blogPost.title}
                        width={800}
                        height={450}
                        className="w-full h-80 md:h-[450px] object-cover rounded-lg"
                    />
                </div>

                <div>
                    <p className="text-lg text-gray-700">
                        {blogPost.content}
                    </p>
                </div>
            </section>

            <section>
                <div className="flex items-center mb-8">
                    <h2 className="text-2xl font-semibold uppercase">Related Articles</h2>
                </div>
                <div>
                    <BlogCarousel />
                </div>
            </section>
        </div>
    );
}

export default BlogPostPage;