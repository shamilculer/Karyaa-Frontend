"use client"
import React from 'react';
import { TrendingUp, Target, Mail, ArrowRight } from 'lucide-react';
// Correct shadcn/ui imports
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress component is available

export const description = "Top Performing Vendors List (Inquiries and Views)"

// --- Sample Performance Data ---
const sampleVendorPerformance = [
    { id: 1, name: "Luxury Event Planners LLC", category: "Full-Service Planning", views: 2450, inquiries: 92 },
    { id: 2, name: "Desert Bloom Florals", category: "Wedding Florist", views: 3100, inquiries: 155 },
    { id: 3, name: "Signature Catering Group", category: "Catering", views: 1890, inquiries: 88 },
    { id: 4, name: "A&Z Photography", category: "Photography & Video", views: 4200, inquiries: 180 },
    { id: 5, name: "The Venue at Marina Bay", category: "Event Venues", views: 3500, inquiries: 120 },
    { id: 6, name: "DJ Spin Masters", category: "Entertainment", views: 980, inquiries: 45 },
];

// --- Vendor List Item Component ---
const PerformanceListItem = ({ vendor, maxInquiries }) => {
    // Calculate the percentage of performance relative to the top vendor
    const inquiryPercentage = (vendor.inquiries / maxInquiries) * 100;
    
    // Calculate the Conversion Rate (Inquiries per 1000 views, or simple ratio)
    // Here, we use a simple ratio to show lead quality alongside volume
    const conversionRate = ((vendor.inquiries / vendor.views) * 100).toFixed(2);
    
    return (
        <a href={`/admin/vendors/${vendor.id}`} className="block">
            <li className="flex flex-col gap-2 p-4 hover:bg-green-50/50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0">
                
                {/* Top Row: Name, Category, and Total Inquiries */}
                <div className="flex justify-between items-center w-full">
                    
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar/Initial Badge */}
                        <Avatar className="size-10 flex-shrink-0">
                            <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-sm">
                                {vendor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Vendor Name and Category */}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {vendor.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {vendor.category}
                            </p>
                        </div>
                    </div>

                    {/* Performance KPI */}
                    <div className="text-right flex items-center gap-1">
                        <Mail className="size-4 text-green-600" />
                        <span className="text-lg font-bold text-green-700">
                            {vendor.inquiries}
                        </span>
                    </div>
                </div>

                {/* Bottom Row: Progress Bar and Metrics */}
                <div className="w-full flex items-center gap-3">
                    {/* Progress Bar (Visual Performance comparison) */}
                    <div className="flex-grow">
                        <Progress 
                            value={inquiryPercentage} 
                            className="h-2 bg-gray-200"
                            style={{ 
                                '& > div': { 
                                    backgroundColor: 'hsl(142.1 76.2% 36.3%)' // Tailwind green-600 equivalent 
                                } 
                            }}
                        />
                    </div>
                    
                    {/* Secondary Metrics */}
                    <div className="flex space-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Target className="size-3" />
                            {vendor.views.toLocaleString()} Views
                        </span>
                        <span className="flex items-center gap-1 font-medium text-indigo-600">
                            {conversionRate}% CR
                        </span>
                    </div>
                </div>
            </li>
        </a>
    );
};


// --- Main Component ---
export const TopPerformingVendors = () => {
    // 1. Sort vendors by Inquiry volume (highest first)
    const sortedVendors = sampleVendorPerformance
        .sort((a, b) => b.inquiries - a.inquiries)
        .slice(0, 5); // Show top 5

    // 2. Find the maximum inquiry count to scale the progress bar
    const maxInquiries = sortedVendors.length > 0 ? sortedVendors[0].inquiries : 1;

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b border-green-100 bg-green-50/50 pt-5 !pb-3 px-4">
                <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="size-6" />
                    <div>
                        <CardTitle className="uppercase font-bold tracking-wider text-base">
                            Top Performing Vendors
                        </CardTitle>
                        <CardDescription className="text-xs text-green-700/80 mt-1">
                            Ranked by total inquiries received (Last 30 Days).
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <ul className="divide-y divide-gray-100">
                    {sortedVendors.length > 0 ? (
                        sortedVendors.map((vendor) => (
                            <PerformanceListItem 
                                key={vendor.id} 
                                vendor={vendor} 
                                maxInquiries={maxInquiries} 
                            />
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No performance data available for ranking.
                        </div>
                    )}
                </ul>
            </CardContent>
            
        </Card>
    )
}

export default TopPerformingVendors;
