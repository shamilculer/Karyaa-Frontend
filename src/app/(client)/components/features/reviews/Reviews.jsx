"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getInitials } from '@/utils';
import { Button } from '@/components/ui/button';
import { getVendorReviews } from '@/app/actions/shared/reviews';
import { toast } from 'sonner';

// Helper to pick a consistent color from name
function getBgColor(name) {
    const colors = [
        "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    ];
    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

const Reviews = ({ initialReviews, vendorId, totalPages: initialTotalPages, totalReviews }) => {
    const [reviews, setReviews] = useState(initialReviews);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [isLoading, setIsLoading] = useState(false);

    const handlePageChange = async (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

        setIsLoading(true);
        try {
            const result = await getVendorReviews(vendorId, newPage);

            if (result.error) {
                toast.error(result.error);
            } else {
                setReviews(result.reviews);
                setCurrentPage(result.page);
                setTotalPages(result.totalPages);
                // Scroll to top of reviews section
                const reviewsSection = document.getElementById('reviews');
                if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-10 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {reviews.map((reviewData) => (
                    <ReviewCard key={reviewData._id} review={reviewData} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first, last, current, and surrounding pages
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        disabled={isLoading}
                                        className={`h-9 w-9 p-0 ${currentPage === page ? 'pointer-events-none' : ''}`}
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (
                                (page === currentPage - 2 && page > 1) ||
                                (page === currentPage + 2 && page < totalPages)
                            ) {
                                return <span key={page} className="text-gray-400">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="text-center text-sm text-gray-500">
                Showing {reviews.length} of {totalReviews} reviews
            </div>
        </div>
    );
};

export default Reviews;

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    );
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const ReviewCard = ({ review }) => {
    const { user, rating, comment, createdAt } = review;

    const userInitials = getInitials(user.username)
    const bgColor = getBgColor(user.username);

    return (
        <div>

            {/* 1. Header: User Info and Rating */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">

                    <Avatar className="size-16 rounded-full">
                        <AvatarImage
                            src={user.profileImage}
                            alt={user.username}
                            className="size-full object-cover mr-4 ring-2 ring-indigo-400/50"
                        />
                        <AvatarFallback className={`${bgColor} text-white font-bold flex items-center justify-center`} >{userInitials}</AvatarFallback>
                    </Avatar>

                    {/* Username and Date */}
                    <div>
                        <p className="!text-lg font-bold text-gray-800 capitalize">{user.username}</p>
                        <p className="!text-sm text-gray-500">
                            Reviewed on {formatDate(createdAt)}
                        </p>
                    </div>
                </div>

                {/* Rating Stars */}
                <StarRating rating={rating} />
            </div>

            {/* 2. Review Comment */}
            <div>
                <p className="text-gray-700 leading-relaxed">
                    {comment}
                </p>
            </div>
        </div>
    );
};
