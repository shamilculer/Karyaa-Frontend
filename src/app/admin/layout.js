"use client"
import { Suspense } from "react";
import AdminSidebar from "./components/common/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import OverViewStats from "./components/common/OverviewStatsAdmin";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const showOverviewStats = [
        "/admin/dashboard",
        "/admin/category-management",
        "/admin/vendor-management",
        "/admin/review-management",
        "/admin/analytics-insights/vendor-analytics",
        "/admin/analytics-insights/revenue-analytics",
        "/admin/analytics-insights/platform-analytics",
        "/admin/support-tickets",
        "/admin/ad-management",
        "/admin/bundle-management",
        "/admin/admin-users",
        "/admin/settings",
        "/admin/referrals-management"
    ].includes(pathname);

    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-[50vh] flex-col">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-gray-600">Loading admin...</p>
                </div>
            }
        >
            <SidebarProvider>
                <AdminSidebar />
                <main
                    style={{
                        width: `calc(100% - var(--sidebar-width))`,
                    }}
                >
                    {showOverviewStats && (
                        <div className="dashboard-container">
                            <OverViewStats />
                        </div>
                    )}

                    {children}
                </main>
            </SidebarProvider>
        </Suspense>
    );
}
