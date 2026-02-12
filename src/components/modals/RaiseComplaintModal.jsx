"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { submitComplaintAction } from "@/app/actions/public/complaint";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Schema validation
const complaintSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email address"),
    description: z.string().min(10, "Please provide more details about the issue"),
});

const RaiseComplaintModal = () => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            description: "",
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await submitComplaintAction(data);
            if (result.success) {
                setIsSuccess(true);
                form.reset();
                // toast.success("Complaint submitted successfully!");
            } else {
                toast.error(result.error || "Failed to submit complaint.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset success state immediately when closing
            setIsSuccess(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <button className="text-white hover:text-secondary cursor-pointer transition-colors text-sm block text-left">
                    Raise a Complaint
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader className={`bg-primary text-white -mx-6 -mt-6 p-4 border-b border-gray-300 ${isSuccess ? "rounded-b-none" : ""}`}>
                    <div className="w-full text-center relative">
                        <DialogTitle className="!text-lg !text-white uppercase font-bold mx-auto">Raise a Complaint</DialogTitle>
                    </div>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-10 text-center space-y-4">
                        <h3 className="!text-3xl  font-semibold text-green-600">Complaint Submitted!</h3>
                        <p className="text-gray-600 px-4">
                            You'll receive a confirmation email, and our team will review your complaint and respond shortly.
                        </p>
                        <div className="pt-4">
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[60vh] px-3.5 [&>div>div[style]]:!pr-3">
                            <div className="space-y-6 pt-2 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                                <div className="text-center space-y-4 border-b pb-4 border-gray-100">
                                    <p className="!text-sm text-gray-600 px-4">
                                        We're sorry you're facing an issue. Your experience matters to us, and we're here to help.
                                    </p>
                                    <div className="bg-gray-50 py-3 px-4 rounded-lg mx-2">
                                        <p className="!text-sm font-medium text-gray-700">
                                            You can also reach us directly at <a href="mailto:complaints@karya.ai" className="text-blue-600 hover:underline">complaints@karya.ai</a> or call us at (123) 456-7890.
                                        </p>
                                    </div>
                                    <p className="!text-sm text-gray-500 px-4">
                                        Please fill in the details below to raise a complaint. Our team will review it and get back to you as soon as possible.
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Complaint Details</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your issue..."
                                                            className="resize-none min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>

                                <div className="pt-2 pb-2 text-center border-t border-gray-100 mt-4">
                                    <p className="!text-xs text-gray-500">
                                        You'll receive a confirmation email, and our team will review your complaint and respond shortly.
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="border-t pt-4 border-gray-300 flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="min-w-[120px]"
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={form.handleSubmit(onSubmit)}
                                className="min-w-[200px] bg-primary hover:bg-primary/90"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Complaint"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RaiseComplaintModal;
