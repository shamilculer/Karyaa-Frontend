// components/common/UserMenu.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/dialog";
import ReferModal from "./ReferModal";
import { Heart, Gift } from "lucide-react";
import LogoutAlertModal from "@/app/auth/components/LogoutAlertModal";


export default function UserMenu({ user, isMobile = false }) {
    return (
        <ReferModal>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {isMobile ? (
                        <Button variant="ghost" className="p-0">
                            <Image
                                src={user?.profileImage || "/default-avatar.png"}
                                alt="User"
                                width={32}
                                height={32}
                                className="rounded-full size-9 border border-gray-300"
                            />
                        </Button>
                    ) : (
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
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className={isMobile ? "w-40" : "w-48"}>
                    <DropdownMenuItem asChild>
                        <Link href="/saved-vendors">
                            <Heart className="h-4 w-4 mr-2" />Saved Vendors
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Gift className="h-4 w-4 mr-2" />Refer & Earn
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <LogoutAlertModal />
                </DropdownMenuContent>
            </DropdownMenu>
        </ReferModal>
    );
}