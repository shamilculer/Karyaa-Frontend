"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, Mail } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTopPerformingVendors } from "@/app/actions/admin/vendorAnalytics";
import Link from 'next/link';

export const description = "Top Performing Vendors List (Inquiries and Views)"

const PerformanceListItem = ({ vendor, maxInquiries }) => {

    return (
        <Link  href={`/admin/vendor-management/${vendor._id}`} className="block">
            <li className="flex flex-col gap-2 p-4 hover:bg-green-50/50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0">

                <div className="flex justify-between items-center w-full">

                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-12 rounded-full overflow-hidden flex-shrink-0">
                            <AvatarImage className="size-full object-cover" src={vendor.businessLogo} />
                            <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-sm">
                                {vendor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="!text-sm font-medium text-gray-900 truncate">
                                {vendor.name}
                            </p>
                            <p className="!text-xs text-gray-500 truncate">
                                {vendor.category}
                            </p>
                        </div>
                    </div>

                    <div className="text-right flex items-center gap-1">
                        <Mail className="size-4 text-green-600" />
                        <span className="text-lg font-bold text-green-700">
                            {vendor.inquiries}
                        </span>
                    </div>
                </div>
            </li>
        </Link>
    );
};

export const TopPerformingVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getTopPerformingVendors("1M", 5);

                if (response.success && response.data) {
                    setVendors(response.data);
                } else {
                    setError(response.message || "Failed to fetch data");
                }
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const maxInquiries = vendors.length > 0 ? vendors[0].inquiries : 1;

    if (loading) {
        return (
            <Card className="w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-0 gap-0">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-0 gap-0">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-red-500">Error: {error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-0 gap-0">
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
                    {vendors.length > 0 ? (
                        vendors.map((vendor) => (
                            <PerformanceListItem
                                key={vendor._id}
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
