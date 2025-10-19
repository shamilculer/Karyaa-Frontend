'use client';

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import OverViewStats from '../components/common/OverViewStats'
import { Progress } from '@/components/ui/progress'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button';

// Import the new toolbar component
import ReviewsToolbar from '../components/ReviewsToolbar';

import { vendors } from '@/utils'
import { Trash } from 'lucide-react';

// Mock data for reviews
const reviews = [
    {
        id: 1,
        author: 'Ananya Sharma',
        date: '11 MAR 2025',
        rating: 5,
        content: 'Elegant Event Decor completely transformed our wedding venue into a fairytale setting. From the floral arrangements to the lighting, every detail was handled with such creativity and care. The team was professional, attentive, and made the entire process stress-free. Our guests were blown away by how beautiful everything looked!',
        avatar: vendors[3].image,
        fallback: 'AS'
    },
    {
        id: 2,
        author: 'Yusuf Rahman',
        date: '11 MAR 2025',
        rating: 5,
        content: 'We hired Elegant Event Decor for our company’s annual gala, and they delivered beyond expectations. The décor perfectly reflected our brand while still creating a warm and elegant atmosphere. Their team was punctual, organized, and extremely easy to work with. Truly a five-star experience.',
        avatar: vendors[3].image,
        fallback: 'YR'
    },
    {
        id: 3,
        author: 'Fatima Ahmed',
        date: '05 MAR 2025',
        rating: 4,
        content: 'Good service overall, but communication could be a bit faster. The final setup was beautiful and met our expectations for the birthday party.',
        avatar: vendors[3].image,
        fallback: 'FA'
    },
    {
        id: 4,
        author: 'David Chen',
        date: '28 FEB 2025',
        rating: 5,
        content: 'Outstanding professionalism and stunning creativity. They made my event truly special. Highly recommend!',
        avatar: vendors[3].image,
        fallback: 'DC'
    },
    {
        id: 5,
        author: 'Sara Khan',
        date: '20 FEB 2025',
        rating: 3,
        content: 'The decor was nice, but some details were overlooked. It was a good experience, but not perfect.',
        avatar: vendors[3].image,
        fallback: 'SK'
    },
    {
        id: 6,
        author: 'Omar Al-Mansoori',
        date: '15 JAN 2025',
        rating: 5,
        content: 'Absolutely fantastic! Every single detail was perfect. The team is very talented and professional.',
        avatar: vendors[3].image,
        fallback: 'OA'
    }
]

const ReviewsManagePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    // Get the current page from the URL search parameters, defaulting to 1
    const currentPage = Number(searchParams.get('page')) || 1;
    const reviewsPerPage = 2;

    // Filter reviews based on search term and rating filter
    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = filterRating === 'all' || review.rating === Number(filterRating);
            return matchesSearch && matchesRating;
        });
    }, [searchTerm, filterRating]);

    // Calculate pagination values
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    // Function to handle page change and update the URL
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`?${params.toString()}`);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 me-1 ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className='w-full flex gap-14 my-10'>
                {/* Review summary section */}
                <div className="w-1/5 flex-center flex-col gap-3">
                    <div className="text-7xl font-heading text-[#121217] font-medium">
                        4.6<span className="text-2xl">/5</span>
                    </div>

                    <div className="flex items-center">
                        {renderStars(4.6)}
                    </div>
                    <div>{reviews.length} Reviews</div>
                </div>

                {/* Progress bars section */}
                <div className="w-4/5 ">
                    <div className="w-[500px] space-y-3">
                        {/* You'll need to calculate these values dynamically based on your data */}
                        <div className="w-full flex items-center gap-3">
                            <span className="text-sm">5</span>
                            <Progress value={80} />
                            <span className="text-xs font-medium text-gray-500">42%</span>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <span className="text-sm">4</span>
                            <Progress value={20} />
                            <span className="text-xs font-medium text-gray-500">20%</span>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <span className="text-sm">3</span>
                            <Progress value={10} />
                            <span className="text-xs font-medium text-gray-500">10%</span>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <span className="text-sm">2</span>
                            <Progress value={5} />
                            <span className="text-xs font-medium text-gray-500">5%</span>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <span className="text-sm">1</span>
                            <Progress value={5} />
                            <span className="text-xs font-medium text-gray-500">5%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use the new toolbar component */}
            <ReviewsToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterRating={filterRating}
                onFilterChange={setFilterRating}
            />

            {/* Render reviews from the current page */}
            <div className="mt-8 mb-16">
                <div className="w-full grid grid-cols-2 gap-7">
                    {currentReviews.length > 0 ? (
                        currentReviews.map(review => (
                            <div key={review.id} className="border border-gray-300 rounded-lg p-8">
                                <div className='w-full flex-between border-b border-gray-300'>
                                    <div className="w-full flex items-center gap-5 pb-5 ">
                                        <Avatar className="size-16 rounded-full">
                                            <AvatarImage className="object-cover size-full" src={review.avatar} />
                                            <AvatarFallback className="bg-blue-200">{review.fallback}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h5 className="text-lg !font-medium">{review.author}</h5>
                                            <span className="text-sm text-gray-500 px-2">{review.date}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <Button variant="ghost" className="!font-semibold text-red-500"><Trash className='w-4'/> Request To Remove</Button>
                                    </div>
                                </div>
                                <div className="py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="font-semibold">{review.rating}/5</span>
                                    </div>
                                    <p className="mt-4 !text-sm">{review.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No reviews match your search or filter criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination controls with shadcn/ui */}
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === index + 1}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ReviewsManagePage;