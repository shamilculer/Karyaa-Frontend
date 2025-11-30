"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
import { vendorFormSchema } from "@/lib/schema";
import { postLead } from "@/app/actions/public/leads";
import { toast } from "sonner";
import { useClientStore } from "@/store/clientStore";
import Link from "next/link";

// ----------------------------------------------------------------------
// 2. Vendor Form Component (REVISED to accept setIsOpen)
// ----------------------------------------------------------------------
const VendorForm = ({ vendorInfo, user, setIsOpen }) => {
    const form = useForm({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            location: "",
            eventDate: "",
            numberOfGuests: "",
            eventType: "",
            message: "",
            phoneNumber: "",
        },
    });

    const { setError, formState: { errors } } = form;

    async function onFormSubmit(data) {

        const submissionData = {
            vendorId: vendorInfo.vendorId,
            ...data,
        };


        try {
            const response = await postLead(submissionData);

            if (response.error) {
                const errorMessage = response.error;

                setError("root.serverError", {
                    type: "server",
                    message: errorMessage,
                });

                toast.error(errorMessage, {
                    position: "top-center"
                });

            } else {
                // SUCCESS HANDLER
                toast.success("Your inquiry has been sent successfuly!", {
                    position: "top-center"
                });
                form.reset();

                // 👈 NEW: Close the modal on successful submission 
                if (setIsOpen) {
                    setIsOpen(false);
                }
            }
        } catch (error) {
            const criticalError = "An unexpected error occurred. Please try again.";

            setError("root.critical", {
                type: "network",
                message: criticalError,
            });
            toast.error(criticalError);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Your Full Name*"
                                            className="rounded-none border-gray-400 lg:h-10"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number (Required based on schema) */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Phone number*"
                                            className="rounded-none border-gray-400 lg:h-10"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email*"
                                        className="rounded-none border-gray-400 lg:h-10"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* NEW: Location Field (Required) */}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Event Location (Optional)*"
                                        className="rounded-none border-gray-400 lg:h-10"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Event Type (Mandatory) */}
                    <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting} >
                                    <FormControl>
                                        <SelectTrigger className="rounded-none border-gray-400 lg:h-10 w-full">
                                            <SelectValue placeholder="Event Type (Optional)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-100">
                                        <SelectGroup>
                                            <SelectItem value="wedding">Wedding</SelectItem>
                                            <SelectItem value="birthday">Birthday/Party</SelectItem>
                                            <SelectItem value="corporate">Corporate Event</SelectItem>
                                            <SelectItem value="anniversary">Anniversary</SelectItem>
                                            <SelectItem value="baby_shower">Baby Shower</SelectItem>
                                            <SelectItem value="engagement">Engagement</SelectItem>
                                            <SelectItem value="gala">Gala / Fundraiser</SelectItem>
                                            <SelectItem value="meeting">Business Meeting</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="date"
                                        placeholder="Event date (Optional)"
                                        className="rounded-none border-gray-400 lg:h-10 max-lg:!text-xs"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="numberOfGuests"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-none border-gray-400 h-10 w-full max-lg:!text-xs">
                                            <SelectValue placeholder="Expected guests (Optional)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-100">
                                        <SelectGroup>
                                            <SelectItem value="1-25">1-25 guests</SelectItem>
                                            <SelectItem value="26-50">26-50 guests</SelectItem>
                                            <SelectItem value="51-100">51-100 guests</SelectItem>
                                            <SelectItem value="101-200">101-200 guests</SelectItem>
                                            <SelectItem value="201-300">201-300 guests</SelectItem>
                                            <SelectItem value="300+">300+ guests</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your event and what you needI*"
                                        className="rounded-none border-gray-400 text-xs lg:text-sm min-h-[100px]"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 🌟 DISPLAY GLOBAL FORM ERROR (Auth or Server) 🌟 */}
                    {(errors.root?.authError || errors.root?.serverError || errors.root?.critical) && (
                        <div className=" block!text-sm font-medium text-red-600">
                            {/* Display the message from the first existing root error */}
                            {errors.root.authError?.message || errors.root.serverError?.message || errors.root.critical?.message}
                        </div>
                    )}

                    <span className="text-xs !leading-[.8em]">By clicking "Submit" you accept our <Link target="_blank" className="text-blue-500 underline" href="/terms-and-conditions">Terms and Conditions</Link> and <Link target="_blank" className="text-blue-500 underline" href="/privacy-policy">Privacy Policy</Link>.</span>

                    <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default VendorForm;