'use client';

import { useState } from 'react';
import { useS3Upload } from '@/hooks/useS3Upload';

export default function TestUploadPage() {
    const [file, setFile] = useState(null);
    const { uploadFile, uploading, error } = useS3Upload();
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [folder, setFolder] = useState('uploads');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const result = await uploadFile(file, { folder, isPublic });
        if (result) {
            console.log("Upload successful:", result);
            setUploadedUrl(result.url);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Test S3 Upload</h1>

            <div className="mb-4 space-y-2">
                <label className="block">
                    <span className="text-gray-700">Folder:</span>
                    <input
                        type="text"
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                        className="ml-2 border p-1 rounded"
                    />
                </label>
                <label className="block">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="mr-2"
                    />
                    Public Upload (Unauthenticated)
                </label>
            </div>

            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 block"
            />

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {error && (
                <p className="text-red-500 mt-4">Error: {error}</p>
            )}

            {uploadedUrl && (
                <div className="mt-4">
                    <p className="text-green-600">Upload Successful!</p>
                    <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View File
                    </a>
                    <br />
                    <img src={uploadedUrl} alt="Uploaded" className="mt-2 max-w-xs border rounded" />
                </div>
            )}
        </div>
    );
}
