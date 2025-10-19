"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVendorFormStore } from '@/store/vendorFormStore'; 
import { Step3Schema } from "@/lib/schema";

// Shadcn/ui imports
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
import { Textarea } from "@/components/ui/textarea";

export default function Step03_Profile() {
    const { formData, updateFields, nextStep, prevStep } = useVendorFormStore();
    
    // Initialize RHF for this specific step
    const form = useForm({
        resolver: zodResolver(Step3Schema),
        defaultValues: {
            aboutDescription: formData.aboutDescription || '',
            address: formData.address || {
                street: '',
                area: '',
                city: '',
                state: '',
                zipCode: '',
                googleMapLink: formData.address?.googleMapLink || '', // Added googleMapLink
                coordinates: {
                    latitude: undefined,
                    longitude: undefined,
                },
            },
            serviceAreaCoverage: formData.serviceAreaCoverage || '',
            pricingStartingFrom: formData.pricingStartingFrom || 0,
            gallery: formData.gallery || [],
            packages: formData.packages || [],
            // UPDATED: Social Media Links (matching schema)
            socialMediaLinks: formData.socialMediaLinks || {
                facebook: '',
                instagram: '',
                linkedin: '',
                tiktok: '',
            },
        },
        mode: 'onBlur',
    });

    // Step Submission Handler
    const handleNext = (data) => {
        const currentData = form.getValues();
        updateFields(currentData);
        nextStep();
    };

    const handleBack = () => {
        // Save current form data before going back
        const currentData = form.getValues();
        updateFields(currentData);
        prevStep();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">

                <h4 className="!text-2xl font-bold text-primary mb-6">
                    Step 3: Business Profile & Location
                </h4>

                {/* About Description Field */}
                <FormField
                    control={form.control}
                    name="aboutDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">
                                About Your Business
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell customers about your business, what makes you unique, and why they should choose you (min 20 characters)"
                                    {...field}
                                    rows={6}
                                    className="p-4 bg-[#f0f0f0] border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <p className="!text-[12px] text-gray-500 mt-1">
                                This appears in the "About" section of your profile.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Address Section */}
                <div className="space-y-4">
                    <h4 className="!text-lg text-gray-700">Business Address</h4>

                    {/* Street Address */}
                    <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Street Address (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Building 123, Street Name"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Area */}
                    <FormField
                        control={form.control}
                        name="address.area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Area/Neighborhood (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Downtown, Marina"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* City */}
                        <FormField
                            control={form.control}
                            name="address.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs leading-0 font-medium">
                                        City *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Dubai"
                                            {...field}
                                            className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* State */}
                        <FormField
                            control={form.control}
                            name="address.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs leading-0 font-medium">
                                        Emirate *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Dubai"
                                            {...field}
                                            className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    {/* Zip Code */}
                    <FormField
                        control={form.control}
                        name="address.zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Zip/Postal Code (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., 12345"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Google Map Link */}
                    <FormField
                        control={form.control}
                        name="address.googleMapLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Google Map Link (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="http://maps.google.com/..."
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <p className="!text-[12px] text-gray-500 mt-1">
                                    A direct link to your business location on Google Maps. This is required to display you in the map view.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Service Area Coverage Field */}
                <FormField
                    control={form.control}
                    name="serviceAreaCoverage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">
                                Service Area Coverage
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Dubai, Abu Dhabi & Sharjah, All UAE"
                                    {...field}
                                    className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <p className="!text-[12px] text-gray-500 mt-1">
                                Specify the areas where you provide your services.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Pricing Starting From Field */}
                <FormField
                    control={form.control}
                    name="pricingStartingFrom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">
                                Pricing Starting From (AED)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                    value={field.value ?? ''}
                                    className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Social Media Links Section */}
                <div className="space-y-4">
                    <h4 className="!text-lg text-gray-700">
                        Social Media Links (Optional)
                    </h4>
                    
                    {/* Facebook Link Field */}
                    <FormField
                        control={form.control}
                        name="socialMediaLinks.facebook"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Facebook URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://www.facebook.com/yourpage"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Instagram Link Field */}
                    <FormField
                        control={form.control}
                        name="socialMediaLinks.instagram"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Instagram URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://www.instagram.com/yourhandle"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* NEW FIELD: LinkedIn Link Field */}
                    <FormField
                        control={form.control}
                        name="socialMediaLinks.linkedin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">LinkedIn URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://www.linkedin.com/company/yourcompany"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* NEW FIELD: TikTok Link Field */}
                    <FormField
                        control={form.control}
                        name="socialMediaLinks.tiktok"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">TikTok URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://www.tiktok.com/@yourhandle"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Gallery Note */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="!text-sm text-blue-800">
                        📸 <strong>Gallery & Packages:</strong> You can add gallery images and service packages after registration from your vendor dashboard.
                    </p>
                </div>

                {/* --- NAVIGATION BUTTONS --- */}
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
                        type="submit"
                        disabled={form.formState.isSubmitting || !form.formState.isValid}
                    >
                        Complete Registration →
                    </Button>
                </div>
            </form>
        </Form>
    );
}