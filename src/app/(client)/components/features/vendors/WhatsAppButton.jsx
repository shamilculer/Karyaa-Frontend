"use client";

import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import Link from "next/link";
import { trackWhatsAppClick } from "@/app/actions/vendor/analytics";

const WhatsAppButton = ({ phoneNumber, vendorId }) => {
    if (!phoneNumber) return null;

    const cleaned = phoneNumber.replace(/[^0-9]/g, "");
    const link = `https://wa.me/${cleaned}`;

    const handleClick = async () => {
        try {
            await trackWhatsAppClick(vendorId);
        } catch (error) {
            console.error("Failed to track WhatsApp click:", error);
        }
    };

    return (
        <Button asChild variant="ghost" className="p-0" onClick={handleClick}>
            <Link href={link} target="_blank">
                <IconBrandWhatsapp className="text-primary" />
            </Link>
        </Button>
    );
};

export default WhatsAppButton;
