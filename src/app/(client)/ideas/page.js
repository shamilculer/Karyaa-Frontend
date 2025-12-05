// app/ideas/page.jsx

import { Suspense } from "react";
import PageTitle from "../components/common/PageTitle";
import IdeasContent from "./IdeasContent";

// This route uses server-only cookies via apiFetch; force dynamic rendering so Next
// doesn't attempt to statically prerender it and error on cookie usage.
export const dynamic = 'force-dynamic';

export default function IdeasPage() {
  return (
    <div className='min-h-screen'>
      <PageTitle placement="Ideas" imgUrl="/new-banner-2.jpg" title="Ideas" tagline="Ideas, Inspiration & Expert Tips for Every Event" />

      <Suspense fallback={
        <div className="flex justify-center py-16">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      }>
        <IdeasContent />
      </Suspense>
    </div>
  );
}
