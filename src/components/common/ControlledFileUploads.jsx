"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useS3Upload } from '@/hooks/useS3Upload';
import { Loader2, X, UploadCloud, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import ImageCropModal from './ImageCropModal';

export default function ControlledFileUpload({
    control,
    name,
    label,
    errors,
    allowedMimeType,
    folderPath,
    multiple = false,
    onSuccess,
    isPublic = false,
    role = 'user',
    enableCrop = true,
    aspectRatio = null,
    customTrigger, // New prop for custom UI
    value,
    onChange,
    rules, // Validation rules
}) {
    const { uploadFile, uploading, error: uploadError } = useS3Upload();
    const fileInputRef = useRef(null);
    const [localUploading, setLocalUploading] = useState(false);

    // Crop state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImages, setCropImages] = useState([]); // [{ id, src, file }] for batch modal

    // Pending state to pass to handlers
    const [pendingOnChange, setPendingOnChange] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const isImageFile = (file) => {
        return file && file.type.startsWith('image/');
    };

    const isImageUrl = (url) => {
        if (!url) return false;
        try {
            const extension = url.split('.').pop().toLowerCase().split('?')[0];
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
        } catch (e) {
            return false;
        }
    };

    const handleFileChange = async (e, onChange, value) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        await processFiles(files, onChange);
    };

    const handleDrop = async (e, onChange, value) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;
        await processFiles(files, onChange);
    };

    const processFiles = async (files, onChange) => {
        const imagesToCrop = [];
        const filesToUploadDirectly = [];

        // Distribute files
        for (const file of files) {
            if (enableCrop && isImageFile(file)) {
                // Read file for crop
                const readerResult = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                imagesToCrop.push({
                    id: Math.random().toString(36).substr(2, 9),
                    src: readerResult,
                    file: file
                });
            } else {
                filesToUploadDirectly.push(file);
            }
        }

        // Store active onChange to use later
        setPendingOnChange(() => onChange);
        if (filesToUploadDirectly.length > 0) {
            // We iterate to upload
            for (const file of filesToUploadDirectly) {
                await uploadOneFile(file, onChange);
            }
        }

        // 2. Open batch crop modal if images exist
        if (imagesToCrop.length > 0) {
            setCropImages(imagesToCrop);
            setCropModalOpen(true);
        }
    };

    const handleBatchCropComplete = async (processedFiles) => {
        setCropModalOpen(false);
        setCropImages([]);

        if (!processedFiles || processedFiles.length === 0) {
            return;
        }

        const uploadedUrls = [];

        // Upload sequentially to avoid race conditions
        for (let i = 0; i < processedFiles.length; i++) {
            const file = processedFiles[i];

            // We pass 'null' as onChange because we want manually handle the update after ALL uploads
            const url = await uploadOneFile(file, null, true); // true = return URL only
            if (url) {
                uploadedUrls.push(url);
            }
        }

        if (uploadedUrls.length > 0) {
            // Update the form Value ONCE with all new URLs
            if (multiple) {
                // Get current value
                let currentData = [];
                if (control && control.getValues) {
                    currentData = control.getValues(name) || [];
                } else if (value) {
                    currentData = value;
                }

                const currentArray = Array.isArray(currentData) ? currentData : (currentData ? [currentData] : []);
                const finalValue = [...currentArray, ...uploadedUrls];

                if (pendingOnChange) pendingOnChange(finalValue);
                if (onSuccess) onSuccess(finalValue);

            } else {
                // Single file mode
                const lastUrl = uploadedUrls[uploadedUrls.length - 1];
                if (pendingOnChange) pendingOnChange(lastUrl);
                if (onSuccess) onSuccess(lastUrl);
            }
        }
    };

    // Updated signature to support "return URL only" mode
    const uploadOneFile = async (file, onChange, returnUrlOnly = false) => {
        if (!file) return null;
        setLocalUploading(true);

        try {
            if (allowedMimeType && !allowedMimeType.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}`);
                return;
            }

            const result = await uploadFile(file, {
                folder: folderPath,
                isPublic: isPublic,
                role: role
            });


            if (result?.url) {
                if (returnUrlOnly) {
                    return result.url;
                }

                // Determine current value to append to
                let currentData = null;

                // If we are in RHF mode, try getting fresher value
                if (control && control.getValues) {
                    currentData = control.getValues(name);
                }
                if (multiple) {
                    // Get fresh data
                    if (control && control.getValues) {
                        currentData = control.getValues(name);
                    } else {
                        currentData = []; // Or value if provided?
                    }

                    const currentArray = Array.isArray(currentData) ? currentData : (currentData ? [currentData] : []);
                    const newValue = [...currentArray, result.url];
                    if (onChange) onChange(newValue);
                    if (onSuccess) onSuccess(newValue);

                } else {
                    if (onChange) onChange(result.url);
                    if (onSuccess) onSuccess(result.url);
                }
                toast.success('File uploaded');
                return result.url;
            }

        } catch (err) {
            console.error("Upload error:", err);
            toast.error('Failed to upload file');
        } finally {
            setLocalUploading(false);
        }
    };

    const handleRemove = (itemToRemove, onChange, value) => {
        if (multiple) {
            const newValue = value.filter(item => item !== itemToRemove);
            onChange(newValue);
        } else {
            onChange(null);
        }
    };

    const renderUploadUI = ({ onChange, value }) => (
        <div className="space-y-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={allowedMimeType?.join(',')}
                multiple={multiple}
                onChange={(e) => handleFileChange(e, onChange, value)}
                disabled={localUploading || uploading}
            />

            {/* Compact Dropzone */}
            {customTrigger ? (
                <div>
                    {customTrigger({ onClick: () => fileInputRef.current?.click(), disabled: localUploading || uploading, uploading: localUploading || uploading })}
                </div>
            ) : (
                <div
                    onClick={() => !localUploading && !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={(e) => handleDrop(e, onChange, value)}
                    className={`
                        relative group overflow-hidden
                        border-1 border-blue-50 bg-blue-50 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer
                        flex items-center gap-4 hover:bg-muted/50
                        ${isDragging ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-muted-foreground/25 hover:border-primary/50'}
                        ${(localUploading || uploading) ? 'opacity-50 cursor-not-allowed' : ''}
                        ${errors && errors[name] ? 'border-destructive bg-destructive/5' : ''}
                    `}
                >
                    {(localUploading || uploading) ? (
                        <>
                            <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="!text-sm font-medium">Uploading...</p>
                                <p className="!text-xs text-muted-foreground">Please wait while we process your file</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`
                                h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors
                                ${isDragging ? 'bg-primary text-white' : 'bg-white text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                            `}>
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5 flex-1 min-w-0">
                                <p className="!text-sm font-medium truncate">
                                    {label || "Upload File"}
                                </p>
                                <p className="!text-xs text-muted-foreground truncate">
                                    Drag & drop or click • {allowedMimeType?.map(t => t.split('/')[1].toUpperCase()).join(', ')}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Error Message */}
            {errors && errors[name] && (
                <p className="text-xs font-medium text-destructive mt-1.5 ml-1">{errors[name].message}</p>
            )}

            {/* Enhanced Preview Area */}
            {!customTrigger && value && (
                <div className={`grid gap-4 mt-4 ${multiple ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 max-w-[240px]'}`}>
                    {Array.isArray(value) ? (
                        value.map((url, index) => (
                            <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border bg-background shadow-sm hover:shadow-md transition-all">
                                {isImageUrl(url) ? (
                                    <img src={url} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 p-4">
                                        <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-xs text-muted-foreground text-center truncate w-full px-2">
                                            {url.split('/').pop().split('?')[0]}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(url, onChange, value);
                                        }}
                                        className="h-8 w-8 rounded-full bg-white/90 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        value && typeof value === 'string' && (
                            <div className="group relative aspect-video rounded-xl overflow-hidden border bg-gray-200 shadow-sm hover:shadow-md transition-all">
                                {isImageUrl(value) ? (
                                    <img src={value} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 p-4">
                                        <FileText className="w-10 h-10 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground text-center truncate w-full px-4">
                                            {value.split('/').pop().split('?')[0]}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(value, onChange, value);
                                        }}
                                        className="h-9 w-9 rounded-full bg-white/90 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* Batch Crop Modal */}
            <ImageCropModal
                open={cropModalOpen}
                onClose={() => {
                    setCropModalOpen(false);
                    setCropImages([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                images={cropImages}
                onCropComplete={handleBatchCropComplete}
                onRemoveImage={(id) => {
                    setCropImages(prev => {
                        const newImages = prev.filter(img => img.id !== id);
                        if (newImages.length === 0) {
                            setCropModalOpen(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }
                        return newImages;
                    });
                }}
                defaultAspectRatio={aspectRatio}
            />
        </div>
    );

    if (control) {
        return (
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, value } }) => renderUploadUI({ onChange, value })}
            />
        );
    }

    return renderUploadUI({ onChange, value });
}