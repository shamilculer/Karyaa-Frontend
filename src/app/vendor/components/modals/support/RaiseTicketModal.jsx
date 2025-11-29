"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TicketForm from "../../forms/TicketForm";
import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

const RaiseTicketModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* Ensure the Button style matches your theme (e.g., variant="default") */}
                <Button>
                    <MessageCircleQuestion className="w-4 h-4" />
                    Raise a Ticket
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl bg-white">
                <DialogHeader className="mb-2">
                    <DialogTitle className="!text-3xl max-lg:!text-xl font-bold">Submit a Support Ticket</DialogTitle>
                    <DialogDescription className="!text-sm max-lg:!text-xs">
                        Fill out the details below. We'll use your registered contact info to reply.
                    </DialogDescription>
                </DialogHeader>

                <TicketForm setIsOpen={setIsOpen} />

            </DialogContent>
        </Dialog>
    );
};

export default RaiseTicketModal;