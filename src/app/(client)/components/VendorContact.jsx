"use client";

import { useState } from 'react';
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button" 
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog" 
import VendorForm from "./VendorForm"
import { getInitials } from "@/utils"

// ----------------------------------------------------------------------
// 1. The Main Export Component (Handles Visibility)
// ----------------------------------------------------------------------
const VendorContact = ({ vendorInfo }) => {
    return (
        <>
            {/* Desktop View: Static Contact Form (Hidden on small screens) */}
            <div className="max-lg:hidden">
                <VendorContactComponent vendorInfo={vendorInfo} />
            </div>

            {/* Mobile/Tablet View: Floating Button to open Modal (Hidden on large screens) */}
            <div className="lg:hidden z-9999">
                <MobileVendorContact vendorInfo={vendorInfo} />
            </div>
        </>
    )
}

// ----------------------------------------------------------------------
// 2. The Core Contact/Form Layout (REVISED to accept optional setIsOpen)
// ----------------------------------------------------------------------
// Now accepts setIsOpen as a prop, which is used to close the modal after submission.
const VendorContactComponent = ({ vendorInfo, setIsOpen }) => { 
    const ownerInitials = getInitials(vendorInfo.ownerName)
    return (
        <div className="w-full p-6 bg-white border border-[#CACCD0] space-y-7">
            <div>
                <h4 className="uppercase text-lg lg:!text-xl">Start the Convo</h4>
                <div className="text-xs lg:!text-sm">Use this secure form to reach out to {vendorInfo.businessName}.</div>
            </div>

            <div>
                <div className="flex items-center gap-5">
                    <Avatar className="size-16 lg:size-20 rounded-full overflow-hidden border border-gray-200">
                        <AvatarImage className="size-full object-cover" src={vendorInfo.ownerLogo} />
                        <AvatarFallback>{ownerInitials}</AvatarFallback>
                    </Avatar>

                    <div className="">
                        <span className="font-heading font-medium">{vendorInfo.businessName}</span>
                        <div className="text-sm">
                            {vendorInfo.ownerName} | Owner
                        </div>
                        <p className="!text-xs lg:!text-sm text-gray-500">Typically responds within 24h</p>
                    </div>
                </div>
            </div>

            <div>
                <VendorForm vendorInfo={vendorInfo} setIsOpen={setIsOpen} /> 
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// 3. Mobile/Tablet Floating Button and Modal (REVISED to manage state)
// ----------------------------------------------------------------------
const MobileVendorContact = ({ vendorInfo }) => {
    const [isOpen, setIsOpen] = useState(false); 

    const ownerInitials = getInitials(vendorInfo.ownerName)
    return (
        // 👈 2. Bind dialog state to local state
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* The Floating Button (Bottom Right) */}
            <DialogTrigger asChild>
                <Button
                    className="fixed bottom-4 right-4 bg-white flex items-center justify-start border border-gray-300 px-1 h-12 shadow rounded-3xl"
                    aria-label={`Contact ${vendorInfo.businessName}`}
                >
                    <Avatar className="size-9 rounded-full overflow-hidden border border-gray-200">
                        <AvatarImage className="size-full object-cover" src={vendorInfo.ownerLogo} />
                        <AvatarFallback>{ownerInitials}</AvatarFallback>
                    </Avatar>

                    <div className="pr-2">
                        <span className="font-medium !text-primary">Message us right now</span>
                        <div className="text-xs !text-gray-400">
                            {vendorInfo.ownerName} | Owner
                        </div>
                    </div>
                </Button>
            </DialogTrigger>

            {/* The Modal Content */}
            <DialogContent className="p-0 max-w-[90vw] md:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">Contact Us</DialogTitle>
                {/* 👈 3. Pass the state setter down */}
                <VendorContactComponent vendorInfo={vendorInfo} setIsOpen={setIsOpen} /> 
            </DialogContent>
        </Dialog>
    )
}

export default VendorContact