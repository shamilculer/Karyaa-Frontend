import { useState } from 'react';
import { getPresignedUrl } from '@/app/actions/s3-upload';

export function useS3Upload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = async (file, { role = 'user', folder = 'uploads', isPublic = false } = {}) => {
        if (!file) return null;

        setUploading(true);
        setError(null);

        try {
            // 1. Get pre-signed URL
            const { signedUrl, key, error: urlError, url } = await getPresignedUrl({
                fileType: file.type,
                fileSize: file.size,
                role,
                folder,
                isPublic
            });

            if (urlError) {
                throw new Error(urlError);
            }

            // 2. Upload to S3
            const response = await fetch(signedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upload file to S3');
            }

            // Use the URL returned from server action or construct it
            const publicUrl = url || signedUrl.split('?')[0];

            // Return URL with upload timestamp for expiration checking
            return {
                key,
                url: publicUrl,
                uploadedAt: Date.now() // Store upload timestamp
            };

        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.message || "Upload failed");
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, error };
}
