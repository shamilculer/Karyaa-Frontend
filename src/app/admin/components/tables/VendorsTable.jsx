"use client"

import * as React from "react"
import { useState, useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    EllipsisVertical,
    Search,
    ChevronDown,
    Mail,
    User,
    Star,
    Tag,
} from "lucide-react"

export const description = "Vendors Management Table with HoverCard and Avatars"

// --- Helper function to get initials from a name
const getInitials = (name) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

// --- Vendor Sample Data with contact image URLs
const sampleData = [
    {
        id: 101,
        vendorName: "Sparkle Decor Solutions",
        contactPerson: "Ahmed Rashed",
        contactImageUrl: "https://placehold.co/100x100/A088FF/FFFFFF?text=AR",
        serviceType: "Decor & Floral",
        email: "contact@sparkle.com",
        city: "Dubai",
        status: "Active",
        rating: 4.8,
    },
    {
        id: 102,
        vendorName: "Gourmet Catering Co.",
        contactPerson: "Layla Mansour",
        contactImageUrl: "https://placehold.co/100x100/FF88A0/FFFFFF?text=LM",
        serviceType: "Catering",
        email: "info@gourmet.net",
        city: "Abu Dhabi",
        status: "Pending Docs",
        rating: 4.5,
    },
    {
        id: 103,
        vendorName: "Aura Photography",
        contactPerson: "Omar Khaled",
        contactImageUrl: "https://placehold.co/100x100/88A0FF/FFFFFF?text=OK",
        serviceType: "Photography/Video",
        email: "omar@aura.ae",
        city: "Sharjah",
        status: "Active",
        rating: 5.0,
    },
    {
        id: 104,
        vendorName: "SoundWave Entertainment",
        contactPerson: "Hassan Farouq",
        contactImageUrl: "https://placehold.co/100x100/A0FF88/FFFFFF?text=HF",
        serviceType: "DJ & Music",
        email: "hassan@soundwave.com",
        city: "Dubai",
        status: "On Hold",
        rating: 4.2,
    },
    {
        id: 105,
        vendorName: "Venue Finders UAE",
        contactPerson: "Fatima Noor",
        contactImageUrl: "https://placehold.co/100x100/FF88C0/FFFFFF?text=FN",
        serviceType: "Venue Rental",
        email: "fatima@venues.ae",
        city: "Ajman",
        status: "Active",
        rating: 4.9,
    },
    {
        id: 106,
        vendorName: "Event Transport Services",
        contactPerson: "Youssef Ali",
        contactImageUrl: "https://placehold.co/100x100/C0FF88/FFFFFF?text=YA",
        serviceType: "Logistics",
        email: "youssef@ets.com",
        city: "Ras Al Khaimah",
        status: "Pending Docs",
        rating: 4.0,
    },
    {
        id: 107,
        vendorName: "Lux Linen Rentals",
        contactPerson: "Amira Said",
        contactImageUrl: "https://placehold.co/100x100/88C0FF/FFFFFF?text=AS",
        serviceType: "Rentals",
        email: "amira@luxlinen.net",
        city: "Dubai",
        status: "Active",
        rating: 4.7,
    },
    // --- New Vendor Data Added Below ---
    {
        id: 108,
        vendorName: "Magic Illusionists",
        contactPerson: "Khalid Al Marzooqi",
        contactImageUrl: "https://placehold.co/100x100/FFD9A0/FFFFFF?text=KM",
        serviceType: "Entertainment",
        email: "khalid@magic.com",
        city: "Sharjah",
        status: "Active",
        rating: 4.9,
    },
    {
        id: 109,
        vendorName: "Floral Artistry Studio",
        contactPerson: "Noora Hassan",
        contactImageUrl: "https://placehold.co/100x100/D9A0FF/FFFFFF?text=NH",
        serviceType: "Decor & Floral",
        email: "noora@floralart.ae",
        city: "Dubai",
        status: "Active",
        rating: 4.6,
    },
    {
        id: 110,
        vendorName: "Platinum Security",
        contactPerson: "Majid Obaid",
        contactImageUrl: "https://placehold.co/100x100/A0FFD9/FFFFFF?text=MO",
        serviceType: "Security",
        email: "majid@platinumsec.net",
        city: "Abu Dhabi",
        status: "Pending Docs",
        rating: 4.1,
    },
    {
        id: 111,
        vendorName: "Digital Impressions",
        contactPerson: "Sara Yaqoob",
        contactImageUrl: "https://placehold.co/100x100/FFC0A0/FFFFFF?text=SY",
        serviceType: "Photography/Video",
        email: "sara@digitalimp.com",
        city: "Al Ain",
        status: "Active",
        rating: 5.0,
    },
    {
        id: 112,
        vendorName: "The Cake Boutique",
        contactPerson: "Huda Salim",
        contactImageUrl: "https://placehold.co/100x100/C0A0FF/FFFFFF?text=HS",
        serviceType: "Catering",
        email: "huda@cakeboutique.ae",
        city: "Dubai",
        status: "On Hold",
        rating: 4.7,
    },
    {
        id: 113,
        vendorName: "Lighting Dynamics",
        contactPerson: "Fahad Jaber",
        contactImageUrl: "https://placehold.co/100x100/A0FFC0/FFFFFF?text=FJ",
        serviceType: "Production",
        email: "fahad@lightdyn.net",
        city: "Sharjah",
        status: "Active",
        rating: 4.4,
    },
    {
        id: 114,
        vendorName: "Premium Staffing Solutions",
        contactPerson: "Zainab Ali",
        contactImageUrl: "https://placehold.co/100x100/FFD0A0/FFFFFF?text=ZA",
        serviceType: "Staffing",
        email: "zainab@premiumstaff.com",
        city: "Dubai",
        status: "Active",
        rating: 4.6,
    },
    {
        id: 115,
        vendorName: "Sound and Stage Pro",
        contactPerson: "Jamal Mansour",
        contactImageUrl: "https://placehold.co/100x100/D0A0FF/FFFFFF?text=JM",
        serviceType: "Production",
        email: "jamal@ssp.ae",
        city: "Abu Dhabi",
        status: "Active",
        rating: 4.8,
    },
    {
        id: 116,
        vendorName: "Coastal Venues Group",
        contactPerson: "Amal Saleh",
        contactImageUrl: "https://placehold.co/100x100/A0FFD0/FFFFFF?text=AS",
        serviceType: "Venue Rental",
        email: "amal@coastalvenues.net",
        city: "Fujairah",
        status: "Pending Docs",
        rating: 4.5,
    },
    {
        id: 117,
        vendorName: "Executive Transport",
        contactPerson: "Bader Naji",
        contactImageUrl: "https://placehold.co/100x100/FFD9A0/FFFFFF?text=BN",
        serviceType: "Logistics",
        email: "bader@exec-trans.com",
        city: "Dubai",
        status: "On Hold",
        rating: 4.0,
    },
];

// --- Helper component for HoverCard Content with Avatar
const VendorDetails = ({ vendor }) => (
    <div className="flex items-start space-x-4 p-1">
        <Avatar className="h-16 w-16">
            <AvatarImage src={vendor.contactImageUrl} alt={vendor.contactPerson} />
            <AvatarFallback>{getInitials(vendor.contactPerson)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <h4 className="font-bold text-lg">{vendor.vendorName}</h4>
            <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{vendor.contactPerson}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{vendor.serviceType}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-blue-600 hover:underline">{vendor.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-semibold">{vendor.rating} / 5.0</span>
            </div>
        </div>
    </div>
);

// --- Main Vendors Table Component
export default function VendorsTable({ controls = true }) {
    const [rowSelection, setRowSelection] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(15); // Reduced to 8 to better show pagination with 17 items
    const [globalFilter, setGlobalFilter] = useState('');

    // --- New Filter State ---
    const [filterServiceTypes, setFilterServiceTypes] = useState([]);
    const [filterCities, setFilterCities] = useState([]);
    const [filterStatuses, setFilterStatuses] = useState([]);

    // --- Helper to extract unique options for filters
    const uniqueServiceTypes = useMemo(() => Array.from(new Set(sampleData.map(d => d.serviceType))).sort(), []);
    const uniqueCities = useMemo(() => Array.from(new Set(sampleData.map(d => d.city))).sort(), []);
    const uniqueStatuses = useMemo(() => Array.from(new Set(sampleData.map(d => d.status))).sort(), []);

    const filteredData = useMemo(() => {
        let data = sampleData;

        // 1. Apply Global Search Filter
        if (globalFilter) {
            const lowerCaseFilter = globalFilter.toLowerCase();
            data = data.filter(row =>
                row.vendorName.toLowerCase().includes(lowerCaseFilter) ||
                row.contactPerson.toLowerCase().includes(lowerCaseFilter) ||
                row.serviceType.toLowerCase().includes(lowerCaseFilter) ||
                row.city.toLowerCase().includes(lowerCaseFilter)
            );
        }

        // 2. Apply Service Type Filter
        if (filterServiceTypes.length > 0) {
            data = data.filter(row => filterServiceTypes.includes(row.serviceType));
        }

        // 3. Apply City Filter
        if (filterCities.length > 0) {
            data = data.filter(row => filterCities.includes(row.city));
        }

        // 4. Apply Status Filter
        if (filterStatuses.length > 0) {
            data = data.filter(row => filterStatuses.includes(row.status));
        }

        // Reset page index on filter change to prevent empty page
        setPageIndex(0);

        return data;
    }, [globalFilter, filterServiceTypes, filterCities, filterStatuses]);


    // --- Pagination Logic (remains the same) ---
    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, pageIndex, pageSize]);

    const pageCount = Math.ceil(filteredData.length / pageSize);

    const toggleAllRowsSelected = (checked) => {
        const newSelection = checked ? Object.fromEntries(paginatedData.map((row, index) => [row.id, true])) : {};
        setRowSelection(newSelection);
    };

    const toggleRowSelected = (id) => {
        setRowSelection(prev => {
            const newSelection = { ...prev };
            if (newSelection[id]) {
                delete newSelection[id];
            } else {
                newSelection[id] = true;
            }
            return newSelection;
        });
    };

    const isRowSelected = (id) => !!rowSelection[id];

    const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => isRowSelected(row.id));
    const isSomeSelected = paginatedData.some(row => isRowSelected(row.id)) && !isAllSelected;

    const selectedRowCount = Object.keys(rowSelection).length;

    const headers = [
        "No.",
        "Vendor Name",
        "Service Type",
        "Contact Person",
        "City",
        "Rating",
        "Status",
        "Actions"
    ];

    // --- Filter Handlers ---

    const handleServiceTypeChange = (type) => {
        setFilterServiceTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleCityChange = (city) => {
        setFilterCities(prev =>
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        );
    };

    const handleStatusChange = (status) => {
        setFilterStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };


    return (
        <div className="w-full">
            {controls && (
                <div className="flex justify-between items-center gap-4 py-4">

                    {/* Right: Search Input */}
                    <div className="relative w-2/5 max-w-sm">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4" />
                        <Input
                            placeholder="Search all columns..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="w-full bg-white border-gray-300 h-11 pl-10"
                        />
                    </div>

                    {/* Left: Bulk Actions and Filters */}
                    <div className="flex items-center gap-2">
                        {selectedRowCount > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2 !bg-[#F2F4FF] text-primary">
                                        <span>Bulk Actions ({selectedRowCount})</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white">
                                    <DropdownMenuItem onClick={() => { }}>Change Status to Active</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { }}>Request Documents</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { }} className="text-red-600">
                                        Remove from List
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Service Type Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 !bg-[#F2F4FF] text-primary">
                                    Service Type {filterServiceTypes.length > 0 && `(${filterServiceTypes.length})`}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-56 max-h-80 overflow-y-auto">
                                <DropdownMenuLabel>Filter by Service Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueServiceTypes.map(type => (
                                    <DropdownMenuCheckboxItem
                                        key={type}
                                        checked={filterServiceTypes.includes(type)}
                                        onCheckedChange={() => handleServiceTypeChange(type)}
                                    >
                                        {type}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterServiceTypes([])} className="text-blue-600 font-medium">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* City Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 !bg-[#F2F4FF] text-primary">
                                    City {filterCities.length > 0 && `(${filterCities.length})`}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-56">
                                <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueCities.map(city => (
                                    <DropdownMenuCheckboxItem
                                        key={city}
                                        checked={filterCities.includes(city)}
                                        onCheckedChange={() => handleCityChange(city)}
                                    >
                                        {city}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterCities([])} className="text-blue-600 font-medium">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2 bg-[#F2F4FF] text-primary">
                                    Status {filterStatuses.length > 0 && `(${filterStatuses.length})`}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {uniqueStatuses.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterStatuses.includes(status)}
                                        onCheckedChange={() => handleStatusChange(status)}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterStatuses([])} className="text-blue-600 font-medium">
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            )}
            <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden rounded-lg">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 z-10">
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableHead key={index} className="font-medium text-[#727272] h-12">
                                        {controls && index === 0 ? (
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    indeterminate={isSomeSelected ? "indeterminate" : undefined}
                                                    onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                                    aria-label="Select all"
                                                />
                                                <span className="ml-2 font-medium text-[#727272]">No.</span>
                                            </div>
                                        ) : (
                                            header
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((row) => {
                                const originalIndex = sampleData.findIndex(d => d.id === row.id);
                                return (
                                    <TableRow key={row.id} className="bg-white hover:bg-gray-50">
                                        {controls && (
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Checkbox
                                                        checked={isRowSelected(row.id)}
                                                        onCheckedChange={() => toggleRowSelected(row.id)}
                                                        aria-label="Select row"
                                                    />
                                                    <span className="text-sm text-gray-700">{originalIndex + 1}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <div className="flex items-center gap-2 cursor-pointer">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={row.contactImageUrl} alt={row.contactPerson} />
                                                            <AvatarFallback>{getInitials(row.contactPerson)}</AvatarFallback>
                                                        </Avatar>
                                                        <a
                                                            href={`/vendors/${row.id}`}
                                                            className="hover:underline hover:text-blue-600 font-medium"
                                                        >
                                                            {row.vendorName}
                                                        </a>
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80 bg-white shadow-lg border p-3">
                                                    <VendorDetails vendor={row} />
                                                </HoverCardContent>
                                            </HoverCard>
                                        </TableCell>
                                        <TableCell>{row.serviceType}</TableCell>
                                        <TableCell>{row.contactPerson}</TableCell>
                                        <TableCell>{row.city}</TableCell>
                                        <TableCell>{row.rating}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`inline-flex items-center border-0 gap-1.5 rounded-full px-2 !py-1 text-xs font-medium leading-0 ${row.status === "Active" ? "bg-green-100 text-green-800" : row.status === "Pending Docs" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="size-2 fill-current"><circle cx="12" cy="12" r="10"></circle></svg>
                                                <span className="mt-1">{row.status}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="data-[state=open]:bg-muted flex size-8 border border-gray-300 !outline-0"
                                                        size="icon"
                                                    >
                                                        <EllipsisVertical className="w-5 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 bg-white">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                    <DropdownMenuItem>View Contracts</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem variant="destructive" className="text-red-600">
                                                        Deactivate Vendor
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!paginatedData.length && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="h-24 text-center text-gray-500">
                                        No vendors found matching your current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {controls && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedRowCount} of{" "}
                        {filteredData.length} row(s) visible. Total: {sampleData.length}.
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground mr-4">
                            Page {pageIndex + 1} of {pageCount}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                            disabled={pageIndex === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPageIndex(prev => prev + 1)}
                            disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
