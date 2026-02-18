import { getBulkContentAction } from "@/app/actions/public/content";
import PageTitle from "../components/common/PageTitle";
import { getMetaData } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
    return await getMetaData("static", "Media Kit");
}

const MediaKitPage = async () => {
    // Fetch content
    const result = await getBulkContentAction(["media-kit-settings", "media-kit-items"]);

    let settings = {
        heading: "In The Press",
        tagline: "See what others are saying about Karyaa.",
        bannerImage: "", // fallback if needed
        sectionHeading: "",
        sectionDescription: "",
    };

    let items = [];

    if (result.success && Array.isArray(result.data)) {
        const settingsData = result.data.find(item => item.key === "media-kit-settings");
        const itemsData = result.data.find(item => item.key === "media-kit-items");

        if (settingsData?.content) {
            settings = { ...settings, ...settingsData.content };
        }

        if (itemsData?.content && Array.isArray(itemsData.content)) {
            items = itemsData.content;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <PageTitle
                placement="Media Kit"
                title={settings.heading}
                tagline={settings.tagline}
                imgUrl={settings.bannerImage || "/banner-1.avif"} // Fallback image
                mediaType="image"
            />

            <section className="container py-16 md:py-24">
                {/* Section Heading and Description */}
                {(settings.sectionHeading || settings.sectionDescription) && (
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        {settings.sectionHeading && (
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {settings.sectionHeading}
                            </h2>
                        )}
                        {settings.sectionDescription && (
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {settings.sectionDescription}
                            </p>
                        )}
                    </div>
                )}

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group bg-white overflow-hidden border border-gray-200 flex flex-col h-full rounded-md"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                    {item.image ? (
                                        <div className="relative w-full h-full p-8 flex items-center justify-center">
                                            <Image
                                                src={item.image}
                                                alt={item.publication || "Press Coverage"}
                                                fill
                                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-gray-400 font-medium text-lg">
                                                {item.publication || "Media Feature"}
                                            </div>
                                        </div>
                                    )}
                                    {/* Overlay gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="!text-2xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.publication}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed line-clamp-6 !text-sm mb-6">
                                            {item.snippet}
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <Link
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto"
                                    >
                                        <Button
                                            variant="default"
                                            className="w-full group/btn"
                                        >
                                            Know More
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 max-w-2xl mx-auto">
                        <div className="bg-white p-12 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Press Coverage Yet</h3>
                            <p className="text-gray-500">
                                We're just getting started! Check back soon to see feature stories and reviews about Karyaa.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MediaKitPage;
