"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Search,
    Plus,
    Loader2,
    Calendar,
    SquarePen,
    Trash2,
    Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import { getAllIdeasAction } from "@/app/actions/ideas";
import AddIdeaModal from "../AddIdeaModal";
import { deleteIdeaAction } from "@/app/actions/admin/ideas";
import { Badge } from "@/components/ui/badge";

export default function IdeasTable({ categories = [] }) {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // ✅ Only track the idea currently being deleted
    const [deletingId, setDeletingId] = useState(null);

    const limit = 20;

    // Fetch ideas
    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const result = await getAllIdeasAction({
                page: currentPage,
                limit,
                search: searchTerm,
                category: selectedCategory,
                role: "admin",
            });

            if (result.success) {
                setIdeas(result.data || []);
                setPagination(result.pagination);
            } else {
                toast.error(result.message || "Failed to fetch ideas");
                setIdeas([]);
            }
        } catch (error) {
            console.error("Error fetching ideas:", error);
            toast.error("An error occurred while fetching ideas");
            setIdeas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, [currentPage, searchTerm, selectedCategory]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value === "all" ? "" : value);
        setCurrentPage(1);
    };

    const handleDeleteIdea = async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this idea?")) return;

            setDeletingId(id);

            const res = await deleteIdeaAction(id);

            if (res.success) {
                toast.success(res.message || "Idea deleted successfully.");
                fetchIdeas();
            } else {
                toast.error(res.message || "Failed to delete idea.");
            }
        } catch (error) {
            toast.error("Unexpected error deleting idea.");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const goToPage = (page) => {
        if (page >= 1 && page <= (pagination?.totalPages || 1)) {
            setCurrentPage(page);
        }
    };

    const handleRefresh = () => {
        fetchIdeas();
    };

    return (
        <div className="space-y-6 mt-3">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search ideas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Add Button */}
                <Button onClick={() => setAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Idea
                </Button>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-gray-500 ml-3">Loading ideas...</p>
                </div>
            ) : ideas.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">
                            {searchTerm || selectedCategory
                                ? "No ideas found matching your filters"
                                : "No ideas yet. Add one to get started!"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea) => (
                        <IdeaCard
                            key={idea._id}
                            idea={idea}
                            onDelete={handleDeleteIdea}
                            deletingId={deletingId}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * limit) + 1} to{" "}
                        {Math.min(currentPage * limit, pagination.totalCount)} of{" "}
                        {pagination.totalCount} ideas
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm px-3">
                            Page {currentPage} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Idea Modal */}
            <AddIdeaModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
                categories={categories}
                onSuccess={handleRefresh}
            />
        </div>
    );
}

/* =======================================================
   ✅ Card UI
======================================================= */

const IdeaCard = ({ idea, onDelete, deletingId }) => {
    const lightGalleryRef = useRef(null);

    const images = useMemo(
        () => (idea.gallery || []).map((url) => ({ src: url, thumb: url })),
        [idea.gallery]
    );

    const totalImages = images.length;
    const previewImages = images.slice(0, 4);

    const openGallery = (index = 0) => {
        if (lightGalleryRef.current) lightGalleryRef.current.openGallery(index);
    };

    let gridClasses = "grid gap-1 rounded-t-lg overflow-hidden w-full h-[250px]";
    if (totalImages === 1) gridClasses += " grid-cols-1 grid-rows-1";
    else if (totalImages === 2) gridClasses += " grid-cols-2 grid-rows-1";
    else gridClasses += " grid-cols-2 grid-rows-2";

    const hasGallery = totalImages > 0;

    return (
        <div className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-white">
            {/* Image Grid */}
            <div className="min-h-[250px] flex-shrink-0">
                {!hasGallery ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-t-lg">
                        No Images Available
                    </div>
                ) : (
                    <div className={gridClasses}>
                        {previewImages.map((img, index) => {
                            const isLast = index === Math.min(totalImages, 4) - 1;
                            return (
                                <div
                                    key={index}
                                    className="relative cursor-pointer"
                                    onClick={() => openGallery(index)}
                                >
                                    <Image
                                        src={img.thumb}
                                        alt={`Image ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                    {isLast && totalImages > 4 && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                                            +{totalImages - 3} more
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex-between">
                        <Badge className="bg-indigo-300 text-white">
                            {idea.category?.name}
                        </Badge>
                        <div className="flex items-center !text-xs">
                            <Calendar className="w-3 h-3 mb-0.5" />
                            {format(new Date(idea.createdAt), "dd-MM-yyyy")}
                        </div>
                    </div>
                    <h3 className="!text-xl font-bold mt-4 mb-2 line-clamp-2">{idea.title}</h3>
                    <p className="!text-sm text-gray-600 line-clamp-4">{idea.description}</p>
                </div>

                <div className="flex gap-3 mt-4 border-t border-t-gray-300 pt-4">
                    <Button asChild variant="outline">
                        <Link href={`/admin/content-moderation/ideas/edit?id=${idea._id}`}>
                            <SquarePen className="w-4 h-4 mr-2" /> Edit
                        </Link>
                    </Button>

                    {/* ✅ Only disable button of this idea */}
                    <Button
                        variant="destructive"
                        disabled={deletingId === idea._id}
                        onClick={() => onDelete(idea._id)}
                    >
                        {deletingId === idea._id ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Gallery */}
            <LightGallery
                dynamic
                dynamicEl={images}
                plugins={[lgThumbnail, lgZoom]}
                onInit={(ref) => (lightGalleryRef.current = ref.instance)}
            />
        </div>
    );
};
