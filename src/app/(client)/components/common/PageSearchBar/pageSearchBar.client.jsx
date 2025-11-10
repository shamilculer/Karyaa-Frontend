"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PageSearchBarClient({ locations }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (location) params.set("location", location);

    let targetUrl = "/vendors"; // default fallback

    if (
      pathname.startsWith("/vendors") ||
      pathname.startsWith("/vendors/saved")
    ) {
      // ✅ Stay on /vendors or /vendors/saved
      targetUrl = pathname;
    } else if (pathname.startsWith("/categories")) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length === 1) {
        // ✅ /categories → redirect to /vendors
        targetUrl = "/vendors";
      } else {
        // ✅ /categories/[category] or /categories/[category]/[subcategory]
        targetUrl = pathname;
      }
    }

    router.push(`${targetUrl}?${params.toString()}`);
  };

  return (
    <div className="flex items-end lg:gap-10 w-full max-lg:flex-wrap">
      {/* Search Input */}
      <div className="w-4/6 lg:w-3/5 pr-2.5 lg:pr-0">
        <Label htmlFor="search" className="text-primary mb-2 lg:mb-3.5 max-lg:text-sm">
          Search
        </Label>
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type here..."
          className="border-0 border-b border-primary rounded-none placeholder:text-primary/50 placeholder:font-medium placeholder:text-base"
        />
      </div>

      {/* Location Dropdown */}
      <div className="w-2/6 lg:w-1/4 pl-2.5 lg:pl-0">
        <Label htmlFor="location" className="text-primary mb-3.5 max-sm:hidden">
          Location
        </Label>
        <Select onValueChange={setLocation}>
          <SelectTrigger
            id="location"
            className="w-full border-0 border-b border-primary rounded-none text-primary/50 font-medium"
          >
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem className="text-primary" key={loc.value} value={loc.value}>
                {loc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <Button
        className="w-full lg:w-1/6 mt-5 lg:mt-0"
        onClick={handleSearch}
      >
        Search Your Vendor
      </Button>
    </div>
  );
}
