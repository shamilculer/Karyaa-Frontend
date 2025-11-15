import { Suspense } from "react";
import { getCategories } from "@/app/actions/categories";
import CategoriesListClient from "./CategoriesList.client";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryGridClient } from "./CategoriesList.client";

// --- Async Server Component ---
async function CategoryListContent() {
  try {
    const response = await getCategories();
    return (
      <CategoriesListClient initialCategories={response.categories || []} />
    );
  } catch (error) {
    console.error("Failed to load categories:", error);
    return (
      <div className="text-red-500 text-center py-8">
        Failed to load categories.
      </div>
    );
  }
}

async function CategoryGridContent() {
  try {
    const response = await getCategories();
    return (
      <CategoryGridClient initialCategories={response.categories || []} />
    );
  } catch (error) {
    console.error("Failed to load categories:", error);
    return (
      <div className="text-red-500 text-center py-8">
        Failed to load categories.
      </div>
    );
  }
}

// --- Suspense Wrapper (Main Export) ---
export default function CategoryList() {
  return (
    <section className="container">
      <div className="relative">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="uppercase">Categories</h2>
        </div>
        <Suspense fallback={<CategoryListFallback />}>
          <CategoryListContent />
        </Suspense>
      </div>
    </section>
  );
}


export const CategoryGrid = async () => {
  return (
    <section className="container">
      <div className="relative">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="uppercase">Categories</h2>
        </div>
        <Suspense fallback={<CategoryListFallback />}>
          <CategoryGridContent />
        </Suspense>
      </div>
    </section>
  );
}

// --- Suspense Fallback with Responsive Skeletons ---
function CategoryListFallback() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-3 lg:gap-4 w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-32 sm:h-48 lg:h-80 flex-1 rounded-lg"
        />
      ))}
    </div>
  );
}
