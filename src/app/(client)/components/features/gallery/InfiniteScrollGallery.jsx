"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MasonryGrid from "./MasonryGrid";
import { Loader2 } from "lucide-react";
import { getAllGalleryItems } from "@/app/actions/shared/gallery";

export default function InfiniteScrollGallery({ initialItems, hasMore: initialHasMore, totalPages }) {
    const [items, setItems] = useState(initialItems);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerTarget = useRef(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const galleryData = await getAllGalleryItems({ 
                page: nextPage, 
                limit: 60 
            });

            if (galleryData.items && galleryData.items.length > 0) {
                setItems(prev => [...prev, ...galleryData.items]);
                setPage(nextPage);
                setHasMore(galleryData.pagination?.hasNextPage || false);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more items:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, hasMore, loading]);

    return (
        <div className="w-full flex flex-col gap-8">
            <MasonryGrid items={items} />
            
            {/* Loading indicator and intersection observer target */}
            <div 
                ref={observerTarget} 
                className="w-full flex justify-center items-center py-8"
            >
                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading more...</span>
                    </div>
                )}
                {!hasMore && items.length > 0 && (
                    <p className="text-muted-foreground">You've reached the end!</p>
                )}
            </div>
        </div>
    );
}
