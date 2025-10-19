// store/vendorFormStore.js
import { create } from "zustand";

// Helper to generate a unique token (UUID polyfill for browser compatibility)
const generateToken = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

// Use the structure derived from the Zod schemas and Mongoose model
const initialFormData = {
  // --- IMPORTANT: Store-specific property ---
  tempUploadToken: generateToken(),

  // --- STEP 1 FIELDS ---
  ownerName: "",
  email: "",
  phoneNumber: "",
  password: "",
  ownerProfileImage: "", // FIX: Corrected typo from 'ownerPofileImage'

  // --- STEP 2 FIELDS ---
  businessName: "",
  businessLogo: "",
  tagline: "", // ADDED: New field from schema
  tradeLicenseNumber: "",
  tradeLicenseCopy: "",
  mainCategory: [],
  subCategories: [],
  yearsOfExperience: 0,

  // --- STEP 3 FIELDS ---
  aboutDescription: "", // RENAME: Changed from 'description' to 'aboutDescription'

  // ADDED/UPDATED: Full Address Structure
  address: {
    street: "",
    area: "",
    city: "",
    state: "",
    country: "UAE",
    zipCode: "",
    coordinates: {
      latitude: undefined,
      longitude: undefined,
    },
    googleMapLink: "",
  },

  serviceAreaCoverage: "",
  pricingStartingFrom: 0,

  gallery: [], // ADDED: Array field
  packages: [], // ADDED: Array field

  // Social Media Links (UPDATED to match schema)
  socialMediaLinks: {
    facebook: "",
    instagram: "",
    linkedin: "", // UPDATED
    tiktok: "", // UPDATED
  },
};

export const useVendorFormStore = create((set) => ({
  formData: initialFormData,
  currentStepIndex: 0,
  updateFields: (fields) =>
    set((state) => ({
      formData: { ...state.formData, ...fields },
    })),

  nextStep: () =>
    set((state) => ({
      currentStepIndex: state.currentStepIndex + 1,
    })),

  prevStep: () =>
    set((state) => ({
      currentStepIndex: state.currentStepIndex - 1,
    })),
  resetForm: () =>
    set({
      // --- IMPORTANT: Generate a new token when resetting the form ---
      formData: { ...initialFormData, tempUploadToken: generateToken() },
      currentStepIndex: 0,
    }),
}));
