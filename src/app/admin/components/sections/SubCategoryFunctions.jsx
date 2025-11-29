"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { addSubcategory, editSubcategory } from "@/app/actions/admin/subcategory"
import ControlledFileUpload from "@/components/common/ControlledFileUploads"

// ============================================
// ADD SUBCATEGORY MODAL
// ============================================
export const AddSubcategoryModal = ({ isOpen, onOpenChange, categoryId, categoryName, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const addForm = useForm({
        defaultValues: {
            name: "",
            coverImage: "",
            isPopular: false,
            isNewSub: false,
        },
    })

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            addForm.reset()
        }
    }, [isOpen, addForm])

    const handleAddSubcategory = async () => {
        const isValid = await addForm.trigger()
        if (!isValid) return

        setIsSubmitting(true)
        const data = addForm.getValues()
        const payload = { 
            ...data, 
            mainCategory: categoryId,
        }

        try {
            const result = await addSubcategory(payload)

            if (!result.success) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            addForm.reset()
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to add subcategory. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Subcategory</DialogTitle>
                    <DialogDescription>
                        Create a new subcategory under {categoryName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Subcategory Name */}
                    <div className="space-y-2">
                        <Label htmlFor="sub-name">Subcategory Name</Label>
                        <Input
                            id="sub-name"
                            {...addForm.register("name", { required: "Name is required" })}
                            placeholder="e.g., Smart Watches"
                        />
                        {addForm.formState.errors.name && (
                            <p className="text-red-500 text-sm">{addForm.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <Label htmlFor="sub-image">Cover Image</Label>
                        <ControlledFileUpload
                            control={addForm.control}
                            name="coverImage"
                            errors={addForm.formState.errors}
                            allowedMimeType={['image/jpeg', 'image/png', 'image/webp']}
                            folderPath="subcategory_images"
                        />
                        {addForm.formState.errors.coverImage && (
                            <p className="text-red-500 text-sm">Image is required.</p>
                        )}
                    </div>

                    {/* Popular Flag */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sub-popular">Mark as Popular</Label>
                        <Controller
                            name="isPopular"
                            control={addForm.control}
                            render={({ field }) => (
                                <Switch
                                    id="sub-popular"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* New Flag */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sub-new">Mark as New</Label>
                        <Controller
                            name="isNewSub"
                            control={addForm.control}
                            render={({ field }) => (
                                <Switch
                                    id="sub-new"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddSubcategory} disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Subcategory"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ============================================
// EDIT SUBCATEGORY MODAL
// ============================================
export const EditSubcategoryModal = ({ isOpen, onOpenChange, subcategory, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const editForm = useForm({
        defaultValues: {
            name: "",
            coverImage: "",
            isPopular: false,
            isNewSub: false,
        },
    })
    
    // Set edit form values when subcategory changes
    useEffect(() => {
        if (subcategory) {
            editForm.reset({
                name: subcategory.name,
                coverImage: subcategory.coverImage,
                isPopular: subcategory.isPopular,
                isNewSub: subcategory.isNewSub,
            })
        }
    }, [subcategory, editForm])

    const handleEditSubcategory = async () => {
        if (!subcategory?._id) return

        const isValid = await editForm.trigger()
        if (!isValid) return

        setIsSubmitting(true)
        const data = editForm.getValues()

        try {
            const result = await editSubcategory(subcategory._id, data)

            if (!result.success) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to update subcategory. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!subcategory) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Subcategory: {subcategory?.name}</DialogTitle>
                    <DialogDescription>Update subcategory details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Subcategory Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-sub-name">Subcategory Name</Label>
                        <Input
                            id="edit-sub-name"
                            {...editForm.register("name", { required: "Name is required" })}
                            placeholder="e.g., Smart Watches"
                        />
                        {editForm.formState.errors.name && (
                            <p className="text-red-500 text-sm">{editForm.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-sub-image">Cover Image</Label>
                        <ControlledFileUpload
                            control={editForm.control}
                            name="coverImage"
                            errors={editForm.formState.errors}
                            allowedMimeType={['image/jpeg', 'image/png', 'image/webp']}
                            folderPath="subcategory_images"
                        />
                        {editForm.formState.errors.coverImage && (
                            <p className="text-red-500 text-sm">Image is required.</p>
                        )}
                    </div>

                    {/* Popular Flag */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="edit-sub-popular">Mark as Popular</Label>
                        <Controller
                            name="isPopular"
                            control={editForm.control}
                            render={({ field }) => (
                                <Switch
                                    id="edit-sub-popular"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* New Flag */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="edit-sub-new">Mark as New</Label>
                        <Controller
                            name="isNewSub"
                            control={editForm.control}
                            render={({ field }) => (
                                <Switch
                                    id="edit-sub-new"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubcategory} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================
export const DeleteSubcategoryModal = ({ isOpen, onOpenChange, deleteIds, onConfirm }) => {
    const isMultiple = Array.isArray(deleteIds) && deleteIds.length > 1

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete {isMultiple ? "these subcategories" : "this subcategory"}. 
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm} 
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}