"use client"

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { CldUploadWidget } from 'next-cloudinary';

export default function ControlledFileUpload({ 
    control, 
    name, 
    label, 
    errors, 
    allowedMimeType,
    folderPath, // Used to set the destination folder in Cloudinary
}) {

    const [isUploading, setIsUploading] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <div className="space-y-2">
                    
                    {/* Display current status and removal button */}
                    {value && !isUploading ? (
                        <p className="text-sm text-green-600 truncate p-2 border border-green-200 rounded-lg bg-green-50 flex justify-between items-center">
                            ✅ File uploaded: <span className="font-medium">{value.substring(value.lastIndexOf('/') + 1)}</span> 
                            <button 
                                type="button" 
                                onClick={() => onChange('')} // Clear the RHF value
                                className="ml-2 text-red-500 hover:text-red-700 text-xs underline font-normal"
                            >
                                Remove
                            </button>
                        </p>
                    ) : (
                        // CldUploadWidget replaces the file input and custom upload button
                        <CldUploadWidget
                            // NOTE: Replace 'your_upload_preset' with the actual preset name configured in Cloudinary
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            options={{
                                sources: ['local'],
                                multiple: false,
                                maxFileSize: 10485760, // 10MB in bytes
                                acceptedMimeTypes: allowedMimeType,
                                // Use the folderPath (e.g., 'temp_vendors/TOKEN') for organization
                                folder: folderPath, 
                            }}
                            onSuccess={(result) => {
                                // Check if result and result.info exist and is an object
                                if (typeof result.info !== 'object') return;
                                
                                // Update RHF with the secure URL upon success
                                onChange(result.info.secure_url);
                                setIsUploading(false);
                            }}
                            onUploadAdded={() => setIsUploading(true)}
                            onError={() => setIsUploading(false)}
                            onClose={() => setIsUploading(false)}
                        >
                            {({ open }) => {
                                return (
                                    <button 
                                        type="button" 
                                        onClick={() => open()} 
                                        disabled={isUploading || !!value}
                                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 bg-[#f0f0f0] hover:bg-gray-100 disabled:opacity-50 transition duration-150 flex items-center justify-center space-x-2"
                                    >
                                        {isUploading ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.293 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>{value ? 'Change File' : label}</span>
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
}