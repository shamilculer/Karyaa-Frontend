import { z } from "zod";

// --- Regex Patterns ---
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^\+?[0-9\s-()]{7,20}$/;
const uaeMobileRegex = /^(?:(?:\+|00)971)?(?:0)?(5[0-9]{8})$/;
const objectIdString = z.string().length(24, "ID must be a 24-character hexadecimal string.");

// --- USER SCHEMA ---
export const userSchema = z.object({
  username: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must be at most 30 characters." }),

  mobileNumber: z.string()
    .trim()
    .regex(phoneRegex, {
      message: "Please enter a valid UAE mobile number (e.g., 0501234567 or +971501234567).",
    }),

  emailAddress: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format." }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(strongPasswordRegex, {
      message: "Password must include at least one uppercase letter, one lowercase letter, and one number.",
    }),

  location: z.string()
    .trim()
    .min(2, { message: "Location (City/Area) is required." }),
});


export const Step1Schema = z.object({
  ownerName: z.string()
    .trim()
    .min(1, "Owner's Full name is required."),

  isInternational: z.boolean().default(false),

  tradeLicenseNumber: z.string()
    .trim()
    .optional()
    .or(z.literal('')), 

  personalEmiratesIdNumber: z.string()
    .trim()
    .optional()
    .or(z.literal('')), 

  email: z.string()
    .trim()
    .email({ message: "Invalid email address." })
    .min(1, "Email is required."),

  phoneNumber: z.string()
    .trim()
    .min(1, "Phone Number is required.")
    .regex(phoneRegex, {
      message: "Please enter a valid UAE mobile number.",
    }),

  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(strongPasswordRegex, {
      message: "Must contain at least 8 characters, one uppercase, one lowercase, and one number.",
    }),

  // These were already fine, keeping them for completeness
  emiratesIdCopy: z.string().optional().or(z.literal('')),
  tradeLicenseCopy: z.string().optional().or(z.literal('')),
  ownerProfileImage: z.string().optional().or(z.literal('')),

}).superRefine((data, ctx) => {

  // UAE-only extra validations (These checks remain the same)
  if (!data.isInternational) {

    // These checks will now correctly catch empty strings for UAE vendors
    if (!data.tradeLicenseNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tradeLicenseNumber"],
        message: "Trade License Number is required for UAE vendors.",
      });
    }

    if (!data.personalEmiratesIdNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["personalEmiratesIdNumber"],
        message: "Emirates ID Number is required for UAE vendors.",
      });
    }

    if (!data.emiratesIdCopy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emiratesIdCopy"],
        message: "Emirates ID Copy is required for UAE vendors.",
      });
    }

    if (!data.tradeLicenseCopy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tradeLicenseCopy"],
        message: "Trade License Copy is required for UAE vendors.",
      });
    }
  }
});


export const Step2Schema = z.object({

    // 💡 FIX: This field comes from formData (the store), not the useForm defaultValues 
    // for Step 2. We must make it optional so validation doesn't fail if it's undefined
    // when Step 2 form data is extracted by useForm.
    isInternational: z.boolean().optional(), // ✅ FIX APPLIED HERE

    businessName: z.string()
        .trim()
        .min(1, "Business name is required."),

    // Note: Assuming 'businessLogo' is a string URL after upload, not a File object
    businessLogo: z.string().min(1, "Business Logo is required."), // Simpler check for now. If it's a URL, z.url() is fine if you handle empty string with .or(z.literal(''))

    tagline: z.string()
        .trim()
        .max(120, "Tagline cannot exceed 120 characters.")
        .optional()
        .or(z.literal('')),

    businessDescription: z.string()
        .trim()
        .min(50, "A detailed Business Description is required (min 50 chars).")
        .max(1500, "Description cannot exceed 1500 characters."),

    whatsAppNumber: z.string()
        .trim()
        .regex(phoneRegex, { message: "Please enter a valid WhatsApp number." })
        .min(1, "WhatsApp Number is required."),

    pricingStartingFrom: z.preprocess(
        (a) => a === "" ? 0 : a,
        z.number({
            required_error: "Starting price is required.",
            invalid_type_error: "Starting price must be a number."
        })
        .min(0, "Price cannot be negative.")
    ),

    mainCategory: z.array(objectIdString)
        .min(1, "At least one Category is required."),

    subCategories: z.array(objectIdString)
        .optional()
        .default([]),

    occasionsServed: z.array(z.string().trim())
        .min(1, "At least one occasion you serve must be selected.")
        .default([]),

    selectedBundle: objectIdString
        .min(1, "A Launch Bundle must be selected."),

    address: z.object({
        street: z.string().trim().optional().or(z.literal('')),
        area: z.string().trim().optional().or(z.literal('')),
        city: z.string().trim().min(1, "City is required."),
        state: z.string().trim().optional().or(z.literal('')),
        zipCode: z.string().trim().optional().or(z.literal('')),
        googleMapLink: z.string().url({ message: "Must be a valid Google Maps URL." })
            .optional()
            .or(z.literal('')),
        coordinates: z.object({
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        }).optional(),
        country: z.string()
            .trim()
            .optional()
            .or(z.literal(''))
    }),

    websiteLink: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal('')),
    facebookLink: z.string().url({ message: "Must be a valid Facebook URL." }).optional().or(z.literal('')),
    instagramLink: z.string().url({ message: "Must be a valid Instagram URL." }).optional().or(z.literal('')),
    twitterLink: z.string().url({ message: "Must be a valid Twitter URL." }).optional().or(z.literal('')),
})
.superRefine((data, ctx) => {

    // ✅ Subcategory only required if main selected
    if (data.mainCategory.length > 0 && data.subCategories.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['subCategories'],
            message: 'At least one Sub Category is required if a Main Category is selected.',
        });
    }

    // 🌍 Require country ONLY if international - we must check the original form data!
    // Since data.isInternational is now optional, we default to false for this check.
    const isInternationalVendor = data.isInternational ?? false;
    
    if (isInternationalVendor && !data.address.country?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['address', 'country'],
            message: 'Country is required for international vendors.',
        });
    }
});

// --- FINAL COMBINED SCHEMA ---
export const FinalVendorSchema = Step1Schema.merge(Step2Schema).strict();

export const contactFormSchema = z.object({
  fullname: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});


export const vendorFormSchema = z.object({
  fullName: z.string().min(1, "Your full name is required"),

  // Email is optional (allows empty string or valid email)
  email: z.email("Invalid email address").optional().or(z.literal("")),

  // NEW REQUIRED FIELD
  location: z.string().optional(),

  // Kept mandatory
  eventDate: z.string().optional(),
  numberOfGuests: z.string().optional(),
  eventType: z.string().optional(),

  // Message is optional
  message: z.string().optional(),

  phoneNumber: z.string().min(1, "Phone number is required"),
});  


export const packageSchema = z.object({
  name: z.string().min(2, "Package name is required"),
  subheading: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  services: z.array(z.string()).min(1, "Select at least 1 service"),
  includes: z.array(z.string()).min(1, "Add at least 1 included item"),
  coverImage: z.string().url("Upload a valid image"),
});



export const AccessControlSchema = z.object({
    contentModeration: z.boolean().default(false),
    categoryManagement: z.boolean().default(false),
    vendorManagement: z.boolean().default(false),
    reviewManagement: z.boolean().default(false),
    analyticsInsights: z.boolean().default(false),
    supportTickets: z.boolean().default(false),
    adManagement: z.boolean().default(false),
    referralManagement: z.boolean().default(false),
    bundleManagement: z.boolean().default(false),
    adminUserSettings: z.boolean().default(false),
});

// Define the main schema for creating an Admin
export const CreateAdminSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters."),
    email: z.email("Invalid email format."),
    password: z.string().min(8, "Password must be at least 8 characters long."), // Use 8 for strong client-side guidance, even if Mongoose is 6
    adminLevel: z.enum(["admin", "moderator"], {
        message: "Invalid admin level selected.",
    }),
    // For accessControl, it's optional on the form submission if adminLevel is 'admin'
    accessControl: AccessControlSchema.optional(), 
});



export const bundleFormSchema = z.object({
    // General Fields
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    description: z.string().optional(),

    // Pricing & Duration
    price: z.number().min(0, { message: "Price must be non-negative." }),
    durationValue: z.number().min(1, { message: "Duration value must be at least 1." }),
    durationUnit: z.enum(["days", "months", "years"]),
    
    // Bonus Period (Optional, but included in form for completeness)
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