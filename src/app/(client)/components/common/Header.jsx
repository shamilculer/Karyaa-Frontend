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

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LogoutAlertModal from "@/app/auth/components/LogoutAlertModal";
import { Heart, Menu } from "lucide-react";
import { checkAuthStatus } from "../../../actions/user/user";
import { getCategories } from "@/app/actions/categories";

const Header = async () => {
    const categoriesResponse = await getCategories();
    const { isAuthenticated, user } = await checkAuthStatus();

    const categories = categoriesResponse.categories || [];

    return (
        <header className="sticky top-0 bg-[#FFFEF9] z-50">
            {/* Desktop Header */}
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

                            {/* ✅ Fixed Categories Dropdown */}
                            <NavigationMenuItem className="relative"> {/* Added relative here */}
                                <NavigationMenuTrigger className="text-sm font-semibold cursor-pointer hover:text-secondary hover:bg-primary/10">
                                    <Link href="/categories">Categories</Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="!left-0 !top-0 mt-2 bg-white border border-gray-200 shadow-xl">
                                    {/* Main Categories */}
                                    <div className="w-56 bg-white">
                                        {categories.map((cat, index) => (
                                            <div key={index} className="group relative">
                                                <Link
                                                    href={`/categories/${cat.slug}`}
                                                    className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {cat.name}
                                                </Link>

                                                {/* Subcategories */}
                                                {cat.subCategories && cat.subCategories.length > 0 && (
                                                    <div className="absolute left-full top-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white border border-gray-200 shadow-lg min-w-[230px] p-4 transition-all duration-200 ease-in-out">
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
                                className="w-44"
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

                        {/* Login/Profile */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="!border border-gray-300 p-1 pr-1.5 h-10">
                                        <Image
                                            src={user?.profileImage || "/default-avatar.png"}
                                            alt={user.username || "user"}
                                            width={36}
                                            height={36}
                                            className="rounded-full size-8 border border-gray-300"
                                        />
                                        <span className="text-sm font-semibold ml-0">
                                            {user?.username || "User"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/saved-vendors">
                                            <Heart className="h-4 w-4 mr-2" />Saved Vendors
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <LogoutAlertModal />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild>
                                <Link href="/auth/register">Login/Signup</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex lg:hidden w-full py-4 h-[65px] border-b border-gray-300 items-center">
                <div className="container flex items-center justify-between">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="!p-0 w-1/3 flex justify-start">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader className="border-b border-gray-200">
                                <SheetTitle>
                                    <Link href="/">
                                        <Image src="/logo.svg" alt="Karyaa" width={120} height={20} />
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="p-6 pt-3 w-full">
                                <NavigationMenu className="w-full max-w-full justify-start" >
                                    <NavigationMenuList className="w-full flex flex-col items-start gap-6">
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/">Home</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>

                                        {/* 👇 UPDATED CATEGORIES ACCORDION 👇 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1" className="w-full border-b-0">
                                                <AccordionTrigger className="w-full text-base hover:underline hover:text-secondary cursor-pointer p-0 gap-10">
                                                    <Link href="/categories" className="!no-underline text-lg !font-body font-semibold mt-1">
                                                        Categories
                                                    </Link>
                                                </AccordionTrigger>
                                                <AccordionContent className="w-full pl-4 space-y-2 mt-4">
                                                    {categories.map((cat, index) => ( // Using fetched 'categories'
                                                        <NavigationMenuItem key={index} className="w-full list-none">
                                                            <NavigationMenuLink
                                                                asChild
                                                                className="text-base font-medium hover:underline hover:text-secondary cursor-pointer p-0"
                                                            >
                                                                <Link href={`/categories/${cat.slug}`}>
                                                                    {cat.name}
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </NavigationMenuItem>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 👆 END UPDATED CATEGORIES ACCORDION 👆 */}

                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/vendors">Vendors</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>

                                        {/* You had /gallery here, but the desktop version has /ideas. Keeping /ideas for consistency. */}
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/ideas">Ideas</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>

                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/blog">Blog</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>

                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/contact">Contact</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>

                            <SheetFooter className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-200">
                                <div className="w-full flex justify-between items-center">
                                    {isAuthenticated ? (
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={user?.profileImage || "/default-avatar.png"}
                                                alt="User"
                                                width={32}
                                                height={32}
                                                className="rounded-full border"
                                            />
                                            <span className="text-sm font-semibold">{user?.name || "User"}</span>
                                        </div>
                                    ) : (
                                        // Moved the button logic outside the SheetFooter's default slot
                                        <Button asChild className="max-md:py-2 max-md:px-3 !h-auto text-xs" >
                                            <Link href="/auth/register">Login / SignUp</Link>
                                        </Button>
                                    )}
                                    {/* Added a placeholder for the logout button if authenticated */}
                                    {isAuthenticated && (
                                        <LogoutAlertModal isMobile={true} />
                                    )}
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex-center gap-2 w-1/3">
                        <Image src="/logo.svg" alt="Karyaa" className="!min-w-28" width={130} height={20} />
                    </Link>

                    <div className="w-1/3 flex justify-end">
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-0">
                                        <Image
                                            src={user?.profileImage || "/default-avatar.png"}
                                            alt="User"
                                            width={32}
                                            height={32}
                                            className="rounded-full size-9 border border-gray-300"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40">
                                    <DropdownMenuItem asChild>
                                        <Link href="/saved-vendors"><Heart className="h-4 w-4 mr-2" />Saved Vendors</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <LogoutAlertModal />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild variant="ghost" className="!p-0 text-xs">
                                <Link href="/auth/create-account">Login / SignUp</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
