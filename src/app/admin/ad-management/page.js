"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategoriesWithVendors } from "@/app/actions/public/categories";

import BannerCarouselContainer from "../components/sections/BannerCarousel";
import Link from "next/link";

const AdManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const placement = searchParams.get("placement") ?? "all";

  const [categories, setCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategoriesWithVendors();
      if (response?.success) {
        setCategories(response.categories || []);
      }
    };
    fetchCategories();
  }, []);

  const updateUrl = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback((value) => {
    updateUrl("search", value);
  }, [updateUrl]);

  // Local debounced search state (prevents frequent URL updates while typing)
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery || "");
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, handleSearch]);

  const handleStatusChange = (value) => {
    updateUrl("status", value);
  };

  const handlePlacementChange = (value) => {
    updateUrl("placement", value);
  };

  return (
    <div className="mb-10 dashboard-container space-y-8">

      {/* Filters */}
      <div className="p-7 bg-white border border-gray-200 space-y-5">
        <span className="uppercase text-sidebar-foreground tracking-widest">
          Ad Banner Management
        </span>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Banner Name or Vendor ID..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={placement} onValueChange={handlePlacementChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Placement" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Placements</SelectItem>
                
                <SelectGroup>
                  <SelectLabel>Static Pages</SelectLabel>
                  <SelectItem value="Hero Section">Hero Section</SelectItem>
                  <SelectItem value="Homepage Carousel">Homepage Carousel</SelectItem>
                  <SelectItem value="Contact">Contact</SelectItem>
                  <SelectItem value="Ideas">Ideas</SelectItem>
                  <SelectItem value="Gallery">Gallery</SelectItem>
                  <SelectItem value="Blog Page">Blog Page</SelectItem>
                </SelectGroup>

                {categories.length > 0 && categories.map((cat) => (
                  <SelectGroup key={cat._id}>
                    <SelectItem value={`Category: ${cat.name}`}>
                      {cat.name} (Main)
                    </SelectItem>
                    {cat.subCategories?.map((subCat) => (
                      <SelectItem
                        key={subCat._id}
                        value={`Subcategory: ${cat.name} > ${subCat.name}`}
                      >
                        <span className="pl-4">→ {subCat.name}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button asChild>
            <Link href="/admin/ad-management/new">
              <Plus className="w-5 mr-2" />
              Upload New Banner
            </Link>
          </Button>
        </div>

        <div className="w-full">
          <BannerCarouselContainer
            search={search}
            status={status}
            placement={placement}
          />
        </div>
      </div>
    </div>
  );
};

export default AdManagementPage;
