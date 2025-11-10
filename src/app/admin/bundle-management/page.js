// Admin pages often require server-side auth via cookies; force dynamic rendering to avoid build prerender errors.
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { getBundleOverviewStats } from "@/app/actions/admin/analytics";
import BundlesTable from "../components/tables/BundleTable";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "../components/common/ErrorBoundary";


// ---------------------------
// Loading Skeleton Component
// ---------------------------
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-20">
      {[1,2,3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 p-5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-20 mt-3" />
        </div>
      ))}
    </div>
  );
}


// -------------------------
// Error Component (Inline)
// -------------------------
function StatsError({ message }) {
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded">
      <div className="font-semibold text-sm">Failed to load bundle stats</div>
      <div className="text-xs opacity-80 mt-1">{message}</div>
    </div>
  );
}


// -------------------------
// Async Stats Partial
// -------------------------
async function Stats() {
  const statsResponse = await getBundleOverviewStats();

  if (!statsResponse?.success) {
    throw new Error(statsResponse?.message || "Unknown error");
  }

  const stats = statsResponse.data;

  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="bg-white border border-gray-200 p-5">
        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
          Total Active Bundles
        </span>
        <div className="mt-3 text-3xl font-semibold leading-6">
          {stats.totalActiveBundles}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-5">
        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
          Most Popular Bundle
        </span>
        <div className="mt-3 text-2xl font-semibold leading-6">
          {stats.mostPopularBundle?.name || "N/A"}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-5">
        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest">
          Total Active Vendors
        </span>
        <div className="mt-3 text-3xl font-semibold leading-6">
          {stats.totalActiveVendors}
        </div>
      </div>
    </div>
  );
}


// -------------------------
// Main Page Component
// -------------------------
const BundleManagementPage = () => {
  return (
    <div className="h-full dashboard-container space-y-8 mb-16">
      
      <Suspense fallback={<StatsSkeleton />}>
        {/* Inline error boundary */}
        <ErrorBoundary fallback={<StatsError message="Error loading stats." />}>
          <Stats />
        </ErrorBoundary>
      </Suspense>

      <BundlesTable />
    </div>
  );
};

export default BundleManagementPage;