"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { FileText, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react"

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

// --- Import Server Action (assuming this path is correct) ---
import { updateBundleAction } from "@/app/actions/admin/bundle"

// --- Zod Schema (COMPLETE) ---
const formSchema = z.object({
    // General Fields
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    description: z.string().optional(),

    // Pricing & Duration
    price: z.number().min(0, { message: "Price must be non-negative." }),
    durationValue: z.number().min(1, { message: "Duration value must be at least 1." }),
    durationUnit: z.enum(["days", "months", "years"]),
    
    // Bonus Period (Added)
    bonusPeriodValue: z.number().min(0, "Bonus value cannot be negative.").default(0).optional(),
    bonusPeriodUnit: z.enum(["days", "months", "years"]).default("months").optional(),
    
    // Configuration
    status: z.enum(["active", "inactive"]),
    isPopular: z.boolean().default(false).optional(),
    includesRecommended: z.boolean().default(false).optional(),
    isAvailableForInternational: z.boolean().default(true).optional(), // Added
    displayOrder: z.number().min(0, "Display order cannot be negative.").default(0),
    maxVendors: z.number().min(1, "Max vendors must be at least 1, or leave blank/0 for unlimited.").nullable().optional(), // Added
    
    // Features Array
    features: z.array(z.string().min(1, "Feature cannot be empty")).optional(),
});


const EditBundleModal = ({ open, setOpen, bundle, onSuccess }) => {
    // Helper to correctly handle input for maxVendors (null for unlimited)
    const handleMaxVendorsChange = (e, field) => {
        const value = e.target.value === "" ? null : Number(e.target.value);
        field.onChange(value);
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            durationValue: 1,
            durationUnit: "months",
            // NEW DEFAULTS
            bonusPeriodValue: 0, 
            bonusPeriodUnit: "months",
            isAvailableForInternational: true,
            maxVendors: null,
            // END NEW DEFAULTS
            status: "active",
            isPopular: false,
            includesRecommended: false,
            displayOrder: 0,
            features: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "features",
    });

    // ✅ Populate form when modal opens with ALL bundle data fields
    useEffect(() => {
        if (bundle && open) {
            form.reset({
                name: bundle.name || "",
                description: bundle.description || "",
                price: bundle.price || 0,
                durationValue: bundle.duration?.value || 1,
                durationUnit: bundle.duration?.unit || "months",
                
                // POPULATING NEW FIELDS
                bonusPeriodValue: bundle.bonusPeriod?.value || 0, 
                bonusPeriodUnit: bundle.bonusPeriod?.unit || "months",
                isAvailableForInternational: bundle.isAvailableForInternational ?? true,
                // Ensure maxVendors is null if it's 0 or not set for the input field to be empty
                maxVendors: (bundle.maxVendors === 0 || bundle.maxVendors === undefined) ? null : bundle.maxVendors,
                // END POPULATING NEW FIELDS

                status: bundle.status || "active",
                isPopular: bundle.isPopular || false,
                includesRecommended: bundle.includesRecommended || false,
                displayOrder: bundle.displayOrder || 0,
                features: bundle.features || [],
            });
        }
    }, [bundle, open, form]);

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
            // INCLUDING NEW FIELDS in the payload
            bonusPeriod: {
                value: values.bonusPeriodValue || 0,
                unit: values.bonusPeriodUnit || 'months',
            },
            maxVendors: values.maxVendors, // Pass null for unlimited
            isAvailableForInternational: values.isAvailableForInternational,
            // END NEW FIELDS

            status: values.status,
            isPopular: values.isPopular,
            includesRecommended: values.includesRecommended,
            displayOrder: values.displayOrder,
            features: values.features || [],
        };

        const res = await updateBundleAction(bundle._id, bundleData);

        if (res.success) {
            toast.success(res.message || "Bundle updated successfully.");
            setOpen(false);
            if (onSuccess) onSuccess();
        } else {
            toast.error(res.message || "Failed to update bundle.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!open && (
                // This is typically rendered in a table row or list item
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex gap-2">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Bundle: {bundle?.name || "Loading..."}</DialogTitle>
                    <DialogDescription>
                        Modify the details of this existing subscription bundle (ID: {bundle?._id}).
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 py-4">
                            
                            {/* --- SECTION 1: GENERAL DETAILS --- */}
                            <h4 className="font-semibold text-lg border-b pb-2">General Details</h4>

                            {/* Name */}
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

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Short description of the bundle." rows={3} {...field} />
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

                            {/* --- Bonus Period (NEW SECTION) --- */}
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

                            <div className="grid md:grid-cols-3 gap-4">
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
                                            <FormDescription>Lower numbers appear first.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Max Vendors (NEW FIELD) */}
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
                                                    value={field.value === null ? "" : field.value} 
                                                    onChange={(e) => handleMaxVendorsChange(e, field)}
                                                />
                                            </FormControl>
                                            <FormDescription>Set limit or leave blank for unlimited.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            {/* Checkboxes Group */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {/* Is Popular */}
                                <FormField
                                    control={form.control}
                                    name="isPopular"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-slate-50">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="cursor-pointer">Includes Recommended</FormLabel>
                                                <FormDescription className="!text-xs">Grants recommended listing feature to vendors.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {/* Is Available For International (NEW FIELD) */}
                                <FormField
                                    control={form.control}
                                    name="isAvailableForInternational"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-slate-50">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Pencil className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? "Updating..." : "Update Bundle"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBundleModal