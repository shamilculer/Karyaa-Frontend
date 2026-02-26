"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createJobPostingAction, updateJobPostingAction } from "@/app/actions/admin/jobs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import RichTextEditor from "@/components/common/RichTextEditor"; // Using standard text editor from the codebase
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEPARTMENT_OPTIONS = [
    "Engineering", "Design", "Marketing", "Sales", "Human Resources", "Finance", "Operations", "Customer Support"
];

const TYPE_OF_WORK_OPTIONS = [
    "Full-time", "Part-time", "Contract", "Internship", "Temporary", "Volunteer", "Freelance"
];

export default function JobPostingEditorModal({ isOpen, onClose, job, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        typeOfWork: "",
        city: "",
        stateProvince: "",
        country: "",
        zipCode: "",
        experience: "",
        dateOpened: "",
        applicationDeadline: "",
        image: "",
        body: "",
        isActive: true,
    });
    const [showCustomDepartment, setShowCustomDepartment] = useState(false);
    const [showCustomTypeOfWork, setShowCustomTypeOfWork] = useState(false);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                department: job.department || "",
                typeOfWork: job.typeOfWork || "",
                city: job.city || "",
                stateProvince: job.stateProvince || "",
                country: job.country || "",
                zipCode: job.zipCode || "",
                experience: job.experience || "",
                dateOpened: job.dateOpened ? new Date(job.dateOpened).toISOString().split('T')[0] : "",
                applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : "",
                image: job.image || "",
                body: job.body || "",
                isActive: job.isActive !== false,
            });
            setShowCustomDepartment(job.department && !DEPARTMENT_OPTIONS.includes(job.department));
            setShowCustomTypeOfWork(job.typeOfWork && !TYPE_OF_WORK_OPTIONS.includes(job.typeOfWork));
        } else {
            setFormData({
                title: "",
                department: "",
                typeOfWork: "",
                city: "",
                stateProvince: "",
                country: "",
                zipCode: "",
                experience: "",
                dateOpened: new Date().toISOString().split('T')[0],
                applicationDeadline: "",
                image: "",
                body: "",
                isActive: true,
            });
            setShowCustomDepartment(false);
            setShowCustomTypeOfWork(false);
        }
    }, [job, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let res;
            if (job) {
                // Update
                res = await updateJobPostingAction(job._id, formData);
            } else {
                // Create
                res = await createJobPostingAction(formData);
            }

            if (res.success) {
                toast.success(job ? "Job updated successfully" : "Job created successfully");
                onSuccess();
                onClose();
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-4 sm:p-6">
                <DialogHeader className="bg-primary text-white -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 border-b border-gray-300 rounded-t-lg">
                    <div className="w-full text-center relative">
                        <DialogTitle className="!text-lg !text-white uppercase font-bold mx-auto">
                            {job ? "Edit Job Posting" : "Create New Job Posting"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[65vh] md:px-3.5" type="always">
                    <form id="job-posting-form" onSubmit={handleSubmit} className="space-y-6 py-4 pr-2">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="!text-lg uppercase font-semibold border-b pb-2">Basic Information</h3>

                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={showCustomDepartment ? "Other" : formData.department}
                                        onValueChange={(val) => {
                                            if (val === "Other") {
                                                setShowCustomDepartment(true);
                                                setFormData((prev) => ({ ...prev, department: "" }));
                                            } else {
                                                setShowCustomDepartment(false);
                                                setFormData((prev) => ({ ...prev, department: val }));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEPARTMENT_OPTIONS.map((dept) => (
                                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other (Type below)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {showCustomDepartment && (
                                        <Input
                                            className="mt-2"
                                            placeholder="Type custom department"
                                            value={formData.department}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="typeOfWork">Type of Work</Label>
                                    <Select
                                        value={showCustomTypeOfWork ? "Other" : formData.typeOfWork}
                                        onValueChange={(val) => {
                                            if (val === "Other") {
                                                setShowCustomTypeOfWork(true);
                                                setFormData((prev) => ({ ...prev, typeOfWork: "" }));
                                            } else {
                                                setShowCustomTypeOfWork(false);
                                                setFormData((prev) => ({ ...prev, typeOfWork: val }));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type of Work" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPE_OF_WORK_OPTIONS.map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other (Type below)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {showCustomTypeOfWork && (
                                        <Input
                                            className="mt-2"
                                            placeholder="Type custom work format"
                                            value={formData.typeOfWork}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, typeOfWork: e.target.value }))}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Experience</Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 3-5 Years"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                            <h3 className="!text-lg uppercase font-semibold border-b pb-2">Location</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stateProvince">State/Province</Label>
                                    <Input
                                        id="stateProvince"
                                        name="stateProvince"
                                        value={formData.stateProvince}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country *</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates and Status */}
                        <div className="space-y-4">
                            <h3 className="!text-lg uppercase font-semibold border-b pb-2">Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOpened">Date Opened</Label>
                                    <DatePicker
                                        date={formData.dateOpened}
                                        setDate={(newDate) => {
                                            if (newDate) {
                                                setFormData((prev) => ({ ...prev, dateOpened: newDate.toISOString().split('T')[0] }));
                                            } else {
                                                setFormData((prev) => ({ ...prev, dateOpened: "" }));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                                    <DatePicker
                                        date={formData.applicationDeadline}
                                        setDate={(newDate) => {
                                            if (newDate) {
                                                setFormData((prev) => ({ ...prev, applicationDeadline: newDate.toISOString().split('T')[0] }));
                                            } else {
                                                setFormData((prev) => ({ ...prev, applicationDeadline: "" }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                                />
                                <Label htmlFor="isActive">Active (Visible to public)</Label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="!text-lg uppercase font-semibold border-b pb-2">Description</h3>
                            <div className="space-y-2">
                                <Label>Job Description</Label>
                                <div className="border rounded-md min-h-[300px]">
                                    <RichTextEditor
                                        value={formData.body}
                                        onChange={(html) => setFormData((prev) => ({ ...prev, body: html }))}
                                        disableHeadings={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </ScrollArea>

                <DialogFooter className="border-t pt-4 border-gray-300 flex !flex-row justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 md:flex-none md:min-w-[120px] max-md:h-8"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="job-posting-form"
                        disabled={isLoading}
                        className="flex-1 md:flex-none md:min-w-[200px] max-md:h-8"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {job ? "Update Job" : "Create Job"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

