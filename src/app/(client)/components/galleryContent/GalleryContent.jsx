import { getAllGalleryItems } from "@/app/actions/gallery";
import MasonryGrid from "./MasonryGrid";

export default async function GalleryContent() {
    const galleryData = await getAllGalleryItems({ limit: 30 });
    const items = galleryData.items;

    if (!items || items.length === 0)
        return <p className="opacity-60">No gallery items found.</p>;

    return <MasonryGrid items={items} />;
}