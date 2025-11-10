"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { z } from "zod";

import { loginUser } from "@/app/actions/user/user";
import { useClientStore } from "@/store/clientStore";

const loginSchema = z.object({
    login: z.string().min(1, "Email or phone number is required."),
    password: z.string().min(1, "Password is required."),
    rememberMe: z.boolean().optional(),
});

const UserLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const setUser = useClientStore((state) => state.setUser);

    // NOTE: Using userSchema for now, but should be replaced with a login-specific schema
    const form = useForm({
        resolver: zodResolver(loginSchema), // 🚨 Change this to zodResolver(loginSchema)
        defaultValues: {
            // Map to the two fields needed for login
            login: "", // New field for Email or Phone
            password: "",
        },
    });

    // Updated onSubmit for Login
    async function onSubmit(data) {
        setErrorMessage("");
        try {
            const user = await loginUser(data);
            setUser(user);
            router.push("/");
        } catch (err) {
            console.error("Login failed:", err.message);
            // Set a more user-friendly error message for login failures
            setErrorMessage(err.message || "Login Failed. Please try again.");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
            <div className="w-full max-xl:min-w-80 xl:max-w-md mx-auto space-y-8 mt-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Login Field (Email or phone number) */}
                        <FormField
                            control={form.control}
                            name="login"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Login</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email or phone number"
                                            {...field}
                                            className="p-4 bg-[#f0f0f0] h-12 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
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
                                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter password"
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                className="p-4 bg-[#f0f0f0] h-12 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Error Message */}
                        {errorMessage && <p className="text-red-500 !text-sm mt-2">{errorMessage}</p>}

                        {/* Sign in Button */}
                        <Button
                            type="submit"
                            className="w-full mt-4"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </Form>

                {/* Sign up link */}
                <div className="w-full text-center mt-4 text-sm text-gray-600">
                    <p className="!text-sm">
                        Don't have an account? <Link href="/auth/register" className="text-[#2F4A9D] font-medium hover:underline">Sign up now</Link>
                    </p>
                </div>

            </div>
    );
};

export default UserLoginForm;