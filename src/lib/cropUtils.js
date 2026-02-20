/**
 * Create an image element from a file
 * @param {File} file - The image file
 * @returns {Promise<HTMLImageElement>}
 */
export const createImage = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/**
 * Get cropped image blob from crop area
 * @param {string} imageSrc - The source image URL
 * @param {Object} pixelCrop - The crop area in pixels (relative to displayed rotated image)
 * @param {number} rotation - Rotation in degrees (default: 0)
 * @param {Object} flip - Flip settings { horizontal: boolean, vertical: boolean }
 * @returns {Promise<Blob>}
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }, zoom = 1) {
    try {
        console.log('getCroppedImg called with:', { pixelCrop, rotation, flip, zoom });

        const image = await createImageFromUrl(imageSrc);
        console.log('Original image loaded:', { width: image.width, height: image.height });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const rotRad = (rotation * Math.PI) / 180;

        // Calculate bounding box of the rotated image at natural size
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        // Canvas is at natural rotated size — zoom is baked into pixelCrop by the caller
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // Apply rotation and flip (no zoom here)
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
        ctx.translate(-image.width / 2, -image.height / 2);

        // Draw image at natural size
        ctx.drawImage(image, 0, 0);

        // Create cropped canvas
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');

        if (!croppedCtx) {
            throw new Error('No 2d context for cropped canvas');
        }

        croppedCanvas.width = pixelCrop.width;
        croppedCanvas.height = pixelCrop.height;

        console.log('Cropping from rotated canvas:', {
            sourceX: pixelCrop.x,
            sourceY: pixelCrop.y,
            sourceWidth: pixelCrop.width,
            sourceHeight: pixelCrop.height,
            canvasSize: { width: bBoxWidth, height: bBoxHeight }
        });

        // Draw the cropped portion from the rotated canvas
        croppedCtx.drawImage(
            canvas,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // Return as blob
        return new Promise((resolve, reject) => {
            croppedCanvas.toBlob((blob) => {
                if (blob) {
                    console.log('Crop successful, blob size:', blob.size);
                    resolve(blob);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg', 0.95);
        });
    } catch (error) {
        console.error('Error in getCroppedImg:', error);
        throw error;
    }
}

function rotateSize(width, height, rotation) {
    const rotRad = (rotation * Math.PI) / 180;

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * Create image element from URL
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
const createImageFromUrl = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        // Required when using images from a different origin with CORS enabled
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });

/**
 * Get rotation value in degrees
 * @param {File} file - Image file
 * @returns {Promise<number>}
 */
export const getRotationFromFile = async (file) => {
    // This is a placeholder - you can add EXIF orientation reading here if needed
    return 0;
};

/**
 * Convert blob to file
 * @param {Blob} blob - The blob to convert
 * @param {string} fileName - The desired file name
 * @returns {File}
 */
export const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
    });
};