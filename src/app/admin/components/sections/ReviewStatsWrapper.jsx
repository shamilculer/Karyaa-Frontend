"use client"
import * as React from "react"
import { Clock, Flag, LayoutList, Star, ChevronUp, ChevronDown, Building2, Phone, Mail } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { getReviewStats } from "@/app/actions/admin/platformAnalytics"

// --- Vendor HoverCard Content Component ---
const VendorDetailsHoverCard = ({ vendor }) => {
    return (
        <HoverCardContent className="w-80 p-4 border bg-white border-gray-200 shadow-lg">
            <Link href="#" className="flex items-center space-x-3 mb-3 border-b border-gray-200 pb-3">
                <Avatar className="size-10">
                    {vendor.businessLogo && <AvatarImage src={vendor.businessLogo} alt={vendor.name} />}
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">{vendor.name?.split(' ').map(n => n[0]).join('') || 'V'}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="text-sm !font-medium text-gray-900">{vendor.name}</h4>
                    <p className="!text-xs text-gray-500">{vendor.category}</p>
                </div>
            </Link>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Contact Person:</span> {vendor.contact || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Phone:</span> {vendor.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Email:</span> {vendor.email || 'N/A'}
                </div>
            </div>
        </HoverCardContent>
    )
}

// --- Top Rated Vendors Component ---
export const TopRatedVendors = ({ vendors, loading }) => {
    if (loading) {
        return (
            <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
                <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                    <CardTitle className="uppercase font-normal tracking-widest text-base text-green-700">
                        Top Rated Vendors
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
            <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                <CardTitle className="uppercase font-normal tracking-widest text-base text-green-700">
                    Top Rated Vendors
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 px-3">
                {vendors.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No vendors found</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {vendors.map((vendor) => (
                            <HoverCard key={vendor._id} openDelay={200}>
                                <HoverCardTrigger asChild>
                                    <li className="flex justify-between items-center p-3 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                        {/* Icon and Vendor Name/Category on the left */}
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Avatar className="size-10">
                                                {vendor.businessLogo && <AvatarImage src={vendor.businessLogo} alt={vendor.name} />}
                                                <AvatarFallback className="bg-green-100 text-green-600 font-semibold">{vendor.name?.split(' ').map(n => n[0]).join('') || 'V'}</AvatarFallback>
                                            </Avatar>
                                            <ChevronUp className="size-5 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="!text-sm font-medium text-gray-900 truncate">{vendor.name}</p>
                                                <p className="!text-xs text-gray-500 truncate">{vendor.category}</p>
                                            </div>
                                        </div>

                                        {/* Rating and Count on the right */}
                                        <div className="flex items-center gap-1">
                                            <Star className="size-4 text-yellow-500" fill="currentColor" />
                                            <span className="text-sm font-bold text-gray-900">{vendor.rating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-xs text-gray-500">({vendor.count || 0})</span>
                                        </div>
                                    </li>
                                </HoverCardTrigger>
                                <VendorDetailsHoverCard vendor={vendor} />
                            </HoverCard>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

// --- Least Rated Vendors Component ---
export const LeastRatedVendors = ({ vendors, loading }) => {
    if (loading) {
        return (
            <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
                <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                    <CardTitle className="uppercase font-normal tracking-widest text-base text-red-700">
                        Least Rated Vendors
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
            <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                <CardTitle className="uppercase font-normal tracking-widest text-base text-red-700">
                    Least Rated Vendors
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 px-3">
                {vendors.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No vendors found</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {vendors.map((vendor) => (
                            <HoverCard key={vendor._id} openDelay={200}>
                                <HoverCardTrigger asChild>
                                    <li className="flex justify-between items-center p-3 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                        {/* Icon and Vendor Name/Category on the left */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className="size-10">
                                                {vendor.businessLogo && <AvatarImage src={vendor.businessLogo} alt={vendor.name} />}
                                                <AvatarFallback className="bg-red-100 text-red-600 font-semibold">{vendor.name?.split(' ').map(n => n[0]).join('') || 'V'}</AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="size-5 text-red-600 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="!text-sm font-medium text-gray-900 truncate">{vendor.name}</p>
                                                <p className="!text-xs text-gray-500 truncate">{vendor.category}</p>
                                            </div>
                                        </div>

                                        {/* Rating and Count on the right */}
                                        <div className="flex items-center gap-1">
                                            <Star className="size-4 text-yellow-500" fill="currentColor" />
                                            <span className="text-sm font-bold text-gray-900">{vendor.rating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-xs text-gray-500">({vendor.count || 0})</span>
                                        </div>
                                    </li>
                                </HoverCardTrigger>
                                <VendorDetailsHoverCard vendor={vendor} />
                            </HoverCard>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

// --- Overview Component (Stats List) ---
const Overview = ({ stats, loading }) => {
    const reviewStats = [
        {
            icon: <LayoutList className="size-5 text-indigo-500" />,
            label: "Total Reviews",
            value: stats?.totalReviews?.toLocaleString() || "0",
        },
        {
            icon: <Clock className="size-5 text-gray-500" />,
            label: "Reviews Pending Approval",
            value: stats?.pendingReviews?.toLocaleString() || "0",
        },
        {
            icon: <Flag className="size-5 text-red-500" />,
            label: "Removal Request",
            value: stats?.removalRequests?.toLocaleString() || "0",
        },
    ]

    if (loading) {
        return (
            <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
                <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                    <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest text-base">
                        Review Overview Stats
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
            <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest text-base">
                    Review Overview Stats
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 px-4">
                <ul className="divide-y divide-gray-100">
                    {reviewStats.map((stat, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {stat.icon}
                                <span className="text-sm font-medium text-gray-900">{stat.label}</span>
                            </div>

                            <span className="text-sm font-bold text-gray-900">
                                {stat.value}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

// --- Wrapper Component ---
const ReviewStatsWrapper = () => {
    const [data, setData] = React.useState({
        overview: {},
        topRatedVendors: [],
        leastRatedVendors: [],
    })
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getReviewStats()

                if (response.success && response.data) {
                    setData(response.data)
                } else {
                    setError("Failed to load review statistics")
                }
            } catch (err) {
                console.error("Error loading review stats:", err)
                setError("An error occurred loading data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (error) {
        return (
            <div className="w-full grid grid-cols-3 gap-8">
                <Card className="col-span-3 p-6 text-center text-red-500">
                    {error}
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full grid grid-cols-3 gap-8">
            <Overview stats={data.overview} loading={loading} />
            <TopRatedVendors vendors={data.topRatedVendors} loading={loading} />
            <LeastRatedVendors vendors={data.leastRatedVendors} loading={loading} />
        </div>
    )
}

export default ReviewStatsWrapper
