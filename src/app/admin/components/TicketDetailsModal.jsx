"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

// Icons
import { 
    Mail, 
    Loader2, 
    Save, 
    Ticket, 
    Calendar,
    User,
    Tag,
    AlertCircle,
    Clock,
    X
} from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Server Actions
import { updateTicketStatusAction } from "@/app/actions/admin/tickets";

const TicketDetailsModal = ({
    initialTicketData,
    isOpen,
    onClose,
    onUpdateSuccess,
}) => {
    const [ticket, setTicket] = useState(initialTicketData);
    const [isUpdating, setIsUpdating] = useState(false);

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: { status: initialTicketData?.status || "" },
    });

    const validStatuses = ["open", "in-progress", "pending", "closed"];
    const currentStatus = watch("status");

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-blue-500/10 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
            case "in-progress":
                return "bg-amber-500/10 text-amber-700 border-amber-200 ring-1 ring-amber-500/20";
            case "pending":
                return "bg-orange-500/10 text-orange-700 border-orange-200 ring-1 ring-orange-500/20";
            case "closed":
                return "bg-emerald-500/10 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20";
            default:
                return "bg-gray-500/10 text-gray-700 border-gray-200 ring-1 ring-gray-500/20";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
                return "bg-red-600 text-white hover:bg-red-700";
            case "high":
                return "bg-red-500/15 text-red-700 hover:bg-red-500/25";
            case "medium":
                return "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25";
            case "low":
                return "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25";
            default:
                return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25";
        }
    };

    useEffect(() => {
        if (initialTicketData) {
            setTicket(initialTicketData);
            setValue("status", initialTicketData.status);
        } else {
            setTicket(null);
        }
    }, [initialTicketData, setValue]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen && ticket) {
            setValue("status", ticket.status);
        }
    }, [isOpen, ticket, setValue]);

    const onSubmit = async (formData) => {
        if (!ticket) return;

        if (formData.status === ticket.status) {
            toast.info("Status is already set to this value.");
            return;
        }

        setIsUpdating(true);

        try {
            const res = await updateTicketStatusAction({
                id: ticket._id,
                status: formData.status,
            });

            if (res.success) {
                toast.success(res.message || "Ticket status updated!");
                setTicket((prev) => ({ ...prev, status: formData.status }));
                onUpdateSuccess?.();
            } else {
                toast.error(res.message || "Failed to update ticket status.");
            }
        } catch (error) {
            toast.error("Unexpected error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleClose = () => {
        setValue("status", ticket?.status || "");
        onClose();
    };

    if (!isOpen || !ticket || typeof ticket !== "object") return null;

    const submitterName = ticket.submittedBy?.ownerName || "Deleted User";
    const submitterImage = ticket.submittedBy?.ownerProfileImage;
    const contactMail = ticket.contactEmail || "N/A";
    const mailtoLink =
        contactMail !== "N/A"
            ? `mailto:${contactMail}?subject=RE: Ticket #${ticket._id.slice(-6)} - ${ticket.subject}`
            : "#";

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 gap-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-b border-b-gray-300 px-6 py-5">

                    <DialogHeader className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Ticket className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <DialogTitle className="text-2xl font-bold leading-tight pr-8">
                                    {ticket.subject}
                                </DialogTitle>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs font-mono px-2">
                                        #{ticket._id.slice(-8)}
                                    </Badge>
                                    <Badge className={`${getStatusColor(ticket.status)} text-xs font-semibold px-3`}>
                                        {ticket.status.replace("-", " ").toUpperCase()}
                                    </Badge>
                                    <Badge className={`${getPriorityColor(ticket.priority)} text-xs font-semibold`}>
                                        {ticket.priority?.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT COLUMN - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description Card */}
                            <div className="rounded-xl border  border-gray-300 bg-gradient-to-br from-white to-gray-50/50 shadow-sm overflow-hidden">
                                <div className="bg-white border-b border-gray-300 px-4 py-2">
                                    <h4 className="font-semibold text-base flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                        Description
                                    </h4>
                                </div>
                                <div className="p-4">
                                    <div className="bg-gray-50/80 max-h-64 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap">
                                        {ticket.description}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Tag className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                            Category
                                        </Label>
                                    </div>
                                    <p className="font-semibold !text-lg pl-11">
                                        {ticket.category}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                            Priority
                                        </Label>
                                    </div>
                                    <Badge className={`${getPriorityColor(ticket.priority)} ml-11 font-semibold !text-base`}>
                                        {ticket.priority?.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                        </div>
                                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                            Created
                                        </Label>
                                    </div>
                                    <p className="text-sm font-medium pl-11">
                                        {format(new Date(ticket.createdAt), "dd MMM yyyy")}
                                        <span className="text-muted-foreground block text-xs">
                                            {format(new Date(ticket.createdAt), "hh:mm a")}
                                        </span>
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                            Updated
                                        </Label>
                                    </div>
                                    <p className="text-sm font-medium pl-11">
                                        {format(new Date(ticket.updatedAt), "dd MMM yyyy")}
                                        <span className="text-muted-foreground block text-xs">
                                            {format(new Date(ticket.updatedAt), "hh:mm a")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Sidebar */}
                        <div className="space-y-4">
                            {/* Submitter Card */}
                            <div className="rounded-xl border border-gray-300 bg-gradient-to-br from-white to-primary/5 shadow-sm overflow-hidden">
                                <div className="bg-white border-b border-gray-300 px-4 py-2">
                                    <h4 className="font-semibold text-base flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" />
                                        Submitted By
                                    </h4>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 ring-2 ring-primary/20">
                                            <AvatarImage src={submitterImage} alt={submitterName} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {submitterName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold !text-sm truncate">
                                                {submitterName}
                                            </p>
                                            <p className="!text-xs text-muted-foreground truncate">
                                                {contactMail}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        className="w-full"
                                        disabled={contactMail === "N/A"}
                                    >
                                        <a href={mailtoLink}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Submitter
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            {/* Status Update Card */}
                            <div className="rounded-xl border border-gray-300 bg-gradient-to-br from-white to-primary/5 shadow-sm overflow-hidden">
                                <div className="bg-white border-b border-gray-300 px-4 py-2">
                                    <h4 className="font-semibold text-base flex items-center gap-2">
                                        <Save className="w-4 h-4 text-primary" />
                                        Update Status
                                    </h4>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                            Current Status
                                        </Label>
                                        <Select
                                            value={currentStatus}
                                            onValueChange={(v) => setValue("status", v)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {validStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        <span className="capitalize">
                                                            {status.replace("-", " ")}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={handleSubmit(onSubmit)}
                                        className="w-full bg-primary hover:bg-primary/90 shadow-sm"
                                        disabled={isUpdating || currentStatus === ticket.status}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50/50 px-6 py-4">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TicketDetailsModal;