import { z } from "zod";

// --- Regex Patterns ---
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
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
    .regex(uaeMobileRegex, {
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

// --- STEP 1: Basic Account Information ---
export const Step1Schema = z.object({
  ownerName: z.string()
    .trim()
    .min(1, "Owner's Name is required."),

  email: z.string()
    .trim()
    .email({ message: "Invalid email address." })
    .min(1, "Email is required."),

  phoneNumber: z.string()
    .trim()
    .regex(uaeMobileRegex, { message: "Please enter a valid UAE mobile number." })
    .min(1, "Phone Number is required."),

  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(strongPasswordRegex, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    }),

  // Optional - will auto-generate if not provided
  ownerProfileImage: z.string()
    .url({ message: "Must be a valid URL." })
    .optional()
    .or(z.literal('')),
});

// --- STEP 2: Business Details & Verification ---
export const Step2Schema = z.object({
  businessName: z.string()
    .trim()
    .min(1, "Business Name is required."),

  businessLogo: z.string()
    .url({ message: "Business Logo URL is required and must be valid." }),

  tagline: z.string()
    .trim()
    .max(120, "Tagline cannot exceed 120 characters.")
    .optional()
    .or(z.literal('')),

  // ✅ Uses objectIdString
  mainCategory: z.array(objectIdString)
    .min(1, "At least one Main Category is required."),

  // ✅ Uses objectIdString
  subCategories: z.array(objectIdString)
    .optional()
    .default([]),

  tradeLicenseNumber: z.string()
    .trim()
    .min(5, "Trade License Number is required for verification."),

  tradeLicenseCopy: z.string()
    .url({ message: "Trade License Copy URL is required and must be valid." }),

  yearsOfExperience: z.preprocess(
    (a) => (a === '' ? 0 : Number(a)),
    z.number().int().min(0, "Experience must be a positive number.")
  ).default(0),
})
  // ✅ Conditional Validation: Subcategories are required if main categories are selected
  .superRefine((data, ctx) => {
    // If mainCategory is selected, subCategories cannot be empty.
    if (data.mainCategory.length > 0 && data.subCategories.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subCategories'],
        message: 'At least one Sub Category is required if a Main Category is selected.',
      });
      return false;
    }

    return true;
  });

// --- STEP 3: Business Profile & Location ---
export const Step3Schema = z.object({
  aboutDescription: z.string()
    .trim()
    .min(20, "About description must be at least 20 characters.")
    .max(2000, "About description cannot exceed 2000 characters."),

  // Address Object (nested validation)
  address: z.object({
    street: z.string()
      .trim()
      .optional()
      .or(z.literal('')),

    area: z.string()
      .trim()
      .optional()
      .or(z.literal('')),

    city: z.string()
      .trim()
      .min(1, "City is required."),

    state: z.string()
      .trim()
      .optional()
      .or(z.literal('')),

    zipCode: z.string()
      .trim()
      .optional()
      .or(z.literal('')),

    // Google Map Link
    googleMapLink: z.string()
      .url({ message: "Must be a valid Google Maps URL." })
      .optional()
      .or(z.literal('')),

    // Optional coordinates for map integration
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),

  serviceAreaCoverage: z.string()
    .trim()
    .min(1, "Service Area Coverage is required (e.g., Dubai, UAE)."),

  pricingStartingFrom: z.preprocess(
    (a) => (a === '' ? 0 : Number(a)),
    z.number().min(0, "Pricing cannot be negative.")
  ).default(0),

  // Gallery validation (optional)
  gallery: z.array(z.object({
    url: z.string().url({ message: "Must be a valid URL." }),
    type: z.enum(["image", "video"]).default("image"),
  })).optional().default([]),

  // Packages validation (optional)
  packages: z.array(z.object({
    name: z.string()
      .trim()
      .min(1, "Package name is required."),

    description: z.string()
      .trim()
      .max(500, "Package description cannot exceed 500 characters.")
      .optional()
      .or(z.literal('')),

    priceStartsFrom: z.preprocess(
      (a) => Number(a),
      z.number().min(0, "Price must be 0 or greater.")
    ),

    features: z.array(z.string().trim())
      .optional()
      .default([]),

    isPopular: z.boolean()
      .optional()
      .default(false),

    image: z.string()
      .url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),
  })).optional().default([]),

  // Social Media Links (updated to match user request)
  socialMediaLinks: z.object({
    facebook: z.string()
      .url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),

    instagram: z.string()
      .url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),

    linkedin: z.string() // NEW FIELD
      .url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),

    tiktok: z.string() // NEW FIELD
      .url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),
  }).optional(),
});

// --- FINAL COMBINED SCHEMA ---
export const FinalVendorSchema = Step1Schema
  .merge(Step2Schema)
  .merge(Step3Schema)
  .strict();

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
  location: z.string().min(1, "Event location is required"),

  // Kept mandatory
  eventDate: z.string().min(1, "Event date is required"),
  numberOfGuests: z.string().min(1, "Number of guests is required"),
  eventType: z.string().min(1, "Event type is required"),

  // Message is optional
  message: z.string().optional(),

  // Phone number is mandatory based on your last provided schema
  phoneNumber: z.string().min(1, "Phone number is required"),
});  