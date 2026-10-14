import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  startLocationSharing,
  stopLocationSharing,
  stop,
  isLocationSharingActive,
  getActiveDeliveryId,
  getCurrentCoordinates,
  onLocationUpdate,
} from "@/lib/native/location";

describe("Native Location Module (Aakash Before Lunch)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stopLocationSharing();
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
  });

  afterEach(() => {
    stopLocationSharing();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("exports startLocationSharing and stop functions", () => {
    expect(typeof startLocationSharing).toBe("function");
    expect(typeof stopLocationSharing).toBe("function");
    expect(typeof stop).toBe("function");
    expect(stop).toBe(stopLocationSharing);
  });

  it("returns false if deliveryId is missing", async () => {
    const res = await startLocationSharing("");
    expect(res).toBe(false);
    expect(isLocationSharingActive()).toBe(false);
  });

  it("starts location streaming and posts immediately", async () => {
    const res = await startLocationSharing("del_test_123");
    expect(res).toBe(true);
    expect(isLocationSharingActive()).toBe(true);
    expect(getActiveDeliveryId()).toBe("del_test_123");

    // First fix sent immediately
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/rider/location",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("del_test_123"),
      })
    );
  });

  it("posts to /api/rider/location every 5 seconds", async () => {
    await startLocationSharing("del_test_456");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Fast-forward 5 seconds
    await vi.advanceTimersByTimeAsync(5000);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Fast-forward another 5 seconds
    await vi.advanceTimersByTimeAsync(5000);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it("stops location sharing cleanly", async () => {
    await startLocationSharing("del_test_789");
    expect(isLocationSharingActive()).toBe(true);

    stop();
    expect(isLocationSharingActive()).toBe(false);
    expect(getActiveDeliveryId()).toBe(null);

    // After stopping, advancing timers does not post again
    const count = (global.fetch as any).mock.calls.length;
    await vi.advanceTimersByTimeAsync(10000);
    expect((global.fetch as any).mock.calls.length).toBe(count);
  });

  it("provides valid coordinates with fallback", async () => {
    const coords = await getCurrentCoordinates();
    expect(coords.lat).toBeGreaterThan(0);
    expect(coords.lng).toBeGreaterThan(0);
  });

  it("notifies local listeners when location updates", async () => {
    const listener = vi.fn();
    const unsubscribe = onLocationUpdate(listener);

    await startLocationSharing("del_notify_test");
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        delivery_id: "del_notify_test",
      })
    );

    unsubscribe();
  });
});
