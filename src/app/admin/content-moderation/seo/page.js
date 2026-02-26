"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search, Loader2, Globe, File, Tag } from "lucide-react";
import EditSeoModal from "@/app/admin/components/modals/seo/EditSeoModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getStaticSeoDataAction, getCategoriesSeoDataAction, getSubCategoriesSeoDataAction } from "@/app/actions/admin/seo";

export default function SeoManagementPage() {
    const [activeTab, setActiveTab] = useState("static");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Initial fetched data for static pages if not in DB yet
    const defaultStaticPages = [
        { pageIdentifier: "home", route: "/", metaTitle: "Karyaa | Find the Best Event Vendors in UAE", metaDescription: "Plan your perfect event with Karyaa. Connect with top-rated photographers, venues, caterers, and more across the UAE." },
        { pageIdentifier: "categories", route: "/categories", metaTitle: "Event Vendor Categories | Karyaa", metaDescription: "Browse all event vendor categories including photographers, venues, caterers, and more to plan your perfect event." },
        { pageIdentifier: "contact", route: "/contact", metaTitle: "Contact Us | Karyaa", metaDescription: "Get in touch with the Karyaa team. We are here to help you with your event planning needs." },
        { pageIdentifier: "blog", route: "/blog", metaTitle: "Event Planning Ideas & Tips | Karyaa Blog", metaDescription: "Discover the latest trends, tips, and inspiration for your next event on the Karyaa blog." },
        { pageIdentifier: "gallery", route: "/gallery", metaTitle: "Event Inspiration Gallery | Karyaa", metaDescription: "Browse our gallery of stunning events and get inspired for your own celebration." },
        { pageIdentifier: "ideas", route: "/ideas", metaTitle: "Event Themes & Ideas | Karyaa", metaDescription: "Explore unique themes and creative ideas to make your event truly unforgettable." },
        { pageIdentifier: "compare", route: "/compare", metaTitle: "Compare Vendors | Karyaa", metaDescription: "Compare different vendors side-by-side to find the perfect match for your event budget and style." },
        { pageIdentifier: "careers", route: "/careers", metaTitle: "Careers at Karyaa | Join Our Team", metaDescription: "Explore exciting career opportunities at Karyaa. Join our growing team and help shape the future of event planning in the UAE." },
        { pageIdentifier: "our-story", route: "/story", metaTitle: "Our Story | Karyaa", metaDescription: "Learn about Karyaa's journey, our mission, and the passionate team behind the UAE's leading event planning marketplace." },
        { pageIdentifier: "media-kit", route: "/media-kit", metaTitle: "Media Kit | Karyaa", metaDescription: "Download Karyaa's media kit for brand assets, press materials, and everything you need to feature us in your publication." },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            let result = { success: false, data: [] };
            if (activeTab === "static") {
                result = await getStaticSeoDataAction();
            } else if (activeTab === "categories") {
                result = await getCategoriesSeoDataAction();
            } else if (activeTab === "subcategories") {
                result = await getSubCategoriesSeoDataAction();
            }

            let fetchedData = result.success ? result.data : [];

            // Merge defaults for static pages if they don't exist in DB yet
            if (activeTab === "static") {
                const merged = defaultStaticPages.map(def => {
                    const found = fetchedData.find(d => d.pageIdentifier === def.pageIdentifier);
                    return found || def;
                });
                // Also add any new ones from DB that might not be in defaults (e.g. dynamically added later)
                fetchedData.forEach(d => {
                    if (!defaultStaticPages.find(def => def.pageIdentifier === d.pageIdentifier)) {
                        merged.push(d);
                    }
                });
                fetchedData = merged;
            }

            setData(fetchedData);
            setFilteredData(fetchedData);
            if (!result.success && result.message) {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch SEO data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setSearchQuery("");
    }, [activeTab]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredData(data);
        } else {
            const lower = searchQuery.toLowerCase();
            const filtered = data.filter(item =>
                (item.name && item.name.toLowerCase().includes(lower)) ||
                (item.pageIdentifier && item.pageIdentifier.toLowerCase().includes(lower)) ||
                (item.metaTitle && item.metaTitle.toLowerCase().includes(lower))
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div>
                <span className="text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest">
                    Metadata Management
                </span>
                <div className="text-sm text-gray-600">
                    Manage meta tags and OpenGraph data for client pages.
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <TabsList className="bg-white border p-1 h-auto rounded-lg shadow-sm">
                        <TabsTrigger
                            value="static"
                            className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer gap-2 transition-all"
                        >
                            <Globe className="w-5 h-5" /> Static Pages
                        </TabsTrigger>
                        <TabsTrigger
                            value="categories"
                            className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer gap-2 transition-all"
                        >
                            <File className="w-5 h-5" /> Categories
                        </TabsTrigger>
                        <TabsTrigger
                            value="subcategories"
                            className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white cursor-pointer gap-2 transition-all"
                        >
                            <Tag className="w-5 h-5" /> Subcategories
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-600" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[200px]">Name / Identifier</TableHead>
                                <TableHead>Meta Title</TableHead>
                                <TableHead className="hidden md:table-cell">Meta Description</TableHead>
                                {activeTab === 'subcategories' && <TableHead>Main Category</TableHead>}
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-600">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <TableRow key={item._id || idx}>
                                        <TableCell className="font-medium">
                                            {activeTab === "static" ? (
                                                <div className="flex flex-col">
                                                    <span className="capitalize font-semibold">
                                                        {item.pageIdentifier ? item.pageIdentifier.replace(/-/g, ' ') : 'Unknown Page'}
                                                    </span>
                                                    <span className="text-xs text-gray-600">{item.route || 'No route'}</span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{item.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.metaTitle ? (
                                                <span className="text-sm truncate max-w-[200px] block" title={item.metaTitle}>{item.metaTitle}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Not set</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {item.metaDescription ? (
                                                <span className="text-sm truncate max-w-[300px] block text-gray-600" title={item.metaDescription}>{item.metaDescription}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Not set</span>
                                            )}
                                        </TableCell>
                                        {activeTab === 'subcategories' && (
                                            <TableCell>
                                                {item.mainCategory?.name && <Badge variant="outline">{item.mainCategory.name}</Badge>}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4 text-blue-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>

            {/* Edit Modal */}
            {
                selectedItem && (
                    <EditSeoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        type={activeTab === 'subcategories' ? 'subcategory' : activeTab === 'categories' ? 'category' : 'static'}
                        data={selectedItem}
                        onSuccess={fetchData}
                    />
                )
            }
        </div>
    );
}
