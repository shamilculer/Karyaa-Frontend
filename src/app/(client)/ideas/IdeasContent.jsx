import IdeasContainer from "../components/features/ideas/IdeasContainer";
import { getAllIdeaCategoriesAction } from "@/app/actions/public/ideas";

export default async function IdeasContent() {
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

    if (error) {
        return (
            <div className="flex justify-center py-16">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <p className="text-gray-500">No categories found.</p>
            </div>
        );
    }

    return <IdeasContainer categories={categories} />;
}
