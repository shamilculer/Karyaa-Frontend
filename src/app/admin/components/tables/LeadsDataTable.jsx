"use client"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
    Loader2,
} from "lucide-react"
import {
    IconCircleFilled,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react"
import { getAllLeads, updateLeadStatus, deleteLead } from "@/app/actions/admin/leads"
import { toast } from "sonner"
import LeadDetailsModal from "../modals/leads/LeadDetailsModal"

// Available status options from your schema
const STATUS_OPTIONS = ["New", "Contacted", "Closed - Won", "Closed - Lost"];

export default function LeadsDataTable({ controls = true }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(20);
    const [totalPages, setTotalPages] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);
    const [updatingStatus, setUpdatingStatus] = React.useState(false);
    const [deletingLeads, setDeletingLeads] = React.useState(false);

    // Lead details modal state
    const [selectedLead, setSelectedLead] = React.useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

    // Alert Dialog states for bulk delete
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    // Get status filter from URL
    const urlStatusFilter = searchParams.get('status') || '';

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = React.useState('');

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Handle status filter change
    const handleStatusChange = (status) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        params.delete('page');
        setCurrentPage(1);

        router.push(`?${params.toString()}`);
    };

    // Handle bulk status update
    const handleBulkStatusUpdate = async (newStatus) => {
        const selectedIds = Object.keys(rowSelection)
            .filter(key => rowSelection[key])
            .map(index => data[parseInt(index)]._id);

        if (selectedIds.length === 0) {
            toast.error("No leads selected");
            return;
        }

        setUpdatingStatus(true);

        try {
            const result = await updateLeadStatus(selectedIds, newStatus);

            if (result.success) {
                toast.success(result.message);
                setRowSelection({});
                fetchLeads();
            } else {
                toast.error(result.error || result.message);
            }
        } catch (error) {
            toast.error("Failed to update lead status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Open bulk delete dialog
    const openBulkDeleteDialog = () => {
        const selectedIds = Object.keys(rowSelection)
            .filter(key => rowSelection[key])
            .map(index => data[parseInt(index)]._id);

        if (selectedIds.length === 0) {
            toast.error("No leads selected");
            return;
        }

        setDeleteDialogOpen(true);
    };

    // Confirm bulk delete
    const confirmBulkDelete = async () => {
        const selectedIds = Object.keys(rowSelection)
            .filter(key => rowSelection[key])
            .map(index => data[parseInt(index)]._id);

        setDeletingLeads(true);

        try {
            const result = await deleteLead(selectedIds);

            if (result.success) {
                toast.success(result.message);
                setRowSelection({});
                fetchLeads();
            } else {
                toast.error(result.error || result.message);
            }
        } catch (error) {
            toast.error("Failed to delete lead(s)");
        } finally {
            setDeletingLeads(false);
            setDeleteDialogOpen(false);
        }
    };

    // Fetch data
    const fetchLeads = React.useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllLeads(
                currentPage,
                pageSize,
                urlStatusFilter || 'All',
                debouncedSearch
            );

            if (response.error) {
                setError(response.error);
                setData([]);
            } else {
                setData(response.leads || []);
                setTotalPages(response.totalPages || 0);
                setTotalItems(response.totalLeads || 0);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching leads');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearch, urlStatusFilter]);

    React.useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const baseColumns = [
        {
            accessorKey: "referenceId",
            header: "Ref ID",
        },
        {
            accessorKey: "fullName",
            header: "Client Name",
            cell: ({ row }) => (
                <button
                    onClick={() => {
                        setSelectedLead(row.original);
                        setDetailsModalOpen(true);
                    }}
                    className="hover:underline hover:text-blue-600 text-left font-medium"
                >
                    {row.original.fullName}
                </button>
            ),
        },
        {
            accessorKey: "vendor",
            header: "Vendor",
            cell: ({ row }) => row.original.vendor?.businessName || "-",
        },
        {
            accessorKey: "phoneNumber",
            header: "Contact Number",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "-",
        },
        {
            accessorKey: "eventType",
            header: "Event Type",
            cell: ({ row }) => row.original.eventType || "-",
        },
        {
            accessorKey: "eventDate",
            header: "Event Date",
            cell: ({ row }) => {
                if (!row.original.eventDate) return "-";
                const date = new Date(row.original.eventDate);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).toUpperCase();
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                let statusColor;
                if (status === "New") {
                    statusColor = "bg-blue-100 text-blue-800";
                } else if (status === "Contacted") {
                    statusColor = "bg-yellow-100 text-yellow-800";
                } else if (status === "Closed - Won") {
                    statusColor = "bg-emerald-100 text-emerald-800";
                } else if (status === "Closed - Lost") {
                    statusColor = "bg-red-100 text-red-800";
                } else {
                    statusColor = "bg-gray-100 text-gray-800";
                }
                return (
                    <Badge
                        variant="outline"
                        className={`inline-flex items-center border-0 gap-1.5 rounded-full px-2 !py-1 text-xs font-medium leading-0 ${statusColor}`}
                    >
                        <IconCircleFilled className="size-2 fill-current" />
                        <span className="mt-1">{status}</span>
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted flex size-8 border border-gray-400 !outline-0"
                            size="icon"
                            disabled={updatingStatus || deletingLeads}
                        >
                            <EllipsisVertical className="w-5 text-gray-600" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                        <DropdownMenuItem onClick={() => {
                            setSelectedLead(row.original);
                            setDetailsModalOpen(true);
                        }}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        {STATUS_OPTIONS.map(status => (
                            <DropdownMenuItem
                                key={status}
                                onClick={async () => {
                                    setUpdatingStatus(true);
                                    try {
                                        const result = await updateLeadStatus(row.original._id, status);
                                        if (result.success) {
                                            toast.success(result.message);
                                            fetchLeads();
                                        } else {
                                            toast.error(result.error || result.message);
                                        }
                                    } catch (error) {
                                        toast.error("Failed to update lead status");
                                    } finally {
                                        setUpdatingStatus(false);
                                    }
                                }}
                                disabled={row.original.status === status || updatingStatus || deletingLeads}
                            >
                                {status}
                                {row.original.status === status && " ✓"}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                                if (!confirm("Are you sure you want to delete this lead?")) return;
                                setDeletingLeads(true);
                                try {
                                    const result = await deleteLead(row.original._id);
                                    if (result.success) {
                                        toast.success(result.message);
                                        fetchLeads();
                                    } else {
                                        toast.error(result.error || result.message);
                                    }
                                } catch (error) {
                                    toast.error("Failed to delete lead");
                                } finally {
                                    setDeletingLeads(false);
                                }
                            }}
                            className="text-red-600"
                            disabled={updatingStatus || deletingLeads}
                        >
                            Delete Lead
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // Conditionally add the checkbox column
    const columns = React.useMemo(() => {
        if (!controls) {
            return baseColumns;
        }
        const checkboxColumn = {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected() ? true : undefined}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                    <span className="ml-2 font-medium text-[#727272]">No.</span>
                </div>
            ),
            cell: ({ row }) => {
                const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                        <span className="text-sm text-gray-700">{rowNumber}</span>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        };
        return [checkboxColumn, ...baseColumns];
    }, [controls, currentPage, pageSize, updatingStatus, deletingLeads]);

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: !!controls,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    });

    const selectedRowCount = Object.keys(rowSelection).length;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setRowSelection({});
    };

    return (
        <div className="w-full">
            {controls && (
                <div className="flex justify-between items-center gap-4 py-4">
                    <div className="relative">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        disabled={updatingStatus || deletingLeads}
                                    >
                                        <span>Bulk Actions ({selectedRowCount})</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {STATUS_OPTIONS.map(status => (
                                        <DropdownMenuItem
                                            key={status}
                                            onClick={() => handleBulkStatusUpdate(status)}
                                            disabled={updatingStatus || deletingLeads}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={openBulkDeleteDialog}
                                        className="text-red-600"
                                        disabled={updatingStatus || deletingLeads}
                                    >
                                        Delete Selected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-1/2 lg:w-2/5">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4" />
                            <Input
                                placeholder="Search by name, phone, email, ref ID..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-full bg-white border-gray-300 h-11 pl-10"
                            />
                        </div>

                        {/* Status Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary border border-gray-300 whitespace-nowrap">
                                    Status: {urlStatusFilter || "All"}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange("")}>
                                    Show All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {STATUS_OPTIONS.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={urlStatusFilter === status}
                                        onCheckedChange={() => handleStatusChange(status)}
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
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-600">Loading leads...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                            <Button
                                onClick={fetchLeads}
                                variant="outline"
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500">No leads found</p>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <Table className="border-0 w-full">
                            <TableHeader className="sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="font-medium text-[#727272]">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="bg-white">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {controls && !loading && !error && data.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedRowCount > 0
                            ? `${selectedRowCount} of ${data.length} row(s) selected.`
                            : `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} leads`
                        }
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <IconChevronLeft className="size-4" />
                        </Button>

                        {(() => {
                            const maxVisible = 5;
                            const pages = [];

                            if (totalPages <= maxVisible) {
                                for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                }
                            } else {
                                if (currentPage <= 3) {
                                    pages.push(1, 2, 3, 4, '...', totalPages);
                                } else if (currentPage >= totalPages - 2) {
                                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                                } else {
                                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                                }
                            }

                            return pages.map((page, idx) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                )
                            );
                        })()}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <IconChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Bulk Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Leads</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedRowCount} lead(s)? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingLeads}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkDelete}
                            disabled={deletingLeads}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deletingLeads ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Lead Details Modal */}
            <LeadDetailsModal
                lead={selectedLead}
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
                onUpdate={fetchLeads}
            />
        </div>
    )
}
