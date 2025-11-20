"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FileText, X, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ControlledFileUpload from '@/components/common/ControlledFileUploads';
import { updateVendorDocumentsAction } from '@/app/actions/admin/vendors';

export const DocumentEditModal = ({ vendor, isOpen, onClose, onUpdate }) => {
    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            tradeLicenseCopy: vendor.tradeLicenseCopy || '',
            emiratesIdCopy: vendor.emiratesIdCopy || '',
            businessLicenseCopy: vendor.businessLicenseCopy || '',
            passportOrIdCopy: vendor.passportOrIdCopy || '',
            tradeLicenseNumber: vendor.tradeLicenseNumber || '',
            personalEmiratesIdNumber: vendor.personalEmiratesIdNumber || '',
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        // Build the update payload based on vendor type
        const updatePayload = {};
        
        if (!vendor.isInternational) {
            // UAE vendor fields
            if (data.tradeLicenseCopy !== vendor.tradeLicenseCopy) {
                updatePayload.tradeLicenseCopy = data.tradeLicenseCopy;
            }
            if (data.emiratesIdCopy !== vendor.emiratesIdCopy) {
                updatePayload.emiratesIdCopy = data.emiratesIdCopy;
            }
            if (data.tradeLicenseNumber !== vendor.tradeLicenseNumber) {
                updatePayload.tradeLicenseNumber = data.tradeLicenseNumber;
            }
            if (data.personalEmiratesIdNumber !== vendor.personalEmiratesIdNumber) {
                updatePayload.personalEmiratesIdNumber = data.personalEmiratesIdNumber;
            }
        } else {
            // International vendor fields
            if (data.businessLicenseCopy !== vendor.businessLicenseCopy) {
                updatePayload.businessLicenseCopy = data.businessLicenseCopy;
            }
            if (data.passportOrIdCopy !== vendor.passportOrIdCopy) {
                updatePayload.passportOrIdCopy = data.passportOrIdCopy;
            }
        }

        // Check if there are any changes
        if (Object.keys(updatePayload).length === 0) {
            toast.info("No changes detected");
            setIsSubmitting(false);
            return;
        }

        const result = await updateVendorDocumentsAction(vendor._id, updatePayload);

        if (result.success) {
            toast.success(result.message);
            onUpdate(result.data);
            onClose();
        } else {
            toast.error(result.message);
        }

        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-b-gray-400 pb-4">
                    <DialogTitle className="flex items-center gap-2 uppercase !text-xl">
                        <FileText className="w-6 h-6 text-indigo-600" />
                        Edit Documents
                    </DialogTitle>
                    <DialogDescription>
                        Update vendor verification documents and identification numbers
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {!vendor.isInternational ? (
                        <>
                            {/* UAE Vendor Documents */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tradeLicenseNumber" className="text-sm font-semibold">
                                        Trade License Number
                                    </Label>
                                    <Input
                                        id="tradeLicenseNumber"
                                        value={watch('tradeLicenseNumber')}
                                        onChange={(e) => setValue('tradeLicenseNumber', e.target.value)}
                                        placeholder="Enter trade license number"
                                        disabled={isSubmitting}
                                    />
                                    {errors.tradeLicenseNumber && (
                                        <p className="text-red-500 text-sm">{errors.tradeLicenseNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Trade License Copy
                                    </Label>
                                    <ControlledFileUpload
                                        control={control}
                                        name="tradeLicenseCopy"
                                        label="Upload Trade License"
                                        errors={errors}
                                        allowedMimeType={['application/pdf', 'image/jpeg', 'image/png']}
                                        folderPath="vendors/documents/trade-license"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="personalEmiratesIdNumber" className="text-sm font-semibold">
                                        Emirates ID Number
                                    </Label>
                                    <Input
                                        id="personalEmiratesIdNumber"
                                        value={watch('personalEmiratesIdNumber')}
                                        onChange={(e) => setValue('personalEmiratesIdNumber', e.target.value)}
                                        placeholder="Enter Emirates ID number"
                                        disabled={isSubmitting}
                                    />
                                    {errors.personalEmiratesIdNumber && (
                                        <p className="text-red-500 text-sm">{errors.personalEmiratesIdNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Emirates ID Copy
                                    </Label>
                                    <ControlledFileUpload
                                        control={control}
                                        name="emiratesIdCopy"
                                        label="Upload Emirates ID"
                                        errors={errors}
                                        allowedMimeType={['application/pdf', 'image/jpeg', 'image/png']}
                                        folderPath="vendors/documents/emirates-id"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* International Vendor Documents */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Business License Copy
                                    </Label>
                                    <ControlledFileUpload
                                        control={control}
                                        name="businessLicenseCopy"
                                        label="Upload Business License"
                                        errors={errors}
                                        allowedMimeType={['application/pdf', 'image/jpeg', 'image/png']}
                                        folderPath="vendors/documents/business-license"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Passport/ID Copy
                                    </Label>
                                    <ControlledFileUpload
                                        control={control}
                                        name="passportOrIdCopy"
                                        label="Upload Passport/ID"
                                        errors={errors}
                                        allowedMimeType={['application/pdf', 'image/jpeg', 'image/png']}
                                        folderPath="vendors/documents/passport-id"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Update Documents'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};