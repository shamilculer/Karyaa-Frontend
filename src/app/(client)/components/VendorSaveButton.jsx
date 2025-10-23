"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button"; // Assuming your button component
import { toast } from "sonner"; // Assuming Sonner is configured and available
import { toggleSavedVendor } from "@/app/actions/user/user";

/**
 * Renders a clickable heart icon to toggle a vendor's saved/wishlist status.
 * Handles optimistic UI updates and server action calls with toast notifications.
 * @param {string} vendorId - The MongoDB ID of the vendor to save/unsave.
 * @param {boolean} isInitialSaved - The initial saved status fetched from the server.
 * @param {boolean} isVendorPage - Flag to indicate if the button is on the dedicated vendor page.
 */
export default function VendorSaveButton({ vendorId, isInitialSaved, isVendorPage }) {
    
    // 1. State for the current saved status
    const [isSaved, setIsSaved] = useState(isInitialSaved);
    
    // 2. State for handling pending transitions (loading state)
    const [isPending, startTransition] = useTransition();

    const handleSaveToggle = () => {
        // Prevent multiple rapid clicks
        if (isPending) return;

        // --- Optimistic UI Update ---
        const previousSavedState = isSaved;
        // Immediately flip the saved state for a fast user experience
        setIsSaved(prev => !prev); 
        
        const actionMessage = previousSavedState 
            ? "Removing vendor..." 
            : "Saving vendor...";
        
        // Use a persistent toast for the loading state
        const loadingToastId = toast.loading(actionMessage);

        // --- Server Action Execution ---
        startTransition(async () => {
            try {
                const result = await toggleSavedVendor(vendorId);

                if (result.error || !result.success) {
                    // Revert the state if the request fails
                    setIsSaved(previousSavedState); 
                    toast.error(result.error || "Failed to update saved status.", { id: loadingToastId });
                } else {
                    // Success: Update state based on the backend's final status
                    // This handles cases where the optimistic state might be wrong
                    setIsSaved(result.saved);
                    toast.success(result.message, { id: loadingToastId });
                }
            } catch (error) {
                // Handle catastrophic failure
                setIsSaved(previousSavedState);
                toast.error("An unexpected error occurred.", { id: loadingToastId });
            }
        });
    };

    // --- Dynamic Class Name Calculation ---
    let buttonClassName = '';

    if (isVendorPage) {
        // Style for the main Vendor Page (as requested)
        buttonClassName = `
            size-10 p-3 rounded-full border border-gray-400 bg-transparent
            flex items-center justify-center text-primary transition-colors
            ${isSaved
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700'
                : 'hover:bg-red-700 hover:text-white hover:border-red-700'
            }
        `;
    } else {
        // Default Style for Card/List View
        buttonClassName = `
            w-8 h-8 p-2 bg-white text-primary rounded-full flex items-center justify-center 
            absolute top-3 right-3 z-10 transition-colors duration-200
            ${isSaved 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'hover:bg-red-700 hover:text-white hover:border-red-700'
            }
        `;
    }
    
    // Determine the icon size based on the page
    const iconSize = isVendorPage ? 20 : 18;

    return (
        <Button 
            className={buttonClassName} 
            onClick={handleSaveToggle}
            disabled={isPending}
            aria-label={isSaved ? "Unsave Vendor" : "Save Vendor"}
            // Set the button type to prevent form submission if it's placed inside a form
            type="button" 
        >
            {/* Conditional fill for the Heart icon */}
            <Heart fill={isSaved ? 'white' : 'none'} size={iconSize} />
        </Button>
    );
}