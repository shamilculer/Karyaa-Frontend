"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Loader2,
    ArrowLeft,
    Eye,
    Plus,
    Save,
    GripVertical,
    Trash2,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import {
    getBulkContentAction,
} from "@/app/actions/public/content";
import {
    upsertContentAction,
} from "@/app/actions/admin/pages";

import { useForm, Controller } from "react-hook-form";

const FaqManagementPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("customer");
    const [expandedItems, setExpandedItems] = useState({});

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            pageTitle: {
                heading: "FAQ",
                tagline: "Everything You Need to Know",
                bannerImage: "",
            },
            customerFaqs: [],
            vendorFaqs: [],
        },
    });

    const customerFaqs = watch("customerFaqs");
    const vendorFaqs = watch("vendorFaqs");

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const result = await getBulkContentAction(["faq-customer", "faq-vendor", "faq-page-title"]);

            if (result.success) {
                const customerData = result.data.find((item) => item.key === "faq-customer");
                const vendorData = result.data.find((item) => item.key === "faq-vendor");
                const pageTitleData = result.data.find((item) => item.key === "faq-page-title");

                setValue("customerFaqs", customerData?.content || []);
                setValue("vendorFaqs", vendorData?.content || []);

                if (pageTitleData?.content) {
                    setValue("pageTitle", pageTitleData.content);
                }
            }
        } catch (error) {
            toast.error("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    };

    const handleAddFaq = (type) => {
        const field = type === "customer" ? "customerFaqs" : "vendorFaqs";
        const current = watch(field);
        const newIndex = current.length;
        setValue(field, [...current, { question: "", answer: "" }]);

        // Automatically expand the newly added FAQ
        const key = `${type}-${newIndex}`;
        setExpandedItems(prev => ({
            ...prev,
            [key]: true
        }));
    };

    const handleRemoveFaq = (type, index) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            const field = type === "customer" ? "customerFaqs" : "vendorFaqs";
            const current = watch(field);
            setValue(
                field,
                current.filter((_, i) => i !== index)
            );
        }
    };

    const handleUpdateFaq = (type, index, fieldName, value) => {
        const field = type === "customer" ? "customerFaqs" : "vendorFaqs";
        const current = watch(field);
        const updated = [...current];
        updated[index][fieldName] = value;
        setValue(field, updated);
    };

    const handleMoveUp = (type, index) => {
        if (index === 0) return;
        const field = type === "customer" ? "customerFaqs" : "vendorFaqs";
        const current = watch(field);
        const updated = [...current];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setValue(field, updated);
    };

    const handleMoveDown = (type, index) => {
        const field = type === "customer" ? "customerFaqs" : "vendorFaqs";
        const current = watch(field);
        if (index === current.length - 1) return;
        const updated = [...current];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setValue(field, updated);
    };

    const onSubmit = async (data) => {
        // Validate customer FAQs
        const invalidCustomerFaqs = data.customerFaqs.filter(
            (faq) => !faq.question.trim() || !faq.answer.trim()
        );
        if (invalidCustomerFaqs.length > 0) {
            toast.error("All customer FAQ questions and answers must be filled");
            setActiveTab("customer");
            return;
        }

        // Validate vendor FAQs
        const invalidVendorFaqs = data.vendorFaqs.filter(
            (faq) => !faq.question.trim() || !faq.answer.trim()
        );
        if (invalidVendorFaqs.length > 0) {
            toast.error("All vendor FAQ questions and answers must be filled");
            setActiveTab("vendor");
            return;
        }

        if (data.customerFaqs.length === 0 && data.vendorFaqs.length === 0) {
            toast.error("Please add at least one FAQ");
            return;
        }

        setSaving(true);
        try {
            // Save customer FAQs
            const customerResult = await upsertContentAction("faq-customer", {
                type: "faq",
                content: data.customerFaqs,
            });

            if (!customerResult.success) {
                console.error("Customer FAQs save failed:", customerResult);
                toast.error(`Failed to save customer FAQs: ${customerResult.message || 'Unknown error'}`);
                setSaving(false);
                return;
            }

            // Save vendor FAQs
            const vendorResult = await upsertContentAction("faq-vendor", {
                type: "faq",
                content: data.vendorFaqs,
            });

            if (!vendorResult.success) {
                console.error("Vendor FAQs save failed:", vendorResult);
                toast.error(`Failed to save vendor FAQs: ${vendorResult.message || 'Unknown error'}`);
                setSaving(false);
                return;
            }

            // Save page title
            const pageTitleResult = await upsertContentAction("faq-page-title", {
                type: "setting",
                content: data.pageTitle,
            });

            if (!pageTitleResult.success) {
                console.error("Page title save failed:", pageTitleResult);
                toast.error(`Failed to save page title: ${pageTitleResult.message || 'Unknown error'}`);
                setSaving(false);
                return;
            }

            toast.success("All FAQ changes saved successfully!");
        } catch (error) {
            console.error("Error saving FAQs:", error);
            toast.error(`Failed to save FAQs: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        window.open("/faq", "_blank");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const toggleExpanded = (type, index) => {
        const key = `${type}-${index}`;
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const renderFaqList = (type) => {
        const faqs = type === "customer" ? customerFaqs : vendorFaqs;

        if (faqs.length === 0) {
            return (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                <Plus className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium mb-1">No FAQs yet</p>
                                <p className="text-gray-500 text-sm">
                                    Click "Add Question" to create your first FAQ
                                </p>
                            </div>
                            <Button onClick={() => handleAddFaq(type)} className="mt-2">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Question
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-3">
                {faqs.map((faq, index) => {
                    const key = `${type}-${index}`;
                    const isExpanded = expandedItems[key];

                    return (
                        <div key={index} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                            {/* Accordion Header */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50">
                                {/* Reorder Controls */}
                                <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoveUp(type, index)}
                                        disabled={index === 0}
                                        className="h-7 w-7 p-0"
                                    >
                                        <GripVertical className="w-4 h-4 rotate-90" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoveDown(type, index)}
                                        disabled={index === faqs.length - 1}
                                        className="h-7 w-7 p-0"
                                    >
                                        <GripVertical className="w-4 h-4 -rotate-90" />
                                    </Button>
                                </div>

                                {/* Question Preview */}
                                <button
                                    type="button"
                                    onClick={() => toggleExpanded(type, index)}
                                    className="flex-1 flex items-center justify-between text-left hover:text-primary transition-colors"
                                >
                                    <span className="font-medium text-gray-900">
                                        {faq.question || `Question ${index + 1}`}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Delete Button */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFaq(type, index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Accordion Content */}
                            {isExpanded && (
                                <div className="p-4 space-y-4 border-t">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Question <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={faq.question}
                                            onChange={(e) =>
                                                handleUpdateFaq(type, index, "question", e.target.value)
                                            }
                                            placeholder="Enter your question here..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Answer <span className="text-red-500">*</span>
                                        </Label>
                                        <SimpleTiptapEditor
                                            value={faq.answer}
                                            onChange={(value) =>
                                                handleUpdateFaq(type, index, "answer", value)
                                            }
                                            placeholder="Enter the answer here..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="dashboard-container mb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 dashboard-container z-50 sticky top-0 right-0 bg-body">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/admin/content-moderation/content")}
                        className="border rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="!text-2xl !tracking-wide !text-primary/80 font-bold">
                            FAQ Page Management
                        </h1>
                        <p className="!text-sm text-gray-500">
                            Manage page title and frequently asked questions
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handlePreview}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save All Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Page Title Settings */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Page Title Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Controller
                                name="pageTitle.heading"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="FAQ" />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Controller
                                name="pageTitle.tagline"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Everything You Need to Know" />
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Banner Image</Label>
                        <ControlledFileUpload
                            control={control}
                            name="pageTitle.bannerImage"
                            label="Upload Banner Image"
                            errors={errors}
                            allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                            folderPath="pages/faq"
                            role="admin"
                            aspectRatio={16 / 9}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-transparent p-1 h-auto gap-2 border-b border-gray-100 pb-4">
                        <TabsTrigger
                            value="customer"
                            className="data-[state=active]:bg-primary bg-gray-200 data-[state=active]:text-white data-[state=active]:shadow-none border border-transparent data-[state=active]:border-secondary px-6 py-2.5 transition-all duration-200 data-[state=active]:border-b-4"
                        >
                            Customer FAQs ({customerFaqs.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="vendor"
                            className="data-[state=active]:bg-primary bg-gray-200 data-[state=active]:text-white data-[state=active]:shadow-none border border-transparent data-[state=active]:border-secondary px-6 py-2.5 transition-all duration-200 data-[state=active]:border-b-4"
                        >
                            Vendor FAQs ({vendorFaqs.length})
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        type="button"
                        onClick={() => handleAddFaq(activeTab)}
                        variant="outline"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                </div>

                <TabsContent value="customer" className="mt-0">
                    {renderFaqList("customer")}
                </TabsContent>

                <TabsContent value="vendor" className="mt-0">
                    {renderFaqList("vendor")}
                </TabsContent>
            </Tabs>

            {/* Add padding to bottom */}
            {(customerFaqs.length > 0 || vendorFaqs.length > 0) && (
                <div className="h-20" />
            )}
        </form>
    );
};

export default FaqManagementPage;
