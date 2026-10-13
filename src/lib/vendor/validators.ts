import { z } from "zod";

const GST_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Calculates the 15th checksum character of an Indian GSTIN.
 */
export function calculateGstinChecksum(first14: string): string {
  if (first14.length < 14) return "";
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const char = first14[i].toUpperCase();
    const val = GST_CHARSET.indexOf(char);
    if (val === -1) return "";
    // 1-indexed odd position = 1, even position = 2 (0-indexed: even=1, odd=2)
    const factor = i % 2 === 0 ? 1 : 2;
    const prod = val * factor;
    const quotient = Math.floor(prod / 36);
    const remainder = prod % 36;
    sum += quotient + remainder;
  }
  const checkIdx = (36 - (sum % 36)) % 36;
  return GST_CHARSET[checkIdx];
}

/**
 * Validates a 15-character GSTIN format, state code (01-38), and checksum.
 */
export function validateGstin(gstin: string): { valid: boolean; error?: string } {
  if (!gstin) {
    return { valid: false, error: "GSTIN is required" };
  }
  const clean = gstin.trim().toUpperCase();
  if (clean.length !== 15) {
    return { valid: false, error: "GSTIN must be exactly 15 characters" };
  }

  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: "Invalid GSTIN format structure" };
  }

  const stateCode = parseInt(clean.slice(0, 2), 10);
  if (isNaN(stateCode) || stateCode < 1 || stateCode > 38) {
    return { valid: false, error: "Invalid state code in GSTIN (must be 01 to 38)" };
  }

  const expectedCheckChar = calculateGstinChecksum(clean.slice(0, 14));
  const actualCheckChar = clean[14];
  if (actualCheckChar !== expectedCheckChar) {
    return {
      valid: false,
      error: `Invalid GSTIN checksum character. Expected '${expectedCheckChar}', got '${actualCheckChar}'.`,
    };
  }

  return { valid: true };
}

/**
 * Derives the 10-character PAN from characters 3 to 12 of a 15-char GSTIN.
 */
export function derivePanFromGstin(gstin: string): string {
  if (!gstin || gstin.trim().length < 12) return "";
  const clean = gstin.trim().toUpperCase();
  return clean.slice(2, 12);
}

/**
 * Validates 10-character Indian Permanent Account Number (PAN).
 */
export function validatePan(pan: string): boolean {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

/**
 * Validates 11-character Indian Financial System Code (IFSC).
 */
export function validateIfsc(ifsc: string): boolean {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

/**
 * Validates 10-digit Indian mobile number.
 */
export function validateMobile(mobile: string): boolean {
  if (!mobile) return false;
  const digits = mobile.replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Validates 6-digit Indian postal pincode.
 */
export function validatePincode(pincode: string): boolean {
  if (!pincode) return false;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

// ========================
// ZOD SCHEMAS FOR FORMS
// ========================

export const vendorSignUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(70),
    businessType: z.enum([
      "Individual",
      "Proprietorship",
      "Partnership",
      "Pvt Ltd",
      "LLP",
      "Company",
    ]),
    mobile: z
      .string()
      .refine(validateMobile, "Enter a valid 10-digit Indian mobile number"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[a-zA-Z]/, "Must contain at least one letter"),
    confirmPassword: z.string(),
    agreedToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Seller Agreement & Policies"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const vendorTaxSchema = z
  .object({
    gstExempt: z.boolean().default(false),
    gstin: z.string().optional(),
    legalName: z.string().min(3, "Legal business name is required"),
    tradeName: z.string().optional(),
    pan: z.string().min(10, "PAN is required").refine(validatePan, "Invalid PAN format"),
    panHolderName: z.string().optional(),
    chargesIgst: z.boolean().default(true),
    registeredAddress: z.string().min(10, "Registered address is required"),
    sameAsGstAddress: z.boolean().default(true),
    govtIdType: z.enum(["Voter ID", "Driving Licence", "Passport"]),
    govtIdLast4: z
      .string()
      .length(4, "Enter exactly last 4 digits/characters of your government ID"),
  })
  .superRefine((data, ctx) => {
    if (!data.gstExempt) {
      if (!data.gstin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstin"],
          message: "GSTIN is required unless exempt",
        });
      } else {
        const check = validateGstin(data.gstin);
        if (!check.valid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["gstin"],
            message: check.error || "Invalid GSTIN",
          });
        }
      }
    }
  });

export const vendorStoreSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store display name must be at least 3 characters")
    .max(40, "Store display name must not exceed 40 characters"),
  slug: z.string().min(3).max(50),
  tagline: z.string().max(100, "Tagline maximum 100 characters").optional(),
  description: z.string().max(300, "Short description maximum 300 characters"),
  sellerType: z.enum([
    "Manufacturer",
    "Authorised dealer",
    "Distributor",
    "Retailer",
    "Reseller",
  ]),
  categories: z.array(z.string()).min(1, "Select at least one category to sell"),
  brands: z
    .array(
      z.object({
        name: z.string().min(1),
        authType: z.enum(["Authorised", "Own brand", "Unbranded"]),
      })
    )
    .min(1, "Specify at least one brand"),
  yearsInBusiness: z.coerce.number().min(0).max(100),
  website: z.string().url("Enter valid website URL").or(z.literal("")).optional(),
  instagram: z.string().optional(),
});

export const vendorShippingSchema = z.object({
  pickupAddress: z.object({
    line1: z.string().min(5, "Address line 1 is required"),
    line2: z.string().optional(),
    landmark: z.string().optional(),
    pincode: z.string().refine(validatePincode, "Enter valid 6-digit pincode"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    lat: z.number(),
    lng: z.number(),
  }),
  contactName: z.string().min(2, "Pickup contact person name is required"),
  contactPhone: z
    .string()
    .refine(validateMobile, "Enter a valid 10-digit mobile number for dispatch"),
  handlingTimeMins: z.coerce.number().min(5, "Prep time minimum 5 mins").max(180),
  fulfillmentMode: z.enum(["hyperlocal", "courier"]),
  serviceableRadiusKm: z.coerce.number().min(1).max(50),
  acceptsCod: z.boolean().default(false),
  returnWindowDays: z.coerce.number(),
  returnAddressSameAsPickup: z.boolean().default(true),
  sellsLiIon: z.boolean().default(false),
  un38_3Declared: z.boolean().default(false),
});

export const vendorBankSchema = z
  .object({
    accountHolderName: z.string().min(3, "Account holder name is required"),
    accountNumber: z.string().min(8, "Account number must be at least 8 digits").max(20),
    confirmAccountNumber: z.string(),
    ifsc: z.string().refine(validateIfsc, "Enter valid 11-character IFSC code"),
    accountType: z.enum(["Current", "Savings"]),
    upiId: z.string().optional(),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Bank account numbers must match",
    path: ["confirmAccountNumber"],
  });

export const vendorProductSchema = z.object({
  title: z.string().min(5, "Product title must be at least 5 characters").max(120),
  brand: z.string().min(2, "Brand name is required"),
  category: z.string().min(1, "Category is required"),
  subType: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  richDescription: z.string().optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters").max(30),
  barcode: z.string().optional(),
  hsnCode: z.string().min(4, "HSN code is required").max(8),
  gstRate: z.coerce.number().refine((r) => [5, 12, 18, 28].includes(r), "GST rate must be 5%, 12%, 18%, or 28%"),
  mrp: z.coerce.number().min(1, "MRP must be greater than 0"),
  sellingPrice: z.coerce.number().min(1, "Selling price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  minStockAlert: z.coerce.number().min(1, "Min stock alert must be at least 1"),
  condition: z.enum(["New", "Refurbished"]),
  partType: z.enum(["OEM", "Genuine", "Aftermarket"]),
  warrantyMonths: z.coerce.number().min(0),
  weightKg: z.coerce.number().min(0.01, "Weight must be greater than 0"),
  originCountry: z.string().default("India"),
  manufacturerDetails: z.string().min(3, "Manufacturer details are required"),
  inTheBox: z.string().min(3, "In-the-box contents are required"),
  fits: z.array(z.string()).default([]),
  fitsAll: z.boolean().default(false),
  voltage: z.coerce.number().optional(),
  capacityAh: z.coerce.number().optional(),
  chemistry: z.string().optional(),
  specs: z.record(z.any()).default({}),
  imageIds: z.array(z.string()).min(3, "Upload at least 3 images").max(8, "Maximum 8 images allowed"),
});
