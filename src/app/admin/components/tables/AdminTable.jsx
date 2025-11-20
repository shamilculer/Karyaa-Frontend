"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    Shield, // Used for Admin Level
    Lock, // Used for Access Control
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { useAdminStore } from "@/store/adminStore"
import { getInitials } from "@/utils"

import { getAllAdminsAction, toggleAdminStatusAction } from "@/app/actions/admin/admin"

import { AdminManagementModal } from "../AdminManagementModal" // Ensure this path is correct

export const description = "Admins Management Table with API Integration and RBAC"

// --- Helper component for HoverCard Content with Admin Details
const AdminDetails = ({ admin }) => (
    <div className="flex items-start space-x-4 p-1">
        <Avatar className="h-16 w-16">
            <AvatarImage src={admin.profileImage} alt={admin.fullName} />
            <AvatarFallback>{getInitials(admin.fullName)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <h4 className="font-bold text-lg">{admin.fullName}</h4>
            <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-blue-600 hover:underline">{admin.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm capitalize">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{admin.adminLevel}-admin</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Lock className="w-4 h-4 text-gray-500" />
                {/* Display a summary of permissions */}
                <span className="text-gray-700">
                    {admin.adminLevel === 'super'
                        ? 'Full Access'
                        : `${Object.values(admin.accessControl).filter(v => v).length} Modules Enabled`}
                </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Registered: {format(new Date(admin.registeredAt), 'MMM d, yyyy')}</span>
            </div>
        </div>
    </div>
);

// --- Pagination Component (Refactored for URL Params) ---
const TablePagination = ({
    pageIndex, // 0-based
    pageCount,
    pageSize,
    setPageParam, // 👈 New prop to set 1-based page in URL
    setLimitParam, // 👈 New prop to set limit/pageSize in URL
    filteredAdminsCount,
    totalAdmins,
    pageSizes = [15, 30, 50, 75, 100]
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Admins per page</p>
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                        setLimitParam(Number(value)) // Uses new setter
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
                {filteredAdminsCount} of {totalAdmins} admin(s) visible.
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
                    onClick={() => setPageParam(pageIndex)} // Go to (pageIndex - 1) + 1 = pageIndex (1-based)
                    disabled={pageIndex === 0}
                >
                    <ChevronLeft />
                </Button>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageParam(pageIndex + 2)} // Go to (pageIndex + 1) + 1 = pageIndex + 2 (1-based)
                    disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
)

// --- Main Admins Table Component ---
export default function AdminsTable({ controls = true }) {

    // 🎯 GET CURRENT ADMIN ID and LEVEL for RBAC
    const { admin } = useAdminStore()
    const currentAdminId = admin?._id || admin?.id
    const currentAdminLevel = admin?.adminLevel // 'super', 'admin', 'moderator'
    const isModerator = currentAdminLevel === 'moderator';
    const canModify = !isModerator; // Only Super-admin/Admin can deactivate/delete others

    // 1. 🎯 NEW: State for Modal Management
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    // Handler to open the modal
    const handleViewDetails = (adminData) => {
        setSelectedAdmin(adminData);
        setIsDetailsModalOpen(true);
    };

    // Standard states remain
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalAdmins, setTotalAdmins] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    // 💡 URL Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    // 💡 Derive state from URL params (defaults to 1-based page 1 and limit 15)
    const pageIndex = Number(searchParams.get('page')) - 1 || 0 // 0-based index
    const pageSize = Number(searchParams.get('limit')) || 15
    const globalFilter = searchParams.get('search') || ''
    const filterAdminLevel = searchParams.get('adminLevel') || ''
    const filterIsActive = searchParams.get('isActive') || ''

    // Helper to update URL params and navigate
    const setParamAndRefresh = useCallback((name, value, resetPage = false) => {
        const newParams = new URLSearchParams(searchParams.toString());

        // 1. Set the new value or delete the param if the value is falsy/default
        if (value === '' || value === 0 || value === false || value === 1) {
            newParams.delete(name);
        } else {
            newParams.set(name, value);
        }

        // 2. Reset page to 1 if a filter/search changes
        if (resetPage) {
            newParams.set('page', '1');
        } else if (!newParams.has('page') && pageIndex !== 0) {
            // Ensure page is set if it was previously > 1
            newParams.set('page', (pageIndex + 1).toString());
        }

        router.push(`?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router, pageIndex]);

    const [searchQuery, setSearchQuery] = useState(globalFilter);

    useEffect(() => {
        setSearchQuery(globalFilter);
    }, [globalFilter]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setParamAndRefresh('search', searchQuery || '', true);
        }, 50);

        return () => clearTimeout(handler);
    }, [searchQuery, setParamAndRefresh]);

    const uniqueAdminLevels = ['admin', 'moderator']
    const uniqueIsActiveOptions = [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ]

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)

        try {
            const result = await getAllAdminsAction({
                page: pageIndex + 1, // API usually expects 1-based page number
                limit: pageSize,
                search: globalFilter,
                adminLevel: filterAdminLevel,
                isActive: filterIsActive,
            })

            if (result.success) {
                setData(result.data || [])
                setTotalAdmins(result.pagination?.total || 0)
                setTotalPages(result.pagination?.pages || 0)
            } else {
                setData([])
                setTotalAdmins(0)
                setTotalPages(0)
                setApiError(result.message)
            }

        } catch (error) {
            setApiError("Server connection failed.")
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, globalFilter, filterAdminLevel, filterIsActive]) // 💡 Added URL derived dependencies

    useEffect(() => {
        // Debounce search and filter actions
        const delay = setTimeout(() => {
            fetchData()
        }, 300)
        return () => clearTimeout(delay)
    }, [fetchData])

    // --- Action Handlers (Mocked for now) ---
    const handleStatusChange = async (adminId) => {

        try {
            toast.loading(`Sending request to change status for admin`);
            const res = await toggleAdminStatusAction(adminId);

            if (res.success) {
                toast.success(res.message);
                fetchData();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Status toggle failed:", error);
            toast.error("An unexpected error occurred during status update.");
        }
    };
    

    const headers = [
        "Full Name",
        "Email",
        "Admin Level",
        "Permissions",
        "Status", // isActive
        "Registered At",
        "Actions"
    ]

    const getStatusColor = (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
    }

    // Calculate the number of columns for colSpan in loading/error rows
    const numColumns = headers.length; // No checkbox column

    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            // Use local state while typing; URL is updated after debounce
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">

                        {/* Admin Level Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Level: {filterAdminLevel || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Admin Level</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* 💡 Use URL setter for filter and reset page to 1 */}
                                <DropdownMenuItem onClick={() => setParamAndRefresh('adminLevel', '', true)}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueAdminLevels.map(level => (
                                    <DropdownMenuCheckboxItem
                                        key={level}
                                        checked={filterAdminLevel === level}
                                        // 💡 Use URL setter
                                        onCheckedChange={() => setParamAndRefresh('adminLevel', level, true)}
                                        className="capitalize"
                                    >
                                        {level}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Active Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Status: {uniqueIsActiveOptions.find(o => o.value === filterIsActive)?.label || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* 💡 Use URL setter for filter and reset page to 1 */}
                                <DropdownMenuItem onClick={() => setParamAndRefresh('isActive', '', true)}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueIsActiveOptions.map(option => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={filterIsActive === option.value}
                                        // 💡 Use URL setter
                                        onCheckedChange={() => setParamAndRefresh('isActive', option.value, true)}
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}

            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 z-10">
                            <TableRow>
                                {headers.map((header, i) => (
                                    <TableHead key={i}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={numColumns} className="text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="mt-2">Loading Admins...</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {apiError && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={numColumns} className="text-center text-red-600">
                                        {apiError}
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading && !apiError && data.map((row) => {
                                // 🎯 Determine if the row belongs to the current user
                                const isCurrentUser = row._id === currentAdminId;
                                return (
                                    <TableRow
                                        key={row._id}
                                        className={`
                                        hover:bg-gray-50 
                                        ${isCurrentUser
                                                ? 'bg-blue-50/70 hover:bg-blue-100 !border-l-4 border-blue-600' // Highlighted style
                                                : ''
                                            }
                                    `}
                                    >
                                        <TableCell>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <div className="flex items-center gap-2 cursor-pointer">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={row.profileImage} alt={row.fullName} />
                                                            <AvatarFallback>{getInitials(row.fullName)}</AvatarFallback>
                                                        </Avatar>
                                                        <span
                                                            // REMOVED Link to /details/${row._id} to prioritize modal access
                                                            className="hover:underline hover:text-blue-600 font-medium"
                                                            onClick={() => handleViewDetails(row)} // 🎯 Use the modal handler
                                                        >
                                                            {row.fullName}
                                                        </span>
                                                        {isCurrentUser && ( // 🎯 Add a badge next to the name
                                                            <Badge variant="outline" className="text-blue-600 border-blue-600 ml-2 py-0.5 px-2">
                                                                You
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80 bg-white shadow-lg border p-3">
                                                    <AdminDetails admin={row} />
                                                </HoverCardContent>
                                            </HoverCard>
                                        </TableCell>
                                        <TableCell className="text-sm truncate max-w-[200px]">{row.email}</TableCell>
                                        <TableCell className="capitalize">
                                            {row.adminLevel}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-700">
                                            {row.adminLevel === 'admin' || row.adminLevel === 'super'
                                                ? <Badge variant="secondary" className="bg-blue-100 text-blue-800">Full Access</Badge>
                                                : `${Object.values(row.accessControl).filter(v => v).length} Modules`}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(row.isActive)}>
                                                {row.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {format(new Date(row.registeredAt), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell className="text-center">

                                            {currentAdminId !== row._id && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                            <EllipsisVertical />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">

                                                        {/* 2. 🎯 UPDATED Dropdown Menu Item to trigger Modal */}
                                                        <DropdownMenuItem onClick={() => handleViewDetails(row)}>
                                                            View Details / Manage
                                                        </DropdownMenuItem>

                                                        {/* Conditional Actions remain below for redundancy/alternative paths */}
                                                        {canModify && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                {!row.isActive && (
                                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, true)}>
                                                                        Activate Admin
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {row.isActive && (
                                                                    <DropdownMenuItem onClick={() => handleStatusChange(row._id, false)} className="text-red-600">
                                                                        Deactivate Admin
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                            {!isLoading && data.length === 0 && !apiError && (
                                <TableRow>
                                    <TableCell colSpan={numColumns} className="text-center text-gray-500">
                                        No admins found matching filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && totalAdmins > 0 && controls && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    // 💡 Pass URL setters to pagination component
                    setPageParam={(page) => setParamAndRefresh('page', page)}
                    setLimitParam={(size) => setParamAndRefresh('limit', size, true)}
                    filteredAdminsCount={data.length}
                    totalAdmins={totalAdmins}
                />
            )}

            {/* 3. 🎯 NEW: Render the Admin Management Modal */}
            {selectedAdmin && (
                <AdminManagementModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    admin={selectedAdmin}
                    currentAdminId={currentAdminId}
                    currentUserLevel={currentAdminLevel}
                    fetchData={fetchData}
                />
            )}
        </div>
    )
}