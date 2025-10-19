"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Added
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Added
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu" // Added
import { ArrowUpDown, Eye, X, Filter, MoreVertical } from "lucide-react" // Added Filter, MoreVertical

// --- Dummy Data ---
const subscribersData = [
    {
        id: "sub_001",
        subscriberName: "Emily Johnson",
        vendorName: "Elegance Events Decor",
        bundleName: "Platinum Featured",
        startDate: "2024-09-15",
        status: "Active",
    },
    {
        id: "sub_002",
        subscriberName: "David Lee",
        vendorName: "Lux Photo Studio",
        bundleName: "Standard Listing",
        startDate: "2024-08-01",
        status: "Expired",
    },
    {
        id: "sub_003",
        subscriberName: "Sarah Chen",
        vendorName: "Sonic DJs",
        bundleName: "Premium Featured",
        startDate: "2024-10-20",
        status: "Pending",
    },
    {
        id: "sub_004",
        subscriberName: "Michael Rodriguez",
        vendorName: "Gourmet Catering Co.",
        bundleName: "Standard Listing",
        startDate: "2024-11-05",
        status: "Active",
    },
];

// Helper function to map status to a Badge variant and custom class
const getStatusBadge = (status) => {
    switch (status) {
        case 'Active':
            return <Badge className="bg-green-500 hover:bg-green-600 text-white">{status}</Badge>;
        case 'Expired':
            return <Badge variant="destructive">{status}</Badge>;
        case 'Pending':
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">{status}</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

const Subscribers = () => {
    return (
        <div>
            {/* --- Search and Filter Controls --- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 space-y-4 sm:space-y-0">
                {/* Search Input */}
                <Input
                    placeholder="Search by name or ID..."
                    className="max-w-sm w-full sm:w-auto"
                />

                {/* Filters and Apply Button */}
                <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
                    {/* Status Filter */}
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bundle Filter */}
                    <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by Bundle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Bundles</SelectItem>
                            <SelectItem value="platinum">Platinum Featured</SelectItem>
                            <SelectItem value="premium">Premium Featured</SelectItem>
                            <SelectItem value="standard">Standard Listing</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                </div>
            </div>

            {/* --- Table --- */}
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>
                                <Button variant="ghost" className="p-0 h-auto">
                                    Subscriber Name <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Vendor Name</TableHead>
                            <TableHead>Bundle</TableHead>
                            <TableHead>Subscription Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribersData.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                                <TableCell className="font-mono text-xs text-gray-500">{subscriber.id}</TableCell>
                                <TableCell className="font-medium">{subscriber.subscriberName}</TableCell>
                                <TableCell>{subscriber.vendorName}</TableCell>
                                <TableCell>{subscriber.bundleName}</TableCell>
                                <TableCell>{subscriber.startDate}</TableCell>
                                <TableCell>
                                    {getStatusBadge(subscriber.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => console.log('Viewing details for:', subscriber.id)}
                                                className="cursor-pointer"
                                            >
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => console.log('Cancelling subscription for:', subscriber.id)}
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <X className="mr-2 h-4 w-4" /> Cancel Subscription
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default Subscribers