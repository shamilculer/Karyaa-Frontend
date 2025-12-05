// components/admin/EditCategoryModal.jsx
"use client"

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// Assuming these are your components/styles
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react"; // Added ImageIcon for visual
import { toast } from "sonner";
import { updateIdeaCategoryAction } from "@/app/actions/admin/ideas";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";


export function EditIdeaCategoryModal({ open, setOpen, category, onUpdateSuccess }) {

    const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: category?.name || "",
            coverImage: category?.coverImage || "",
        },
    });

    useEffect(() => {
        if (category) {
            setValue("name", category.name, { shouldValidate: true });
            setValue("coverImage", category.coverImage || "");
        }
    }, [category, setValue]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentCoverImage = watch("coverImage");
    const currentName = watch("name");

    const onSubmit = async (formData) => {
        if (!category?._id) {
            toast.error("Category ID is missing. Cannot update.");
            return;
        }

        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            toast.error("Category name cannot be empty.");
            return;
        }

        setIsSubmitting(true);

        const res = await updateIdeaCategoryAction({
            id: category._id,
            name: trimmedName,
            coverImage: formData.coverImage || "",
        });

        setIsSubmitting(false);

        if (res.success) {
            toast.success(res.message);
            setOpen(false);
            onUpdateSuccess();
        } else {
            toast.error(res.message || "An error occurred during update.");
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Increased max-width for better form spacing */}
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Edit Idea Category
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Main form area with padding */}
                    <div className="grid gap-6 py-6">

                        {/* 1. Name Input Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base">Category Name</Label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Category name is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Enter category name"
                                        className="h-10"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        {/* 2. Cover Image Upload Field */}
                        <div className="space-y-2">
                            <Label className="text-base flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                Cover Image (Optional)
                            </Label>

                            {/* Optional: Display current image thumbnail if available */}
                            {currentCoverImage && (
                                <div className="mb-3">
                                    <p className="text-sm text-muted-foreground mb-1">Current Image:</p>
                                    <img
                                        src={currentCoverImage}
                                        alt="Current Category Cover"
                                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                    />
                                </div>
                            )}

                            <ControlledFileUpload
                                control={control}
                                name="coverImage"
                                label={currentCoverImage ? "Change Image" : "Upload Image"}
                                errors={errors}
                                allowedMimeType={['image/jpeg', 'image/png', 'image/webp']}
                                folderPath="idea-categories"
                                multiple={false}
                                role="admin"
                            />
                            {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>}
                        </div>

                    </div>

                    {/* Footer for action buttons */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !currentName?.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
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