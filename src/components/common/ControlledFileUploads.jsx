"use client"

import React, { useState, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useS3Upload } from '@/hooks/useS3Upload';
import { Loader2, X, UploadCloud } from 'lucide-react';

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
}) {
    const { uploadFile, uploading, error: uploadError } = useS3Upload();
    const fileInputRef = useRef(null);
    const [localUploading, setLocalUploading] = useState(false);

    const handleFileChange = async (e, onChange, value) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setLocalUploading(true);

        try {
            const uploadedUrls = [];

            for (const file of files) {
                if (allowedMimeType && !allowedMimeType.includes(file.type)) {
                    console.error(`Invalid file type: ${file.type}`);
                    continue;
                }

                const result = await uploadFile(file, {
                    folder: folderPath,
                    isPublic: isPublic,
                    role: role
                });

                if (result?.url) {
                    uploadedUrls.push(result.url);
                }
            }

            if (uploadedUrls.length > 0) {
                if (multiple) {
                    const currentData = Array.isArray(value) ? value : [];
                    const newValue = [...currentData, ...uploadedUrls];
                    onChange(newValue);
                    if (onSuccess) onSuccess(newValue);
                } else {
                    const url = uploadedUrls[0];
                    onChange(url);
                    if (onSuccess) onSuccess(url);
                }
            }
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setLocalUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => {
                return (
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

                        <div
                            onClick={() => !localUploading && !uploading && fileInputRef.current?.click()}
                            className={`
                                relative w-full py-4 border-2 border-dashed rounded-lg text-gray-600 bg-[#f0f0f0] 
                                flex flex-col items-center justify-center cursor-pointer transition-colors
                                ${localUploading || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:border-gray-400'}
                                ${errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                            `}
                        >
                            {localUploading || uploading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-sm font-medium">Uploading...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <UploadCloud className="h-6 w-6 text-gray-400" />
                                    <span className="text-sm font-medium">
                                        {(!multiple && value) ? 'Change File' : label || 'Click to upload'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {allowedMimeType ? allowedMimeType.map(t => t.split('/')[1].toUpperCase()).join(', ') : 'Any file'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {(errors[name] || uploadError) && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors[name]?.message || uploadError}
                            </p>
                        )}

                        {value && (
                            <div className="space-y-2 mt-2">
                                {multiple ? (
                                    Array.isArray(value) && value.map((url, index) => (
                                        <FileItem
                                            key={index}
                                            url={url}
                                            onRemove={() => handleRemove(url, onChange, value)}
                                        />
                                    ))
                                ) : (
                                    <FileItem
                                        url={value}
                                        onRemove={() => handleRemove(value, onChange, value)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
}

function FileItem({ url, onRemove }) {
    if (!url) return null;

    const fileName = url.split('/').pop();
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

    return (
        <div className="flex items-center justify-between p-2 border rounded-lg bg-white text-sm border-gray-200">
            <div className="flex items-center gap-2 overflow-hidden">
                {isImage ? (
                    <img src={url} alt="Preview" className="h-8 w-8 object-cover rounded" />
                ) : isVideo ? (
                    <video
                        src={url}
                        className="h-8 w-8 object-cover rounded bg-black"
                        muted
                        playsInline
                    />
                ) : (
                    <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                        FILE
                    </div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-blue-600">
                        {fileName}
                    </a>
                </div>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}