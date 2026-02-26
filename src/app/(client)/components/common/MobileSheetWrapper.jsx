"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Assuming these paths are correct relative to this component's location
import LogoutAlertModal from "@/app/auth/components/LogoutAlertModal";
import UserMenu from "../ui/UserDropDownMenu";
import MobileNavLinks from "./MobileNavLinks";

/**
 * Client Component: Manages the open/close state of the mobile menu Sheet.
 */
const MobileSheetWrapper = ({ isAuthenticated, user, categories, isStoryActive }) => {
    // State to control the Sheet's open/closed status
    const [open, setOpen] = useState(false);

    return (
        // Pass the open state and the setter to the Sheet component
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger asChild>
                <Button variant="ghost" className="!p-0 w-1/3 flex justify-start">
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col z-10005">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>
                        {/* Close sheet on logo click */}
                        <Link href="/" onClick={() => setOpen(false)}>
                            <Image src="/logo.svg" alt="Karyaa" width={120} height={20} />
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Pass categories data and the state setter (setOpen) to the links component */}
                <div className="py-3 w-[280px] flex-grow overflow-y-auto">
                    <MobileNavLinks categories={categories} setOpen={setOpen} isStoryActive={isStoryActive} />
                </div>

                <SheetFooter className="p-6 border-t border-gray-200 mt-auto">
                    <div className="w-full flex justify-between items-center">
                        {/* Logout Modal - If it contains client-side logic, it should remain here */}
                        {isAuthenticated && (
                            <LogoutAlertModal isMobile={true} />
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSheetWrapper;