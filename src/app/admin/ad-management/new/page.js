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

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { VendorSelectField } from "@/components/common/VendorSelectField";
import { MultiSelect } from "@/components/common/MultiSelect";
import {
  Upload,
  Image as ImageIcon,
  Link2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddBannerPage() {
  const router = useRouter();
  const [isVendorSpecific, setIsVendorSpecific] = useState(true);
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
      imageUrl: "",
      name: "",
      placement: ["Homepage Carousel"],
      vendor: "",
      customUrl: "",
      isVendorSpecific: true,
      status: "Active",
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