"use client"
import AdminSidebar from "./components/common/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import OverViewStats from "./components/common/OverviewStatsAdmin";
import { usePathname } from "next/navigation";

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
        "/admin/settings"
    ].includes(pathname);

    return (
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
    );
}
