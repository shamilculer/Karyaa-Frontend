"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// --- Unified Sort By Dropdown ---
export const VendorSortBy = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "";
  const isRecommended = searchParams.get("isRecommended");

  // Determine current value based on both sort and isRecommended
  const getCurrentValue = () => {
    if (isRecommended === "true") return "recommended";
    return currentSort;
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === "recommended") {
      params.delete("sort");
      params.set("isRecommended", "true");
    } else {
      params.set("sort", value);
      params.delete("isRecommended");
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleSortChange} value={getCurrentValue()}>
      <SelectTrigger
        id="sort-by"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs min-w-24 xl:min-w-[180px]"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-low">Price – Low to High</SelectItem>
        <SelectItem value="price-high">Price – High to Low</SelectItem>
        <SelectItem value="rating">Rating</SelectItem>
        <SelectItem value="recommended">Recommended</SelectItem>
      </SelectContent>
    </Select>
  );
};

// --- Location Dropdown ---
export const VendorLocationFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentLocation = searchParams.get("location") || "all";

  // UAE Cities
  const uaeCities = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
    "Al Ain",
  ];

  const handleLocationChange = (value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === "all") {
      params.delete("location");
    } else {
      params.set("location", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleLocationChange} value={currentLocation}>
      <SelectTrigger
        id="location-filter"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs min-w-24 xl:min-w-[180px]"
      >
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Locations</SelectItem>
        {uaeCities.map((city) => (
          <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, "-")}>
            {city}
          </SelectItem>
        ))}
        <SelectItem value="international">International</SelectItem>
      </SelectContent>
    </Select>
  );
};

// --- Occasion Filter (Keep if needed) ---
export const VendorOccasionFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentOccasion = searchParams.get("occasion") || "all";

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

  const capitalizeDisplay = (str) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleOccasionChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("occasion");
    } else {
      params.set("occasion", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleOccasionChange} value={currentOccasion}>
      <SelectTrigger
        id="occasion-filter"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-xs min-w-24 xl:min-w-[180px]"
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