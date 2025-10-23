"use client";

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
// import { vendors } from "@/utils" // Removed: Assume data is passed as props
import Image from "next/image"
import { Send } from "lucide-react"
import Link from "next/link"
import { getInitials } from "@/utils";

const VendorPopupHeader = ({
    vendorData,
    showHeader = false,
    hasPackages
}) => {
    // Helper to get initials (similar to the main page)

    return (
        <div className={`w-full flex items-center pt-5 min-h-24 z-[51] bg-white border-b border-b-gray-300 fixed top-0 left-0 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-[100%]'
            }`}>
            <div className="container px-4 sm:px-6 md:px-10"> {/* Added responsive padding */}
                <div className="h-full w-full flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <Avatar className="size-12 sm:size-16 rounded-full overflow-hidden border border-gray-200">
                            <AvatarImage className="size-full object-cover" src={vendorData.businessLogo} />
                            <AvatarFallback>{getInitials(vendorData.businessName) || 'VNR'}</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <span className="font-heading font-medium uppercase text-sm sm:text-base truncate block">{vendorData.businessName}</span>
                            <div className="text-xs sm:text-sm text-gray-600 truncate">
                                {vendorData.ownerName} | Owner
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="h-10 text-xs sm:text-sm px-2 sm:px-4 max-sm:gap-0 max-sm:!text-[0px] max-sm:w-10">
                            <Image width={16} height={16} src="/whatsapp.svg" alt="whatsapp" className="sm:mr-1 " />
                            Whatsapp
                        </Button>
                        <Button className="!h-8 sm:!h-10 text-xs sm:text-sm px-2 sm:px-4 hidden md:flex">
                            <Send className="w-4 sm:w-5 mr-1" />
                            Message
                        </Button>
                    </div>
                </div>

                {/* Navigation links - Adjusted font size for responsiveness */}
                <div className="flex items-center gap-4 sm:gap-10 mt-2 sm:mt-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <Link href="#about" className="py-2 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">About</Link>
                    <Link href="#services" className="py-2 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Services</Link>
                    <Link href="#reviews" className="py-2 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Reviews</Link>
                    {hasPackages && (
                        <Link href="#packages" className="py-2 px-1 text-xs sm:text-sm font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Packages</Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VendorPopupHeader