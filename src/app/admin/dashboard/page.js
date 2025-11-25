"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertCircle, Clock, MessageSquare, Flag, Users, Building2, Star, Mail, Calendar, Package, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserGrowthChart from '../components/charts/UserGrowthChart'
import VendorDistributionChart from '../components/charts/VendorDistributionChart'
import BundlePerformanceChart from '../components/charts/BundlePerformanceChart'
import EngagementMetricsChart from '../components/charts/EngagementMetricsChart'
import LeadMetricsChart from '../components/charts/LeadMetricsChart'
import { getActionItemsList, getDashboardOverview } from '@/app/actions/admin/dashboard'
import { getInitials } from '@/utils'

const AdminDashboard = () => {
    const [actionItems, setActionItems] = useState({
        pendingVendors: [],
        pendingVendorsCount: 0,
        flaggedReviews: [],
        flaggedReviewsCount: 0,
        expiringSoonSubscriptions: [],
        expiringSoonSubscriptionsCount: 0,
        openTickets: [],
        openTicketsCount: 0,
        newReferrals: [],
        newReferralsCount: 0,
    })
    const [overview, setOverview] = useState({
        totalActiveVendors: 0,
        totalRegisteredUsers: 0,
        activeAds: 0,
        totalInquiries: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [actionItemsResponse, overviewResponse] = await Promise.all([
                    getActionItemsList(),
                    getDashboardOverview()
                ])

                if (actionItemsResponse.success && actionItemsResponse.data) {
                    setActionItems(actionItemsResponse.data)
                }

                if (overviewResponse.success && overviewResponse.data) {
                    setOverview(overviewResponse.data)
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    const getDaysUntilExpiry = (date) => {
        const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
        return days
    }

    return (
        <div className="mb-5 dashboard-container space-y-8">
            <div className="space-y-6">
                <div className="mb-6 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h2 className="!text-lg uppercase">Action Required</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Pending Vendors */}
                    <Card className="py-0 border-0 gap-0">
                        <CardHeader className="!px-4 !py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 p-2 rounded-lg">
                                        <Building2 className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Vendors Pending Approval</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {actionItems.pendingVendorsCount} total vendor{actionItems.pendingVendorsCount !== 1 ? 's' : ''} waiting
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/vendor-management?status=pending">
                                    <Button variant="ghost" size="sm" className="gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                        View All
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                                </div>
                            ) : actionItems.pendingVendors.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No pending vendors</p>
                                </div>
                            ) : (
                                <div>
                                    {actionItems.pendingVendors.map((vendor, index) => (
                                        <Link 
                                            key={vendor._id}
                                            href={`/admin/vendor-management/${vendor._id}`}
                                            className="flex items-start gap-3 p-4 hover:bg-amber-50 transition-colors group border-b border-b-gray-200 last:border-b-0"
                                        >
                                            {/* Business Logo */}
                                            <div className="flex-shrink-0">
                                                <Avatar className="h-14 w-14 rounded-lg overflow-hidden border border-gray-200">
                                                    <AvatarImage src={vendor.businessLogo} alt={vendor.businessName} className="object-cover size-full" />
                                                    <AvatarFallback className="bg-amber-100 text-amber-600 font-semibold rounded-full overflow-hidden">
                                                        {getInitials(vendor.businessName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            
                                            {/* Vendor Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold !text-sm text-gray-900 truncate group-hover:text-amber-600">
                                                    {vendor.businessName}
                                                </p>
                                                <p className="font-semibold !text-xs text-gray-900 truncate group-hover:text-amber-600">
                                                    {vendor.referenceId}
                                                </p>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-gray-400" />
                                                        <p className="!text-xs text-gray-500 truncate">{vendor?.email}</p>
                                                    </div>
                                                    {vendor?.phoneNumber && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            <p className="!text-xs text-gray-500">{vendor?.phoneNumber}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {vendor.location?.city && (
                                                            <span className="text-xs text-gray-400">{vendor.city}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Time Badge */}
                                            <Badge variant="outline" className="!text-xs whitespace-nowrap border-gray-300">
                                                {formatTimeAgo(vendor.createdAt)}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Flagged Reviews */}
                    <Card className="py-0 border-0 gap-0">
                        <CardHeader className="!px-4 !py-4 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <Flag className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Reviews Flagged</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {actionItems.flaggedReviewsCount} total review{actionItems.flaggedReviewsCount !== 1 ? 's' : ''} flagged
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/review-management?flagged=true">
                                    <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        View All
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                            ) : actionItems.flaggedReviews.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Flag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No flagged reviews</p>
                                </div>
                            ) : (
                                <div>
                                    {actionItems.flaggedReviews.map((review, index) => (
                                        <div 
                                            key={review._id}
                                            className="p-4 hover:bg-red-50 transition-colors border-b border-gray-300 last:border-b-0"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="!text-xs text-gray-500">by {review.user?.username}</span>
                                                </div>
                                                <Badge variant="outline" className="!text-xs border-gray-200 whitespace-nowrap">
                                                    {formatTimeAgo(review.createdAt)}
                                                </Badge>
                                            </div>
                                            <p className="!text-sm font-medium text-gray-900 mb-1">{review.vendor?.businessName}</p>
                                            <p className="!text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expiring Subscriptions */}
                    <Card className="py-0 border-0 gap-0">
                        <CardHeader className="!px-4 !py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Expiring Soon</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {actionItems.expiringSoonSubscriptionsCount} total subscription{actionItems.expiringSoonSubscriptionsCount !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/vendor-management?expiry=expiring-soon">
                                    <Button variant="ghost" size="sm" className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                        View All
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                </div>
                            ) : actionItems.expiringSoonSubscriptions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No expiring subscriptions</p>
                                </div>
                            ) : (
                                <div>
                                    {actionItems.expiringSoonSubscriptions.map((vendor, index) => {
                                        const daysLeft = getDaysUntilExpiry(vendor.subscriptionEndDate)
                                        return (
                                                                                    <Link 
                                            key={vendor._id}
                                            href={`/admin/vendor-management/${vendor._id}`}
                                            className="flex items-start gap-3 p-4 hover:bg-amber-50 transition-colors group border-b border-b-gray-200 last:border-b-0"
                                        >
                                            {/* Business Logo */}
                                            <div className="flex-shrink-0">
                                                <Avatar className="h-14 w-14 rounded-lg overflow-hidden border border-gray-200">
                                                    <AvatarImage src={vendor.businessLogo} alt={vendor.businessName} className="object-cover size-full" />
                                                    <AvatarFallback className="bg-amber-100 text-amber-600 font-semibold rounded-full overflow-hidden">
                                                        {getInitials(vendor.businessName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            
                                            {/* Vendor Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold !text-sm text-gray-900 truncate group-hover:text-amber-600">
                                                    {vendor.businessName}
                                                </p>
                                                <p className="font-semibold !text-xs text-gray-900 truncate group-hover:text-amber-600">
                                                    {vendor.referenceId}
                                                </p>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-gray-400" />
                                                        <p className="!text-xs text-gray-500 truncate">{vendor?.email}</p>
                                                    </div>
                                                    {vendor?.phoneNumber && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            <p className="!text-xs text-gray-500">{vendor?.phoneNumber}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {vendor.location?.city && (
                                                            <span className="text-xs text-gray-400">{vendor.city}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Time Badge */}
                                            <Badge variant="destructive" className="!text-xs whitespace-nowrap border-gray-300">
                                                {daysLeft}d left
                                            </Badge>
                                        </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Open Tickets */}
                    <Card className="py-0 border-0 gap-0">
                        <CardHeader className="!px-4 !py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <MessageSquare className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Open Tickets</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {actionItems.openTicketsCount} total ticket{actionItems.openTicketsCount !== 1 ? 's' : ''} open
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/support-tickets?status=open">
                                    <Button variant="ghost" size="sm" className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                        View All
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                </div>
                            ) : actionItems.openTickets.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No open tickets</p>
                                </div>
                            ) : (
                                <div>
                                    {actionItems.openTickets.map((ticket, index) => (
                                        <div 
                                            key={ticket._id}
                                            className="flex items-start justify-between p-4 hover:bg-purple-50 transition-colors group border-b border-gray-300 last:border-b-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge 
                                                        variant={ticket.priority === 'high' || ticket.priority === 'critical' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'} 
                                                        className="text-xs capitalize"
                                                    >
                                                        {ticket.priority}
                                                    </Badge>
                                                    <Badge variant="outline" className="!text-xs capitalize">
                                                        {ticket.category}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-sm text-gray-900 truncate group-hover:text-purple-600 mb-1">{ticket.subject}</p>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <p className="!text-xs text-gray-500 truncate">{ticket.contactEmail}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs whitespace-nowrap ml-3">
                                                {formatTimeAgo(ticket.createdAt)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* New Referrals */}
                    <Card className="py-0 border-0 gap-0 md:col-span-2">
                        <CardHeader className="!px-4 !py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">New Referrals</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {actionItems.newReferralsCount} total pending referral{actionItems.newReferralsCount !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/referrals-management">
                                    <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        View All
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : actionItems.newReferrals.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No pending referrals</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {actionItems.newReferrals.map((referral) => (
                                        <div 
                                            key={referral._id}
                                            className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-start justify-between">
                                                    <p className="font-semibold !text-sm text-gray-900">{referral.referrerFullname}</p>
                                                    <Badge variant="outline" className="text-xs ml-2">
                                                        {formatTimeAgo(referral.createdAt)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                    <p className="!text-xs text-gray-500 truncate">{referral.referrerEmail}</p>
                                                </div>
                                                <Separator className="bg-gray-400" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-600 mb-1">Vendors ({referral.vendors?.length || 0}):</p>
                                                    {referral.vendors?.slice(0, 2).map((vendor, idx) => (
                                                        <p key={idx} className="text-xs text-gray-500 truncate">• {vendor.fullname}</p>
                                                    ))}
                                                    {referral.vendors?.length > 2 && (
                                                        <p className="text-xs text-blue-600 mt-0.5">+ {referral.vendors.length - 2} more</p>
                                                    )}
                                                </div>
                                                <div className="pt-2 border-t border-gray-400">
                                                    <p className="text-xs font-mono text-gray-500">{referral.referralCode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Platform Analytics */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="!text-xl uppercase">Platform Analytics</h2>
                        <p className="!text-sm text-gray-500">Monitor user activity and vendor performance</p>
                    </div>
                    <Link href="/admin/analytics-insights/platform-analytics">
                        <Button variant="outline" className="gap-2">
                            View More
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UserGrowthChart />
                    <VendorDistributionChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <BundlePerformanceChart />
                    <EngagementMetricsChart />
                </div>
            </div>

            {/* Lead & Inquiry Insights */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="!text-xl uppercase">Lead & Inquiry Insights</h2>
                        <p className="!text-sm text-gray-500">Track customer engagement and inquiries</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <LeadMetricsChart />
                </div>
            </div>

        </div>
    )
}

export default AdminDashboard
