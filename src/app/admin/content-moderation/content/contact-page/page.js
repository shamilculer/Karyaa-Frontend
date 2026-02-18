"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useForm, Controller } from "react-hook-form";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ContactPageEditor = () => {
    const router = useRouter();
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            bannerHeading: "",
            bannerTagline: "",
            bannerImage: "",
            contentHeading: "",
            contentDescription: "",
            primaryPhone: "",
            mainEmail: "",
            location: ""
        },
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const result = await getContentByKeyAction("contact-page");

            if (result.success && result.data?.content) {
                const parsedContent = typeof result.data.content === 'string'
                    ? JSON.parse(result.data.content)
                    : result.data.content;

                setValue("bannerHeading", parsedContent.bannerHeading || "");
                setValue("bannerTagline", parsedContent.bannerTagline || "");
                setValue("bannerImage", parsedContent.bannerImage || "");
                setValue("contentHeading", parsedContent.contentHeading || "");
                setValue("contentDescription", parsedContent.contentDescription || "");
                setValue("primaryPhone", parsedContent.primaryPhone || "");
                setValue("mainEmail", parsedContent.mainEmail || "");
                setValue("location", parsedContent.location || "");
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load contact page content");
        } finally {
            setLoading(false);
        }
    };



    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const result = await upsertContentAction("contact-page", {
                type: "section",
                content: JSON.stringify(data)
            });

            if (result.success) {
                toast.success("Contact page content saved successfully!");
            } else {
                toast.error(result.message || "Failed to save contact page content");
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save contact page content");
        } finally {
            setSaving(false);
        }
    };

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
                                className="!rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-700"
                                onClick={() => router.push("/admin/content-moderation/content")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Contact Page Editor</span>
                                <p className="!text-sm text-gray-500">Customize your contact page content</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open("/contact", "_blank")}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
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
                <form id="contact-page-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-6xl mx-auto pb-12">
                    <div className="space-y-6">
                        {/* Banner Section */}
                        <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" defaultValue="banner-section">
                            <AccordionItem value="banner-section" className="border-0">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-lg font-semibold text-gray-800">Banner Section</span>
                                        <span className="text-sm font-normal text-gray-500">Configure the heading and tagline displayed in the contact page banner</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    <div className="space-y-6 pt-2 border-t border-gray-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="bannerHeading">Banner Heading</Label>
                                            <Controller
                                                name="bannerHeading"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="bannerHeading"
                                                        type="text"
                                                        placeholder="Contact Us"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Main heading displayed in the banner</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bannerTagline">Banner Tagline</Label>
                                            <Controller
                                                name="bannerTagline"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        id="bannerTagline"
                                                        placeholder="Have a question, need support, or want to partner with us? Let's talk."
                                                        className="h-20 resize-none"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Subtitle or description displayed below the heading</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Banner Image</Label>
                                            <ControlledFileUpload
                                                control={control}
                                                name="bannerImage"
                                                label="Upload Banner Image"
                                                errors={errors}
                                                allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                                folderPath="pages/contact"
                                                role="admin"
                                            />
                                            <p className="!text-xs text-gray-600">Banner background image (recommended: 1920x1080)</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Content Section */}
                        <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" defaultValue="content-section">
                            <AccordionItem value="content-section" className="border-0">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-lg font-semibold text-gray-800">Page Content</span>
                                        <span className="text-sm font-normal text-gray-500">Configure the heading and description in the main content area</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    <div className="space-y-6 pt-2 border-t border-gray-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="contentHeading">Content Heading</Label>
                                            <Controller
                                                name="contentHeading"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        id="contentHeading"
                                                        placeholder="Contact Us Today for Personalized Support and Assistance"
                                                        className="h-16 resize-none"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Main heading in the content section (press Enter for new lines)</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contentDescription">Content Description</Label>
                                            <Controller
                                                name="contentDescription"
                                                control={control}
                                                render={({ field }) => (
                                                    <SimpleTiptapEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscin fringilla nulla diam lorem non mauris."
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Description text displayed below the heading</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Contact Details Section */}
                        <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" defaultValue="contact-details">
                            <AccordionItem value="contact-details" className="border-0">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-lg font-semibold text-gray-800">Contact Details</span>
                                        <span className="text-sm font-normal text-gray-500">Configure the contact information displayed on the contact page</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    <div className="space-y-6 pt-2 border-t border-gray-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="primaryPhone">Phone Number</Label>
                                            <Controller
                                                name="primaryPhone"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="primaryPhone"
                                                        type="text"
                                                        placeholder="+971 XX XXX XXXX"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Primary contact phone number</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mainEmail">Email Address</Label>
                                            <Controller
                                                name="mainEmail"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="mainEmail"
                                                        type="email"
                                                        placeholder="contact@example.com"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Primary contact email address</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location/Address</Label>
                                            <Controller
                                                name="location"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        id="location"
                                                        placeholder="123 Business Street, Dubai, UAE"
                                                        className="h-24 resize-none"
                                                    />
                                                )}
                                            />
                                            <p className="!text-xs text-gray-600">Physical address or location</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Save Button at Bottom */}
                        <div className="flex justify-end pb-10 mt-8">
                            <Button type="submit" disabled={saving} size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all min-w-[200px]">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save All Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactPageEditor;
