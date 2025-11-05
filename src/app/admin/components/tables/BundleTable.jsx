"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"

import { getAllBundlesAction, deleteBundleAction, toggleBundleStatusAction } from "@/app/actions/admin/bundle"

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
    ChevronLeft,
    ChevronRight,
    Loader2,
    Zap,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import CreateBundleModal from "../CreateBundelModal"
import EditBundleModal from "../EditBundleModal"

export const description = "Bundle Management Table"

const initialBundleData = []

// --- Helper Functions ---
const formatPrice = (price, currency = 'AED') => {
    return `${currency} ${price.toLocaleString('en-US')}`
}

const formatDuration = (duration) => {
    if (!duration || !duration.value || !duration.unit) return 'N/A'
    const { value, unit } = duration
    const formattedUnit = value === 1 ? unit.replace(/s$/, '') : unit
    return `${value} ${formattedUnit}`
}

// --- Pagination ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    selectedRowCount,
    filteredBundlesCount,
    totalBundles,
    pageSizes = [15, 30, 50, 75, 100]
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Bundles per page</p>
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
                {filteredBundlesCount} of {totalBundles} bundle(s) visible.
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
const BundlesTable = ({ controls = true }) => {

    const [data, setData] = useState(initialBundleData)
    const [isLoading, setIsLoading] = useState(true)
    const [totalBundles, setTotalBundles] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(15)

    const [rowSelection, setRowSelection] = useState({})

    const [selectedBundle, setSelectedBundle] = useState(null);
    const [editOpen, setEditOpen] = useState(false);


    const uniqueStatuses = ["active", "inactive"]

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)
        setRowSelection({})

        try {
            const result = await getAllBundlesAction({
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                status: statusFilter,
            })

            if (result.success) {
                setData(result.data || [])
                setTotalBundles(result.pagination?.total || 0)
                setTotalPages(result.pagination?.pages || 0)
            } else {
                setData([])
                setTotalBundles(0)
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

    // --- Selection Logic ---
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

    const selectedRowCount = data.filter(row => rowSelection[row._id]).length

    const handleStatusChange = (value) => {
        setStatusFilter(value === statusFilter ? "" : value)
        setPageIndex(0)
    }

    const handleGlobalFilterChange = (value) => {
        setGlobalFilter(value)
        setPageIndex(0)
    }

    // --- Action Handlers ---
    const handleBundleDelete = async (id) => {
        if (!confirm("Delete this bundle?")) return

        try {
            const res = await deleteBundleAction(id)

            if (!res || !res.success) {
                toast.error(res?.message || "Failed to delete bundle.")
                return
            }

            toast.success(res.message)
            fetchData()

        } catch (error) {
            console.error("Delete bundle error:", error)
            toast.error(error?.message || "Unexpected error during delete.")
        }
    }

    const handleBulkDelete = async () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id])

        if (selectedIds.length === 0) {
            toast.error("No bundles selected.")
            return
        }

        if (!confirm(`Delete ${selectedIds.length} bundle(s)?`)) return

        // Delete one by one since your API doesn't support bulk delete
        let successCount = 0
        for (const id of selectedIds) {
            try {
                const res = await deleteBundleAction(id)
                if (res.success) successCount++
            } catch (error) {
                console.error(`Failed to delete ${id}:`, error)
            }
        }

        toast.success(`Deleted ${successCount} bundle(s)`)
        setRowSelection({})
        fetchData()
    }

    const handleToggle = async (id) => {
        try {
            const res = await toggleBundleStatusAction(id)

            if (res.success) {
                toast.success(res.message)
                fetchData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Failed to toggle status")
        }
    }

    // --- Headers ---
    const headers = [
        "Name",
        "Price",
        "Duration",
        "Subscribers",
        "Popular",
        "Recommended",
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
                            placeholder="Search by name or description..."
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
                                        onCheckedChange={() => handleStatusChange(status)}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <CreateBundleModal onSuccess={fetchData} />
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
                                        <p className="mt-2">Loading Bundles...</p>
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
                                const isActive = row.status === "active"
                                const isPopular = row.isPopular
                                const includesRecommended = row.includesRecommended

                                return (
                                    <TableRow key={row._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={isRowSelected(row._id)}
                                                onCheckedChange={() => toggleRowSelected(row._id)}
                                            />
                                        </TableCell>

                                        <TableCell className="font-medium truncate max-w-[250px]">{row.name}</TableCell>

                                        <TableCell>
                                            <span className="font-semibold text-primary">
                                                {formatPrice(row.price)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {formatDuration(row.duration)}
                                        </TableCell>

                                        <TableCell className="font-mono text-sm">{row.subscribersCount || 0}</TableCell>

                                        <TableCell>
                                            {isPopular ? (
                                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    Popular
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {includesRecommended ? (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                    Yes
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                                                {isActive ? "Active" : "Inactive"}
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedBundle(row);
                                                            setEditOpen(true);
                                                        }}
                                                    >
                                                        Edit Bundle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggle(row._id)}>
                                                        Toggle Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleBundleDelete(row._id)} className="text-red-600">
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
                                        No bundles found matching filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && totalBundles > 0 && controls && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                    selectedRowCount={selectedRowCount}
                    filteredBundlesCount={data.length}
                    totalBundles={totalBundles}
                />
            )}

            {selectedBundle && (
                <EditBundleModal
                    open={editOpen}
                    setOpen={setEditOpen}
                    bundle={selectedBundle}
                    onSuccess={() => {
                        // Optional: refetch your bundles list after update
                        fetchBundles();
                        setSelectedBundle(null);
                    }}
                />
            )}
        </div>
    )
}

export default BundlesTable