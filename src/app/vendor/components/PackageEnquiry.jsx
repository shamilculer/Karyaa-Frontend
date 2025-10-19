"use client"
import React from 'react';
import { Package, User, Clock, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const description = "Enquiries Received by Package (List in Card)"

// --- Sample Data ---
const sampleEnquiries = [
    {
        id: 101,
        clientName: "Ayman Malik",
        packageName: "Premium Wedding Package",
        budget: "AED 35,000",
        enquiryDate: "Oct 1, 2025",
        location: "Dubai",
        status: "New",
    },
    {
        id: 102,
        clientName: "Sana Khan",
        packageName: "Corporate Gala Package",
        budget: "AED 50,000",
        enquiryDate: "Sep 28, 2025",
        location: "Abu Dhabi",
        status: "Contacted",
    },
    {
        id: 103,
        clientName: "Basic Birthday Package",
        packageName: "Basic Birthday Package",
        budget: "AED 8,000",
        enquiryDate: "Sep 25, 2025",
        location: "Sharjah",
        status: "New",
    },
    {
        id: 104,
        clientName: "Fatima Al-Mansoori",
        packageName: "Premium Wedding Package",
        budget: "AED 40,000",
        enquiryDate: "Sep 20, 2025",
        location: "Ajman",
        status: "Closed",
    },
    {
        id: 105,
        clientName: "David Lee",
        packageName: "Basic Birthday Package",
        budget: "AED 9,500",
        enquiryDate: "Sep 18, 2025",
        location: "Dubai",
        status: "Contacted",
    },
];

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    let colorClass = '';
    switch (status) {
        case 'New':
            colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            break;
        case 'Contacted':
            colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            break;
        case 'Closed':
            colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            break;
        case 'Lost':
            colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

// --- Single List Item Component ---
const EnquiryListItem = ({ enquiry }) => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4 min-w-0">
                <Package className="w-5 h-5 text-indigo-500 flex-shrink-0 hidden sm:block" />
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {enquiry.packageName}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-3">
                        <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[100px] sm:max-w-none">{enquiry.clientName}</span>
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {enquiry.enquiryDate}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
                <StatusBadge status={enquiry.status} />
                <a href={`/enquiries/${enquiry.id}`} aria-label={`View details for ${enquiry.clientName}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};


// --- Main Card List Component ---
function PackageEnquiry({ enquiries = sampleEnquiries }) {
    // 1. Group data by packageName
    const enquiriesByPackage = enquiries.reduce((acc, enquiry) => {
        const key = enquiry.packageName;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(enquiry);
        return acc;
    }, {});

    const packageNames = Object.keys(enquiriesByPackage);

    return (
        <Card className="w-full h-full bg-white border border-gray-200 shadow-none rounded-md">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="uppercase text-sidebar-foreground font-normal tracking-widest text-base">
                    Recent Enquiries by Package
                </CardTitle>
                <CardDescription className="text-xs">
                    Last {enquiries.length} enquiries received across all packages.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {enquiries.length > 0 ? (
                        enquiries.map((enquiry) => (
                            <EnquiryListItem key={enquiry.id} enquiry={enquiry} />
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No recent enquiries found.
                        </div>
                    )}
                </div>
            </CardContent>
            {/* You could add a CardFooter here for a "View All Enquiries" link */}
            {enquiries.length > 0 && (
                <div className="p-4 border-t border-gray-100 text-center">
                    <a 
                        href="/enquiries" 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center"
                    >
                        View All Enquiries
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>
            )}
        </Card>
    );
}

export default PackageEnquiry;