import AdminSidebar from "./components/common/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ClientLayout({ children }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
                <main
                    style={{
                        width: `calc(100% - var(--sidebar-width))`,
                    }}
                >
                    {children}
                </main>
        </SidebarProvider>
    );
}