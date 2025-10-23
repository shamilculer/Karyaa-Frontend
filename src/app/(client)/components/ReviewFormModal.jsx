"use client"

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from "./ReviewForm";


const ReviewFormModal = ({ vendorId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="rounded-lg p-2 md:p-4 text-sm hover:bg-secondary hover:text-white transition-colors"
                >
                    Write a Review <Plus className="ml-1 size-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-center">Write a Review</DialogTitle>
                    <DialogDescription className="text-center !text-sm">
                        Share your experience with this vendor.
                    </DialogDescription>
                </DialogHeader>
                {/* Pass vendorId and setIsOpen to the form */}
                <ReviewForm vendorId={vendorId} closeModal={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default ReviewFormModal;