// app/components/MobileNavLinks.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
const MobileNavLinks = ({ categories, setOpen }) => {
    const router = useRouter();

    const handleLinkClick = (href) => {
        // Use router.push to navigate
        router.push(href);
        // Close the Sheet by calling the state setter function passed from the wrapper
        setOpen(false);
    };

    return (
        <NavigationMenu className="w-full max-w-full justify-start">
            <NavigationMenuList className="w-full flex flex-col items-start gap-6">
                
                {/* Home Link */}
                <NavigationMenuItem onClick={() => handleLinkClick("/")}>
                    <NavigationMenuLink
                        asChild
                        className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                    >
                        {/* Prevent default navigation here since handleLinkClick does the navigation */}
                        <Link href="/" onClick={(e) => e.preventDefault()}>Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Categories Accordion */}
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                >
                    <AccordionItem value="item-1" className="w-full border-b-0">
                        
                        {/* Categories Header Link */}
                        <AccordionTrigger
                            className="w-full text-base hover:underline hover:text-secondary cursor-pointer p-0 gap-10"
                            // Use handleLinkClick to navigate and close the sheet
                            onClick={() => handleLinkClick("/categories")} 
                        >
                            <Link href="/categories" className="!no-underline text-lg !font-body font-semibold mt-1" onClick={(e) => e.preventDefault()}>
                                Categories
                            </Link>
                        </AccordionTrigger>
                        
                        {/* Categories Content (Sub-links) */}
                        <AccordionContent className="w-full pl-4 space-y-2 mt-4">
                            {categories.map((cat, index) => (
                                <NavigationMenuItem key={index} className="w-full list-none">
                                    <NavigationMenuLink
                                        asChild
                                        className="text-base font-medium hover:underline hover:text-secondary cursor-pointer p-0"
                                        onClick={() => handleLinkClick(`/categories/${cat.slug}`)} // Navigate and close
                                    >
                                        <Link href={`/categories/${cat.slug}`} onClick={(e) => e.preventDefault()}>
                                            {cat.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Other Main Links */}
                {[
                    { href: "/gallery", name: "Gallery" },
                    { href: "/ideas", name: "Ideas" },
                    { href: "/blog", name: "Blog" },
                    { href: "/contact", name: "Contact" }
                ].map((item, index) => (
                    <NavigationMenuItem key={index} onClick={() => handleLinkClick(item.href)}>
                        <NavigationMenuLink
                            asChild
                            className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                        >
                            <Link href={item.href} onClick={(e) => e.preventDefault()}>{item.name}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default MobileNavLinks;