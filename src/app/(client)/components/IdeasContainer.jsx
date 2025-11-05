"use client";

import { useEffect, useState } from "react";
import { getAllIdeasAction } from "@/app/actions/ideas";
import IdeaGallery from "./IdeaGallery";
import { Loader2 } from "lucide-react";

function IdeasContainer({ categories }) {
  // Defaults to "all" to fetch all ideas initially
  const [selected, setSelected] = useState("all");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prepend the "All Ideas" option
  const categoryOptions = [ 
    ...categories,
  ];

  const fetchIdeas = async (categoryValue = "") => {
    setLoading(true);
    
    // If categoryValue is "all" or an empty string, we pass an empty string
    // to getAllIdeasAction, which correctly fetches all ideas (since the 
    // category query param will be omitted or empty).
    const categoryId = categoryValue !== "all" ? categoryValue : ""; 

    try {
      // NOTE: This relies on the server-side fix (case-insensitive lookup or
      // fetching by ID if categoryValue is an ID) for the filtering to work.
      const res = await getAllIdeasAction({
        page: 1,
        limit: 20,
        category: categoryId, 
      });

      if (res.success) {
        setIdeas(res.data);
      } else {
        console.error("Failed to fetch ideas:", res.message);
        setIdeas([]);
      }
    } catch (error) {
      console.error("Network error fetching ideas:", error);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This hook runs on mount (selected = "all") and on subsequent changes
    fetchIdeas(selected);
  }, [selected]);

  return (
    <section className="w-full px-5">
      {/* Title */}
      <h2 className="uppercase font-semibold text-xl">Popular Categories</h2>

      {/* Category Tabs */}
      <div className="mt-6 w-full grid grid-cols-8 gap-10 overflow-x-auto pb-4">
        {categoryOptions.map((cat) => {
          const isSelected = selected === cat.name;
          return (
            <div
              key={cat._id}
              onClick={() => setSelected(cat.name)}
              // Styling for selected vs. unselected
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
      </div>


      {/* Ideas */}
      <div className="mt-8 container mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-3" />
            <p className="text-gray-500">Loading ideas...</p>
          </div>
        ) : ideas.length ? (
          <IdeasList ideas={ideas} />
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">No ideas found for this selection.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default IdeasContainer

function IdeasList({ ideas }) {
  return (
    <div className="flex flex-col gap-16 mt-20">
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
            {/* Gallery (50%) */}
            <div className="w-full md:w-1/2">
              <IdeaGallery gallery={idea.gallery} />
            </div>

            {/* Content (50%) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
              <h3 className="font-semibold text-2xl mb-2">{idea.title}</h3>
              <p className="text-gray-600 text-sm">{idea.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}