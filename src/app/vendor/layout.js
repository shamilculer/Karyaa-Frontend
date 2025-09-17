import VendorSideBar from "./components/common/VendorSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ClientLayout({ children }) {
    return (
        <SidebarProvider>
            <VendorSideBar />
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