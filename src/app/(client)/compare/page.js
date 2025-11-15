// This page performs server-side vendor lookups (may use cookie-backed helpers). Force dynamic rendering.
export const dynamic = 'force-dynamic';

// app/compare/page.js
import { Suspense } from "react";
import CompareTable from "../components/CompareTable";
import { getVendorsBySlugs } from "@/app/actions/vendors";
import { Skeleton } from "@/components/ui/skeleton";
import PageSearchBar from "../components/common/PageSearchBar/PageSearchBar";
import CategoryList from "../components/common/CategoriesList/CategoriesList";
import PageTitle from "../components/common/PageTitle";

// --- Loading & Error Components ---
const CompareLoadingSkeleton = () => (
    <div className="py-12 flex flex-col gap-8 container">
        <Skeleton className="h-10 w-full max-w-lg mx-auto" />
        <Skeleton className="h-[500px] w-full" />
    </div>
);

const ErrorState = ({ message }) => (
    <div className='min-h-screen py-20 container text-center'>
        <h2 className="text-2xl font-bold text-red-600">Error Loading Comparison Data</h2>
        <p className="mt-4 text-muted-foreground">Details: {message}</p>
    </div>
);

// --- Main Server Component ---
const ComparePage = async ({ searchParams }) => {
    // 1. READ SLUGS from URL
    const urlSlugs = searchParams.vendors || searchParams.vendor; 
    let vendorSlugs = [];
    
    if (urlSlugs) {
        vendorSlugs = Array.isArray(urlSlugs)
            ? urlSlugs
            : urlSlugs.split(',').filter(slug => slug.trim() !== '');
    }
    
    vendorSlugs = [...new Set(vendorSlugs)].slice(0, 3); // Limit to 3

    // 2. FETCH INITIAL VENDOR DATA
    const initialCompareResult = await getVendorsBySlugs(vendorSlugs);

    // 3. HANDLE ERRORS
    if (initialCompareResult.error) {
        return <ErrorState message={initialCompareResult.error} />;
    }

    const initialVendors = initialCompareResult.data || [];

    return (
        <div className='min-h-screen'>
            <PageTitle imgUrl="/new-banner-2.jpg" title="Compare Vendors" tagline="Side-by-side comparison for informed decisions." />

            <section className="container">
                <PageSearchBar />
            </section>

                <CategoryList />

            <Suspense fallback={<CompareLoadingSkeleton />}>
                <section className='container py-12'>
                    {/* VendorSelectField will handle fetching options internally */}
                    <CompareTable initialVendors={initialVendors} />
                </section>
            </Suspense>
        </div>
    );
}

export default ComparePage;