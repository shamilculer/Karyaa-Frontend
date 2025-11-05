"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { CldUploadWidget } from 'next-cloudinary';

export default function ControlledFileUpload({ 
    control, 
    name, 
    label, 
    errors, 
    allowedMimeType,
    folderPath,
    multiple = false,
    onSuccess,
}) {

    const [isUploading, setIsUploading] = useState(false);
    const [widgetReady, setWidgetReady] = useState(false);
    const uploadedFilesRef = useRef([]);

    // Helper function to reset body overflow
    const resetBodyOverflow = () => {
        document.body.style.overflow = '';
        document.body.style.removeProperty('overflow');
    };

    // Ensure widget is ready before rendering
    useEffect(() => {
        setWidgetReady(true);
    }, []);

    if (!widgetReady) {
        return (
            <div className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 bg-[#f0f0f0] flex items-center justify-center">
                <span className="text-sm">Loading uploader...</span>
            </div>
        );
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <div className="space-y-2">
                    
                    {/* Single File Mode - Show uploaded file info */}
                    {!multiple && value && !isUploading ? (
                        <p className="!text-xs text-green-600 truncate p-2 border border-green-200 rounded-lg bg-green-50 flex justify-between items-center">
                            ✅ File uploaded: <span className="font-medium max-md:!text-[0px]">{value.substring(value.lastIndexOf('/') + 1)}</span> 
                            <button 
                                type="button" 
                                onClick={() => onChange('')}
                                className="ml-2 text-red-500 hover:text-red-700 text-xs underline font-normal"
                            >
                                Remove
                            </button>
                        </p>
                    ) : (
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            options={{
                                sources: ['local'],
                                multiple: multiple,
                                maxFileSize: 10485760,
                                clientAllowedFormats: allowedMimeType?.map(type => type.split('/')[1]),
                                folder: folderPath,
                                resourceType: 'auto'
                            }}
                            onOpen={() => {
                                console.log('Widget opened');
                            }}
                            onSuccess={(result) => {
                                if (typeof result.info !== 'object') return;
                                
                                const uploadedUrl = result.info.secure_url;
                                
                                if (multiple) {
                                    uploadedFilesRef.current.push(uploadedUrl);
                                } else {
                                    onChange(uploadedUrl);
                                    setIsUploading(false);
                                }
                                
                                setTimeout(() => {
                                    resetBodyOverflow();
                                }, 100);
                            }}
                            onQueuesEnd={(result, { widget }) => {
                                if (multiple && uploadedFilesRef.current.length > 0) {
                                    uploadedFilesRef.current.forEach(url => {
                                        if (onSuccess) {
                                            onSuccess(url);
                                        }
                                    });
                                    uploadedFilesRef.current = [];
                                }
                                
                                setIsUploading(false);
                                
                                setTimeout(() => {
                                    resetBodyOverflow();
                                }, 100);
                            }}
                            onUploadAdded={() => {
                                setIsUploading(true);
                            }}
                            onError={(error) => {
                                console.error('Upload error:', error);
                                setIsUploading(false);
                                uploadedFilesRef.current = [];
                                setTimeout(() => {
                                    resetBodyOverflow();
                                }, 100);
                            }}
                            onClose={() => {
                                if (multiple && uploadedFilesRef.current.length > 0) {
                                    uploadedFilesRef.current.forEach(url => {
                                        if (onSuccess) {
                                            onSuccess(url);
                                        }
                                    });
                                    uploadedFilesRef.current = [];
                                }
                                
                                setIsUploading(false);
                                setTimeout(() => {
                                    resetBodyOverflow();
                                }, 100);
                            }}
                        >
                            {({ open, isLoading }) => {
                                // Add safety check
                                const handleClick = () => {
                                    if (open && typeof open === 'function') {
                                        open();
                                    } else {
                                        console.error('Upload widget not ready');
                                    }
                                };

                                return (
                                    <button 
                                        type="button" 
                                        onClick={handleClick} 
                                        disabled={isUploading || isLoading || (!multiple && !!value)}
                                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 bg-[#f0f0f0] hover:bg-gray-100 disabled:opacity-50 transition duration-150 flex items-center justify-center space-x-2"
                                    >
                                        {isUploading || isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.293 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>
                                                    {!multiple && value ? 'Change File' : label}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                );
                            }}
                        </CldUploadWidget>
                    )}
                    
                    {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
                </div>
            )}
        />
    );
};