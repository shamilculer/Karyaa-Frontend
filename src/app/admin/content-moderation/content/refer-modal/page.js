"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { useForm, Controller } from "react-hook-form";

const ReferModalEditor = () => {
    const router = useRouter();
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            backgroundImage: "",
            heading: "Refer Vendors. Earn rewards",
            description: "Invite vendors to join our platform and earn exclusive rewards when they sign up successfully!",
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
            const result = await getContentByKeyAction("refer-modal");

            if (result.success && result.data?.content) {
                const parsedContent = typeof result.data.content === 'string'
                    ? JSON.parse(result.data.content)
                    : result.data.content;

                setValue("backgroundImage", parsedContent.backgroundImage || "");
                setValue("heading", parsedContent.heading || "Refer Vendors. Earn rewards");
                setValue("description", parsedContent.description || "Invite vendors to join our platform and earn exclusive rewards when they sign up successfully!");
            }
        } catch (error) {
            console.error("Error loading content:", error);
            toast.error("Failed to load refer modal content");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const result = await upsertContentAction("refer-modal", {
                type: "setting",
                content: JSON.stringify(data)
            });

            if (result.success) {
                toast.success("Refer modal content saved successfully!");
            } else {
                toast.error(result.message || "Failed to save refer modal content");
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save refer modal content");
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
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Refer & Earn Modal Editor</span>
                                <p className="!text-sm text-gray-500">Customize the refer modal content and image</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open("/", "_blank")}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                            <Button type="submit" form="refer-modal-form" disabled={saving}>
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
                <form id="refer-modal-form" onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {/* Modal Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Modal Content</CardTitle>
                                <CardDescription>
                                    Configure the content displayed in the Refer & Earn modal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Background Image</Label>
                                    <ControlledFileUpload
                                        control={control}
                                        name="backgroundImage"
                                        label="Upload Background Image"
                                        errors={errors}
                                        allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                        folderPath="modals/refer"
                                        role="admin"
                                        aspectRatio={4 / 3}
                                    />
                                    <p className="!text-xs text-gray-600">Background image for the left side of the modal (recommended: 800x600)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="heading">Heading</Label>
                                    <Controller
                                        name="heading"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="heading"
                                                type="text"
                                                placeholder="Refer Vendors. Earn rewards"
                                            />
                                        )}
                                    />
                                    <p className="!text-xs text-gray-600">Main heading displayed in the modal</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <SimpleTiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Invite vendors to join our platform..."
                                            />
                                        )}
                                    />
                                    <p className="!text-xs text-gray-600">Description text displayed below the heading</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button at Bottom */}
                        <div className="flex justify-end pb-10">
                            <Button type="submit" disabled={saving} size="lg">
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                {saving ? "Saving..." : "Save All Changes"}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ReferModalEditor;
