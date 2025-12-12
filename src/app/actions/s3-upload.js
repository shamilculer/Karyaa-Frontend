"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
