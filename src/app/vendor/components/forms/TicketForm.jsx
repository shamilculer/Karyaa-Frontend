"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postTicket } from "@/app/actions/vendor/support"; // Update path if needed

// ----------------------------------------------------------------------
// 1. Zod Schema
// ----------------------------------------------------------------------
const ticketFormSchema = z.object({
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    priority: z.enum(["low", "medium", "high", "critical"], {
        required_error: "Please select the ticket importance.",
    }),
    category: z.enum(["payment", "profile", "technical", "content", "other"], {
        required_error: "Please select a category.",
    }),
    description: z.string().min(20, { message: "Please describe your issue in detail (min 20 characters)." }),
    contactEmail: z.email({ message: "Invalid email address." }).optional().or(z.literal('')),
});

// ----------------------------------------------------------------------
// 2. Ticket Form Component
// ----------------------------------------------------------------------

const TicketForm = ({ setIsOpen }) => {
    const form = useForm({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            subject: "",
            category: "technical",
            priority: "medium",
            description: "",
            contactEmail: "",
        },
    });

    async function onFormSubmit(data) {
        console.log("Submitting Ticket Data:", data);
        const response = await postTicket(data);
        
        // ✨ This is the correct client-side redirect handler ✨
        if (response?.__redirect) {
            window.location.href = response.redirectTo;
            return;
        }
        
        if (response.success) {
            toast.success(response.message, { position: "top-center" });
            form.reset({ contactEmail: data.contactEmail });
            setIsOpen(false);
        } else {
            toast.error(response.message, { position: "top-center" });
        }
    }

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className="space-y-4"
                >

                    {/* Category and Priority Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Category Select (Required) */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-500">Category*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting} >
                                        <FormControl>
                                            <SelectTrigger className="h-10 lg:!h-11 w-full border-gray-400">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="payment">Payment</SelectItem>
                                                <SelectItem value="profile">Profile/Listing</SelectItem>
                                                <SelectItem value="technical">Technical Bug</SelectItem>
                                                <SelectItem value="content">Content</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Priority Select (Importance) */}
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-500">Importance*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting} >
                                        <FormControl>
                                            <SelectTrigger className="h-10 lg:!h-11 w-full border-gray-400">
                                                <SelectValue placeholder="Select Importance" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* Priority Options Defined Inline */}
                                                <SelectItem value="critical">🔴 Critical (System Down)</SelectItem>
                                                <SelectItem value="high">🟠 High (Major Blockage)</SelectItem>
                                                <SelectItem value="medium">🟡 Medium (General Issue)</SelectItem>
                                                <SelectItem value="low">🔵 Low (Request/Question)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Subject Field (Required) */}
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-500">Subject*</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Brief summary of the issue"
                                        className="h-10 lg:!h-11 w-full border-gray-400"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description Textarea (Required) */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-500">Detailed Description*</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Please provide all details, including event IDs, dates, and steps to reproduce the issue."
                                        className="min-h-[150px] border-gray-400"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Contact Email (Optional - for verification) */}
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-500">Preferred Contact Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Your email address"
                                        className="h-10 lg:!h-11 w-full border-gray-400"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Ticket"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default TicketForm;