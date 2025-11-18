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
import { Heart, Gift, User as UserIcon } from "lucide-react";
import LogoutAlertModal from "@/app/auth/components/LogoutAlertModal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useClientStore } from "@/store/clientStore";

export default function UserMenu({ isMobile = false }) {
    const { user } = useClientStore();
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
                            <Avatar className="size-8 rounded-full overflow-hidden border border-gray-300">
                                <AvatarImage
                                    src={user?.profileImage || "/default-avatar.png"}
                                    alt={user?.username || "user"}
                                    width={36}
                                    height={36}
                                    className="size-full "
                                />
                            </Avatar>
                            <span className="text-sm font-semibold ml-0">
                                {user?.username || "User"}
                            </span>
                        </Button>
                    )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className={isMobile ? "w-40" : "w-48"}>

                    {/* ---- Profile ---- */}
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <UserIcon className="h-4 w-4 mr-2" />
                            Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* ---- Saved Vendors ---- */}
                    <DropdownMenuItem asChild>
                        <Link href="/saved-vendors">
                            <Heart className="h-4 w-4 mr-2" />
                            Saved Vendors
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* ---- Refer & Earn ---- */}
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Gift className="h-4 w-4 mr-2" />
                            Refer & Earn
                        </DropdownMenuItem>
                    </DialogTrigger>

                    <DropdownMenuSeparator />

                    {/* ---- Logout ---- */}
                    <LogoutAlertModal />
                </DropdownMenuContent>
            </DropdownMenu>
        </ReferModal>
    );
}
