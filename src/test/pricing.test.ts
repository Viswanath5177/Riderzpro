import { describe, expect, it } from "vitest";
import { decodeVin, deliveryFee } from "@/lib/data";
import { quoteCart } from "@/lib/store";

describe("pricing rules", () => {
  it("delivery fee is ₹40 base + ₹12 per km", () => {
    expect(deliveryFee(10)).toBe(160);
  });
  it("multi-vendor cart gets one delivery fee per vendor", () => {
    const q = quoteCart([
      { productId: "p1", vendorId: "v1", qty: 1 },
      { productId: "p7", vendorId: "v2", qty: 1 },
    ]);
    expect(q.groups).toHaveLength(2);
    expect(q.total).toBe(q.itemsTotal + q.deliveryTotal + q.tax);
  });
  it("VIN must be 17 chars and decodes Ather year", () => {
    expect(decodeVin("ABC").ok).toBe(false);
    const r = decodeVin("MD9A450XAN1234567");
    expect(r.bike?.id).toBe("ather-450x");
    expect(r.year).toBe(2022);
  });
});
