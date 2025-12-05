"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { updateStaticPageSeoAction, updateCategorySeoAction, updateSubCategorySeoAction } from "@/app/actions/admin/seo";

export default function EditSeoModal({
    isOpen,
    onClose,
    type, // 'static', 'category', 'subcategory'
    data, // The item data (must include _id or pageIdentifier)
    onSuccess,
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        ogImage: "",
        route: "", // For static pages
    });
    const [keywordInput, setKeywordInput] = useState("");

    useEffect(() => {
        if (data) {
            setFormData({
                metaTitle: data.metaTitle || "",
                metaDescription: data.metaDescription || "",
                metaKeywords: data.metaKeywords || [],
                ogImage: data.ogImage || "",
                route: data.route || "",
            });
        }
    }, [data]);

    const handleKeywordKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = keywordInput.trim();
            if (val && !formData.metaKeywords.includes(val)) {
                setFormData((prev) => ({
                    ...prev,
                    metaKeywords: [...prev.metaKeywords, val],
                }));
            }
            setKeywordInput("");
        }
    };

    const removeKeyword = (kw) => {
        setFormData((prev) => ({
            ...prev,
            metaKeywords: prev.metaKeywords.filter((k) => k !== kw),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (type === "static") {
                result = await updateStaticPageSeoAction(data.pageIdentifier, formData);
            } else if (type === "category") {
                result = await updateCategorySeoAction(data._id, formData);
            } else if (type === "subcategory") {
                result = await updateSubCategorySeoAction(data._id, formData);
            }

            if (result.success) {
                toast.success("SEO updated successfully");
                onSuccess();
                onClose();
            } else {
                toast.error(result.message || "Failed to update SEO");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit SEO Configuration</DialogTitle>
                    <DialogDescription>
                        Update meta information for <b>{data?.name || data?.pageIdentifier}</b>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">



                    <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                            id="metaTitle"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                            placeholder="Page title | Brand Name"
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {formData.metaTitle.length} / 60 characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                            id="metaDescription"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            placeholder="Brief description of the page content..."
                            className="h-24"
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {formData.metaDescription.length} / 160 characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Keywords</Label>
                        <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[42px]">
                            {formData.metaKeywords.map((kw, i) => (
                                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                                    {kw}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                                        onClick={() => removeKeyword(kw)}
                                    />
                                </Badge>
                            ))}
                            <input
                                className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
                                placeholder="Type and press Enter..."
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={handleKeywordKeyDown}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Press Enter or comma to add tags
                        </p>
                    </div>




                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
