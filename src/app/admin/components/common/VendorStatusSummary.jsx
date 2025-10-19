"use client"
import React from 'react';
import { Users, CheckCircle, Clock, FileWarning, ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const description = "Vendor Status Breakdown KPI List"

// --- Sample Data ---
const vendorStatusData = {
    total: 1245,
    active: 987,
    pendingReview: 153,
    inactiveDocs: 105,
};

// --- Helper Data Structure for Display (Breakdown only) ---
const breakdownItems = [
    {
        key: 'active',
        label: 'Active Listings',
        count: vendorStatusData.active,
        icon: CheckCircle,
        color: 'text-green-600',
        link: '/admin/vendors?status=active',
        isPrimary: false,
    },
    {
        key: 'pendingReview',
        label: 'Pending Review',
        count: vendorStatusData.pendingReview,
        icon: Clock,
        color: 'text-yellow-600',
        link: '/admin/vendors?status=pending',
        isPrimary: false,
    },
    {
        key: 'inactiveDocs',
        label: 'Docs Pending Updation',
        count: vendorStatusData.inactiveDocs,
        icon: FileWarning,
        color: 'text-orange-600',
        link: '/admin/vendors?status=inactive_docs',
        isPrimary: false,
    },
];

// --- Single Status Item Component ---
const StatusListItem = ({ label, count, icon: Icon, color, link, isPrimary }) => {
    // Conditional styling to highlight the 'Total' row
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
                {/* Use a slightly darker color for the total icon */}
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


// --- Main Card List Component ---
function VendorStatusSummary({ totalVendors = vendorStatusData.total, breakdown = breakdownItems }) {
    
    // 1. Define the Total Vendors item
    const totalItem = {
        key: 'total',
        label: 'Total Registered Vendors',
        count: totalVendors,
        icon: Users,
        color: 'text-indigo-600',
        link: '/admin/vendors',
        isPrimary: true,
    };

    // 2. Combine total and breakdown items for the full list
    const allStatusItems = [totalItem, ...breakdown];

    return (
        <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md py-2">
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

            {/* Total count is now the first item in the CardContent list */}
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
            
            <div className="p-4 border-t border-gray-100 text-center">
                <a 
                    href="/admin/vendors" 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center"
                >
                    Manage All Vendors
                    <ArrowRight className="w-4 h-4 ml-2" />
                </a>
            </div>
        </Card>
    );
}

export default VendorStatusSummary;
