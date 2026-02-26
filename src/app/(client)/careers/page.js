export const dynamic = 'force-dynamic';

import { getContentByKeyAction } from "@/app/actions/public/content"
import { getActiveJobsAction } from "@/app/actions/public/jobs"
import PageTitle from "../components/common/PageTitle";
import { getMetaData } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import CareersClient from "./components/CareersClient";

export async function generateMetadata() {
    return await getMetaData("static", "careers");
}

const CareersPage = async () => {
    // Fetch careers page content
    const contentResult = await getContentByKeyAction("careers-page")

    // Default content
    let pageContent = {
        bannerHeading: "Careers",
        bannerTagline: "Join a dynamic environment where your ideas matter.",
        bannerType: "image", // image | video
        bannerImage: "/banner-1.avif",
        bannerVideo: "",
        isActive: true, // Master toggle

        contentBlocks: [] // Array of modular blocks and job postings
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
            console.error("Error parsing careers page content:", error);
        }
    }

    if (pageContent.isActive === false) {
        notFound();
    }

    // Fetch active jobs from new API
    let activeJobs = [];
    const jobsResult = await getActiveJobsAction();
    if (jobsResult?.success && jobsResult?.data) {
        activeJobs = jobsResult.data;
    }

    return (
        <div className="min-h-screen">
            <PageTitle
                placement="Careers"
                title={pageContent.bannerHeading}
                tagline={pageContent.bannerTagline}
                imgUrl={pageContent.bannerImage || "/career.webp"}
                videoUrl={pageContent.bannerVideo}
                mediaType={pageContent.bannerType}
            />

            <section className="container !my-0 py-16 md:py-24 space-y-24">

                {/* Job Postings Section */}
                {activeJobs.length > 0 && (
                    <div className="pt-8 border-t border-gray-100 mb-16">
                        <CareersClient jobs={activeJobs} />
                    </div>
                )}
                
                {activeJobs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No open positions or information available at the moment. Please check back later!</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default CareersPage
