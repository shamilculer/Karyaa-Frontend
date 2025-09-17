import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/utils";
import { Carousel } from "@/components/ui/carousel";

const BlogPosts = () => {

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {blogPosts.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
    )
}

export const BlogCarousel = () => {
    return (
        <Carousel
            slidesPerView={1}
            spaceBetween={40}
            autoplay={true}
            breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
            }}
        >
            {blogPosts.map((item, i) => (
                <BlogCard key={i} blog={item} />
            ))}
        </Carousel>
    )
}

export const BlogCard = ({ blog }) => {
    return (
        <div className="rounded-lg space-y-5">
            <Image width={300} height={288} src={blog.image} alt={blog.title} className="w-full h-60 md:h-72 object-cover rounded-lg" />
            <div className="space-y-2 lg:space-y-5">
                <div className="text-xs"><span>By {blog.author}</span> | <span>{blog.date}</span></div>
                <h3 className="!text-2xl max-md:!text-xl !font-medium">{blog.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{blog.excerpt}</p>
            </div>
            <Button asChild>
                <Link href={`/blog/${blog.slug}`}>Read More</Link>
            </Button>
        </div>
    )
}

export default BlogPosts
