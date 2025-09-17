"use client";

import { z } from "zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// ✅ Schema for vendor form
const vendorFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    eventDate: z.string().min(1, "Event date is required"),
    numberOfGuests: z.string().min(1, "Number of guests is required"),
    phoneNumber: z.string().optional(),
});

const VendorForm = () => {
    const form = useForm({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            eventDate: "",
            numberOfGuests: "",
            phoneNumber: "",
        },
    });

    function onFormSubmit(data) {
        console.log("Vendor form submitted with data:", data);
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Form Container */}
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onFormSubmit)}
                        className="space-y-4"
                    >
                        {/* First Name & Last Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="First name*"
                                                className="rounded-none border-gray-400 h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Last name*"
                                                className="rounded-none border-gray-400 h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email*"
                                            className="rounded-none border-gray-400 h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Event Date */}
                            <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                placeholder="Event date*"
                                                className="rounded-none border-gray-400 h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Number of Guests */}
                            <FormField
                                control={form.control}
                                name="numberOfGuests"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-none border-gray-400 h-10 w-full">
                                                    <SelectValue placeholder="Number of guests*" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1-25">1-25 guests</SelectItem>
                                                <SelectItem value="26-50">26-50 guests</SelectItem>
                                                <SelectItem value="51-100">51-100 guests</SelectItem>
                                                <SelectItem value="101-200">101-200 guests</SelectItem>
                                                <SelectItem value="201-300">201-300 guests</SelectItem>
                                                <SelectItem value="300+">300+ guests</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Phone Number */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Phone number"
                                            className="rounded-none border-gray-400 h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <span className="text-xs">By clicking "Submit" you accept our Terms of Use and agree to KARYAA creating an account for you. Your messages may be monitored for quality, safety, and security according to our Acceptable Content Policy. See our Privacy Policy to learn how we handle your data.</span>

                        <Button type="submit" className="w-full mt-5">
                            Send Message
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VendorForm;