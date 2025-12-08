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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Upload,
    Image as ImageIcon,
    Link2,
    CheckCircle2,
    Loader2,
    X,
    Save,
    Store,
    Type,
    Calendar as CalendarIcon,
    Smartphone,
    Video,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { VendorSelectField } from "@/components/common/VendorSelectField";
import { updateBannerAction } from "@/app/actions/admin/banner";
import { MultiSelect } from "@/components/common/MultiSelect";
import { getCategoriesWithVendors } from "@/app/actions/public/categories";

export default function EditBannerModal({
    open,
    onOpenChange,
    banner,
    onSuccess
}) {
    const [isVendorSpecific, setIsVendorSpecific] = useState(banner?.isVendorSpecific ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placementOptions, setPlacementOptions] = useState([
        { label: "Hero Section", value: "Hero Section" },
        { label: "Homepage Carousel", value: "Homepage Carousel" },
        { label: "Contact Page", value: "Contact" },
        { label: "Ideas Page", value: "Ideas" },
        { label: "Gallery Page", value: "Gallery" },
        { label: "Blog Page", value: "Blog Page" },
    ]);

    const methods = useForm({
        defaultValues: {
            imageUrl: banner?.imageUrl || "",
            name: banner?.name || "",
            placement: banner?.placement || ["Homepage Carousel"],
            vendor: banner?.vendor?._id || banner?.vendor || "",
            customUrl: banner?.customUrl || "",
            isVendorSpecific: banner?.isVendorSpecific ?? true,
            status: banner?.status || "Active",
            title: banner?.title || "",
            tagline: banner?.tagline || "",
            mobileImageUrl: banner?.mobileImageUrl || "",
            activeFrom: banner?.activeFrom ? new Date(banner.activeFrom) : undefined,
            activeUntil: banner?.activeUntil ? new Date(banner.activeUntil) : undefined,
            showOverlay: banner?.showOverlay ?? true,
            displayMode: banner?.displayMode || "standard",
            mediaType: banner?.mediaType || "image",
            videoUrl: banner?.videoUrl || "",
            showTitle: banner?.showTitle ?? true,
        },
    });

    const {
        control,
        register,
        setValue,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = methods;

    const activeFrom = watch("activeFrom");
    const activeUntil = watch("activeUntil");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesWithVendors();
                if (response?.categories) {
                    const categoryOptions = response.categories.flatMap((cat) => {
                        const options = [
                            { label: `Category: ${cat.name}`, value: `Category: ${cat.name}` },
                        ];

                        if (cat.subCategories && cat.subCategories.length > 0) {
                            cat.subCategories.forEach((sub) => {
                                options.push({
                                    label: `Subcategory: ${cat.name} > ${sub.name}`,
                                    value: `Subcategory: ${cat.name} > ${sub.name}`,
                                });
                            });
                        }
                        return options;
                    });

                    setPlacementOptions((prev) => {
                        // Filter out existing category/subcategory options to avoid duplicates if re-fetching
                        const staticOptions = prev.filter(p => !p.value.startsWith("Category") && !p.value.startsWith("Subcategory"));
                        return [...staticOptions, ...categoryOptions];
                    });
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Reset form when banner changes
    useEffect(() => {
        if (banner) {
            reset({
                imageUrl: banner.imageUrl || "",
                name: banner.name || "",
                placement: banner.placement || ["Homepage Carousel"],
                vendor: banner.vendor?._id || banner.vendor || "",
                customUrl: banner.customUrl || "",
                isVendorSpecific: banner.isVendorSpecific ?? true,
                status: banner.status || "Active",
                title: banner.title || "",
                tagline: banner.tagline || "",
                mobileImageUrl: banner.mobileImageUrl || "",
                activeFrom: banner.activeFrom ? new Date(banner.activeFrom) : undefined,
                activeUntil: banner.activeUntil ? new Date(banner.activeUntil) : undefined,
                showOverlay: banner.showOverlay ?? true,
                displayMode: banner.displayMode || "standard",
                mediaType: banner.mediaType || "image",
                videoUrl: banner.videoUrl || "",
                showTitle: banner.showTitle ?? true,
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

        // Custom URL is now optional
        // if (!data.isVendorSpecific && !data.customUrl) {
        //     toast.error("Please provide a custom URL");
        //     return;
        // }

        // Validate dates
        if (data.activeFrom && data.activeUntil && new Date(data.activeFrom) > new Date(data.activeUntil)) {
            toast.error("Active From date must be before Active Until date");
            return;
        }

        // Validate video
        if (data.mediaType === "video" && !data.videoUrl) {
            toast.error("Please upload a video file");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = { ...data };

            const result = await updateBannerAction(banner._id, payload);

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

    const selectedPlacement = watch("placement") || [];
    const isHeroOrCarousel = selectedPlacement.some(p => p === "Hero Section" || p === "Homepage Carousel");

    // Auto-hide/disable title fields for Hero/Carousel
    useEffect(() => {
        if (isHeroOrCarousel) {
            setValue("showTitle", false);
            setValue("showOverlay", false);
        }
    }, [isHeroOrCarousel, setValue]);

    const getIdealSizeText = () => {
        if (selectedPlacement.includes("Hero Section")) return "Recommended: 1920x1080px (Desktop), 1080x1920px (Mobile)";
        if (selectedPlacement.includes("Homepage Carousel")) return "Recommended: 1300x500px (Standard)";
        if (selectedPlacement.some(p => ["Contact", "Ideas", "Gallery", "Blog Page"].includes(p))) return "Recommended: 1920x400px (Desktop), 800x260px (Mobile)";
        return "Recommended: Depends on layout (e.g. 1080x1080px for square)";
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
                            {/* Media Type & Uploads */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-purple-500 rounded-full" />
                                    <h3 className="!text-base !tracking-wide uppercase font-semibold">Media & Assets</h3>
                                </div>

                                {/* Media Type Selection */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700">
                                        Media Type
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                            <input
                                                type="radio"
                                                value="image"
                                                {...register("mediaType")}
                                                className="peer sr-only"
                                            />
                                            <ImageIcon className="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-500" />
                                            <span className="font-semibold text-gray-700 peer-checked:text-blue-700">Image Banner</span>
                                        </label>

                                        <label className="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                            <input
                                                type="radio"
                                                value="video"
                                                {...register("mediaType")}
                                                className="peer sr-only"
                                            />
                                            <Video className="w-8 h-8 mb-2 text-gray-500 peer-checked:text-blue-500" />
                                            <span className="font-semibold text-gray-700 peer-checked:text-blue-700">Video Banner</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        {watch("mediaType") === "video" ? "Video Poster / Fallback Image" : "Banner Image"}
                                        <Badge variant="outline" className="text-xs">
                                            {getIdealSizeText()}
                                        </Badge>
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <ControlledFileUpload
                                            control={control}
                                            name="imageUrl"
                                            label={watch("mediaType") === "video" ? "Upload poster image" : "Upload banner image"}
                                            allowedMimeType={[
                                                "image/png",
                                                "image/jpg",
                                                "image/jpeg",
                                                "image/webp",
                                            ]}
                                            folderPath="ad-banners"
                                            errors={errors}
                                            role="admin"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {watch("mediaType") === "video"
                                            ? "Displayed while video loads or on unsupported devices."
                                            : "Main banner image displayed on the website."}
                                    </p>
                                </div>

                                {/* Video Upload - Conditional */}
                                {watch("mediaType") === "video" && (
                                    <div className="space-y-3 pt-2">
                                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="p-1 bg-red-100 rounded text-red-600">
                                                <Video className="w-3 h-3" />
                                            </div>
                                            Video File
                                            <Badge variant="outline" className="text-xs">
                                                MP4/WebM (Max 20MB)
                                            </Badge>
                                        </Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                            <ControlledFileUpload
                                                control={control}
                                                name="videoUrl"
                                                label="Upload video file"
                                                allowedMimeType={[
                                                    "video/mp4",
                                                    "video/webm",
                                                ]}
                                                folderPath="ad-banners/videos"
                                                errors={errors}
                                                role="admin"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-green-50 text-green-700 border-green-200"
                                            >
                                                Multi-select
                                            </Badge>
                                        </Label>
                                        <MultiSelect
                                            options={placementOptions}
                                            selected={watch("placement") || []}
                                            onChange={(selected) => setValue("placement", selected)}
                                            placeholder="Select pages to display banner..."
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Page Title & Tagline */}
                            {!isHeroOrCarousel && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-1 bg-orange-500 rounded-full" />
                                        <h3 className="uppercase !text-base !tracking-wide font-semibold">Page Title & Tagline</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700">
                                                Page Title
                                            </Label>
                                            <Input
                                                id="edit-title"
                                                {...register("title")}
                                                placeholder="e.g., Find Your Dream Venue"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-tagline" className="text-sm font-semibold text-gray-700">
                                                Tagline
                                            </Label>
                                            <Textarea
                                                id="edit-tagline"
                                                {...register("tagline")}
                                                placeholder="e.g., Discover the best wedding venues in your area"
                                                className="min-h-[44px]"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                                            <Checkbox
                                                id="edit-showOverlay"
                                                checked={watch("showOverlay")}
                                                onCheckedChange={(checked) => setValue("showOverlay", !!checked)}
                                            />
                                            <Label
                                                htmlFor="edit-showOverlay"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Show Title & Overlay
                                            </Label>
                                        </div>
                                        <div className="md:col-span-2 flex items-center space-x-2">
                                            <Checkbox
                                                id="edit-showTitle"
                                                checked={watch("showTitle")}
                                                onCheckedChange={(checked) => setValue("showTitle", !!checked)}
                                            />
                                            <Label
                                                htmlFor="edit-showTitle"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Show Page Heading (H1)
                                            </Label>
                                        </div>
                                        {/* Display Mode Selection */}
                                        <div className="md:col-span-2 space-y-3 pt-4 border-t">
                                            <Label className="text-sm font-semibold text-gray-700">
                                                Display Mode
                                            </Label>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <input
                                                        type="radio"
                                                        id="edit-displayMode-standard"
                                                        value="standard"
                                                        {...register("displayMode")}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor="edit-displayMode-standard" className="font-medium cursor-pointer">
                                                            Standard (Fixed Height)
                                                        </Label>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Desktop: 1920x400px | Mobile: 800x512px - Image will be cropped to fit
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <input
                                                        type="radio"
                                                        id="edit-displayMode-auto"
                                                        value="auto"
                                                        {...register("displayMode")}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor="edit-displayMode-auto" className="font-medium cursor-pointer">
                                                            Full View (Auto Height)
                                                        </Label>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Any aspect ratio (e.g., 1080x1080px) - Full image will be shown
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Schedule & Mobile */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-green-500 rounded-full" />
                                    <h3 className="uppercase !text-base !tracking-wide font-semibold">Schedule & Mobile</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Active From</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-11",
                                                        !activeFrom && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {activeFrom ? format(activeFrom, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={activeFrom}
                                                    onSelect={(date) => setValue("activeFrom", date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Active Until</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-11",
                                                        !activeUntil && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {activeUntil ? format(activeUntil, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={activeUntil}
                                                    onSelect={(date) => setValue("activeUntil", date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4" />
                                        Mobile Banner Image (Optional)
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <ControlledFileUpload
                                            control={control}
                                            name="mobileImageUrl"
                                            label="Upload mobile version (optional)"
                                            allowedMimeType={[
                                                "image/png",
                                                "image/jpg",
                                                "image/jpeg",
                                                "image/webp",
                                            ]}
                                            folderPath="ad-banners/mobile"
                                            errors={errors}
                                            role="admin"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        If not provided, the desktop image will be used on mobile devices.
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
                                            {/* Select Vendor */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    Select Vendor
                                                    <Badge variant="outline" className="text-xs">
                                                        Required
                                                    </Badge>
                                                </Label>
                                                <VendorSelectField
                                                    name="vendor"
                                                    placeholder="Search to select a vendor..."
                                                    valueKey="_id"
                                                    required={true}
                                                    initialVendor={typeof banner?.vendor === 'object' ? banner.vendor : null}
                                                />
                                                <p className="text-xs text-gray-600 flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Select the vendor this banner should link to
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Link2 className="w-4 h-4" />
                                                Custom Destination URL
                                                <Badge variant="outline" className="text-xs">
                                                    Optional
                                                </Badge>
                                            </Label>
                                            <Input
                                                {...register("customUrl")}
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

                    <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
                </FormProvider>
            </DialogContent>
        </Dialog >
    );
}