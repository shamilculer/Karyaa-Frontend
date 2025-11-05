"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"

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

// --- Pagination ---
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
                        setPageIndex(0)
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

    const [data, setData] = useState(initialBlogData)
    const [isLoading, setIsLoading] = useState(true)
    const [totalBlogs, setTotalBlogs] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(15)

    const [rowSelection, setRowSelection] = useState({})

    const uniqueStatuses = ["draft", "published"]

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)
        setRowSelection({})

        try {
            const result = await getAllBlogPosts({
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                status: statusFilter,
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
    }, [pageIndex, pageSize, globalFilter, statusFilter])

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchData()
        }, 300)
        return () => clearTimeout(delay)
    }, [fetchData])

    // ✅ Selection Logic
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

    // ✅ FIX: Only count current visible rows
    const selectedRowCount = data.filter(row => rowSelection[row._id]).length

    const handleStatusChange = (value) => {
        setStatusFilter(value === statusFilter ? "" : value)
        setPageIndex(0)
    }

    const handleGlobalFilterChange = (value) => {
        setGlobalFilter(value)
        setPageIndex(0)
    }

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
                            value={globalFilter}
                            onChange={(e) => handleGlobalFilterChange(e.target.value)}
                            disabled={isLoading}
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
                                    Status: {statusFilter || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange("")}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter === status}
                                        onCheckedChange={(checked) => handleStatusChange(status)}
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
                <div className="overflow-hidden border rounded-lg">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 z-10">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected}
                                        onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                    />
                                </TableHead>
                                {headers.map((header, i) => (
                                    <TableHead key={i}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
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
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                    selectedRowCount={selectedRowCount}
                    filteredArticlesCount={data.length}
                    totalArticles={totalBlogs}
                />
            )}
        </div>
    )
}

export default BlogsTable
