"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { updateVendorDocumentsAction } from "@/app/actions/admin/vendors";
import { toast } from "sonner";

export default function VerificationDocumentsEditor({ vendor, onSuccess, onCancel }) {
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            tradeLicenseNumber: vendor.tradeLicenseNumber || "",
            tradeLicenseCopy: vendor.tradeLicenseCopy || "",
            personalEmiratesIdNumber: vendor.personalEmiratesIdNumber || "",
            emiratesIdCopy: vendor.emiratesIdCopy || "",
            businessLicenseCopy: vendor.businessLicenseCopy || "",
            passportOrIdCopy: vendor.passportOrIdCopy || "",
        },
    });

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Filter data based on vendor type to avoid validation errors
            const filteredData = { ...data };

            if (vendor.isInternational) {
                // Remove UAE fields
                delete filteredData.tradeLicenseNumber;
                delete filteredData.tradeLicenseCopy;
                delete filteredData.personalEmiratesIdNumber;
                delete filteredData.emiratesIdCopy;
            } else {
                // Remove International fields
                delete filteredData.businessLicenseCopy;
                delete filteredData.passportOrIdCopy;
            }

            const result = await updateVendorDocumentsAction(vendor._id, filteredData);
            if (result.success) {
                toast.success("Documents updated successfully");
                if (onSuccess) onSuccess(result.data);
            } else {
                toast.error(result.message || "Failed to update documents");
            }
        } catch (error) {
            console.error("Error updating documents:", error);
            toast.error("An error occurred while updating documents");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {!vendor.isInternational ? (
                <>
                    {/* UAE Vendor Documents */}
                    <div className="space-y-2">
                        <Label htmlFor="tradeLicenseNumber">
                            Trade License Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="tradeLicenseNumber"
                            {...register("tradeLicenseNumber", {
                                required: "Trade License Number is required",
                            })}
                            placeholder="Enter trade license number"
                            className="bg-white"
                        />
                        {errors.tradeLicenseNumber && (
                            <p className="text-red-500 text-sm">{errors.tradeLicenseNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Trade License Copy <span className="text-red-500">*</span>
                        </Label>
                        <ControlledFileUpload
                            control={control}
                            name="tradeLicenseCopy"
                            label="Upload Trade License"
                            errors={errors}
                            allowedMimeType={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            folderPath={`vendors/${vendor._id}/documents`}
                            role="admin"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="personalEmiratesIdNumber">
                            Emirates ID Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="personalEmiratesIdNumber"
                            {...register("personalEmiratesIdNumber", {
                                required: "Emirates ID Number is required",
                            })}
                            placeholder="784-XXXX-XXXXXXX-X"
                            className="bg-white"
                        />
                        {errors.personalEmiratesIdNumber && (
                            <p className="text-red-500 text-sm">{errors.personalEmiratesIdNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Emirates ID Copy <span className="text-red-500">*</span>
                        </Label>
                        <ControlledFileUpload
                            control={control}
                            name="emiratesIdCopy"
                            label="Upload Emirates ID"
                            errors={errors}
                            allowedMimeType={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            folderPath={`vendors/${vendor._id}/documents`}
                            role="admin"
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* International Vendor Documents */}
                    <div className="space-y-2">
                        <Label>
                            Business License Copy <span className="text-red-500">*</span>
                        </Label>
                        <ControlledFileUpload
                            control={control}
                            name="businessLicenseCopy"
                            label="Upload Business License"
                            errors={errors}
                            allowedMimeType={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            folderPath={`vendors/${vendor._id}/documents`}
                            role="admin"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Passport/ID Copy <span className="text-red-500">*</span>
                        </Label>
                        <ControlledFileUpload
                            control={control}
                            name="passportOrIdCopy"
                            label="Upload Passport/ID"
                            errors={errors}
                            allowedMimeType={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            folderPath={`vendors/${vendor._id}/documents`}
                            role="admin"
                        />
                    </div>
                </>
            )}

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Documents
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
