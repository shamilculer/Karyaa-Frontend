import InfiniteScrollGallery from "./InfiniteScrollGallery";
import GalleryCarousel from "./GalleryCarousel";
import { getAllGalleryItems } from "@/app/actions/gallery";

export default async function GalleryContent() {
    const galleryData = await getAllGalleryItems({ 
        page: 1, 
        limit: 60
    });
    
    const items = galleryData.items;
    
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="opacity-60 text-lg">No gallery items found.</p>
            </div>
        );
    }
    
    return (
        <>
            {/* Mobile: Carousel */} 
            <div className="w-full block md:hidden">
                <GalleryCarousel 
                    initialItems={items}
                    hasMore={galleryData.pagination?.hasNextPage || false}
                />
            </div>
            
            {/* Desktop: Masonry Grid */}
            <div className="w-full hidden md:block">
                <InfiniteScrollGallery 
                    initialItems={items}
                    hasMore={galleryData.pagination?.hasNextPage || false}
                    totalPages={galleryData.pagination?.totalPages || 1}
                />
            </div>
        </>
    );
}