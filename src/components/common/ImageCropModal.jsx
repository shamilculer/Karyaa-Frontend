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

import { Maximize2, FlipHorizontal, FlipVertical, X, RotateCcw, RotateCw, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
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
 */
function convertCropToPixels(percentCrop, imgElement) {
    if (!percentCrop || !imgElement) {
        return null;
    }

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
    // Store edits per image ID: { [id]: { crop, completedCrop, rotation, zoom, flip, aspectRatio } }
    const [edits, setEdits] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Local state for the CURRENT image (syncs with edits)
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio || undefined);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });

    const imgRef = useRef(null);
    const isRestoringRef = useRef(false);
    const thumbnailsRef = useRef(null);
    const [thumbScrollLeft, setThumbScrollLeft] = useState(0);
    const [thumbOverflows, setThumbOverflows] = useState(false);

    const measureThumb = () => {
        const el = thumbnailsRef.current;
        if (!el) return;
        setThumbScrollLeft(el.scrollLeft);
        setThumbOverflows(el.scrollWidth > el.clientWidth + 2);
    };

    useEffect(() => {
        const el = thumbnailsRef.current;
        if (!el) return;

        measureThumb();

        // Multiple delayed checks to catch dialog animation settling
        const t1 = setTimeout(measureThumb, 50);
        const t2 = setTimeout(measureThumb, 150);
        const t3 = setTimeout(measureThumb, 400);

        el.addEventListener('scroll', measureThumb, { passive: true });

        const ro = new ResizeObserver(measureThumb);
        ro.observe(el);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            el.removeEventListener('scroll', measureThumb);
            ro.disconnect();
        };
    }, [images.length, open]);

    // Scroll active thumbnail into view when switching
    useEffect(() => {
        const el = thumbnailsRef.current;
        if (!el) return;
        const thumb = el.children[currentIndex];
        if (thumb) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        setTimeout(measureThumb, 400);
    }, [currentIndex]);

    const scrollThumbnails = (dir) => {
        const el = thumbnailsRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 220, behavior: 'smooth' });
        setTimeout(measureThumb, 400);
    };

    const thumbScrollMax = thumbnailsRef.current
        ? thumbnailsRef.current.scrollWidth - thumbnailsRef.current.clientWidth
        : 0;
    const canScrollLeft = thumbScrollLeft > 1;
    // Show right arrow if: overflows AND not scrolled to end
    // Also always show if images.length > 5 AND we haven't measured overflow yet (pre-layout)
    const canScrollRight = thumbOverflows && thumbScrollLeft < thumbScrollMax - 1;
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
        setZoom(savedEdit.zoom || 1);
        setFlip(savedEdit.flip || { horizontal: false, vertical: false });
        setAspectRatio(savedEdit.aspectRatio !== undefined ? savedEdit.aspectRatio : (defaultAspectRatio || undefined));

        if (savedEdit.crop) {
            isRestoringRef.current = true;
            setCrop(savedEdit.crop);
            setCompletedCrop(savedEdit.completedCrop);
        } else {
            isRestoringRef.current = false;
            setCrop(undefined);
            setCompletedCrop(null);
        }

    }, [currentIndex, currentImage?.id, edits, defaultAspectRatio]);

    const updateCurrentEdit = (updates) => {
        if (!currentImage) return;
        setEdits(prev => ({
            ...prev,
            [currentImage.id]: {
                ...(prev[currentImage.id] || {}),
                rotation,
                zoom,
                flip,
                aspectRatio,
                crop,
                completedCrop,
                ...updates
            }
        }));
    };

    const handleSetRotation = (val) => {
        setRotation(val);
        updateCurrentEdit({ rotation: val });
    };
    const handleSetZoom = (val) => {
        setZoom(val);
        updateCurrentEdit({ zoom: val });
    };
    const handleSetFlip = (val) => {
        setFlip(val);
        updateCurrentEdit({ flip: val });
    };
    const handleSetAspectRatio = (val) => {
        setAspectRatio(val);

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

    // Re-center crop when aspect ratio changes
    useEffect(() => {
        if (imgRef.current && aspectRatio !== undefined) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, aspectRatio);
            setCrop(newCrop);
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

                if (edit.completedCrop || edit.rotation || edit.zoom > 1 || edit.flip?.horizontal || edit.flip?.vertical) {
                    const image = await new Promise((resolve, reject) => {
                        const imgElement = new Image();
                        imgElement.onload = () => resolve(imgElement);
                        imgElement.onerror = reject;
                        imgElement.src = img.src;
                    });

                    const cropToUse = edit.completedCrop || { unit: '%', width: 100, height: 100, x: 0, y: 0 };
                    const editRotation = edit.rotation || 0;
                    const editZoom = edit.zoom || 1;

                    const rotRad = (editRotation * Math.PI) / 180;
                    const rotatedWidth = Math.abs(Math.cos(rotRad) * image.naturalWidth) +
                        Math.abs(Math.sin(rotRad) * image.naturalHeight);
                    const rotatedHeight = Math.abs(Math.sin(rotRad) * image.naturalWidth) +
                        Math.abs(Math.cos(rotRad) * image.naturalHeight);

                    // CSS scale(Z) with transformOrigin:center means only the center
                    // 1/Z region of the image fills the visible area. So a ReactCrop
                    // percentage `p` (in layout space) maps to a natural-image pixel as:
                    //   naturalCoord = bBox * (0.5*(1 - 1/Z) + p / (100*Z))
                    //   naturalSize  = bBox * size / (100 * Z)
                    const Z = editZoom;
                    const offsetX = rotatedWidth * 0.5 * (1 - 1 / Z);
                    const offsetY = rotatedHeight * 0.5 * (1 - 1 / Z);

                    const pixelCrop = {
                        unit: 'px',
                        x: offsetX + (cropToUse.x / 100) * rotatedWidth / Z,
                        y: offsetY + (cropToUse.y / 100) * rotatedHeight / Z,
                        width: (cropToUse.width / 100) * rotatedWidth / Z,
                        height: (cropToUse.height / 100) * rotatedHeight / Z,
                    };

                    const croppedBlob = await getCroppedImg(
                        img.src,
                        pixelCrop,
                        editRotation,
                        edit.flip || { horizontal: false, vertical: false },
                        editZoom
                    );
                    const croppedFile = new File([croppedBlob], img.file.name, {
                        type: img.file.type,
                        lastModified: Date.now(),
                    });
                    results.push(croppedFile);
                } else {
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

    if (!images || images.length === 0) return null;
    if (!currentImage) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-none w-screen h-[100dvh] md:w-[98vw] md:h-[95vh] md:max-w-7xl p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-body">

                {/* Main Image Area */}
                <div className="flex-1 min-w-0 bg-gray-300 relative flex flex-col min-h-0 order-1 md:order-1 h-[55vh] md:h-auto overflow-hidden">
                    <div className="flex-1 overflow-hidden flex items-center justify-center p-2 md:p-6">
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            {/* Clip container — crop box stays fixed, image transforms inside */}
                            <div style={{ display: 'inline-block', overflow: 'hidden' }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
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
                                            objectFit: 'contain',
                                            transform: `rotate(${rotation}deg) scale(${zoom * (flip.horizontal ? -1 : 1)}, ${zoom * (flip.vertical ? -1 : 1)})`,
                                            transformOrigin: 'center center',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        className="md:!max-h-[calc(95vh-200px)]"
                                    />
                                </ReactCrop>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Strip */}
                    <div className="h-[88px] bg-body border-t border-gray-300 shrink-0 flex items-center z-10 shadow-sm relative overflow-hidden">

                        {/* Left arrow — only when scrolled right */}
                        <button
                            onClick={() => scrollThumbnails(-1)}
                            className={`absolute left-0 z-20 h-full w-10 flex items-center justify-start pl-1.5 bg-gradient-to-r from-body via-body/80 to-transparent transition-opacity duration-150 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            aria-label="Scroll left"
                        >
                            <div className="w-6 h-6 rounded-full bg-background border border-border shadow-md flex items-center justify-center">
                                <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                            </div>
                        </button>

                        {/* Scrollable track */}
                        <div
                            ref={thumbnailsRef}
                            className="flex flex-nowrap items-center gap-2 px-10 w-full h-full overflow-x-scroll overflow-y-hidden [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {images.map((img, idx) => (
                                <div
                                    key={img.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 group ${currentIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-70 hover:opacity-100'}`}
                                >
                                    <NextImage src={img.src} alt="thumb" fill className="object-cover" />
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

                        {/* Right arrow — show when overflowing OR when enough images to likely overflow */}
                        {(canScrollRight || (images.length > 5 && !canScrollLeft)) && (
                            <button
                                onClick={() => scrollThumbnails(1)}
                                className="absolute right-0 z-20 h-full w-10 flex items-center justify-end pr-1.5 bg-gradient-to-l from-body via-body/80 to-transparent"
                                aria-label="Scroll right"
                            >
                                <div className="w-6 h-6 rounded-full bg-background border border-border shadow-md flex items-center justify-center">
                                    <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-80 md:min-w-[320px] bg-card border-l border-gray-300 flex flex-col flex-none shrink-0 max-h-[45vh] md:max-h-none md:h-full z-20 shadow-xl order-2 md:order-2">
                    <div className="p-2 px-3 border-b border-gray-300 flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 !text-lg font-semibold">
                            Batch Edit ({currentIndex + 1}/{images.length})
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 !text-sm bg-gray-200 hover:bg-red-100 text-red-500 hover:text-red-600"
                            onClick={() => {
                                handleSetRotation(0);
                                handleSetZoom(1);
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

                        {/* Zoom */}
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Zoom
                            </Label>
                            <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <ZoomIn className="w-3.5 h-3.5" />
                                        <span>Scale</span>
                                    </div>
                                    <span className="font-mono font-medium tabular-nums">{zoom.toFixed(2)}×</span>
                                </div>
                                <Slider
                                    value={[zoom]}
                                    onValueChange={(val) => handleSetZoom(val[0])}
                                    min={0.5}
                                    max={3}
                                    step={0.01}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground/60">
                                    <span>0.5×</span>
                                    <span>1×</span>
                                    <span>3×</span>
                                </div>
                            </div>
                        </div>

                        {/* Rotation */}
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Rotation
                            </Label>
                            <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Angle</span>
                                    <span className="font-mono font-medium tabular-nums">{rotation}°</span>
                                </div>
                                <Slider
                                    value={[rotation]}
                                    onValueChange={(val) => handleSetRotation(val[0])}
                                    min={-180}
                                    max={180}
                                    step={1}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground/60">
                                    <span>-180°</span>
                                    <span>0°</span>
                                    <span>180°</span>
                                </div>
                                {/* Quick rotate buttons */}
                                <div className="flex gap-2 pt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-gray-300 text-xs h-8"
                                        onClick={() => handleSetRotation((((rotation - 90) % 360) + 360) % 360 > 180 ? ((rotation - 90) % 360) - 360 : (rotation - 90) % 360)}
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> −90°
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-gray-300 text-xs h-8"
                                        onClick={() => handleSetRotation(0)}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-gray-300 text-xs h-8"
                                        onClick={() => {
                                            const next = (rotation + 90) % 360;
                                            handleSetRotation(next > 180 ? next - 360 : next);
                                        }}
                                    >
                                        +90° <RotateCw className="w-3.5 h-3.5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Transform / Flip */}
                        <div className="space-y-4">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Flip
                            </Label>

                            <div className="bg-muted/30 rounded-lg p-3 space-y-4">
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