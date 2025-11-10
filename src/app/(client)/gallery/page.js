import { Suspense } from "react";
import GalleryContent from "../components/galleryContent/GalleryContent";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";

const GalleryPage = () => {
  return (
    <div className="min-h-screen">
      <section className="!m-0 bg-[url('/new-banner-7.jpg')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Gallery</h1>
        </div>
      </section>

      <section className="container !mb-14">
        <PageSearchBar />
      </section>

      <section className="container">
        <CategoryList />
      </section>

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


import { Skeleton } from "@/components/ui/skeleton";

function GallerySkeleton() {
  return (
    <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9 w-full">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden shadow-md space-y-3"
        >
          <Skeleton className="w-full h-72 rounded-xl" />

          <div className="flex items-center gap-3 px-2 pb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
