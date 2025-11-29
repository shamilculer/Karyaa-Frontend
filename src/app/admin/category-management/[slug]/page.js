"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Edit, Star, Users, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  getSingleCategoryDetails,
  updateCategory,
} from "@/app/actions/admin/categories";
import Link from "next/link";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import SubcategorySection from "../../components/modals/category/SubCategoryManage";
import { toast } from "sonner";
import { IconBriefcase } from "@tabler/icons-react";

const SingleCategoryManage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      coverImage: "",
    },
  });

  const coverImageValue = watch("coverImage");

  const fetchCategoryData = useCallback(async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getSingleCategoryDetails(slug);

      if (response.success) {
        setCategory(response.category);
        reset({
          name: response.category.name,
          slug: response.category.slug,
          coverImage: response.category.coverImage,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load category. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, reset]);

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
  }, [slug, fetchCategoryData]);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      const response = await updateCategory(slug, data);

      if (response.success) {
        toast.success(response.message);
        setIsEditing(false);
        router.refresh();
        fetchCategoryData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name: category.name,
      slug: category.slug,
      coverImage: category.coverImage,
    });
  };

  const handleCategoryUpdate = (updatedCategory) => {
    setCategory(updatedCategory);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorUI message={error} onRetry={fetchCategoryData} />;
  }

  if (!category) {
    return <ErrorUI message="Category not found" onRetry={fetchCategoryData} />;
  }

  return (
    <div className="dashboard-container space-y-6 mb-14">
      {console.log(category)}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/category-management">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="!text-2xl !tracking-wide !text-primary/80 font-bold">
              {isEditing ? "Edit Category" : category.name}
            </h1>
            <p className="!text-sm text-gray-500 ">
              Manage category details and subcategories
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Category
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white border-gray-300 shadow-none mt-10">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide text-xl">
            Category Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              <div className="space-y-3">
                <Label>Cover Image</Label>
                {coverImageValue && (
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border-2 border-gray-300 mb-3">
                    <Image
                      src={coverImageValue}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {isEditing && (
                  <ControlledFileUpload
                    control={control}
                    name="coverImage"
                    label="Upload Cover Image"
                    errors={errors}
                    allowedMimeType={[
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                      "image/jpg",
                    ]}
                    folderPath="categories"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    {...control.register("name")}
                    disabled={!isEditing}
                    className="text-lg"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-slug">Slug</Label>
                  <Input
                    id="category-slug"
                    {...control.register("slug")}
                    disabled={!isEditing}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Star className="w-5 h-5" />
                      <span className="text-sm font-medium">Subcategories</span>
                    </div>
                    <p className="!text-5xl font-bold leading-[1.25em] text-purple-700">
                      {category.subCategories?.length || 0}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <IconBriefcase className="w-5 h-5" />
                      <span className="text-sm font-medium">Total Vendors</span>
                    </div>
                    <p className="!text-5xl font-bold leading-[1.25em] text-purple-700">
                      {category.vendorCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <SubcategorySection
        category={category}
        onUpdate={handleCategoryUpdate}
        fetchData={fetchCategoryData}
      />
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="h-full dashboard-container space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-64 rounded-lg" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ErrorUI = ({ message, onRetry }) => {
  return (
    <div className="h-full dashboard-container space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/category-management">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Category Management</h1>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <RefreshCw className="w-10 h-10 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-red-900">
              Failed to Load Category
            </h3>
            <p className="text-red-700 max-w-md">{message}</p>
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleCategoryManage;
