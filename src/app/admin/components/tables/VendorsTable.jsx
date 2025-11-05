"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    EllipsisVertical,
    Search,
    ChevronDown,
    Mail,
    User,
    Star,
    Tag,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageCheck,
} from "lucide-react"
import Link from "next/link"

import { getInitials } from "@/utils"
import { getAllVendorsAction, updateVendorStatusAction } from "@/app/actions/admin/vendors"

export const description = "Vendors Management Table with API Integration"

// --- Helper component for HoverCard Content with Avatar
const VendorDetails = ({ vendor }) => (
    <div className="flex items-start space-x-4 p-1">
        <Avatar className="h-16 w-16">
            <AvatarImage src={vendor.ownerProfileImage} alt={vendor.businessName} />
            <AvatarFallback>{getInitials(vendor.businessName)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <h4 className="font-bold text-lg">{vendor.businessName}</h4>
            <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{vendor.ownerName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{vendor.mainCategories}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-blue-600 hover:underline">{vendor.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <PackageCheck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-semibold">{vendor.bundleName} - AED {vendor.bundlePrice}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-semibold">{vendor.rating} / 5.0</span>
            </div>
        </div>
    </div>
);

// --- Pagination Component ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    selectedRowCount,
    filteredVendorsCount,
    totalVendors,
    pageSizes = [15, 30, 50, 75, 100]
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Vendors per page</p>
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
                {filteredVendorsCount} of {totalVendors} vendor(s) visible.
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

// --- Main Vendors Table Component ---
export default function VendorsTable({ controls = true }) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalVendors, setTotalVendors] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    const [rowSelection, setRowSelection] = useState({})
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const [globalFilter, setGlobalFilter] = useState('')

    const [filterVendorStatus, setFilterVendorStatus] = useState('')
    const [filterSubscriptionStatus, setFilterSubscriptionStatus] = useState('')
    const [filterCity, setFilterCity] = useState('')

    const uniqueVendorStatuses = ['approved', 'pending', 'rejected']
    const uniqueSubscriptionStatuses = ['active', 'pending', 'expired']

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)
        setRowSelection({})

        try {
            const result = await getAllVendorsAction({
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                vendorStatus: filterVendorStatus,
                subscriptionStatus: filterSubscriptionStatus,
                city: filterCity,
            })

            if (result.success) {
                setData(result.data || [])
                setTotalVendors(result.pagination?.total || 0)
                setTotalPages(result.pagination?.pages || 0)
            } else {
                setData([])
                setTotalVendors(0)
                setTotalPages(0)
                setApiError(result.message)
            }

        } catch (error) {
            setApiError("Server connection failed.")
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, globalFilter, filterVendorStatus, filterSubscriptionStatus, filterCity])

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

    // --- Action Handlers ---
    const handleStatusChange = async (id, status) => {
        const res = await updateVendorStatusAction(id, status)

        if (res.success) {
            toast.success(res.message)
            fetchData()
        } else {
            toast.error(res.message)
        }
    }

    const handleBulkApprove = async () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id])

        if (selectedIds.length === 0) {
            toast.error("No vendors selected.")
            return
        }

        let successCount = 0
        for (const id of selectedIds) {
            try {
                const res = await updateVendorStatusAction(id, 'approved')
                if (res.success) successCount++
            } catch (error) {
                console.error(`Failed to approve ${id}:`, error)
            }
        }

        toast.success(`Approved ${successCount} vendor(s)`)
        setRowSelection({})
        fetchData()
    }

    const headers = [
        "No.",
        "Business Name",
        "Categories",
        "Owner",
        "City",
        "Rating",
        "Vendor Status",
        "Subscription",
        "Actions"
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': 
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'rejected':
            case 'expired':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search vendors..."
                            value={globalFilter}
                            onChange={(e) => {
                                setGlobalFilter(e.target.value)
                                setPageIndex(0)
                            }}
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
                                    <DropdownMenuItem onClick={handleBulkApprove}>
                                        Approve Selected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Vendor Status: {filterVendorStatus || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Vendor Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setFilterVendorStatus(''); setPageIndex(0) }}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueVendorStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterVendorStatus === status}
                                        onCheckedChange={() => {
                                            setFilterVendorStatus(status)
                                            setPageIndex(0)
                                        }}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Subscription: {filterSubscriptionStatus || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Subscription</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setFilterSubscriptionStatus(''); setPageIndex(0) }}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueSubscriptionStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterSubscriptionStatus === status}
                                        onCheckedChange={() => {
                                            setFilterSubscriptionStatus(status)
                                            setPageIndex(0)
                                        }}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}

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
                                        <p className="mt-2">Loading Vendors...</p>
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

                            {!isLoading && !apiError && data.map((row, index) => (
                                <TableRow key={row._id} className="hover:bg-gray-50">
                                    {console.log(row)}
                                    <TableCell>
                                        <Checkbox
                                            checked={isRowSelected(row._id)}
                                            onCheckedChange={() => toggleRowSelected(row._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">{pageIndex * pageSize + index + 1}</TableCell>
                                    <TableCell>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={row.businessLogo} alt={row.ownerName} />
                                                        <AvatarFallback>{getInitials(row.ownerName)}</AvatarFallback>
                                                    </Avatar>
                                                    <Link
                                                        href={`/admin/vendor-management/${row._id}`}
                                                        className="hover:underline hover:text-blue-600 font-medium"
                                                    >
                                                        {row.businessName}
                                                    </Link>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80 bg-white shadow-lg border p-3">
                                                <VendorDetails vendor={row} />
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell className="text-sm truncate max-w-[200px]">{row.mainCategories}</TableCell>
                                    <TableCell>{row.ownerName}</TableCell>
                                    <TableCell>{row.city}</TableCell>
                                    <TableCell>{row.rating.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(row.vendorStatus)}>
                                            {row.vendorStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(row.subscriptionStatus)}>
                                            {row.subscriptionStatus}
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
                                                    <Link href={`/admin/vendor-management/${row._id}`}>View Details</Link>
                                                </DropdownMenuItem>
                                                {row.vendorStatus === 'pending' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, 'approved')}>
                                                        Approve Vendor
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                {row.vendorStatus !== 'rejected' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, 'rejected')} className="text-red-600">
                                                        Reject Vendor
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!isLoading && data.length === 0 && !apiError && (
                                <TableRow>
                                    <TableCell colSpan={headers.length + 1} className="text-center text-gray-500">
                                        No vendors found matching filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && totalVendors > 0 && controls && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                    selectedRowCount={selectedRowCount}
                    filteredVendorsCount={data.length}
                    totalVendors={totalVendors}
                />
            )}
        </div>
    )
}