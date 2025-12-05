"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { createBannerAction } from "@/app/actions/admin/banner";
import { getCategoriesWithVendors } from "@/app/actions/public/categories";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { VendorSelectField } from "@/components/common/VendorSelectField";
import { MultiSelect } from "@/components/common/MultiSelect";
import {
  Upload,
  Image as ImageIcon,
  Link2,
  CheckCircle2,
  ArrowLeft,
  Type,
  Calendar as CalendarIcon,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddBannerPage() {
  const router = useRouter();
  const [isVendorSpecific, setIsVendorSpecific] = useState(true);
  const [placementOptions, setPlacementOptions] = useState([
    { label: "Hero Section", value: "Hero Section" },
    { label: "Homepage Carousel", value: "Homepage Carousel" },
    { label: "Karyaa Recommends", value: "Karyaa Recommends" },
    { label: "Ideas Page", value: "Ideas" },
    { label: "Gallery Page", value: "Gallery" },
    { label: "Blog Page", value: "Blog Page" },
  ]);

  const methods = useForm({
    defaultValues: {
      imageUrl: "",
      name: "",
      placement: ["Homepage Carousel"],
      vendor: "",
      customUrl: "",
      isVendorSpecific: true,
      status: "Active",
      title: "",
      tagline: "",
      mobileImageUrl: "",
      activeFrom: undefined,
      activeUntil: undefined,
      showOverlay: true,
      displayMode: "standard",
      mediaType: "image",
      videoUrl: "",
    },
  });

  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
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

  const onSubmit = async (data) => {
    // Validate placement
    if (!data.placement || data.placement.length === 0) {
      toast.error("Please select at least one placement location");
      return;
    }

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

    // Validate dates
    if (data.activeFrom && data.activeUntil && new Date(data.activeFrom) > new Date(data.activeUntil)) {
      toast.error("Active From date must be before Active Until date");
      return;
    }

    try {
      const result = await createBannerAction(data);
      if (result?.success) {
        toast.success(result?.message || "Banner has been added successfully.");
        reset();
        router.push("/admin/ad-management");
      } else {
        toast.error(result?.message || "Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Server error occurred.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="dashboard-container space-y-4">
        {/* Header Section */}
        <div className="space-y-4 flex gap-4 items-center">
          <Button
            onClick={() => router.back()}
            variant={"ghost"}
            className="border rounded-full p-2 h-auto"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h4 className="uppercase text-2xl font-bold">Upload New Ad Banner</h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Details Card */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Banner Details
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Configure your banner's basic information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Banner Name
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Banner name is required" })}
                    placeholder="e.g., Summer Wedding Expo 2024"
                    className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                    htmlFor="placement"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Placement Location(s)
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
                  <p className="text-xs text-gray-500">
                    Select one or more pages where this banner should appear.
                  </p>
                </div>
              </div>

              {/* Banner Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Banner Image
                  <Badge variant="outline" className="text-xs">
                    1300x400 recommended
                  </Badge>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <ControlledFileUpload
                    control={control}
                    name="imageUrl"
                    label="Click to upload or drag and drop"
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
                  Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)
                </p>
              </div>

              {/* Media Type Selection */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-semibold text-gray-700">
                  Media Type
                </Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mediaType-image"
                      value="image"
                      {...register("mediaType")}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="mediaType-image" className="cursor-pointer font-normal">
                      Image
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mediaType-video"
                      value="video"
                      {...register("mediaType")}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="mediaType-video" className="cursor-pointer font-normal">
                      Video
                    </Label>
                  </div>
                </div>
              </div>
              {/* Conditional Video Upload */}
              {watch("mediaType") === "video" && (
                <div className="space-y-3 pt-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Video File
                    <Badge variant="outline" className="text-xs">
                      MP4 recommended (Max 20MB)
                    </Badge>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <ControlledFileUpload
                      control={control}
                      name="videoUrl"
                      label="Click to upload video"
                      allowedMimeType={[
                        "video/mp4",
                        "video/webm",
                      ]}
                      folderPath="ad-banners/videos"
                      errors={errors}
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Supported formats: MP4, WebM (Max 20MB). Image will be used as poster/fallback.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Page Title & Tagline Card */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Type className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Page Title & Tagline
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Optional text to display over the banner
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Page Title
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g., Find Your Dream Venue"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-sm font-semibold text-gray-700">
                    Tagline
                  </Label>
                  <Textarea
                    id="tagline"
                    {...register("tagline")}
                    placeholder="e.g., Discover the best wedding venues in your area"
                    className="min-h-[44px]"
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="showOverlay"
                    checked={watch("showOverlay")}
                    onCheckedChange={(checked) => setValue("showOverlay", !!checked)}
                  />
                  <Label
                    htmlFor="showOverlay"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show Title & Overlay
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
                        id="displayMode-standard"
                        value="standard"
                        {...register("displayMode")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="displayMode-standard" className="font-medium cursor-pointer">
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
                        id="displayMode-auto"
                        value="auto"
                        {...register("displayMode")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="displayMode-auto" className="font-medium cursor-pointer">
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
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                If left empty, the default page title and tagline will be used.
              </p>
            </CardContent>
          </Card>

          {/* Schedule & Mobile Card */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Schedule & Mobile
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Set activation dates and mobile-specific image
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile Banner Image (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
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
                  />
                </div>
                <p className="text-xs text-gray-500">
                  If not provided, the desktop image will be used on mobile devices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Target Options Card */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Link2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Target Configuration
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Choose where this banner should redirect users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Toggle Checkbox */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="vendor-toggle"
                    checked={isVendorSpecific}
                    onCheckedChange={(checked) => {
                      setIsVendorSpecific(!!checked);
                      setValue("isVendorSpecific", !!checked);
                      // Clear the other field when switching
                      if (checked) {
                        setValue("customUrl", "");
                      } else {
                        setValue("vendor", "");
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <Label
                    htmlFor="vendor-toggle"
                    className="font-semibold cursor-pointer text-gray-800 flex items-center gap-2"
                  >
                    Link to Vendor Profile
                  </Label>
                </div>
                <Badge
                  className={isVendorSpecific ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-900"}
                >
                  {isVendorSpecific ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              {/* Conditional Fields */}
              <div className="min-h-[120px]">
                {isVendorSpecific ? (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      Select Vendor
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    </Label>
                    <VendorSelectField
                      name="vendor"
                      placeholder="Search and select a vendor..."
                      valueKey="_id" // Use "_id" or "slug" depending on your needs
                      required={isVendorSpecific}
                    />
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Banner will redirect to the selected vendor's profile page
                    </p>
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
                      className="h-11 border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.customUrl && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.customUrl.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Enter the full URL where users should be redirected
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hidden Status Field */}
          <input type="hidden" {...register("status")} value="Active" />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold "
            >
              <Upload className="w-5 h-5 mr-2" />
              Create Banner Campaign
            </Button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Your banner will be reviewed and activated within 24 hours
            </p>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}