import type { Category } from "../data";

export type VendorBusinessType =
  | "Individual"
  | "Proprietorship"
  | "Partnership"
  | "Pvt Ltd"
  | "LLP"
  | "Company";

export type VendorStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested"
  | "rejected"
  | "suspended";

export type VendorSellerType =
  | "Manufacturer"
  | "Authorised dealer"
  | "Distributor"
  | "Retailer"
  | "Reseller";

export interface AuditEvent {
  id: string;
  timestamp: number;
  actor: string;
  actorRole: "vendor" | "admin" | "system";
  action: string;
  notes?: string;
}

export interface VendorBrandListing {
  name: string;
  authType: "Authorised" | "Own brand" | "Unbranded";
}

export interface VendorWorkingDay {
  open: string;
  close: string;
  closed?: boolean;
}

export interface VendorDocument {
  id: string;
  name: string;
  type: "pan" | "gst" | "cheque" | "trade_license" | "brand_auth" | "bis_isi";
  url: string;
  uploadedAt: number;
  sizeBytes?: number;
  mimeType?: string;
}

export interface VendorOnboarding {
  currentStep: number; // 1 to 6
  completedSteps: number[];
  
  // Step 1: Account
  account: {
    fullName: string;
    businessType: VendorBusinessType;
    mobile: string;
    email: string;
    mobileVerified: boolean;
    emailVerified: boolean;
    agreedToTerms: boolean;
  };

  // Step 2: Tax Details
  tax: {
    gstin?: string;
    gstExempt: boolean;
    legalName: string;
    tradeName?: string;
    pan: string;
    panHolderName?: string;
    panHolderMatches?: boolean;
    registrationDate?: string;
    taxpayerType?: string;
    status?: "Active" | "Cancelled";
    registeredAddress: string;
    sameAsGstAddress: boolean;
    chargesIgst: boolean;
    govtIdType: "Voter ID" | "Driving Licence" | "Passport";
    govtIdLast4: string;
  };

  // Step 3: Store Name & Profile
  store: {
    storeName: string;
    slug: string;
    tagline: string;
    description: string;
    logoUrl?: string;
    bannerUrl?: string;
    sellerType: VendorSellerType;
    categories: Category[];
    brands: VendorBrandListing[];
    yearsInBusiness: number;
    website?: string;
    instagram?: string;
  };

  // Step 4: Shipping & Pickup
  shipping: {
    pickupAddress: {
      line1: string;
      line2?: string;
      landmark?: string;
      pincode: string;
      city: string;
      state: string;
      lat: number;
      lng: number;
    };
    contactName: string;
    contactPhone: string;
    workingHours: Record<string, VendorWorkingDay>;
    handlingTimeMins: number; // prepMins
    fulfillmentMode: "hyperlocal" | "courier";
    serviceableRadiusKm: number;
    acceptsCod: boolean;
    returnWindowDays: 0 | 7 | 10 | 15;
    returnAddressSameAsPickup: boolean;
    returnAddress?: {
      line1: string;
      line2?: string;
      pincode: string;
      city: string;
      state: string;
    };
    sellsLiIon: boolean;
    un38_3Declared: boolean;
  };

  // Step 5: Bank details
  bank: {
    accountHolderName: string;
    accountNumber: string;
    maskedAccountNumber: string;
    ifsc: string;
    bankName: string;
    branchName: string;
    accountType: "Current" | "Savings";
    upiId?: string;
    chequeDocUrl?: string;
    pennyDropVerified: boolean;
    pennyDropName?: string;
  };

  // Step 6: Documents & Review
  documents: {
    panDocUrl?: string;
    gstDocUrl?: string;
    chequeDocUrl?: string;
    tradeLicenseDocUrl?: string;
    brandAuthDocs: { brand: string; url: string }[];
    safetyCertDocs: { category: string; certType: string; url: string }[];
    agreementAccepted: boolean;
    signatureName: string;
    signedAt?: number;
  };
}

export interface Vendor {
  id: string; // "v1", "v_..."
  email: string;
  phone: string;
  businessName: string;
  storeName: string;
  slug: string;
  status: VendorStatus;
  commissionRate: number; // percentage e.g. 10
  rating: number;
  totalSales: number;
  activeProductsCount: number;
  holidayMode: boolean;
  lat: number;
  lng: number;
  prepMins: number;
  area: string;
  tier?: "Standard" | "Gold" | "Platinum";
  rejectionReason?: string;
  changesRequestedSections?: string[];
  changesRequestedNotes?: string;
  onboarding: VendorOnboarding;
  auditTimeline: AuditEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface ProductRevision {
  title?: string;
  description?: string;
  richDescription?: string;
  specs?: Record<string, string | number>;
  fits?: string[];
  imageIds?: string[];
  images?: string[];
  category?: Category;
  hsnCode?: string;
  gstRate?: number;
  submittedAt: number;
}

export interface VendorProduct {
  id: string; // "p_..."
  vendorId: string;
  vendorName: string;
  title: string;
  brand: string;
  category: Category;
  subType?: string;
  description: string;
  richDescription?: string;
  sku: string;
  barcode?: string;
  hsnCode: string;
  gstRate: number; // 5, 12, 18, 28
  mrp: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  condition: "New" | "Refurbished";
  partType: "OEM" | "Genuine" | "Aftermarket";
  warrantyMonths: number;
  weightKg: number;
  dimensions?: { l: number; w: number; h: number };
  originCountry: string;
  manufacturerDetails: string;
  inTheBox: string;
  fits: string[]; // Bike IDs
  fitsAll?: boolean;
  imageIds: string[];
  images: string[]; // URLs or base64 or object URLs
  videoUrl?: string;
  voltage?: number;
  capacityAh?: number;
  chemistry?: string;
  specs: Record<string, string | number>;
  status: "draft" | "pending_review" | "live" | "changes_requested" | "rejected" | "inactive" | "archived";
  pendingRevision?: ProductRevision;
  rejectionReason?: string;
  changesRequestedComments?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export interface VendorOrderView {
  orderId: string;
  orderNumber: string;
  createdAt: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    productId: string;
    productName: string;
    sku?: string;
    qty: number;
    price: number;
    image?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  status: "New" | "Accepted" | "Packed" | "Ready for pickup" | "Picked up" | "Delivered" | "Cancelled" | "Returned";
  cancellationReason?: string;
  riderName?: string;
  riderPhone?: string;
  riderOtp?: string;
  packingSlipId?: string;
}

export interface Settlement {
  id: string;
  vendorId: string;
  period: string; // e.g., "1 Oct - 7 Oct 2026"
  grossAmount: number;
  commissionAmount: number;
  gstOnCommission: number;
  tcsTdsAmount: number;
  deliveryFeeDeduction: number;
  netPayout: number;
  status: "pending" | "processing" | "paid";
  payoutDate?: string;
  bankAccountMasked: string;
  orderBreakup: {
    orderId: string;
    date: string;
    itemPrice: number;
    commission: number;
    gstOnComm: number;
    tcsTds: number;
    net: number;
  }[];
}

export interface VendorNotification {
  id: string;
  vendorId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "approval" | "order" | "stock" | "payout" | "policy";
  link?: string;
}

export interface VendorSupportTicket {
  id: string;
  vendorId: string;
  subject: string;
  category: "Catalog" | "Payments" | "Orders & Logistics" | "Account" | "Policy";
  status: "open" | "in_progress" | "resolved";
  createdAt: number;
  replies: {
    sender: "vendor" | "admin";
    senderName: string;
    text: string;
    time: number;
  }[];
}
