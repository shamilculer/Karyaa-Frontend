"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useClientStore } from "@/store/clientStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { submitReviewAction } from "@/app/actions/public/review";
import { Loader2, Star, Plus } from "lucide-react";
import { VendorSelectField } from "@/components/common/VendorSelectField";
import { ScrollArea } from "@/components/ui/scroll-area";

// Schema validation for guest users
const guestReviewSchema = z.object({
    guestName: z.string().min(2, "Name must be at least 2 characters"),
    guestEmail: z.string().email("Please enter a valid email address"),
    guestPhone: z.string().min(10, "Please enter a valid phone number"),
    vendorId: z.string().min(1, "Please select a vendor"),
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().min(10, "Please provide more details (minimum 10 characters)"),
});

// Schema validation for logged-in users
const userReviewSchema = z.object({
    vendorId: z.string().min(1, "Please select a vendor"),
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().min(10, "Please provide more details (minimum 10 characters)"),
});

const ReviewVendorModal = ({ vendorId = null }) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Get auth status from Zustand store
    const { isAuthenticated } = useClientStore();

    const form = useForm({
        resolver: zodResolver(isAuthenticated ? userReviewSchema : guestReviewSchema),
        defaultValues: {
            guestName: "",
            guestEmail: "",
            guestPhone: "",
            vendorId: vendorId || "",
            rating: 0,
            comment: "",
        },
    });

    const rating = form.watch("rating");

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await submitReviewAction(data);
            if (result.success) {
                setIsSuccess(true);
                form.reset();
            } else {
                // Show specific error message from backend
                const errorMessage = result.error || "Failed to submit review.";
                toast.error(errorMessage, {
                    duration: 5000,
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", {
                duration: 5000,
            });
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
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                {vendorId ? (
                    <Button
                        variant="outline"
                        className="rounded-lg p-2 md:p-4 text-sm hover:bg-secondary hover:text-white transition-colors"
                    >
                        Write a Review <Plus className="ml-1 size-5" />
                    </Button>
                ) : (
                    <button className="text-white hover:text-secondary cursor-pointer transition-colors text-sm block text-left">
                        Review a Vendor
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl p-4 sm:p-6">
                <DialogHeader className={`bg-primary text-white -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-4 border-b border-gray-300 rounded-t-lg ${isSuccess ? "rounded-b-none" : ""}`}>
                    <div className="w-full text-center relative">
                        <DialogTitle className="!text-lg !text-white uppercase font-bold mx-auto">Review a Vendor</DialogTitle>
                    </div>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-10 text-center space-y-4">
                        <h3 className="!text-3xl font-semibold text-green-600">Review Submitted!</h3>
                        <p className="text-gray-600 px-4">
                            Thank you for sharing your feedback. Your review will be published after approval.
                        </p>
                        <div className="pt-4">
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[60vh] md:px-3.5" type="always">
                            <div className="space-y-6 pt-2 pr-2">
                                <div className="text-center space-y-2 border-b pb-4 border-gray-100">
                                    <p className="!text-sm text-gray-600 px-4">
                                        Thank you so much for choosing Karyaa.
                                    </p>
                                    <p className="!text-sm text-gray-500 px-3 md:px-10">
                                        Please share your feedback on the vendor by filling out the form below.
                                    </p>
                                </div>

                                <FormProvider {...form}>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
                                            {!isAuthenticated && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name="guestName"
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
                                                        name="guestEmail"
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
                                                        name="guestPhone"
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
                                                </>
                                            )}

                                            {!vendorId && (
                                                <FormField
                                                    control={form.control}
                                                    name="vendorId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Select Vendor</FormLabel>
                                                            <FormControl>
                                                                <VendorSelectField
                                                                    name="vendorId"
                                                                    placeholder="Type or select vendor..."
                                                                    valueKey="_id"
                                                                    required={true}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            <FormField
                                                control={form.control}
                                                name="rating"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Rating</FormLabel>
                                                        <FormControl>
                                                            <div className="flex gap-2">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => field.onChange(star)}
                                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                                    >
                                                                        <Star
                                                                            className={`w-8 h-8 ${star <= rating
                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                : "text-gray-300"
                                                                                }`}
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="comment"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Review Comments</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Share your experience with the vendor..."
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
                                </FormProvider>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="border-t pt-4 border-gray-300 flex !flex-row justify-between gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1 md:flex-none md:min-w-[120px] max-md:h-8"
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={form.handleSubmit(onSubmit)}
                                className="flex-1 md:flex-none md:min-w-[200px] max-md:h-8 bg-primary hover:bg-primary/90"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReviewVendorModal;
