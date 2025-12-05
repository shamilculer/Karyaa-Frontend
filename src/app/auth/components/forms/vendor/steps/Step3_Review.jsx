"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVendorFormStore } from "@/store/vendorFormStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { registerVendor } from "@/app/actions/vendor/auth";

export default function Step03_Review({ isLastStep }) {
    const router = useRouter(); // NEW: Initialize router
    // Added resetForm from store to clear state after successful submission
    const { formData, resetForm, prevStep } = useVendorFormStore();
    const [isConsentChecked, setIsConsentChecked] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {

        // Check if consent checkbox is checked
        if (!isConsentChecked) {
            setShowError(true);
            return;
        }

        // Clear client error and proceed
        setShowError(false);
        setIsSubmitting(true); // Start loading

        const response = await registerVendor(formData);

        if (response && response.success) {
            // SUCCESS SCENARIO
            toast.success("Registration Successful!", {
                position: "top-center",
                description: "Redirecting to success page...",
                duration: 3000,
            });

            // Reset form data
            resetForm();

            // Redirect to success page with vendor ID
            const vendorId = response.data?.vendor?.referenceId || response.data?.vendor?._id;
            router.push(`/auth/vendor/register/success?vendorId=${vendorId}`);

        } else if (response && !response.success) {
            // FAILURE SCENARIO
            // 1. Show Error Toast
            toast.error("Registration Failed", {
                position: "top-center",
                description: response.error,
                duration: 5000,
            });

            // 2. Stop loading
            setIsSubmitting(false);
        }
    };

    const handleCheckboxChange = (e) => {
        setIsConsentChecked(e.target.checked);
        // Clear error when user checks the box
        if (e.target.checked) {
            setShowError(false);
        }
    };

    const handleBack = () => {
        prevStep();
    };

    const { password, ...displayData } = formData;

    const fieldsToDisplay = [
        { label: "Owner Name", value: displayData.ownerName },
        { label: "Business Name", value: displayData.businessName },
        { label: "Email", value: displayData.email },
        { label: "Phone Number", value: displayData.phoneNumber },
        { label: "Pricing Starts From", value: `AED ${displayData.pricingStartingFrom}` },
    ];

    return (
        <div className="space-y-6">
            <h4 className="!text-2xl font-bold text-primary mb-6">Step 3: Review & Finalize</h4>

            <div className="bg-[#f0f0f0] p-6 rounded-lg space-y-3">
                <h4 className="!text-lg border-b pb-2 text-gray-800">Your Registration Summary</h4>

                {fieldsToDisplay.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-300 pb-1 text-sm">
                        <span className="font-medium text-gray-600">{item.label}:</span>
                        <span className="font-semibold text-gray-900 truncate max-w-[60%]">{item.value}</span>
                    </div>
                ))}
                <p className="pt-4 text-sm text-red-600 font-medium">
                    Please ensure all uploaded files are correct and valid.
                </p>
            </div>

            {/* Final Consent Checkbox */}
            <div className="space-y-2">
                <div className="flex items-start space-x-2 pt-4">
                    <input
                        type="checkbox"
                        id="consent"
                        className="mt-1"
                        checked={isConsentChecked}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700">
                        I confirm that all information provided is accurate and I agree to the
                        <a href="/terms-and-conditions" target="_blank" className="text-indigo-600 underline">
                            Vendor Terms and Conditions
                        </a>
                        .
                    </label>
                </div>

                {/* Client-Side Consent Error Message */}
                {showError && (
                    <p className="!text-sm text-red-600 font-medium pl-6">
                        You must agree to the Terms and Conditions to proceed.
                    </p>
                )}
            </div>

            {/* --- FINAL SUBMISSION BUTTON --- */}
            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="w-40 text-base"
                >
                    ← Back
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full md:w-60 text-base bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting} // Disable button when submitting
                >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
            </div>
        </div>
    );
}