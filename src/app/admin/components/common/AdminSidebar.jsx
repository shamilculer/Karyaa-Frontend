"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { SquareMenu, ChartPie, Image as ImageIcon, BriefcaseBusiness, Star, ChartNoAxesCombined, Users, Settings, CircleQuestionMark, SquareStack, Headset, ChevronDown } from "lucide-react"

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
} from "@/components/ui/sidebar"
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"

// Assuming 'vendors' utility is available (keeping original import)
import { vendors } from "@/utils"
import Image from "next/image"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: ChartPie,
    },
    {
        title: "Content Moderation",
        icon: ImageIcon,
        isGroup: true,
        children: [
            {
                title: "Blog",
                url: "/admin/content-moderation/blog",
            },
            {
                title: "Ideas",
                url: "/admin/content-moderation/ideas",
            },
            {
                title: "Pages",
                url: "/admin/content-moderation/pages",
            },
            {
                title: "Branding",
                url: "/admin/content-moderation/branding",
            },
        ],
    },
    {
        title: "Category Management",
        url: "/admin/category-management",
        icon: SquareMenu,
    },
    {
        title: "Vendor Management",
        url: "/admin/vendor-management",
        icon: BriefcaseBusiness,
    },
    {
        title: "Review Management",
        url: "/admin/review-management",
        icon: Star,
    },
    {
        title: "Analytics & Insights",
        icon: ChartNoAxesCombined,
        isGroup: true,
        children: [
            {
                title: "Vendor Analytics",
                url: "/admin/analytics-insights/vendor-analytics",
            },

            {
                title: "Revenue Insights",
                url: "/admin/analytics-insights/revenue-insights", // CORRECTED URL TYPO (was vendor-Insights)
            },

            {
                title: "Platform Analytics", // CORRECTED TYPO (was Platfotm)
                url: "/admin/analytics-insights/platform-analytics",
            },
            
        ],
    },
    {
        title: "Support and Tickets",
        url: "/admin/support-tickets",
        icon: Headset,
    },
    {
        title: "Ad Management",
        url: "/admin/ad-management",
        icon: CircleQuestionMark,
    },
    {
        title: "Bundle Management",
        icon: SquareStack,
        isGroup: true,
        children: [
            {
                title: "Bundles",
                url: "/admin/bundle-management",
            },
            {
                title: "Subscribers",
                url: "/admin/bundle-subscribers",
            },
        ],
    },
    {
        title: "Admin Settings",
        url: "/admin/settings",
        icon: Settings,
    },
];

function AdminSidebar() {
    const pathname = usePathname()
    
    // State for the Bundle Management dropdown (EXISTING)
    const [isBundleOpen, setIsBundleOpen] = useState(
        items.find(item => item.isGroup && item.title === "Bundle Management")?.children.some(
            child => pathname === child.url
        ) || false
    );

    // State for Content Moderation dropdown (EXISTING)
    const [isContentOpen, setIsContentOpen] = useState(
        items.find(item => item.isGroup && item.title === "Content Moderation")?.children.some(
            child => pathname === child.url
        ) || false
    );

    // 1. ADD NEW STATE for Analytics & Insights
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(
        items.find(item => item.isGroup && item.title === "Analytics & Insights")?.children.some(
            child => pathname.startsWith(child.url.split('/').slice(0, 3).join('/')) // Use startsWith for parent match
        ) || false
    );

    return (
        <Sidebar>
            <SidebarHeader className="p-7">
                <div className="flex items-center gap-5">
                    <Image width={150} height={40} alt="Logo" className="w-32" src="/logo.svg" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase text-xs text-[#636387]">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                
                                // --- Dropdown Group Logic (For all groups) ---
                                if (item.isGroup) {
                                    const isGroupActive = item.children.some(child => pathname === child.url);
                                    
                                    let isOpen, setIsOpen;
                                    
                                    // Determine which state to use based on the group title
                                    if (item.title === "Bundle Management") {
                                        isOpen = isBundleOpen;
                                        setIsOpen = setIsBundleOpen;
                                    } else if (item.title === "Content Moderation") {
                                        isOpen = isContentOpen;
                                        setIsOpen = setIsContentOpen;
                                    } else if (item.title === "Analytics & Insights") { 
                                        // 2. NEW LOGIC for Analytics & Insights
                                        isOpen = isAnalyticsOpen;
                                        setIsOpen = setIsAnalyticsOpen;
                                    } 
                                    else {
                                        // Fallback for future groups
                                        isOpen = false;
                                        setIsOpen = () => {};
                                    }

                                    return (
                                        <SidebarGroup key={item.title}>
                                            {/* Parent button for the dropdown. Toggles the submenu. */}
                                            <SidebarMenuButton
                                                onClick={() => setIsOpen(prev => !prev)}
                                                className={` px-2
                                                    ${isGroupActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""}
                                                `}
                                            >
                                                <item.icon />
                                                <span className="text-[13px]">{item.title}</span>
                                                <ChevronDown 
                                                    className={`ml-auto h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                                                />
                                            </SidebarMenuButton>

                                            {/* Collapsible Content */}
                                            {isOpen && (
                                                <SidebarGroupContent className="pl-4 pt-1">
                                                    <SidebarMenu>
                                                        {item.children.map(child => {
                                                            const isChildActive = pathname === child.url;
                                                            return (
                                                                <SidebarMenuItem key={child.title}>
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        // Child links use different styling for active state
                                                                        className={`${isChildActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : "text-[#636387]"}`}
                                                                    >
                                                                        <Link href={child.url}>
                                                                            <span className="text-[13px]">{child.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            )
                                                        })}
                                                    </SidebarMenu>
                                                </SidebarGroupContent>
                                            )}
                                        </SidebarGroup>
                                    );
                                }

                                // --- Single Menu Item Logic (Existing) ---
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`px-2 ${isActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""}`}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span className="text-[13px]">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex-center p-7 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <Avatar className="size-10 overflow-hidden border border-gray-300">
                        <AvatarImage className="size-full object-cover" src="/owner.png" />
                        <AvatarFallback>VND</AvatarFallback>
                    </Avatar>
                    <div>
                        <span className="font-heading font-medium leading-[1.2em] text-black">Nora Khuder</span>
                        <span className="text-xs block">Administrator</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar