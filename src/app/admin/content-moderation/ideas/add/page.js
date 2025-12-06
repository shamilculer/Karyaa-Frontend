"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X, ChevronLeft, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { createIdeaAction } from "@/app/actions/admin/ideas";
import { getAllIdeaCategoriesAction } from "@/app/actions/public/ideas";

// Schema
const ideaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).optional(),
});

export default function AddIdeaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageList, setImageList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      images: [],
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAllIdeaCategoriesAction();
        if (res.success) {
          setCategories(res.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error loading categories");
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleImageUpload = (urls) => {
    const newUrls = Array.isArray(urls) ? urls : [urls];
    const updated = [...imageList, ...newUrls];
    setImageList(updated);
    setValue("images", updated);
  };

  const removeImage = (url) => {
    const updated = imageList.filter((img) => img !== url);
    setImageList(updated);
    setValue("images", updated);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        gallery: imageList,
      };

      const result = await createIdeaAction(payload);

      if (result.success) {
        toast.success("Idea created successfully");
        router.push("/admin/content-moderation/ideas");
      } else {
        toast.error(result.message || "Failed to create idea");
      }
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-slate-100"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Idea</h1>
          <p className="text-slate-500 mt-1">Create a new inspiration idea for users</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the core details about this idea
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <Input
                    placeholder="e.g., Modern Living Room Design"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    placeholder="Describe the idea, style, and key elements..."
                    className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Images</CardTitle>
                <CardDescription>
                  Upload images for this idea
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {imageList.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-50 group">
                      <Image
                        src={url}
                        alt={`Idea image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <ControlledFileUpload
                    control={control}
                    name="images"
                    label="Upload Images"
                    folderPath="ideas/gallery"
                    allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                    onSuccess={(url) => handleImageUpload(url)}
                    multiple={true}
                    isPublic={false}
                    role="admin"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Idea"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
