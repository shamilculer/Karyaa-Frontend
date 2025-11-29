"use client";

import { useState, useRef } from "react";
import { Trash2, FileText, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addAdditionalDocumentAction, deleteAdditionalDocumentAction } from "@/app/actions/admin/vendors";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";

export default function AdditionalDocumentsSection({ vendorId, documents = [], onUpdate }) {
    const [documentName, setDocumentName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const currentDocumentNameRef = useRef("");

    const handleUploadSuccess = async (result) => {
        console.log("Upload result:", result); // Debug log

        // Extract URL from Cloudinary result
        const documentUrl = result?.info?.secure_url || result?.info?.url;
        const capturedDocumentName = currentDocumentNameRef.current;

        console.log("Document URL:", documentUrl); // Debug log
        console.log("Document Name (from ref):", capturedDocumentName); // Debug log

        if (!documentUrl) {
            toast.error("Failed to get document URL from upload");
            setIsUploading(false);
            return;
        }

        if (!capturedDocumentName) {
            toast.error("Document name is missing");
            setIsUploading(false);
            return;
        }

        try {
            const res = await addAdditionalDocumentAction(vendorId, {
                documentName: capturedDocumentName,
                documentUrl
            });

            if (res.success) {
                toast.success("Document added successfully");
                setDocumentName("");
                currentDocumentNameRef.current = "";
                if (onUpdate) onUpdate(res.data);
            } else {
                toast.error(res.message || "Failed to add document");
            }
        } catch (error) {
            console.error("Error adding document:", error); // Debug log
            toast.error("An error occurred");
        } finally {
            setIsUploading(false);
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

    const handleUploadClick = (openWidget) => {
        const trimmedName = documentName.trim();
        console.log("Document name:", trimmedName); // Debug log
        if (!trimmedName) {
            toast.error("Please enter a document name first");
            return;
        }
        // Store the document name in ref so it's available in the upload callback
        currentDocumentNameRef.current = trimmedName;
        setIsUploading(true);
        openWidget();
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
                            disabled={isUploading}
                            className="bg-white"
                        />
                    </div>
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        onSuccess={handleUploadSuccess}
                        options={{
                            maxFiles: 1,
                            resourceType: "auto",
                            folder: "vendor_additional_documents",
                        }}
                        onClose={() => setIsUploading(false)}
                    >
                        {({ open }) => (
                            <Button
                                type="button"
                                onClick={() => handleUploadClick(open)}
                                disabled={isUploading}
                                size="sm"
                                className="w-full"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {isUploading ? "Uploading..." : "Upload Document"}
                            </Button>
                        )}
                    </CldUploadWidget>
                </div>
            </CardContent>
        </Card>
    );
}