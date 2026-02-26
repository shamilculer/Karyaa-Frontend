"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, Trash2, Search, ChevronDown, EllipsisVertical } from "lucide-react";
import { getJobApplicationsAction, deleteJobApplicationAction, bulkDeleteJobApplicationsAction } from "@/app/actions/admin/jobs";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import JobApplicationDetailsModal from "./components/JobApplicationDetailsModal";

function JobApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedApps, setSelectedApps] = useState([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    const fetchApplications = async () => {
        setIsLoading(true);
        const res = await getJobApplicationsAction();
        if (res?.success) {
            setApplications(res.data);
            setSelectedApps([]); // clear selection on refetch
        } else {
            toast.error(res?.message || "Failed to fetch job applications");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDelete = async () => {
        if (!appToDelete) return;

        try {
            const res = await deleteJobApplicationAction(appToDelete._id);
            if (res.success) {
                toast.success("Job application deleted successfully");
                fetchApplications();
            } else {
                toast.error(res.message || "Failed to delete application");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setAppToDelete(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Reviewed': return 'bg-blue-100 text-blue-800';
            case 'Hired': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleBulkDelete = async () => {
        if (selectedApps.length === 0) return;

        setIsDeletingBulk(true);
        try {
            const res = await bulkDeleteJobApplicationsAction(selectedApps);
            if (res.success) {
                toast.success("Selected applications deleted successfully");
                fetchApplications();
            } else {
                toast.error(res.message || "Failed to bulk delete");
            }
        } catch (error) {
            toast.error("An error occurred during bulk delete");
        } finally {
            setIsDeletingBulk(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedApps.length === filteredApplications.length) {
            setSelectedApps([]);
        } else {
            setSelectedApps(filteredApplications.map(app => app._id));
        }
    };

    const toggleSelectApp = (id) => {
        if (selectedApps.includes(id)) {
            setSelectedApps(selectedApps.filter(appId => appId !== id));
        } else {
            setSelectedApps([...selectedApps, id]);
        }
    };

    const filteredApplications = applications.filter((app) => {
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            (app.basicInfo?.firstName || "").toLowerCase().includes(searchLower) ||
            (app.basicInfo?.lastName || "").toLowerCase().includes(searchLower) ||
            (app.basicInfo?.email || "").toLowerCase().includes(searchLower) ||
            (app.applicationId || "").toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="!text-2xl uppercase font-bold">Job Applications</h1>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4 mb-4">
                <div className="relative w-full md:w-2/5 lg:max-w-md">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Search by name, email, or App ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {selectedApps.length > 0 && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2 bg-[#F2F4FF] border-gray-300 text-primary">
                                    Bulk Actions
                                    <Badge className="bg-primary text-white px-2 rounded-full">
                                        {selectedApps.length}
                                    </Badge>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={handleBulkDelete}
                                    disabled={isDeletingBulk}
                                    className="text-red-600"
                                >
                                    {isDeletingBulk && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-[#F2F4FF] border-gray-300 text-primary">
                                Status: {statusFilter === "all" ? "All" : statusFilter}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setStatusFilter("all")}>Show All</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={statusFilter === "Pending"} onCheckedChange={() => setStatusFilter("Pending")}>
                                Pending
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={statusFilter === "Reviewed"} onCheckedChange={() => setStatusFilter("Reviewed")}>
                                Reviewed
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={statusFilter === "Hired"} onCheckedChange={() => setStatusFilter("Hired")}>
                                Hired
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={statusFilter === "Rejected"} onCheckedChange={() => setStatusFilter("Rejected")}>
                                Rejected
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedApps.length === filteredApplications.length && filteredApplications.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead>App ID</TableHead>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Job Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Applied On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                                        No job applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((app) => (
                                    <TableRow key={app._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedApps.includes(app._id)}
                                                onCheckedChange={() => toggleSelectApp(app._id)}
                                                aria-label={`Select ${app.basicInfo?.firstName}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-700">
                                            {app.applicationId || "N/A"}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {app.basicInfo?.firstName} {app.basicInfo?.lastName}
                                        </TableCell>
                                        <TableCell>{app.jobId?.title || "Deleted Job"}</TableCell>
                                        <TableCell>{app.basicInfo?.email}</TableCell>
                                        <TableCell>
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300 hover:bg-gray-100">
                                                        <EllipsisVertical className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedApp(app);
                                                            setIsViewerOpen(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setAppToDelete(app)}
                                                        className="text-red-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <JobApplicationDetailsModal
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                application={selectedApp}
                onSuccess={fetchApplications}
            />

            <AlertDialog open={!!appToDelete} onOpenChange={() => setAppToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the application for "{appToDelete?.basicInfo?.firstName}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default JobApplicationsPage;

