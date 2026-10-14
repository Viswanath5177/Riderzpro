import { describe, it, expect } from "vitest";
import {
  normalizeOrder,
  formatPaise,
  paiseToRupees,
  OrderSchema,
  ApiErrorSchema,
} from "../lib/api/orders.contract";

import orderCreateFixture from "../mocks/fixtures/order.create.201.json";
import ordersMineFixture from "../mocks/fixtures/orders.mine.json";
import orderDetailFixture from "../mocks/fixtures/order.detail.json";
import error409Fixture from "../mocks/fixtures/error.409.json";
import error401Fixture from "../mocks/fixtures/error.401.json";
import errorAddressFixture from "../mocks/fixtures/error.address.json";

describe("Orders Contract Layer", () => {
  it("successfully parses and normalizes order.create.201.json fixture", () => {
    const normalized = normalizeOrder(orderCreateFixture);
    expect(normalized.id).toBe("RZ-847291");
    expect(normalized.contact.name).toBe("Vikas Sharma");
    expect(normalized.payment.method).toBe("COD");
    expect(normalized.payment.status).toBe("COD_DUE");
    expect(normalized.totalPaise).toBe(535664);
    expect(OrderSchema.safeParse(normalized).success).toBe(true);
  });

  it("successfully parses and normalizes orders.mine.json list fixture", () => {
    expect(Array.isArray(ordersMineFixture)).toBe(true);
    expect(ordersMineFixture.length).toBeGreaterThanOrEqual(4);

    const normalizedList = ordersMineFixture.map(normalizeOrder);
    expect(normalizedList.length).toBe(ordersMineFixture.length);

    // Verify payment statuses present
    const statuses = normalizedList.map((o) => o.payment.status);
    expect(statuses).toContain("COD_DUE");
    expect(statuses).toContain("PAID");
    expect(statuses).toContain("PENDING");
    expect(statuses).toContain("FAILED");

    normalizedList.forEach((order) => {
      expect(OrderSchema.safeParse(order).success).toBe(true);
    });
  });

  it("successfully parses and normalizes order.detail.json with statusHistory", () => {
    const detail = normalizeOrder(orderDetailFixture);
    expect(detail.id).toBe("RZ-847291");
    expect(detail.statusHistory).toBeDefined();
    expect(detail.statusHistory?.length).toBe(3);
    expect(detail.statusHistory?.[0].status).toBe("PLACED");
    expect(detail.statusHistory?.[2].status).toBe("DISPATCHED");
    expect(OrderSchema.safeParse(detail).success).toBe(true);
  });

  it("validates API error response schemas", () => {
    expect(ApiErrorSchema.safeParse(error409Fixture).success).toBe(true);
    expect(ApiErrorSchema.safeParse(error401Fixture).success).toBe(true);
    expect(ApiErrorSchema.safeParse(errorAddressFixture).success).toBe(true);

    expect(errorAddressFixture.error.code).toBe("ADDRESS_NOT_SERVICEABLE");
  });

  it("formats integer paise to INR accurately", () => {
    expect(formatPaise(0)).toBe("₹0");
    expect(formatPaise(50000)).toBe("₹500");
    expect(formatPaise(535664)).toBe("₹5,356.64");
    expect(paiseToRupees(535664)).toBe(5356.64);
    expect(paiseToRupees(100)).toBe(1);
  });

  it("handles unknown status and missing fields gracefully without throwing", () => {
    const rawUnknown = {
      order_id: "ORD-UNKNOWN-99",
      customer_name: "Mystery Rider",
      total_amount: 1250,
      order_status: "SOME_FUTURE_STATE",
      payment_method: "CRYPTO",
    };

    const normalized = normalizeOrder(rawUnknown);
    expect(normalized.id).toBe("ORD-UNKNOWN-99");
    expect(normalized.contact.name).toBe("Mystery Rider");
    expect(normalized.status).toBe("SOME_FUTURE_STATE");
    expect(normalized.totalPaise).toBe(125000);
    expect(normalized.payment.status).toBe("PENDING"); // graceful fallback
    expect(OrderSchema.safeParse(normalized).success).toBe(true);
  });

  // Optional live check when VITE_ORDERS_API === 'live'
  it.skipIf(process.env["VITE_ORDERS_API"] !== "live")(
    "validates live /api/orders/mine against contract",
    async () => {
      const res = await fetch("http://localhost:8080/api/orders/mine", {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        list.forEach((item: unknown) => {
          const norm = normalizeOrder(item);
          expect(OrderSchema.safeParse(norm).success).toBe(true);
        });
      }
    },
  );
});
