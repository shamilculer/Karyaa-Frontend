"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Loader2,
    Star,
    MapPin,
    ExternalLink,
    StarOff,
    Plus,
    EllipsisVertical,
} from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/utils";
import { getRecommendedVendorsAction } from "@/app/actions/admin/recommendedVendors";
import { toggleVendorRecommendedAction } from "@/app/actions/admin/vendors";
import { VendorSelectField } from "@/components/common/VendorSelectField";

// Helper function for date formatting
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function RecommendedVendorsTable() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [totalVendors, setTotalVendors] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    // Initialize form for VendorSelectField
    const methods = useForm({
        defaultValues: {
            selectedVendor: ""
        }
    });

    const selectedVendor = methods.watch("selectedVendor");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getRecommendedVendorsAction({
                page,
                limit: pageSize,
                search: debouncedSearch,
            });

            if (result.success) {
                setData(result.data || []);
                setTotalVendors(result.pagination?.total || 0);
                setTotalPages(result.pagination?.pages || 0);
            } else {
                setData([]);
                setTotalVendors(0);
                setTotalPages(0);
                toast.error(result.message || "Failed to fetch recommended vendors");
            }
        } catch (error) {
            console.error("Error fetching recommended vendors:", error);
            toast.error("An error occurred while fetching vendors");
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, debouncedSearch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddVendor = async () => {
        if (!selectedVendor) {
            toast.error("Please select a vendor to add");
            return;
        }

        // Check if vendor is already in the list
        if (data.some(v => v._id === selectedVendor)) {
            toast.error("This vendor is already recommended");
            methods.reset({ selectedVendor: "" });
            return;
        }

        setIsAdding(true);
        const toastId = toast.loading("Adding vendor to recommendations...");
        try {
            const result = await toggleVendorRecommendedAction(selectedVendor);
            if (result.success) {
                toast.dismiss(toastId);
                toast.success("Vendor added to recommendations!");
                methods.reset({ selectedVendor: "" });
                fetchData(); // Refresh the list
            } else {
                toast.dismiss(toastId);
                toast.error(result.message || "Failed to add vendor");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Error adding vendor:", error);
            toast.error("An error occurred");
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleRecommendation = async (vendorId, businessName) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${businessName}" from Karyaa Recommends?`
        );

        if (!confirmed) return;

        const toastId = toast.loading("Updating recommendation status...");
        try {
            const result = await toggleVendorRecommendedAction(vendorId);
            if (result.success) {
                toast.dismiss(toastId);
                toast.success(result.message || "Recommendation status updated");
                fetchData(); // Refresh the list
            } else {
                toast.dismiss(toastId);
                toast.error(result.message || "Failed to update recommendation status");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Error toggling recommendation:", error);
            toast.error("An error occurred");
        }
    };

    const headers = [
        "Business",
        "Category",
        "Bundle",
        "Start Date",
        "End Date",
        "Rating",
        "Actions",
    ];

    return (
        <div className="w-full space-y-4">
            {/* Add Vendor Section */}
            <div>
                <div className="pt-6">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">
                                Add Vendor to Recommendations
                            </label>
                            <FormProvider {...methods}>
                                <VendorSelectField
                                    name="selectedVendor"
                                    valueKey="_id"
                                    placeholder="Search and select a vendor..."
                                />
                            </FormProvider>
                        </div>
                        <Button
                            onClick={handleAddVendor}
                            disabled={!selectedVendor || isAdding}
                        >
                            {isAdding ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Vendor
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Search recommended vendors..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    {totalVendors} recommended vendor{totalVendors !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            {headers.map((header, i) => (
                                <TableHead key={i}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={headers.length} className="text-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                    <p className="mt-2 text-gray-500">Loading recommended vendors...</p>
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={headers.length} className="text-center py-12 text-gray-500">
                                    {debouncedSearch
                                        ? "No recommended vendors found matching your search."
                                        : "No recommended vendors yet. Use the field above to add vendors to recommendations."}
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && data.map((vendor) => (
                            <TableRow key={vendor._id} className="hover:bg-gray-50">
                                {/* Business Name & Logo */}
                                <TableCell className="max-w-[250px]">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={vendor.businessLogo} alt={vendor.businessName} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {getInitials(vendor.businessName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{vendor.businessName}</span>
                                            {vendor.tagline && (
                                                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                    {vendor.tagline}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Category */}
                                <TableCell className="text-sm text-gray-700 max-w-[200px] truncate">
                                    {vendor.mainCategories || "N/A"}
                                </TableCell>

                                {/* Bundle */}
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium">{vendor.bundleName || "N/A"}</span>
                                        {vendor.bundlePrice && (
                                            <span className="text-xs text-gray-500">AED {vendor.bundlePrice}</span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Start Date */}
                                <TableCell className="text-sm text-gray-700">
                                    {formatDate(vendor.subscriptionStartDate)}
                                </TableCell>

                                {/* End Date */}
                                <TableCell className="text-sm text-gray-700">
                                    {formatDate(vendor.subscriptionEndDate)}
                                </TableCell>

                                {/* Rating */}
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-sm">
                                            {vendor.rating ? vendor.rating.toFixed(1) : "N/A"}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-center">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Link className="w-full" href={`/admin/vendor-management/${vendor._id}`}>View Details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleToggleRecommendation(vendor._id, vendor.businessName)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <StarOff className="w-4 h-4 mr-2" />
                                                Remove from Recommendations
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
