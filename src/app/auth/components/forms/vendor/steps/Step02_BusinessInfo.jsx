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

import ControlledFileUpload from "@/components/common/ControlledFileUploads";
// Assuming getCategories is in the same actions file as registerVendor
import { getCategories as fetchCategoriesAction } from "@/app/actions/categories";

// =================================================================
// Generalized Multi-Select Component for Categories (Main and Sub)
// =================================================================
const CategoryMultiSelect = ({ options, value, onChange, placeholder, disabled, valueKey = '_id' }) => {

  // Function to add/remove a selection (value is based on valueKey prop)
  const toggleSelection = (optionValue) => {
    if (disabled) return;

    if (value.includes(optionValue)) {
      // Remove the selection
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add the selection
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={`p-2 rounded-md bg-[#f0f0f0] ${disabled ? 'opacity-70' : ''}`}>
      {options.length === 0 ? (
        <p className="!text-sm text-gray-500 pt-1">{placeholder}</p>
      ) : (
        <div className="flex flex-wrap gap-2 py-1">
          {options.map((option) => {
            // Determine the actual value to store in RHF (e.g., option.name or option._id)
            const optionValue = option[valueKey];
            const isSelected = value.includes(optionValue);

            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => toggleSelection(optionValue)}
                disabled={disabled} // Apply disabled attribute
                className={`px-3 py-1 !text-sm rounded-full cursor-pointer transition-colors font-medium ${isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-300 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {option.name} {isSelected ? '×' : '+'}
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

  // State to manage fetched category data and loading status
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  // Construct Cloudinary folder path for vendor temp uploads
  const tempUploadToken = formData.tempUploadToken;
  const FOLDER_PATH = `temp_vendors/${tempUploadToken}`;

  // Initialize form with Step 2 fields
  const form = useForm({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      businessName: formData.businessName || "",
      businessLogo: formData.businessLogo || "",
      tagline: formData.tagline || "",
      mainCategory: formData.mainCategory || [],
      subCategories: formData.subCategories || [],
      tradeLicenseNumber: formData.tradeLicenseNumber || "",
      tradeLicenseCopy: formData.tradeLicenseCopy || "",
      yearsOfExperience: formData.yearsOfExperience || 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  // RHF watch for mainCategory selection (this now holds an array of category _ids)
  // 🟢 UPDATED: Variable name changed to reflect it holds IDs
  const selectedMainCategoryIds = form.watch('mainCategory');

  // Aggregates all subcategories from ALL selected main categories
  const allSubCategories = categories.reduce((acc, cat) => {
    // 🟢 UPDATED: Check if the category _id is in the selected IDs array
    if (selectedMainCategoryIds.includes(cat._id)) {
      // Append all subCategories from the current cat to the accumulator
      return acc.concat(cat.subCategories);
    }
    return acc;
  }, []);

  // Helper for conditional rendering of the subcategory field
  // 🟢 UPDATED: Check the IDs array length
  const isMainCategorySelected = selectedMainCategoryIds.length > 0;

  // --- Data Fetching Effect (Remains the same) ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategoriesAction();
        console.log(response)
        if (response.success) {
          setCategories(response.categories || []);
          setCategoryError(null);
        } else {
          setCategoryError(response.message || "Failed to load categories.");
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        setCategoryError("A network error occurred while loading categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Effect to clear subcategories if main categories are unselected
  useEffect(() => {
    // If the list of selected main categories becomes empty, reset subCategories
    if (!isMainCategorySelected) {
      form.setValue('subCategories', [], { shouldValidate: true });
    }
  }, [isMainCategorySelected, form]);


  const handleNext = (data) => {
    updateFields(data);
    nextStep();
  };

  const handleBack = () => {
    // Save current form data before going back
    const currentData = form.getValues();
    updateFields(currentData);
    prevStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
        <h4 className="!text-2xl font-bold text-primary mb-6">
          Step 2: Business Details & Verification
        </h4>

        {/* --- Business Name (Unchanged) --- */}
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Business Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your business name"
                  {...field}
                  className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Business Logo (Unchanged) --- */}
        <FormField
          control={form.control}
          name="businessLogo"
          render={() => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Business Logo
              </FormLabel>
              <FormControl>
                <ControlledFileUpload
                  control={form.control}
                  name="businessLogo"
                  label="Upload Business Logo (JPG/PNG)"
                  errors={form.formState.errors}
                  allowedMimeType={["image/jpeg", "image/png"]}
                  folderPath={FOLDER_PATH}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Tagline (Unchanged) --- */}
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Tagline (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="A catchy tagline for your business (max 150 chars)"
                  {...field}
                  className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </FormControl>
              <p className="!text-[12px] text-gray-500 mt-1">
                This will appear under your business name on your profile.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Main Category - CRITICAL CHANGE HERE --- */}
        <FormField
          control={form.control}
          name="mainCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Main Categories (Select multiple)
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <CategoryMultiSelect
                    options={categories}
                    value={field.value}
                    onChange={field.onChange}
                    // 🟢 CRITICAL: Use '_id' to store the MongoDB ID in the form state
                    valueKey="_id"
                    disabled={isLoadingCategories || !!categoryError}
                    placeholder={isLoadingCategories ? "Loading categories..." : categoryError ? "Error loading categories" : "Select one or more main categories"}
                  />
                </FormControl>
                {categoryError && (
                  <p className="!text-[12px] text-red-500 mt-1">
                    {categoryError}
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Sub Categories - Now correctly relies on IDs being selected --- */}
        {isMainCategorySelected && (
          <FormField
            control={form.control}
            name="subCategories"
            render={({ field }) => (
              <FormItem className="border-0">
                <FormLabel className="text-xs leading-0 font-medium">
                  Sub Categories (Select multiple)
                </FormLabel>
                <FormControl>
                  <CategoryMultiSelect
                    options={allSubCategories}
                    value={field.value}
                    onChange={field.onChange}
                    // Use '_id' as the value key for Sub Categories
                    valueKey="_id"
                    disabled={isLoadingCategories}
                    placeholder={
                      isLoadingCategories ? "Loading subcategories..." :
                        (allSubCategories.length === 0 ? `No subcategories found for your selection.` : "Select one or more subcategories")
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* --- Trade License Number (Unchanged) --- */}
        <FormField
          control={form.control}
          name="tradeLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Trade License Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your official Trade License Number"
                  {...field}
                  className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Trade License Copy (Unchanged) --- */}
        <FormField
          control={form.control}
          name="tradeLicenseCopy"
          render={() => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Trade License Copy
              </FormLabel>
              <FormControl>
                <ControlledFileUpload
                  control={form.control}
                  name="tradeLicenseCopy"
                  label="Upload Trade License Document (PDF/Image)"
                  errors={form.formState.errors}
                  allowedMimeType={[
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                  ]}
                  folderPath={FOLDER_PATH}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Years of Experience (Unchanged) --- */}
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs leading-0 font-medium">
                Years of Experience
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter years of experience"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="p-4 bg-[#f0f0f0] h-11 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Navigation Buttons (Unchanged) --- */}
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
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            Next Step →
          </Button>
        </div>
      </form>
    </Form>
  );
}