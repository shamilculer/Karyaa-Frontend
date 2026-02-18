"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVendorFormStore } from "@/store/vendorFormStore";
import { Step2Schema } from "@/lib/schema";

// Shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ControlledFileUpload from "@/components/common/ControlledFileUploads";
import { getCategories as fetchCategoriesAction } from "@/app/actions/public/categories";
import { getBundleOptions } from "@/app/actions/vendor/bundles";
import { Combobox } from "@/components/ui/combobox";
import { countries } from "@/lib/countries";
import AvailabilityEditor from "@/components/common/AvailabilityEditor";

const OCCASION_OPTIONS = [
    { slug: "wedding", name: "Wedding" },
    { slug: "engagement", name: "Engagement" },
    { slug: "proposal", name: "Proposal" },
    { slug: "baby-shower", name: "Baby Shower" },
    { slug: "gender-reveal", name: "Gender Reveal" },
    { slug: "birthday", name: "Birthday" },
    { slug: "graduation", name: "Graduation" },
    { slug: "corporate-event", name: "Corporate Event" },
    { slug: "brand-launch", name: "Brand Launch" },
    { slug: "festivities", name: "Festivities" },
    { slug: "anniversary", name: "Anniversary" },
];
// helper to render text fields
const renderInputField = ({ control, name, label, placeholder, type = "text" }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-xs leading-0 font-medium">{label}</FormLabel>
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field}
                        value={field.value === 0 || field.value === undefined || field.value === null ? "" : field.value}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(type === "number" ? (value === "" ? "" : Number(value)) : value);
                        }}
                        type={type}
                        className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const CategoryMultiSelect = ({ options, value, onChange, placeholder, disabled, valueKey = '_id' }) => {
    const toggleSelection = (optionValue) => {
        if (disabled) return;

        if (Array.isArray(value) && value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        } else {
            onChange(Array.isArray(value) ? [...value, optionValue] : [optionValue]);
        }
    };

    const isItemSelected = (val) => Array.isArray(value) && value.includes(val);

    return (
        <div className={`p-2 rounded-md bg-[#f0f0f0] ${disabled ? 'opacity-70' : ''}`}>
            {options.length === 0 ? (
                <p className="!text-sm text-gray-500 pt-1">{placeholder}</p>
            ) : (
                <div className="flex flex-wrap gap-2 py-1">
                    {options.map((option) => {
                        const optionValue = option[valueKey];
                        const nameToDisplay = option.name || option.slug || optionValue;

                        return (
                            <button
                                key={option.slug || optionValue}
                                type="button"
                                onClick={() => toggleSelection(optionValue)}
                                disabled={disabled}
                                className={`px-3 py-1 !text-sm rounded-full cursor-pointer transition-colors font-medium ${isItemSelected(optionValue)
                                    ? "bg-primary text-white border-primary"
                                    : "bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-200"
                                    }`}
                            >
                                {nameToDisplay} {isItemSelected(optionValue) ? '×' : '+'}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default function Step02_BusinessInfo() {
    const { formData, updateFields, nextStep, prevStep } = useVendorFormStore();

    const isInternational = formData.isInternational;

    const [categories, setCategories] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingBundles, setIsLoadingBundles] = useState(true);
    const [categoryError, setCategoryError] = useState(null);
    const [bundleError, setBundleError] = useState(null);

    const tempUploadToken = formData.tempUploadToken;
    const FOLDER_PATH = `temp_vendors/${tempUploadToken}`;

    const form = useForm({
        resolver: zodResolver(Step2Schema),
        defaultValues: {
            businessName: formData.businessName || "",
            businessLogo: formData.businessLogo || "",
            tagline: formData.tagline || "",
            businessDescription: formData.businessDescription || "",
            whatsAppNumber: formData.whatsAppNumber || "",
            pricingStartingFrom: formData.pricingStartingFrom || "",
            mainCategory: formData.mainCategory || [],
            subCategories: formData.subCategories || [],
            occasionsServed: formData.occasionsServed || [],
            selectedBundle: formData.selectedBundle || "",
            address: {
                street: formData.address?.street || "",
                area: formData.address?.area || "",
                city: formData.address?.city || "",
                state: formData.address?.state || "",
                country: formData.address?.country || (isInternational ? "" : "United Arab Emirates"),
                zipCode: formData.address?.zipCode || "",

                coordinates: {
                    latitude: formData.address?.coordinates?.latitude,
                    longitude: formData.address?.coordinates?.longitude,
                },
            },
            websiteLink: formData.websiteLink || "",
            facebookLink: formData.facebookLink || "",
            instagramLink: formData.instagramLink || "",
            twitterLink: formData.twitterLink || "",
            availability: formData.availability || {
                type: '24/7',
                days: [
                    { day: 'Monday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Tuesday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Wednesday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Thursday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Friday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Saturday', isOpen: true, open: '09:00', close: '17:00' },
                    { day: 'Sunday', isOpen: false, open: '09:00', close: '17:00' },
                ],
            },
        },
        mode: "onBlur",
        reValidateMode: "onChange",
        criteriaMode: "all",
    });

    const selectedMainCategoryIds = form.watch('mainCategory');

    const allSubCategories = categories.reduce((acc, cat) => {
        if (selectedMainCategoryIds.includes(cat._id)) {
            return acc.concat(cat.subCategories);
        }
        return acc;
    }, []);

    const isMainCategorySelected = selectedMainCategoryIds.length > 0;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const categoryResponse = await fetchCategoriesAction();
                if (categoryResponse.success) {
                    setCategories(categoryResponse.categories || []);
                    setCategoryError(null);
                } else {
                    setCategoryError(categoryResponse.message || "Failed to load categories.");
                }

                const bundleResponse = await getBundleOptions();
                if (!bundleResponse.error) {
                    setBundles(bundleResponse.bundles || []);
                    if (!formData.selectedBundle && bundleResponse.bundles.length > 0) {
                        form.setValue('selectedBundle', bundleResponse.bundles[0]._id);
                    }
                    setBundleError(null);
                } else {
                    setBundleError(bundleResponse.error || "Failed to load bundles.");
                }
            } catch (err) {
                console.error("Fetch initial data error:", err);
                setCategoryError("A network error occurred while loading categories.");
                setBundleError("A network error occurred while loading bundles.");
            } finally {
                setIsLoadingCategories(false);
                setIsLoadingBundles(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (!isMainCategorySelected) {
            form.setValue('subCategories', [], { shouldValidate: true });
        }
    }, [isMainCategorySelected, form]);

    const handleNext = (data) => {

        // We know it's already valid if it reaches here, so no need for Step2Schema.parse(data) again.
        updateFields(data);
        nextStep();
    };

    const handleBack = () => {
        updateFields(form.getValues());
        prevStep();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
                <h4 className="!text-2xl font-bold text-primary mb-6">
                    Step 2: Business Profile, Offerings & Location
                </h4>

                {renderInputField({ control: form.control, name: "businessName", label: "Business Name", placeholder: "Enter your business name" })}

                <FormField
                    control={form.control}
                    name="businessLogo"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">Business Logo</FormLabel>
                            <FormControl>
                                <ControlledFileUpload
                                    control={form.control}
                                    name="businessLogo"
                                    label="Upload Business Logo (JPG/PNG)"
                                    errors={form.formState.errors}
                                    allowedMimeType={["image/jpeg", "image/png"]}
                                    folderPath={FOLDER_PATH}
                                    isPublic={true}
                                    aspectRatio={1}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {renderInputField({ control: form.control, name: "tagline", label: "Tagline (Optional)", placeholder: "A catchy tagline for your business (max 120 chars)" })}

                <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">Business Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your business, services, and unique selling points (min 50 chars, max 1000 chars)"
                                    {...field}
                                    rows={5}
                                    className="p-4 bg-[#f0f0f0] border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {renderInputField({ control: form.control, name: "whatsAppNumber", label: "WhatsApp Number", placeholder: "e.g., 97150xxxxxxx" })}

                <h5 className="!text-xl font-bold text-gray-700 mt-10 mb-6 border-t border-gray-400 pt-6">Business Offerings</h5>

                {renderInputField({
                    control: form.control,
                    name: "pricingStartingFrom",
                    label: "Pricing Starting From (AED)",
                    placeholder: "e.g., 1500",
                    type: "number"
                })}

                <FormField
                    control={form.control}
                    name="mainCategory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">Main Categories (Select multiple)</FormLabel>
                            <FormControl>
                                <CategoryMultiSelect
                                    options={categories}
                                    value={field.value}
                                    onChange={field.onChange}
                                    valueKey="_id"
                                    disabled={isLoadingCategories || !!categoryError}
                                    placeholder={isLoadingCategories ? "Loading..." : categoryError ? "Error" : "Select categories"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isMainCategorySelected && (
                    <FormField
                        control={form.control}
                        name="subCategories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Sub Categories (Select multiple)</FormLabel>
                                <FormControl>
                                    <CategoryMultiSelect
                                        options={allSubCategories}
                                        value={field.value}
                                        onChange={field.onChange}
                                        valueKey="_id"
                                        disabled={isLoadingCategories}
                                        placeholder="Select subcategories"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Occasions */}
                <FormField
                    control={form.control}
                    name="occasionsServed"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">Occasions Served</FormLabel>
                            <FormControl>
                                <CategoryMultiSelect
                                    options={OCCASION_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    valueKey="slug"
                                    disabled={false}
                                    placeholder="Select all event types"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="selectedBundle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs leading-0 font-medium">Select a Package</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isLoadingBundles || !!bundleError}
                            >
                                <FormControl>
                                    <SelectTrigger className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0">
                                        <SelectValue placeholder="Select a Package" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {bundles.map((bundle) => (
                                        <SelectItem key={bundle._id} value={bundle._id}>
                                            {bundle.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h5 className="!text-xl font-bold text-gray-700 mt-10 mb-6 border-t border-gray-400 pt-6">Location Details</h5>

                {renderInputField({ control: form.control, name: "address.city", label: "City (Required)", placeholder: "e.g., Dubai, Abu Dhabi" })}
                {renderInputField({ control: form.control, name: "address.street", label: "Street Address (Optional)", placeholder: "Street or building name" })}
                {renderInputField({ control: form.control, name: "address.area", label: "Area/District (Optional)", placeholder: "Area or neighborhood" })}
                {renderInputField({ control: form.control, name: "address.state", label: "Emirate/State (Optional)", placeholder: "e.g., Dubai" })}

                {/* ✅ COUNTRY FIELD (Conditional) */}
                {isInternational && (
                    <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs leading-0 font-medium">Country (Required for international vendors)</FormLabel>
                                <FormControl>
                                    <Combobox
                                        options={countries}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select your country"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {renderInputField({ control: form.control, name: "address.zipCode", label: "Zip Code (Optional)", placeholder: "00000" })}


                <h5 className="!text-xl font-bold text-gray-700 mt-10 mb-6 border-t border-gray-400 pt-6">Online Presence (Optional)</h5>

                {renderInputField({ control: form.control, name: "websiteLink", label: "Website Link", placeholder: "https://yourbusiness.com" })}
                {renderInputField({ control: form.control, name: "instagramLink", label: "Instagram Link", placeholder: "https://instagram.com/yourhandle" })}
                {renderInputField({ control: form.control, name: "facebookLink", label: "Facebook Link", placeholder: "https://facebook.com/yourpage" })}
                {renderInputField({ control: form.control, name: "twitterLink", label: "Twitter/X Link", placeholder: "https://twitter.com/yourhandle" })}

                <h5 className="!text-xl font-bold text-gray-700 mt-10 mb-6 border-t border-gray-400 pt-6">Business Hours</h5>

                <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AvailabilityEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="w-40 text-base"
                    >
                        ← Back
                    </Button>
                    <Button
                        type="submit"
                        className="w-40 text-base"
                        disabled={form.formState.isSubmitting || isLoadingCategories || isLoadingBundles}
                    >
                        Next Step →
                    </Button>
                </div>
            </form>
        </Form>
    );
}
