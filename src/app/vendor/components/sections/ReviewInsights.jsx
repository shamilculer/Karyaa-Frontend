"use client"
import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getReviewInsights } from "@/app/actions/vendor/analytics"

const ReviewInsights = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            const result = await getReviewInsights()

            if (result.success && result.data) {
                setData(result.data)
            } else {
                setError(result.message || "Failed to load review insights")
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    // Helper to render star rating
    const renderStars = (rating) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 me-1 ${i <= rating ? 'text-yellow-300' : 'text-gray-300'}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
            )
        }
        return stars
    }

    // Helper to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    }

    return (
        <Card className="flex flex-col h-full w-full bg-white border border-gray-200 shadow-none rounded-md max-lg:!py-4">
            <CardHeader className="items-center pb-0 max-lg:!px-3">
                <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest">
                    Review Insights
                </CardTitle>
                <CardDescription className="text-xs">
                    Overview of reviews received.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : !data ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-gray-500">No review data available</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-heading text-[#121217] font-medium">
                                {data.averageRating.toFixed(1)}<span className="text-2xl">/5</span>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    {renderStars(Math.round(data.averageRating))}
                                </div>
                            </div>
                        </div>

                        {data.flaggedCount > 0 && (
                            <div className="mt-3 bg-orange-50 p-2 rounded-lg flex items-center justify-between border border-orange-100 px-3">
                                <span className="text-xs text-orange-700 font-medium">Flagged for removal</span>
                                <span className="text-sm font-bold text-orange-800">{data.flaggedCount}</span>
                            </div>
                        )}

                        <div className="mt-8 lg:mt-6">
                            <div className="w-full space-y-5">
                                {data.recentReviews && data.recentReviews.length > 0 ? (
                                    data.recentReviews.map((review, index) => (
                                        <div key={review._id || index} className="border-b border-gray-300 lg:p-4 max-lg:pb-6 relative">
                                            {review.flaggedForRemoval && (
                                                <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-medium border border-red-200">
                                                    Flagged
                                                </span>
                                            )}

                                            <div className="w-full flex-between gap-5">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="size-10 border border-gray-400 rounded-full">
                                                        <AvatarImage
                                                            className="object-cover size-full"
                                                            src={review.user?.profileImage || "/default-avatar.png"}
                                                        />
                                                        <AvatarFallback>
                                                            {review.user?.username?.substring(0, 2).toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <h5 className="uppercase !text-base max-lg:!text-sm !font-medium">
                                                            {review.user?.username || "Anonymous"}
                                                        </h5>
                                                        <span className="!text-xs text-gray-500 px-2">
                                                            {formatDate(review.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="mt-4 !text-xs lg:!text-sm line-clamp-2">
                                                    {review.comment || "No comment provided."}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-gray-500">No reviews yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4 text-sm">
                <Button asChild variant="outline" className="rounded-lg p-4 hover:bg-secondary hover:text-white">
                    <Link href="/vendor/reviews">Know More</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ReviewInsights