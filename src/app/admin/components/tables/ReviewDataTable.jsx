"use client"
import React, { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Filter, ChevronDown, Check, X, Trash2, Clock, Eye, Flag } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getInitials } from '@/utils';


// --- Sample Data ---
const ALL_REVIEWS = [
    { id: 501, vendorName: "Sparkle Decor Solutions", userName: "Ayman Malik", rating: 5, text: "The decor was absolutely breathtaking and transformed the venue!", date: "2024-05-10", status: "Pending", reported: false, userAvatar: "https://placehold.co/40x40/2563EB/fff?text=AM", vendorAvatar: "https://placehold.co/40x40/F59E0B/fff?text=SD" },
    { id: 502, vendorName: "Gourmet Catering Co.", userName: "Sana Khan", rating: 3, text: "Food quality was excellent, but the service was a bit slow.", date: "2024-05-08", status: "Approved", reported: false, userAvatar: "https://placehold.co/40x40/EC4899/fff?text=SK", vendorAvatar: "https://placehold.co/40x40/10B981/fff?text=GC" },
    { id: 503, vendorName: "Elite Photography Studio", userName: "David Lee", rating: 1, text: "They completely missed the key moments of my event. Very disappointed.", date: "2024-05-05", status: "Approved", reported: true, userAvatar: "https://placehold.co/40x40/9333EA/fff?text=DL", vendorAvatar: "https://placehold.co/40x40/D9460B/fff?text=EP" },
    { id: 504, vendorName: "Budget Bounce House", userName: "Fatima Al-Mansoori", rating: 5, text: "Great value for money and the kids loved it!", date: "2024-05-01", status: "Approved", reported: false, userAvatar: "https://placehold.co/40x40/3B82F6/fff?text=FA", vendorAvatar: "https://placehold.co/40x40/F59E0B/fff?text=BB" },
    { id: 505, vendorName: "Outdated Designs Inc.", userName: "Omar N.", rating: 2, text: "The rental equipment was old and dirty. Poor experience.", date: "2024-04-28", status: "Pending", reported: false, userAvatar: "https://placehold.co/40x40/EF4444/fff?text=ON", vendorAvatar: "https://placehold.co/40x40/10B981/fff?text=OD" },
    { id: 506, vendorName: "Sparkle Decor Solutions", userName: "Layla Z.", rating: 4, text: "Very professional, minor delay in setup but beautiful result.", date: "2024-04-25", status: "Rejected", reported: false, userAvatar: "https://placehold.co/40x40/6366F1/fff?text=LZ", vendorAvatar: "https://placehold.co/40x40/D9460B/fff?text=SD" },
];

const REVIEWS_PER_PAGE = 15;

const ReviewDataTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Status color mapping for the Badge
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300';
            case 'Approved': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300';
            case 'Rejected': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
        }
    };;

    // --- Filtering and Searching Logic ---
    const reviewsAfterFilter = useMemo(() => {
        return ALL_REVIEWS.filter(review => {
            if (statusFilter !== 'All' && review.status !== statusFilter) {
                return false;
            }
            if (ratingFilter > 0 && review.rating > ratingFilter) {
                return false;
            }
            if (searchTerm.trim() !== '') {
                const searchLower = searchTerm.toLowerCase();
                const matches = (
                    review.vendorName.toLowerCase().includes(searchLower) ||
                    review.userName.toLowerCase().includes(searchLower) ||
                    review.text.toLowerCase().includes(searchLower)
                );
                return matches;
            }
            return true;
        });
    }, [searchTerm, statusFilter, ratingFilter]);
    
    // --- Pagination Logic ---
    const totalPages = Math.ceil(reviewsAfterFilter.length / REVIEWS_PER_PAGE);
    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        return reviewsAfterFilter.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
    }, [reviewsAfterFilter, currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedReviews([]); // Clear selection on page change
        }
    };

    // --- Selection Logic ---
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedReviews(paginatedReviews.map(r => r.id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handleSelectReview = (id, checked) => {
        setSelectedReviews(prev =>
            checked ? [...prev, id] : prev.filter(reviewId => reviewId !== id)
        );
    };

    const isAllSelected = selectedReviews.length === paginatedReviews.length && paginatedReviews.length > 0;
    const isIndeterminate = selectedReviews.length > 0 && selectedReviews.length < paginatedReviews.length;

    // --- Placeholder Moderation Actions ---
    const performBulkAction = (action) => {
        // In a real app, this would make an API call to update the reviews
        alert(`${action} action performed on ${selectedReviews.length} reviews.`);
        setSelectedReviews([]);
    };

    const performSingleAction = (id, action) => {
        // In a real app, this would make an API call to update the review
        alert(`${action} action performed on review ID: ${id}`);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                
                {/* Left Side: Search & Filters */}
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search vendors, users, or text..."
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

                    {/* Low Rating Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 order border-gray-200 bg-[#F2F4FF] text-primary">
                                <Star className="w-4 h-4 text-yellow-500" />
                                Rating: {ratingFilter === 0 ? 'All' : `≤ ${ratingFilter} Stars`}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter Low Ratings</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setRatingFilter(0)}>All Ratings</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRatingFilter(3)}>Show 3 Stars or Less</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRatingFilter(2)}>Show 2 Stars or Less</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRatingFilter(1)}>Show 1 Star</DropdownMenuItem>
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
                                <DropdownMenuItem onClick={() => performBulkAction('Approve')}>
                                    <Check className="w-4 h-4 mr-2 text-green-600" /> Bulk Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => performBulkAction('Reject')}>
                                    <X className="w-4 h-4 mr-2 text-red-600" /> Bulk Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => performBulkAction('Delete')} className="text-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" /> Bulk Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Review List */}
            <div className="space-y-7">
                {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                        <div 
                            key={review.id} 
                            className={`flex items-start p-4 border-b border-gray-200 transition-colors 
                                ${selectedReviews.includes(review.id) ? 'bg-indigo-50 border-indigo-300' : 'bg-transparent hover:bg-gray-50'}`}
                        >
                            
                            {/* Left Section: Checkbox & Primary Metadata */}
                            <div className="flex flex-col items-start w-80 pr-4 border-r border-gray-100 flex-shrink-0 space-y-5">
                                <div className="flex items-center space-x-3 mb-1">
                                    <Checkbox
                                        checked={selectedReviews.includes(review.id)}
                                        onCheckedChange={(checked) => handleSelectReview(review.id, checked)}
                                    />
                                    <span className="!text-sm font-medium text-gray-900">Review #{review.id}</span>
                                </div>
                                
                                {/* User Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm mt-5">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={review.userAvatar} alt={`${review.userName} avatar`} />
                                        <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="!font-medium font-heading text-gray-900 !leading-5">{review.userName}</p>
                                        <p className="!text-xs text-gray-500">Reviewer</p>
                                    </div>
                                </div>
                                
                                {/* Vendor Avatar and Name */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={review.vendorAvatar} alt={`${review.vendorName} avatar`} />
                                        <AvatarFallback>{getInitials(review.vendorName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="!font-medium text-gray-700 font-heading !leading-5">{review.vendorName}</p>
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
                                    {review.text}
                                </p>

                                {/* Date and Reported Status */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 pt-1">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {review.date}
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
                                        <DropdownMenuItem onClick={() => alert(`Viewing full details for ${review.id}`)}>
                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                        </DropdownMenuItem>
                                        {review.status !== 'Approved' && (
                                            <DropdownMenuItem onClick={() => performSingleAction(review.id, 'Approve')} className="text-green-600">
                                                <Check className="w-4 h-4 mr-2" /> Approve
                                            </DropdownMenuItem>
                                        )}
                                        {review.status !== 'Rejected' && (
                                            <DropdownMenuItem onClick={() => performSingleAction(review.id, 'Reject')} className="text-red-600">
                                                <X className="w-4 h-4 mr-2" /> Reject
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => performSingleAction(review.id, 'Delete')} className="text-red-500">
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
            {reviewsAfterFilter.length > 0 && (
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
            )}
        </div>
    );
};

export default ReviewDataTable;
