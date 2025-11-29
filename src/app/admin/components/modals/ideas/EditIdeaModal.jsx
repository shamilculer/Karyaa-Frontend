"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { updateIdeaAction } from "@/app/actions/admin/ideas"; 

// Define the expected structure for category props (same as AddIdeaModal)
/**
 * @typedef {object} Category
 * @property {string} _id - The unique ID of the category.
 * @property {string} name - The display name of the category.
 */

// Define the expected structure for Idea prop (must match your DB structure)
/**
 * @typedef {object} Idea
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {object} category - Must have a 'name' property
 * @property {string[]} [gallery]
 */

// ✅ Zod Schema (reused)
const ideaSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Category is required"), 
    images: z.array(z.string()).optional(),
});

/**
 * Modal form for editing an existing Idea.
 * @param {object} props
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {(open: boolean) => void} props.onOpenChange - Callback to change the dialog visibility.
 * @param {Category[]} props.categories - Array of category objects.
 * @param {Idea} props.idea - The idea object currently being edited.
 * @param {() => void} props.onSuccess - Callback to run after successful submission (e.g., refresh table).
 */
export default function EditIdeaModal({ open, onOpenChange, categories = [], idea, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Initialize image list with the existing gallery or an empty array
    const [imageList, setImageList] = useState(idea?.gallery || []);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ideaSchema),
        // ➡️ Set default values based on the passed 'idea' prop
        defaultValues: {
            title: idea?.title || "",
            description: idea?.description || "",
            category: idea?.category?.name || "", // Assuming category object has a 'name' property
            images: idea?.gallery || [],
        },
    });

    // ➡️ IMPORTANT: Update form and imageList when the 'idea' prop changes
    useEffect(() => {
        if (idea) {
            reset({
                title: idea.title,
                description: idea.description,
                category: idea.category?.name || "",
                images: idea.gallery || [],
            });
            setImageList(idea.gallery || []);
        }
    }, [idea, reset]);


    // ✅ Handle image uploads (reused)
    const handleImageUpload = (url) => {
        const updated = [...imageList, url];
        setImageList(updated);
        setValue("images", updated);
    };

    // ✅ Remove image (reused)
    const removeImage = (url) => {
        const updated = imageList.filter((img) => img !== url);
        setImageList(updated);
        setValue("images", updated);
    };

    // ✅ Submit (calling the UPDATE action)
    const onSubmit = async (data) => {
        if (!idea?._id) {
            toast.error("Error: Idea ID is missing for update.");
            return;
        }
        
        setIsSubmitting(true);
        const payload = { 
            id: idea._id, // Send ID to the server action
            title: data.title,
            description: data.description,
            categoryName: data.category, // Send category name
            gallery: imageList, 
        };
        
        // 🚨 Assumes you have an updateIdeaAction that takes {id, title, description, categoryName, gallery}
        const res = await updateIdeaAction(payload); 
        setIsSubmitting(false);

        if (res.success) {
            toast.success(res.message || "Idea updated successfully!");
            onOpenChange(false);
            onSuccess(); // Callback to refresh table
        } else {
            toast.error(res.message || "Failed to update idea.");
        }
    };

    // Reset state when modal is closed externally
    const handleDialogChange = (newOpenState) => {
        if (!newOpenState) {
            // Only reset if it's closing and not currently submitting
            if (!isSubmitting) {
                // When closing, reset the form back to the current prop values
                reset({
                    title: idea?.title || "",
                    description: idea?.description || "",
                    category: idea?.category?.name || "",
                    images: idea?.gallery || [],
                });
                setImageList(idea?.gallery || []);
            }
        }
        onOpenChange(newOpenState);
    }
    
    // Safety check: Don't render if essential data is missing
    if (!idea) return null;

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-primary">
                        Edit Idea: {idea.title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="font-medium text-sm">Title</label>
                            <Input
                                placeholder="Enter idea title"
                                {...register("title")}
                                className={errors.title && "border-red-500"}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="font-medium text-sm">Description</label>
                            <Textarea
                                placeholder="Write about this idea..."
                                {...register("description")}
                                className={`h-40 ${errors.description && "border-red-500"}`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Category (SELECT) */}
                        <div className="space-y-2">
                            <label className="font-medium text-sm">Category</label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value} // Controlled select for proper updating
                                    >
                                        <SelectTrigger
                                            className={`w-full ${errors.category && "border-red-500"}`}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat.name}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-red-500 text-sm">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* Gallery Upload */}
                        <div className="space-y-3">
                            <label className="font-medium text-sm">Gallery Images</label>

                            <div className="flex flex-wrap gap-4">
                                {/* Display existing images */}
                                {imageList.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-28 h-28 border rounded-lg overflow-hidden group"
                                    >
                                        <img
                                            src={img}
                                            alt={`Idea Image ${idx + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload button (uses file upload component) */}
                                <div className="w-28 h-28 flex items-center justify-center border rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <ControlledFileUpload
                                        control={control}
                                        name="upload_new" // Use a unique temporary name for the upload field
                                        label="Upload"
                                        folderPath="ideas/gallery"
                                        allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                        errors={errors}
                                        onSuccess={(url) => handleImageUpload(url)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}