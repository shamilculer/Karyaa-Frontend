"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackProfileView } from "@/app/actions/vendor/analytics";

/**
 * Profile View Tracker Component
 * Tracks vendor profile page views with session-based deduplication and source tracking
 * 
 * Usage: Add this component to vendor profile pages
 * <ProfileViewTracker vendorId={vendorId} />
 */
export default function ProfileViewTracker({ vendorId }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!vendorId) return;

        // Generate or retrieve session ID
        const getSessionId = () => {
            let sessionId = sessionStorage.getItem("karyaa_session_id");

            if (!sessionId) {
                // Generate new session ID (UUID v4)
                sessionId = crypto.randomUUID();
                sessionStorage.setItem("karyaa_session_id", sessionId);
            }

            return sessionId;
        };

        // Detect source from URL parameter or referrer
        const getSource = () => {
            // First, check URL parameter
            const urlSource = searchParams.get("source");
            if (urlSource && ["category", "search", "featured", "direct", "other"].includes(urlSource)) {
                return urlSource;
            }

            // Fallback to referrer detection
            const referrer = document.referrer;
            if (referrer.includes("/categories/")) return "category";
            if (referrer.includes("/search")) return "search";
            if (referrer.includes("/featured")) return "featured";

            return "direct";
        };

        // Get referrer
        const referrer = document.referrer || "";
        const source = getSource();

        // Track the view
        const trackView = async () => {
            try {
                const sessionId = getSessionId();
                await trackProfileView(vendorId, sessionId, referrer, source);
            } catch (error) {
                // Silently fail - don't disrupt user experience
                console.error("Failed to track profile view:", error);
            }
        };

        // Track view on component mount
        trackView();
    }, [vendorId, searchParams]);

    // This component doesn't render anything
    return null;
}
