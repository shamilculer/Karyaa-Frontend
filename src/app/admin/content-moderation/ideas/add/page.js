"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";

import ControlledFileUpload from "@/components/common/ControlledFileUploads";

import { createIdeaAction } from "@/app/actions/admin/ideas";
import Image from "next/image";

const allowedCategories = [
  "Engagement & Proposal Events",
  "Baby Showers & Gender Reveals",
  "Birthdays & Anniversaries",
  "Graduation Celebrations",
  "Corporate Events",
  "Private Parties",
  "Product Launches & Brand Events",
  "Cultural & Festival Events",
];

// ✅ Zod Schema
const ideaSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is too short"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).optional(),
});

export default function AddIdeaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageList, setImageList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
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

  // ✅ Handle image uploads (supports both single and multiple)
  const handleImageUpload = (url) => {
    // Handle both single URL and array of URLs
    const newUrls = Array.isArray(url) ? url : [url];
    const updated = [...imageList, ...newUrls];
    setImageList(updated);
    setValue("images", updated);
  };

  // ✅ Remove image
  const removeImage = (url) => {
    const updated = imageList.filter((img) => img !== url);
    setImageList(updated);
    setValue("images", updated);
  };

  // ✅ Submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = { ...data, images: imageList };
    const res = await createIdeaAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message || "Idea created successfully!");
      reset();
      setImageList([]);
      router.push("/admin/content-moderation/ideas");
    } else {
      toast.error(res.message || "Failed to create idea.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Add New Idea
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Title</label>
              <Input
                placeholder="Enter idea title"
                {...register("title")}
                className={errors.title && "border-red-500"}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Description</label>
              <Textarea
                placeholder="Write about this idea..."
                {...register("description")}
                className={`h-56 ${errors.description && "border-red-500"}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category (SELECT) */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.category && "border-red-500"}`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Gallery Upload */}
            <div className="space-y-3">
              <label className="font-medium text-sm">Gallery Images</label>

              <div className="flex flex-wrap gap-4">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-28 h-28 border rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={img}
                      width={112}
                      height={112}
                      alt={`Idea Image ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <div className="w-28 h-28 flex items-center justify-center border rounded-lg bg-gray-50 hover:bg-gray-100">
                  <ControlledFileUpload
                    control={control}
                    name="upload"
                    label="Upload"
                    folderPath="admin/ideas/gallery"
                    allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                    errors={errors}
                    onSuccess={(url) => handleImageUpload(url)}
                    multiple={true}
                    isPublic={false}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Create Idea"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
