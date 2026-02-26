import React from 'react';
import { getJobBySlugAction } from "@/app/actions/public/jobs";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ApplyNowAction from '../../components/ApplyNowAction';
import JobShareButtons from '../../components/JobShareButtons';
import EmailShareButton from '../../components/EmailShareButton';
import Image from 'next/image';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const response = await getJobBySlugAction(slug);
    if (!response?.success || !response?.data) return { title: 'Job Not Found' };

    const job = response.data;

    return {
        title: `${job.title} | Careers | FIVE`,
        description: `Apply for ${job.title} at FIVE in ${job.city || job.location}.`,
    };
}

const JobDetailsPage = async ({ params }) => {
    const { slug } = await params;

    const response = await getJobBySlugAction(slug);

    if (!response?.success || !response?.data) {
        notFound();
    }

    const job = response.data;

    // Format date if available
    const dateOpened = job.dateOpened ? new Date(job.dateOpened).toLocaleDateString() : '';

    // Derive simplified location for the banner
    const bannerLocation = [job.city, job.country].filter(Boolean).join(', ') || job.location || 'Remote';

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden py-10  md:py-16">
                {/* Background Image / Overlay (using a generic placeholder or solid color for now, can be swapped with a real image URL if available in CMS) */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/40 z-10" />
                <Image
                    src={job.image || "/career.webp"}
                    alt="Careers Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    width={1920}
                    height={1080}
                />

                <div className="container relative z-20 text-center space-y-2 flex flex-col items-center">
                    <p className="md:!text-base font-medium opacity-90">
                        {job.department || 'FIVE Hotels and Resorts'} | {job.typeOfWork || 'Full time'}
                    </p>

                    <h1 className="!text-3xl md:!text-4xl lg:!text-5xl !text-white font-bold tracking-tight">
                        {job.title}
                    </h1>

                    <p className="md:!text-sm opacity-90 flex items-center justify-center gap-2 flex-wrap">
                        {bannerLocation} | Posted on {dateOpened || new Date().toLocaleDateString()}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <ApplyNowAction job={job} className="min-w-[200px]" />
                        <EmailShareButton jobTitle={job.title} />
                    </div>

                    <div className="pt-8 space-y-3">
                        <p className="text-sm font-medium">Share this job with your network</p>
                        <JobShareButtons jobTitle={job.title} />
                    </div>
                </div>
            </div>

            <div className="container !my-0 py-8 md:py-12">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 border-b border-gray-100 py-4">
                    <Link href="/careers" className="hover:text-primary transition-colors">
                        Job listing
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className=" !text-sm text-gray-900 font-medium">Job details</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 relative items-start">

                    {/* Left Column - Job Description */}
                    <div className="flex-1 w-full space-y-8">
                        <h2 className="!text-2xl md:!text-3xl font-bold text-gray-900 mb-6">
                            Job Description
                        </h2>

                        {job.body ? (
                            <div
                                className="prose prose-lg max-w-none text-gray-600 space-y-6 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:underline [&>h3]:underline-offset-4 [&>h3]:mb-4"
                                dangerouslySetInnerHTML={{ __html: job.body }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">No detailed description provided for this role.</p>
                        )}

                        {/* Mobile 'Apply Now' Button for smaller screens (optional based on screenshot, but good practice) */}
                        <div className="pt-8 lg:hidden">
                            <ApplyNowAction job={job} className="w-full" />
                        </div>
                    </div>

                    {/* Right Column - Job Information Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-8 border-t lg:border-t-0 lg:border-l border-gray-300 pt-8 lg:pt-0 lg:pl-12 space-y-5">
                        <h2 className="!text-xl font-bold text-gray-900 pb-2">
                            Job Information
                        </h2>

                        <div className="space-y-2">
                            {job.department && (
                                <div className="space-y-0">
                                    <h4 className="text-gray-900 font-medium">Department Name</h4>
                                    <p className="text-gray-600">{job.department}</p>
                                </div>
                            )}

                            {dateOpened && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Date Opened</h4>
                                    <p className="text-gray-600">{dateOpened}</p>
                                </div>
                            )}

                            {job.applicationDeadline && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Application Deadline</h4>
                                    <p className="text-gray-600">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                                </div>
                            )}

                            {job.typeOfWork && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Job Type</h4>
                                    <p className="text-gray-600">{job.typeOfWork}</p>
                                </div>
                            )}

                            {job.industry && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Industry</h4>
                                    <p className="text-gray-600">{job.industry}</p>
                                </div>
                            )}

                            {job.experience && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Work Experience</h4>
                                    <p className="text-gray-600">{job.experience}</p>
                                </div>
                            )}

                            {job.city && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">City</h4>
                                    <p className="text-gray-600">{job.city}</p>
                                </div>
                            )}

                            {job.stateProvince && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">State/Province</h4>
                                    <p className="text-gray-600">{job.stateProvince}</p>
                                </div>
                            )}

                            {job.country && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Country</h4>
                                    <p className="text-gray-600">{job.country}</p>
                                </div>
                            )}

                            {job.zipCode && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Zip/Postal Code</h4>
                                    <p className="text-gray-600">{job.zipCode}</p>
                                </div>
                            )}

                            {/* Fallback layout support, if new fields not used but old location is */}
                            {(!job.city && !job.stateProvince && !job.country && job.location) && (
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">Location</h4>
                                    <p className="text-gray-600">{job.location}</p>
                                </div>
                            )}
                        </div>

                        {/* Apply Now Button (Desktop) */}
                        <div className="pt-6 hidden lg:block border-t border-gray-100">
                            <ApplyNowAction job={job} className="w-full" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
