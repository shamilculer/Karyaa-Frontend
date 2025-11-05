"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useVendorStore } from "@/store/vendorStore";
import { getSubcategories } from "@/app/actions/categories";
import { Skeleton } from "@/components/ui/skeleton";

const AddPackageForm = () => {
    const router = useRouter();
    const { vendor } = useVendorStore();

    const form = useForm({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: "",
            subheading: "",
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

    const [subCategories, setSubCategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);

    // ✅ Fetch ALL subcategories on mount
    useEffect(() => {
        const fetchSubs = async () => {
            setIsLoadingSubcategories(true);

            try {
                const data = await getSubcategories({});
                setSubCategories(data?.subcategories || []);
            } catch (err) {
                console.error("Failed loading subcategories", err);
                setSubCategories([]);
            } finally {
                setIsLoadingSubcategories(false);
            }
        };

        fetchSubs();
    }, []);

    // ✅ Multi-select toggler
    const toggleSubCategory = (slug) => {
        const current = form.getValues("services");

        if (current.includes(slug)) {
            form.setValue(
                "services",
                current.filter((s) => s !== slug)
            );
        } else {
            form.setValue("services", [...current, slug]);
        }
    };

    async function onSubmit(values) {
        try {
          const res = await createPackage(values);
    
          toast.success(res.message || "Package created successfully!");
    
          // Redirect AFTER toast
          setTimeout(() => router.push("/vendor/packages"), 500);
    
        } catch (err) {
          console.error(err);
          toast.error(err.message || "Something went wrong");
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

                    {/* 🟢 Subcategory Multi-Select */}
                    <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Services</FormLabel>
                                <FormControl>
                                    <div className="flex flex-wrap gap-2 mt-3">

                                        {isLoadingSubcategories ? (
                                            <>
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                                <Skeleton className="h-8 w-20 rounded-full" />
                                            </>
                                        ) : subCategories?.length > 0 ? (
                                            subCategories.map((sub) => (
                                                <Button
                                                    key={sub._id}
                                                    type="button"
                                                    variant={field.value.includes(sub._id) ? "default" : "outline"}
                                                    className={`rounded-full border text-xs md:text-sm font-medium px-2 md:px-4 py-0.5 md:py-1 transition-all ${field.value.includes(sub._id)
                                                        ? "bg-primary text-white border-primary"
                                                        : "hover:bg-gray-100 hover:text-primary"
                                                        }`}
                                                    onClick={() => toggleSubCategory(sub._id)}
                                                >
                                                    {sub.name}
                                                </Button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No services available.</p>
                                        )}
                                    </div>
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
                                <Input {...form.register(`includes.${i}`)} placeholder={`Item ${i + 1}`} />
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
