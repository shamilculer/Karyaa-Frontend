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
import { AlertCircle, EyeIcon, EyeOff } from "lucide-react";
import { z } from "zod";

import { loginAdmin } from "@/app/actions/admin/auth";
import { useAdminStore } from "@/store/adminStore";
import Image from "next/image";

const adminLoginSchema = z.object({
    email: z.email("Valid email required."),
    password: z.string().min(1, "Password is required."),
});

const AdminLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter();
    const setAdmin = useAdminStore((state) => state.setAdmin);

    const form = useForm({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data) {

        try {
            const result = await loginAdmin(data);

            if (!result.success) {
                setErrorMessage(result.error || "Login failed. Please try again.");
                return;
            }

            setAdmin(result.data);
            router.push("/admin/dashboard");
        } catch (err) {
            console.error("Admin login failed:", err.message);
            setErrorMessage(err.message || "Login failed. Please try again.");
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 mt-10 bg-white z-10 p-8 rounded flex flex-col">
            <div className="relative">
                <Image
                    src="/logo.svg"
                    height={34}
                    width={128}
                    alt="Karyaa"
                    className="w-32"
                />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your admin email"
                                        {...field}
                                        className="p-4 bg-[#f0f0f0] h-12 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter admin password"
                                            className="p-4 bg-[#f0f0f0] h-12 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
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

                    {errorMessage && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 !text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Signing in..." : "Admin Login"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AdminLoginForm;
