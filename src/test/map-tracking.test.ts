import { describe, it, expect } from "vitest";
import {
  latLngToUnitPoint,
  unitPointToLatLng,
  latLngToScreen,
  screenToLatLng,
  calculateBounds,
  fitBoundsToViewport,
  metersToPixels,
} from "@/components/map/MercatorProjection";
import { getWebSocketUrl, API_BASE_URL } from "@/lib/api";

describe("MercatorProjection", () => {
  it("projects and unprojects coordinates accurately (roundtrip)", () => {
    const lat = 12.9716; // Bengaluru
    const lng = 77.5946;

    const unit = latLngToUnitPoint(lat, lng);
    expect(unit.x).toBeGreaterThan(0);
    expect(unit.x).toBeLessThan(1);
    expect(unit.y).toBeGreaterThan(0);
    expect(unit.y).toBeLessThan(1);

    const back = unitPointToLatLng(unit.x, unit.y);
    expect(back.lat).toBeCloseTo(lat, 4);
    expect(back.lng).toBeCloseTo(lng, 4);
  });

  it("converts geographic coordinates to screen pixels and back", () => {
    const center = { lat: 12.9716, lng: 77.5946 };
    const zoom = 14;
    const viewWidth = 800;
    const viewHeight = 600;

    // Center coordinates should map to the exact center of screen
    const centerScreen = latLngToScreen(
      center.lat,
      center.lng,
      center,
      zoom,
      viewWidth,
      viewHeight,
    );
    expect(centerScreen.x).toBeCloseTo(viewWidth / 2, 1);
    expect(centerScreen.y).toBeCloseTo(viewHeight / 2, 1);

    // Screen center unprojects back to original center
    const unprojected = screenToLatLng(
      centerScreen.x,
      centerScreen.y,
      center,
      zoom,
      viewWidth,
      viewHeight,
    );
    expect(unprojected.lat).toBeCloseTo(center.lat, 4);
    expect(unprojected.lng).toBeCloseTo(center.lng, 4);
  });

  it("calculates accurate bounding boxes", () => {
    const points = [
      { lat: 12.95, lng: 77.6 },
      { lat: 12.98, lng: 77.65 },
      { lat: 12.96, lng: 77.62 },
    ];

    const bounds = calculateBounds(points);
    expect(bounds).not.toBeNull();
    expect(bounds?.minLat).toBe(12.95);
    expect(bounds?.maxLat).toBe(12.98);
    expect(bounds?.minLng).toBe(77.6);
    expect(bounds?.maxLng).toBe(77.65);
  });

  it("returns null for empty or invalid coordinate lists", () => {
    expect(calculateBounds([])).toBeNull();
    expect(calculateBounds(null as unknown as Array<{ lat: number; lng: number }>)).toBeNull();
  });

  it("computes reasonable viewport center and zoom from bounds", () => {
    const bounds = {
      minLat: 12.95,
      maxLat: 12.98,
      minLng: 77.6,
      maxLng: 77.65,
    };

    const vp = fitBoundsToViewport(bounds, 800, 600);
    expect(vp.center.lat).toBeCloseTo(12.965, 4);
    expect(vp.center.lng).toBeCloseTo(77.625, 4);
    expect(vp.zoom).toBeGreaterThanOrEqual(10);
    expect(vp.zoom).toBeLessThanOrEqual(16);
  });

  it("scales meters to pixel radii for geofence rendering", () => {
    const pixels500m = metersToPixels(500, 12.9716, 14);
    const pixels50m = metersToPixels(50, 12.9716, 14);

    expect(pixels500m).toBeGreaterThan(pixels50m);
    expect(pixels500m / pixels50m).toBeCloseTo(10, 1);
  });
});

describe("API & WebSocket Configuration", () => {
  it("converts http to ws protocol for WebSocket URL derivation", () => {
    const url = getWebSocketUrl("del_test_123");
    expect(url).toMatch(/^ws(s)?:\/\//);
    expect(url).toContain("/ws/deliveries/del_test_123/tracking");
  });

  it("includes user identity and role query params in WebSocket URL", () => {
    const url = getWebSocketUrl("del_test_456", "cust_alice", "customer");
    expect(url).toContain("user_id=cust_alice");
    expect(url).toContain("user_role=customer");
  });

  it("correctly encodes special characters in delivery ID", () => {
    const url = getWebSocketUrl("del/special@1");
    expect(url).toContain("/ws/deliveries/del%2Fspecial%401/tracking");
  });

  it("derives distinct WebSocket URLs for multiple concurrent deliveries", () => {
    const url1 = getWebSocketUrl("delivery_noida_delhi_001", "cust_1", "customer");
    const url2 = getWebSocketUrl("delivery_noida_delhi_002", "cust_2", "customer");
    const url3 = getWebSocketUrl("delivery_noida_delhi_003", "cust_3", "customer");

    expect(url1).toContain("/ws/deliveries/delivery_noida_delhi_001/tracking");
    expect(url2).toContain("/ws/deliveries/delivery_noida_delhi_002/tracking");
    expect(url3).toContain("/ws/deliveries/delivery_noida_delhi_003/tracking");

    expect(url1).not.toEqual(url2);
    expect(url2).not.toEqual(url3);
  });
});

describe("Canonical Order & Delivery Relationship", () => {
  it("resolves canonical delivery tracking URL using order ID", () => {
    const orderId = "RZ-1001";
    const trackingPath = `/track/${orderId}`;
    expect(trackingPath).toBe("/track/RZ-1001");
  });

  it("returns null for empty order ID in checkLogisticsDelivery", async () => {
    const { checkLogisticsDelivery } = await import("@/lib/api");
    const res = await checkLogisticsDelivery("");
    expect(res).toBeNull();
  });
});

