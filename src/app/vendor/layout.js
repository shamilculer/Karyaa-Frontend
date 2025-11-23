import OverViewStats from "./components/common/OverViewStats";
import VendorSideBar from "./components/common/VendorSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorDataSync } from "./components/common/VendorDataSync";
import { cookies } from "next/headers";
import { decodeJWT } from "@/utils/decodeJWT";

export default async function VendorLayout({ children }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken_vendor")?.value;
    let vendorId = null;

    if (accessToken) {
        const decoded = decodeJWT(accessToken);
        vendorId = decoded?.id;
    }

    return (
        <SidebarProvider>
            <VendorDataSync currentVendorId={vendorId} />
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