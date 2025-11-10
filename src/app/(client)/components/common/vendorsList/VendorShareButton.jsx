"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorShareButton = ({ businessName, slug }) => {
    
    const handleShare = () => {
        // ✅ CORRECTED: Construct the URL inside the client-side event handler.
        // This code only runs after the component has been hydrated in the browser.
        const vendorUrl = `${window.location.origin}/vendors/${slug}`;
        
        if (navigator.share) {
            navigator.share({
                title: businessName,
                text: `Check out ${businessName} for your event planning needs!`,
                url: vendorUrl,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support the Web Share API
            // We still need to check for window before alerting, though alert
            // itself only exists on window, so we wrap it in a client-side check.
            if (typeof window !== 'undefined') {
                alert(`Sharing not supported in this browser. You can manually share this link: ${vendorUrl}`);
            }
        }
    };

    return (
        <Button 
            variant="ghost" 
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100" 
            onClick={handleShare}
            aria-label={`Share ${businessName}`}
        >
            <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500" />
        </Button>
    );
};

export default VendorShareButton;