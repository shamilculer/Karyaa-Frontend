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

const ContactPageEditor = () => {
    const router = useRouter();
    const [content, setContent] = useState({
        bannerHeading: "",
        bannerTagline: "",
        contentHeading: "",
        contentDescription: "",
        primaryPhone: "",
        mainEmail: "",
        location: ""
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

                setContent({
                    bannerHeading: parsedContent.bannerHeading || "",
                    bannerTagline: parsedContent.bannerTagline || "",
                    contentHeading: parsedContent.contentHeading || "",
                    contentDescription: parsedContent.contentDescription || "",
                    primaryPhone: parsedContent.primaryPhone || "",
                    mainEmail: parsedContent.mainEmail || "",
                    location: parsedContent.location || ""
                });
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load contact page content");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setContent(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await upsertContentAction("contact-page", {
                type: "section",
                content: JSON.stringify(content)
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
        <div className="dashboard-container !pt-0 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky left-0 top-0 z-50">
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
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                {saving ? "Saving..." : "Save Changes"}
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
                <div className="pt-10 max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {/* Banner Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Banner Section</CardTitle>
                                <CardDescription>
                                    Configure the heading and tagline displayed in the contact page banner
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bannerHeading">Banner Heading</Label>
                                    <Input
                                        id="bannerHeading"
                                        type="text"
                                        value={content.bannerHeading}
                                        onChange={(e) => handleFieldChange("bannerHeading", e.target.value)}
                                        placeholder="Contact Us"
                                    />
                                    <p className="!text-xs text-gray-600">Main heading displayed in the banner</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bannerTagline">Banner Tagline</Label>
                                    <Textarea
                                        id="bannerTagline"
                                        value={content.bannerTagline}
                                        onChange={(e) => handleFieldChange("bannerTagline", e.target.value)}
                                        placeholder="Have a question, need support, or want to partner with us? Let's talk."
                                        className="h-20 resize-none"
                                    />
                                    <p className="!text-xs text-gray-600">Subtitle or description displayed below the heading</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Content</CardTitle>
                                <CardDescription>
                                    Configure the heading and description in the main content area
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contentHeading">Content Heading</Label>
                                    <Textarea
                                        id="contentHeading"
                                        value={content.contentHeading}
                                        onChange={(e) => handleFieldChange("contentHeading", e.target.value)}
                                        placeholder="Contact Us Today for Personalized Support and Assistance"
                                        className="h-16 resize-none"
                                    />
                                    <p className="!text-xs text-gray-600">Main heading in the content section (press Enter for new lines)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contentDescription">Content Description</Label>
                                    <SimpleTiptapEditor
                                        value={content.contentDescription}
                                        onChange={(val) => handleFieldChange("contentDescription", val)}
                                        placeholder="Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscin fringilla nulla diam lorem non mauris."
                                    />
                                    <p className="!text-xs text-gray-600">Description text displayed below the heading</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Details Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Details</CardTitle>
                                <CardDescription>
                                    Configure the contact information displayed on the contact page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="primaryPhone">Phone Number</Label>
                                    <Input
                                        id="primaryPhone"
                                        type="text"
                                        value={content.primaryPhone}
                                        onChange={(e) => handleFieldChange("primaryPhone", e.target.value)}
                                        placeholder="+971 XX XXX XXXX"
                                    />
                                    <p className="!text-xs text-gray-600">Primary contact phone number</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mainEmail">Email Address</Label>
                                    <Input
                                        id="mainEmail"
                                        type="email"
                                        value={content.mainEmail}
                                        onChange={(e) => handleFieldChange("mainEmail", e.target.value)}
                                        placeholder="contact@example.com"
                                    />
                                    <p className="!text-xs text-gray-600">Primary contact email address</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location/Address</Label>
                                    <Textarea
                                        id="location"
                                        value={content.location}
                                        onChange={(e) => handleFieldChange("location", e.target.value)}
                                        placeholder="123 Business Street, Dubai, UAE"
                                        className="h-24 resize-none"
                                    />
                                    <p className="!text-xs text-gray-600">Physical address or location</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button at Bottom */}
                        <div className="flex justify-end pb-10">
                            <Button onClick={handleSave} disabled={saving} size="lg">
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                {saving ? "Saving..." : "Save All Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPageEditor;
