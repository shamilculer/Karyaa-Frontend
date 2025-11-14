"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { packageSchema } from "@/lib/schema";
import { createPackage } from "@/app/actions/vendor/packages";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useVendorStore } from "@/store/vendorStore";

// --- 🟢 FIXED TagsInput Component ---
const TagsInput = ({ name, placeholder, errors, getValues, setValue, trigger }) => {
    // Local state for the current input value
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = useCallback(
        (e) => {
            e.preventDefault();
            const value = inputValue.trim();
            const currentTags = getValues(name) || [];

            if (value && !currentTags.includes(value)) {
                setValue(name, [...currentTags, value]);
                trigger(name); // Re-validate the services field
                setInputValue(""); // Clear input after adding
            } else if (value && currentTags.includes(value)) {
                toast.info("This service has already been added.");
                setInputValue("");
            }
        },
        [inputValue, getValues, setValue, trigger, name]
    );

    const handleRemoveTag = (tagToRemove) => {
        const currentTags = getValues(name) || [];
        setValue(
            name,
            currentTags.filter((tag) => tag !== tagToRemove)
        );
        trigger(name); // Re-validate the services field
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddTag(e);
        }
    };

    // Use getValues to retrieve the current array of tags
    const tags = getValues(name) || [];

    return (
        <div className="space-y-3">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={errors?.[name] ? "border-red-500" : ""}
                />
                <Button type="button" onClick={handleAddTag}>
                    Add
                </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                        onClick={() => handleRemoveTag(tag)}
                    >
                        {tag}
                        <span className="text-gray-500 hover:text-gray-700 font-bold ml-1">
                            &times;
                        </span>
                    </Badge>
                ))}
            </div>
        </div>
    );
};
// --- END: TagsInput Component ---

const AddPackageForm = () => {
    const router = useRouter();
    const { vendor } = useVendorStore();

    const form = useForm({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: "",
            subheading: "",
            priceStartingFrom: 0,
            description: "",
            services: [],
            includes: [""],
            coverImage: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "includes",
    });

    async function onSubmit(values) {
        const submissionValues = {
            ...values,
            priceStartingFrom: Number(values.priceStartingFrom),
            includes: values.includes.filter(item => item.trim() !== ""),
        };
        
        try {
            const res = await createPackage(submissionValues);
    
            form.reset(); 
            toast.success(res.message || "Package created successfully!");
    
            setTimeout(() => router.push("/vendor/packages"), 500);
    
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
            form.reset({ 
                ...submissionValues, 
                priceStartingFrom: submissionValues.priceStartingFrom || 0 
            }); 
        }
    }

    return (
        <div className="w-full max-w-4xl space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-8">

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Package Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Wedding Package Deluxe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Subheading */}
                    <FormField
                        control={form.control}
                        name="subheading"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subheading</FormLabel>
                                <FormControl>
                                    <Input placeholder="Premium all-in-one bundle" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {/* Price Field */}
                    <FormField
                        control={form.control}
                        name="priceStartingFrom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Starting Price (AED)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        placeholder="5000" 
                                        {...field} 
                                        onChange={(e) => field.onChange(e.target.valueAsNumber || e.target.value)}
                                        value={field.value === 0 ? "" : field.value} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cover Image */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={() => (
                            <FormItem className="cursor-pointer">
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <ControlledFileUpload
                                        control={form.control}
                                        name="coverImage"
                                        allowedMimeType={["image/png", "image/jpeg", "image/webp"]}
                                        label="Upload cover image"
                                        folderPath={`vendor-packages/${vendor?._id}`}
                                        errors={form.formState.errors}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} className="h-72" placeholder="Describe your package..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tags Input for Services */}
                    <FormField
                        control={form.control}
                        name="services"
                        render={() => (
                            <FormItem>
                                <FormLabel>Services (Type Name and press Enter or Add)</FormLabel>
                                <FormControl>
                                    <TagsInput 
                                        name="services"
                                        placeholder="E.g., 'Wedding Photography'"
                                        errors={form.formState.errors}
                                        getValues={form.getValues}
                                        setValue={form.setValue}
                                        trigger={form.trigger}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Includes */}
                    <div className="mt-10 space-y-5">
                        <FormLabel className="mb-4">Features Included In The Package</FormLabel>
                        {fields.map((f, i) => (
                            <div key={f.id} className="flex gap-2 items-center">
                                <FormField
                                    control={form.control}
                                    name={`includes.${i}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder={`Item ${i + 1}`}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="ghost" onClick={() => remove(i)}>
                                    ❌
                                </Button>
                            </div>
                        ))}
                        <Button className="mt-4" type="button" onClick={() => append("")}>
                            + Add Item
                        </Button>
                    </div>

                    {/* Submit */}
                    <Button
                        className="w-full mt-4"
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Create Package"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddPackageForm;