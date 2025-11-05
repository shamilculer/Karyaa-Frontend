import IdeasContainer from "../components/IdeasContainer";
import { getAllIdeaCategoriesAction } from "@/app/actions/ideas";

export default async function IdeasPage() {
  const categoriesResult = await getAllIdeaCategoriesAction({ role: "user" });
  const categories = categoriesResult?.data || [];

  return (
    <div className='min-h-screen'>
      <section className="!m-0 bg-[url('/new-banner-2.jpg')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="!text-white !text-5xl lg:!text-7xl">Ideas</h1>
          <p className="mt-2 max-md:text-xs">Ideas, Inspiration & Expert Tips for Every Event</p>
        </div>
      </section>

      <IdeasContainer categories={categories} />
    </div>
  );
}
