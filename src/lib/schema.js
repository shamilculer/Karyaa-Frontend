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

  tradeLicenseNumber: z.string()
    .trim()
    .min(1, "Trade License Number is required."),

  personalEmiratesIdNumber: z.string()
    .trim()
    .min(1, "Personal Emirates ID Number is required."),

  email: z.email({ message: "Invalid email address." })
  .trim()
    .min(1, "Email is required."),

  phoneNumber: z.string()
    .trim()
    .min(1, "Phone Number is required.")
    .regex(phoneRegex, { message: "Please enter a valid UAE mobile number." }),
    
  // --- NEW REQUIRED PASSWORD FIELD ---
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(strongPasswordRegex, {
      message: "Must contain at least 8 characters, one uppercase, one lowercase, and one number.",
    }),
  // -----------------------------------

  emiratesIdCopy: z.url({ message: "A valid URL for the uploaded Emirates ID is required." })
  .trim()
    .min(1, "Emirates ID Copy (Front and Back) is required."),

  tradeLicenseCopy: z.url({ message: "A valid URL for the uploaded Trade License is required." })
  .trim()
    .min(1, "Trade License upload is required."),

  ownerProfileImage: z.url({ message: "Owner Profile Image must be a valid URL." })
    .optional()
    .or(z.literal('')),
});


export const Step2Schema = z.object({

    businessName: z.string()
    .trim()
    .min(1, "Business name is required."),

    businessLogo: z.url({ message: "Business Logo URL is required and must be valid." }),

    tagline: z.string()
    .trim()
    .max(120, "Tagline cannot exceed 120 characters.")
    .optional()
    .or(z.literal('')),

    businessDescription: z.string()
      .trim()
      .min(50, "A detailed Business Description is required (min 50 chars).")
      .max(1000, "Description cannot exceed 1000 characters."),

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

    // Category (Main Category, dropdown)
    mainCategory: z.array(objectIdString)
      .min(1, "At least one Category is required."),

    subCategories: z.array(objectIdString)
      .optional()
      .default([]),
      
    // 🌟 NEW FIELD: occasionsServed 🌟
    occasionsServed: z.array(z.string().trim())
        .min(1, "At least one occasion you serve must be selected.") // Enforce minimum selection
        .default([]),
    // ---------------------------------
        
    selectedBundle: objectIdString
      .min(1, "A Launch Bundle must be selected."),

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

      googleMapLink: z.url({ message: "Must be a valid Google Maps URL." })
        .optional()
        .or(z.literal('')),

      coordinates: z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }).optional(),
    }),

    websiteLink: z.url({ message: "Must be a valid URL." })
      .optional()
      .or(z.literal('')),
      
    facebookLink: z.url({ message: "Must be a valid Facebook URL." })
      .optional()
      .or(z.literal('')),

    instagramLink: z.url({ message: "Must be a valid Instagram URL." })
      .optional()
      .or(z.literal('')),

    twitterLink: z.url({ message: "Must be a valid Twitter URL." })
      .optional()
      .or(z.literal('')),

  })
    // ✅ SuperRefine for Conditional Validation: Subcategories required if categories selected
    .superRefine((data, ctx) => {
      // If a main category is selected, subCategories cannot be empty.
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


export const packageSchema = z.object({
  name: z.string().min(2, "Package name is required"),
  subheading: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  services: z.array(z.string()).min(1, "Select at least 1 service"),
  includes: z.array(z.string()).min(1, "Add at least 1 included item"),
  coverImage: z.string().url("Upload a valid image"),
});