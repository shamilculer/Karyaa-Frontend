"use client";

import { useState, useEffect } from 'react';
import {
    IconBrandFacebook,
    IconBrandX,
    IconBrandLinkedin,
    IconBrandTelegram
} from '@tabler/icons-react';
import { Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ShareButton = ({ Icon, onClick, isCopied }) => (
    <Button
        onClick={onClick}
        variant={"outline"}
        className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white hover:text-white"
    >
        {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Icon className="w-4 h-4" />}
    </Button>
);

export default function JobShareButtons({ jobTitle }) {
    const [currentUrl, setCurrentUrl] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(`Check out this job: ${jobTitle}`);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    const handleShare = (platform) => {
        if (!currentUrl) return;
        window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setIsCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="flex items-center justify-center gap-3">
            <ShareButton
                Icon={IconBrandFacebook}
                onClick={() => handleShare('facebook')}
            />
            <ShareButton
                Icon={IconBrandX}
                onClick={() => handleShare('twitter')}
            />
            <ShareButton
                Icon={IconBrandLinkedin}
                onClick={() => handleShare('linkedin')}
            />
            <ShareButton
                Icon={IconBrandTelegram}
                onClick={() => handleShare('telegram')}
            />
            <ShareButton
                Icon={LinkIcon}
                onClick={handleCopyLink}
                isCopied={isCopied}
            />
        </div>
    );
}
