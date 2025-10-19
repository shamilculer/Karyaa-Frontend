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
import { ListFilter, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSubcategories } from "@/app/actions/categories";

const VendorFilterModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State ---
  const [subCategory, setSubCategory] = useState(searchParams.get("subCategory") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000);
  const [open, setOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  // --- Load subcategories from server action ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const allSubcategories = await getSubcategories();
        setSubCategories(allSubcategories.subcategories || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    loadData();
  }, []);

  // --- Apply filters ---
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (subCategory) params.set("subCategory", subCategory);
    if (rating) params.set("rating", rating);
    if (minPrice) params.set("minPrice", minPrice.toString());
    if (maxPrice) params.set("maxPrice", maxPrice.toString());

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  // --- Clear filters ---
  const clearFilters = () => {
    router.push(`?`);
    setSubCategory("");
    setRating("");
    setMinPrice(0);
    setMaxPrice(10000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F2F4FF] border border-gray-300 text-primary hover:bg-gray-200 !px-6">
          <ListFilter className="mr-2 h-4 w-4" /> Filter
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
          <div className="p-6 space-y-14">
            {/* Sub Category Pills */}
            <div>
              <Label className="font-semibold text-lg">Sub Categories</Label>
              <div className="flex flex-wrap gap-2 mt-4">
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <Button
                      key={sub._id}
                      variant={subCategory === sub.slug ? "default" : "outline"}
                      className={`rounded-full border text-sm font-medium px-4 py-1 transition-all ${
                        subCategory === sub.slug
                          ? "bg-primary text-white border-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        setSubCategory(subCategory === sub.slug ? "" : sub.slug)
                      }
                    >
                      {sub.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No subcategories available.</p>
                )}
              </div>
            </div>

                        {/* Price Range */}
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

            {/* Ratings */}
            <div>
              <Label className="font-semibold text-lg">Ratings</Label>
              <div className="flex gap-2 mt-3 flex-wrap">
                {[5, 4, 3, 2, 1].map((r) => (
                  <Button
                    key={r}
                    variant={rating === String(r) ? "default" : "outline"}
                    className={`rounded-full px-4 py-1 ${
                      rating === String(r)
                        ? "bg-primary text-white border-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setRating(rating === String(r) ? "" : String(r))}
                  >
                    {Array.from({ length: r }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-xs">&nbsp;& up</span>
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
