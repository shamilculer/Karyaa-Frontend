"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '@/lib/cropUtils';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

import { Maximize2, FlipHorizontal, FlipVertical, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import NextImage from 'next/image';

const ASPECT_RATIOS = [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Landscape (16:9)', value: 16 / 9 },
    { label: 'Cinematic (21:9)', value: 21 / 9 },
    { label: 'Wide Banner (3:1)', value: 3 / 1 },
    { label: 'Page Title (4:1)', value: 4 / 1 },
    { label: 'Portrait (9:16)', value: 9 / 16 },
    { label: 'Photo (4:3)', value: 4 / 3 },
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

/**
 * Convert percentage-based crop to pixel-based crop using DISPLAYED image dimensions
 * @param {Object} percentCrop - Crop in percentage units
 * @param {HTMLImageElement} imgElement - The displayed image element
 * @returns {Object} Crop in pixel units relative to displayed image
 */
function convertCropToPixels(percentCrop, imgElement) {
    if (!percentCrop || !imgElement) {
        return null;
    }

    // Use the displayed dimensions, not natural dimensions
    const displayWidth = imgElement.width;
    const displayHeight = imgElement.height;

    return {
        unit: 'px',
        x: (percentCrop.x / 100) * displayWidth,
        y: (percentCrop.y / 100) * displayHeight,
        width: (percentCrop.width / 100) * displayWidth,
        height: (percentCrop.height / 100) * displayHeight,
    };
}

export default function ImageCropModal({
    open,
    onClose,
    images = [], // Array of { id, src, file }
    onCropComplete, // Returns array of files
    defaultAspectRatio = undefined,
    onRemoveImage,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Store edits per image ID: { [id]: { crop, completedCrop, rotation, flip, aspectRatio } }
    const [edits, setEdits] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Local state for the CURRENT image (syncs with edits)
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio || undefined);
    const [rotation, setRotation] = useState(0);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });

    const imgRef = useRef(null);
    // Track if we're restoring saved state to prevent onImageLoad from overriding
    const isRestoringRef = useRef(false);
    const currentImage = images[currentIndex];

    // Reset index if out of bounds (e.g. after deletion)
    useEffect(() => {
        if (currentIndex >= images.length && images.length > 0) {
            setCurrentIndex(images.length - 1);
        }
    }, [images.length, currentIndex]);

    // Load saved edits or defaults when switching images
    useEffect(() => {
        if (!currentImage) return;

        const savedEdit = edits[currentImage.id] || {};

        setRotation(savedEdit.rotation || 0);
        setFlip(savedEdit.flip || { horizontal: false, vertical: false });
        setAspectRatio(savedEdit.aspectRatio !== undefined ? savedEdit.aspectRatio : (defaultAspectRatio || undefined));

        // If we have saved crop, mark that we're restoring and set the crop
        if (savedEdit.crop) {
            isRestoringRef.current = true;
            setCrop(savedEdit.crop);
            setCompletedCrop(savedEdit.completedCrop);
        } else {
            // Reset to undefined so onImageLoad triggers default
            isRestoringRef.current = false;
            setCrop(undefined);
            setCompletedCrop(null);
        }

    }, [currentIndex, currentImage?.id, edits, defaultAspectRatio]);

    // Better approach: Sync to `edits` when values change?
    const updateCurrentEdit = (updates) => {
        if (!currentImage) return;
        setEdits(prev => ({
            ...prev,
            [currentImage.id]: {
                ...(prev[currentImage.id] || {}),
                rotation, // current state
                flip,
                aspectRatio,
                crop,
                completedCrop,
                ...updates // overwritten by specific update
            }
        }));
    };

    // Helper wrapper to update local state AND edits
    const handleSetRotation = (val) => {
        setRotation(val);
        updateCurrentEdit({ rotation: val });
    };
    const handleSetFlip = (val) => {
        setFlip(val);
        updateCurrentEdit({ flip: val });
    };
    const handleSetAspectRatio = (val) => {
        setAspectRatio(val);

        // Immediate update for crop
        if (imgRef.current && val !== undefined) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, val);
            setCrop(newCrop);
            setCompletedCrop(newCrop);
            updateCurrentEdit({ aspectRatio: val, crop: newCrop, completedCrop: newCrop });
        } else {
            updateCurrentEdit({ aspectRatio: val });
        }
    };

    // Explicit effect to re-center crop when Aspect Ratio changes
    useEffect(() => {
        if (imgRef.current && aspectRatio !== undefined) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, aspectRatio);
            setCrop(newCrop);
            // CRITICAL: Also set completedCrop so the aspect ratio preset is applied
            setCompletedCrop(newCrop);
            updateCurrentEdit({ crop: newCrop, completedCrop: newCrop });
        }
    }, [aspectRatio]);

    const handleSetCompletedCrop = (val) => {
        setCompletedCrop(val);
        updateCurrentEdit({ completedCrop: val, crop });
    };

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;

        // If we're restoring saved state, don't override it
        if (isRestoringRef.current) {
            isRestoringRef.current = false;
            return;
        }

        const savedEdit = edits[currentImage?.id];

        if (savedEdit?.crop) {
            setCrop(savedEdit.crop);
            if (savedEdit.completedCrop) {
                setCompletedCrop(savedEdit.completedCrop);
            }
            return;
        }

        let initialCrop;
        if (aspectRatio) {
            initialCrop = centerAspectCrop(width, height, aspectRatio);
        } else {
            initialCrop = {
                unit: '%',
                width: 100,
                height: 100,
                x: 0,
                y: 0
            };
        }

        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }

    const handleSaveAll = async () => {
        setIsProcessing(true);
        try {
            const results = [];

            for (const img of images) {
                const edit = edits[img.id] || {};

                if (edit.completedCrop || edit.rotation || edit.flip?.horizontal || edit.flip?.vertical) {
                    // Load the image to get natural dimensions
                    const image = await new Promise((resolve, reject) => {
                        const imgElement = new Image();
                        imgElement.onload = () => resolve(imgElement);
                        imgElement.onerror = reject;
                        imgElement.src = img.src;
                    });

                    // Get the crop in percentage
                    const cropToUse = edit.completedCrop || { unit: '%', width: 100, height: 100, x: 0, y: 0 };

                    // Calculate rotated dimensions
                    const rotation = edit.rotation || 0;
                    const rotRad = (rotation * Math.PI) / 180;
                    const rotatedWidth = Math.abs(Math.cos(rotRad) * image.naturalWidth) +
                        Math.abs(Math.sin(rotRad) * image.naturalHeight);
                    const rotatedHeight = Math.abs(Math.sin(rotRad) * image.naturalWidth) +
                        Math.abs(Math.cos(rotRad) * image.naturalHeight);

                    // Convert percentage crop to pixels based on rotated dimensions
                    const pixelCrop = {
                        unit: 'px',
                        x: (cropToUse.x / 100) * rotatedWidth,
                        y: (cropToUse.y / 100) * rotatedHeight,
                        width: (cropToUse.width / 100) * rotatedWidth,
                        height: (cropToUse.height / 100) * rotatedHeight,
                    };


                    const croppedBlob = await getCroppedImg(
                        img.src,
                        pixelCrop,
                        rotation,
                        edit.flip || { horizontal: false, vertical: false }
                    );
                    const croppedFile = new File([croppedBlob], img.file.name, {
                        type: img.file.type,
                        lastModified: Date.now(),
                    });
                    results.push(croppedFile);
                } else {
                    // No edits, use original file
                    results.push(img.file);
                }
            }



            onCropComplete(results);
            onClose();

        } catch (error) {
            console.error('Batch save error:', error);
            toast.error('Failed to process images. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveCurrent = (idx, e) => {
        e.stopPropagation();
        if (onRemoveImage) {
            onRemoveImage(images[idx].id);
        }
    }

    // If no images
    if (!images || images.length === 0) return null;

    if (!currentImage) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-none w-screen h-[100dvh] md:w-[98vw] md:h-[95vh] md:max-w-7xl p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-body">

                {/* Main Image Area */}
                <div className="flex-1 md:flex-1 bg-gray-300 relative flex flex-col min-h-0 order-1 md:order-1 h-[55vh] md:h-auto">
                    <div className="flex-1 overflow-hidden flex items-center justify-center p-2 md:p-6">
                        <div className="w-full h-full flex items-center justify-center">
                            <div style={{
                                transform: `rotate(${rotation}deg) scale(${flip.horizontal ? -1 : 1}, ${flip.vertical ? -1 : 1})`,
                                transition: 'transform 0.3s ease',
                                display: 'inline-block'
                            }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => {
                                        setCrop(percentCrop);
                                    }}
                                    onComplete={(_, percentCrop) => handleSetCompletedCrop(percentCrop)}
                                    aspect={aspectRatio}
                                    className="max-w-full max-h-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={currentImage.src}
                                        alt="Crop me"
                                        onLoad={onImageLoad}
                                        style={{
                                            display: 'block',
                                            maxHeight: 'calc(55vh - 120px)',
                                            maxWidth: '100%',
                                            width: 'auto',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
                                        className="md:!max-h-[calc(95vh-200px)]"
                                    />
                                </ReactCrop>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Strip */}
                    <div className="h-20 md:h-24 bg-body border-t border-gray-300 shrink-0 flex items-center gap-3 px-4 overflow-x-auto z-10 shadow-sm">
                        {images.map((img, idx) => (
                            <div
                                key={img.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={`
                                    relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 group
                                    ${currentIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-70 hover:opacity-100'}
                                `}
                            >
                                <NextImage
                                    src={img.src}
                                    alt="thumb"
                                    fill
                                    className="object-cover"
                                />
                                {edits[img.id] && <div className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full shadow-sm" />}

                                {images.length > 1 && (
                                    <button
                                        onClick={(e) => handleRemoveCurrent(idx, e)}
                                        className="absolute top-0 right-0 p-0.5 bg-black/50 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-80 bg-card border-l border-gray-300 flex flex-col flex-none max-h-[45vh] md:max-h-none md:h-full shrink-0 z-20 shadow-xl order-2 md:order-2">
                    <div className="p-2 px-3 border-b border-gray-300 flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 !text-lg font-semibold">
                            Batch Edit ({currentIndex + 1}/{images.length})
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 !text-sm bg-gray-200 hover:bg-red-100 text-red-500 hover:text-red-600 "
                            onClick={() => {
                                handleSetRotation(0);
                                handleSetFlip({ horizontal: false, vertical: false });
                                handleSetAspectRatio(defaultAspectRatio || undefined);
                            }}
                        >
                            Reset
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 md:space-y-6 pb-16 md:pb-5">
                        {/* Aspect Ratio */}
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Aspect Ratio
                            </Label>

                            {/* Mobile: Select Dropdown */}
                            <div className="md:hidden">
                                <Select
                                    value={aspectRatio === undefined ? 'free' : aspectRatio.toString()}
                                    onValueChange={(val) => {
                                        if (val === 'free') {
                                            handleSetAspectRatio(undefined);
                                        } else {
                                            handleSetAspectRatio(parseFloat(val));
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ASPECT_RATIOS.map((ratio) => (
                                            <SelectItem
                                                key={ratio.label}
                                                value={ratio.value === undefined ? 'free' : ratio.value.toString()}
                                            >
                                                {ratio.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: Button Grid */}
                            <div className="hidden md:grid grid-cols-2 gap-2">
                                {ASPECT_RATIOS.map((ratio) => (
                                    <Button
                                        key={ratio.label}
                                        variant={aspectRatio === ratio.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleSetAspectRatio(ratio.value)}
                                        className="text-xs h-8 justify-start px-3 border-gray-300"
                                    >
                                        <Maximize2 className="w-3 h-3 mr-2 opacity-70" />
                                        {ratio.label.split(' ')[0]}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Transform */}
                        <div className="space-y-4">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Transform
                            </Label>

                            <div className="bg-muted/30 rounded-lg p-3 space-y-4">
                                {/* <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Rotation</span>
                                        <span className="font-mono">{rotation}°</span>
                                    </div>
                                    <Slider
                                        value={[rotation]}
                                        onValueChange={(val) => handleSetRotation(val[0])}
                                        min={0}
                                        max={360}
                                        step={1}
                                    />
                                </div> */}

                                <div className="flex gap-2">
                                    <Button
                                        variant={flip.horizontal ? "secondary" : "outline"}
                                        size="lg"
                                        className="flex-1 border-gray-300"
                                        onClick={() => handleSetFlip({ ...flip, horizontal: !flip.horizontal })}
                                    >
                                        <FlipHorizontal className="w-4 h-4 mr-2" /> Flip H
                                    </Button>
                                    <Button
                                        variant={flip.vertical ? "secondary" : "outline"}
                                        size="lg"
                                        className="flex-1 border-gray-300"
                                        onClick={() => handleSetFlip({ ...flip, vertical: !flip.vertical })}
                                    >
                                        <FlipVertical className="w-4 h-4 mr-2" /> Flip V
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 md:p-4 border-t border-gray-300 flex items-center justify-between gap-2 md:gap-3 bg-body md:relative fixed bottom-0 left-0 right-0 z-50 md:z-auto">
                        <Button variant="outline" onClick={onClose} className="flex-1 h-9 md:h-10 text-sm">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAll}
                            disabled={isProcessing}
                            className="flex-1 h-9 md:h-10 text-sm"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    <span className="hidden md:inline">Processing</span>
                                    <span className="md:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden md:inline">Upload All ({images.length})</span>
                                    <span className="md:hidden">Upload ({images.length})</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}