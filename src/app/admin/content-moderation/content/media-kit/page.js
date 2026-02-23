"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
    Loader2,
    ArrowLeft,
    Eye,
    Plus,
    Save,
    GripVertical,
    Trash2,
    ExternalLink,
    Image as ImageIcon,
    ChevronUp,
    ChevronDown,
    Search,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import {
    getBulkContentAction,
} from "@/app/actions/public/content";
import {
    upsertContentAction,
} from "@/app/actions/admin/pages";
import { deleteS3FilesAction } from "@/app/actions/s3-upload";
import { cn } from "@/lib/utils";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const MediaKitManagementPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openItems, setOpenItems] = useState([]);

    // Track image URLs removed during this editing session for S3 cleanup on save
    const removedUrls = useRef([]);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            settings: {
                isActive: true, // Master toggle for the entire media kit page
                heading: "In The Press",
                tagline: "See what others are saying about us.",
                bannerImage: "",
                sectionHeading: "",
                sectionDescription: "",
            },
            items: [],
        },
    });

    const { fields, append, remove, move, update } = useFieldArray({
        control,
        name: "items",
    });

    const items = watch("items");

    // Filter fields based on search query
    const filteredFields = useMemo(() => {
        if (!searchQuery.trim()) return fields;
        const lowerQuery = searchQuery.toLowerCase();
        return fields.filter((field, index) => {
            const item = items[index];
            return (
                item?.publication?.toLowerCase().includes(lowerQuery) ||
                item?.snippet?.toLowerCase().includes(lowerQuery)
            );
        });
    }, [fields, items, searchQuery]);

    const isSearching = searchQuery.trim().length > 0;

    // Pagination Logic
    const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentFields = filteredFields.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const result = await getBulkContentAction(["media-kit-settings", "media-kit-items"]);

            if (result.success) {
                const settingsData = result.data.find((item) => item.key === "media-kit-settings");
                const itemsData = result.data.find((item) => item.key === "media-kit-items");

                if (settingsData?.content) {
                    // Ensure isActive exists on older payloads
                    const contentSettings = { ...settingsData.content };
                    if (contentSettings.isActive === undefined) contentSettings.isActive = true;
                    setValue("settings", contentSettings);
                }
                if (itemsData?.content && Array.isArray(itemsData.content)) {
                    setValue("items", itemsData.content);
                }
            }
        } catch (error) {
            toast.error("Failed to load content");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        // Clear search to show the new item
        if (isSearching) {
            setSearchQuery("");
            toast.info("Search cleared to add new item");
        }

        const newItemId = crypto.randomUUID();

        // Switch to the last page to see the new item
        // We know we are appending, so calculate new total pages
        // total items will be fields.length + 1
        const newTotalItems = fields.length + 1;
        const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);

        // Only switch page if we are not already on the last page
        if (newTotalPages > currentPage) {
            setCurrentPage(newTotalPages);
        }

        append({
            id: newItemId,
            image: "",
            publication: "",
            snippet: "",
            link: "",
        });

        // Auto-open the new item
        setOpenItems((prev) => [...prev, newItemId]);
    };

    const handlePreview = () => {
        window.open("/media-kit", "_blank");
    };

    const onSubmit = async (data) => {
        if (data.items.length === 0) {
            toast.warning("You haven't added any press items yet.");
        }

        setSaving(true);
        try {
            // Capture removed URLs before clearing the ref
            const urlsToDelete = [...removedUrls.current];

            // Run S3 cleanup + DB save in parallel
            const [settingsResult, itemsResult] = await Promise.all([
                upsertContentAction("media-kit-settings", {
                    type: "page",
                    content: data.settings,
                }),
                upsertContentAction("media-kit-items", {
                    type: "page",
                    content: data.items,
                }),
                // Best-effort S3 cleanup — errors are logged inside the action
                urlsToDelete.length > 0 ? deleteS3FilesAction(urlsToDelete) : Promise.resolve(),
            ]);

            if (!settingsResult.success) {
                throw new Error(settingsResult.message || "Failed to save settings");
            }

            if (!itemsResult.success) {
                throw new Error(itemsResult.message || "Failed to save items");
            }

            // Clear the removed URLs ref after a successful save
            removedUrls.current = [];

            toast.success("Media Kit page updated successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error(error.message || "Failed to save content");
        } finally {
            setSaving(false);
        }
    };

    // Helper to get real index from filtered item
    const getRealIndex = (filteredItem) => {
        return fields.findIndex(f => f.id === filteredItem.id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="dashboard-container !pt-0">
            {/* Header */}
            <div className="border-b border-gray-200 sticky left-0 top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push("/admin/content-moderation/content")}
                                className="!rounded-full bg-gray-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Media Kit Editor</span>
                                <p className="!text-sm text-gray-500">Manage your "In The Press" coverage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handlePreview}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button type="submit" form="media-kit-form" disabled={saving}>
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

            <form id="media-kit-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-6xl mx-auto pb-12">

                {/* Page Settings */}
                <div className="mb-10">
                    <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <AccordionItem value="page-config" className="border-0">
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xl font-semibold text-gray-800">Page Configuration</span>
                                    <span className="!text-sm font-normal text-gray-500">Customize the header area of your Media Kit page</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                <div className="space-y-6 pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-lg border border-gray-200 mb-2">
                                        <div className="space-y-0.5">
                                            <Label className="text-base text-gray-900 font-semibold">Enable Media Kit Page</Label>
                                            <p className="text-sm text-gray-500">Toggle this to make the Media Kit public or hide it from users.</p>
                                        </div>
                                        <Controller
                                            name="settings.isActive"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">Page Heading</Label>
                                                <Controller
                                                    name="settings.heading"
                                                    control={control}
                                                    rules={{ required: "Heading is required" }}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="In The Press" className="h-10 border-gray-300 focus:border-primary focus:ring-primary/20 transition-all font-medium" />
                                                    )}
                                                />
                                                {errors.settings?.heading && (
                                                    <p className="text-red-500 text-sm">{errors.settings.heading.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">Tagline / Subheading</Label>
                                                <Controller
                                                    name="settings.tagline"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="See what others are saying about Karyaa" className="h-10 border-gray-300 focus:border-primary focus:ring-primary/20 transition-all" />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium">Banner Media (Image or Video)</Label>
                                            <div className="bg-gray-50/50 p-1 rounded-xl border border-dashed border-gray-300 hover:border-primary/50 transition-colors">
                                                <ControlledFileUpload
                                                    control={control}
                                                    name="settings.bannerImage"
                                                    label="Upload Banner Media"
                                                    errors={errors}
                                                    allowedMimeType={["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]}
                                                    folderPath="pages/media-kit"
                                                    role="admin"
                                                    aspectRatio={16 / 9}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="!text-xl font-medium text-gray-900">Content Section</h3>
                                            <p className="!text-sm text-gray-500">Content displayed before the press items grid</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">Section Heading</Label>
                                                <Controller
                                                    name="settings.sectionHeading"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="Latest Features" className="bg-white" />
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-700 font-medium">Section Description</Label>
                                                <Controller
                                                    name="settings.sectionDescription"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Browse through our latest press coverage and media features."
                                                            className="bg-white min-h-[80px] resize-y"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Press Items Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="!text-2xl font-semibold text-gray-900 flex items-center gap-2">
                                Press Coverage
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                                    {fields.length} items
                                </span>
                            </h2>
                            <p className="text-gray-500 !text-sm mt-0.5">Manage articles, reviews, and features</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <Button type="button" onClick={handleAddItem} className="shrink-0 bg-gray-900 text-white hover:bg-gray-800 h-9">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>

                    {filteredFields.length === 0 ? (
                        <Card className="border-dashed bg-gray-50/50 border-gray-300">
                            <CardContent className="py-16 text-center">
                                <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-semibold text-lg mb-1">
                                            {isSearching ? "No matching items found" : "No press items yet"}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {isSearching
                                                ? `We couldn't find any items matching "${searchQuery}". Try a different term or clear the search.`
                                                : "Start building your media kit by adding your first press coverage item."
                                            }
                                        </p>
                                    </div>
                                    {isSearching ? (
                                        <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-2 text-gray-700">
                                            Clear Search
                                        </Button>
                                    ) : (
                                        <Button onClick={handleAddItem} className="mt-2">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Item
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <Accordion
                                type="multiple"
                                className="w-full space-y-3"
                                value={openItems}
                                onValueChange={setOpenItems}
                            >
                                {currentFields.map((field) => {
                                    // Real index in the original 'fields' array for react-hook-form operations
                                    const realIndex = getRealIndex(field);
                                    const item = items[realIndex];

                                    // Safe-guard if item is missing (sync issues)
                                    if (!item) return null;

                                    return (
                                        <AccordionItem
                                            key={field.id}
                                            value={item.id}
                                            className="border border-gray-200 rounded-md bg-white text-sm overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-all data-[state=open]:ring-1 data-[state=open]:ring-primary/20 data-[state=open]:border-primary/30 items-center"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-3 px-3 [&[data-state=open]]:bg-gray-50/50 border-b border-transparent [&[data-state=open]]:border-gray-100">
                                                <div className="flex items-center gap-4 text-left w-full pr-4">
                                                    {/* Drag Handle - Disabled when searching */}
                                                    <div
                                                        className={`text-gray-300 ${!isSearching && "cursor-move hover:text-gray-500"}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <GripVertical className={`h-5 w-5 ${isSearching && "opacity-30"}`} />
                                                    </div>

                                                    {/* Thumbnail */}
                                                    <div className="relative size-26 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm">
                                                        {item?.image ? (
                                                            <Image
                                                                // Handle both blob (preview) and direct URLs
                                                                src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image}
                                                                alt="Preview"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full bg-gray-50">
                                                                <ImageIcon className="h-5 w-5 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                        <h4 className="font-semibold uppercase truncate">
                                                            {item?.publication || <span className="text-gray-400 italic font-normal">Untitled Publication</span>}
                                                        </h4>

                                                        {/* Snippet Preview */}
                                                        <p className="!text-xs font-normal !font-body !text-gray-500 line-clamp-2 pr-8">
                                                            {item?.snippet || <span className="italic opacity-50">No snippet content added yet...</span>}
                                                        </p>

                                                        {/* View Link Button - Small */}
                                                        {item?.link && (
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <Link
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                                                                >
                                                                    View Article <ExternalLink className="ml-1 h-3 w-3" />
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                        {/* Only show move buttons if NOT searching */}
                                                        {!isSearching && (
                                                            <>
                                                                <div
                                                                    role="button"
                                                                    className={cn(
                                                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                                                        "h-8 w-8 border border-gray-400 rounded-full cursor-pointer text-gray-400 hover:text-gray-700",
                                                                        realIndex === 0 && "opacity-50 pointer-events-none"
                                                                    )}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        move(realIndex, realIndex - 1);
                                                                    }}
                                                                    title="Move Up"
                                                                >
                                                                    <ChevronUp className="h-4 w-4" />
                                                                </div>
                                                                <div
                                                                    role="button"
                                                                    className={cn(
                                                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                                                        "h-8 w-8 border border-gray-400 rounded-full cursor-pointer text-gray-400 hover:text-gray-700",
                                                                        realIndex === fields.length - 1 && "opacity-50 pointer-events-none"
                                                                    )}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        move(realIndex, realIndex + 1);
                                                                    }}
                                                                    title="Move Down"
                                                                >
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="w-px h-4 bg-gray-200 mx-1"></div>

                                                        <div
                                                            role="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm("Are you sure you want to delete this item?")) {
                                                                    // Collect the image URL for S3 cleanup on next save
                                                                    if (item?.image) {
                                                                        removedUrls.current.push(item.image);
                                                                    }
                                                                    remove(realIndex);
                                                                    if (isSearching) toast.success("Item deleted");
                                                                }
                                                            }}
                                                            className={cn(
                                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                                                "text-gray-400 cursor-pointer border border-gray-400 rounded-full hover:text-red-600 hover:bg-red-50 h-8 w-8"
                                                            )}
                                                            title="Delete Item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-5 pb-8 pt-6 bg-gray-50/30">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                                    {/* Image Column */}
                                                    <div className="md:col-span-6 lg:col-span-5">
                                                        <Label className="mb-3 block text-sm text-gray-700 font-medium">Publication Image</Label>
                                                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-1 shadow-sm hover:border-primary/50 transition-colors">
                                                            <ControlledFileUpload
                                                                control={control}
                                                                name={`items.${realIndex}.image`}
                                                                errors={errors}
                                                                allowedMimeType={["image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
                                                                folderPath="pages/media-kit/items"
                                                                role="admin"
                                                                aspectRatio={16 / 9}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Content Column */}
                                                    <div className="md:col-span-6 lg:col-span-7 space-y-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 text-sm">Publication Name</Label>
                                                                <Controller
                                                                    name={`items.${realIndex}.publication`}
                                                                    control={control}
                                                                    rules={{ required: "Publication name is required" }}
                                                                    render={({ field }) => (
                                                                        <Input {...field} placeholder="e.g. Vogue, Forbes" className="bg-white" />
                                                                    )}
                                                                />
                                                                {errors.items?.[realIndex]?.publication && (
                                                                    <p className="text-red-500 text-xs">{errors.items[realIndex].publication.message}</p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-gray-700 text-sm">Article Link</Label>
                                                                <div className="relative">
                                                                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                                    <Controller
                                                                        name={`items.${realIndex}.link`}
                                                                        control={control}
                                                                        rules={{ required: "Link is required" }}
                                                                        render={({ field }) => (
                                                                            <Input {...field} className="pl-9 bg-white" placeholder="https://..." />
                                                                        )}
                                                                    />
                                                                </div>
                                                                {errors.items?.[realIndex]?.link && (
                                                                    <p className="text-red-500 text-xs">{errors.items[realIndex].link.message}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-gray-700 text-sm">Snippet / Quote (Max 4-6 lines)</Label>
                                                            <Controller
                                                                name={`items.${realIndex}.snippet`}
                                                                control={control}
                                                                rules={{ required: "Snippet is required" }}
                                                                render={({ field }) => (
                                                                    <Textarea
                                                                        {...field}
                                                                        placeholder="Paste the key quote or summary from the article here..."
                                                                        className="min-h-[120px] resize-y bg-white text-base"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.items?.[realIndex]?.snippet && (
                                                                <p className="text-red-500 text-xs">{errors.items[realIndex].snippet.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredFields.length)} of {filteredFields.length} results
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium px-2">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
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

                {/* Bottom Save Button (Redundant but helpful) */}
                <div className="fixed bottom-6 right-6 z-40 bg-white p-2 rounded-full shadow-xl border border-gray-200 md:hidden">
                    <Button type="submit" size="icon" disabled={saving} className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                        {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MediaKitManagementPage;
