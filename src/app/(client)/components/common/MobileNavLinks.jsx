// app/components/MobileNavLinks.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu";

/**
 * Client Component: Contains the mobile menu navigation structure (links, accordion)
 * and handles closing the Sheet on click.
 */
const MobileNavLinks = ({ categories, setOpen, isStoryActive }) => {
    const router = useRouter();
    const [openCategories, setOpenCategories] = useState("");
    const [openSubcategories, setOpenSubcategories] = useState({});

    const handleLinkClick = (href) => {
        // Use router.push to navigate
        router.push(href);
        // Close the Sheet by calling the state setter function passed from the wrapper
        setOpen(false);
    };

    const toggleCategories = (e) => {
        e.stopPropagation();
        setOpenCategories(openCategories === "categories" ? "" : "categories");
    };

    const toggleSubcategory = (e, categorySlug) => {
        e.stopPropagation();
        setOpenSubcategories(prev => ({
            ...prev,
            [categorySlug]: !prev[categorySlug]
        }));
    };

    return (
        <NavigationMenu className="w-full min-w-full justify-start">
            <NavigationMenuList className="w-[280px] flex flex-col items-start gap-0">

                {/* Home Link */}
                <NavigationMenuItem className="w-full border-b border-gray-200" onClick={() => handleLinkClick("/")}>
                    <NavigationMenuLink
                        asChild
                        className="text-lg font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <Link
                            href="/"
                            onClick={(e) => e.preventDefault()}
                            className="block w-full py-3 px-6 rounded-sm"
                        >
                            Home
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Categories Accordion */}
                <div className="w-full border-b border-gray-200">
                    <div className="flex items-center justify-between w-full py-3 px-6 hover:bg-gray-50 transition-colors rounded-sm">
                        <Link
                            href="/categories"
                            className="text-lg font-semibold hover:text-secondary flex-1"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLinkClick("/categories");
                            }}
                        >
                            Categories
                        </Link>
                        <button
                            onClick={toggleCategories}
                            className="p-1.5 hover:bg-gray-200 rounded-md transition-all ml-2"
                            aria-label="Toggle categories"
                        >
                            <ChevronDown
                                className={`size-5 transition-transform duration-200 ${openCategories === "categories" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Categories Content (Sub-links with subcategories) */}
                    {openCategories === "categories" && (
                        <div className="w-full bg-gray-50/50 border-t border-gray-200">
                            {categories.map((cat, index) => (
                                <div
                                    key={index}
                                    className={`w-full ${index !== categories.length - 1 ? 'border-b border-gray-200' : ''}`}
                                >
                                    {/* Category with subcategories - use accordion pattern */}
                                    {cat.subCategories && cat.subCategories.length > 0 ? (
                                        <div className="w-full">
                                            <div className="flex items-center justify-between w-full py-2.5 px-6 hover:bg-gray-100 transition-colors">
                                                <Link
                                                    href={`/categories/${cat.slug}`}
                                                    className="text-base font-medium hover:text-secondary flex-1"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick(`/categories/${cat.slug}`);
                                                    }}
                                                >
                                                    {cat.name}
                                                </Link>
                                                <button
                                                    onClick={(e) => toggleSubcategory(e, cat.slug)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-all ml-2"
                                                    aria-label={`Toggle ${cat.name} subcategories`}
                                                >
                                                    <ChevronDown
                                                        className={`size-4 transition-transform duration-200 ${openSubcategories[cat.slug] ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Subcategories */}
                                            {openSubcategories[cat.slug] && (
                                                <div className="bg-white border-t border-gray-200">
                                                    {cat.subCategories.map((subcat, subIndex) => (
                                                        <NavigationMenuItem
                                                            key={subIndex}
                                                            className={`w-full list-none ${subIndex !== cat.subCategories.length - 1 ? 'border-b border-gray-100' : ''
                                                                }`}
                                                        >
                                                            <NavigationMenuLink
                                                                asChild
                                                                className="text-sm font-normal hover:bg-gray-50 cursor-pointer transition-colors"
                                                            >
                                                                <Link
                                                                    href={`/categories/${cat.slug}/${subcat.slug}`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleLinkClick(`/categories/${cat.slug}/${subcat.slug}`);
                                                                    }}
                                                                    className="block w-full py-2 pl-12 pr-6"
                                                                >
                                                                    {subcat.name}
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </NavigationMenuItem>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Category without subcategories */
                                        <NavigationMenuItem className="w-full list-none">
                                            <NavigationMenuLink
                                                asChild
                                                className="text-base font-medium hover:bg-gray-100 cursor-pointer transition-colors"
                                            >
                                                <Link
                                                    href={`/categories/${cat.slug}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick(`/categories/${cat.slug}`);
                                                    }}
                                                    className="block w-full py-2.5 px-6"
                                                >
                                                    {cat.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Other Main Links */}
                {[
                    { href: "/gallery", name: "Gallery" },
                    ...(isStoryActive ? [{ href: "/story", name: "Our Story" }] : []),
                    { href: "/ideas", name: "Ideas" },
                    { href: "/blog", name: "Blog" },
                    { href: "/contact", name: "Contact" }
                ].map((item, index) => (
                    <NavigationMenuItem
                        key={index}
                        className="w-full border-b border-gray-200"
                        onClick={() => handleLinkClick(item.href)}
                    >
                        <NavigationMenuLink
                            asChild
                            className="text-lg font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <Link
                                href={item.href}
                                onClick={(e) => e.preventDefault()}
                                className="block w-full py-3 px-6 rounded-sm"
                            >
                                {item.name}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default MobileNavLinks;