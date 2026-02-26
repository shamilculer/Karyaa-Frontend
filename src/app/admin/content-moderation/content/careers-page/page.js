"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Loader2, Eye, Plus, Trash2, GripVertical, Image as ImageIcon, Video, Type, SplitSquareHorizontal, MoveUp, MoveDown, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { deleteS3FilesAction } from "@/app/actions/s3-upload";

const CareersPageEditor = () => {
    const router = useRouter();
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            isActive: true, // Master toggle for the entire careers page
            bannerHeading: "",
            bannerTagline: "",
            bannerType: "image", // image, video
            bannerImage: "",
            bannerVideo: "",
        },
    });

    const [collapsedState, setCollapsedState] = useState({});

    // Track image/video URLs removed during this session for S3 cleanup on save
    const removedUrls = useRef([]);

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const bannerType = watch("bannerType");

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const result = await getContentByKeyAction("careers-page");

            if (result.success && result.data?.content) {
                const parsedContent = typeof result.data.content === 'string'
                    ? JSON.parse(result.data.content)
                    : result.data.content;

                // Set Banner values
                setValue("isActive", parsedContent.isActive !== undefined ? parsedContent.isActive : true);
                setValue("bannerHeading", parsedContent.bannerHeading || "");
                setValue("bannerTagline", parsedContent.bannerTagline || "");
                setValue("bannerType", parsedContent.bannerType || "image");
                setValue("bannerImage", parsedContent.bannerImage || "");
                setValue("bannerVideo", parsedContent.bannerVideo || "");
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load careers page content");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            // Capture removed URLs before clearing the ref
            const urlsToDelete = [...removedUrls.current];

            // Run S3 cleanup + DB save in parallel
            await Promise.all([
                upsertContentAction("careers-page", {
                    type: "section",
                    content: JSON.stringify(data)
                }),
                // Best-effort S3 cleanup — errors are logged inside the action
                urlsToDelete.length > 0 ? deleteS3FilesAction(urlsToDelete) : Promise.resolve(),
            ]).then(([result]) => {
                if (!result.success) {
                    throw new Error(result.message || "Failed to save careers page content");
                }
                // Clear the ref after a successful save
                removedUrls.current = [];
                toast.success("Careers page content saved successfully!");
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save careers page content");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container !pt-0">
            {/* Header */}
            <div className="border-b border-gray-200 sticky left-0 top-0 z-50 bg-white">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="!rounded-full bg-gray-300"
                                onClick={() => router.push("/admin/content-moderation/content")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Careers Page Editor</span>
                                <p className="!text-sm text-gray-500">Customize your careers page and job postings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open("/careers", "_blank")}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                            <Button type="submit" form="careers-page-form" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
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
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <form id="careers-page-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-6xl mx-auto pb-12">

                    {/* Page Configuration */}
                    <div className="mb-10">
                        <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" defaultValue="page-config">
                            <AccordionItem value="page-config" className="border-0">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-xl font-semibold text-gray-800">Page Configuration</span>
                                        <span className="!text-sm font-normal text-gray-500">Configure the heading, tagline, and background media for the top banner</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    <div className="space-y-6 pt-2 border-t border-gray-100">
                                        <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-gray-900 font-semibold">Enable Careers Page</Label>
                                                <p className="text-sm text-gray-500">Toggle this to make the Careers Page public or hide it from users.</p>
                                            </div>
                                            <Controller
                                                name="isActive"
                                                control={control}
                                                render={({ field }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange(!field.value)}
                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${field.value ? 'bg-primary' : 'bg-gray-200'}`}
                                                        role="switch"
                                                        aria-checked={field.value}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${field.value ? 'translate-x-5' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bannerHeading" className="text-gray-700 font-medium">Banner Heading</Label>
                                            <Input
                                                id="bannerHeading"
                                                placeholder="Join Our Team"
                                                className="h-10 border-gray-300 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                                {...register("bannerHeading")}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bannerTagline" className="text-gray-700 font-medium">Banner Tagline</Label>
                                            <Textarea
                                                id="bannerTagline"
                                                placeholder="Discover exciting career opportunities with us..."
                                                className="h-20 resize-none border-gray-300 focus:border-primary focus:ring-primary/20 transition-all"
                                                {...register("bannerTagline")}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">Media Type</Label>
                                                <Controller
                                                    name="bannerType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="h-10 border-gray-300 focus:border-primary focus:ring-primary/20 transition-all">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="image">Image</SelectItem>
                                                                <SelectItem value="video">Video</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">
                                                    {bannerType === 'video' ? 'Upload Video (MP4/WebM)' : 'Upload Low-Res Image'}
                                                </Label>
                                                <div className="bg-gray-50/50 p-1 rounded-xl border border-dashed border-gray-300 hover:border-primary/50 transition-colors">
                                                    {bannerType === 'video' ? (
                                                        <ControlledFileUpload
                                                            control={control}
                                                            name="bannerVideo"
                                                            label="Upload Banner Video"
                                                            errors={errors}
                                                            allowedMimeType={["video/mp4", "video/webm"]}
                                                            folderPath="pages/careers"
                                                            role="admin"
                                                            isPublic={true}
                                                        />
                                                    ) : (
                                                        <ControlledFileUpload
                                                            control={control}
                                                            name="bannerImage"
                                                            label="Upload Banner Image"
                                                            errors={errors}
                                                            allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                                            folderPath="pages/careers"
                                                            role="admin"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>




                    {/* Bottom Save Button */}
                    <div className="flex justify-end pb-10 mt-8">
                        <Button type="submit" disabled={saving} size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all min-w-[200px]">
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save All Changes
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Bottom Save Button (Mobile) */}
                    <div className="fixed bottom-6 right-6 z-40 bg-white p-2 rounded-full shadow-xl border border-gray-200 md:hidden">
                        <Button type="submit" size="icon" disabled={saving} className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                            {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};
export default CareersPageEditor;
