"use client"

import * as React from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconGripVertical } from '@tabler/icons-react'
import OverViewStats from '../components/common/OverViewStats'
import GalleryToolBar from '../components/GalleryToolbar'


// Initial image data with order key
const initialImages = [
  { id: '1', order: 1, src: "/why-us.jpg" },
  { id: '2', order: 2, src: "/banner-2.jpg" },
  { id: '3', order: 3, src: "/blog-2.webp" },
  { id: '4', order: 4, src: "/banner-1.avif" },
  { id: '5', order: 5, src: "/new-banner-1.jpg" },
]

// Draggable component for each image
function DraggableImage({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-2xl border border-gray-300 overflow-hidden group"
    >
      <div
        className="absolute top-2 left-2 p-1 bg-white rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-4 text-gray-600 cursor-grab active:cursor-grabbing" />
      </div>
      <Image
        src={item.src}
        className="h-72 w-full object-cover"
        width={300}
        height={300}
        alt="Gallery Image"
      />
    </div>
  )
}

const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = React.useState(initialImages)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setGalleryImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="h-full dashboard-container space-y-8">
      <OverViewStats />
      <GalleryToolBar />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={galleryImages} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryImages.map((item) => (
              <DraggableImage key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default GalleryPage
