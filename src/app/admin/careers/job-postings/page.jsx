"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Loader2, Plus, Edit, Trash2, Search, ChevronDown, EllipsisVertical } from "lucide-react";
import { getJobPostingsAction, deleteJobPostingAction, updateJobPostingAction } from "@/app/actions/admin/jobs";
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
import JobPostingEditorModal from "./components/JobPostingEditorModal";

function JobPostingsPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // "" or "active" or "inactive"
    const [rowSelection, setRowSelection] = useState({});

    const fetchJobs = async () => {
        setIsLoading(true);
        const res = await getJobPostingsAction();
        if (res?.success) {
            setJobs(res.data);
            setRowSelection({});
        } else {
            toast.error(res?.message || "Failed to fetch jobs");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Derived filtered jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = (job.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (job.jobId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (job.department?.toLowerCase() || "").includes(searchQuery.toLowerCase());

            let matchesStatus = true;
            if (statusFilter === "active") matchesStatus = job.isActive === true;
            if (statusFilter === "inactive") matchesStatus = job.isActive === false;

            return matchesSearch && matchesStatus;
        });
    }, [jobs, searchQuery, statusFilter]);

    // Row selection logic
    const toggleRowSelected = (id) => {
        setRowSelection(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const isRowSelected = (id) => !!rowSelection[id];
    const isAllSelected = filteredJobs.length > 0 && filteredJobs.every(row => isRowSelected(row._id));
    const isSomeSelected = filteredJobs.some(row => isRowSelected(row._id)) && !isAllSelected;
    const toggleAllRowsSelected = (checked) => {
        const currentPageIds = filteredJobs.map(row => row._id);
        setRowSelection(prev => {
            let newSelection = Object.fromEntries(
                Object.entries(prev).filter(([id]) => !currentPageIds.includes(id))
            );
            if (checked) {
                currentPageIds.forEach(id => {
                    newSelection[id] = true;
                });
            }
            return newSelection;
        });
    };
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    const selectedRowCount = selectedIds.length;

    const handleDelete = async () => {
        if (!jobToDelete) return;
        try {
            const res = await deleteJobPostingAction(jobToDelete._id);
            if (res.success) {
                toast.success("Job posting deleted successfully");
                fetchJobs();
            } else {
                toast.error(res.message || "Failed to delete job posting");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setJobToDelete(null);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} select job posting(s)?`)) return;

        try {
            const promises = selectedIds.map(id => deleteJobPostingAction(id));
            const results = await Promise.all(promises);
            const failed = results.filter(r => !r.success);

            if (failed.length === 0) {
                toast.success(`Successfully deleted ${selectedIds.length} job(s)`);
            } else {
                toast.error(`Deleted ${results.length - failed.length} jobs, but ${failed.length} failed`);
            }
            fetchJobs();
        } catch (error) {
            toast.error("An error occurred during bulk deletion");
        }
    };

    const handleToggleStatus = async (job, status) => {
        try {
            const res = await updateJobPostingAction(job._id, { ...job, isActive: status });
            if (res.success) {
                toast.success(`Job marked as ${status ? 'Active' : 'Inactive'}`);
                fetchJobs();
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleBulkToggleStatus = async (status) => {
        if (selectedIds.length === 0) return;
        try {
            const promises = selectedIds.map(id => {
                const job = jobs.find(j => j._id === id);
                return updateJobPostingAction(id, { ...job, isActive: status });
            });
            const results = await Promise.all(promises);
            const failed = results.filter(r => !r.success);

            if (failed.length === 0) {
                toast.success(`Successfully updated status for ${selectedIds.length} job(s)`);
            } else {
                toast.error(`Updated ${results.length - failed.length} jobs, but ${failed.length} failed`);
            }
            fetchJobs();
        } catch (error) {
            toast.error("An error occurred during bulk update");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="!text-2xl uppercase font-bold">Job Postings</h1>
                <Button
                    onClick={() => {
                        setSelectedJob(null);
                        setIsEditorOpen(true);
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Job
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4 mb-4">
                <div className="relative w-full md:w-2/5 lg:max-w-md">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Search by ID, title, department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {selectedRowCount > 0 && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2 bg-[#F2F4FF] border-gray-300 text-primary">
                                    Bulk Actions
                                    <Badge className="bg-primary text-white px-2 rounded-full">
                                        {selectedRowCount}
                                    </Badge>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBulkToggleStatus(true)}>Mark as Active</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkToggleStatus(false)}>Mark as Inactive</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                                    Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-[#F2F4FF] border-gray-300 text-primary">
                                Status: {statusFilter === "active" ? "Active" : statusFilter === "inactive" ? "Inactive" : "All"}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setStatusFilter("")}>Show All</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={statusFilter === "active"} onCheckedChange={() => setStatusFilter("active")}>
                                Active
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={statusFilter === "inactive"} onCheckedChange={() => setStatusFilter("inactive")}>
                                Inactive
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
                            <TableRow >
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isSomeSelected ? "indeterminate" : isAllSelected}
                                        onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                    />
                                </TableHead>
                                <TableHead>Job ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type of Work</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Opened</TableHead>
                                <TableHead className="text-center w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                                        No job postings found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredJobs.map((job) => (
                                    <TableRow key={job._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={isRowSelected(job._id)}
                                                onCheckedChange={() => toggleRowSelected(job._id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-700">{job.jobId || "-"}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{job.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-normal">
                                                {job.typeOfWork || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{job.department || "-"}</TableCell>
                                        <TableCell>
                                            {[job.city, job.country].filter(Boolean).join(", ") || job.location || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${job.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {job.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {job.dateOpened ? new Date(job.dateOpened).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300 hover:bg-gray-100">
                                                        <EllipsisVertical className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedJob(job);
                                                        setIsEditorOpen(true);
                                                    }} className="cursor-pointer">
                                                        <Edit className="w-4 h-4 mr-2" /> Edit Job
                                                    </DropdownMenuItem>
                                                    {job.isActive ? (
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(job, false)} className="cursor-pointer">
                                                            Mark as Inactive
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(job, true)} className="cursor-pointer">
                                                            Mark as Active
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setJobToDelete(job)} className="text-red-600 cursor-pointer">
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

            <JobPostingEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                job={selectedJob}
                onSuccess={fetchJobs}
            />

            <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the job posting "{jobToDelete?.title}".
                            This action cannot be undone.
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

export default JobPostingsPage;
