"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, FileText, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addAdditionalDocumentAction, deleteAdditionalDocumentAction } from "@/app/actions/admin/vendors";
import { toast } from "sonner";
import Link from "next/link";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";

export default function AdditionalDocumentsSection({ vendorId, documents = [], onUpdate }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            documentName: "",
            documentUrl: "",
        },
    });

    const onSubmit = async (data) => {
        if (!data.documentUrl) {
            toast.error("Please upload a document file");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Adding document...");

        try {
            const res = await addAdditionalDocumentAction(vendorId, {
                documentName: data.documentName,
                documentUrl: data.documentUrl
            });

            if (res.success) {
                toast.success("Document added successfully");
                reset();
                if (onUpdate) onUpdate(res.data);
            } else {
                toast.error(res.message || "Failed to add document");
            }
        } catch (error) {
            console.error("Error adding document:", error);
            toast.error("Failed to add document");
        } finally {
            toast.dismiss(loadingToast);
            setIsSubmitting(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const result = await deleteAdditionalDocumentAction(vendorId, documentId);
            if (result.success) {
                toast.success("Document deleted successfully");
                if (onUpdate) onUpdate(result.data);
            } else {
                toast.error(result.message || "Failed to delete document");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <Card className="w-full border-0 shadow-none p-0">
            <CardHeader className="px-0 pb-0">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="w-4 h-4" />
                    Additional Documents ({documents.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">

                {/* Documents List */}
                {documents.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                        No additional documents uploaded yet.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {doc.documentName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link
                                            href={doc.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeleteDocument(doc._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Document Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                        <Label htmlFor="documentName">
                            Document Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="documentName"
                            placeholder="e.g., Insurance Certificate, Permit Copy"
                            {...register("documentName", {
                                required: "Document name is required",
                            })}
                            disabled={isSubmitting}
                            className="bg-white"
                        />
                        {errors.documentName && (
                            <p className="text-red-500 text-sm">{errors.documentName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Document File <span className="text-red-500">*</span>
                        </Label>
                        <ControlledFileUpload
                            control={control}
                            name="documentUrl"
                            label="Upload Document"
                            errors={errors}
                            allowedMimeType={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            folderPath={`vendors/${vendorId}/documents`}
                            role="admin"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="sm"
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Add Document
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}