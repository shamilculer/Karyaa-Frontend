"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// --- Price Sorter (Original Component) ---

export const VendorPriceSorter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Uses 'sort' query parameter
  const currentSort = searchParams.get("sort") || "none";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "none") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // Navigates to the new URL with the updated 'sort' parameter
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSortChange}
      // Pass the current price sort value, or undefined if no price sort is active
      value={
        (currentSort === "price-low" || currentSort === "price-high")
          ? currentSort
          : undefined
      }
    >
      <SelectTrigger
        id="sort-price"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-sm"
      >
        <SelectValue placeholder="Sort by Price" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Default (Latest)</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
};

// --- Rating Sorter (New Component) ---

export const VendorRatingSorter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Uses 'rating' query parameter
  const currentRating = searchParams.get("rating") || "none";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "none") {
      params.delete("rating");
    } else {
      params.set("rating", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSortChange}
      // Value is the current rating sort, defaulting to 'none'
      value={currentRating}
    >
      <SelectTrigger
        id="sort-rating"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-sm"
      >
        <SelectValue placeholder="Sort by Rating" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Default (Latest)</SelectItem>
        <SelectItem value="rating-high">Rating: High to Low</SelectItem>
        <SelectItem value="rating-low">Rating: Low to High</SelectItem>
      </SelectContent>
    </Select>
  );
};

// --- Occasion Sorter (New Component) ---

export const VendorOccasionSorter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Uses 'occasion' query parameter
  const currentOccasion = searchParams.get("occasion") || "none";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "none") {
      params.delete("occasion");
    } else {
      params.set("occasion", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSortChange}
      // Value is the current occasion sort, defaulting to 'none'
      value={currentOccasion}
    >
      <SelectTrigger
        id="sort-occasion"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-sm"
      >
        <SelectValue placeholder="Sort by Occasion" />
      </SelectTrigger>
      <SelectContent>
        {/* Note: The values for occasions should match what your API expects for filtering. 
            These are placeholders based on common wedding/event occasions. */}
        <SelectItem value="none">All Occasions</SelectItem>
        <SelectItem value="wedding">Wedding</SelectItem>
        <SelectItem value="reception">Reception</SelectItem>
        <SelectItem value="pre-wedding">Pre-Wedding Shoot</SelectItem>
        <SelectItem value="birthday">Birthday/Party</SelectItem>
      </SelectContent>
    </Select>
  );
};