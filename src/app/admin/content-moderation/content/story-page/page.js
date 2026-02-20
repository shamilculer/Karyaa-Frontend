"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Loader2, Eye, Plus, Trash2, GripVertical, Image as ImageIcon, Video, Type, SplitSquareHorizontal, MoveUp, MoveDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const StoryPageEditor = () => {
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
            bannerHeading: "",
            bannerTagline: "",
            bannerType: "image", // image, video
            bannerImage: "",
            bannerVideo: "",
            contentBlocks: [], // Array of modular blocks
        },
    });

    const { fields, append, remove, move, swap, update } = useFieldArray({
        control,
        name: "contentBlocks",
    });

    // We need local state for collapsed status because it's purely UI state, 
    // but persisting it in the form data (even transiently) is often easier to keep in sync with RHF array.
    // However, RHF 'fields' are stable IDs. We can use a local map of ID -> collapsed.
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
            const result = await getContentByKeyAction("story-page");

            if (result.success && result.data?.content) {
                const parsedContent = typeof result.data.content === 'string'
                    ? JSON.parse(result.data.content)
                    : result.data.content;

                // Set Banner values
                setValue("bannerHeading", parsedContent.bannerHeading || "");
                setValue("bannerTagline", parsedContent.bannerTagline || "");
                setValue("bannerType", parsedContent.bannerType || "image");
                setValue("bannerImage", parsedContent.bannerImage || "");
                setValue("bannerVideo", parsedContent.bannerVideo || "");

                // Set Blocks
                if (parsedContent.contentBlocks && Array.isArray(parsedContent.contentBlocks)) {
                    setValue("contentBlocks", parsedContent.contentBlocks);
                }
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load story page content");
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
                upsertContentAction("story-page", {
                    type: "section",
                    content: JSON.stringify(data)
                }),
                // Best-effort S3 cleanup — errors are logged inside the action
                urlsToDelete.length > 0 ? deleteS3FilesAction(urlsToDelete) : Promise.resolve(),
            ]).then(([result]) => {
                if (!result.success) {
                    throw new Error(result.message || "Failed to save story page content");
                }
                // Clear the ref after a successful save
                removedUrls.current = [];
                toast.success("Story page content saved successfully!");
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save story page content");
        } finally {
            setSaving(false);
        }
    };

    const addBlock = (type) => {
        const defaultBlock = {
            split_section: { type: 'split_section', title: "", description: "", image: "", ctaText: "", ctaLink: "" },
            media_section: { type: 'media_section', mediaType: 'image', image: "", video: "" },
            content_section: { type: 'content_section', heading: "", body: "", ctaText: "", ctaLink: "" },
        };
        append(defaultBlock[type]);
    };

    const toggleCollapse = (id) => {
        setCollapsedState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getBlockLabel = (type) => {
        switch (type) {
            case 'split_section': return "Split Section (Image + Text)";
            case 'media_section': return "Media Section";
            case 'content_section': return "Content Section";
            default: return "Unknown Block";
        }
    };

    const getBlockIcon = (type) => {
        switch (type) {
            case 'split_section': return <SplitSquareHorizontal className="w-4 h-4" />;
            case 'media_section': return <ImageIcon className="w-4 h-4" />;
            case 'content_section': return <Type className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="dashboard-container !pt-0">
            {/* Header */}
            <div className="border-b border-gray-200 sticky left-0 top-0 z-50">
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
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Story Page Editor</span>
                                <p className="!text-sm text-gray-500">Customize your story page content</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open("/story", "_blank")}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                            <Button type="submit" form="story-page-form" disabled={saving}>
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
                <form id="story-page-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-6xl mx-auto pb-12">

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
                                        <div className="space-y-2">
                                            <Label htmlFor="bannerHeading" className="text-gray-700 font-medium">Banner Heading</Label>
                                            <Input
                                                id="bannerHeading"
                                                placeholder="Our Story"
                                                className="h-10 border-gray-300 focus:border-primary focus:ring-primary/20 transition-all font-medium"
                                                {...register("bannerHeading")}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bannerTagline" className="text-gray-700 font-medium">Banner Tagline</Label>
                                            <Textarea
                                                id="bannerTagline"
                                                placeholder="A brief tagline about your journey..."
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
                                                            folderPath="pages/story"
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
                                                            folderPath="pages/story"
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

                    {/* Content Blocks */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="!text-2xl font-semibold text-gray-900 flex items-center gap-2">
                                    Page Content
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                                        {fields.length} blocks
                                    </span>
                                </h2>
                                <p className="text-gray-500 !text-sm mt-0.5">Manage your story sections</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="shrink-0 bg-gray-900 text-white hover:bg-gray-800 h-9">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New Section
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem onClick={() => addBlock('split_section')}>
                                            <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                                            Split Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => addBlock('media_section')}>
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Media Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => addBlock('content_section')}>
                                            <Type className="w-4 h-4 mr-2" />
                                            Content Section
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {fields.length === 0 ? (
                            <Card className="border-dashed bg-gray-50/50 border-gray-300">
                                <CardContent className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                            <Type className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-semibold text-lg mb-1">
                                                No content blocks yet
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Start building your story page by adding your first content section.
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="mt-2">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add First Section
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center" className="w-56">
                                                <DropdownMenuItem onClick={() => addBlock('split_section')}>
                                                    <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                                                    Split Section
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => addBlock('media_section')}>
                                                    <ImageIcon className="w-4 h-4 mr-2" />
                                                    Media Section
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => addBlock('content_section')}>
                                                    <Type className="w-4 h-4 mr-2" />
                                                    Content Section
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                <Accordion type="multiple" className="w-full space-y-3">
                                    {fields.map((field, index) => {
                                        return (
                                            <AccordionItem
                                                key={field.id}
                                                value={field.id}
                                                className="border border-gray-200 rounded-md bg-white text-sm overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-all data-[state=open]:ring-1 data-[state=open]:ring-primary/20 data-[state=open]:border-primary/30"
                                            >
                                                <AccordionTrigger className="hover:no-underline py-3 px-3 [&[data-state=open]]:bg-gray-50/50 border-b border-transparent [&[data-state=open]]:border-gray-100">
                                                    <div className="flex items-center gap-4 text-left w-full pr-4">
                                                        <div className="text-gray-300 cursor-move hover:text-gray-500" onClick={(e) => e.stopPropagation()}>
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>

                                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                                                            {getBlockIcon(field.type)}
                                                        </div>

                                                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                                            <h4 className="!text-lg font-semibold uppercase truncate text-gray-800">
                                                                {getBlockLabel(field.type)}
                                                            </h4>
                                                            <div className="flex gap-2 text-xs text-gray-500">
                                                                <span>Block #{index + 1}</span>
                                                                {(field.title || field.heading) && <span>• {field.title || field.heading}</span>}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                                                            <span
                                                                role="button"
                                                                tabIndex={0}
                                                                className={`inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-400 text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors ${index === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    swap(index, index - 1);
                                                                }}
                                                                title="Move Up"
                                                            >
                                                                <ChevronUp className="h-4 w-4" />
                                                            </span>
                                                            <span
                                                                role="button"
                                                                tabIndex={0}
                                                                className={`inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-400 text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors ${index === fields.length - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    swap(index, index + 1);
                                                                }}
                                                                title="Move Down"
                                                            >
                                                                <ChevronDown className="h-4 w-4" />
                                                            </span>

                                                            <div className="w-px h-4 bg-gray-200 mx-1"></div>

                                                            <span
                                                                role="button"
                                                                tabIndex={0}
                                                                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-400 text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (window.confirm("Are you sure you want to delete this block?")) {
                                                                        // Collect image/video URLs by block type for S3 cleanup on save
                                                                        const f = fields[index];
                                                                        if (f?.type === 'split_section' && f.image) {
                                                                            removedUrls.current.push(f.image);
                                                                        } else if (f?.type === 'media_section') {
                                                                            if (f.image) removedUrls.current.push(f.image);
                                                                            if (f.video) removedUrls.current.push(f.video);
                                                                        }
                                                                        remove(index);
                                                                    }
                                                                }}
                                                                title="Delete Block"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="px-6 pb-6 pt-6 bg-gray-50/30 border-t border-gray-100">
                                                    {/* SPLIT SECTION FORM */}
                                                    {field.type === 'split_section' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-gray-700 font-medium">Section Title</Label>
                                                                    <Input
                                                                        placeholder="e.g., The Beginning"
                                                                        className="bg-white border-gray-300"
                                                                        {...register(`contentBlocks.${index}.title`)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-gray-700 font-medium">Description</Label>
                                                                    <div className="bg-white rounded-md border border-gray-300">
                                                                        <Controller
                                                                            name={`contentBlocks.${index}.description`}
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <SimpleTiptapEditor
                                                                                    value={field.value}
                                                                                    onChange={field.onChange}
                                                                                    placeholder="Tell your story..."
                                                                                />
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-gray-700 font-medium">Button Text (Optional)</Label>
                                                                        <Input
                                                                            placeholder="e.g., Learn More"
                                                                            className="bg-white border-gray-300"
                                                                            {...register(`contentBlocks.${index}.ctaText`)}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-gray-700 font-medium">Button Link (Optional)</Label>
                                                                        <Input
                                                                            placeholder="e.g., /about"
                                                                            className="bg-white border-gray-300"
                                                                            {...register(`contentBlocks.${index}.ctaLink`)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 font-medium">Image</Label>
                                                                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-1 shadow-sm hover:border-primary/50 transition-colors">
                                                                    <ControlledFileUpload
                                                                        control={control}
                                                                        name={`contentBlocks.${index}.image`}
                                                                        label="Upload Image"
                                                                        errors={errors}
                                                                        allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                                                        folderPath="pages/story/sections"
                                                                        role="admin"
                                                                        aspectRatio={4 / 3}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* MEDIA SECTION FORM */}
                                                    {field.type === 'media_section' && (
                                                        <div className="space-y-6">
                                                            <div className="space-y-2 w-full md:w-1/3">
                                                                <Label className="text-gray-700 font-medium">Media Type</Label>
                                                                <Controller
                                                                    name={`contentBlocks.${index}.mediaType`}
                                                                    control={control}
                                                                    defaultValue={field.mediaType || 'image'}
                                                                    render={({ field }) => (
                                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                                            <SelectTrigger className="bg-white border-gray-300">
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

                                                            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-1 shadow-sm hover:border-primary/50 transition-colors">
                                                                <MediaUploader
                                                                    control={control}
                                                                    index={index}
                                                                    register={register}
                                                                    errors={errors}
                                                                    watch={watch}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* CONTENT SECTION FORM */}
                                                    {field.type === 'content_section' && (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 font-medium">Heading (Optional)</Label>
                                                                <Input
                                                                    placeholder="e.g., Join us on our journey"
                                                                    className="bg-white border-gray-300"
                                                                    {...register(`contentBlocks.${index}.heading`)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 font-medium">Body Content</Label>
                                                                <div className="bg-white rounded-md border border-gray-300">
                                                                    <Controller
                                                                        name={`contentBlocks.${index}.body`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <SimpleTiptapEditor
                                                                                value={field.value}
                                                                                onChange={field.onChange}
                                                                                placeholder="Enter content details..."
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-gray-700 font-medium">Button Text (Optional)</Label>
                                                                    <Input
                                                                        placeholder="e.g., Contact Us"
                                                                        className="bg-white border-gray-300"
                                                                        {...register(`contentBlocks.${index}.ctaText`)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-gray-700 font-medium">Button Link (Optional)</Label>
                                                                    <Input
                                                                        placeholder="e.g., /contact"
                                                                        className="bg-white border-gray-300"
                                                                        {...register(`contentBlocks.${index}.ctaLink`)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })}
                                </Accordion>
                            </div>
                        )}
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

// Helper component to isolate watching logic for better performance in lists
const MediaUploader = ({ control, index, errors, watch }) => {
    const mediaType = watch(`contentBlocks.${index}.mediaType`);

    return (
        <div className="space-y-2">
            <Label>
                {mediaType === 'video' ? 'Upload Video (MP4/WebM)' : 'Upload Full-Width Image'}
            </Label>
            {mediaType === 'video' ? (
                <ControlledFileUpload
                    control={control}
                    name={`contentBlocks.${index}.video`}
                    label="Upload Video"
                    errors={errors}
                    allowedMimeType={["video/mp4", "video/webm"]}
                    folderPath="pages/story/media"
                    role="admin"
                    isPublic={true}
                />
            ) : (
                <ControlledFileUpload
                    control={control}
                    name={`contentBlocks.${index}.image`}
                    label="Upload Image"
                    errors={errors}
                    allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                    folderPath="pages/story/media"
                    role="admin"
                    aspectRatio={21 / 9}
                />
            )}
        </div>
    );
};

export default StoryPageEditor;
