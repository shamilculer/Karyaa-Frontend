"use client"
import { usePathname } from "next/navigation"
import { SquareMenu, ChartPie, Image as ImageIcon, BriefcaseBusiness, Star, ChartNoAxesCombined, Users, Settings, CircleQuestionMark } from "lucide-react"

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

import { vendors } from "@/utils"
import Image from "next/image"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/vendor/dashboard",
        icon: ChartPie,
    },
    {
        title: "Gallery",
        url: "/vendor/gallery",
        icon: ImageIcon,
    },
    {
        title: "Services and Packages",
        url: "/vendor/service-and-packages",
        icon: SquareMenu,
    },
    {
        title: "Leads",
        url: "/vendor/leads",
        icon: BriefcaseBusiness,
    },
    {
        title: "Reviews",
        url: "/vendor/reviews",
        icon: Star,
    },
     {
        title: "Analytics",
        url: "/vendor/analytics",
        icon: ChartNoAxesCombined,
    },
     {
        title: "Users",
        url: "/vendor/users",
        icon: Users,
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
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="p-7">
                <div className="flex items-center gap-5">
                    <Avatar className="size-10 overflow-hidden">
                        <AvatarImage className="size-full object-cover" src={vendors[0].image} />
                        <AvatarFallback>VND</AvatarFallback>
                    </Avatar>

                    <span className="font-heading font-semibold leading-[1.2em] text-black">{vendors[0].name}</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase text-xs text-[#636387]">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild
                                            className={isActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""}
                                        >
                                            <Link href={item.url}>
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
              <Image width={150} height={40} alt="Logo" className="w-32" src="/logo.svg" />
            </SidebarFooter>
        </Sidebar>
    )
}

export default VendorSideBar