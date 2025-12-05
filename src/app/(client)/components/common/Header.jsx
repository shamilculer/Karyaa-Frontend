// app/components/Header.jsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";


import UserMenu from "../ui/UserDropDownMenu"; // This is your client component
import { checkAuthStatus } from "../../../actions/user/user";
import { getCategoriesWithVendors } from "@/app/actions/public/categories";
import MobileSheetWrapper from "./MobileSheetWrapper"; // 👈 New Import

const Header = async () => {
    const categoriesResponse = await getCategoriesWithVendors();
    const { isAuthenticated, user } = await checkAuthStatus("user", true);

    const categories = categoriesResponse.categories || [];

    return (
        <header className="sticky top-0 bg-[#FFFEF9] z-[1000]">

            {/* -------------------- Desktop Header (Unchanged) -------------------- */}
            <div className="hidden lg:flex w-full py-4 h-[80px] border-b border-gray-300 items-center">
                <div className="container flex items-center justify-between">
                    {/* Left Navigation */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer pl-0"
                                >
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Categories Dropdown */}
                            <NavigationMenuItem className="relative">
                                <NavigationMenuTrigger className="text-sm font-semibold cursor-pointer hover:text-secondary hover:bg-primary/10">
                                    <Link href="/categories">Categories</Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="!left-0 !top-0 mt-2 bg-white border border-gray-200 shadow-xl">
                                    <div className="w-56 bg-white">
                                        {categories.map((cat, index) => (
                                            <div key={index} className="group relative">
                                                <Link
                                                    href={`/categories/${cat.slug}`}
                                                    className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {cat.name}
                                                </Link>

                                                {cat.subCategories && cat.subCategories.length > 0 && (
                                                    <div className="absolute left-full top-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white border border-gray-200 shadow-lg min-w-[530px] p-4 transition-all duration-200 ease-in-out">
                                                        <ul className="space-y-1">
                                                            {cat.subCategories.map((subCat, idx) => (
                                                                <li key={idx}>
                                                                    <Link
                                                                        href={`/categories/${cat.slug}/${subCat.slug}`}
                                                                        className="text-sm text-gray-700 hover:text-secondary hover:underline"
                                                                    >
                                                                        {subCat.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer"
                                >
                                    <Link href="/gallery">Gallery</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-4">
                            <Image
                                src="/logo.svg"
                                alt="Karyaa"
                                width={132}
                                height={24}
                                className={`w-44 ${isAuthenticated ? "ml-16" : "ml-10"}`}
                            />
                        </Link>
                    </div>

                    {/* Right Navigation */}
                    <div className="flex items-center gap-5">
                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-4">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer"
                                    >
                                        <Link href="/ideas">Ideas</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer"
                                    >
                                        <Link href="/blog">Blog</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer"
                                    >
                                        <Link href="/contact">Contact</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Login/Profile - Using UserMenu client component */}
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <Button asChild>
                                <Link href="/auth/register">Login/Signup</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* -------------------- Mobile Header (Updated) -------------------- */}
            <div className="flex lg:hidden w-full py-4 h-[65px] border-b border-gray-300 items-center">
                <div className="container flex items-center justify-between">

                    {/* 1. Mobile Sheet Wrapper */}
                    <MobileSheetWrapper
                        isAuthenticated={isAuthenticated}
                        user={user}
                        categories={categories}
                    />

                    <Link href="/" className="flex-center gap-2 w-1/3">
                        <Image src="/logo.svg" alt="Karyaa" className={`!min-w-28 sm:ml-10`} width={130} height={20} />
                    </Link>

                    <div className="w-1/3 flex justify-end">
                        {/* Mobile Login/Profile - Using UserMenu client component */}
                        {isAuthenticated ? (
                            <UserMenu user={user} isMobile={true} />
                        ) : (
                            <Button asChild variant="ghost" className="!p-0 text-xs">
                                <Link href="/auth/register">Login / SignUp</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;