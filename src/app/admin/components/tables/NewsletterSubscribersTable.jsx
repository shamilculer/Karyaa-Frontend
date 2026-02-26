"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Mail, Search, ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllSubscribersAction, exportSubscribersAction } from "@/app/actions/admin/newsletter";

// --- Helper function for date formatting ---
const formatDate = (dateString, addTime = true) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    if (addTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return date.toLocaleDateString("en-US", options);
};

// --- Pagination Component ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    updateURLParams,
    filteredCount,
    totalCount,
    pageSizes = [15, 30, 50, 75, 100],
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
            <Select value={String(pageSize)} onValueChange={(v) => updateURLParams({ pageSize: v, page: '1' })}>
                <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                    {pageSizes.map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
                {filteredCount} of {totalCount} subscriber(s) visible.
            </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
            <p className="text-sm font-medium text-muted-foreground">
                Page {pageIndex + 1} of {pageCount}
            </p>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateURLParams({ page: String(pageIndex) })}
                    disabled={pageIndex === 0}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateURLParams({ page: String(pageIndex + 2) })}
                    disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
);

export default function NewsletterSubscribersTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [apiError, setApiError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    // Local state for search input (for debouncing)
    const [searchInput, setSearchInput] = useState('');

    // Read URL params
    const pageIndex = Number(searchParams.get('page') || '1') - 1;
    const pageSize = Number(searchParams.get('pageSize') || '15');
    const globalFilter = searchParams.get('search') || '';

    // Sync search input with URL on mount and when URL changes
    useEffect(() => {
        setSearchInput(globalFilter);
    }, [globalFilter]);

    // Helper function to update URL parameters
    const updateURLParams = useCallback((updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, pathname, router]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput !== globalFilter) {
                updateURLParams({ search: searchInput, page: '1' });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput, globalFilter, updateURLParams]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const result = await getAllSubscribersAction({
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
            });
            if (result.success) {
                setData(result.data || []);
                setTotalSubscribers(result.pagination?.total || 0);
                setTotalPages(result.pagination?.pages || 0);
            } else {
                setData([]);
                setTotalSubscribers(0);
                setTotalPages(0);
                setApiError(result.message);
            }
        } catch (e) {
            setApiError('Server connection failed.');
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, [pageIndex, pageSize, globalFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExport = async () => {
        setIsExporting(true);
        const toastId = toast.loading("Generating Excel file...");

        try {
            const res = await exportSubscribersAction({
                search: globalFilter,
            });

            if (res.success && res.data) {
                // Convert base64 to Blob
                const byteCharacters = atob(res.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: res.contentType });

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = res.filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.dismiss(toastId);
                toast.success("Export downloaded successfully!");
            } else {
                toast.dismiss(toastId);
                toast.error(res.message || "Failed to export subscribers");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("An error occurred during export");
            console.error("Export error:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const headers = [
        'Email Address',
        'Name',
        'Subscription Date',
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                <div className="relative w-full md:w-2/5 lg:max-w-md">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Search by email or name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300 shadow-sm"
                        onClick={handleExport}
                        disabled={isExporting || totalSubscribers === 0}
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export to Excel
                    </Button>
                </div>
            </div>

            <div className="relative flex flex-col gap-4 overflow-auto rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-hidden bg-white">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 z-10">
                            <TableRow>
                                {headers.map((header, i) => (
                                    <TableHead key={i} className="font-semibold text-gray-700">{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-gray-500">Loading Subscribers...</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            {apiError && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center py-10 text-red-600">
                                        {apiError}
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && !apiError && data.map((row) => (
                                <TableRow key={row._id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{row.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {row.name || <span className="text-gray-400 italic">Not provided</span>}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(row.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && data.length === 0 && !apiError && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Mail className="w-10 h-10 text-gray-300 mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No subscribers found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your search filters if looking for someone specific.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {!isLoading && totalSubscribers > 0 && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    updateURLParams={updateURLParams}
                    filteredCount={data.length}
                    totalCount={totalSubscribers}
                />
            )}
        </div>
    );
}
