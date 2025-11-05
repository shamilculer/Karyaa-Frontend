import OverViewStats from "./components/common/OverViewStats";
import VendorSideBar from "./components/common/VendorSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function VendorLayout({ children }) {

    return (
        <SidebarProvider>
            <VendorSideBar />
            <main
                className="w-full lg:w-[calc(100% - var(--sidebar-width))]"
            >

                        <SidebarTrigger />

                <div className="dashboard-container">
                    <OverViewStats />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}