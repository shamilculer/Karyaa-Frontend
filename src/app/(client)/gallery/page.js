// app/gallery/page.jsx
// Gallery may use server helpers that access cookies; mark dynamic to prevent static prerender errors.
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import GalleryContent from "../components/galleryContent/GalleryContent";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import PageTitle from "../components/common/PageTitle";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryPage = () => {
  return (
    <div className="min-h-screen">
      <PageTitle imgUrl="/new-banner-7.jpg" title="Gallery" />
      
      <section className="container !mb-14">
        <PageSearchBar />
      </section>
      
      <CategoryList />
      
      <section className="container flex-center flex-col gap-5">
        <h2 className="uppercase">A Visual Showcase</h2>
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryContent />
        </Suspense>
      </section>
    </div>
  );
};

export default GalleryPage;

// Masonry Skeleton Loader
function GallerySkeleton() {
  return (
    <div className="flex gap-6 max-w-[1400px] w-full">
      {/* Column 1 */}
      <div className="flex-1 flex flex-col gap-6">
        <Skeleton className="w-full h-96 rounded-xl" />
        <Skeleton className="w-full h-72 rounded-xl" />
        <Skeleton className="w-full h-80 rounded-xl" />
      </div>
      
      {/* Column 2 - Hidden on mobile */}
      <div className="hidden sm:flex flex-1 flex-col gap-6">
        <Skeleton className="w-full h-80 rounded-xl" />
        <Skeleton className="w-full h-96 rounded-xl" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
      
      {/* Column 3 - Hidden on mobile and tablet */}
      <div className="hidden lg:flex flex-1 flex-col gap-6">
        <Skeleton className="w-full h-72 rounded-xl" />
        <Skeleton className="w-full h-88 rounded-xl" />
        <Skeleton className="w-full h-80 rounded-xl" />
      </div>
    </div>
  );
}