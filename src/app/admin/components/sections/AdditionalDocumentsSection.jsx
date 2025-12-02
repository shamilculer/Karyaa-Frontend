"use client";

import { useState, useRef } from "react";
import { Trash2, FileText, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addAdditionalDocumentAction, deleteAdditionalDocumentAction } from "@/app/actions/admin/vendors";
import { toast } from "sonner";
import Link from "next/link";
import { useS3Upload } from "@/hooks/useS3Upload";

export default function AdditionalDocumentsSection({ vendorId, documents = [], onUpdate }) {
    const [documentName, setDocumentName] = useState("");
    const fileInputRef = useRef(null);
    const { uploadFile, uploading } = useS3Upload();
    const [localUploading, setLocalUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const trimmedName = documentName.trim();
        if (!trimmedName) {
            toast.error("Please enter a document name first");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setLocalUploading(true);
        const loadingToast = toast.loading("Uploading document...");

        try {
            // Upload to S3
            const result = await uploadFile(file, {
                folder: `vendors/${vendorId}/documents`,
                isPublic: true
            });

            if (!result?.url) {
                throw new Error("Failed to get upload URL");
            }

            // Save to database
            const res = await addAdditionalDocumentAction(vendorId, {
                documentName: trimmedName,
                documentUrl: result.url
            });

            if (res.success) {
                toast.success("Document added successfully");
                setDocumentName("");
                if (onUpdate) onUpdate(res.data);
            } else {
                toast.error(res.message || "Failed to add document");
            }
        } catch (error) {
            console.error("Error adding document:", error);
            toast.error("Failed to upload document");
        } finally {
            toast.dismiss(loadingToast);
            setLocalUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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

    const handleUploadClick = () => {
        const trimmedName = documentName.trim();
        if (!trimmedName) {
            toast.error("Please enter a document name first");
            return;
        }
        fileInputRef.current?.click();
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
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Document Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., Insurance Certificate, Permit Copy"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            disabled={localUploading || uploading}
                            className="bg-white"
                        />
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={localUploading || uploading}
                    />

                    <Button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={localUploading || uploading}
                        size="sm"
                        className="w-full"
                    >
                        {localUploading || uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}