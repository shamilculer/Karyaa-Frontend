import { Carousel } from "@/components/ui/carousel"
import OverViewStats from "../components/common/OverviewStatsAdmin"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Added Table components and DropdownMenu for actions

import { IconCircleFilled } from "@tabler/icons-react";
import { FileEdit, ShieldMinus, Trash, Search, Plus, MoreVertical, Ban, Check, Users } from "lucide-react";

// --- Mock Data ---
const vendorAds = [
    { id: 1, img: "/ads/ad-banner-2.webp", alt: "Wedding background" },
    { id: 2, img: "/ads/ad-banner-4.webp", alt: "Floral decoration ad" },
    { id: 3, img: "/ads/ad-banner-3.webp", alt: "Photography ad" },
];


// --- Component ---
const AdManagementPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            {/* Top Row KPIs */}
            <div className="grid grid-cols-3 gap-20">
                {/* ... (Your existing KPI blocks) ... */}
                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Total Banner Ads Running</span>
                        <div className="mt-3 text-3xl flex items-end font-semibold leading-6">134</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Total Vendors in Karyaa Recommends</span>
                        <div className="mt-3 text-3xl flex items-end font-semibold leading-6">48</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Total Revenue From Ads</span>
                        <div className=" text-3xl flex items-end font-semibold"><span className="!text-base mr-1">AED</span> 55000/-</div>
                    </div>
                </div>
            </div>

            {/* Ad Banner Management Section */}
            <div className="p-7 bg-white border border-gray-200 space-y-5">
                <div>
                    <span className="uppercase text-sidebar-foreground tracking-widest" >Ad Banner Management</span>
                </div>

                {/* Search, Filters, and Action Buttons (already implemented) */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by Vendor or Ad ID..."
                                className="w-64 pl-10"
                            />
                        </div>
                        <Select defaultValue="active">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending Review</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="deactivated">Deactivated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="homepage-carousel">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Slot" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="homepage-carousel">Homepage Carousel</SelectItem>
                                <SelectItem value="category-top">Category Page Top</SelectItem>
                                <SelectItem value="search-sidebar">Search Sidebar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-5 mr-2" />
                        Upload New Banner
                    </Button>
                </div>
                {/* End Search, Filters, and Action Buttons */}


                {/* Homepage Banners Carousel (Ad Visualizer) */}
                <div className="w-full">
                    <Carousel
                        slidesPerView={1}
                        // ... (Carousel props) ...
                    >
                        {vendorAds.map((ad) => (
                            <div className="group relative" key={ad.id}>
                                <Image
                                    src={ad.img}
                                    alt={ad.alt}
                                    width={1300}
                                    height={500}
                                    className="w-full object-cover"
                                />
                                <Badge className="absolute top-5 left-5 bg-green-100 text-green-700 rounded-xl flex gap-1 text-base !font-medium leading-0 py-2 px-3 z-[100]" > <IconCircleFilled /> Active</Badge>
                                <span className="text-white font-semibold text-lg absolute top-5 right-5 z-[100]">Banner Name</span>
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex justify-center items-center gap-5">
                                    <Button className="hover:text-white"><FileEdit className="w-5 mr-2" /> Edit</Button>
                                    <Button variant="destructive" className="hover:text-white"><Trash className="w-5 mr-2" /> Delete</Button>
                                    <Button className="bg-white text-black hover:bg-gray-100"><ShieldMinus className="w-5 mr-2" /> Deactivate</Button>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

        </div>
    )
}

export default AdManagementPage