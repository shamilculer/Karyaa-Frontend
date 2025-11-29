"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ListFilter, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSubcategories } from "@/app/actions/public/categories";
import { Skeleton } from "@/components/ui/skeleton";

const VendorFilterModal = ({ mainCategory, isSubPage }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- State ---
    const [selectedSubCategories, setSelectedSubCategories] = useState(
        searchParams.get("subCategory")?.split(",") || []
    );
    const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000);
    const [hasPackages, setHasPackages] = useState(searchParams.get("hasPackages") === "true");
    const [isSponsored, setIsSponsored] = useState(searchParams.get("isSponsored") === "true");
    const [rating, setRating] = useState(searchParams.get("rating") || "");
    const [open, setOpen] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    // 💡 NEW STATE for loading
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);

    // --- Load subcategories from server action ---
    useEffect(() => {
        const loadData = async () => {
            // 1. Start loading
            setIsLoadingSubcategories(true);

            try {
                let params = {};

                if (mainCategory) {
                    params.mainCategory = mainCategory;
                }

                // Call the existing server action with conditional parameters
                const subcategoriesData = await getSubcategories(params);

                // Assuming the successful response structure:
                setSubCategories(subcategoriesData.subcategories || []);

            } catch (error) {
                console.error("Failed to fetch subcategories:", error);
                setSubCategories([]); // Ensure state is empty on error
            } finally {
                // 2. Stop loading, regardless of success or failure
                setIsLoadingSubcategories(false);
            }
        };

        if (!isSubPage) {
            loadData();
        }

    }, [mainCategory]);

    // --- Toggle subcategory (No change) ---
    const toggleSubCategory = (slug) => {
        setSelectedSubCategories((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    // --- Apply filters (Minor improvement: use new URLSearchParams instance) ---
    const applyFilters = () => {
        // Use the current searchParams to correctly handle existing query parameters (like sorting, etc.)
        const currentParams = new URLSearchParams(searchParams.toString());

        // 1. Clear filter-specific parameters before setting new ones
        currentParams.delete("subCategory");
        currentParams.delete("minPrice");
        currentParams.delete("maxPrice");
        currentParams.delete("hasPackages");
        currentParams.delete("isSponsored");
        currentParams.delete("rating");

        // 2. Set new values
        if (selectedSubCategories.length)
            currentParams.set("subCategory", selectedSubCategories.join(","));

        if (minPrice > 0) currentParams.set("minPrice", minPrice.toString());
        if (maxPrice < 10000) currentParams.set("maxPrice", maxPrice.toString());
        if (hasPackages) currentParams.set("hasPackages", "true");
        if (isSponsored) currentParams.set("isSponsored", "true");
        if (rating) currentParams.set("rating", rating);

        router.push(`?${currentParams.toString()}`);
        setOpen(false);
    };

    // --- Clear filters (Minor improvement: use new URLSearchParams instance) ---
    const clearFilters = () => {
        const currentParams = new URLSearchParams(searchParams.toString());

        // Clear only the filter parameters
        currentParams.delete("subCategory");
        currentParams.delete("minPrice");
        currentParams.delete("maxPrice");
        currentParams.delete("hasPackages");
        currentParams.delete("isSponsored");
        currentParams.delete("rating");

        router.push(`?${currentParams.toString()}`);

        // Reset local state to default values
        setSelectedSubCategories([]);
        setMinPrice(0);
        setMaxPrice(10000);
        setHasPackages(false);
        setIsSponsored(false);
        setRating("");

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#F2F4FF] border border-gray-300 text-primary hover:bg-gray-200 !p-4 md:!px-6">
                    <ListFilter className="mr-1 h-4 w-4" />{" "}
                    <span className="leading-0 mt-0.5 font-heading max-md:hidden">Filter</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] w-full max-w-3xl rounded-2xl overflow-hidden p-0">
                <DialogHeader className="px-6 pt-5 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-semibold">Filter Vendors</DialogTitle>
                    </div>
                </DialogHeader>

                <Separator />

                <ScrollArea className="max-h-[65vh]">
                    <div className="p-6 space-y-10">

                        {/* Sub Categories */}

                        {!isSubPage && (
                            <div>
                                <Label className="font-semibold text-lg">Services</Label>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {isLoadingSubcategories ? (
                                        // ⚡ LOADING STATE UI
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                        </div>
                                    ) : subCategories.length > 0 ? (
                                        // 🟢 DATA LOADED
                                        subCategories.map((sub) => (
                                            <Button
                                                key={sub._id}
                                                variant={selectedSubCategories.includes(sub.slug) ? "default" : "outline"}
                                                className={`rounded-full border text-sm font-medium px-4 py-1 transition-all ${selectedSubCategories.includes(sub.slug)
                                                    ? "bg-primary text-white border-primary"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                                onClick={() => toggleSubCategory(sub.slug)}
                                            >
                                                {sub.name}
                                            </Button>
                                        ))
                                    ) : (
                                        // 🫙 EMPTY STATE
                                        <p className="text-sm text-gray-500">No services available for this category.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Price Range */}
                        {/* ... (Price Range JSX) ... */}
                        <div>
                            <Label className="font-semibold text-lg">Price Range (AED)</Label>
                            <div className="mt-3 space-y-3">
                                <Slider
                                    min={0}
                                    max={10000}
                                    step={100}
                                    value={[minPrice, maxPrice]}
                                    onValueChange={(value) => {
                                        setMinPrice(value[0]);
                                        setMaxPrice(value[1]);
                                    }}
                                    className="h-3"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{minPrice} AED</span>
                                    <span>{maxPrice} AED</span>
                                </div>
                            </div>
                        </div>

                        {/* Has Packages */}
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold text-lg">Has Packages</Label>
                            <Switch checked={hasPackages} onCheckedChange={setHasPackages} />
                        </div>

                        {/* Is Sponsored */}
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold text-lg">Sponsored Vendors Only</Label>
                            <Switch checked={isSponsored} onCheckedChange={setIsSponsored} />
                        </div>

                        {/* Ratings */}
                        <div>
                            <Label className="font-semibold text-lg">Ratings</Label>
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {[5, 4, 3, 2, 1].map((r) => (
                                    <Button
                                        key={r}
                                        variant={rating === String(r) ? "default" : "outline"}
                                        className={`rounded-full px-4 py-1 ${rating === String(r)
                                            ? "bg-primary text-white border-primary"
                                            : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => setRating(rating === String(r) ? "" : String(r))}
                                    >
                                        {Array.from({ length: r }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="ml-1 text-xs">& up</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <Separator />

                {/* Bottom Actions */}
                <div className="flex justify-between items-center px-6 py-4 border-t bg-white sticky bottom-0">
                    <Button variant="ghost" onClick={clearFilters}>
                        Clear
                    </Button>
                    <Button onClick={applyFilters} className="min-w-[130px]">
                        Apply Filters
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VendorFilterModal;