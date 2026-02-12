"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { updateComplaintStatusAction } from "@/app/actions/public/complaint";
import { toast } from "sonner";
import { Loader2, Mail, Phone, User, Calendar, FileText } from "lucide-react";

const ComplaintDetailsModal = ({ complaint, isOpen, onClose, onUpdateSuccess }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(complaint?.status || "Pending");

    const handleStatusUpdate = async (newStatus) => {
        if (!complaint?._id) return;

        setIsUpdating(true);
        const result = await updateComplaintStatusAction(complaint._id, newStatus);

        if (result.success) {
            toast.success("Status updated successfully");
            setCurrentStatus(newStatus);
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } else {
            toast.error(result.error || "Failed to update status");
        }
        setIsUpdating(false);
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

    if (!complaint) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl rounded-lg overflow-hidden">
                <DialogHeader className="bg-primary text-white -mx-6 -mt-6 p-4 border-b border-gray-300">
                    <DialogTitle className="!text-lg !text-white uppercase font-bold">
                        Complaint Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Complaint ID and Status */}
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                            <p className="!text-sm text-muted-foreground">Complaint ID</p>
                            <p className="!text-lg font-bold font-mono">{complaint.complaintId}</p>
                        </div>
                        <Badge className={getStatusColor(currentStatus)} variant="secondary">
                            {currentStatus}
                        </Badge>
                    </div>

                    {/* User Information */}
                    <div className="space-y-3">
                        <h3 className="!text-lg uppercase font-semibold text-base flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="!text-xs text-muted-foreground mb-1">Full Name</p>
                                <p className="font-medium">{complaint.fullName}</p>
                            </div>
                            <div>
                                <p className="!text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </p>
                                <p className="font-medium text-sm">{complaint.email}</p>
                            </div>
                            <div>
                                <p className="!text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone Number
                                </p>
                                <p className="font-medium">{complaint.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="!text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Submitted On
                                </p>
                                <p className="font-medium">
                                    {format(new Date(complaint.createdAt), "PPP")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Complaint Description */}
                    <div className="space-y-2">
                        <h3 className="!text-lg uppercase font-semibold text-base flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Complaint Description
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {complaint.description}
                            </p>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-2">
                        <h3 className="!text-lg uppercase font-semibold text-base">Update Status</h3>
                        <Select
                            value={currentStatus}
                            onValueChange={handleStatusUpdate}
                            disabled={isUpdating}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4 border-gray-300">
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplaintDetailsModal;
