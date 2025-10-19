"use client"

import * as React from "react"
import { useState, useMemo } from "react"

// --- Shadcn UI Imports (Updated to include Select for Pagination) ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch" 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    EllipsisVertical,
    Search,
    ChevronDown,
    Package,
    Clock,
    // Tag and DollarSign icons removed as they are no longer used
} from "lucide-react"

export const description = "Subscription Bundle Management Table"

// --- Bundle Sample Data ---
const initialBundleData = [
    {
        id: 1,
        name: "Launch Offer",
        duration: "3 Months",
        type: "Bundle",
        features: [
            "Unlimited category listing", "Dashboard access", "Logo & Gallery upload",
            "2 social media posts", "3-month free listing"
        ],
        subscribers: 471,
        priceAED: 1500,
        status: "Active",
    },
    {
        id: 2,
        name: "Starter Bundle (Popular)",
        duration: "1 Month",
        type: "Bundle",
        features: [
            "Unlimited category listing", "Dashboard access", "Logo & Gallery upload",
            "3 social media posts", "1 Featured Ad (in category - 1 month)"
        ],
        subscribers: 471,
        priceAED: 2600,
        status: "Inactive",
    },
    {
        id: 3,
        name: "Premium Bundle",
        duration: "1 Month",
        type: "Bundle",
        features: [
            "Unlimited category listings", "Vendor page banner ad - 3 months", "Analytics access",
            "5 social media posts", "2 category ads (2 weeks each)", "Blog feature"
        ],
        subscribers: 471,
        priceAED: 4800,
        status: "Inactive",
    },
    {
        id: 4,
        name: "Elite Bundle",
        duration: "1 Month",
        type: "Bundle",
        features: [
            "Unlimited category listing", "Home page feature (Kanya Recommends) - 1 month",
            "Home page banner ad - 1 month", "10 social media posts", "Analytics report",
            "Priority email support", "Blog feature", "1 banner ad - 1 category"
        ],
        subscribers: 471,
        priceAED: 8000,
        status: "Inactive",
    },
    {
        id: 5,
        name: "Visibility Booster",
        duration: "1 Month",
        type: "Add-on",
        features: [
            "1 home page banner", "1 category ad", "1 social media post"
        ],
        subscribers: 471,
        priceAED: 1000,
        status: "Inactive",
    },
];

// --- Main Bundle Management Table Component ---
export default function BundleTable({ controls = true }) {
    const [data, setData] = useState(initialBundleData);
    const [rowSelection, setRowSelection] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');

    // --- Filter State ---
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterStatuses, setFilterStatuses] = useState([]);

    // --- Helper to extract unique options for filters
    const uniqueTypes = useMemo(() => Array.from(new Set(data.map(d => d.type))).sort(), [data]);
    const uniqueStatuses = useMemo(() => Array.from(new Set(data.map(d => d.status))).sort(), [data]);


    // --- Core Filtering Logic ---
    const filteredData = useMemo(() => {
        let currentData = data;

        // 1. Apply Global Search Filter
        if (globalFilter) {
            const lowerCaseFilter = globalFilter.toLowerCase();
            currentData = currentData.filter(row =>
                row.name.toLowerCase().includes(lowerCaseFilter) ||
                row.features.some(feature => feature.toLowerCase().includes(lowerCaseFilter)) ||
                row.type.toLowerCase().includes(lowerCaseFilter)
            );
        }

        // 2. Apply Type Filter (Kept for filter UI, even if column is removed)
        if (filterTypes.length > 0) {
            currentData = currentData.filter(row => filterTypes.includes(row.type));
        }

        // 3. Apply Status Filter
        if (filterStatuses.length > 0) {
            currentData = currentData.filter(row => filterStatuses.includes(row.status));
        }

        // Reset page index on filter change
        setPageIndex(0);

        return currentData;
    }, [data, globalFilter, filterTypes, filterStatuses]);


    // --- Pagination Logic ---
    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, pageIndex, pageSize]);

    const pageCount = Math.ceil(filteredData.length / pageSize);

    // --- Row Selection Logic ---
    const toggleAllRowsSelected = (checked) => {
        const newSelection = checked ? Object.fromEntries(paginatedData.map((row) => [row.id, true])) : {};
        setRowSelection(newSelection);
    };

    const toggleRowSelected = (id) => {
        setRowSelection(prev => {
            const newSelection = { ...prev };
            if (newSelection[id]) {
                delete newSelection[id];
            } else {
                newSelection[id] = true;
            }
            return newSelection;
        });
    };

    const isRowSelected = (id) => !!rowSelection[id];

    const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => isRowSelected(row.id));
    const isSomeSelected = paginatedData.some(row => isRowSelected(row.id)) && !isAllSelected;

    const selectedRowCount = Object.keys(rowSelection).length;

    // --- Filter Handlers ---
    const handleTypeChange = (type) => {
        setFilterTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleStatusChange = (status) => {
        setFilterStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    // --- Action Handler (for the Switch) ---
    const handleStatusToggle = (id, checked) => {
        const newStatus = checked ? 'Active' : 'Inactive';
        setData(prevData =>
            prevData.map(bundle =>
                bundle.id === id ? { ...bundle, status: newStatus } : bundle
            )
        );
        // Clear selection if the status of a selected item changes
        setRowSelection({});
    };

    const headers = [
        "Bundle Name",
        "Duration",
        // "Type" column removed here
        "Features",
        "Subscribers",
        "Price (AED)",
        "Status",
        "Actions"
    ];


    return (
        <div className="w-full">
            {controls && (
                <div className="flex justify-between items-center gap-4 py-4">

                    {/* Left: Search Input */}
                    <div className="relative w-2/5 max-w-lg">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4" />
                        <Input
                            placeholder="Search bundles, features, or duration..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="w-full bg-white border-gray-300 h-11 pl-10"
                        />
                    </div>

                    {/* Right: Bulk Actions and Filters */}
                    <div className="flex items-center gap-2">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2 !bg-[#F2F4FF] text-primary">
                                        <span>Bulk Actions ({selectedRowCount})</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    <DropdownMenuItem onClick={() => { /* Implement bulk activation */ }}>Activate Selected</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { /* Implement bulk deactivation */ }}>Deactivate Selected</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { /* Implement bulk deletion */ }} className="text-red-600">
                                        Delete Bundles
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Type Filter (Kept for filtering purpose) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 !bg-[#F2F4FF] text-primary">
                                    Type {filterTypes.length > 0 && `(${filterTypes.length})`}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-56">
                                <DropdownMenuLabel>Filter by Bundle Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueTypes.map(type => (
                                    <DropdownMenuCheckboxItem
                                        key={type}
                                        checked={filterTypes.includes(type)}
                                        onCheckedChange={() => handleTypeChange(type)}
                                    >
                                        {type}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterTypes([])} className="text-blue-600 font-medium">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary">
                                    Status {filterStatuses.length > 0 && `(${filterStatuses.length})`}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterStatuses.includes(status)}
                                        onCheckedChange={() => handleStatusChange(status)}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterStatuses([])} className="text-blue-600 font-medium">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button className="ml-4 flex items-center gap-2" variant="default">
                            <Package className="w-4 h-4" />
                            <span>Create New Bundle</span>
                        </Button>

                    </div>

                </div>
            )}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden rounded-lg">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 z-10 bg-gray-50">
                            <TableRow>
                                <TableHead className="font-medium text-[#727272] h-12 w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected ? "indeterminate" : undefined}
                                        onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                {headers.map((header, index) => (
                                    <TableHead key={index} className="font-medium text-[#727272] h-12">
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((row) => {
                                const isActive = row.status === "Active";
                                return (
                                    <TableRow key={row.id} className="bg-white hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={isRowSelected(row.id)}
                                                onCheckedChange={() => toggleRowSelected(row.id)}
                                                aria-label="Select row"
                                            />
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-800">{row.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {row.duration}
                                            </div>
                                        </TableCell>
                                        {/* REMOVED: Type Column */}
                                        <TableCell>
                                            <ul className="list-disc list-inside text-sm text-gray-600">
                                                {row.features.slice(0, 3).map((feature, i) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                                {row.features.length > 3 && <li>... and {row.features.length - 3} more</li>}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{row.subscribers}</TableCell>
                                        <TableCell className="font-bold text-lg">
                                            <div className="text-gray-800">
                                                {/* REMOVED: DollarSign Icon */}
                                                {row.priceAED}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <Switch
                                                    checked={isActive}
                                                    onCheckedChange={(checked) => handleStatusToggle(row.id, checked)}
                                                    id={`status-switch-${row.id}`}
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-8 p-0" aria-label="More actions">
                                                            <EllipsisVertical className="w-5 text-gray-600" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 bg-white">
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit Bundle</DropdownMenuItem>
                                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            Delete Bundle
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!paginatedData.length && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="h-24 text-center text-gray-500">
                                        No bundles found matching your current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {controls && (
                <div className="mt-4 flex items-center justify-between">
                    {/* Left Side: Page Size Selector and Row Count */}
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
                            <Select
                                value={String(pageSize)}
                                onValueChange={(value) => {
                                    setPageSize(Number(value));
                                    setPageIndex(0);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[3, 5, 10].map((size) => (
                                        <SelectItem key={size} value={String(size)}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {selectedRowCount} of{" "}
                            {filteredData.length} row(s) visible. Total: {data.length}.
                        </div>
                    </div>

                    {/* Right Side: Page Counter and Navigation */}
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="text-sm font-medium text-muted-foreground">
                            Page {pageIndex + 1} of {pageCount}
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Previous Button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                                disabled={pageIndex === 0}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </Button>
                            {/* Next Button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setPageIndex(prev => prev + 1)}
                                disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                            >
                                <span className="sr-only">Go to next page</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}