"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userSchema } from "@/lib/schema";
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
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";

import { registerUser } from "@/app/actions/user/user";
import { useClientStore } from "@/store/clientStore";

const UserCreateForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const setUser = useClientStore((state) => state.setUser);

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            mobileNumber: "",
            emailAddress: "",
            location: "",
            password: "",
        },
    });

    // Updated onSubmit
    async function onSubmit(data) {
        setErrorMessage("");
        try {
            const user = await registerUser(data);
            setUser(user);
            router.push("/");
        } catch (err) {
            console.error("Registration failed:", err.message);
            setErrorMessage("Registration failed. Please try again.");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium mt-3">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your name"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mobile Number Field */}
                    <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium mt-3">Mobile Number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your phone number"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Location Field */}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium mt-3">Location</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your City/Area"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Address Field */}
                    <FormField
                        control={form.control}
                        name="emailAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium mt-3">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email address"
                                        {...field}
                                        type="email"
                                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium mt-3">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter password"
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:bg-transparent"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <p className="!text-[12px] text-gray-500 mt-1">
                                    Must be *at least 6 characters* and include *uppercase*, *lowercase*, and a *number*.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Error Message */}
                    {errorMessage && <p className="text-red-500 !text-sm">{errorMessage}</p>}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full text-base"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </Form>

            <div className="w-full text-center mt-2 text-sm text-gray-600">
                <p className="!text-sm">
                    Already have an account? <Link href="/auth/login" className="text-[#2F4A9D] font-medium hover:underline">Click here to login.</Link>
                </p>
            </div>
        </div>
    );
};

export default UserCreateForm;