"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

import { getAllIdeasAction } from "@/app/actions/public/ideas";
import AddIdeaModal from "../modals/ideas/AddIdeaModal";
import EditIdeaModal from "../modals/ideas/EditIdeaModal";
import { deleteIdeaAction } from "@/app/actions/admin/ideas";
import { Badge } from "@/components/ui/badge";

export default function IdeasTable({ categories = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // ⬅️ New State for Editing
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);

    const [deletingId, setDeletingId] = useState(null);

    const limit = 20;

    // ➡️ Get current filter values from URL
    const currentPage = parseInt(searchParams.get("page") || "1");
    const searchTerm = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "";

    // ➡️ Centralized function to update URL
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "" || value === 1 || value === "all") {
                params.delete(name);
            } else {
                params.set(name, value.toString());
            }
            // Always reset page to 1 when search or category changes
            if (name === "search" || name === "category") {
                params.delete("page");
            }
            return params.toString();
        },
        [searchParams]
    );

    // ➡️ Fetch ideas: Now dependent on URL params
    const fetchIdeas = useCallback(async () => {
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
    }, [currentPage, searchTerm, selectedCategory, limit]);

    // ➡️ Trigger fetch when URL parameters change
    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    // ----------------------------------------------------------------------
    // Handlers to update URL
    // ----------------------------------------------------------------------

    // ➡️ Debounce for Search Input
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Sync local state with URL state on initial load/navigation
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Only push update if local term differs from URL term
            if (localSearchTerm !== searchTerm) {
                const url = pathname + '?' + createQueryString('search', localSearchTerm);
                router.push(url);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearchTerm, searchTerm, pathname, router, createQueryString]);


    const handleDeleteIdea = async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this idea?")) return;

            setDeletingId(id);

            const res = await deleteIdeaAction(id);

            if (res.success) {
                toast.success(res.message || "Idea deleted successfully.");
                fetchIdeas(); // Refetch data
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

    const handleRefresh = () => {
        fetchIdeas();
    };

    // ⬅️ New handler to open Edit Modal
    const handleEditIdea = (idea) => {
        setSelectedIdea(idea);
        setEditModalOpen(true);
    };

    // ⬅️ New handler to close Edit Modal
    const handleEditModalClose = (newOpenState) => {
        if (!newOpenState) {
            setSelectedIdea(null);
        }
        setEditModalOpen(newOpenState);
    };

    const handleCategoryChange = (value) => {
        const newCategory = value === "all" ? "" : value;
        const url = pathname + '?' + createQueryString('category', newCategory);
        router.push(url);
    };

    const goToPage = (page) => {
        const url = pathname + '?' + createQueryString('page', page);
        router.push(url);
    };

    // ----------------------------------------------------------------------

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
                            // ➡️ Use local state for controlled input, URL state for filtering logic
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    {/* ➡️ Use URL state for Select component */}
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

            {/* Cards (Display remains the same) */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {ideas.map((idea) => (
                        <IdeaCard
                            key={idea._id}
                            idea={idea}
                            onDelete={handleDeleteIdea}
                            onEdit={handleEditIdea} // ⬅️ Pass the new handler
                            deletingId={deletingId}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * limit) + 1} to
                        {Math.min(currentPage * limit, pagination.totalCount)} of
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

            {/* ⬅️ Edit Idea Modal */}
            {selectedIdea && ( // Only render the modal if an idea is selected
                <EditIdeaModal
                    open={editModalOpen}
                    onOpenChange={handleEditModalClose} // Use the new close handler
                    categories={categories}
                    idea={selectedIdea} // Pass the selected idea
                    onSuccess={handleRefresh}
                />
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// IDEA CARD Component
// ----------------------------------------------------------------------

const IdeaCard = ({ idea, onDelete, onEdit, deletingId }) => { // ⬅️ Receive onEdit prop
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
                    <div className="flex justify-between items-center">
                        <Badge className="bg-indigo-300 text-white">
                            {idea.category?.name}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mb-0.5 mr-1" />
                            {format(new Date(idea.createdAt), "dd-MM-yyyy")}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mt-4 mb-2 line-clamp-2">{idea.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-4">{idea.description}</p>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-t-gray-300 pt-4">
                    {/* ⬅️ Updated Edit Button to open modal */}
                    <Button
                        variant="outline"
                        onClick={() => onEdit(idea)}
                    >
                        <SquarePen className="w-4 h-4 mr-2" /> Edit
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