"use client";
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { submitJobApplicationAction } from '@/app/actions/public/jobs';
import { getPresignedUrl } from '@/app/actions/s3-upload';
import { countries } from '@/lib/countries';
import { phoneCountryCodes } from '@/lib/phoneCodes';
import { Combobox } from '@/components/ui/combobox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '@/components/ui/DatePicker';

export default function JobApplicationModal({ isOpen, onClose, job }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = (open) => {
        onClose(open);
        if (!open) {
            setIsSuccess(false);
        }
    };

    // Stores raw File objects — only uploaded to S3 on submit
    const [files, setFiles] = useState({ resume: null, photo: null });
    const resumeInputRef = useRef(null);
    const photoInputRef = useRef(null);

    const initialFormState = {
        basicInfo: {
            firstName: '', lastName: '', email: '', countryCode: '+971', mobile: '',
            gender: '', dateOfBirth: '', nationality: ''
        },
        addressInfo: {
            city: '', country: '', currentCity: ''
        },
        professionalDetails: {
            currentJobTitle: '', currentEmployer: '', availableToStart: ''
        },
        socialNetwork: {
            facebook: '', linkedin: '', instagram: ''
        }
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };


    const handleFileChange = (field, e) => {
        const file = e.target.files?.[0];
        if (file) setFiles(prev => ({ ...prev, [field]: file }));
        // Reset input so re-selecting same file still triggers onChange
        e.target.value = '';
    };

    const removeFile = (field) => setFiles(prev => ({ ...prev, [field]: null }));

    const uploadFileToS3 = async (file) => {
        const { signedUrl, url, error } = await getPresignedUrl({
            fileType: file.type,
            fileSize: file.size,
            role: 'user',
            isPublic: true,
            folder: 'public_resumes'
        });
        if (error) throw new Error(error);
        const res = await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        if (!res.ok) throw new Error('File upload to S3 failed.');
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!files.resume) {
                toast.error('Please upload your resume.');
                setIsSubmitting(false);
                return;
            }
            toast.info('Uploading your documents...');
            const attachments = {};
            attachments.resume = await uploadFileToS3(files.resume);
            if (files.photo) attachments.photo = await uploadFileToS3(files.photo);

            toast.info('Submitting application...');
            const submissionData = {
                ...formData,
                basicInfo: {
                    ...formData.basicInfo,
                    mobile: `${formData.basicInfo.countryCode} ${formData.basicInfo.mobile}`
                },
                attachments
            };
            const response = await submitJobApplicationAction(job._id, submissionData);
            if (response.success) {
                setIsSuccess(true);
                setFormData(initialFormState);
                setFiles({ resume: null, photo: null });
            } else {
                toast.error(response.message || 'Failed to submit application.');
            }
        } catch (error) {
            toast.error('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl p-4 sm:p-6 pb-0 overflow-hidden max-h-[90vh]">
                <DialogHeader className={`bg-primary text-white -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 border-b border-gray-300 rounded-t-lg ${isSuccess ? "rounded-b-none" : ""}`}>
                    <div className="w-full text-center relative">
                        <DialogTitle className="!text-lg !text-white uppercase font-bold mx-auto">Apply for {job?.title}</DialogTitle>
                    </div>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-10 text-center space-y-4">
                        <h3 className="!text-3xl font-semibold text-green-600">Application Submitted!</h3>
                        <p className="text-gray-600 px-4">
                            Your application for {job?.title} has been received. Our team will review your profile and get back to you shortly.
                        </p>
                        <div className="pt-4 pb-4">
                            <Button onClick={() => handleClose(false)}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[65vh] md:px-3.5" type="always">
                            <div className="space-y-6 pt-2 pr-2">
                                <form id="job-app-form" onSubmit={handleSubmit} className="space-y-5 px-2">
                                    <div className="text-center space-y-4 border-b pb-4 border-gray-100">
                                        <p className="!text-sm text-gray-500 px-4">
                                            Please fill out all the required details below to apply for {job?.title}.
                                        </p>
                                    </div>
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="!text-lg font-semibold border-b border-gray-300 pb-2">Basic Info</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>First Name *</Label>
                                                <Input required value={formData.basicInfo.firstName} onChange={e => handleNestedChange('basicInfo', 'firstName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last Name *</Label>
                                                <Input required value={formData.basicInfo.lastName} onChange={e => handleNestedChange('basicInfo', 'lastName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email *</Label>
                                                <Input type="email" required value={formData.basicInfo.email} onChange={e => handleNestedChange('basicInfo', 'email', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Mobile *</Label>
                                                <div className="flex gap-2">
                                                    <div className="w-[140px] shrink-0">
                                                        <Combobox
                                                            options={phoneCountryCodes}
                                                            value={formData.basicInfo.countryCode}
                                                            onChange={v => handleNestedChange('basicInfo', 'countryCode', v)}
                                                            placeholder="Code"
                                                        />
                                                    </div>
                                                    <Input required className="flex-1 min-w-0" value={formData.basicInfo.mobile} onChange={e => handleNestedChange('basicInfo', 'mobile', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <Label>Gender *</Label>
                                                <Select value={formData.basicInfo.gender} onValueChange={v => handleNestedChange('basicInfo', 'gender', v)} required>
                                                    <SelectTrigger className="w-full !h-[44px]"><SelectValue placeholder="-None-" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                        <SelectItem value="Undisclosed">Undisclosed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date of Birth *</Label>
                                                <DatePicker
                                                    date={formData.basicInfo.dateOfBirth}
                                                    setDate={(newDate) => handleNestedChange('basicInfo', 'dateOfBirth', newDate ? newDate.toISOString().split('T')[0] : '')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nationality *</Label>
                                                <Combobox
                                                    options={countries}
                                                    value={formData.basicInfo.nationality}
                                                    onChange={v => handleNestedChange('basicInfo', 'nationality', v)}
                                                    placeholder="-Select Nationality-"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Info */}
                                    <div className="space-y-4">
                                        <h3 className="!text-lg font-semibold border-b border-gray-300 pb-2">Address Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Current City *</Label>
                                                <Input required value={formData.addressInfo.currentCity} onChange={e => handleNestedChange('addressInfo', 'currentCity', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>City *</Label>
                                                <Input required value={formData.addressInfo.city} onChange={e => handleNestedChange('addressInfo', 'city', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Country *</Label>
                                                <Combobox
                                                    options={countries}
                                                    value={formData.addressInfo.country}
                                                    onChange={v => handleNestedChange('addressInfo', 'country', v)}
                                                    placeholder="-Select Country-"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Details */}
                                    <div className="space-y-4">
                                        <h3 className="!text-lg font-semibold border-b border-gray-300 pb-2">Professional Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Current Job Title *</Label>
                                                <Input required value={formData.professionalDetails.currentJobTitle} onChange={e => handleNestedChange('professionalDetails', 'currentJobTitle', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Current Employer *</Label>
                                                <Input required value={formData.professionalDetails.currentEmployer} onChange={e => handleNestedChange('professionalDetails', 'currentEmployer', e.target.value)} />
                                            </div>
                                            <div className="space-y-2 col-span-1 md:col-span-2">
                                                <Label>When would you be available to start? *</Label>
                                                <Select value={formData.professionalDetails.availableToStart} onValueChange={v => handleNestedChange('professionalDetails', 'availableToStart', v)} required>
                                                    <SelectTrigger className="w-full !h-[44px]"><SelectValue placeholder="-None-" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Immediately">Immediately</SelectItem>
                                                        <SelectItem value="15 Days">15 Days</SelectItem>
                                                        <SelectItem value="1 Month">1 Month</SelectItem>
                                                        <SelectItem value="2 Months or More">2 Months or More</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Network */}
                                    <div className="space-y-4">
                                        <h3 className="!text-lg font-semibold border-b border-gray-300 pb-2">Social Network Details</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label>LinkedIn</Label>
                                                <Input value={formData.socialNetwork.linkedin} onChange={e => handleNestedChange('socialNetwork', 'linkedin', e.target.value)} placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Facebook</Label>
                                                <Input value={formData.socialNetwork.facebook} onChange={e => handleNestedChange('socialNetwork', 'facebook', e.target.value)} placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Instagram</Label>
                                                <Input value={formData.socialNetwork.instagram} onChange={e => handleNestedChange('socialNetwork', 'instagram', e.target.value)} placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachments */}
                                    <div className="space-y-4">
                                        <h3 className="!text-lg font-semibold border-b border-gray-300 pb-2">Attachment Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Resume Upload */}
                                            <div className="space-y-2">
                                                <Label>Resume *</Label>
                                                <input
                                                    ref={resumeInputRef}
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.rtf"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange('resume', e)}
                                                />
                                                {files.resume ? (
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="!text-sm font-medium text-gray-800 truncate" title={files.resume.name}>
                                                                {files.resume.name}
                                                            </p>
                                                            <p className="!text-xs text-gray-400">{(files.resume.size / 1024).toFixed(0)} KB · Ready to upload</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile('resume')}
                                                            className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => resumeInputRef.current?.click()}
                                                        className="flex items-center gap-3 w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                                                    >
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Upload className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="!text-sm font-medium text-gray-700">Browse to attach file</p>
                                                            <p className="!text-xs text-gray-400">PDF, DOC, DOCX, RTF</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="space-y-2">
                                                <Label>Photo</Label>
                                                <input
                                                    ref={photoInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange('photo', e)}
                                                />
                                                {files.photo ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-16 h-16 flex-shrink-0 group">
                                                            <img
                                                                src={URL.createObjectURL(files.photo)}
                                                                alt="Profile photo"
                                                                className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile('photo')}
                                                                    className="p-1 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors shadow"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="!text-sm font-medium text-gray-800 truncate" title={files.photo.name}>{files.photo.name}</p>
                                                            <p className="!text-xs text-gray-400">{(files.photo.size / 1024).toFixed(0)} KB · Ready to upload</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => photoInputRef.current?.click()}
                                                        className="flex items-center gap-3 w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                                                    >
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Upload className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="!text-sm font-medium text-gray-700">Browse to attach file</p>
                                                            <p className="!text-xs text-gray-400">PNG, JPG, JPEG</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </ScrollArea>

                        <div className="border-t pt-4 border-gray-300 pb-4 flex !flex-row justify-between gap-2 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose(false)}
                                disabled={isSubmitting}
                                className="flex-1 md:flex-none md:min-w-[120px] max-md:h-8"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="job-app-form"
                                disabled={isSubmitting}
                                className="flex-1 md:flex-none md:min-w-[200px] max-md:h-8"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
