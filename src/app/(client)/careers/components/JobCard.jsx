import Link from 'next/link';
import React from 'react';

const JobCard = ({ job }) => {
    // Screenshot shows MM/DD/YYYY format
    const date = job.dateOpened ? new Date(job.dateOpened).toLocaleDateString() : '';

    // Fallback if they use the new atomic fields instead of the old 'location' string
    const displayLocation = [job.city, job.stateProvince, job.country].filter(Boolean).join(', ') || job.location;

    // Ensure we always route to the dedicated page now, falling back to a slugified title if 'slug' is missing on old jobs
    const slug = job.slug || job.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Determine the destination: always go to the job page if we can generate a slug. We'll only fallback to mailto if even title is missing.
    const destination = slug
        ? `/careers/jobs/${slug}`
        : (job.applyLink || `mailto:careers@karyaa.com?subject=Application for ${encodeURIComponent(job.title)}`);

    return (
        <Link
            href={destination}
            target={job.slug ? undefined : (job.applyLink ? "_blank" : undefined)}
            className="block py-6 border-b border-gray-300 last:border-0 hover:bg-gray-100 transition-colors -mx-4 px-4 sm:mx-0 sm:px-4 bg-gray-50 group"
        >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1 flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>

                    <div className="text-gray-500 text-sm">
                        {displayLocation}
                    </div>

                    {job.experience && <div className="text-gray-500 text-sm">{job.experience}</div>}

                    {job.body && (
                        <div className="prose prose-sm max-w-none text-gray-500 line-clamp-2 mt-4">
                            <div dangerouslySetInnerHTML={{ __html: job.body }} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:items-end gap-1 shrink-0 sm:min-w-[120px]">
                    <span className="text-gray-600 font-medium text-sm">
                        {job.typeOfWork || 'Full time'}
                    </span>
                    {date && (
                        <span className="text-gray-400 text-sm">
                            {date}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
