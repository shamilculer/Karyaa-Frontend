"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVendorFormStore } from '@/store/vendorFormStore';
import { Step1Schema } from '@/lib/schema';
import { EyeIcon, EyeOff } from "lucide-react";

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

import ControlledFileUpload from '@/components/common/ControlledFileUploads';

// Helper for simple text inputs
const renderInputField = (form, name, label, placeholder, type = "text") => (
    <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-xs leading-0 font-medium">{label}</FormLabel>
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field}
                        type={type}
                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);


export default function Step01_BasicInfo({ currentStepIndex, isLastStep }) {
    const { formData, updateFields, nextStep, prevStep } = useVendorFormStore();
    // Reinstated state for password visibility
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
            // Required Fields
            tradeLicenseNumber: formData.tradeLicenseNumber || '',
            personalEmiratesIdNumber: formData.personalEmiratesIdNumber || '',
            emiratesIdCopy: formData.emiratesIdCopy || '',
            tradeLicenseCopy: formData.tradeLicenseCopy || '',
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

    // Reinstated function to toggle password visibility
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
                    <h4 className="!text-2xl font-bold text-primary mb-6">Step 1: Basic Account & Verification Information</h4>

                    {/* Owner Name Field */}
                    {renderInputField(form, "ownerName", "Owner Name", "Enter owner's full name")}
                    
                    {/* Email Address Field */}
                    {renderInputField(form, "email", "Email Address", "Enter your email address", "email")}

                    {/* Phone Number Field */}
                    {renderInputField(form, "phoneNumber", "Phone Number (UAE)", "Enter mobile number (e.g., 971501234567), WhatsApp Mandatory")}

                    {/* Trade License Number Field */}
                    {renderInputField(form, "tradeLicenseNumber", "Trade License Number", "Enter your business trade license number")}

                    {/* Personal Emirates ID Number Field */}
                    {renderInputField(form, "personalEmiratesIdNumber", "Personal Emirates ID Number", "Enter your Emirates ID number")}

                    {/* Password Field (REINSTATED) */}
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
                    {/* End Password Field */}

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
                                    {/* FIX: Use relative path for ControlledFileUpload */}
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
                    
                    {/* Emirates ID Copy Upload Field (REQUIRED) */}
                    <FormField
                        control={form.control}
                        name="emiratesIdCopy"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Emirates ID Copy (Front and Back)
                                </FormLabel>
                                <FormControl>
                                    {/* FIX: Use relative path for ControlledFileUpload */}
                                    <ControlledFileUpload
                                        control={form.control}
                                        name="emiratesIdCopy"
                                        label="Upload Emirates ID Copy"
                                        errors={form.formState.errors}
                                        allowedMimeType={["image/jpeg", "image/png", "application/pdf"]}
                                        folderPath={FOLDER_PATH}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Trade License Copy Upload Field (REQUIRED) */}
                    <FormField
                        control={form.control}
                        name="tradeLicenseCopy"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">
                                    Trade License Copy
                                </FormLabel>
                                <FormControl>
                                    {/* FIX: Use relative path for ControlledFileUpload */}
                                    <ControlledFileUpload
                                        control={form.control}
                                        name="tradeLicenseCopy"
                                        label="Upload Trade License Document"
                                        errors={form.formState.errors}
                                        allowedMimeType={["image/jpeg", "image/png", "application/pdf"]}
                                        folderPath={FOLDER_PATH}
                                    />
                                </FormControl>
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
