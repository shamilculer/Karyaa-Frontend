// components/ReferralForm.jsx

"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { postReferral } from "@/app/actions/public/referral";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { XIcon, PlusIcon } from "lucide-react"; 

// --- 1. SCHEMAS ---
const vendorSchema = z.object({
    fullname: z.string().min(1, "Full name is required."),
    email: z.string().email("Invalid email address.").min(1, "Email is required."),
    phone: z.string().optional(),
});

const referralSchema = z.object({
    // Referrer Details
    referrerFullname: z.string().min(1, "Referrer name is required."),
    referrerEmail: z.string().email("Invalid email address.").min(1, "Referrer email is required."),
    referrerPhone: z.string().min(1, "Phone number is required."), // ✅ NOW MANDATORY

    // Vendor Details (Array of vendors)
    vendors: z.array(vendorSchema).min(1, "At least one Vendor is required."),
});

// --- 2. VENDOR FIELD COMPONENT ---

const VendorFields = ({ control, index, onRemove, isMultiple }) => {
    return (
        <div className="space-y-4 relative"> 
            
            {isMultiple && (
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={onRemove}
                    className="absolute top-4 right-4 h-8 w-8" 
                >
                    <XIcon className="h-4 w-4 text-red-500" />
                </Button>
            )}

            {/* Vendor Full Name */}
            <FormField
                control={control}
                name={`vendors.${index}.fullname`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input className="!bg-white border-gray-200" placeholder="Vendor Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Vendor Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <FormField
                    control={control}
                    name={`vendors.${index}.email`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                                <Input type="email" className="!bg-white border-gray-200" placeholder="vendor@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={control}
                    name={`vendors.${index}.phone`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                                <Input type="tel" className="!bg-white border-gray-200" placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

// --- 3. MAIN FORM COMPONENT ---

const ReferralForm = ({ onSuccess }) => { // Accept onSuccess prop
    const form = useForm({
        resolver: zodResolver(referralSchema),
        defaultValues: {
            referrerFullname: "",
            referrerEmail: "",
            referrerPhone: "",
            vendors: [{ fullname: "", email: "", phone: "" }],
        },
        mode: "onTouched",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "vendors",
    });

    const [isPending, startTransition] = useTransition();

    async function onFormSubmit(data) {
        startTransition(async () => {
            try {
                // --- CALL THE REAL SERVER ACTION ---
                const response = await postReferral(data); 
                if (response.status === 201) {
                    // Reset form first
                    form.reset();
                    
                    // Check if onSuccess callback exists AND referralCode is present
                    if (onSuccess && response.newReferral?.referralCode) {

                        // Call the success callback with the referral code
                        onSuccess(response.newReferral.referralCode);
                    } else {

                        // Only show toast if callback is missing or code is missing
                        toast.success("Referral Submitted Successfully!", {
                            description: response.newReferral?.referralCode 
                                ? `Referral Code: ${response.newReferral.referralCode}` 
                                : "Your referral has been submitted."
                        });
                    }
                    
                } else {
                    // Handle errors returned by the server action (status != 201)
                    toast.error("Submission Failed", {
                        description: response.message || response.error || "An unknown error occurred.",
                    });
                }
            } catch (error) {
                console.error("Form Submission Error:", error);
                toast.error("An unexpected error occurred. Check your network connection.");
            }
        });
    }
    
    const newVendorDefaults = { fullname: "", email: "", phone: "" };
    
    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">

                    {/* REFERRER DETAILS SECTION */}
                    <div className="space-y-6 border-b pb-8">
                        <h3 className="!text-xl">Referrer Details</h3>
                        
                        <FormField
                            control={form.control}
                            name="referrerFullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="bg-white border-gray-300" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="referrerEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input type="email" className="bg-white border-gray-300" placeholder="john.doe@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="referrerPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" className="bg-white border-gray-300" placeholder="+1 (555) 000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* VENDOR DETAILS SECTION (DYNAMIC ARRAY) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="!text-xl font-bold">Referred Vendor(s)</h2>
                            <Button 
                                type="button" 
                                variant="link" 
                                onClick={() => append(newVendorDefaults)}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold p-0"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Another Vendor
                            </Button>
                        </div>
                        
                        {/* The mapping below iterates and renders the dynamic vendor fields */}
                        {fields.map((field, index) => (
                            <VendorFields
                                key={field.id}
                                control={form.control}
                                index={index}
                                onRemove={() => remove(index)}
                                isMultiple={fields.length > 1}
                            />
                        ))}
                        
                        {/* Display array error message if fields.length is 0 */}
                        {fields.length === 0 && (
                            <p className="text-sm font-medium text-red-600">
                                {form.formState.errors.vendors?.message || "Please add at least one vendor."}
                            </p>
                        )}

                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit Referral"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ReferralForm;