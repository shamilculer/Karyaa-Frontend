// app/ideas/page.jsx

import IdeasContainer from "../components/IdeasContainer";
import { getAllIdeaCategoriesAction } from "@/app/actions/ideas";

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
      <section className="!m-0 bg-[url('/new-banner-2.jpg')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Ideas</h1>
          <p className="mt-2 max-md:text-xs">
            Ideas, Inspiration & Expert Tips for Every Event
          </p>
        </div>
      </section>

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
