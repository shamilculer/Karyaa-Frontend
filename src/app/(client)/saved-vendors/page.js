import { Suspense } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { VendorsCard } from "../components/common/vendorsList/VendorsList";
import { getSavedVendors } from "@/app/actions/user/user";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import CategoryList from "../components/common/CategoriesList/CategoriesList";

// ===============================================
// SAVED VENDORS CONTENT (Server Component)
// ===============================================

async function SavedVendorsContent() {
  const response = await getSavedVendors();
  const savedVendors = response?.data || [];

  const isAuthenticated = true;

  if (savedVendors.length === 0) {
    return (
      <section className="py-20 text-center space-y-6">
        <h3 className="text-lg text-muted-foreground">
          You haven’t saved any vendors yet.
        </h3>
        <Button asChild>
          <Link href="/vendors">Explore Vendors</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap:10 md:gap-12">
        {savedVendors.map((vendor) => (
          // 2. FIX: Pass the required props to VendorsCard
          <VendorsCard
            key={vendor._id}
            vendor={vendor}
            isAuthenticated={isAuthenticated}
            isInitialSaved={true}
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

export default function SavedVendorsPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="!m-0 bg-cover bg-center h-72 md:h-96 flex-center relative px-4 bg-[url('/new-banner-3.jpg')]">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Saved Vendors</h1>
        </div>
      </section>

      <section className="container">
        <PageSearchBar />
      </section>

      <section className="container">
        <CategoryList />
      </section>

      {/* Suspense Wrapper for Vendor Data */}
      <Suspense fallback={<SavedVendorsSkeleton />}>
        <SavedVendorsContent />
      </Suspense>
    </div>
  );
}
