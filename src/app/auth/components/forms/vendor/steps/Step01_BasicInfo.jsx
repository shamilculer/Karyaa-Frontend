"use client";

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVendorFormStore } from '@/store/vendorFormStore';
import { Step1Schema } from '@/lib/schema';
import { EyeIcon, EyeOff, Globe, MapPin } from "lucide-react"; // Added Globe and MapPin

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription, // Added FormDescription for better UX
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";

import ControlledFileUpload from '@/components/common/ControlledFileUploads';

// Reusable Input Field Renderer (No Change)
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

export default function Step01_BasicInfo() {
    const { formData, updateFields, nextStep } = useVendorFormStore();
    const [showPassword, setShowPassword] = useState(false);

    const tempUploadToken = formData.tempUploadToken;
    const FOLDER_PATH = `temp_vendors/${tempUploadToken}`;

    const form = useForm({
        resolver: zodResolver(Step1Schema),
        defaultValues: {
            ownerName: formData.ownerName || '',
            email: formData.email || '',
            phoneNumber: formData.phoneNumber || '',
            password: formData.password || '',
            
            // Initializing conditional fields
            ownerProfileImage: formData.ownerProfileImage || '',
            tradeLicenseNumber: formData.tradeLicenseNumber || '',
            personalEmiratesIdNumber: formData.personalEmiratesIdNumber || '',
            emiratesIdCopy: formData.emiratesIdCopy || '',
            tradeLicenseCopy: formData.tradeLicenseCopy || '',
            
            isInternational: formData.isInternational ?? false,
        },
        mode: 'onBlur',
    });

    const handleNext = (data) => {
        updateFields(data);
        nextStep();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isInternational = form.watch("isInternational");

    // Auto-clear UAE fields when switching to international
    useEffect(() => {
        if (isInternational) {
            // Set to empty string '' to correctly trigger Zod's .optional().or(z.literal(''))
            form.setValue("tradeLicenseNumber", "");
            form.setValue("personalEmiratesIdNumber", "");
            form.setValue("emiratesIdCopy", "");
            form.setValue("tradeLicenseCopy", "");
        }
    }, [isInternational, form]);

    return (
        <>
            <div className='mb-8 space-y-5'>
                <h1 className="text-primary !capitalize leading-[1.2em]">Welcome to the UAE’s premier events vendor platform.</h1>
                <p>Whether you offer catering, photography, décor, entertainment, or any other event service – this is where your business gets discovered!</p>
                <p>Our simple, 3-step registration ensures only verified and trusted vendors join our network.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
                    <h4 className="!text-2xl font-bold text-primary mb-6">Step 1: Basic Account & Verification Information</h4>

                    {/* Owner Name and Email */}
                    {renderInputField(form, "ownerName", "Owner Name", "Enter owner's full name")}
                    {renderInputField(form, "email", "Email Address", "Enter your email address", "email")}

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
                    
                    {/* --- UAE or International Selection (MOVED HERE) --- */}
                    <div className="border border-primary/20 p-3 rounded-lg bg-primary/5 space-y-1">
                        <FormField
                            control={form.control}
                            name="isInternational"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="font-semibold text-sm">
                                        Where is your primary business registered?
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => field.onChange(value === "true")}
                                            value={String(field.value)}
                                            className="flex space-x-6 pt-2"
                                        >
                                            <div className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${field.value === false ? 'border-primary bg-white shadow-sm' : 'border-gray-300'}`}>
                                                <RadioGroupItem value="false" id="uae" />
                                                <label htmlFor="uae" className="text-sm font-medium">🇦🇪 United Arab Emirates</label>
                                            </div>
                                            <div className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${field.value === true ? 'border-primary bg-white shadow-sm' : 'border-gray-300'}`}>
                                                <RadioGroupItem value="true" id="intl" />
                                                <label htmlFor="intl" className="text-sm font-medium"><Globe className="inline h-4 w-4 mr-1 text-gray-700"/> International</label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* --- End Location Selection --- */}


                    {/* Phone always visible */}
                    {renderInputField(form, "phoneNumber", "Phone Number", "971501234567")}

                    {/* ✅ UAE-Only Conditional Fields */}
                    {!isInternational && (
                        <>                            
                            {renderInputField(form, "tradeLicenseNumber", "Trade License Number", "Enter trade license number")}
                            {renderInputField(form, "personalEmiratesIdNumber", "Personal Emirates ID Number", "Enter Emirates ID")}

                            <FormField
                                control={form.control}
                                name="emiratesIdCopy"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-xs leading-0 font-medium">
                                            Emirates ID Copy (Front + Back)
                                        </FormLabel>
                                        <FormControl>
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

                            <FormField
                                control={form.control}
                                name="tradeLicenseCopy"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-xs leading-0 font-medium">
                                            Trade License Copy
                                        </FormLabel>
                                        <FormControl>
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
                        </>
                    )}

                    {/* Optional profile image */}
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
                                        label="Upload Profile Image"
                                        errors={form.formState.errors}
                                        allowedMimeType={["image/jpeg", "image/png"]}
                                        folderPath={FOLDER_PATH}
                                    />
                                </FormControl>
                                <p className="!text-[12px] text-gray-500 mt-1">
                                    Leave empty to auto-generate based on your name.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex-center w-full pt-4">
                        <Button
                            type="submit"
                            className="!w-full text-base"
                            disabled={form.formState.isSubmitting}
                        >
                            Next Step →
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}