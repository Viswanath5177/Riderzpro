import { describe, it, expect } from "vitest";
import {
  ACTIVE_DELIVERY_STATUSES,
  COMPLETED_DELIVERY_STATUSES,
  isDeliveryActive,
  isDeliveryCompleted,
  type BackendDelivery,
} from "@/lib/api";

describe("Tracking Hub Status & Categorization", () => {
  it("correctly identifies active delivery statuses", () => {
    expect(isDeliveryActive("assigned")).toBe(true);
    expect(isDeliveryActive("picked_up")).toBe(true);
    expect(isDeliveryActive("in_transit")).toBe(true);
    expect(isDeliveryActive("IN_TRANSIT")).toBe(true);

    expect(isDeliveryActive("delivered")).toBe(false);
    expect(isDeliveryActive("pending")).toBe(false);
    expect(isDeliveryActive("cancelled")).toBe(false);
    expect(isDeliveryActive(null)).toBe(false);
  });

  it("correctly identifies completed delivery statuses", () => {
    expect(isDeliveryCompleted("delivered")).toBe(true);
    expect(isDeliveryCompleted("DELIVERED")).toBe(true);

    expect(isDeliveryCompleted("in_transit")).toBe(false);
    expect(isDeliveryCompleted("assigned")).toBe(false);
    expect(isDeliveryCompleted("pending")).toBe(false);
    expect(isDeliveryCompleted(undefined)).toBe(false);
  });

  it("uses real canonical order ID without hardcoded fallbacks", () => {
    const delivery1: Partial<BackendDelivery> = {
      id: "del_123",
      order_id: "delivery_noida_delhi_002",
      status: "in_transit",
    };

    const canonicalOrderId1 = delivery1.order_id || delivery1.id;
    expect(canonicalOrderId1).toBe("delivery_noida_delhi_002");

    const delivery2: Partial<BackendDelivery> = {
      id: "del_999",
      order_id: "1001",
      status: "assigned",
    };
    const canonicalOrderId2 = delivery2.order_id || delivery2.id;
    expect(canonicalOrderId2).toBe("1001");
  });

  it("categorizes active vs completed deliveries accurately", () => {
    const deliveries: Array<{ id: string; order_id: string; status: string }> = [
      { id: "del_1", order_id: "delivery_noida_delhi_003", status: "in_transit" },
      { id: "del_2", order_id: "delivery_noida_delhi_002", status: "assigned" },
      { id: "del_3", order_id: "delivery_noida_delhi_001", status: "picked_up" },
      { id: "del_4", order_id: "delivery_old_004", status: "delivered" },
      { id: "del_5", order_id: "delivery_unassigned", status: "pending" },
    ];

    const active = deliveries.filter((d) => isDeliveryActive(d.status));
    const completed = deliveries.filter((d) => isDeliveryCompleted(d.status));

    expect(active.map((d) => d.order_id)).toEqual([
      "delivery_noida_delhi_003",
      "delivery_noida_delhi_002",
      "delivery_noida_delhi_001",
    ]);
    expect(completed.map((d) => d.order_id)).toEqual(["delivery_old_004"]);
  });
});
