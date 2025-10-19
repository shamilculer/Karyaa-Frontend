"use client"

import * as React from "react"
import { useState, useMemo } from "react"

// --- Shadcn UI Imports ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" 
import { Input } from "@/components/ui/input"
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
    Image as ImageIcon,
    FileText,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

export const description = "Blog Management Table"

// --- Blog Sample Data ---
const initialBlogData = [
    {
        id: 1,
        title: "The Ultimate Guide to Event Planning in Dubai",
        imageUrl: "https://via.placeholder.com/50",
        author: "Nora Khuder",
        createdAt: "2025-09-28",
        slug: "ultimate-guide-event-planning-dubai",
        status: "Published",
    },
    {
        id: 2,
        title: "Top 5 Unique Wedding Venues for 2026",
        imageUrl: "https://via.placeholder.com/50",
        author: "Admin User",
        createdAt: "2025-09-25",
        slug: "top-5-unique-wedding-venues-2026",
        status: "Draft",
    },
    {
        id: 3,
        title: "How to Choose the Right Florist for Your Event",
        imageUrl: "https://via.placeholder.com/50",
        author: "Nora Khuder",
        createdAt: "2025-09-20",
        slug: "choose-right-florist-event",
        status: "Published",
    },
    {
        id: 4,
        title: "Budgeting Tips for a Destination Wedding",
        imageUrl: "https://via.placeholder.com/50",
        author: "Guest Writer",
        createdAt: "2025-09-15",
        slug: "budgeting-tips-destination-wedding",
        status: "Draft",
    },
    {
        id: 5,
        title: "Must-Have Tech for Modern Event Planners",
        imageUrl: "https://via.placeholder.com/50",
        author: "Tech Blogger",
        createdAt: "2025-09-10",
        slug: "must-have-tech-modern-event-planners",
        status: "Published",
    },
    {
        id: 6,
        title: "A Deep Dive into Dubai's Wedding Market",
        imageUrl: "https://via.placeholder.com/50",
        author: "Nora Khuder",
        createdAt: "2025-09-01",
        slug: "deep-dive-dubais-wedding-market",
        status: "Published",
    },
];

// --- Table Pagination Sub-Component (Uses Shadcn Select and Button) ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    selectedRowCount,
    filteredArticlesCount,
    totalArticles,
    pageSizes = [3, 5, 10]
}) => (
    <div className="mt-4 flex items-center justify-between">
        {/* Left Side: Page Size Selector and Row Count */}
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Articles per page</p>
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
                        {pageSizes.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="text-sm text-muted-foreground">
                {selectedRowCount > 0 
                    ? `${selectedRowCount} selected. ` 
                    : ''} 
                {filteredArticlesCount} of {totalArticles} article(s) visible.
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
                    <ChevronLeft />
                </Button>
                {/* Next Button */}
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(prev => prev + 1)}
                    disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
);


// --- Main Blog Table Component ---
const BlogsTable = ({ controls = true }) => {
    const [data] = useState(initialBlogData);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filterStatuses, setFilterStatuses] = useState([]);

    // --- State for Selection and Pagination ---
    const [rowSelection, setRowSelection] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    // Note: page size set to 3 initially
    const [pageSize, setPageSize] = useState(3); 

    // Helper to extract unique options for filters
    const uniqueStatuses = useMemo(() => Array.from(new Set(data.map(d => d.status))).sort(), [data]);

    // --- Core Filtering Logic ---
    const filteredData = useMemo(() => {
        let currentData = data;

        // 1. Apply Global Search Filter
        if (globalFilter) {
            const lowerCaseFilter = globalFilter.toLowerCase();
            currentData = currentData.filter(row =>
                row.title.toLowerCase().includes(lowerCaseFilter) ||
                row.author.toLowerCase().includes(lowerCaseFilter) ||
                row.slug.toLowerCase().includes(lowerCaseFilter)
            );
        }

        // 2. Apply Status Filter
        if (filterStatuses.length > 0) {
            currentData = currentData.filter(row => filterStatuses.includes(row.status));
        }
        
        // Reset page index on filter change (using requestAnimationFrame for safe state update)
        if (pageIndex !== 0) {
            requestAnimationFrame(() => setPageIndex(0));
        }

        return currentData;
    }, [data, globalFilter, filterStatuses]);

    // --- Pagination Logic ---
    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, pageIndex, pageSize]);

    const pageCount = Math.ceil(filteredData.length / pageSize);
    const totalArticles = data.length;
    const filteredArticlesCount = filteredData.length;


    // --- Row Selection Logic ---
    const toggleAllRowsSelected = (checked) => {
        const currentPageIds = paginatedData.map(row => row.id);

        setRowSelection(prev => {
            // Filter out previously selected items that are on the current page
            let newSelection = Object.fromEntries(
                Object.entries(prev).filter(([id]) => !currentPageIds.includes(parseInt(id)))
            );

            if (checked) {
                // Add all current page IDs to selection
                currentPageIds.forEach(id => {
                    newSelection[id] = true;
                });
            }
            return newSelection;
        });
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

    // Checkbox states based on current page
    const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => isRowSelected(row.id));
    const isSomeSelected = paginatedData.some(row => isRowSelected(row.id)) && !isAllSelected;

    const selectedRowCount = Object.keys(rowSelection).length;
    
    // --- Filter Handler ---
    const handleStatusChange = (status) => {
        setFilterStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
        // Clearing selection on filter change
        setRowSelection({}); 
    };

    const headers = [
        "ID",
        "Title",
        "Image",
        "Author",
        "Created At",
        "Slug",
        "Status",
        "Actions"
    ];


    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">

                    {/* Left: Search Input */}
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search by title, author, or slug..."
                            value={globalFilter ?? ""}
                            onChange={(event) => {
                                setGlobalFilter(event.target.value);
                                setRowSelection({}); // Clear selection on search
                            }}
                            className="w-full bg-white border-gray-300 h-10 pl-10 placeholder:text-gray-500"
                        />
                    </div>

                    {/* Right: Bulk Actions, Filters and New Blog Button */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        
                        {/* Bulk Actions Dropdown (Conditional) */}
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex items-center gap-2 !bg-[#F2F4FF] text-primary h-10 border border-gray-300">
                                        <span className="font-semibold">Bulk Actions</span>
                                        <Badge className="bg-primary hover:bg-primary text-white p-1 px-2 rounded-full h-auto text-xs">{selectedRowCount}</Badge>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                    <DropdownMenuItem onClick={() => { /* Implement bulk publish */ }}>Publish Selected</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { /* Implement bulk draft */ }}>Draft Selected</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { /* Implement bulk deletion */ }} className="text-red-600">
                                        Delete Selected Articles
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        
                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary h-10 border border-gray-300">
                                    <span>Status</span> {filterStatuses.length > 0 && <Badge className="bg-primary hover:bg-primary text-white p-1 px-2 rounded-full h-auto text-xs">{filterStatuses.length}</Badge>}
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
                                <DropdownMenuItem onClick={() => setFilterStatuses([])} className="text-blue-600 font-medium cursor-pointer">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Create New Blog Button */}
                        <Button className="ml-4 flex items-center gap-2 bg-primary hover:bg-blue-700 h-10" variant="default">
                            <FileText className="w-4 h-4" />
                            <span>Create New Blog</span>
                        </Button>

                    </div>
                </div>
            )}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 z-10 bg-gray-50">
                            <TableRow>
                                <TableHead className="font-medium text-[#727272] h-12 w-12">
                                    {/* Checkbox for selecting all visible rows */}
                                    <Checkbox
                                        checked={isAllSelected}
                                        // The 'indeterminate' prop/value is specific to the Checkbox component's internal handling of state, 
                                        // often controlled by an `aria-checked="mixed"` or a specific visual prop. 
                                        // The original code used a conditional string, which is correct for Shadcn's visual indeterminate state.
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
                                const isPublished = row.status === "Published";
                                return (
                                    <TableRow key={row.id} className="bg-white hover:bg-gray-50">
                                        {/* Row Checkbox */}
                                        <TableCell>
                                            <Checkbox
                                                checked={isRowSelected(row.id)}
                                                onCheckedChange={() => toggleRowSelected(row.id)}
                                                aria-label="Select row"
                                            />
                                        </TableCell>
                                        {/* ID */}
                                        <TableCell className="font-medium text-gray-500">{row.id}</TableCell>
                                        {/* Title */}
                                        <TableCell className="font-semibold text-gray-800 max-w-xs truncate">{row.title}</TableCell>
                                        {/* Image */}
                                        <TableCell>
                                            <div className="size-10 bg-gray-100 rounded flex items-center justify-center border">
                                                <ImageIcon className="size-5 text-gray-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.author}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{row.createdAt}</TableCell>
                                        <TableCell className="text-sm text-blue-600 max-w-xs truncate">{row.slug}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`font-medium ${isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                            >
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center w-20">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0" aria-label="More actions">
                                                        <EllipsisVertical className="w-5 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white">
                                                    <DropdownMenuItem className="cursor-pointer">View Post</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">Edit Content</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">Change Status</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 cursor-pointer">
                                                        Delete Blog
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!paginatedData.length && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="h-24 text-center text-gray-500">
                                        No blogs found matching your current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Pagination Controls Component */}
            {controls && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={pageCount}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                    selectedRowCount={selectedRowCount}
                    filteredArticlesCount={filteredArticlesCount}
                    totalArticles={totalArticles}
                />
            )}
        </div>
    )
}

export default BlogsTable