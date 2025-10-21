"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const VendorSorter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "none";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "none") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSortChange}
      value={currentSort === "none" ? undefined : currentSort}
    >
      <SelectTrigger
        id="sort"
        className="bg-[#F2F4FF] border rounded-4xl border-gray-300 text-primary hover:bg-gray-300 px-4 font-semibold max-md:!text-sm"
      >
        <ArrowUpDown className="mr-1" />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        <SelectItem value="rating-high">Highest Rated</SelectItem>
        <SelectItem value="rating-low">Lowest Rated</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default VendorSorter;
