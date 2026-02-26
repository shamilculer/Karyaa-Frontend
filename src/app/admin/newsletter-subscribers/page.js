import NewsletterSubscribersTable from "../components/tables/NewsletterSubscribersTable";

export const metadata = {
    title: "Newsletter Subscribers | Karyaa Admin",
    description: "Manage and export newsletter subscribers",
};

export default function NewsletterSubscribersPage() {
    return (
        <div className="mb-12 dashboard-container space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="!text-xl uppercase font-bold tracking-tight text-gray-900">Newsletter Subscribers</h1>
                    <p className="!text-sm text-gray-500 mt-1">
                        View, search, and export users who have subscribed to the newsletter.
                    </p>
                </div>
            </div>
            
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <NewsletterSubscribersTable />
            </div>
        </div>
    );
}
