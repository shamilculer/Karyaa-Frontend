

import { Suspense } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { VendorsCard } from "../components/common/vendorsList/VendorsList";
import { getSavedVendors } from "@/app/actions/user/user";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import PageTitle from "../components/common/PageTitle";

export const metadata = {
  title: "My Saved Vendors | Karyaa",
  description: "View your shortlisted vendors and plan your event with ease.",
};

// ===============================================
// SAVED VENDORS CONTENT (Server Component)
// ===============================================
async function SavedVendorsContent({ categorySlug }) {
  const response = await getSavedVendors(categorySlug);
  const savedVendors = response?.data || [];
  const isAuthenticated = true;

  if (savedVendors.length === 0) {
    return (
      <section className="py-20 text-center space-y-6">
        <h3 className="text-lg text-muted-foreground">
          {categorySlug
            ? "No saved vendors found in this category."
            : "You haven't saved any vendors yet."}
        </h3>
        <Button asChild>
          <Link href="/categories">Explore Vendors</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap:10 md:gap-12">
        {savedVendors.map((vendor) => (
          <VendorsCard
            key={vendor._id}
            vendor={vendor}
            isAuthenticated={isAuthenticated}
            isInitialSaved={true}
            source="saved"
          />
        ))}
      </div>
    </section>
  );
}

// ===============================================
// SKELETON LOADER
// ===============================================
function SavedVendorsSkeleton() {
  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ===============================================
// DEFAULT EXPORT (Page Component)
// ===============================================
export default async function SavedVendorsPage({ searchParams }) {
  // Get category slug from URL query params
  const categoryParam = await searchParams;
  const categorySlug = categoryParam?.category || null;

  return (
    <div>
      <PageTitle imgUrl="/new-banner-3.jpg" title="Saved Vendors" />
      <section className="container">
        <PageSearchBar />
      </section>
      <CategoryList isSavedPage={true} />

      {/* Suspense Wrapper for Vendor Data */}
      <Suspense fallback={<SavedVendorsSkeleton />} key={categorySlug}>
        <SavedVendorsContent categorySlug={categorySlug} />
      </Suspense>
    </div>
  );
}