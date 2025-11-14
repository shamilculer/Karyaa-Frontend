"use client"
import { usePathname } from "next/navigation"
import {
    SquareMenu,
    ChartPie,
    Image as ImageIcon,
    BriefcaseBusiness,
    Star,
    ChartNoAxesCombined,
    Settings,
    CircleQuestionMark,
    SquareStack
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import { getInitials } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { useVendorStore } from "@/store/vendorStore"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/vendor/dashboard",
        icon: ChartPie,
    },
    {
        title: "Leads",
        url: "/vendor/leads",
        icon: BriefcaseBusiness,
    },
    {
        title: "Services and Packages",
        url: "/vendor/packages",
        icon: SquareMenu,
    },
    {
        title: "Analytics",
        url: "/vendor/analytics",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Gallery",
        url: "/vendor/gallery",
        icon: ImageIcon,
    },
    {
        title: "Reviews",
        url: "/vendor/reviews",
        icon: Star,
    },
    {
        title: "Bundles",
        url: "/vendor/bundles",
        icon: SquareStack,
    },
    {
        title: "Settings",
        url: "/vendor/settings",
        icon: Settings,
    },
    {
        title: "Help and Support",
        url: "/vendor/support",
        icon: CircleQuestionMark,
    },
]

function VendorSideBar() {
    const { vendor } = useVendorStore();
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    // Close sidebar on mobile when navigating
    const handleLinkClick = () => {
        setOpenMobile(false);
    };

    // Check if the current path matches or is a sub-route of the menu item
    const isActiveRoute = (url) => {
        // Exact match
        if (pathname === url) return true;

        // Check if pathname starts with the menu url (for sub-routes)
        // For example: /vendor/packages/new should match /vendor/packages
        return pathname.startsWith(url + '/');
    };

    return (
        <Sidebar>
            <SidebarHeader className="py-7 px-4">
                <div className="flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                    <Avatar className="size-10 overflow-hidden">
                        <AvatarImage className="size-full object-cover" src={vendor?.businessLogo || ""} />
                        <AvatarFallback>{getInitials(vendor?.businessName || "")}</AvatarFallback>
                    </Avatar>
                    <span className="font-heading font-medium text-[15px] leading-[1.2em] text-black">{vendor?.businessName}</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase text-xs text-[#636387]">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = isActiveRoute(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={isActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""}
                                        >
                                            <Link href={item.url} onClick={handleLinkClick}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex-center p-7">
                <Link href="/" onClick={handleLinkClick}>
                    <Image width={150} height={40} alt="Logo" className="w-32" src="/logo.svg" />
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}

export default VendorSideBar