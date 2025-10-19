"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVendorFormStore } from '@/store/vendorFormStore';
import { Step1Schema } from '@/lib/schema';
import { EyeIcon, EyeOff } from "lucide-react";

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

import ControlledFileUpload from "@/components/common/ControlledFileUploads";

export default function Step01_BasicInfo({ currentStepIndex, isLastStep }) {
    const { formData, updateFields, nextStep, prevStep } = useVendorFormStore();
    const [showPassword, setShowPassword] = useState(false);

    // Construct Cloudinary folder path for vendor temp uploads
    const tempUploadToken = formData.tempUploadToken;
    const FOLDER_PATH = `temp_vendors/${tempUploadToken}`;

    // 1. Initialize RHF for this specific step
    const form = useForm({
        resolver: zodResolver(Step1Schema),
        defaultValues: {
            ownerName: formData.ownerName || '',
            email: formData.email || '',
            phoneNumber: formData.phoneNumber || '',
            password: formData.password || '',
            ownerProfileImage: formData.ownerProfileImage || '',
        },
        mode: 'onBlur',
    });

    // 2. Step Submission Handler
    const handleNext = (data) => {
        // Merge valid data into the global store
        updateFields(data);

        // Move to the next step
        nextStep();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>

            <div className='mb-8 space-y-5'>
                <h1 className="text-primary !capitalize leading-[1.2em]">Welcome to the UAE’s premier events vendor platform.</h1>
                <p> Whether you offer catering, photography, décor, entertainment, or any other event service – this is where your business gets discovered!</p>
                <p>Our simple, 3-step registration ensures only verified and trusted vendors join our network.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">

                    <h4 className="!text-2xl font-bold text-primary mb-6">Step 1: Basic Account Information</h4>

                    {/* Owner Name Field */}
                    <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Owner Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter owner's full name"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Address Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email address"
                                        {...field}
                                        type="email"
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Number Field */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Phone Number (UAE)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter mobile number (e.g., 971501234567), Whatsapp Mandatory"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter secure password (min 8 chars)"
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:bg-transparent"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <p className="!text-[12px] text-gray-500 mt-1">
                                    Must contain at least 8 characters, one uppercase, one lowercase, and one number.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Owner Profile Image Field (Optional) */}
                    <FormField
                        control={form.control}
                        name="ownerProfileImage"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Profile Image (Optional)
                                </FormLabel>
                                <FormControl>
                                    <ControlledFileUpload
                                        control={form.control}
                                        name="ownerProfileImage"
                                        label="Upload Profile Image (JPG/PNG)"
                                        errors={form.formState.errors}
                                        allowedMimeType={["image/jpeg", "image/png"]}
                                        folderPath={FOLDER_PATH}
                                    />
                                </FormControl>
                                <p className="!text-[12px] text-gray-500 mt-1">
                                    Leave empty to auto-generate a profile image based on your name.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- NAVIGATION BUTTONS --- */}
                    <div className="flex-center w-full pt-4">
                        <Button
                            type="submit"
                            className="!w-full text-base"
                            disabled={form.formState.isSubmitting}
                        >
                            Next Step &rarr;
                        </Button>
                    </div>
                </form>
            </Form>
        </>

    );
}