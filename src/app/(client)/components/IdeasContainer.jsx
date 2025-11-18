"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllIdeasAction } from "@/app/actions/ideas";
import IdeaGallery from "./IdeaGallery";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Carousel } from "@/components/ui/carousel";

function IdeasContainer({ categories }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // derive selected from URL OR default to first category
  const selected = searchParams.get("category") || categories[0]?.name;

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryOptions = useMemo(() => [...categories], [categories]);

  const handleSelect = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchIdeas = async (categoryValue) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAllIdeasAction({
        page: 1,
        limit: 20,
        category: categoryValue,
      });

      if (res.success) {
        setIdeas(res.data);
      } else {
        setError(res.message);
        setIdeas([]);
      }
    } catch {
      setError("Network error fetching ideas.");
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(selected);
  }, [selected]);

  return (
    <section className="w-full max-w-[1500px] mx-auto px-1">
      <h2 className="uppercase font-semibold text-xl">Popular Categories</h2>

      {/* Category Tabs */}
      {/* <div className="mt-6 w-full  hidden xl:grid grid-cols-8 place-items-center gap-10 overflow-x-auto pb-4 px-5">
        {categoryOptions.map((cat) => {
          const isSelected = selected === cat.name;
          return (
            <div
              key={cat._id}
              onClick={() => handleSelect(cat.name)}
              className={`
                flex flex-col justify-start gap-2 cursor-pointer transition-all duration-200 flex-shrink-0
                ${isSelected ? "text-indigo-600 font-semibold" : "text-gray-700"}
              `}
            >
              <div
                className={`
                  mx-auto rounded-full overflow-hidden border-2
                  ${isSelected ? "border-indigo-600 p-0.5" : "border-gray-200"}
                `}
              >
                <img
                  src={cat?.coverImage}
                  alt={cat.name}
                  className="object-cover w-full h-full rounded-full aspect-square"
                />
              </div>

              <h5 className="text-center text-sm">{cat.name}</h5>
            </div>
          );
        })}
      </div> */}

      <div className=" mt-6 w-full px-5">
        <Carousel
          withNavigation
          withPagination
          slidesPerView={2.5}
          spaceBetween={20}
          navigationPosition="top-right"
          breakpoints={{
            625: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
            1025: {
              slidesPerView: 8,
              spaceBetween: 30
            },
          }}
          className="!pb-10 max-md:mt-12"
        >
          {categoryOptions.map((cat) => {
            const isSelected = selected === cat.name;
            return (
              <div
                key={cat._id}
                onClick={() => handleSelect(cat.name)}
                className={`
                flex flex-col justify-start gap-2 cursor-pointer transition-all duration-200 flex-shrink-0
                ${isSelected ? "text-indigo-600 font-semibold" : "text-gray-700"}
              `}
              >
                <div
                  className={`
                  mx-auto rounded-full overflow-hidden border-2
                  ${isSelected ? "border-indigo-600 p-0.5" : "border-gray-200"}
                `}
                >
                  <img
                    src={cat?.coverImage}
                    alt={cat.name}
                    className="object-cover w-full h-full rounded-full aspect-square"
                  />
                </div>

                <h5 className="text-center !text-sm">{cat.name}</h5>
              </div>
            );
          })}
        </Carousel>
      </div>

      {/* Ideas List */}
      <div className="mt-8 container mx-auto">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <p className="text-gray-500">Loading ideas...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center justify-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && ideas.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">No ideas found for this selection.</p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && ideas.length > 0 && (
          <div className="flex flex-col gap-16 mt-10 xl:mt-20">
            {ideas.map((idea, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idea._id}
                  className={`
                    flex flex-col md:flex-row gap-12 items-center 
                    ${!isEven ? "md:flex-row-reverse" : ""}
                  `}
                >
                  {/* Gallery */}
                  <div className="w-full md:w-1/2">
                    <IdeaGallery gallery={idea.gallery} />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
                    <h3 className="font-semibold text-2xl mb-2">{idea.title}</h3>
                    <p className="text-gray-600 text-sm">{idea.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default IdeasContainer;
