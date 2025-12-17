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
import { EyeIcon, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

import { loginVendor } from "@/app/actions/vendor/auth";
import { useVendorStore } from "@/store/vendorStore";

const vendorLoginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

const VendorLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const setVendor = useVendorStore((state) => state.setVendor);

    const form = useForm({
        resolver: zodResolver(vendorLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data) {
        setErrorMessage("");
        try {
            const result = await loginVendor(data);

            if (!result.success) {
                setErrorMessage(result.error || "Login failed. Please try again.");
                return;
            }
            setVendor(result.data);

            // Redirect to vendor dashboard
            router.push("/vendor/dashboard");
        } catch (err) {
            console.error("Vendor login failed:", err.message);
            setErrorMessage(err.message || "Login failed. Please try again.");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8 mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="vendor@example.com"
                                        type="email"
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
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <EyeIcon className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 !text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link
                            href="/auth/vendor/forgot-password"
                            className="text-sm text-[#2F4A9D] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

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
                    Don't have a vendor account?
                    <Link
                        href="/auth/vendor/register"
                        className="text-[#2F4A9D] font-medium hover:underline"
                    >
                        Register now
                    </Link>
                </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="!text-xs text-blue-800">
                    <strong>Note:</strong> Your account must be approved by an administrator
                    before you can access the vendor dashboard.
                </p>
            </div>
        </div>
    );
};

export default VendorLoginForm;