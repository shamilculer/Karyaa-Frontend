'use client';

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import ReviewsToolbar from "../components/sections/ReviewsToolbar";
import { Star, Trash } from 'lucide-react';
import { useVendorStore } from '@/store/vendorStore';
import { getReviewStats } from '@/app/actions/vendor/reviews';
import { getAllVendorReviews } from '@/app/actions/shared/reviews';
import { flagReviewForRemoval } from '@/app/actions/vendor/reviews';
import { GlobalPagination } from '@/components/common/GlobalPagination';
import { toast } from "sonner";


export default function ReviewsManagePage() {
    return (
        <Suspense
            fallback={<div className="text-center py-20 text-lg text-gray-500">Loading reviews...</div>}
        >
            <ReviewsManagePageContent />
        </Suspense>
    );
}

function ReviewsManagePageContent() {

    const { vendor } = useVendorStore();
    const vendorId = vendor?.id;

    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    // ✅ Reviews state
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // ✅ Pagination state
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        totalReviews: 0,
    });

    // ✅ Stats state
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // ✅ Error
    const [error, setError] = useState(null);

    // ✅ Loading flag state
    const [flaggingId, setFlaggingId] = useState(null);

    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = 6;

    // Fetch Stats
    useEffect(() => {
        if (!vendorId) return;

        async function fetchStats() {
            try {
                setLoadingStats(true);
                const data = await getReviewStats(vendorId);
                setStats(data);
            } catch {
                setError("Failed to load review statistics.");
            } finally {
                setLoadingStats(false);
            }
        }

        fetchStats();
    }, [vendorId]);

    // Fetch Reviews
    useEffect(() => {
        if (!vendorId) return;

        async function fetchReviews() {
            try {
                setLoadingReviews(true);
                const data = await getAllVendorReviews(
                    vendorId,
                    currentPage,
                    limit,
                    filterRating,
                    searchTerm,
                );

                setReviews(data.reviews || []);
                setPagination({
                    totalPages: data.totalPages,
                    currentPage: data.page,
                    totalReviews: data.totalReviews,
                });

            } catch {
                setError("Something went wrong fetching reviews.");
            } finally {
                setLoadingReviews(false);
            }
        }

        fetchReviews();
    }, [vendorId, currentPage, filterRating, searchTerm]);


    async function handleFlag(reviewId) {
        try {
            setFlaggingId(reviewId);
    
            const res = await flagReviewForRemoval(reviewId);
    
            if (res.error) {
                toast.error(res.error || "Failed to flag review.");
                return;
            }
    
            toast.success("Review flagged successfully!");
    
            // reflect UI instantly
            setReviews(prev =>
                prev.map(r => r._id === reviewId
                    ? { ...r, flaggedForRemoval: true, status: "Pending" }
                    : r
                )
            );
    
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        } finally {
            setFlaggingId(null);
        }
    }


    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-300 fill-yellow-300' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="dashboard-container space-y-8 mb-10">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className='w-full flex max-lg:flex-col max-lg:items-center gap-14 my-10'>
                <div className="w-full lg:w-1/5 flex-center flex-col gap-3">
                    {loadingStats ? (
                        <div className="text-lg text-gray-500">Loading stats...</div>
                    ) :  (
                        <>
                            <div className="text-3xl font-heading font-medium">
                                {stats.averageRating?.toFixed(1)}
                                <span>/5</span>
                            </div>
                            <div className="flex items-center">
                                {renderStars(Math.round(stats.averageRating))}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stats.totalReviews} Approved Reviews
                            </div>
                        </>
                    )}
                </div>

                {/* Breakdown */}
                <div className="w-full lg:w-4/5">
                    <div className="max-w-md space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats?.ratingBreakdown?.[star] || 0;
                            const percentage = stats?.totalReviews
                                ? Math.round((count / stats.totalReviews) * 100)
                                : 0;

                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {star} <Star className="text-yellow-300 fill-yellow-300 w-3 h-3 ml-1" />
                                    </div>
                                    <Progress value={percentage} className="h-2 flex-1 bg-gray-200" />
                                    <span className="text-sm font-medium text-gray-700">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ReviewsToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterRating={filterRating}
                onFilterChange={setFilterRating}
            />

            {/* Review Listing */}
            <div className="mt-8 mb-16">
                {loadingReviews ? (
                    <div className="text-gray-500 text-center">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                        {reviews.map(review => (
                            <div key={review._id} className="border border-gray-300 rounded-lg p-4 md:p-8">
                                <div className='w-full flex-between max-md:flex-col max-md:!items-start border-b gap-5 border-gray-300 pb-5'>
                                    <div className="flex items-center  gap-5">
                                        <Avatar className="size-12 md:size-16 rounded-full">
                                            <AvatarImage src={review.user?.profileImage} />
                                            <AvatarFallback>{review.user?.username?.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h5 className="text-base md:text-lg font-medium">{review.user?.username}</h5>
                                            <span className="!text-xs md:!text-sm text-gray-500">
                                                {new Date(review.createdAt).toDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center max-md:justify-end gap-3">
                                        {/* Status */}
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full capitalize
                                                ${review.status === "Approved" ? "bg-green-100 text-green-700" : ""}
                                                ${review.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
                                                ${review.status === "Rejected" ? "bg-red-100 text-red-700" : ""}
                                            `}
                                        >
                                            {review.status}
                                        </span>

                                        {/* Flag UI */}
                                        {review.flaggedForRemoval ? (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                Flagged for Removal
                                            </span>
                                        ) : (
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                disabled={flaggingId === review._id}
                                                onClick={() => handleFlag(review._id)}
                                            >
                                                <Trash className="w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-5">
                                    <div className="flex items-center gap-3">
                                        {renderStars(review.rating)}
                                        <span className="font-semibold">{review.rating}/5</span>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No reviews match your search or filter.</div>
                )}
            </div>

            <GlobalPagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                pageQueryKey="page"
            />
        </div>
    );
}

export { ReviewsManagePageContent };
