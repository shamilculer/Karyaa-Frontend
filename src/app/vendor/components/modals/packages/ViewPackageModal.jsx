"use client";

import { useState } from "react";
import { CircleCheckBig, Eye } from "lucide-react";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function ViewPackageModal({ packageData }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                    <Eye className="w-4" /> View
                </Button>
            </DialogTrigger>

            <DialogContent
                className="
                    max-h-[90vh]
                    flex
                    flex-col
                    p-0
                "
            >
                {/* HEADER */}
                <DialogHeader className="px-6 pt-4 md:pt-6 pb-4 border-b border-b-gray-300">
                    <DialogTitle className="text-xl font-semibold">
                        Package Details
                    </DialogTitle>
                </DialogHeader>

                {/* SCROLLABLE CONTENT */}
                <ScrollArea className="px-3 md:px-6 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-6">

                        {/* Cover Image */}
                        {packageData.coverImage && (
                            <div className="relative w-full h-72 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={packageData.coverImage}
                                    alt={packageData.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <h3 className="font-bold text-2xl text-gray-900">
                                {packageData.name}
                            </h3>
                            {packageData.subheading && (
                                <p className="text-gray-600 mt-1">
                                    {packageData.subheading}
                                </p>
                            )}
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2">
                            {packageData.services.map((service) => (
                                <Badge
                                    key={service}
                                    className="text-xs rounded-full bg-gray-200 text-gray-600"
                                >
                                    {service}
                                </Badge>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                Description
                            </h4>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {packageData.description}
                            </p>
                        </div>

                        {/* Includes */}
                        {packageData.includes?.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    Features Included
                                </h4>
                                <ul className="space-y-5">
                                    {packageData.includes.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <CircleCheckBig className="w-4 h-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </ScrollArea>

                {/* FOOTER (not scrollable) */}
                <div className="px-6 py-4 border-t flex items-center justify-between border-gray-300">
                    <div className="mt-4 text-xs">Starting From <span className="!text-base font-medium font-heading">AED {Number(packageData.priceStartingFrom).toLocaleString()}</span></div>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
