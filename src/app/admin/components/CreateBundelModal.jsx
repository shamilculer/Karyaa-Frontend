"use client"

import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { FileText, Loader2, PlusCircle, Trash2 } from "lucide-react"

// --- Shadcn UI Imports ---
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

import { createBundleAction } from "@/app/actions/admin/bundle"
import { bundleFormSchema } from "@/lib/schema"


const CreateBundleModal = ({ onSuccess }) => {
    const [open, setOpen] = useState(false);
    
    // Convert 0 or null to undefined for maxVendors input to show placeholder
    const handleMaxVendorsChange = (e, field) => {
        const value = e.target.value === "" ? null : Number(e.target.value);
        field.onChange(value);
    };

    const form = useForm({
        resolver: zodResolver(bundleFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            durationValue: 1,
            durationUnit: "months",
            bonusPeriodValue: 0, 
            bonusPeriodUnit: "months",
            status: "active",
            isPopular: false,
            includesRecommended: false,
            isAvailableForInternational: true, // Default set to true
            displayOrder: 0,
            maxVendors: null, // Default to null for unlimited
            features: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "features",
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        const bundleData = {
            name: values.name,
            description: values.description,
            price: values.price,
            duration: {
                value: values.durationValue,
                unit: values.durationUnit,
            },
            bonusPeriod: {
                value: values.bonusPeriodValue || 0,
                unit: values.bonusPeriodUnit,
            },
            status: values.status,
            isPopular: values.isPopular,
            includesRecommended: values.includesRecommended,
            isAvailableForInternational: values.isAvailableForInternational,
            displayOrder: values.displayOrder,
            maxVendors: values.maxVendors,
            features: values.features || [],
        };

        const res = await createBundleAction(bundleData);

        if (res.success) {
            toast.success(res.message);
            form.reset();
            setOpen(false);
            if (onSuccess) {
                onSuccess(); 
            }
        } else {
            toast.error(res.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-white flex gap-2">
                    <FileText className="w-4 h-4" />
                    Create New Bundle
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Bundle</DialogTitle>
                    <DialogDescription>
                        Define the details, pricing, and configuration for a new subscription plan.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 py-4">
                            
                            {/* --- SECTION 1: GENERAL DETAILS --- */}
                            <h4 className="font-semibold text-lg border-b pb-2">General Details</h4>

                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bundle Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Starter Plan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A brief, engaging description of what's included." rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />
                            
                            {/* --- SECTION 2: PRICING & DURATION --- */}
                            <h4 className="font-semibold text-lg border-b pb-2">Pricing & Duration</h4>

                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Price */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (AED)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    step="0.01" 
                                                    min="0"
                                                    placeholder="1500.00" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Duration Value */}
                                <FormField
                                    control={form.control}
                                    name="durationValue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration Value</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    min="1"
                                                    placeholder="1" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                {/* Duration Unit */}
                                <FormField
                                    control={form.control}
                                    name="durationUnit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="days">Days</SelectItem>
                                                    <SelectItem value="months">Months</SelectItem>
                                                    <SelectItem value="years">Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="my-2" />

                            {/* --- Bonus Period --- */}
                            <h4 className="font-semibold text-base">Bonus Period (Optional)</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Bonus Period Value */}
                                <FormField
                                    control={form.control}
                                    name="bonusPeriodValue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bonus Value (0 for none)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="0" 
                                                    value={field.value === 0 ? "" : field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Extra period added to the subscription.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Bonus Period Unit */}
                                <FormField
                                    control={form.control}
                                    name="bonusPeriodUnit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bonus Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="days">Days</SelectItem>
                                                    <SelectItem value="months">Months</SelectItem>
                                                    <SelectItem value="years">Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            {/* --- SECTION 3: CONFIGURATION --- */}
                            <h4 className="font-semibold text-lg border-b pb-2">Configuration</h4>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Status */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Display Order */}
                                <FormField
                                    control={form.control}
                                    name="displayOrder"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Order</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="0" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Lower numbers appear first on the frontend.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            {/* Max Vendors */}
                            <FormField
                                control={form.control}
                                name="maxVendors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Vendors</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min="1"
                                                placeholder="Leave blank or 0 for unlimited" 
                                                // Ensure the input field value is handled correctly for null/0
                                                value={field.value === null || field.value === 0 ? "" : field.value} 
                                                onChange={(e) => handleMaxVendorsChange(e, field)}
                                            />
                                        </FormControl>
                                        <FormDescription>Limits the number of subscriptions to this bundle. Use 0 or leave blank for unlimited.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Checkboxes Group */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {/* Is Popular */}
                                <FormField
                                    control={form.control}
                                    name="isPopular"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-slate-50">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="cursor-pointer">Mark as Popular</FormLabel>
                                                <FormDescription className="!text-xs">Highlights this on the bundles page.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* Includes Recommended */}
                                <FormField
                                    control={form.control}
                                    name="includesRecommended"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-slate-50">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="cursor-pointer">Includes Recommended</FormLabel>
                                                <FormDescription className="!text-xs">Grants recommended listing feature to vendors.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* Is Available For International */}
                                <FormField
                                    control={form.control}
                                    name="isAvailableForInternational"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-slate-50">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="cursor-pointer">Available Internationally</FormLabel>
                                                <FormDescription className="!text-xs">Allow purchase by vendors outside the primary region.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            {/* --- SECTION 4: FEATURES --- */}
                            <h4 className="font-semibold text-lg border-b pb-2 flex justify-between items-center">
                                Features 
                                <Button 
                                    type="button" 
                                    onClick={() => append("")} 
                                    variant="outline"
                                    size="sm"
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" /> Add Feature
                                </Button>
                            </h4>
                            <FormDescription>
                                Define the benefits included in this bundle as simple text descriptions.
                            </FormDescription>

                            {/* Dynamic Features Array */}
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`features.${index}`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder={`Feature #${index + 1}: e.g., Max 5 listings per month`} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="icon"
                                            onClick={() => remove(index)}
                                            className="h-10 w-10 shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {form.formState.errors.features && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {form.formState.errors.features.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileText className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? "Creating..." : "Create Bundle"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBundleModal