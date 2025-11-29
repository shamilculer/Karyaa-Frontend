// components/admin/CreateCategoryButtonWithModal.jsx

"use client"

import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
// ➡️ Import Dialog and DialogTrigger
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogTrigger // ⬅️ The component for the button
} from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, PlusIcon } from "lucide-react"; // ⬅️ Added PlusIcon
import { toast } from "sonner";
import { createIdeaCategoryAction } from "@/app/actions/admin/ideas";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";


// ➡️ Renaming the component to reflect it includes the whole Dialog structure
export function CreateIdeaCategoryModal({ onCreationSuccess }) {
    
    // State to force the Dialog to close after successful submission
    const [open, setOpen] = useState(false);

    const { handleSubmit, control, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            coverImage: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentName = watch("name");

    const onSubmit = async (formData) => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            toast.error("Category name cannot be empty.");
            return;
        }

        setIsSubmitting(true);
        
        const res = await createIdeaCategoryAction({
            name: trimmedName,
            coverImage: formData.coverImage || "",
        });

        setIsSubmitting(false);

        if (res.success) {
            toast.success(res.message);
            reset(); 
            setOpen(false); // Manually close the Dialog using local state
            if (onCreationSuccess) {
                onCreationSuccess(); 
            }
        } else {
            toast.error(res.message || "An error occurred during creation.");
        }
    };

    return (
        // ➡️ The Dialog component now manages the 'open' state, which is required
        <Dialog open={open} onOpenChange={setOpen}>
            
            {/* 1. The Dialog Trigger (Your Round Button) */}
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="default" 
                    size="icon"
                    className="w-16 h-16 rounded-full mb-5"
                    title="Create New Category"
                >
                    <PlusIcon className="w-6 h-6" />
                </Button>
            </DialogTrigger>

            {/* 2. The Dialog Content (The Modal Body) */}
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Create New Idea Category
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6 py-6">
                        
                        {/* Name Input Field */}
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
                                        placeholder="E.g., Technology, Design, Marketing"
                                        className="h-10"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Cover Image Upload Field */}
                        <div className="space-y-2">
                            <Label className="text-base flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                Cover Image (Optional)
                            </Label>
                            <ControlledFileUpload
                                control={control}
                                name="coverImage"
                                label="Upload Category Cover Image"
                                errors={errors}
                                allowedMimeType={['image/jpeg', 'image/png', 'image/webp']}
                                folderPath="idea-categories"
                                multiple={false}
                            />
                            {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>}
                        </div>
                        
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => { reset(); setOpen(false); }} 
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
                                    Creating...
                                </>
                            ) : (
                                "Create Category"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}