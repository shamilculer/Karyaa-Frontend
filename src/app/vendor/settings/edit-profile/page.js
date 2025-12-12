"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Save, Loader2, CheckCircle2, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ControlledFileUpload from '@/components/common/ControlledFileUploads';
import { getVendorProfile, updateVendorProfile } from '@/app/actions/vendor/auth';
import { getCategories } from '@/app/actions/public/categories';
import { useVendorStore } from '@/store/vendorStore';
import Image from 'next/image';

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

const editProfileSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  businessName: z.string().min(1, "Business name is required"),
  tagline: z.string().max(120, "Tagline must be 120 characters or less").optional(),
  businessDescription: z.string().min(50, "Minimum 50 characters required").max(1500, "Maximum 1500 characters allowed"),
  whatsAppNumber: z.string().min(1, "WhatsApp number is required"),
  pricingStartingFrom: z.number().min(0).optional(),
  isInternational: z.boolean(),
  // UAE-specific fields
  tradeLicenseNumber: z.string().optional(),
  tradeLicenseCopy: z.string().optional(),
  personalEmiratesIdNumber: z.string().optional(),
  emiratesIdCopy: z.string().optional(),
  // International-specific fields
  businessLicenseCopy: z.string().optional(),
  passportOrIdCopy: z.string().optional(),
  mainCategory: z.array(z.string()).min(1, "Select at least one category"),
  subCategories: z.array(z.string()),
  occasionsServed: z.array(z.string()),
  address: z.object({
    street: z.string().optional(),
    area: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().optional(),
    googleMapLink: z.string().optional(),
  }),
  websiteLink: z.string().optional(),
  facebookLink: z.string().optional(),
  instagramLink: z.string().optional(),
  twitterLink: z.string().optional(),
  ownerProfileImage: z.string().optional(),
  businessLogo: z.string().optional(),
}).refine((data) => {
  // If UAE vendor, require UAE documents
  if (!data.isInternational) {
    return !!(data.tradeLicenseNumber && data.tradeLicenseCopy &&
      data.personalEmiratesIdNumber && data.emiratesIdCopy);
  }
  // If international vendor, require international documents
  return !!(data.businessLicenseCopy && data.passportOrIdCopy);
}, {
  message: "Required documents are missing",
  path: ["documents"]
});

const ImagePreview = ({ src, alt, onRemove, label }) => {
  if (!src) return null;

  return (
    <div className="relative inline-block">
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {label && <p className="text-xs text-gray-600 mt-2 text-center">{label}</p>}
    </div>
  );
};

const DocumentPreview = ({ src, label, onRemove }) => {
  if (!src) return null;

  const isPDF = src.toLowerCase().includes('.pdf');
  const fileName = src.substring(src.lastIndexOf('/') + 1);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">{fileName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </a>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

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
    <div className={`p-2 rounded-md bg-[#f0f0f0] min-h-[44px] ${disabled ? 'opacity-70' : ''}`}>
      {options.length === 0 ? (
        <p className="text-sm text-gray-500 pt-1">{placeholder}</p>
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
                className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors font-medium ${isItemSelected(optionValue)
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-200"
                  }`}
              >
                {nameToDisplay} {isItemSelected(optionValue) ? '×' : '+'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const EditProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [vendorId, setVendorId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { setVendor } = useVendorStore();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      ownerName: "",
      email: "",
      phoneNumber: "",
      businessName: "",
      tagline: "",
      businessDescription: "",
      whatsAppNumber: "",
      isInternational: false,
      pricingStartingFrom: 0,
      tradeLicenseNumber: "",
      personalEmiratesIdNumber: "",
      tradeLicenseCopy: "",
      emiratesIdCopy: "",
      businessLicenseCopy: "",
      passportOrIdCopy: "",
      mainCategory: [],
      subCategories: [],
      occasionsServed: [],
      address: {
        street: "",
        area: "",
        city: "",
        state: "",
        country: "UAE",
        zipCode: "",
        googleMapLink: ""
      },
      websiteLink: "",
      facebookLink: "",
      instagramLink: "",
      twitterLink: "",
      ownerProfileImage: "",
      businessLogo: "",
    },
    mode: "onBlur",
  });

  const selectedMainCategoryIds = form.watch('mainCategory');
  const ownerProfileImage = form.watch('ownerProfileImage');
  const businessLogo = form.watch('businessLogo');
  const isInternational = form.watch('isInternational');
  const tradeLicenseCopy = form.watch('tradeLicenseCopy');
  const emiratesIdCopy = form.watch('emiratesIdCopy');
  const businessLicenseCopy = form.watch('businessLicenseCopy');
  const passportOrIdCopy = form.watch('passportOrIdCopy');

  const allSubCategories = categories.reduce((acc, cat) => {
    if (selectedMainCategoryIds.includes(cat._id)) {
      return acc.concat(cat.subCategories || []);
    }
    return acc;
  }, []);

  const isMainCategorySelected = selectedMainCategoryIds.length > 0;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const result = await getCategories();

      if (result.success) {
        setCategories(result.categories || []);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getVendorProfile();
      if (result.success) {
        const vendor = result.data;
        setVendorId(vendor._id);

        const formData = {
          ownerName: vendor.ownerName || "",
          email: vendor.email || "",
          phoneNumber: vendor.phoneNumber || "",
          businessName: vendor.businessName || "",
          tagline: vendor.tagline || "",
          businessDescription: vendor.businessDescription || "",
          whatsAppNumber: vendor.whatsAppNumber || "",
          pricingStartingFrom: vendor.pricingStartingFrom || 0,
          isInternational: vendor.isInternational || false,
          tradeLicenseNumber: vendor.tradeLicenseNumber || "",
          personalEmiratesIdNumber: vendor.personalEmiratesIdNumber || "",
          tradeLicenseCopy: vendor.tradeLicenseCopy || "",
          emiratesIdCopy: vendor.emiratesIdCopy || "",
          businessLicenseCopy: vendor.businessLicenseCopy || "",
          passportOrIdCopy: vendor.passportOrIdCopy || "",
          mainCategory: vendor.mainCategory?.map(cat => cat._id) || [],
          subCategories: vendor.subCategories?.map(sub => sub._id) || [],
          occasionsServed: vendor.occasionsServed || [],
          address: {
            street: vendor.address?.street || "",
            area: vendor.address?.area || "",
            city: vendor.address?.city || "",
            state: vendor.address?.state || "",
            country: vendor.address?.country || "UAE",
            zipCode: vendor.address?.zipCode || "",
            googleMapLink: vendor.address?.googleMapLink || ""
          },
          websiteLink: vendor.websiteLink || "",
          facebookLink: vendor.facebookLink || "",
          instagramLink: vendor.instagramLink || "",
          twitterLink: vendor.twitterLink || "",
          ownerProfileImage: vendor.ownerProfileImage || "",
          businessLogo: vendor.businessLogo || "",
        };

        form.reset(formData);
      } else {
        setError(result.error || "Failed to load profile");
      }
    } catch (err) {
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, [fetchProfile, fetchCategories]);

  useEffect(() => {
    if (!isMainCategorySelected) {
      form.setValue('subCategories', [], { shouldValidate: true });
    }
  }, [isMainCategorySelected, form]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const result = await updateVendorProfile(vendorId, data);
      if (result.success) {
        setVendor(result.data)
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "business", label: "Business Details" },
    { id: "documents", label: "Documents" },
    { id: "address", label: "Address & Social" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="!text-xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your vendor profile information</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-green-800 text-sm">Profile updated successfully!</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <Form {...form}>
            <div className="p-6">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Owner Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your name" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Email *</FormLabel>
                          <FormControl>
                            <Input {...field} className="p-4 bg-gray-100 h-11 border-none" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Phone Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+971501234567" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsAppNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">WhatsApp Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+971501234567" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ownerProfileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Owner Profile Image</FormLabel>
                        <div className="space-y-4">
                          <FormControl>
                            <ControlledFileUpload
                              control={form.control}
                              name="ownerProfileImage"
                              label={ownerProfileImage ? "Change Profile Image" : "Upload Profile Image"}
                              errors={form.formState.errors}
                              allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                              folderPath="vendors/profiles"
                              role="vendor"
                              aspectRatio={1}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Business Logo</FormLabel>
                        <div className="space-y-4">
                          <FormControl>
                            <ControlledFileUpload
                              control={form.control}
                              name="businessLogo"
                              label={businessLogo ? "Change Logo" : "Upload Logo"}
                              errors={form.formState.errors}
                              allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                              folderPath="vendors/logos"
                              role="vendor"
                              aspectRatio={1}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {activeTab === "business" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Business Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter business name" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Short catchy phrase" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Business Description *</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your business..." className="p-4 bg-[#f0f0f0] min-h-[120px] border-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pricingStartingFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Starting Price (AED)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="p-4 bg-[#f0f0f0] h-11 border-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mainCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Main Categories (Select multiple) *</FormLabel>
                        <FormControl>
                          <CategoryMultiSelect
                            options={categories}
                            value={field.value}
                            onChange={field.onChange}
                            valueKey="_id"
                            disabled={isLoadingCategories}
                            placeholder={isLoadingCategories ? "Loading..." : "Select categories"}
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
                          <FormLabel className="text-xs font-medium">Sub Categories (Select multiple)</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="occasionsServed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Occasions Served</FormLabel>
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
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-6">
                  {!isInternational ? (
                    // UAE Vendor Documents
                    <>
                      <FormField
                        control={form.control}
                        name="tradeLicenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Trade License Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter trade license number" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tradeLicenseCopy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Trade License Copy *</FormLabel>
                            <div className="space-y-4">
                              {tradeLicenseCopy && (
                                <DocumentPreview
                                  src={tradeLicenseCopy}
                                  label="Trade License Document"
                                  onRemove={() => field.onChange('')}
                                />
                              )}
                              <FormControl>
                                <ControlledFileUpload
                                  control={form.control}
                                  name="tradeLicenseCopy"
                                  label={tradeLicenseCopy ? "Change Trade License" : "Upload Trade License"}
                                  errors={form.formState.errors}
                                  allowedMimeType={["application/pdf", "image/jpeg", "image/png"]}
                                  folderPath="vendors/documents"
                                  role="vendor"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalEmiratesIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Emirates ID Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="784-1234-1234567-1" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emiratesIdCopy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Emirates ID Copy *</FormLabel>
                            <div className="space-y-4">
                              {emiratesIdCopy && (
                                <DocumentPreview
                                  src={emiratesIdCopy}
                                  label="Emirates ID Document"
                                  onRemove={() => field.onChange('')}
                                />
                              )}
                              <FormControl>
                                <ControlledFileUpload
                                  control={form.control}
                                  name="emiratesIdCopy"
                                  label={emiratesIdCopy ? "Change Emirates ID" : "Upload Emirates ID"}
                                  errors={form.formState.errors}
                                  allowedMimeType={["application/pdf", "image/jpeg", "image/png"]}
                                  folderPath="vendors/documents"
                                  role="vendor"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    // International Vendor Documents
                    <>
                      <FormField
                        control={form.control}
                        name="businessLicenseCopy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Business License Copy *</FormLabel>
                            <div className="space-y-4">
                              {businessLicenseCopy && (
                                <DocumentPreview
                                  src={businessLicenseCopy}
                                  label="Business License Document"
                                  onRemove={() => field.onChange('')}
                                />
                              )}
                              <FormControl>
                                <ControlledFileUpload
                                  control={form.control}
                                  name="businessLicenseCopy"
                                  label={businessLicenseCopy ? "Change Business License" : "Upload Business License"}
                                  errors={form.formState.errors}
                                  allowedMimeType={["application/pdf", "image/jpeg", "image/png"]}
                                  folderPath="vendors/documents"
                                  role="vendor"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="passportOrIdCopy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Passport or ID Copy *</FormLabel>
                            <div className="space-y-4">
                              {passportOrIdCopy && (
                                <DocumentPreview
                                  src={passportOrIdCopy}
                                  label="Passport/ID Document"
                                  onRemove={() => field.onChange('')}
                                />
                              )}
                              <FormControl>
                                <ControlledFileUpload
                                  control={form.control}
                                  name="passportOrIdCopy"
                                  label={passportOrIdCopy ? "Change Passport/ID" : "Upload Passport or ID"}
                                  errors={form.formState.errors}
                                  allowedMimeType={["application/pdf", "image/jpeg", "image/png"]}
                                  folderPath="vendors/documents"
                                  role="vendor"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              )}

              {activeTab === "address" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">City *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Dubai" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Street address" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Area/District</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Area or neighborhood" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">State/Emirate</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Dubai" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Country *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Country" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Zip/Postal code" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.googleMapLink"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-medium">Google Maps Link</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://maps.google.com/..." className="p-4 bg-[#f0f0f0] h-11 border-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="!text-base uppercase font-medium text-gray-900 mb-4">Social Media Links</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="websiteLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Website</FormLabel>
                            <FormControl>
                              <Input {...field} type="url" placeholder="https://yourwebsite.com" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="facebookLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Facebook</FormLabel>
                            <FormControl>
                              <Input {...field} type="url" placeholder="https://facebook.com/yourpage" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagramLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Instagram</FormLabel>
                            <FormControl>
                              <Input {...field} type="url" placeholder="https://instagram.com/yourprofile" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitterLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Twitter</FormLabel>
                            <FormControl>
                              <Input {...field} type="url" placeholder="https://twitter.com/yourhandle" className="p-4 bg-[#f0f0f0] h-11 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={saving}
                  className="px-6 py-2"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={saving}
                  className="px-6 py-2 flex items-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;