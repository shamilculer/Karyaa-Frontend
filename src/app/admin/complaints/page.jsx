"use client";

import { useEffect, useState } from "react";
import { getComplaintsAction } from "@/app/actions/public/complaint";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, RefreshCw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ComplaintDetailsModal from "../components/modals/complaints/ComplaintDetailsModal";

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        const res = await getComplaintsAction();
        if (res.success) {
            setComplaints(res.data);
        } else {
            toast.error(res.error || "Failed to fetch complaints");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "In Progress":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "Resolved":
                return "bg-green-100 text-green-800 hover:bg-green-100";
            case "Rejected":
                return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="dashboard-container space-y-5 mt-8 mb-14">
            <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest block">
                    Complaint Management
                </span>
                <Button variant="outline" size="sm" onClick={fetchComplaints} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>User Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                    <p className="mt-2">Loading complaints...</p>
                                </TableCell>
                            </TableRow>
                        ) : complaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            complaints.map((complaint) => (
                                <TableRow key={complaint._id} className="hover:bg-gray-50">
                                    <TableCell className="font-mono font-medium">
                                        {complaint.complaintId}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(complaint.createdAt), "dd-MM-yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{complaint.fullName}</span>
                                            <span className="text-xs text-muted-foreground">{complaint.email}</span>
                                            <span className="text-xs text-muted-foreground">{complaint.phoneNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(complaint.status)} variant="secondary">
                                            {complaint.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                    <span className="sr-only">Open menu</span>
                                                    <EllipsisVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(complaint)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(complaint.complaintId)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(complaint.email)}>
                                                    Copy Email
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedComplaint && (
                <ComplaintDetailsModal
                    complaint={selectedComplaint}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onUpdateSuccess={fetchComplaints}
                />
            )}
        </div>
    );
};

export default ComplaintManagement;
