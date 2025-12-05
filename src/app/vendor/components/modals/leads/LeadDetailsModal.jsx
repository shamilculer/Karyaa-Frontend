"use client"
import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Phone, MapPin, Calendar, Users, MessageSquare, Hash } from "lucide-react"
import { IconCircleFilled, IconConfetti } from "@tabler/icons-react"
import { updateLeadStatus, deleteLead } from "@/app/actions/vendor/leads"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

const STATUS_OPTIONS = ["New", "Contacted", "Closed - Won", "Closed - Lost"];

const getStatusColor = (status) => {
    if (status === "New") {
        return "bg-blue-100 text-blue-800";
    } else if (status === "Contacted") {
        return "bg-yellow-100 text-yellow-800";
    } else if (status === "Closed - Won") {
        return "bg-emerald-100 text-emerald-800";
    } else if (status === "Closed - Lost") {
        return "bg-red-100 text-red-800";
    } else {
        return "bg-gray-100 text-gray-800";
    }
};

export default function LeadDetailsModal({ lead, open, onOpenChange, onUpdate }) {
    const [selectedStatus, setSelectedStatus] = React.useState(lead?.status || "");
    const [updatingStatus, setUpdatingStatus] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deletingLead, setDeletingLead] = React.useState(false);

    React.useEffect(() => {
        if (lead) {
            setSelectedStatus(lead.status);
        }
    }, [lead]);

    const handleStatusUpdate = async () => {
        if (!lead || selectedStatus === lead.status) return;

        setUpdatingStatus(true);
        try {
            const result = await updateLeadStatus(lead._id, selectedStatus);

            if (result.success) {
                toast.success(result.message);
                onUpdate?.(); // Refresh the table
            } else {
                toast.error(result.message);
                setSelectedStatus(lead.status); // Reset on error
            }
        } catch (error) {
            toast.error("Failed to update lead status");
            setSelectedStatus(lead.status);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!lead) return;

        setDeletingLead(true);
        try {
            const result = await deleteLead(lead._id);

            if (result.success) {
                toast.success(result.message);
                setDeleteDialogOpen(false);
                onOpenChange(false); // Close the main modal
                onUpdate?.(); // Refresh the table
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete lead");
        } finally {
            setDeletingLead(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    const formatCreatedAt = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!lead) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] gap-0 px-4">
                    <DialogHeader className="pb-3">
                        <DialogTitle className="!text-xl uppercase !tracking-wide">Lead Details</DialogTitle>
                        <DialogDescription className="!text-sm">
                            Reference ID: <span className="font-semibold text-foreground">{lead.referenceId}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />

                    <ScrollArea className="overflow-y-auto max-h-[65vh]">

                        <div className="space-y-6 py-4">
                            {/* Status Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Current Status</label>
                                <div className="flex items-center gap-3">
                                    {/* FIX: Allow the Select container to shrink inside flex (prevents overflow) */}
                                    <div className="flex-1 min-w-0"> 
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={setSelectedStatus}
                                            disabled={updatingStatus}
                                        >
                                            <SelectTrigger className="w-full border-gray-400">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(status => (
                                                    <SelectItem key={status} value={status}>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={`inline-flex items-center border-0 gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
                                                            >
                                                                <IconCircleFilled className="size-2 fill-current" />
                                                                {status}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {selectedStatus !== lead.status && (
                                        <Button
                                            onClick={handleStatusUpdate}
                                            disabled={updatingStatus}
                                            size="sm"
                                        >
                                            {updatingStatus ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                "Update"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <Separator />

                            {/* Client Information */}
                            <div className="space-y-4">
                                <h3 className="!text-base uppercase font-semibold">Client Information</h3>

                                <div className="grid xl:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Hash className="w-4 h-4 mt-1.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Full Name</p>
                                            <p className="font-medium">{lead.fullName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 mt-1.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone Number</p>
                                            <a
                                                href={`tel:${lead.phoneNumber}`}
                                                className="font-medium hover:underline text-blue-600"
                                            >
                                                {lead.phoneNumber}
                                            </a>
                                        </div>
                                    </div>

                                    {lead.email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 mt-1.5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className="font-medium hover:underline text-blue-600"
                                                >
                                                    {lead.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Event Details */}
                            <div className="space-y-4">
                                <h3 className="!text-base uppercase font-semibold">Event Details</h3>

                                <div className="grid gap-4">
                                    {lead.eventType && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                                                <IconConfetti className="w-4 h-4 text-muted-foreground mt-1.5" />
                                            </div>
                                            <div>
                                                <p className="!text-sm text-muted-foreground">Event Type</p>
                                                <p className="font-medium">{lead.eventType}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lead.eventDate && (
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-4 h-4 text-muted-foreground mt-1.5" />
                                            <div>
                                                <p className="!text-sm text-muted-foreground">Event Date</p>
                                                <p className="font-medium">{formatDate(lead.eventDate)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lead.location && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-1.5" />
                                            <div>
                                                <p className="!text-sm text-muted-foreground">Location</p>
                                                <p className="font-medium">{lead.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lead.numberOfGuests && (
                                        <div className="flex items-start gap-3">
                                            <Users className="w-4 h-4 text-muted-foreground mt-1.5" />
                                            <div>
                                                <p className="!text-sm text-muted-foreground">Number of Guests</p>
                                                <p className="font-medium">{lead.numberOfGuests}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lead.message && (
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground mt-1.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="!text-sm text-muted-foreground">Message</p>
                                                <p
                                                    className="font-medium whitespace-pre-wrap bg-muted p-3 rounded-md mt-1 break-words max-w-full overflow-x-auto"
                                                >
                                                    {lead.message}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Metadata */}
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Lead received on {formatCreatedAt(lead.createdAt)}
                                </p>
                            </div>
                        </div>

                    </ScrollArea>

                    <Separator />

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-6">
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={updatingStatus || deletingLead}
                            className="w-full sm:w-auto"
                        >
                            Delete Lead
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the lead from <strong>{lead.fullName}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingLead}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deletingLead}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deletingLead ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}