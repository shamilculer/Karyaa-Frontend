"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Upload,
    Image as ImageIcon,
    Link2,
    CheckCircle2,
    Loader2,
    X,
    Save,
    Store,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { VendorSelectField } from "@/components/common/VendorSelectField";
import { updateBannerAction } from "@/app/actions/admin/banner";

export default function EditBannerModal({
    open,
    onOpenChange,
    banner,
    onSuccess
}) {
    const [isVendorSpecific, setIsVendorSpecific] = useState(banner?.isVendorSpecific ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm({
        defaultValues: {
            imageUrl: banner?.imageUrl || "",
            name: banner?.name || "",
            placement: banner?.placement || ["Homepage Carousel"],
            vendor: banner?.vendor || "",
            customUrl: banner?.customUrl || "",
            isVendorSpecific: banner?.isVendorSpecific ?? true,
            status: banner?.status || "Active",
        },
    });

    const {
        control,
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = methods;

    // Reset form when banner changes
    useEffect(() => {
        if (banner) {
            console.log('EditBannerModal - Banner data:', {
                _id: banner._id,
                vendor: banner.vendor,
                businessName: banner.businessName,
                businessLogo: banner.businessLogo,
                isVendorSpecific: banner.isVendorSpecific,
                fullBanner: banner
            });
            
            reset({
                imageUrl: banner.imageUrl || "",
                name: banner.name || "",
                placement: banner.placement || ["Homepage Carousel"],
                vendor: banner.vendor || "",
                customUrl: banner.customUrl || "",
                isVendorSpecific: banner.isVendorSpecific ?? true,
                status: banner.status || "Active",
            });
            setIsVendorSpecific(banner.isVendorSpecific ?? true);
        }
    }, [banner, reset]);

    const onSubmit = async (data) => {
        // Validate vendor if vendor-specific
        if (data.isVendorSpecific && !data.vendor) {
            toast.error("Please select a vendor");
            return;
        }

        // Validate custom URL if not vendor-specific
        if (!data.isVendorSpecific && !data.customUrl) {
            toast.error("Please provide a custom URL");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await updateBannerAction(banner._id, data);

            if (result?.success) {
                toast.success("Banner updated successfully!");
                onSuccess?.(result.data); // Pass updated data to parent
                onOpenChange(false); // Close modal
            } else {
                toast.error(result?.message || "Failed to update banner");
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isDirty && !isSubmitting) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to close?"
            );
            if (!confirmed) return;
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl h-[95vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold"> Edit Banner </DialogTitle>
                                <DialogDescription className="text-sm mt-1"> Update banner details and configuration </DialogDescription>
                            </div>
                        </div> <Badge className={banner?.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}>
                            {banner?.status} </Badge>
                    </div> </DialogHeader>
                <Separator className="shrink-0" />
                <FormProvider {...methods}> <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0"> {/* Scrollable Content */}
                    <ScrollArea className="flex-1 h-[calc(90vh-185px)] px-6">
                        <div className="space-y-11 py-4 pr-4">
                            {/* Banner Preview */}
                            {banner?.imageUrl && (
                                <div className="space-y-2">
                                    <Label className="text-sm uppercase font-semibold text-gray-700">
                                        Current Banner
                                    </Label>
                                    <div className="relative w-full aspect-[16/5] rounded-lg overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Basic Details */}
                            <div className="space-y-4 ">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                    <h3 className="!text-base !tracking-wide uppercase font-semibold">Basic Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="edit-name"
                                            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                        >
                                            Banner Name
                                            <Badge variant="outline" className="text-xs">
                                                Required
                                            </Badge>
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            {...register("name", { required: "Banner name is required" })}
                                            placeholder="e.g., Summer Wedding Expo 2024"
                                            className="h-11"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="edit-placement"
                                            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                        >
                                            Placement Location
                                        </Label>
                                        <select
                                            id="edit-placement"
                                            className="border border-gray-300 w-full h-11 px-3 rounded-md focus:ring-2 focus:ring-blue-500"
                                            {...register("placement")}
                                            onChange={(e) => setValue("placement", [e.target.value])}
                                        >
                                            <option value="Homepage Carousel">Homepage Carousel</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Banner Image Upload */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-purple-500 rounded-full" />
                                    <h3 className="uppercase !text-base !tracking-wide font-semibold">Banner Image</h3>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Update Banner Image
                                        <Badge variant="outline" className="text-xs">
                                            1300x400 recommended
                                        </Badge>
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <ControlledFileUpload
                                            control={control}
                                            name="imageUrl"
                                            label="Click to upload new image"
                                            allowedMimeType={[
                                                "image/png",
                                                "image/jpg",
                                                "image/jpeg",
                                                "image/webp",
                                            ]}
                                            folderPath="ad-banners"
                                            errors={errors}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Leave empty to keep current image
                                    </p>
                                </div>
                            </div>

                            {/* Target Configuration */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-green-500 rounded-full" />
                                    <h3 className="uppercase !text-base !tracking-wide font-semibold">Target Configuration</h3>
                                </div>

                                {/* Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="edit-vendor-toggle"
                                            checked={isVendorSpecific}
                                            onCheckedChange={(checked) => {
                                                setIsVendorSpecific(!!checked);
                                                setValue("isVendorSpecific", !!checked);
                                                if (checked) {
                                                    setValue("customUrl", "");
                                                } else {
                                                    setValue("vendor", "");
                                                }
                                            }}
                                            className="w-5 h-5"
                                        />
                                        <Label
                                            htmlFor="edit-vendor-toggle"
                                            className="font-semibold cursor-pointer text-gray-800 flex items-center gap-2"
                                        >
                                            <Store className="w-4 h-4" />
                                            Link to Vendor Profile
                                        </Label>
                                    </div>
                                    <Badge className={isVendorSpecific ? "bg-blue-500" : "bg-gray-400"}>
                                        {isVendorSpecific ? "Enabled" : "Disabled"}
                                    </Badge>
                                </div>

                                {/* Conditional Fields */}
                                <div className="min-h-[100px]">
                                    {isVendorSpecific ? (
                                        <div className="space-y-4">
                                            {/* Current Vendor Display */}
                                            {banner?.vendor && banner?.businessName && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">
                                                        Current Vendor
                                                    </Label>
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        {banner?.businessLogo && (
                                                            <Image 
                                                                src={banner.businessLogo} 
                                                                width={48} 
                                                                height={48} 
                                                                alt={banner.businessName} 
                                                                className="object-cover rounded-full size-12" 
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{banner.businessName}</p>
                                                            <p className="text-xs text-gray-600">Currently linked vendor</p>
                                                        </div>
                                                        <Badge className="bg-blue-500">Active</Badge>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Select New Vendor */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    Change Vendor (Optional)
                                                </Label>
                                                <VendorSelectField
                                                    name="newVendor"
                                                    placeholder="Search to select a different vendor..."
                                                    valueKey="_id"
                                                    required={false}
                                                    initialVendor={null}
                                                />
                                                <p className="text-xs text-gray-600 flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Leave empty to keep current vendor, or select a new one to replace
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Link2 className="w-4 h-4" />
                                                Custom Destination URL
                                                <Badge variant="outline" className="text-xs">
                                                    Required
                                                </Badge>
                                            </Label>
                                            <Input
                                                {...register("customUrl", {
                                                    required: !isVendorSpecific ? "Custom URL is required" : false,
                                                })}
                                                placeholder="https://example.com/campaign"
                                                className="h-11"
                                            />
                                            {errors.customUrl && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                    {errors.customUrl.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </ScrollArea>

                    <Separator className="shrink-0" />

                    {/* Fixed Footer */}
                    <DialogFooter className="px-6 py-4 shrink-0">
                        <div className="flex items-center justify-between w-full">
                            <p className="text-xs text-gray-500">
                                {isDirty ? "You have unsaved changes" : "No changes made"}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isDirty}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}