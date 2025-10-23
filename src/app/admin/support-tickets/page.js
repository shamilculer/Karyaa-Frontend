"use client"
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
import { getInitials } from "@/utils";


const TICKET_DATA = [
    { id: 1, name: "Amanda", status: "Active", issue: "Wedding Package", date: "7 July, 2025", avatarUrl: "https://placehold.co/50x50/F2F4FF/4B68FF?text=AM" },
    { id: 2, name: "Amanda", status: "Active", issue: "Catering", date: "7 July, 2025", avatarUrl: "https://placehold.co/50x50/F2F4FF/4B68FF?text=AM" },
    { id: 3, name: "Maria", status: "Pending", issue: "Photography", date: "6 July, 2025", avatarUrl: "https://placehold.co/50x50/FFF4F4/FF4B4B?text=MA" },
    { id: 4, name: "John", status: "Closed", issue: "Venue Booking", date: "5 July, 2025", avatarUrl: "https://placehold.co/50x50/F2F4FF/4B68FF?text=JO" },
    { id: 5, name: "David", status: "Active", issue: "Decorations", date: "4 July, 2025", avatarUrl: "https://placehold.co/50x50/F4FFF4/4BFF68?text=DA" },
    { id: 6, name: "Sophia", status: "Pending", issue: "Music and DJ", date: "3 July, 2025", avatarUrl: "https://placehold.co/50x50/F4FFF4/4BFF68?text=SO" },
    { id: 7, name: "Chris", status: "Closed", issue: "Event Planning", date: "2 July, 2025", avatarUrl: "https://placehold.co/50x50/FFF4F4/FF4B4B?text=CH" },
    { id: 8, name: "Olivia", status: "Active", issue: "Floral Arrangements", date: "1 July, 2025", avatarUrl: "https://placehold.co/50x50/F2F4FF/4B68FF?text=OL" },
];


const TicketTable = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const ticketsPerPage = 5;

    const totalPages = Math.ceil(TICKET_DATA.length / ticketsPerPage);
    const paginatedTickets = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ticketsPerPage;
        return TICKET_DATA.slice(startIndex, startIndex + ticketsPerPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300';
            case 'Closed': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
        }
    };

    return (
        <div className="bg-white rounded-lg p-10 border border-gray-200">
            <h3 className="text-xl font-bold pb-5 border-b border-b-gray-300">Tickets</h3>
            <div className="flex items-center justify-between py-6">
                <div className="flex items-center space-x-4 w-full max-w-lg">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search"
                            className="pl-9 pr-4 h-10 bg-white border-gray-300"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border border-gray-200 bg-[#F2F4FF] text-primary">
                                Category <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>All</DropdownMenuItem>
                            <DropdownMenuItem>Wedding</DropdownMenuItem>
                            <DropdownMenuItem>Catering</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            <div className="w-full">
                <div className="grid grid-cols-5 font-bold text-gray-500 py-3 border-b border-gray-200">
                    <div className="col-span-1 px-4">Name</div>
                    <div className="col-span-1 px-4">Status</div>
                    <div className="col-span-1 px-4">Issue</div>
                    <div className="col-span-1 px-4">Date</div>
                    <div className="col-span-1 px-4 text-right">Actions</div>
                </div>
                {paginatedTickets.map((ticket) => (
                    <div key={ticket.id} className="grid grid-cols-5 items-center py-4 border-b border-gray-100">
                        <div className="col-span-1 flex items-center space-x-4 px-4">
                            <Avatar className="size-12">
                                <AvatarImage src={ticket.avatarUrl} alt={ticket.name} />
                                <AvatarFallback>{getInitials(ticket.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-gray-900 !font-medium font-heading">{ticket.name}</span>
                        </div>
                        <div className="col-span-1 px-4">
                            <Badge className={`uppercase text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </Badge>
                        </div>
                        <div className="col-span-1 text-gray-700 px-4">{ticket.issue}</div>
                        <div className="col-span-1 text-gray-500 px-4">{ticket.date}</div>
                        <div className="col-span-1 px-4 flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full border border-gray-300">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Delete Ticket</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => handlePageChange(i + 1)}
                                    isActive={currentPage === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

const SupportTicketPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <TicketTable />
        </div>
    );
};

export default SupportTicketPage;
