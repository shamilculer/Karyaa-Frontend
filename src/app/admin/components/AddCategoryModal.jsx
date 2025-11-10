// AddCategoryModal.jsx
"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"

import ControlledFileUpload from "@/components/common/ControlledFileUploads"
import { addCategory } from "@/app/actions/admin/categories"

// --- 1. Define Form Schema (Validation) ---
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Category name must be at least 2 characters.",
    }).max(50),
    // Add validation for the cover image (expecting a Cloudinary URL string)
    coverImage: z.url({
        message: "A cover image is required.",
    }),
})

// --- Define constants for file upload ---
const CATEGORY_IMAGE_MIME_TYPES = ["image/jpeg","image/png", "image/webp"];
const CLOUDINARY_FOLDER_PATH = "category-images";


export function AddCategoryModal({ onOpenChange, open }) {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            coverImage: "", // Initialize coverImage
        },
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = form

    const onSubmit = async (data) => {
        const submissionToastId = toast.loading("Creating category...")

        const result = await addCategory(data)

        if (result.success) {
            toast.success(result.message || "Category added successfully!", { id: submissionToastId })

            if (result.category && result.category.slug) {
                onOpenChange(false)
                reset()

                // Navigate to the management page
                router.push(`/category-management/${result.category.slug}`)
            } else {
                toast.error("Category added, but missing slug for navigation. Please check the categories page.", { id: submissionToastId })
            }
        } else {
            // Display the error message from the server action
            toast.error(result.message || "Failed to create category.", { id: submissionToastId })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button >
                    <Plus className="w-4 h-4" />
                    Add New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Enter the name and upload a cover image for your new category.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Transportation"
                            {...register("name")}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* --- Integrated File Upload --- */}
                    <div className="grid gap-2">
                        <Label htmlFor="coverImage">Cover Image *</Label>
                        <ControlledFileUpload
                            control={control}
                            name="coverImage"
                            label="Upload Cover Image"
                            errors={errors}
                            allowedMimeType={CATEGORY_IMAGE_MIME_TYPES}
                            folderPath={CLOUDINARY_FOLDER_PATH}
                        />
                        {/* Errors are handled within ControlledFileUpload, but this ensures top-level visibility if needed */}
                        {errors.coverImage && errors.coverImage.type !== 'required' && (
                            <p className="text-sm text-red-500">{errors.coverImage.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                "Save Category"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}