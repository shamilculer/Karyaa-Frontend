"use client";

import * as React from "react";
import Image from "next/image";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// ─────────────────────────────────────────────
//  Single sortable card
// ─────────────────────────────────────────────
function SortableCard({
    item,
    reorderMode,
    bulkMode,
    isSelected,
    onToggleSelect,
    onEdit,
    isEditDisabled,
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative rounded-lg overflow-hidden group transition-all
        ${bulkMode ? "cursor-pointer hover:scale-[1.01]" : ""}
        ${reorderMode ? "cursor-default" : ""}
      `}
            onClick={() => bulkMode && onToggleSelect(item._id)}
        >
            {/* Bulk mode checkbox */}
            {bulkMode && (
                <div
                    className="absolute size-7 flex items-center justify-center top-2 left-2 z-20 bg-white rounded-md shadow p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(item._id);
                    }}
                >
                    <Checkbox checked={isSelected} readOnly className="border-gray-400" />
                </div>
            )}

            {/* Selection overlay */}
            {bulkMode && isSelected && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10" />
            )}

            {/* Drag handle — only in reorder mode */}
            {reorderMode && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 z-20 bg-white/90 rounded-md p-1.5 shadow cursor-grab active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
            )}

            {/* Edit button — only when not in bulk/reorder mode */}
            {!bulkMode && !reorderMode && item.mediaType === "image" && onEdit && (
                <div className="absolute top-2 right-2 z-20">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 bg-white/90 hover:bg-white"
                        disabled={isEditDisabled}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                        }}
                        aria-label="Edit image"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Media */}
            {item.mediaType === "video" ? (
                <div className="relative h-72 w-full">
                    <video
                        src={item.url}
                        className="h-72 w-full object-cover rounded-lg"
                        preload="metadata"
                        controls
                        playsInline
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : (
                <Image
                    src={item.url}
                    alt="Gallery"
                    width={300}
                    height={300}
                    className="h-72 w-full object-cover rounded-lg transition-all"
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
//  Main grid
// ─────────────────────────────────────────────
/**
 * SortableGalleryGrid
 *
 * Props:
 *   items         – array of gallery item objects (must have _id, url, mediaType)
 *   reorderMode   – boolean, enables drag handles
 *   bulkMode      – boolean, enables checkboxes
 *   selected      – string[], selected item IDs (bulk mode)
 *   onToggleSelect– (id) => void
 *   onEdit        – (item) => void (optional, images only)
 *   isEditDisabled– boolean
 *   onOrderChange – (newItems) => void  called after every drag-end (optimistic update)
 */
export default function SortableGalleryGrid({
    items,
    reorderMode = false,
    bulkMode = false,
    selected = [],
    onToggleSelect,
    onEdit,
    isEditDisabled = false,
    onOrderChange,
}) {
    const [activeId, setActiveId] = React.useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const activeItem = activeId ? items.find((i) => i._id === activeId) : null;

    function handleDragStart({ active }) {
        setActiveId(active.id);
    }

    function handleDragEnd({ active, over }) {
        setActiveId(null);
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(items, oldIndex, newIndex);
        onOrderChange?.(reordered);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {items.map((item) => (
                        <SortableCard
                            key={item._id}
                            item={item}
                            reorderMode={reorderMode}
                            bulkMode={bulkMode}
                            isSelected={selected.includes(item._id)}
                            onToggleSelect={onToggleSelect}
                            onEdit={onEdit}
                            isEditDisabled={isEditDisabled}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Drag overlay — shows a "ghost" of the dragged card */}
            <DragOverlay>
                {activeItem ? (
                    <div className="rounded-lg overflow-hidden shadow-2xl ring-2 ring-primary/50 opacity-95">
                        {activeItem.mediaType === "video" ? (
                            <div className="h-72 w-full bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-500 text-sm">Video</span>
                            </div>
                        ) : (
                            <Image
                                src={activeItem.url}
                                alt="Dragging"
                                width={300}
                                height={288}
                                className="h-72 w-full object-cover rounded-lg"
                            />
                        )}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
