"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useForm, Controller } from "react-hook-form";

const AUTH_PAGES = [
    {
        key: "auth-user-login",
        label: "User Login",
        previewUrl: "/auth/login",
        description: "Customize the user login page"
    },
    {
        key: "auth-user-register",
        label: "User Register",
        previewUrl: "/auth/register",
        description: "Customize the user registration page"
    },
    {
        key: "auth-vendor-login",
        label: "Vendor Login",
        previewUrl: "/auth/vendor/login",
        description: "Customize the vendor login page"
    },
    {
        key: "auth-vendor-register",
        label: "Vendor Register",
        previewUrl: "/auth/vendor/register",
        description: "Customize the vendor registration page"
    }
];

const AuthPagesEditor = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(AUTH_PAGES[0].key);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: AUTH_PAGES.reduce((acc, page) => {
            acc[page.key] = {
                backgroundImage: "",
                heading: "",
                tagline: ""
            };
            return acc;
        }, {})
    });

    useEffect(() => {
        loadAllContent();
    }, []);

    const loadAllContent = async () => {
        setLoading(true);
        try {
            // Load content for all auth pages
            const promises = AUTH_PAGES.map(page =>
                getContentByKeyAction(page.key)
            );

            const results = await Promise.all(promises);

            results.forEach((result, index) => {
                const pageKey = AUTH_PAGES[index].key;
                if (result.success && result.data?.content) {
                    const parsedContent = typeof result.data.content === 'string'
                        ? JSON.parse(result.data.content)
                        : result.data.content;

                    setValue(`${pageKey}.backgroundImage`, parsedContent.backgroundImage || "");
                    setValue(`${pageKey}.heading`, parsedContent.heading || "");
                    setValue(`${pageKey}.tagline`, parsedContent.tagline || "");
                }
            });
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load auth pages content");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            // Save all auth pages
            const promises = AUTH_PAGES.map(page => {
                const pageData = data[page.key];
                return upsertContentAction(page.key, {
                    type: "section",
                    content: JSON.stringify(pageData)
                });
            });

            const results = await Promise.all(promises);

            const allSuccess = results.every(result => result.success);

            if (allSuccess) {
                toast.success("All auth pages content saved successfully!");
            } else {
                const failedPages = results
                    .map((result, index) => result.success ? null : AUTH_PAGES[index].label)
                    .filter(Boolean);
                toast.error(`Failed to save: ${failedPages.join(", ")}`);
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save auth pages content");
        } finally {
            setSaving(false);
        }
    };

    const currentPage = AUTH_PAGES.find(page => page.key === activeTab);

    return (
        <div className="dashboard-container !pt-0">
            {/* Header */}
            <div className="border-b border-gray-200 sticky left-0 top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="!rounded-full bg-gray-300"
                                onClick={() => router.push("/admin/content-moderation/content")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Auth Pages Editor</span>
                                <p className="!text-sm text-gray-500">Customize authentication page content</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(currentPage?.previewUrl, "_blank")}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                            <Button type="submit" form="auth-pages-form" disabled={saving}>
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                {saving ? "Saving..." : "Save All Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <form id="auth-pages-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-5xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start bg-transparent p-1 h-auto gap-2 border-b border-gray-100 pb-4">
                            {AUTH_PAGES.map(page => (
                                <TabsTrigger
                                    key={page.key}
                                    value={page.key}
                                    className="data-[state=active]:bg-primary bg-gray-200 data-[state=active]:text-white data-[state=active]:shadow-none border border-transparent data-[state=active]:border-secondary px-6 py-2.5 transition-all duration-200 data-[state=active]:border-b-4"
                                >
                                    {page.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {AUTH_PAGES.map(page => (
                            <TabsContent key={page.key} value={page.key} className="space-y-6">
                                {/* Background Image */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Background Image</CardTitle>
                                        <CardDescription>
                                            {page.description} - Upload a background image
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Background Image</Label>
                                            <ControlledFileUpload
                                                control={control}
                                                name={`${page.key}.backgroundImage`}
                                                label="Upload Background Image"
                                                errors={errors}
                                                allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                                folderPath={`auth/${page.key}`}
                                                role="admin"
                                                aspectRatio={1}
                                            />
                                            <p className="!text-xs text-gray-600">
                                                Recommended size: 1920x1920px (square) for best quality
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Heading & Tagline */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Page Content</CardTitle>
                                        <CardDescription>
                                            Configure the heading and tagline displayed on the page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor={`${page.key}-heading`}>Heading</Label>
                                            <Controller
                                                name={`${page.key}.heading`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id={`${page.key}-heading`}
                                                        type="text"
                                                        placeholder="Enter page heading"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Main heading displayed on the page</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`${page.key}-tagline`}>Tagline / Description</Label>
                                            <Controller
                                                name={`${page.key}.tagline`}
                                                control={control}
                                                render={({ field }) => (
                                                    <SimpleTiptapEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Enter tagline or description..."
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">
                                                Description or tagline with rich text formatting support
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    {/* Save Button at Bottom */}
                    <div className="flex justify-end pb-10 pt-6">
                        <Button type="submit" disabled={saving} size="lg">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            {saving ? "Saving..." : "Save All Changes"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AuthPagesEditor;
