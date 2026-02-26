"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    SquareMenu,
    ChartPie,
    Image as ImageIcon,
    BriefcaseBusiness,
    Star,
    ChartNoAxesCombined,
    Users,
    Settings,
    CircleQuestionMark,
    ChevronDown,
    Network,
    Megaphone,
    Briefcase,
    Headset,
    SquareStack,
    Mail
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

import Image from "next/image";
import Link from "next/link";

import { useAdminStore } from "@/store/adminStore";
import { getInitials } from "@/utils";
import { AdminDataSync } from "./AdminDataSync";

const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: ChartPie,
        accessKey: "dashboard",
    },
    {
        title: "Content Moderation",
        icon: ImageIcon,
        isGroup: true,
        accessKey: "contentModeration",
        children: [
            { title: "Content", url: "/admin/content-moderation/content" },
            { title: "Blog", url: "/admin/content-moderation/blog" },
            { title: "Ideas", url: "/admin/content-moderation/ideas" },
            { title: "SEO Management", url: "/admin/content-moderation/seo" },
            // { title: "Contact Details", url: "/admin/content-moderation/contact-details" },
        ],
    },
    {
        title: "Category Management",
        url: "/admin/category-management",
        icon: SquareMenu,
        accessKey: "categoryManagement",
    },
    {
        title: "Vendor Management",
        url: "/admin/vendor-management",
        icon: BriefcaseBusiness,
        accessKey: "vendorManagement",
    },
    {
        title: "Review Management",
        url: "/admin/review-management",
        icon: Star,
        accessKey: "reviewManagement",
    },
    {
        title: "Leads Management",
        url: "/admin/leads-management",
        icon: Users,
        accessKey: "leadsManagement",
    },
    {
        title: "Analytics & Insights",
        icon: ChartNoAxesCombined,
        isGroup: true,
        accessKey: "analyticsInsights",
        children: [
            { title: "Vendor Analytics", url: "/admin/analytics-insights/vendor-analytics" },
            { title: "Revenue Insights", url: "/admin/analytics-insights/revenue-insights" },
            { title: "Platform Analytics", url: "/admin/analytics-insights/platform-analytics" },
        ],
    },
    {
        title: "Ad Management",
        url: "/admin/ad-management",
        icon: CircleQuestionMark,
        accessKey: "adManagement",
    },
    {
        title: "Bundle Management",
        url: "/admin/bundle-management",
        icon: SquareStack,
        accessKey: "bundleManagement",
    },
    {
        title: "Careers",
        icon: Briefcase,
        isGroup: true,
        accessKey: "careersManagement",
        children: [
            { title: "Job Postings", url: "/admin/careers/job-postings" },
            { title: "Job Applications", url: "/admin/careers/job-applications" },
        ],
    },
    {
        title: "Complaint Management",
        url: "/admin/complaints",
        icon: Megaphone,
        accessKey: "complaintManagement",
    },
    {
        title: "Support and Tickets",
        url: "/admin/support-tickets",
        icon: Headset,
        accessKey: "supportTickets",
    },
    {
        title: "Newsletter Subscribers",
        url: "/admin/newsletter-subscribers",
        icon: Mail,
        accessKey: "newsletterManagement",
    },
    {
        title: "Referrals Management",
        url: "/admin/referrals-management",
        icon: Network,
        accessKey: "referralManagement",
    },
    {
        title: "Admin Users",
        url: "/admin/admin-users",
        icon: Users,
        accessKey: "adminUserSettings",
    },
    {
        title: "Admin Settings",
        url: "/admin/settings",
        icon: Settings,
        accessKey: "adminSettings",
    },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { admin } = useAdminStore();
    const { setOpenMobile } = useSidebar();
    const [openGroups, setOpenGroups] = useState({});

    // Close sidebar on mobile when navigating
    const handleLinkClick = () => {
        setOpenMobile(false);
    };

    // auto-open correct group on load and route change
    useEffect(() => {
        items.forEach((item) => {
            if (item.isGroup) {
                const active = item.children.some((child) =>
                    pathname.startsWith(child.url)
                );
                if (active) {
                    setOpenGroups((prev) => ({
                        ...prev,
                        [item.title]: true,
                    }));
                }
            }
        });
    }, [pathname]);

    const toggleGroup = (title) => {
        setOpenGroups((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const filteredItems =
        admin?.adminLevel === "admin"
            ? items
            : items.filter((item) => {
                if (item.isGroup) return admin?.accessControl?.[item.accessKey];
                return admin?.accessControl?.[item.accessKey];
            });

    return (
        <Sidebar>
            <SidebarHeader className="p-7">
                <AdminDataSync currentAdminId={admin?.id || admin?._id} />
                <div className="flex items-center gap-5">
                    <Image width={150} height={40} alt="Logo" className="w-32" src="/logo.svg" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase text-xs text-[#636387]">
                        Menu
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => {
                                // GROUP
                                if (item.isGroup) {
                                    const groupActive = item.children.some((child) =>
                                        pathname.startsWith(child.url)
                                    );

                                    return (
                                        <SidebarGroup key={item.title}>
                                            <SidebarMenuButton
                                                onClick={() => toggleGroup(item.title)}
                                                className={`px-2 ${groupActive
                                                    ? "bg-primary text-white hover:bg-primary/90"
                                                    : ""
                                                    }`}
                                            >
                                                <item.icon />
                                                <span className="text-[13px]">{item.title}</span>
                                                <ChevronDown
                                                    className={`ml-auto h-4 w-4 transition-transform ${openGroups[item.title] ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </SidebarMenuButton>

                                            {openGroups[item.title] && (
                                                <SidebarGroupContent className="pl-4 pt-1">
                                                    <SidebarMenu>
                                                        {item.children.map((child) => {
                                                            const childActive = pathname === child.url;
                                                            return (
                                                                <SidebarMenuItem key={child.title}>
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        className={`${childActive
                                                                            ? "bg-primary text-white"
                                                                            : "text-[#636387]"
                                                                            }`}
                                                                    >
                                                                        <Link href={child.url} onClick={handleLinkClick}>
                                                                            <span className="text-[13px]">
                                                                                {child.title}
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            );
                                                        })}
                                                    </SidebarMenu>
                                                </SidebarGroupContent>
                                            )}
                                        </SidebarGroup>
                                    );
                                }

                                // SINGLE
                                const isActive = pathname.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`px-2 ${isActive
                                                ? "bg-primary text-white hover:bg-primary/90"
                                                : ""
                                                }`}
                                        >
                                            <Link href={item.url} onClick={handleLinkClick}>
                                                <item.icon />
                                                <span className="text-[13px]">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="flex-center py-7 px-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <Avatar className="size-10 overflow-hidden border border-gray-300">
                        <AvatarImage className="size-full object-cover" src={admin?.profileImage} />
                        <AvatarFallback>{getInitials(admin?.fullName || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <span className="font-heading font-medium text-black">
                            {admin?.fullName}
                        </span>
                        <span className="text-xs block">Administrator</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AdminSidebar;
