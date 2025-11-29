// app/ideas/page.jsx

import PageTitle from "../components/common/PageTitle";
import IdeasContainer from "../components/features/ideas/IdeasContainer";
import { getAllIdeaCategoriesAction } from "@/app/actions/public/ideas";

// This route uses server-only cookies via apiFetch; force dynamic rendering so Next
// doesn't attempt to statically prerender it and error on cookie usage.
export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  let categories = [];
  let error = null;

  try {
    const categoriesResult = await getAllIdeaCategoriesAction({ role: "user" });

    if (categoriesResult?.success) {
      categories = categoriesResult.data || [];
    } else {
      error = categoriesResult?.message || "Failed to load categories.";
    }
  } catch (err) {
    error = "Network error loading categories.";
  }

  return (
    <div className='min-h-screen'>
      <PageTitle placement="Ideas" imgUrl="/new-banner-2.jpg" title="Ideas" tagline="Ideas, Inspiration & Expert Tips for Every Event" />

      {!categories.length && !error && (
        <div className="flex justify-center py-16">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!error && categories.length === 0 && (
        <div className="flex justify-center py-16">
          <p className="text-gray-500">No categories found.</p>
        </div>
      )}

      {!!categories.length && <IdeasContainer categories={categories} />}
    </div>
  );
}
