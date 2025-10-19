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

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { categoriesMenu } from "@/utils";
import { Menu } from "lucide-react";
import { checkAuthStatus } from "../../../actions/user/auth";

import LogoutAlertModal from "@/app/auth/components/LogoutAlertModal";

const Header = async () => {
    const { isAuthenticated, user } = await checkAuthStatus();

    return (
        <header className="sticky top-0 bg-[#FFFEF9] z-50">
            {/* Desktop Header */}
            <div className="hidden lg:flex w-full py-4 h-[90px] border-b border-gray-300 items-center">
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
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-semibold cursor-pointer hover:text-secondary hover:bg-primary/10">
                                    <Link href="/categories">Categories</Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="w-full min-w-[var(--container-width)] p-0 bg-[#F8FAFC] shadow-lg">
                                    <div className="flex">
                                        {/* Main Categories (Left Column) */}
                                        <div className="w-48 border-r border-gray-200 p-8 bg-white">
                                            {categoriesMenu.map((cat, index) => (
                                                <div key={index} className="py-1">
                                                    <Link
                                                        href={`/categories/${cat.slug}`}
                                                        className="block px-2 py-1 text-sm hover:text-blue-600 font-semibold"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Subcategories Grid (Right Column) */}
                                        <div className="flex-1 grid grid-cols-5 gap-4 p-8">
                                            {categoriesMenu.map((cat, index) => (
                                                <div key={index}>
                                                    <h4 className="text-sm font-semibold mb-2">
                                                        {cat.name}
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {cat.subcategories.map((subCat, idx) => (
                                                            <li key={idx}>
                                                                <Link
                                                                    href={`/categories/${cat.slug}/${subCat.slug}`}
                                                                    className="text-sm text-gray-700 hover:underline hover:text-secondary"
                                                                >
                                                                    {subCat.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer"
                                >
                                    <Link href="/vendors">Vendors</Link>
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
                                className=""
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

                        {/* ✅ Conditional Login/Profile */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="!border border-gray-300 p-1 pr-1.5 h-10">
                                        <Image
                                            src={user?.profileImage || "/default-avatar.png"}
                                            alt="User"
                                            width={36}
                                            height={36}
                                            className="rounded-full size-8 border border-gray-300"
                                        />
                                        <span className="text-sm font-semibold">{user?.username || "User"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">My Orders</Link>
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

                            <div className="p-6 pt-3">
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

                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1" className="w-full">
                                                <AccordionTrigger className="w-full text-lg font-medium font-sans hover:underline hover:text-secondary cursor-pointer p-0">Categories</AccordionTrigger>
                                                <AccordionContent className="w-full">
                                                    {categoriesMenu.map((cat, index) => (
                                                        <NavigationMenuItem key={index} className="w-full">
                                                            <NavigationMenuLink
                                                                asChild
                                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                                            >
                                                                <Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
                                                            </NavigationMenuLink>
                                                        </NavigationMenuItem>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className="text-lg font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/gallery">Gallery</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
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
                                                className="text-sm font-semibold hover:underline hover:text-secondary cursor-pointer p-0"
                                            >
                                                <Link href="/contact">Contact</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>

                            <SheetFooter>
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
                                    <Button asChild className="max-md:py-2 max-md:px-3 !h-auto text-xs" >
                                        <Link href="/auth/register">Login / SignUp</Link>
                                    </Button>
                                )}
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
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
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
