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
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs"
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
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs"
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

  const currentOccasion = searchParams.get("occasion") || "";

  // Your enum values
  const occasions = [
    "baby-showers-gender-reveals",
    "birthdays-anniversaries",
    "corporate-events",
    "cultural-festival-events",
    "engagement-proposal-events",
    "graduation-celebrations",
    "private-parties",
    "product-launches-brand-events",
  ];

  // Format for UI: "baby-showers-gender-reveals" -> "Baby Showers Gender Reveals"
  const capitalizeDisplay = (str) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete("occasion");
    } else {
      params.set("occasion", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleSortChange} value={currentOccasion}>
      <SelectTrigger
        id="sort-occasion"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs"
      >
        <SelectValue placeholder="Occasion" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Occasions</SelectItem>
        {occasions.map((o) => (
          <SelectItem key={o} value={o}>
            {capitalizeDisplay(o)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};