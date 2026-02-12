"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Filter, ChevronDown, Check, X, Trash2, Clock, Eye, AlertTriangle, Flag } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getInitials } from '@/utils';
import { getAllReviews, adminUpdateReview, deleteReview } from '@/app/actions/admin/flaggedReviews';
import { toast } from 'sonner';

const ReviewDataTable = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [flaggedFilter, setFlaggedFilter] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllReviews(currentPage, 15, statusFilter, searchTerm, flaggedFilter);
            if (response.error) {
                toast.error(response.error);
            } else {
                setReviews(response.reviews || []);
                setTotalPages(response.totalPages || 1);
                setTotalReviews(response.totalReviews || 0);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchTerm, flaggedFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReviews();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchReviews]);

    // Status color mapping for the Badge
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300';
            case 'Approved': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300';
            case 'Rejected': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedReviews([]); // Clear selection on page change
        }
    };

    // --- Selection Logic ---
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedReviews(reviews.map(r => r._id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handleSelectReview = (id, checked) => {
        setSelectedReviews(prev =>
            checked ? [...prev, id] : prev.filter(reviewId => reviewId !== id)
        );
    };

    const isAllSelected = reviews.length > 0 && selectedReviews.length === reviews.length;
    const isIndeterminate = selectedReviews.length > 0 && selectedReviews.length < reviews.length;

    // --- Actions ---
    const handleAction = async (id, action) => {
        let result;
        if (action === 'Delete') {
            if (!confirm("Are you sure you want to delete this review?")) return;
            result = await deleteReview(id);
        } else if (action === 'Dismiss Flag') {
            result = await adminUpdateReview(id, { flaggedForRemoval: false });
        } else {
            // Approve or Reject
            result = await adminUpdateReview(id, { status: action });
        }

        if (result.success) {
            toast.success(result.message);
            fetchReviews(); // Refresh data
        } else {
            toast.error(result.error);
        }
    };

    const handleBulkAction = async (action) => {
        if (!confirm(`Are you sure you want to ${action} ${selectedReviews.length} reviews?`)) return;

        let successCount = 0;
        let failCount = 0;

        for (const id of selectedReviews) {
            let result;
            if (action === 'Delete') {
                result = await deleteReview(id);
            } else if (action === 'Dismiss Flag') {
                result = await adminUpdateReview(id, { flaggedForRemoval: false });
            } else {
                result = await adminUpdateReview(id, { status: action });
            }

            if (result.success) successCount++;
            else failCount++;
        }

        if (successCount > 0) toast.success(`Successfully processed ${successCount} reviews.`);
        if (failCount > 0) toast.error(`Failed to process ${failCount} reviews.`);

        setSelectedReviews([]);
        fetchReviews();
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

                {/* Left Side: Search & Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search Input */}
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 h-10 bg-white border-gray-300"
                        />
                    </div>

                    {/* Status Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border border-gray-200 bg-[#F2F4FF] text-primary">
                                <Filter className="w-4 h-4" />
                                Status: {statusFilter}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setStatusFilter('All')}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Approved')}>Approved</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Rejected')}>Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Flagged Filter Toggle */}
                    <Button
                        variant={flaggedFilter ? "destructive" : "outline"}
                        onClick={() => setFlaggedFilter(!flaggedFilter)}
                        className={`flex items-center gap-2 border ${flaggedFilter ? '' : 'border-gray-200 bg-[#F2F4FF] text-primary'}`}
                    >
                        <AlertTriangle className="w-4 h-4" />
                        {flaggedFilter ? "Showing Flagged" : "Show Flagged"}
                    </Button>
                </div>

                {/* Right Side: Select All and Bulk Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Checkbox
                            id="selectAll"
                            checked={isAllSelected ? true : (isIndeterminate ? "indeterminate" : false)}
                            onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="selectAll" className="font-medium">
                            Select All
                        </label>
                    </div>

                    {selectedReviews.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-primary text-white">
                                    Bulk Actions ({selectedReviews.length})
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBulkAction('Approved')}>
                                    <Check className="w-4 h-4 mr-2 text-green-600" /> Bulk Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('Rejected')}>
                                    <X className="w-4 h-4 mr-2 text-red-600" /> Bulk Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('Dismiss Flag')}>
                                    <Flag className="w-4 h-4 mr-2 text-blue-600" /> Bulk Dismiss Flag
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('Delete')} className="text-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" /> Bulk Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Review List */}
            <div className="space-y-7">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className={`flex items-start p-4 border-b border-gray-200 transition-colors 
                                ${selectedReviews.includes(review._id) ? 'bg-indigo-50 border-indigo-300' : 'bg-transparent hover:bg-gray-50'}
                                ${review.flaggedForRemoval ? 'bg-red-50 border-l-4 border-l-red-500' : ''}
                            `}
                        >

                            {/* Left Section: Checkbox & Primary Metadata */}
                            <div className="flex flex-col items-start w-80 pr-4 border-r border-gray-100 flex-shrink-0 space-y-5">
                                <div className="flex items-center space-x-3 mb-1">
                                    <Checkbox
                                        checked={selectedReviews.includes(review._id)}
                                        onCheckedChange={(checked) => handleSelectReview(review._id, checked)}
                                    />
                                    <span className="!text-sm font-medium text-gray-900">Review #{review._id.slice(-6)}</span>
                                    {review.flaggedForRemoval && (
                                        <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-5">Flagged</Badge>
                                    )}
                                </div>

                                {/* User Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm mt-5">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage className="size-full object-cover" src={review.user?.profileImage} alt={`${review.user?.username || review.guestName} avatar`} />
                                        <AvatarFallback>{getInitials(review.user?.username || review.guestName || "Guest")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <p className="!font-medium font-heading text-gray-900 !leading-5 cursor-pointer hover:underline">
                                                    {review.user?.username || review.guestName || "Guest User"}
                                                </p>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80 bg-white">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">{review.user ? "User" : "Guest"} Details</h4>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Email:</span> {review.user?.emailAddress || review.guestEmail || "N/A"}
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Mobile:</span> {review.user?.mobileNumber || review.guestPhone || "N/A"}
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                        <p className="!text-xs text-gray-500">{review.user ? "Reviewer" : "Guest Reviewer"}</p>
                                    </div>
                                </div>

                                {/* Vendor Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={review.vendor?.businessLogo} alt={`${review.vendor?.businessName} avatar`} />
                                        <AvatarFallback>{getInitials(review.vendor?.businessName || "Vendor")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <p className="!font-medium text-gray-700 font-heading !leading-5 cursor-pointer hover:underline">
                                                    {review.vendor?.businessName || "Unknown Vendor"}
                                                </p>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80 bg-white">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">Vendor Details</h4>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Owner:</span> {review.vendor?.ownerName || "N/A"}
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Email:</span> {review.vendor?.email || "N/A"}
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Phone:</span> {review.vendor?.phoneNumber || "N/A"}
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium">WhatsApp:</span> {review.vendor?.whatsAppNumber || "N/A"}
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                        <p className="!text-xs text-gray-500">Vendor Received</p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Section: Review Content & Rating */}
                            <div className="flex-grow px-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                    {/* Rating Stars */}
                                    <div className="flex items-center text-yellow-500">
                                        {Array(review.rating).fill(0).map((_, i) => <Star key={`filled-${i}`} className="w-4 h-4 fill-current" />)}
                                        {Array(5 - review.rating).fill(0).map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
                                    </div>
                                    <span className="text-xs text-gray-500">({review.rating}.0 / 5.0)</span>
                                </div>

                                {/* Review Text */}
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {review.comment}
                                </p>

                                {/* Date and Reported Status */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 pt-1">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Status Badge & Actions */}
                            <div className="flex flex-col items-end space-y-3 flex-shrink-0 pl-4">
                                <Badge variant="outline" className={`text-xs flex-center font-semibold uppercase ${getStatusColor(review.status)}`}>
                                    {review.status}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-8 bg-[#F2F4FF] text-primary border-gray-200 justify-center">
                                            Actions <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                        {review.status !== 'Approved' && (
                                            <DropdownMenuItem onClick={() => handleAction(review._id, 'Approved')} className="text-green-600">
                                                <Check className="w-4 h-4 mr-2" /> Approve
                                            </DropdownMenuItem>
                                        )}
                                        {review.status !== 'Rejected' && (
                                            <DropdownMenuItem onClick={() => handleAction(review._id, 'Rejected')} className="text-red-600">
                                                <X className="w-4 h-4 mr-2" /> Reject
                                            </DropdownMenuItem>
                                        )}
                                        {review.flaggedForRemoval && (
                                            <DropdownMenuItem onClick={() => handleAction(review._id, 'Dismiss Flag')} className="text-blue-600">
                                                <Flag className="w-4 h-4 mr-2" /> Dismiss Flag
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => handleAction(review._id, 'Delete')} className="text-red-500">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-lg">
                        No reviews match the current search or filters.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {
                reviews.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(i + 1)}
                                            isActive={currentPage === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )
            }
        </div >
    );
};

export default ReviewDataTable;