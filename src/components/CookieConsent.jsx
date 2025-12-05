"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consentGiven = localStorage.getItem("cookieConsent");
        if (!consentGiven) {
            // Delay showing the popup slightly for better UX
            setTimeout(() => {
                setShowConsent(true);
                setTimeout(() => setIsVisible(true), 100);
            }, 1000);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "accepted");
        closeConsent();
    };

    const declineCookies = () => {
        localStorage.setItem("cookieConsent", "declined");
        closeConsent();
    };

    const closeConsent = () => {
        setIsVisible(false);
        setTimeout(() => setShowConsent(false), 300);
    };

    if (!showConsent) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-300 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="bg-white border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Decorative top border */}
                    <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

                    <div className="relative p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                                    <Cookie className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-0">
                                <h3 className="!text-xl md:text-2xl font-bold font-heading text-[var(--color-heading)]">
                                    We Value Your Privacy
                                </h3>
                                <p className="text-[var(--color-text)] !text-sm md:text-base leading-relaxed">
                                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                                    By clicking "Accept All", you consent to our use of cookies.
                                    <Link
                                        href="/cookies-policy"
                                        className="text-primary hover:text-secondary underline underline-offset-2 transition-colors font-medium"
                                    >
                                        Learn more
                                    </Link>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <Button
                                    onClick={declineCookies}
                                    variant="outline"
                                    className="border-2 border-primary/30 bg-white text-[var(--color-text)] hover:bg-gray-50 hover:border-primary/50 transition-all duration-200"
                                >
                                    Decline
                                </Button>
                                <Button
                                    onClick={acceptCookies}
                                    className="bg-primary hover:bg-secondary text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Accept All
                                </Button>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={closeConsent}
                                className="absolute top-4 right-4 md:relative md:top-0 md:right-0 text-gray-400 hover:text-[var(--color-heading)] transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
