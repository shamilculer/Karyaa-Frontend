'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from 'nanoid';
import { checkAuthStatus } from "@/app/actions/user/user";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Max file sizes (in bytes)
const MAX_FILE_SIZES = {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    default: 10 * 1024 * 1024, // 10MB
};

export async function getPresignedUrl({ fileType, fileSize, role = 'user', folder = 'uploads', isPublic = false }) {
    // 1. Authentication Check
    // If isPublic is true, we skip the auth check (useful for registration)
    if (!isPublic) {
        const authResult = await checkAuthStatus(role);
        if (!authResult.isAuthenticated) {
            return { error: "Unauthorized: You must be logged in to upload files." };
        }
    } else {
        // SECURITY: If public, restrict to specific folders to prevent abuse
        const allowedPublicPrefixes = ['temp_', 'public_'];
        const isAllowedFolder = allowedPublicPrefixes.some(prefix => folder.startsWith(prefix));

        if (!isAllowedFolder) {
            return { error: "Unauthorized: Public uploads are only allowed in temporary or public folders." };
        }
    }

    // 2. Validation
    if (!fileType) {
        return { error: "File type is required" };
    }

    // Determine max size based on file type
    const isImage = fileType.startsWith('image/');
    const maxSize = isImage ? MAX_FILE_SIZES.image : MAX_FILE_SIZES.default;

    if (fileSize > maxSize) {
        return { error: `File size too large. Max size is ${maxSize / (1024 * 1024)}MB` };
    }

    // 3. Generate Key
    const fileExtension = fileType.split('/')[1];
    // Ensure folder doesn't have leading/trailing slashes to avoid double slashes
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const key = `${cleanFolder}/${nanoid()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        // ACL: 'public-read', // Optional: depending on your bucket settings
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        // Return the full public URL (assuming standard S3 URL format)
        // You might need to adjust this if using CloudFront or custom domain
        const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return { signedUrl, key, url: publicUrl };
    } catch (error) {
        console.error("Error generating signed URL", error);
        return { error: "Failed to generate signed URL" };
    }
}
