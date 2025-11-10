"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BannerCarouselContainer from "../components/BannerCarousel";
import Link from "next/link";

const AdManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all"; // ✅ Changed to "all"
  const placement = searchParams.get("placement") ?? "all"; // ✅ Changed to "all"

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

  const handleSearch = (value) => {
    updateUrl("search", value);
  };

  const handleStatusChange = (value) => {
    updateUrl("status", value);
  };

  const handlePlacementChange = (value) => {
    updateUrl("placement", value);
  };

  return (
    <div className="mb-10 dashboard-container space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-20">
        <div className="bg-white border border-gray-200 p-5">
          <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
            Total Banner Ads Running
          </span>
          <div className="mt-3 text-3xl font-semibold">134</div>
        </div>
        <div className="bg-white border border-gray-200 p-5">
          <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
            Total Vendors
          </span>
          <div className="mt-3 text-3xl font-semibold">48</div>
        </div>
        <div className="bg-white border border-gray-200 p-5">
          <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
            Total Revenue From Ads
          </span>
          <div className="text-3xl font-semibold">
            <span className="!text-base mr-1">AED</span> 55000/-
          </div>
        </div>
      </div>

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
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Placements</SelectItem>
                <SelectItem value="Homepage Carousel">Homepage</SelectItem>
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