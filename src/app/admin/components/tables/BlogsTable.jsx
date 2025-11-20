"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
// ➡️ Import navigation hooks from next/navigation
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { getAllBlogPosts, deleteBlogPosts, toggleBlogStatusAction } from "@/app/actions/admin/blog"

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
    FileText,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export const description = "Blog Management Table"

const initialBlogData = []

// --- Pagination (Assuming no changes needed here) ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    selectedRowCount,
    filteredArticlesCount,
    totalArticles,
    pageSizes = [15, 30, 50, 75, 100]
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Articles per page</p>
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                        setPageSize(Number(value))
                        setPageIndex(0) // Reset to page 1 on size change
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize || "15"} />
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
                {selectedRowCount > 0 && `${selectedRowCount} selected. `}
                {filteredArticlesCount} of {totalArticles} article(s) visible.
            </div>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="text-sm font-medium text-muted-foreground">
                Page {pageIndex + 1} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                    disabled={pageIndex === 0}
                >
                    <ChevronLeft />
                </Button>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(prev => prev + 1)}
                    disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
)

// -----------------------------
// Main Component
// -----------------------------
const BlogsTable = ({ controls = true }) => {

    // ➡️ Hooks for URL state management
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // ➡️ Derive state from URL params, use defaults if not present
    const urlPageIndex = Number(searchParams.get("page") || 1) - 1 // URL page is 1-based
    const urlPageSize = Number(searchParams.get("limit") || 15)
    const urlGlobalFilter = searchParams.get("search") || ""
    const urlStatusFilter = searchParams.get("status") || ""


    // ✅ Keep state for data, loading, error, and row selection
    const [data, setData] = useState(initialBlogData)
    const [isLoading, setIsLoading] = useState(true)
    const [totalBlogs, setTotalBlogs] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    const [rowSelection, setRowSelection] = useState({})

    const uniqueStatuses = ["draft", "published"]

    // ➡️ Helper function to create new URL search params string
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === "" || value === 0) {
                params.delete(name)
            } else {
                params.set(name, value)
            }
            // Reset page index on filter/size change, unless we're just changing the page
            if (name !== 'page' && name !== 'limit') {
                params.delete('page');
            }
            return params.toString()
        },
        [searchParams]
    )

    // ➡️ Functions to update URL parameters
    const handleSetPageIndex = useCallback((newIndex) => {
        // newIndex is 0-based, URL page is 1-based
        const targetPage = typeof newIndex === 'function' ? newIndex(urlPageIndex) : newIndex;
        router.push(pathname + '?' + createQueryString('page', targetPage + 1))
    }, [createQueryString, pathname, router, urlPageIndex]);

    const handleSetPageSize = useCallback((newSize) => {
        router.push(pathname + '?' + createQueryString('limit', newSize))
    }, [createQueryString, pathname, router]);

    const handleStatusChange = useCallback((status) => {
        const value = status === urlStatusFilter ? "" : status;
        router.push(pathname + '?' + createQueryString('status', value))
    }, [createQueryString, pathname, router, urlStatusFilter]);

    const handleGlobalFilterChange = useCallback((value) => {
        router.push(pathname + '?' + createQueryString('search', value))
    }, [createQueryString, pathname, router]);

    // Local debounced search state (mirror of URL `search` param)
    const [searchQuery, setSearchQuery] = useState(urlGlobalFilter);

    // Keep local input synced when URL search changes (e.g., external navigation)
    useEffect(() => {
        setSearchQuery(urlGlobalFilter);
    }, [urlGlobalFilter]);

    // Debounce local search input and update URL when user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            handleGlobalFilterChange(searchQuery || "");
        }, 50);

        return () => clearTimeout(handler);
    }, [searchQuery, handleGlobalFilterChange]);


    // ➡️ Re-use fetchData, but now it depends on URL state (urlPageIndex, urlPageSize, etc.)
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)
        setRowSelection({}) // Clear selection on new data load

        try {
            const result = await getAllBlogPosts({
                // Pass URL derived values
                page: urlPageIndex + 1, // API page is 1-based
                limit: urlPageSize,
                search: urlGlobalFilter,
                status: urlStatusFilter,
            })

            if (result.success) {
                setData(result.data)
                setTotalBlogs(result.total)
                setTotalPages(result.totalPages)
            } else {
                setData([])
                setTotalBlogs(0)
                setTotalPages(0)
                setApiError(result.message)
            }

        } catch (error) {
            setApiError("Server connection failed.")
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [urlPageIndex, urlPageSize, urlGlobalFilter, urlStatusFilter]) // ➡️ Dependencies are the URL-derived values

    useEffect(() => {
        // Debounce for search input (globalFilter)
        const delay = setTimeout(() => {
            fetchData()
        }, 300)
        return () => clearTimeout(delay)
    }, [fetchData]) // ➡️ Re-run when URL state changes (via fetchData dependency)

    // ... (rest of the component logic remains the same, only using url* variables)

    // ✅ Selection Logic (unchanged)
    const toggleRowSelected = (id) => {
        setRowSelection(prev => ({
            ...prev,
            [id]: !prev[id]
        }))

    }

    const isRowSelected = (id) => !!rowSelection[id]

    const isAllSelected = data.length > 0 && data.every(row => isRowSelected(row._id))
    const isSomeSelected = data.some(row => isRowSelected(row._id)) && !isAllSelected

    const toggleAllRowsSelected = (checked) => {
        const currentPageIds = data.map(row => row._id)

        setRowSelection(prev => {
            let newSelection = Object.fromEntries(
                Object.entries(prev).filter(([id]) => !currentPageIds.includes(id))
            )

            if (checked) {
                currentPageIds.forEach(id => {
                    newSelection[id] = true
                })
            }

            return newSelection
        })
    }

    // ✅ FIX: Only count current visible rows (unchanged)
    const selectedRowCount = data.filter(row => rowSelection[row._id]).length


    // ... (handleBlogDelete, handleBulkDelete, handleToggle, handleBulkToggle remain the same)
    const handleBlogDelete = async (ids) => {
        try {
            const idArray = Array.isArray(ids) ? ids : [ids];

            const res = await deleteBlogPosts(idArray);

            if (!res || !res.success) {
                toast.error(res?.message || "Failed to delete blog post(s).");
                return;
            }

            toast.success(res.message);
            fetchData()

        } catch (error) {
            console.error("Delete blog error:", error);
            toast.error(error?.message || "Unexpected error during delete.");
        }
    };

    const handleBulkDelete = async () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);

        if (selectedIds.length === 0) {
            toast.error("No blog posts selected.");
            return;
        }

        if (!confirm(`Delete ${selectedIds.length} blog post(s)?`)) return;

        await handleBlogDelete(selectedIds);
        setRowSelection({}); // clears selection
    };

    const handleToggle = async (id, status) => {
        const res = await toggleBlogStatusAction({ id, status });

        if (res.success) {
            toast.success(res.message);
            fetchData()
        } else {
            toast.error(res.message);
        }
    };


    const handleBulkToggle = async (status) => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);

        if (selectedIds.length === 0) {
            toast.error("No blog posts selected.");
            return;
        }

        const res = await toggleBlogStatusAction({ ids: selectedIds, status });


        if (res.success) {
            toast.success(res.message);
            fetchData()
        } else {
            toast.error(res.message);
        }
    };
    // ...

    const headers = [
        "Title",
        "Image",
        "Author",
        "Created At",
        "Slug",
        "Status",
        "Actions"
    ]

    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search by title, author, slug..."
                            // Use local state while typing; URL is updated after debounce
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-[#F2F4FF] border border-gray-300 text-primary">
                                        Bulk Actions
                                        <Badge className="bg-primary text-white px-2 rounded-full">
                                            {selectedRowCount}
                                        </Badge>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => { handleBulkToggle("published") }} >Publish Selected</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { handleBulkToggle("draft") }} >Draft Selected</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                                        Delete Selected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    {/* ➡️ Use URL-derived value */}
                                    Status: {urlStatusFilter || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* ➡️ Use URL updater function */}
                                <DropdownMenuItem onClick={() => handleStatusChange("")}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        // ➡️ Compare against URL-derived value
                                        checked={urlStatusFilter === status}
                                        // ➡️ Use URL updater function
                                        onCheckedChange={() => handleStatusChange(status)}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button asChild className="bg-primary text-white flex gap-2">
                            <Link href="/admin/content-moderation/blog/add">
                                <FileText className="w-4 h-4" />
                                Create New Blog
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 z-10">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected || undefined}
                                        onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                    />
                                </TableHead>
                                {headers.map((header, i) => (
                                    <TableHead key={i}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* ... (Loading/Error states unchanged) ... */}
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="mt-2">Loading...</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {apiError && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="text-center text-red-600">
                                        {apiError}
                                    </TableCell>
                                </TableRow>
                            )}
                            
                            {!isLoading && !apiError && data.map((row) => {
                                const isPublished = row.status === "published"
                                return (
                                    <TableRow key={row._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={isRowSelected(row._id)}
                                                onCheckedChange={() => toggleRowSelected(row._id)}
                                            />
                                        </TableCell>

                                        <TableCell className="font-medium truncate max-w-[350px]">
                                            {row.title}
                                        </TableCell>

                                        <TableCell>
                                            <div className="size-10 bg-gray-100 rounded flex items-center justify-center relative">
                                                <Image
                                                    src={row.coverImage}
                                                    alt={row.title}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>{row.author?.fullName || "N/A"}</TableCell>
                                        <TableCell>{format(row.createdAt, "dd-MM-yyyy")}</TableCell>
                                        <TableCell className="text-blue-600 truncate max-w-[250px]">{row.slug}</TableCell>

                                        <TableCell>
                                            <Badge className={isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                                {isPublished ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Link href={`/blog/${row.slug}`}>View Post</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href={`/admin/content-moderation/blog/edit?id=${row._id}`}>Edit Post</Link>
                                                    </DropdownMenuItem>
                                                    {row.status === "draft" && (
                                                        <DropdownMenuItem onClick={() => handleToggle(row._id, "published")} >Publish</DropdownMenuItem>
                                                    )}
                                                    {row.status === "published" && (
                                                        <DropdownMenuItem onClick={() => handleToggle(row._id, "draft")} >Move to Draft</DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleBlogDelete(row._id)} className="text-red-600">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                            {!isLoading && data.length === 0 && !apiError && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="text-center text-gray-500">
                                        No blogs found matching filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && totalBlogs > 0 && controls && (
                <TablePagination
                    // ➡️ Pass URL-derived values and setter functions
                    pageIndex={urlPageIndex}
                    pageCount={totalPages}
                    pageSize={urlPageSize}
                    setPageIndex={handleSetPageIndex}
                    setPageSize={handleSetPageSize}
                    selectedRowCount={selectedRowCount}
                    filteredArticlesCount={data.length}
                    totalArticles={totalBlogs}
                />
            )}
        </div>
    )
}

export default BlogsTable