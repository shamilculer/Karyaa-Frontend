"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { packageSchema } from "@/lib/schema";
import { updatePackage } from "@/app/actions/vendor/packages";
import { SquarePen } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
import { ScrollArea } from "@/components/ui/scroll-area";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useVendorStore } from "@/store/vendorStore";
import { getSubcategories } from "@/app/actions/categories";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPackageModal({ packageData, onUpdate }) {
    const [open, setOpen] = useState(false);
    const { vendor } = useVendorStore();

    const form = useForm({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: packageData.name || "",
            subheading: packageData.subheading || "",
            description: packageData.description || "",
            services: packageData.services?.map(s => s._id || s) || [],
            includes: packageData.includes?.length > 0 ? packageData.includes : [""],
            coverImage: packageData.coverImage || "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "includes",
    });

    const [subCategories, setSubCategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);

    // Fetch subcategories when modal opens
    useEffect(() => {
        if (open) {
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
        }
    }, [open]);

    // Multi-select toggler
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
            const res = await updatePackage(packageData._id, values);

            toast.success(res.message || "Package updated successfully!");

            // Call onUpdate callback if provided
            if (onUpdate) {
                onUpdate(res.package);
            }

            // Close modal after successful update
            setTimeout(() => setOpen(false), 500);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                    <SquarePen className="w-4" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh]">
                <DialogHeader className="border-b border-gray-300 pb-4">
                    <DialogTitle>Edit Package</DialogTitle>
                    <DialogDescription>
                        Update your package details below
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-120px)] w-full lg:pr-4 pt-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                                            <Textarea 
                                                rows={4} 
                                                className="h-48" 
                                                placeholder="Describe your package..." 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Services Multi-Select */}
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
                                                        {[...Array(12)].map((_, i) => (
                                                            <Skeleton key={i} className="h-8 w-20 rounded-full" />
                                                        ))}
                                                    </>
                                                ) : subCategories?.length > 0 ? (
                                                    subCategories.map((sub) => (
                                                        <Button
                                                            key={sub._id}
                                                            type="button"
                                                            variant={field.value.includes(sub._id) ? "default" : "outline"}
                                                            className={`rounded-full border text-xs md:text-sm font-medium px-2 md:px-4 py-0.5 md:py-1 transition-all ${
                                                                field.value.includes(sub._id)
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
                            <div className="space-y-4">
                                <FormLabel>Features Included In The Package</FormLabel>
                                {fields.map((f, i) => (
                                    <div key={f.id} className="flex gap-2 items-center">
                                        <Input 
                                            {...form.register(`includes.${i}`)} 
                                            placeholder={`Item ${i + 1}`} 
                                        />
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            onClick={() => remove(i)}
                                            disabled={fields.length === 1}
                                        >
                                            ❌
                                        </Button>
                                    </div>
                                ))}
                                <Button 
                                    className="mt-2" 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => append("")}
                                >
                                    + Add Item
                                </Button>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4 pb-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setOpen(false)}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    disabled={form.formState.isSubmitting}
                                    type="submit"
                                >
                                    {form.formState.isSubmitting ? "Updating..." : "Update Package"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}