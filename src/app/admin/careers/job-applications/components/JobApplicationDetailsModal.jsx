"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateJobApplicationStatusAction } from "@/app/actions/admin/jobs";
import { toast } from "sonner";
import {
    Download,
    ExternalLink,
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Globe,
    Linkedin,
    Facebook,
    Instagram,
    FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const STATUS_META = {
    Pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    Reviewed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    Rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    Hired: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
};

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mt-0.5">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
                <p className="!text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="!text-sm font-semibold text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-200 bg-white">
                <h3 className="!text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h3>
            </div>
            <div className="px-4 py-1">{children}</div>
        </div>
    );
}

export default function JobApplicationDetailsModal({ isOpen, onClose, application, onSuccess }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(application?.status ?? "Pending");

    // Sync status whenever a different application is opened
    useEffect(() => {
        if (application?.status) setCurrentStatus(application.status);
    }, [application?._id]);

    if (!application) return null;

    const { basicInfo, addressInfo, professionalDetails, socialNetwork, attachments } = application;
    const fullName = [basicInfo?.firstName, basicInfo?.lastName].filter(Boolean).join(" ") || "Applicant";
    const initials = [basicInfo?.firstName?.[0], basicInfo?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
    const statusMeta = STATUS_META[currentStatus] ?? STATUS_META.Pending;

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            const res = await updateJobApplicationStatusAction(application._id, newStatus);
            if (res.success) {
                toast.success("Status updated successfully");
                setCurrentStatus(newStatus);
                onSuccess();
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 max-h-[92vh] flex flex-col">

                {/* ── Header bar ── */}
                <div className="bg-primary px-6 pt-5 pb-0 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4 mb-4">

                        {/* Avatar + name */}
                        <div className="flex items-center gap-4">
                            {attachments?.photo ? (
                                <Image
                                    src={attachments.photo}
                                    alt={fullName}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md flex-shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <span className="text-white font-bold text-lg">{initials}</span>
                                </div>
                            )}
                            <div>
                                <h2 className="!text-white !text-lg leading-tight">{fullName}</h2>
                                <p className="text-white/70 !text-sm">
                                    Applying for <span className="text-white/90 text-sm font-semibold">{application.jobId?.title || "Deleted Job"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Status badge + selector */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                                {currentStatus}
                            </span>
                            <Select disabled={isUpdating} value={currentStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger className="h-8 w-[130px] text-xs bg-white !text-gray-900 border-white/40">
                                    <SelectValue placeholder={currentStatus} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                </SelectContent>
                            </Select>
                            {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                        </div>
                    </div>

                    {/* Tab-style divider */}
                    <div className="h-px bg-white/20" />
                </div>

                {/* ── Scrollable body ── */}
                <ScrollArea className="flex-1 overflow-auto">
                    <div className="px-6 py-5 space-y-4">

                        {/* Row 1 — Basic + Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SectionCard title="Basic Information">
                                <InfoRow icon={User} label="Full Name" value={fullName} />
                                <InfoRow icon={Mail} label="Email" value={basicInfo?.email} />
                                <InfoRow icon={Phone} label="Mobile" value={basicInfo?.mobile} />
                                <InfoRow icon={User} label="Gender" value={basicInfo?.gender} />
                                <InfoRow icon={Calendar} label="Date of Birth" value={basicInfo?.dateOfBirth ? new Date(basicInfo.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null} />
                                <InfoRow icon={Globe} label="Nationality" value={basicInfo?.nationality} />
                            </SectionCard>

                            <SectionCard title="Address Information">
                                <InfoRow icon={MapPin} label="Current City" value={addressInfo?.currentCity} />
                                <InfoRow icon={MapPin} label="City" value={addressInfo?.city} />
                                <InfoRow icon={Globe} label="Country" value={addressInfo?.country} />
                            </SectionCard>
                        </div>

                        {/* Row 2 — Professional + Social */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SectionCard title="Professional Details">
                                <InfoRow icon={Briefcase} label="Current Job Title" value={professionalDetails?.currentJobTitle} />
                                <InfoRow icon={Briefcase} label="Current Employer" value={professionalDetails?.currentEmployer} />
                                <InfoRow icon={Calendar} label="Available to Start" value={professionalDetails?.availableToStart} />
                            </SectionCard>

                            <SectionCard title="Social Networks">
                                <div className="py-2 space-y-2">
                                    {[
                                        { label: "LinkedIn", icon: Linkedin, url: socialNetwork?.linkedin },
                                        { label: "Facebook", icon: Facebook, url: socialNetwork?.facebook },
                                        { label: "Instagram", icon: Instagram, url: socialNetwork?.instagram },
                                    ].map(({ label, icon: Icon, url }) => (
                                        <div key={label} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="!text-xs text-gray-400 font-medium uppercase tracking-wide w-20 flex-shrink-0">{label}</span>
                                            {url ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="!text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 truncate"
                                                >
                                                    View Profile <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="!text-sm text-gray-300">—</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>

                        {/* Row 3 — Attachments */}
                        <SectionCard title="Attachments">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">

                                {/* Resume */}
                                <div className={`rounded-xl border-2 overflow-hidden transition-all ${attachments?.resume ? "border-blue-200 bg-blue-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
                                    {attachments?.resume ? (
                                        <div className="flex items-center gap-3 p-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="!text-sm font-bold text-gray-800">Resume / CV</p>
                                                <p className="!text-xs text-blue-500 truncate" title={attachments.resume.split("/").pop()}>
                                                    {attachments.resume.split("/").pop().split("?")[0]}
                                                </p>
                                            </div>
                                            <a
                                                href={attachments.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Button size="sm" className="flex-shrink-0 gap-1.5">
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </Button>
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 gap-1 text-center">
                                            <FileText className="w-8 h-8 text-gray-300 mb-1" />
                                            <p className="!text-sm font-medium text-gray-400">No Resume Provided</p>
                                        </div>
                                    )}
                                </div>

                                {/* Photo */}
                                <div className={`rounded-xl border-2 overflow-hidden transition-all ${attachments?.photo ? "border-gray-200" : "border-dashed border-gray-200 bg-gray-50"}`}>
                                    {attachments?.photo ? (
                                        <div className="flex items-center gap-3 p-4">
                                            <img
                                                src={attachments.photo}
                                                alt={`${fullName} photo`}
                                                className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-sm flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="!text-sm font-bold text-gray-800">Photo</p>
                                                <p className="!text-xs text-gray-400">Applicant portrait</p>
                                            </div>
                                            <a
                                                href={attachments.photo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button size="sm" variant="outline" className="flex-shrink-0 gap-1.5">
                                                    <ExternalLink className="w-3.5 h-3.5" /> View
                                                </Button>
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 gap-1 text-center">
                                            <User className="w-8 h-8 text-gray-300 mb-1" />
                                            <p className="!text-sm font-medium text-gray-400">No Photo Provided</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </SectionCard>

                    </div>
                </ScrollArea>

                {/* ── Footer ── */}
                <div className="border-t border-gray-200 px-6 py-3 bg-white flex justify-end flex-shrink-0">
                    <Button onClick={onClose} variant="outline" size="sm">Close</Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
