"use client";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReferralForm from "../forms/ReferralForm";
import ReferralSuccessModal from "../ui/ReferralSuccess";
import { getContentByKeyAction } from "@/app/actions/public/content";
import { useEffect } from "react";

export default function ReferModal({ children, triggerText = "Refer & Earn" }) {
    // State for the main Referral Form modal
    const [isFormOpen, setIsFormOpen] = useState(false);

    // State for the Success modal
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [code, setCode] = useState(null);

    // State for modal content
    const [content, setContent] = useState({
        backgroundImage: "",
        heading: "Refer Vendors. Earn rewards",
        description: "Invite vendors to join our platform and earn exclusive rewards when they sign up successfully!"
    });

    // Fetch content on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const result = await getContentByKeyAction("refer-modal");
                if (result.success && result.data?.content) {
                    const parsedContent = typeof result.data.content === 'string'
                        ? JSON.parse(result.data.content)
                        : result.data.content;

                    setContent({
                        backgroundImage: parsedContent.backgroundImage || "",
                        heading: parsedContent.heading || "Refer Vendors. Earn rewards",
                        description: parsedContent.description || "Invite vendors to join our platform and earn exclusive rewards when they sign up successfully!"
                    });
                }
            } catch (error) {
                console.error("Error loading refer modal content:", error);
            }
        };
        loadContent();
    }, []);

    // Callback function passed to the form
    const handleSuccess = (referralCode) => {
        // 1. Close the primary form modal
        setIsFormOpen(false);
        // 2. Store the code received from the server action
        setCode(referralCode);
        // 3. Open the success modal
        setIsSuccessOpen(true);
    };

    return (
        <>
            {/* Primary Referral Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                {/* If children are provided, render them. Otherwise, render default trigger */}
                {children || (
                    <DialogTrigger asChild>
                        <Button className="bg-white text-primary px-4 py-2 text-sm sm:text-base">
                            {triggerText}
                        </Button>
                    </DialogTrigger>
                )}

                <DialogContent
                    className="max-h-[75vh] sm:max-h-[60vh] xl:max-h-[90vh] flex p-0 md:max-w-3xl xl:!max-w-6xl max-w-[95%] rounded-xl overflow-hidden bg-[#fffef9]"
                >
                    <DialogTitle className="sr-only">Refer a Friend</DialogTitle>
                    <div
                        className="w-1/2 bg-center bg-cover min-h-72 max-md:hidden"
                        style={{
                            backgroundImage: content.backgroundImage
                                ? `url('${content.backgroundImage}')`
                                : "url('/new-banner-7.jpg')"
                        }}
                    >
                    </div>
                    <ScrollArea className="w-1/2 px-3 md:px-6  flex-1 overflow-y-auto">
                        <div className="flex flex-col py-8 gap-10 justify-center items-center">
                            <div>
                                <h2 className="max-xl:!text-2xl">{content.heading}</h2>
                                <div
                                    className="!text-sm prose max-w-none prose-p:my-1"
                                    dangerouslySetInnerHTML={{ __html: content.description }}
                                />
                            </div>
                            <div className="w-full">
                                {/* Pass the success handler to the form */}
                                <ReferralForm onSuccess={handleSuccess} />
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Success Modal (Conditionally rendered) */}
            <ReferralSuccessModal
                referralCode={code}
                isOpen={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
            />
        </>
    );
}