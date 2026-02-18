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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

    // Kept for internal logic if needed, though mostly replaced by Accordion structure
    const [activeTab, setActiveTab] = useState("customer");
    // We don't really need activeTab anymore if they are separate Accordion Items

    // const [expandedItems, setExpandedItems] = useState({});

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
        // Note: With nested accordions for items, we might need a different approach or just let the user open it.
        // For now, let's keep the custom toggle logic for the *inner* list items or switch them to Accordion too.
        // Let's switch inner items to Accordion type="multiple" for consistency with Media Kit.
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

    const renderFaqList = (type) => {
        const faqs = type === "customer" ? customerFaqs : vendorFaqs;

        if (faqs.length === 0) {
            return (
                <div className="border border-dashed border-gray-200 rounded-lg p-12 text-center">
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
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <Accordion type="multiple" className="w-full space-y-3">
                    {faqs.map((faq, index) => {
                        return (
                            <AccordionItem key={index} value={`${type}-${index}`} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden box-border">
                                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50/50 hover:no-underline">
                                    <div className="flex items-center gap-3 w-full pr-2">
                                        {/* Drag Handle (Visual) */}
                                        <div className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <GripVertical className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1 text-left min-w-0">
                                            <div className="!text-lg font-medium text-gray-900 line-clamp-1 break-all">
                                                {faq.question || <span className="text-gray-400 italic font-normal">New Question</span>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveUp(type, index)}
                                                disabled={index === 0}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                            >
                                                <GripVertical className="w-4 h-4 rotate-90" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveDown(type, index)}
                                                disabled={index === faqs.length - 1}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                            >
                                                <GripVertical className="w-4 h-4 -rotate-90" />
                                            </Button>

                                            <div className="w-px h-4 bg-gray-200 mx-1"></div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveFaq(type, index)}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 pt-0 border-t border-gray-100">
                                    <div className="space-y-5 pt-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Question <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                value={faq.question}
                                                onChange={(e) =>
                                                    handleUpdateFaq(type, index, "question", e.target.value)
                                                }
                                                placeholder="Enter your question here..."
                                                className="font-medium"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">
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
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
                <div className="flex justify-center pt-2">
                    <Button onClick={() => handleAddFaq(type)} variant="outline" className="w-full border-dashed py-6 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container !pt-0">
            {/* Header */}
            <div className="border-b border-gray-200 sticky left-0 top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push("/admin/content-moderation/content")}
                                className="!rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-700"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <span className="!text-xl uppercase font-bold font-heading text-gray-900">
                                    FAQ Page Editor
                                </span>
                                <p className="!text-sm text-gray-500">
                                    Manage page title and frequently asked questions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={handlePreview}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>

                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="pt-10 max-w-5xl mx-auto pb-12">
                <div className="space-y-10">
                    {/* Page Title Settings */}
                    <Accordion type="single" collapsible className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" defaultValue="page-config">
                        <AccordionItem value="page-config" className="border-0">
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 hover:no-underline">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xl font-semibold text-gray-800">Page Configuration</span>
                                    <span className="!text-sm font-normal text-gray-500">Customize the header area of your FAQ page</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                <div className="space-y-6 pt-2 border-t border-gray-100">
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
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* FAQ Tabs */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="!text-2xl font-semibold text-gray-900">Manage FAQs</h2>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-gray-100/50 p-1 h-auto gap-2 border border-gray-200 rounded-lg mb-6 w-full md:w-auto overflow-x-auto">
                                <TabsTrigger
                                    value="customer"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all font-medium flex-1 !text-lg data-[state=active]:border-2 data-[state=active]:border-secondary bg-white border-primary cursor-pointer text-gray-600"
                                >
                                    Customer FAQs ({customerFaqs.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="vendor"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all font-medium flex-1 data-[state=active]:border-2 data-[state=active]:border-secondary bg-white border-primary cursor-pointer !text-lg text-gray-600"
                                >
                                    Vendor FAQs ({vendorFaqs.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="customer" className="mt-0 focus-visible:outline-none">
                                {renderFaqList("customer")}
                            </TabsContent>

                            <TabsContent value="vendor" className="mt-0 focus-visible:outline-none">
                                {renderFaqList("vendor")}
                            </TabsContent>
                        </Tabs>
                    </div>


                    {/* Save Button Footer */}
                    <div className="flex justify-end pb-10 mt-8 border-t pt-6">
                        <Button type="submit" size="lg" disabled={saving} className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all min-w-[200px]">
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
        </div>
    );
};

export default FaqManagementPage;
