export const dynamic = 'force-dynamic';

import { getContentByKeyAction } from "@/app/actions/public/content"
import PageTitle from "../components/common/PageTitle";
import { getMetaData } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function generateMetadata() {
    return await getMetaData("static", "story");
}

const StoryPage = async () => {
    // Fetch story page content
    const contentResult = await getContentByKeyAction("story-page")

    // Default content
    let pageContent = {
        bannerHeading: "Our Story",
        bannerTagline: "A journey of passion, innovation, and dedication.",
        bannerType: "image", // image | video
        bannerImage: "/banner-1.avif",
        bannerVideo: "",
        isActive: true, // Added default

        contentBlocks: [] // Array of modular blocks
    }

    // Parse content if it exists
    if (contentResult?.success && contentResult?.data?.content) {
        try {
            const parsedContent = typeof contentResult.data.content === 'string'
                ? JSON.parse(contentResult.data.content)
                : contentResult.data.content;

            pageContent = {
                ...pageContent,
                ...parsedContent
            }
        } catch (error) {
            console.error("Error parsing story page content:", error);
        }
    }

    if (pageContent.isActive === false) {
        notFound();
    }

    // Helper to render blocks
    let splitSectionCount = 0;

    return (
        <div className="min-h-screen">
            <PageTitle
                placement="Story"
                title={pageContent.bannerHeading}
                tagline={pageContent.bannerTagline}
                imgUrl={pageContent.bannerImage}
                videoUrl={pageContent.bannerVideo}
                mediaType={pageContent.bannerType}
            />

            <section className="container py-16 md:py-24 space-y-24">
                {pageContent.contentBlocks?.map((block, index) => {
                    switch (block.type) {
                        case "split_section":
                            const isReversed = splitSectionCount % 2 !== 0;
                            splitSectionCount++; // Increment only for split sections
                            return (
                                <div key={index} className={`flex flex-col gap-12 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                                    <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                                        {block.image ? (
                                            <img
                                                src={block.image}
                                                alt={block.title || "Section Image"}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 space-y-6 px-4">
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{block.title}</h2>
                                        <div
                                            className="prose prose-lg text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: block.description }}
                                        />
                                        {block.ctaText && block.ctaLink && (
                                            <Link
                                                href={block.ctaLink}
                                                className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all mt-4 group"
                                            >
                                                {block.ctaText}
                                                <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );

                        case "media_section":
                            return (
                                <div key={index} className="w-full relative aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
                                    {block.mediaType === 'video' && block.video ? (
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        >
                                            <source src={block.video} type="video/mp4" />
                                            {/* Fallback */}
                                            {block.image && (
                                                <img
                                                    src={block.image}
                                                    alt="Media Section"
                                                    className="object-cover w-full h-full"
                                                />
                                            )}
                                        </video>
                                    ) : (
                                        block.image && (
                                            <img
                                                src={block.image}
                                                alt="Media Section"
                                                className="object-cover w-full h-full"
                                            />
                                        )
                                    )}
                                </div>
                            );

                        case "content_section":
                            return (
                                <div key={index} className="w-full text-center space-y-8">
                                    {block.heading && (
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                            {block.heading}
                                        </h2>
                                    )}
                                    {block.body && (
                                        <div
                                            className="prose prose-lg w-full max-w-none text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: block.body }}
                                        />
                                    )}
                                    {block.ctaText && block.ctaLink && (
                                        <div className="flex justify-center mt-6">
                                            <Link
                                                href={block.ctaLink}
                                                className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
                                            >
                                                {block.ctaText}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );

                        default:
                            return null;
                    }
                })}

                {(!pageContent.contentBlocks || pageContent.contentBlocks.length === 0) && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Coming Soon</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default StoryPage
