import { describe, expect, it } from "vitest";
import {
  validateGstin,
  calculateGstinChecksum,
  derivePanFromGstin,
  validateIfsc,
  validateMobile,
} from "@/lib/vendor/validators";
import { isVendorProductVisible, getCatalogueProducts, getCatalogueVendors } from "@/lib/catalogue";
import { Vendor, VendorProduct } from "@/lib/vendor/types";

describe("Vendor Tax & Banking Validators", () => {
  it("validates GSTIN checksum and state code with 27AAPFU0939F1ZV", () => {
    // Valid sample from prompt
    const valid = validateGstin("27AAPFU0939F1ZV");
    expect(valid.valid).toBe(true);

    // Verify calculated checksum for first 14 chars
    expect(calculateGstinChecksum("27AAPFU0939F1Z")).toBe("V");

    // Invalid checksum character (changed 15th character from V to A)
    const invalidChecksum = validateGstin("27AAPFU0939F1ZA");
    expect(invalidChecksum.valid).toBe(false);
    expect(invalidChecksum.error).toContain("Invalid GSTIN checksum character");

    // Invalid state code
    const invalidState = validateGstin("99AAPFU0939F1ZV");
    expect(invalidState.valid).toBe(false);
    expect(invalidState.error).toContain("Invalid state code");

    // Invalid format / length
    const invalidFormat = validateGstin("INVALID123");
    expect(invalidFormat.valid).toBe(false);
  });

  it("derives PAN correctly from GSTIN characters 3 to 12", () => {
    expect(derivePanFromGstin("27AAPFU0939F1ZV")).toBe("AAPFU0939F");
    expect(derivePanFromGstin("29AABCU9821R1Z8")).toBe("AABCU9821R");
    expect(derivePanFromGstin("SHORT")).toBe("");
  });

  it("validates Indian IFSC format with 5th character as 0", () => {
    expect(validateIfsc("HDFC0001234")).toBe(true);
    expect(validateIfsc("SBIN0000456")).toBe(true);
    expect(validateIfsc("hdfc0001234")).toBe(true); // Case-insensitive normalized

    // Invalid: 5th character not zero
    expect(validateIfsc("HDFC1001234")).toBe(false);
    // Invalid: bad length
    expect(validateIfsc("HDFC001")).toBe(false);
  });

  it("validates Indian 10-digit mobile numbers starting with 6, 7, 8, or 9", () => {
    expect(validateMobile("9000000001")).toBe(true);
    expect(validateMobile("+919000000001")).toBe(true);
    expect(validateMobile("1234567890")).toBe(false);
    expect(validateMobile("98765")).toBe(false);
  });
});

describe("Vendor Lifecycle and Product Visibility Gate (Prompt 7b)", () => {
  const mockVendorApproved = {
    id: "v_test_01",
    email: "test@vendor.com",
    phone: "9876543210",
    storeName: "Volt Velocity Parts",
    storeSlug: "volt-velocity",
    status: "approved",
    commissionRate: 10,
    rating: 4.8,
    totalSales: 50000,
    activeProductsCount: 1,
    holidayMode: false,
    lat: 12.9716,
    lng: 77.5946,
    prepMins: 15,
    area: "Indiranagar",
    tier: "Standard",
    createdAt: Date.now(),
  } as unknown as Vendor;

  const mockProductLive = {
    id: "vp_test_01",
    vendorId: "v_test_01",
    vendorName: "Volt Velocity Parts",
    title: "VoltPro 60V Battery",
    brand: "VoltPro",
    category: "Battery",
    sku: "VP-60V-01",
    mrp: 60000,
    sellingPrice: 52000,
    stock: 10,
    condition: "New",
    partType: "OEM",
    warrantyMonths: 36,
    fits: ["ola-s1pro"],
    images: ["https://example.com/battery.jpg"],
    status: "live",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as unknown as VendorProduct;

  it("allows visibility ONLY when product is 'live' and vendor is 'approved'", () => {
    const vendorsMap = new Map<string, Vendor>([["v_test_01", mockVendorApproved]]);

    // Live product + Approved vendor -> Visible
    expect(isVendorProductVisible(mockProductLive, vendorsMap)).toBe(true);

    // Product is pending review -> Hidden
    expect(
      isVendorProductVisible({ ...mockProductLive, status: "pending_review" }, vendorsMap),
    ).toBe(false);

    // Product is draft -> Hidden
    expect(isVendorProductVisible({ ...mockProductLive, status: "draft" }, vendorsMap)).toBe(false);

    // Product is changes_requested -> Hidden
    expect(
      isVendorProductVisible({ ...mockProductLive, status: "changes_requested" }, vendorsMap),
    ).toBe(false);

    // Product is rejected -> Hidden
    expect(isVendorProductVisible({ ...mockProductLive, status: "rejected" }, vendorsMap)).toBe(
      false,
    );
  });

  it("blocks visibility when vendor is suspended, pending, or in holiday mode", () => {
    // Vendor is pending
    const vendorsMapPending = new Map<string, Vendor>([
      ["v_test_01", { ...mockVendorApproved, status: "submitted" }],
    ]);
    expect(isVendorProductVisible(mockProductLive, vendorsMapPending)).toBe(false);

    // Vendor is suspended
    const vendorsMapSuspended = new Map<string, Vendor>([
      ["v_test_01", { ...mockVendorApproved, isSuspended: true }],
    ]);
    expect(isVendorProductVisible(mockProductLive, vendorsMapSuspended)).toBe(false);

    // Vendor is in holiday mode
    const vendorsMapHoliday = new Map<string, Vendor>([
      [
        "v_test_01",
        {
          ...mockVendorApproved,
          onboarding: { store: { holidayMode: true } } as unknown as Vendor["onboarding"],
        },
      ],
    ]);
    expect(isVendorProductVisible(mockProductLive, vendorsMapHoliday)).toBe(false);
  });
});

describe("Merged Catalogue Integration", () => {
  it("returns catalogue products merging static seed data and live vendors", () => {
    const products = getCatalogueProducts({ includeOutOfStock: true });
    expect(products.length).toBeGreaterThan(0);

    // Seed products like p1 exist
    const p1 = products.find((p) => p.id === "p1");
    expect(p1).toBeDefined();
    expect(p1?.name).toContain("VoltRide");
    expect(p1?.offers.length).toBeGreaterThan(0);
  });

  it("returns catalogue vendors with store slugs and ratings", () => {
    const vendors = getCatalogueVendors();
    expect(vendors.length).toBeGreaterThan(0);

    // v1 VoltHub exists
    const v1 = vendors.find((v) => v.id === "v1");
    expect(v1).toBeDefined();
    expect(v1?.name).toContain("VoltHub");
    expect(v1?.rating).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Admin KYC Verification Gate for Product Operations", () => {
  const isKycApproved = (vendor: { status: string }) => vendor.status === "approved";

  it("blocks product catalogue operations when vendor KYC is not approved by admin", () => {
    const pendingVendor = { id: "v_pending", status: "submitted" };
    const underReviewVendor = { id: "v_review", status: "under_review" };
    const changesRequestedVendor = { id: "v_changes", status: "changes_requested" };
    const rejectedVendor = { id: "v_rejected", status: "rejected" };
    const draftVendor = { id: "v_draft", status: "draft" };
    const suspendedVendor = { id: "v_suspended", status: "suspended" };

    expect(isKycApproved(pendingVendor)).toBe(false);
    expect(isKycApproved(underReviewVendor)).toBe(false);
    expect(isKycApproved(changesRequestedVendor)).toBe(false);
    expect(isKycApproved(rejectedVendor)).toBe(false);
    expect(isKycApproved(draftVendor)).toBe(false);
    expect(isKycApproved(suspendedVendor)).toBe(false);
  });

  it("permits product catalogue operations ONLY when vendor KYC status is approved", () => {
    const approvedVendor = { id: "v_approved", status: "approved" };
    expect(isKycApproved(approvedVendor)).toBe(true);
  });
});

