"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function EmailShareButton({ jobTitle }) {
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const handleEmailShare = () => {
        if (!currentUrl) return;
        const subject = encodeURIComponent(`Job Opportunity: ${jobTitle}`);
        const body = encodeURIComponent(`Check out this job:\n\n${jobTitle}\n\n${currentUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <Button
            onClick={handleEmailShare}
            className="px-8 py-3.5 border border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-colors bg-transparent min-w-[200px] !text-lg"
        >
            Share job via email
        </Button>
    );
}
