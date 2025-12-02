"use client"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
    Search,
    ChevronDown,
    Loader2,
    EllipsisVertical,
    Mail,
    Phone,
    User,
    Users,
    Calendar,
    Code,
} from "lucide-react"
import {
    IconCircleFilled,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react"
// UPDATED IMPORT: Added updateReferralStatusAction and deleteReferralsAction
import { getReferralsAction, updateReferralStatusAction, deleteReferralsAction } from "@/app/actions/admin/referral"

const STATUS_OPTIONS = ["Pending", "Completed", "Canceled"];

export default function ReferralsCardLayout({ controls = true }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedItems, setSelectedItems] = React.useState(new Set());
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(30);
    const [totalPages, setTotalPages] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);

    const [updatingStatus, setUpdatingStatus] = React.useState(false);
    const [deletingReferrals, setDeletingReferrals] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const urlStatusFilter = searchParams.get('status') || '';
    const [debouncedSearch, setDebouncedSearch] = React.useState('');

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

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

    const fetchReferrals = React.useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: currentPage,
                limit: pageSize,
            };

            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            if (urlStatusFilter) {
                params.status = urlStatusFilter;
            }

            const response = await getReferralsAction(params);

            if (!response.error) {
                setData(response.data || []);
                setTotalPages(response.pagination?.totalPages || 0);
                setTotalItems(response.pagination?.totalItems || 0);
            } else {
                setError(response.error || 'Failed to fetch referrals');
                setData([]);
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching referrals');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearch, urlStatusFilter]);

    React.useEffect(() => {
        fetchReferrals();
    }, [fetchReferrals]);

    // NEW ACTION HANDLER: Update Referral Status
    const updateStatus = async (ids, status) => {
        setUpdatingStatus(true);
        try {
            const response = await updateReferralStatusAction({ ids, status });

            if (response.error) {
                // In a real application, you'd show a toast notification here
                console.error("Status Update Failed:", response.error);
                setError(response.error); 
            } else {
                // Clear selections and refetch to ensure pagination/filters are respected
                setSelectedItems(new Set());
                await fetchReferrals();
            }
        } catch (err) {
            console.error("Unexpected error in updateStatus:", err);
            setError('An unexpected error occurred while updating status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // NEW ACTION HANDLER: Delete Referrals
    const handleDelete = async (ids) => {
        setDeleteDialogOpen(false);
        setDeletingReferrals(true);
        try {
            const response = await deleteReferralsAction({ ids });

            if (response.error) {
                // In a real application, you'd show a toast notification here
                console.error("Deletion Failed:", response.error);
                setError(response.error);
            } else {
                // Clear selections and refetch data to update pagination/list
                setSelectedItems(new Set());
                // Reset to page 1 if the current page might become empty
                if (currentPage !== 1 && totalItems - ids.length <= (currentPage - 1) * pageSize) {
                     setCurrentPage(1);
                } else {
                    await fetchReferrals();
                }
            }
        } catch (err) {
            console.error("Unexpected error in handleDelete:", err);
            setError('An unexpected error occurred while deleting referrals.');
        } finally {
            setDeletingReferrals(false);
        }
    };


    const handleSelectItem = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === data.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(data.map(item => item._id)));
        }
    };

    const selectedRowCount = selectedItems.size;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedItems(new Set());
    };

    const getStatusColor = (status) => {
        if (status === "Pending") {
            return "bg-yellow-100 text-yellow-800";
        } else if (status === "Completed") {
            return "bg-emerald-100 text-emerald-800";
        } else if (status === "Canceled") {
            return "bg-red-100 text-red-800";
        } else {
            return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className="w-full">
            {controls && (
                <div className="flex justify-between items-center gap-4 py-4">
                    <div className="relative">
                        {selectedRowCount > 0 && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        // Bulk Actions button is now enabled and shows loading state
                                        disabled={selectedRowCount === 0 || updatingStatus || deletingReferrals}
                                    >
                                        {updatingStatus || deletingReferrals ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                                            // Call updateStatus for bulk action
                                            onClick={() => updateStatus(Array.from(selectedItems), status)}
                                            disabled={updatingStatus || deletingReferrals}
                                            className="cursor-pointer"
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setDeleteDialogOpen(true)}
                                        className="text-red-600 cursor-pointer"
                                        disabled={updatingStatus || deletingReferrals}
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
                                placeholder="Search by referrer name, email, code..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-full bg-white border-gray-300 h-11 pl-10"
                            />
                        </div>

                        <DropdownMenu modal={false}>
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
                                        checked={urlStatusFilter.toLowerCase() === status.toLowerCase()}
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

            {/* Select All Checkbox */}
            {controls && !loading && !error && data.length > 0 && (
                <div className="mb-4 flex items-center gap-2 px-2">
                    <Checkbox
                        checked={selectedItems.size === data.length && data.length > 0}
                        indeterminate={(selectedItems.size > 0 && selectedItems.size < data.length) ? "true" : undefined}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                    />
                    <span className="text-sm text-gray-600">
                        {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select all'}
                    </span>
                </div>
            )}

            <div className="relative">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-600">Loading referrals...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                            <Button
                                onClick={fetchReferrals}
                                variant="outline"
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500">No referrals found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {data.map((referral, index) => {
                            const rowNumber = (currentPage - 1) * pageSize + index + 1;
                            const isSelected = selectedItems.has(referral._id);

                            return (
                                <div
                                    key={referral._id}
                                    className={`bg-white rounded-lg border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} p-5 hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            {controls && (
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleSelectItem(referral._id)}
                                                    aria-label="Select referral"
                                                    className="mt-1"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-4 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-500">#{rowNumber}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`inline-flex items-center border-0 gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(referral.status)}`}
                                                        >
                                                            <IconCircleFilled className="size-2 fill-current" />
                                                            <span>{referral.status}</span>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Code className="w-4 h-4 text-indigo-600" />
                                                        <span className="font-mono font-bold text-base text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-200">{referral.referralCode}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(referral.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="data-[state=open]:bg-muted flex size-8 border border-gray-400"
                                                    size="icon"
                                                    disabled={updatingStatus || deletingReferrals}
                                                >
                                                    <EllipsisVertical className="w-5 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white">
                                                {/* REMOVED: View Details option */}
                                                
                                                <DropdownMenuLabel>Update Status To</DropdownMenuLabel> {/* MODIFIED: Changed label */}
                                                <DropdownMenuSeparator />
                                                {STATUS_OPTIONS.map(status => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        // Call updateStatus for single item
                                                        onClick={() => updateStatus([referral._id], status)}
                                                        disabled={updatingStatus || deletingReferrals}
                                                        className="cursor-pointer"
                                                    >
                                                        {status}
                                                        {referral.status === status && " ✓"}
                                                        {/* Optional: Show individual loading spinner if needed, but not strictly required */}
                                                        {updatingStatus && status === referral.status && selectedRowCount <= 1 && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
                                                    </DropdownMenuItem>
                                                ))}
                                                
                                                {/* NEW: Individual Delete Option */}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        // Select only the current item and open the delete confirmation dialog
                                                        setSelectedItems(new Set([referral._id])); 
                                                        setDeleteDialogOpen(true); 
                                                    }}
                                                    className="text-red-600 cursor-pointer"
                                                    disabled={updatingStatus || deletingReferrals}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Referrer Information */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Referrer Information
                                            </h4>
                                            <div className="space-y-2 pl-6">
                                                <div className="flex items-start gap-2">
                                                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{referral.referrerFullname}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-700">{referral.referrerEmail}</p>
                                                    </div>
                                                </div>
                                                {referral.referrerPhone && (
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-700">{referral.referrerPhone}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Referred Vendors */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Referred Vendors ({referral.vendors.length})
                                            </h4>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-6">
                                                {referral.vendors.length > 0 ? (
                                                    referral.vendors.map((vendor, vIndex) => (
                                                        <div key={vIndex} className="space-y-2">
                                                            <div className="flex items-start gap-2">
                                                                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{vendor.fullname}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm text-gray-700">{vendor.email}</p>
                                                                </div>
                                                            </div>
                                                            {vendor.phone && (
                                                                <div className="flex items-start gap-2">
                                                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                    <div>
                                                                        <p className="text-sm text-gray-700">{vendor.phone}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No vendors referred</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {controls && !loading && !error && data.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedRowCount > 0
                            ? `${selectedRowCount} of ${data.length} item(s) selected.`
                            : `Showing ${((currentPage - 1) * pageSize) + 1} to ${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} referrals`
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

                            const uniquePages = pages.reduce((acc, curr) => {
                                if (curr === '...' && acc.length > 0 && acc[acc.length - 1] === '...') return acc;
                                return [...acc, curr];
                            }, []);

                            return uniquePages.map((page, idx) =>
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

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{selectedRowCount > 1 ? 'Delete Multiple Referrals' : 'Delete Referral'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the **{selectedRowCount} selected referral{selectedRowCount > 1 ? '(s)' : ''}**? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingReferrals}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            // Delete button now calls the handler and shows a loading spinner
                            onClick={() => handleDelete(Array.from(selectedItems))}
                            disabled={deletingReferrals}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deletingReferrals ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}