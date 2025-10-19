import { getCategories } from "../../../actions/categories";
import CategoriesList from "./CategoriesList";


const CategoryFetcher = async () => {
    let categories = [];
    try {
        const response = await getCategories();
        categories = response.categories || []; 
    } catch (error) {
        console.error("Failed to load categories:", error);
    }

    return <CategoriesList initialCategories={categories} />;
};

export default CategoryFetcher;

// --- Loading Fallback UI ---
// This simple component defines what the Suspense boundary will display while fetching
export const CategoryListFallback = () => (
    <div className="hidden lg:flex gap-2 lg:gap-4 h-80 w-full">
        {/* Render 5 simple skeleton bars for the desktop accordion view */}
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 h-full bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
    </div>
    // You could also add a fallback for the mobile grid here if needed
);