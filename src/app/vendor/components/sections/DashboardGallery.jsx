"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getVendorGalleryItems } from "@/app/actions/shared/gallery"
import { useVendorStore } from "@/store/vendorStore"
import { Skeleton } from "@/components/ui/skeleton"

const DashboardGallery = () => {
    const { vendor } = useVendorStore()
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchGallery = async () => {
            if (!vendor?.id) return

            setLoading(true)
            try {
                const result = await getVendorGalleryItems(vendor.id)
                if (result.items) {
                    setImages(result.items.slice(0, 5))
                } else if (result.error) {
                    setError(result.error)
                }
            } catch (err) {
                setError("Failed to load gallery")
            } finally {
                setLoading(false)
            }
        }

        fetchGallery()
    }, [vendor?.id])

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 w-full place-items-center gap-5">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="text-red-500 text-sm">{error}</div>
    }

    if (images.length === 0) {
        return (
            <div className="w-full py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No images in gallery</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 w-full place-items-center gap-2 lg:gap-5">
            {images.map((item, index) => (
                <div key={item._id || index} className="relative h-44 lg:h-72 w-full rounded-2xl border border-gray-300 overflow-hidden">
                    {item.mediaType === 'video' ? (
                        <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            controls
                            preload="metadata"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <Image
                            src={item.url}
                            className="h-full w-full object-cover"
                            width={300}
                            height={300}
                            alt="Gallery"
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default DashboardGallery
