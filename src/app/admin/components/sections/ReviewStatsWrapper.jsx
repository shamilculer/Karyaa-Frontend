"use client"
import * as React from "react"
import { Clock, Flag, LayoutList, Star, ChevronUp, ChevronDown, Building2, Phone, Mail } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" 
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card" 
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

// --- Extended Sample Vendor Data with Contact Info ---
const sampleVendors = [
    { id: 1, name: "Sparkle Decor Solutions", category: "Decor & Floral", rating: 4.9, count: 120, contact: "Ahmed H.", phone: "+971501234567", email: "info@sparkle.ae" },
    { id: 2, name: "Gourmet Catering Co.", category: "Catering", rating: 4.8, count: 95, contact: "Fahad Y.", phone: "+971559876543", email: "support@gourmet.com" },
    { id: 3, name: "Elite Photography Studio", category: "Photography", rating: 4.7, count: 150, contact: "Sara K.", phone: "+971561122334", email: "sara@elitephoto.com" },
    { id: 4, name: "Budget Bounce House", category: "Rentals", rating: 2.1, count: 35, contact: "Ali R.", phone: "+971508765432", email: "ali@budget.ae" },
    { id: 5, name: "Slow Service Solutions", category: "Logistics", rating: 1.8, count: 12, contact: "Omar N.", phone: "+971551231231", email: "omar@slow.com" },
    { id: 6, name: "Outdated Designs Inc.", category: "Decor & Floral", rating: 1.5, count: 60, contact: "Layla Z.", phone: "+971509988776", email: "layla@outdated.net" },
];

// --- Vendor HoverCard Content Component ---
const VendorDetailsHoverCard = ({ vendor }) => {
    return (
        <HoverCardContent className="w-80 p-4 border bg-white border-gray-200 shadow-lg">
            <Link href="#" className="flex items-center space-x-3 mb-3 border-b border-gray-200 pb-3">
                <Avatar className="size-10">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="text-sm !font-medium text-gray-900">{vendor.name}</h4>
                    <p className="!text-xs text-gray-500">{vendor.category}</p>
                </div>
            </Link>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Contact Person:</span> {vendor.contact}
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Phone:</span> {vendor.phone}
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Email:</span> {vendor.email}
                </div>
            </div>
        </HoverCardContent>
    )
}

// --- Top Rated Vendors Component (Updated) ---
export const TopRatedVendors = () => {
    const topVendors = sampleVendors
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
            <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                <CardTitle className="uppercase font-normal tracking-widest text-base text-green-700">
                    Top Rated Vendors
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 px-3">
                <ul className="divide-y divide-gray-100">
                    {topVendors.map((vendor) => (
                        <HoverCard key={vendor.id} openDelay={200}>
                            <HoverCardTrigger asChild>
                                <li className="flex justify-between items-center p-3 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    {/* Icon and Vendor Name/Category on the left */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-green-100 text-green-600 font-semibold">{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                                        <span className="text-sm font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500">({vendor.count})</span>
                                    </div>
                                </li>
                            </HoverCardTrigger>
                            <VendorDetailsHoverCard vendor={vendor} />
                        </HoverCard>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

// --- Least Rated Vendors Component (Updated) ---
export const LeastRatedVendors = () => {
    const leastVendors = sampleVendors
        .sort((a, b) => a.rating - b.rating)
        .slice(0, 3)

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-none rounded-md gap-3 py-0">
            <CardHeader className="border-b border-gray-100 pt-4 !pb-2 px-4">
                <CardTitle className="uppercase font-normal tracking-widest text-base text-red-700">
                    Least Rated Vendors
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 px-3">
                <ul className="divide-y divide-gray-100">
                    {leastVendors.map((vendor) => (
                        <HoverCard key={vendor.id} openDelay={200}>
                            <HoverCardTrigger asChild>
                                <li className="flex justify-between items-center p-3 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    {/* Icon and Vendor Name/Category on the left */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-red-100 text-red-600 font-semibold">{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                                        <span className="text-sm font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500">({vendor.count})</span>
                                    </div>
                                </li>
                            </HoverCardTrigger>
                            <VendorDetailsHoverCard vendor={vendor} />
                        </HoverCard>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

// --- Overview Component (Stats List) ---
const Overview = () => {
    // Stat data defined here
    const reviewStats = [
        {
            icon: <LayoutList className="size-5 text-indigo-500" />,
            label: "Total Reviews",
            value: "1,245",
        },
        {
            icon: <Clock className="size-5 text-gray-500" />,
            label: "Reviews Pending Approval",
            value: "38",
        },
        {
            icon: <Flag className="size-5 text-red-500" />,
            label: "Removal Request",
            value: "5",
        },
    ]

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
    return (
        <div className="w-full grid grid-cols-3 gap-8">
                <Overview />

                <TopRatedVendors />

                <LeastRatedVendors />
        </div>
    )
}

export default ReviewStatsWrapper
