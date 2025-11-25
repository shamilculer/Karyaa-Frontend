"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    EllipsisVertical,
    Search,
    ChevronDown,
    Mail,
    User,
    Tag,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageCheck,
    Globe,
    MapPin,
} from "lucide-react"
import Link from "next/link"

import { getInitials } from "@/utils"
import { getAllVendorsAction, updateVendorStatusAction } from "@/app/actions/admin/vendors"

export const description = "Vendors Management Table with URL-based Filtering"

// --- Helper function for date formatting ---
const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// --- Helper component for HoverCard Content with Avatar ---
const VendorDetails = ({ vendor }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                <AvatarImage src={vendor.ownerProfileImage} alt={vendor.businessName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(vendor.businessName)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h4 className="font-bold text-lg leading-tight">{vendor.businessName}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{vendor.ownerName}</span>
                </div>
            </div>
        </div>

        <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Category</span>
                    <span className="font-medium">{vendor.mainCategories}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <span className="font-medium break-all">{vendor.email}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Location</span>
                    <span className="font-medium">{vendor.city}, {vendor.country}</span>
                </div>
            </div>

            {vendor.isInternational && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Type</span>
                        <span className="font-medium text-indigo-600">International Vendor</span>
                    </div>
                </div>
            )}

            <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-4">
                <div>
                    <span className="text-xs text-muted-foreground block mb-1">Subscription</span>
                    <div className="flex items-center gap-1.5">
                        <PackageCheck className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-medium">{vendor.bundleName}</span>
                    </div>
                </div>
                <div>
                    <span className="text-xs text-muted-foreground block mb-1">Price</span>
                    <span className="font-medium">AED {vendor.bundlePrice}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-xs text-muted-foreground block mb-1">Start Date</span>
                    <span className="font-medium">{formatDate(vendor.subscriptionStart)}</span>
                </div>
                <div>
                    <span className="text-xs text-muted-foreground block mb-1">End Date</span>
                    <span className="font-medium">{formatDate(vendor.subscriptionEnd)}</span>
                </div>
            </div>
        </div>
    </div>
)

// --- Pagination Component ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    updateURLParams,
    selectedRowCount,
    filteredVendorsCount,
    totalVendors,
    pageSizes = [15, 30, 50, 75, 100],
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <p className="text-sm font-medium text-muted-foreground">Vendors per page</p>
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
                {selectedRowCount > 0 && `${selectedRowCount} selected. `}
                {filteredVendorsCount} of {totalVendors} vendor(s) visible.
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
)

export default function VendorsTable({ controls = true }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalVendors, setTotalVendors] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)
    const [rowSelection, setRowSelection] = useState({})
    
    // Local state for search input (for debouncing)
    const [searchInput, setSearchInput] = useState('')

    // Read URL params
    const pageIndex = Number(searchParams.get('page') || '1') - 1
    const pageSize = Number(searchParams.get('pageSize') || '15')
    const globalFilter = searchParams.get('search') || ''
    const filterVendorStatus = searchParams.get('status') || ''
    const filterCity = searchParams.get('city') || ''
    const filterIsInternational = searchParams.get('type') || ''
    const filterExpiryStatus = searchParams.get('expiry') || ''

    const uniqueVendorStatuses = ['pending', 'approved', 'rejected', 'expired']

    // Sync search input with URL on mount and when URL changes
    useEffect(() => {
        setSearchInput(globalFilter)
    }, [globalFilter])

    // Helper function to update URL parameters
    const updateURLParams = useCallback((updates) => {
        const params = new URLSearchParams(searchParams.toString())
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [searchParams, pathname, router])

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput !== globalFilter) {
                updateURLParams({ search: searchInput, page: '1' })
            }
        }, 300)
        return () => clearTimeout(handler)
    }, [searchInput, globalFilter, updateURLParams])

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
                city: filterCity,
                expiryStatus: filterExpiryStatus,
                isInternational: filterIsInternational,
            })
            if (result.success) {
                console.log(result.data)
                setData(result.data || [])
                setTotalVendors(result.pagination?.total || 0)
                setTotalPages(result.pagination?.pages || 0)
            } else {
                setData([])
                setTotalVendors(0)
                setTotalPages(0)
                setApiError(result.message)
            }
        } catch (e) {
            setApiError('Server connection failed.')
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, globalFilter, filterVendorStatus, filterCity, filterIsInternational, filterExpiryStatus])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // --- Selection Logic ---
    const toggleRowSelected = (id) => {
        setRowSelection((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const isRowSelected = (id) => !!rowSelection[id]

    const isAllSelected = data.length > 0 && data.every((row) => isRowSelected(row._id))
    const isSomeSelected = data.some((row) => isRowSelected(row._id)) && !isAllSelected

    const toggleAllRowsSelected = (checked) => {
        const currentPageIds = data.map((row) => row._id)
        setRowSelection(() => {
            const newSelection = {}
            if (checked) {
                currentPageIds.forEach((id) => {
                    newSelection[id] = true
                })
            }
            return newSelection
        })
    }

    const selectedRowCount = data.filter((row) => rowSelection[row._id]).length

    // Helper to get badge color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'expired':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

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
        const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])
        if (selectedIds.length === 0) {
            toast.error('No vendors selected.')
            return
        }
        for (const id of selectedIds) {
            try {
                await updateVendorStatusAction(id, 'approved')
            } catch (e) {
                console.error('Bulk approve error', e)
            }
        }
        toast.success('Selected vendors approved.')
        fetchData()
    }

    const headers = [
        'Ref ID',
        'Business Name',
        'Categories',
        'Owner',
        'Location',
        'Subscription Start',
        'Subscription End',
        'Status',
        'Actions',
    ]

    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search vendors..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-[#F2F4FF] border border-gray-300 text-primary">
                                        Bulk Actions
                                        <Badge className="bg-primary text-white px-2 rounded-full">{selectedRowCount}</Badge>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleBulkApprove}>Approve Selected</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Status: {filterVendorStatus || 'All'}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateURLParams({ status: '', page: '1' })}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueVendorStatuses.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterVendorStatus === status}
                                        onCheckedChange={() => updateURLParams({ status, page: '1' })}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Type: {filterIsInternational === 'true' ? 'International' : filterIsInternational === 'false' ? 'Local' : 'All'}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Vendor Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateURLParams({ type: '', page: '1' })}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={filterIsInternational === 'false'}
                                    onCheckedChange={() => updateURLParams({ type: 'false', page: '1' })}
                                >
                                    Local (UAE)
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterIsInternational === 'true'}
                                    onCheckedChange={() => updateURLParams({ type: 'true', page: '1' })}
                                >
                                    International
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Expiry Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                Expiry: {filterExpiryStatus === 'expiring-soon' ? 'Expiring Soon' : filterExpiryStatus === 'expired' ? 'Expired' : 'All'}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>Filter by Expiry Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateURLParams({ expiry: '', page: '1' })}>
                                Show All
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={filterExpiryStatus === 'expiring-soon'}
                                onCheckedChange={() => updateURLParams({ expiry: 'expiring-soon', page: '1' })}
                            >
                                Expiring Soon (3 months)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filterExpiryStatus === 'expired'}
                                onCheckedChange={() => updateURLParams({ expiry: 'expired', page: '1' })}
                            >
                                Expired
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
            )}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden ">
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
                                    <TableCell>
                                        <Checkbox
                                            checked={isRowSelected(row._id)}
                                            onCheckedChange={() => toggleRowSelected(row._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700 font-mono">{row.referenceId || "N/A"}</TableCell>
                                    <TableCell>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={row.businessLogo} alt={row.businessName} />
                                                        <AvatarFallback>{getInitials(row.businessName)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-800">{row.businessName}</span>
                                                        {row.isInternational && (
                                                            <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-indigo-50 text-indigo-700 border-indigo-100 w-fit mt-0.5">
                                                                International
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80 bg-white shadow-lg border p-3">
                                                <VendorDetails vendor={row} />
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell className="text-sm truncate max-w-[200px]">{row.mainCategories}</TableCell>
                                    <TableCell>{row.ownerName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{row.city}</span>
                                            <span className="text-gray-500 text-xs">{row.country}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {formatDate(row.subscriptionStartDate)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {formatDate(row.subscriptionEndDate)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(row.vendorStatus)}>{row.vendorStatus}</Badge>
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
                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, 'approved')}>Approve Vendor</DropdownMenuItem>
                                                )}
                                                {row.vendorStatus === 'approved' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, 'expired')}>Mark as Expired</DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                {row.vendorStatus !== 'rejected' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, 'rejected')} className="text-red-600">Reject Vendor</DropdownMenuItem>
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
                    updateURLParams={updateURLParams}
                    selectedRowCount={selectedRowCount}
                    filteredVendorsCount={data.length}
                    totalVendors={totalVendors}
                />
            )}
        </div>
    )
}