"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Filter, ChevronDown, Check, X, Trash2, Clock, Eye, Flag, AlertTriangle } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getInitials } from '@/utils';
import { getFlaggedReviews, adminUpdateReview, deleteReview } from '@/app/actions/admin/flaggedReviews';
import { toast } from "sonner";

const FlaggedReviewsDataTable = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [selectedReviews, setSelectedReviews] = useState([]);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getFlaggedReviews(currentPage, 10, statusFilter, searchTerm);
            if (res.error) {
                toast.error(res.error);
            } else {
                setReviews(res.reviews);
                setTotalPages(res.totalPages);
                setTotalReviews(res.totalReviews);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReviews();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchReviews]);

    const handleAction = async (id, action) => {
        let res;
        if (action === 'Approve') {
            res = await adminUpdateReview(id, { status: 'Approved', flaggedForRemoval: false });
        } else if (action === 'Reject') {
            res = await adminUpdateReview(id, { status: 'Rejected', flaggedForRemoval: false });
        } else if (action === 'Delete') {
            res = await deleteReview(id);
        } else if (action === 'DismissFlag') {
            res = await adminUpdateReview(id, { flaggedForRemoval: false });
        }

        if (res?.success) {
            toast.success(res.message);
            fetchReviews();
            setSelectedReviews(prev => prev.filter(rId => rId !== id));
        } else {
            toast.error(res?.error || "Action failed");
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedReviews.length === 0) return;

        // Execute actions in parallel
        const promises = selectedReviews.map(id => handleAction(id, action));
        await Promise.all(promises);

        setSelectedReviews([]);
        toast.success(`Bulk ${action} completed`);
    };

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300';
            case 'Approved': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300';
            case 'Rejected': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
        }
    };

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

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">

                {/* Left Side: Search & Filters */}
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search text..."
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
                            <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending Approval</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Approved')}>Approved</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Rejected')}>Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                <DropdownMenuItem onClick={() => handleBulkAction('Approve')}>
                                    <Check className="w-4 h-4 mr-2 text-green-600" /> Bulk Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('Reject')}>
                                    <X className="w-4 h-4 mr-2 text-red-600" /> Bulk Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('DismissFlag')}>
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
                                ${selectedReviews.includes(review._id) ? 'bg-indigo-50 border-indigo-300' : 'bg-transparent hover:bg-gray-50'}`}
                        >

                            {/* Left Section: Checkbox & Primary Metadata */}
                            <div className="flex flex-col items-start w-80 pr-4 border-r border-gray-100 flex-shrink-0 space-y-5">
                                <div className="flex items-center space-x-3 mb-1">
                                    <Checkbox
                                        checked={selectedReviews.includes(review._id)}
                                        onCheckedChange={(checked) => handleSelectReview(review._id, checked)}
                                    />
                                    <span className="!text-sm font-medium text-gray-900 flex items-center gap-2">
                                        Review #{review._id.slice(-6)}
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </span>
                                </div>

                                {/* User Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm mt-5">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage className="size-full object-cover" src={review.user?.profileImage} alt={`${review.user?.username || review.guestName} avatar`} />
                                        <AvatarFallback>{getInitials(review.user?.username || review.guestName || "Guest")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="!font-medium font-heading text-gray-900 !leading-5">{review.user?.username || review.guestName || 'Guest User'}</p>
                                        <p className="!text-xs text-gray-500">{review.user ? "Reviewer" : "Guest Reviewer"}</p>
                                    </div>
                                </div>

                                {/* Vendor Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={review.vendor?.businessLogo} alt={`${review.vendor?.businessName} avatar`} />
                                        <AvatarFallback>{getInitials(review.vendor?.businessName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="!font-medium text-gray-700 font-heading !leading-5">{review.vendor?.businessName || 'Unknown Vendor'}</p>
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
                                    <div className="flex items-center text-red-500 font-medium">
                                        <Flag className="w-3 h-3 mr-1" />
                                        Flagged for Removal
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
                                        <DropdownMenuItem onClick={() => handleAction(review._id, 'DismissFlag')}>
                                            <Flag className="w-4 h-4 mr-2" /> Dismiss Flag
                                        </DropdownMenuItem>
                                        {review.status !== 'Approved' && (
                                            <DropdownMenuItem onClick={() => handleAction(review._id, 'Approve')} className="text-green-600">
                                                <Check className="w-4 h-4 mr-2" /> Approve
                                            </DropdownMenuItem>
                                        )}
                                        {review.status !== 'Rejected' && (
                                            <DropdownMenuItem onClick={() => handleAction(review._id, 'Reject')} className="text-red-600">
                                                <X className="w-4 h-4 mr-2" /> Reject
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
                        No flagged reviews match the current search or filters.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {reviews.length > 0 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default FlaggedReviewsDataTable;
