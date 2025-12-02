"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"

// Import the Server Action created in the previous step
import { getAllSupportTicketsAdmin, deleteTicketAction } from "@/app/actions/admin/tickets"

import TicketDetailsModal from "../modals/tickets/TicketDetailsModal"

// --- Shadcn UI Imports ---
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
    EllipsisVertical,
    Search,
    ChevronDown,
    Ticket,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export const description = "Support Ticket Management Table"

const initialTicketData = []

// --- Pagination Component ---
const TablePagination = ({
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    filteredArticlesCount,
    totalArticles,
    pageSizes = [15, 30, 50, 75, 100]
}) => (
    <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Tickets per page</p>
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
                {filteredArticlesCount} of {totalArticles} ticket(s) visible.
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
const TicketsTable = ({ controls = true }) => {

    const [data, setData] = useState(initialTicketData)
    const [isLoading, setIsLoading] = useState(true)
    const [totalTickets, setTotalTickets] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [apiError, setApiError] = useState(null)

    // FIX: State for Modal is now the full ticket object
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null); // Changed from selectedTicketId

    // Filter and Pagination State
    const [globalFilter, setGlobalFilter] = useState("")
    // Local debounced search state to improve typing UX
    const [searchQuery, setSearchQuery] = useState(globalFilter);

    // Keep local input synced if globalFilter changes externally
    useEffect(() => {
        setSearchQuery(globalFilter);
    }, [globalFilter]);

    // Debounce local search input and apply to globalFilter
    useEffect(() => {
        const handler = setTimeout(() => {
            setGlobalFilter(searchQuery);
            setPageIndex(0);
        }, 50);

        return () => clearTimeout(handler);
    }, [searchQuery]);
    const [statusFilter, setStatusFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const [deletingTicketId, setDeletingTicketId] = useState(null)

    // Valid Enum Values from the Ticket Schema
    const uniqueStatuses = ['open', 'in-progress', 'pending', 'closed'];
    const uniqueCategories = ['Leads', 'profile', 'technical', 'content', 'other'];
    const uniquePriorities = ['low', 'medium', 'high', 'critical'];

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setApiError(null)

        try {
            const result = await getAllSupportTicketsAdmin({
                page: pageIndex + 1,
                limit: pageSize,
                search: globalFilter,
                status: statusFilter,
                category: categoryFilter,
                priority: priorityFilter,
            })

            if (result.success) {
                // The server action returns the array in 'data'
                setData(result.data)
                setTotalTickets(result.total)
                setTotalPages(result.totalPages)
                setApiError(null)
            } else {
                setData([])
                setTotalTickets(0)
                setTotalPages(0)
                setApiError(result.message)
            }

        } catch (error) {
            setApiError("Server connection failed.")
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, globalFilter, statusFilter, categoryFilter, priorityFilter])

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchData()
        }, 300)
        return () => clearTimeout(delay)
    }, [fetchData])

    // FIX: Handler to open modal now receives the full ticket object
    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Handler to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
        // fetchData will be triggered by onUpdateSuccess prop passed below if status changed
    };

    // --- Filter Handlers ---
    const handleGlobalFilterChange = (value) => {
        setGlobalFilter(value)
        setPageIndex(0) // Reset to first page on filter change
    }
    const createFilterHandler = (setter) => (value) => {
        setter(prev => (prev === value ? "" : value))
        setPageIndex(0)
    }

    const handleStatusChange = createFilterHandler(setStatusFilter);
    const handleCategoryChange = createFilterHandler(setCategoryFilter);
    const handlePriorityChange = createFilterHandler(setPriorityFilter);


    const headers = [
        "Subject",
        "Submitted By",
        "Category",
        "Priority",
        "Status",
        "Created At",
        "Actions"
    ]

    // Helper to determine badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return "bg-blue-100 text-blue-700";
            case 'in-progress':
                return "bg-yellow-100 text-yellow-700";
            case 'pending':
                return "bg-orange-100 text-orange-700";
            case 'closed':
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }

    // Helper to determine priority badge color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return "bg-red-600 text-white";
            case 'high':
                return "bg-red-100 text-red-700";
            case 'medium':
                return "bg-yellow-100 text-yellow-700";
            case 'low':
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }


    const handleDeleteTicket = async (ticketId) => {
        const confirmDelete = confirm("Are you sure you want to delete this ticket permanently?")
        if (!confirmDelete) return

        setDeletingTicketId(ticketId)

        const result = await deleteTicketAction(ticketId)

        if (result.success) {
            toast.success(result.message)
            // Optimistic Update
            setData(prev => prev.filter(ticket => ticket._id !== ticketId))
            fetchData()
        } else {
            toast.error(result.message)
        }

        setDeletingTicketId(null)
    }


    return (
        <div className="w-full">
            {controls && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
                    <div className="relative w-full md:w-2/5 lg:max-w-md">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                        <Input
                            placeholder="Search by subject..."
                            // Use local state while typing; globalFilter updates after debounce
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    {/* Filter Controls (Status, Category, Priority) */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">

                        {/* Status Filter */}
                        <DropdownMenu modal={false}>
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
                                        {status.replace('-', ' ')}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Category Filter */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Category: {categoryFilter || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCategoryChange("")}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniqueCategories.map(category => (
                                    <DropdownMenuCheckboxItem
                                        key={category}
                                        checked={categoryFilter === category}
                                        onCheckedChange={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Priority Filter */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300">
                                    Priority: {priorityFilter || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handlePriorityChange("")}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {uniquePriorities.map(priority => (
                                    <DropdownMenuCheckboxItem
                                        key={priority}
                                        checked={priorityFilter === priority}
                                        onCheckedChange={() => handlePriorityChange(priority)}
                                    >
                                        {priority}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
            )}

            {/* Table */}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden">
                    <Table >
                        <TableHeader className="sticky top-0 bg-gray-50 z-10">
                            <TableRow>
                                {/* Removed Checkbox column */}
                                {headers.map((header, i) => (
                                    <TableHead key={i}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* Loading State */}
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="mt-2">Loading...</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Error State */}
                            {apiError && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center text-red-600">
                                        {apiError}
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Data Rows */}
                            {!isLoading && !apiError && data.map((row) => {
                                return (
                                    <TableRow key={row._id} className="hover:bg-gray-50 bg-white">
                                        <TableCell className="font-medium truncate max-w-[350px]">
                                            {row.subject}
                                        </TableCell>

                                        {/* Submitted By (Populated Vendor Data) */}
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {row.submittedBy?.ownerProfileImage && (
                                                    <Image
                                                        src={row.submittedBy.ownerProfileImage}
                                                        alt={row.submittedBy.ownerName || "User"}
                                                        width={30}
                                                        height={30}
                                                        className="object-cover rounded-full"
                                                    />
                                                )}
                                                <span className="truncate max-w-[150px]">
                                                    {row.submittedBy?.ownerName || row.contactEmail || "Guest User"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell>
                                            <Badge className='!bg-blue-500 text-white text-sm'>{row.category}</Badge>
                                        </TableCell>

                                        {/* Priority */}
                                        <TableCell>
                                            <Badge className={getPriorityColor(row.priority)}>
                                                {row.priority}
                                            </Badge>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge className={getStatusColor(row.status)}>
                                                {row.status.replace('-', ' ')}
                                            </Badge>
                                        </TableCell>

                                        {/* Created At */}
                                        <TableCell>{format(new Date(row.createdAt), "dd-MM-yyyy")}</TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-center">
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {/* FIX: Pass the full 'row' object to the handler */}
                                                    <DropdownMenuItem onClick={() => handleViewDetails(row)}>
                                                        View Details
                                                    </DropdownMenuItem>


                                                    <DropdownMenuItem
                                                        disabled={deletingTicketId === row._id}
                                                        onClick={() => handleDeleteTicket(row._id)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        {deletingTicketId === row._id ? "Deleting..." : "Delete"}
                                                    </DropdownMenuItem>

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                            {/* Empty State */}
                            {!isLoading && data.length === 0 && !apiError && (
                                <TableRow className="bg-white">
                                    <TableCell colSpan={headers.length} className="text-center text-gray-500">
                                        No tickets found matching filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && totalTickets > 0 && controls && (
                <TablePagination
                    pageIndex={pageIndex}
                    pageCount={totalPages}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                    selectedRowCount={0}
                    filteredArticlesCount={data.length}
                    totalArticles={totalTickets}
                />
            )}

            <TicketDetailsModal
                initialTicketData={selectedTicket}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateSuccess={fetchData}
            />
        </div>
    )
}

export default TicketsTable;