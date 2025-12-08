"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages";

export default function KaryaaRecommendsHeading() {
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadHeading();
    }, []);

    const loadHeading = async () => {
        setLoading(true);
        try {
            const result = await getContentByKeyAction("karyaa-recommends-heading");
            if (result.success && result.data?.content) {
                const parsedContent = typeof result.data.content === 'string'
                    ? JSON.parse(result.data.content)
                    : result.data.content;
                setHeading(parsedContent.heading || "");
            }
        } catch (error) {
            console.error("Error loading heading:", error);
            toast.error("Failed to load heading");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await upsertContentAction("karyaa-recommends-heading", {
                type: "section",
                content: JSON.stringify({ heading })
            });

            if (result.success) {
                toast.success("Heading saved successfully!");
            } else {
                toast.error(result.message || "Failed to save heading");
            }
        } catch (error) {
            console.error("Error saving heading:", error);
            toast.error("Failed to save heading");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="p-0 shadow-none border-none">
            <div className="space-y-4">
                <div className="space-y-2 mt-4">
                    <Label htmlFor="karyaa-heading">Section Heading</Label>
                    <Input
                        id="karyaa-heading"
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        placeholder="KARYAA Recommends"
                        className="h-11"
                    />
                    <p className="!text-xs text-gray-500">
                        This heading will appear above the recommended vendors section across multiple pages
                    </p>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Heading
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
