import CompareTable from "../components/CompareTable";
import { getVendorsBySlugs, getAllVendorOptions } from "@/app/actions/vendors";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Define a simple loading state for the data fetching
const CompareLoadingSkeleton = () => (
    <div className="py-12 flex flex-col gap-8">
        <Skeleton className="h-10 w-full max-w-lg mx-auto" />
        <Skeleton className="h-[500px] w-full" />
    </div>
);

// The main page component must accept searchParams to read the URL
// This is a Server Component and must be async
const ComaprePage = async ({ searchParams }) => {
    
    // --- 1. Read Vendor Slugs from the URL ---
    // The requirement is: /compare?vendor=slug1 (initial single vendor)
    // We will generalize this to 'vendors' for the table, supporting up to 3.
    const initialVendorSlug = await searchParams.vendor || searchParams.vendors;
    
    let vendorSlugs = [];
    if (initialVendorSlug) {
        // Normalize: if it's one vendor (string), convert to array. If it's a list (string), split it.
        vendorSlugs = Array.isArray(initialVendorSlug) 
            ? initialVendorSlug 
            : initialVendorSlug.split(',').filter(slug => slug.trim() !== '');
    }

    // Ensure we only process unique slugs and limit to 3 for the comparison table
    vendorSlugs = [...new Set(vendorSlugs)].slice(0, 3);


    // --- 2. Fetch Initial Vendor Data (for pre-filled slots) ---
    const initialCompareResult = await getVendorsBySlugs(vendorSlugs);
    const initialCompareVendors = initialCompareResult.data || [];
    
    
    // --- 3. Fetch All Vendor Options (for the Combobox dropdown) ---
    const allVendorOptionsResult = await getAllVendorOptions();
    const vendorOptions = allVendorOptionsResult.data || [];
    
    
    // --- Handle Errors for Data Fetching ---
    if (initialCompareResult.error || allVendorOptionsResult.error) {
         // You might want a better error page/component here
         return (
            <div className='min-h-screen py-20 container text-center'>
                <h2 className="text-2xl font-bold text-red-600">Error Loading Comparison Data</h2>
                <p className="mt-4 text-muted-foreground">Please try again later. {(initialCompareResult.error || allVendorOptionsResult.error)}</p>
            </div>
         );
    }
    
    return (
        <div className='min-h-screen'>
            <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
                <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
                <div className="relative z-10 text-white text-center">
                    <h1 className="!text-white !text-5xl lg:!text-7xl">Compare Vendors</h1>
                    <p className="mt-2 max-md:text-xs">Side-by-side comparison for informed decisions.</p>
                </div>
            </section>

            <Suspense fallback={<CompareLoadingSkeleton />}>
                <section className='container py-12'>
                    {/* 4. Pass the fetched data and options to the Client Component */}
                    <CompareTable 
                        initialVendors={initialCompareVendors}
                        vendorOptions={vendorOptions} 
                    />
                </section>
            </Suspense>
        </div>
    );
}

export default ComaprePage;