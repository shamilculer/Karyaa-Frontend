"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { checkAuthStatus } from "@/app/actions/user/user";

// Lazy initialization of S3 Client to prevent module-level crashes if env vars are missing
let s3Client = null;

function getS3Client() {
    if (!s3Client) {
        const accessKeyId = process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;
        const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error("AWS credentials are not fully configured in environment variables.");
        }

        s3Client = new S3Client({
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
    }
    return s3Client;
}

// Max file sizes (in bytes)
const MAX_FILE_SIZES = {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    default: 20 * 1024 * 1024, // 20MB (Increased default for videos)
};

export async function getPresignedUrl({
    fileType,
    fileSize,
    role = "user",
    folder = "uploads",
    isPublic = false,
}) {
    try {
        // 1. Authentication Check
        if (!isPublic) {
            const authResult = await checkAuthStatus(role);
            if (!authResult.isAuthenticated) {
                return {
                    error: "Unauthorized: You must be logged in to upload files.",
                };
            }
        } else {
            // SECURITY: Public folder restriction
            const allowedPublicPrefixes = ["temp_", "public_"];
            const isAllowedFolder = allowedPublicPrefixes.some((prefix) =>
                folder.startsWith(prefix)
            );

            if (!isAllowedFolder) {
                return {
                    error:
                        "Unauthorized: Public uploads are only allowed in temporary or public folders.",
                };
            }
        }

        // 2. Validation
        if (!fileType) {
            return { error: "File type is required" };
        }

        // Determine max size
        const isImage = fileType.startsWith("image/");
        const maxSize = isImage ? MAX_FILE_SIZES.image : MAX_FILE_SIZES.default;

        if (fileSize > maxSize) {
            return {
                error: `File size too large. Max size is ${maxSize / (1024 * 1024)}MB`,
            };
        }

        // 3. Generate Key
        const fileExtension = fileType.split("/")[1];
        const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
        const key = `${cleanFolder}/${nanoid()}.${fileExtension}`;

        // 4. Get Client and Command
        const client = getS3Client();

        // Check bucket
        if (!process.env.AWS_BUCKET_NAME) {
            throw new Error("AWS_BUCKET_NAME is not defined");
        }

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
        const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return { signedUrl, key, url: publicUrl };
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return { error: error.message || "Failed to generate signed URL" };
    }
}

/**
 * Derive the S3 object key from a full S3 URL.
 * Handles URLs in the format:
 *   https://<bucket>.s3.<region>.amazonaws.com/<key>
 */
function getKeyFromUrl(url) {
    if (!url || typeof url !== "string") return null;
    try {
        const parsed = new URL(url);
        // pathname starts with '/', strip it
        return parsed.pathname.replace(/^\//, "");
    } catch {
        return null;
    }
}

/**
 * Delete one or more S3 objects by their full URLs.
 * Called at save time by MediaKit/StoryPage editors to clean up
 * images/videos that were removed in the current editing session.
 *
 * @param {string[]} urls - Array of full S3 object URLs to delete.
 * @param {string} role   - Auth role required ("admin" by default).
 */
export async function deleteS3FilesAction(urls, role = "admin") {
    if (!Array.isArray(urls) || urls.length === 0) {
        return { success: true, deleted: 0 };
    }

    // Auth check
    const authResult = await checkAuthStatus(role);
    if (!authResult.isAuthenticated) {
        return { success: false, error: "Unauthorized" };
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
        return { success: false, error: "AWS_BUCKET_NAME is not defined" };
    }

    const client = getS3Client();
    let deleted = 0;

    for (const url of urls) {
        if (!url) continue;
        const key = getKeyFromUrl(url);
        if (!key) {
            console.warn("deleteS3FilesAction: could not derive key from URL:", url);
            continue;
        }
        try {
            await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
            deleted++;
        } catch (err) {
            // Best-effort: log but don't block the save
            console.error(`deleteS3FilesAction: failed to delete key "${key}":`, err);
        }
    }

    return { success: true, deleted };
}
