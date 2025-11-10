"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ReferralSuccessModal({ referralCode, isOpen, onOpenChange }) {
    const handleCopy = () => {
        if (referralCode) {
            navigator.clipboard.writeText(referralCode);
            toast.success("Copied to clipboard!", { description: referralCode });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader className="flex items-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <DialogTitle className="text-2xl font-bold">Referral Successful!</DialogTitle>
                    <DialogDescription className="text-md">
                        Your referral has been submitted. Share this code with your vendor(s):
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg my-4">
                    <p className="text-lg font-mono font-semibold text-primary">
                        {referralCode || "Loading..."}
                    </p>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        size="icon" 
                        onClick={handleCopy}
                        className="ml-4"
                        disabled={!referralCode}
                    >
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}