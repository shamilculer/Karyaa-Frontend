"use client"
import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, XCircle, CalendarX, ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getVendorStatusSummary } from "@/app/actions/admin/vendorAnalytics";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const description = "Vendor Status Breakdown KPI List"

const StatusListItem = ({ label, count, icon: Icon, color, link, isPrimary }) => {
    const rowClass = isPrimary
        ? 'bg-indigo-50/50 hover:bg-indigo-100/70 border-b border-indigo-200 font-semibold'
        : 'hover:bg-gray-50';

    const countClass = isPrimary ? 'text-xl text-indigo-700' : 'text-lg text-gray-900';

    return (
        <a
            href={link}
            className={`flex items-center justify-between p-3 transition-colors cursor-pointer rounded-lg ${rowClass}`}
        >
            <div className="flex items-center space-x-4 min-w-0">
                <Icon className={`w-5 h-5 ${isPrimary ? 'text-indigo-700' : color} flex-shrink-0`} />
                <div className="min-w-0">
                    <p className={`text-sm ${isPrimary ? 'text-indigo-800' : 'text-gray-700'} truncate`}>
                        {label}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
                <span className={`font-bold ${countClass}`}>
                    {count.toLocaleString()}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
        </a>
    );
};

function VendorStatusSummary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getVendorStatusSummary();

                if (response.success && response.data) {
                    setData(response.data);
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

    if (loading) {
        return (
            <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md py-2">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md py-2">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-red-500">Error: {error}</p>
                </CardContent>
            </Card>
        );
    }

    const breakdownItems = [
        {
            key: 'active',
            label: 'Active Vendors',
            count: data?.active || 0,
            icon: CheckCircle,
            color: 'text-green-600',
            link: '/admin/vendor-management?status=approved',
            isPrimary: false,
        },
        {
            key: 'pending',
            label: 'Pending Review',
            count: data?.pending || 0,
            icon: Clock,
            color: 'text-yellow-600',
            link: '/admin/vendor-management?status=pending',
            isPrimary: false,
        },
        {
            key: 'expired',
            label: 'Expired Vendors',
            count: data?.expired || 0,
            icon: CalendarX,
            color: 'text-orange-600',
            link: '/admin/vendor-management?status=expired',
            isPrimary: false,
        },
        {
            key: 'rejected',
            label: 'Rejected Vendors',
            count: data?.rejected || 0,
            icon: XCircle,
            color: 'text-red-600',
            link: '/admin/vendor-management?status=rejected',
            isPrimary: false,
        },
    ];

    const totalItem = {
        key: 'total',
        label: 'Total Registered Vendors',
        count: data?.total || 0,
        icon: Users,
        color: 'text-indigo-600',
        link: '/admin/vendors',
        isPrimary: true,
    };

    const allStatusItems = [totalItem, ...breakdownItems];

    return (
        <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md py-0 gap-0">
            <CardHeader className="border-b border-gray-100 p-6 pb-4">
                <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <div>
                        <CardTitle className="uppercase text-indigo-600 font-medium tracking-widest text-base">
                            Vendor Status Breakdown
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Current operational status of your platform's vendor base.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1">
                {allStatusItems.length > 0 ? (
                    allStatusItems.map((item) => (
                        <StatusListItem
                            key={item.key}
                            label={item.label}
                            count={item.count}
                            icon={item.icon}
                            color={item.color}
                            link={item.link}
                            isPrimary={item.isPrimary}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Vendor data initialization pending.
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button asChild variant="outline" size="lg">
                    <Link href="/admin/vendor-management">
                        Manage All Vendors
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default VendorStatusSummary;
