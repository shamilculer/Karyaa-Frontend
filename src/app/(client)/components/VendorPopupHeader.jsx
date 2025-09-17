"use client";

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { vendors } from "@/utils"
import Image from "next/image"
import { Send } from "lucide-react"
import Link from "next/link"

const VendorPopupHeader = ({
    vendorName,
    showHeader = false
}) => {
    return (
        <div className={`w-full flex items-center pt-5 min-h-24 z-[51] bg-white border-b border-b-gray-300 fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
            showHeader ? 'translate-y-0' : '-translate-y-[100%]'
        }`}>
            <div className="container">
                <div className="h-full w-full flex-between">
                    <div className="flex items-center gap-5">
                        <Avatar className="size-16 rounded-full overflow-hidden border border-gray-200">
                            <AvatarImage className="size-full object-cover" src={vendors[0].image} />
                            <AvatarFallback>OWR</AvatarFallback>
                        </Avatar>

                        <div className="">
                            <span className="font-heading font-medium uppercase">{vendorName}</span>
                            <div className="text-sm">
                                Nora Khuder | Owner
                            </div>
                        </div>
                    </div>

                    <div className="flex-center gap-5">
                        <Button> 
                            <Image width={20} height={20} src="/whatsapp.svg" alt="whatsapp" /> 
                            Contact Us On Whatsapp
                        </Button>
                        <Button> 
                            <Send className="w-5" /> 
                            Send Us a Message
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-10 mt-4">
                    <Link href="#about" className="py-3 px-3 text-xs font-medium uppercase tracking-widest border-b">About</Link>
                    <Link href="#services" className="py-3 px-3 text-xs font-medium uppercase tracking-widest border-b">Services</Link>
                    <Link href="#reviews" className="py-3 px-3 text-xs font-medium uppercase tracking-widest border-b">Reviews</Link>
                    <Link href="#packages" className="py-3 px-3 text-xs font-medium uppercase tracking-widest border-b">Packages</Link>
                </div>
            </div>
        </div>
    )
}

export default VendorPopupHeader