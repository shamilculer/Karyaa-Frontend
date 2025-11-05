import { getAllIdeaCategoriesAction } from "@/app/actions/ideas";
import IdeasTable from "../../components/tables/IdeasTable";

const IdeasManagementPage = async () => {
    // Fetch categories for the filter dropdown
    const categoriesResult = await getAllIdeaCategoriesAction({role: "admin"});
    const categories = categoriesResult.success ? categoriesResult.data : [];

    return (
        <div className="h-full dashboard-container space-y-8">
            <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest'>
                Idea Management
            </span>
            <IdeasTable categories={categories} />
        </div>
    );
};

export default IdeasManagementPage;