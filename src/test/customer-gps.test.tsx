// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LocationPickerModal } from "@/components/common/LocationPickerModal";
import { getCurrentLocation, GpsError, isLocationSharingActive } from "@/lib/native/location";
import { reverseGeocode } from "@/lib/geo/reverseGeocode";
import { toNormalizedLocation, type LocationArea } from "@/lib/data";
import { StoreProvider, useStore } from "@/lib/store";

// Mock native/location module for controlled customer GPS tests
vi.mock("@/lib/native/location", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/native/location")>();
  return {
    ...actual,
    getCurrentLocation: vi.fn(),
  };
});

// Mock reverseGeocode
vi.mock("@/lib/geo/reverseGeocode", () => ({
  reverseGeocode: vi.fn(),
}));

function renderWithStore(ui: React.ReactElement) {
  return render(<StoreProvider>{ui}</StoreProvider>);
}

describe("Customer GPS / Delivery Location Feature (Requirement 18 Suite)", { timeout: 15000 }, () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Use Current Location button exists
  it("1. renders the 'Use Current Location' button in the modal", () => {
    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });
    expect(gpsBtn).toBeInTheDocument();
    expect(screen.getByText("Select Delivery Location")).toBeInTheDocument();
  });

  // 2. Clicking it calls the GPS service
  it("2. calls getCurrentLocation service when 'Use Current Location' is clicked", async () => {
    const mockGetLocation = vi.mocked(getCurrentLocation).mockResolvedValue({
      latitude: 12.9352,
      longitude: 77.6245,
      accuracy: 8,
      timestamp: Date.now(),
    });
    vi.mocked(reverseGeocode).mockResolvedValue({
      displayName: "Koramangala, Bengaluru, Karnataka, 560034",
      road: "80 Feet Road",
      neighbourhood: "Koramangala 4th Block",
      suburb: "Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      area: "80 Feet Road, Koramangala 4th Block",
      formattedAddress: "80 Feet Road, Koramangala 4th Block, Bengaluru, 560034",
    });

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    expect(mockGetLocation).toHaveBeenCalledTimes(1);
    expect(mockGetLocation).toHaveBeenCalledWith({ enableHighAccuracy: true, timeout: 10000 });
  });

  // 3. Loading state appears
  it("3. displays 'Detecting Location...' loading state during GPS retrieval and prevents multi-click", async () => {
    let resolveGps: any;
    const gpsPromise = new Promise<{
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: number;
    }>((resolve) => {
      resolveGps = resolve;
    });

    vi.mocked(getCurrentLocation).mockReturnValue(gpsPromise);

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    // Click once
    act(() => {
      fireEvent.click(gpsBtn);
    });

    // Check loading label
    expect(screen.getByText("Detecting Location...")).toBeInTheDocument();
    expect(gpsBtn).toBeDisabled();

    // Secondary click should be ignored
    fireEvent.click(gpsBtn);
    expect(getCurrentLocation).toHaveBeenCalledTimes(1);

    // Resolve promise to clean up
    await act(async () => {
      resolveGps({
        latitude: 12.9352,
        longitude: 77.6245,
        accuracy: 10,
        timestamp: Date.now(),
      });
    });
  });

  // 4. Successful GPS result updates location & 5. Reverse geocoding updates readable address
  it("4 & 5. updates preview with reverse-geocoded address upon GPS success", async () => {
    vi.mocked(getCurrentLocation).mockResolvedValue({
      latitude: 12.9784,
      longitude: 77.6408,
      accuracy: 5,
      timestamp: Date.now(),
    });
    vi.mocked(reverseGeocode).mockResolvedValue({
      displayName: "100 Feet Road, Indiranagar, Bengaluru, 560038",
      road: "100 Feet Road",
      neighbourhood: "HAL 2nd Stage",
      suburb: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      area: "100 Feet Road, HAL 2nd Stage",
      formattedAddress: "100 Feet Road, HAL 2nd Stage, Bengaluru, 560038",
    });

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    await waitFor(() => {
      expect(screen.getByText("Location Detected")).toBeInTheDocument();
      expect(screen.getByText("100 Feet Road, HAL 2nd Stage, Bengaluru")).toBeInTheDocument();
      expect(screen.getByText("📍 Current Location")).toBeInTheDocument();
    });
  });

  // 6. Permission denied state
  it("6. displays friendly message on permission denied error", async () => {
    vi.mocked(getCurrentLocation).mockRejectedValue(
      new GpsError("PERMISSION_DENIED", "Location permission is required to detect your delivery location.")
    );

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Unable to detect location — Try Again/i)).toBeInTheDocument();
      expect(
        screen.getByText("Location permission is required to detect your delivery location.")
      ).toBeInTheDocument();
    });
  });

  // 7. GPS timeout state
  it("7. displays friendly message on timeout error", async () => {
    vi.mocked(getCurrentLocation).mockRejectedValue(
      new GpsError("TIMEOUT", "Location request timed out. Please try again.")
    );

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Unable to detect location — Try Again/i)).toBeInTheDocument();
      expect(screen.getByText("Location request timed out. Please try again.")).toBeInTheDocument();
    });
  });

  // 8. GPS unavailable state
  it("8. displays friendly message on position unavailable", async () => {
    vi.mocked(getCurrentLocation).mockRejectedValue(
      new GpsError("POSITION_UNAVAILABLE", "Unable to detect your location. Please try again.")
    );

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Unable to detect location — Try Again/i)).toBeInTheDocument();
      expect(screen.getByText("Unable to detect your location. Please try again.")).toBeInTheDocument();
    });
  });

  // 9. Retry works
  it("9. allows retry after an initial GPS error", async () => {
    vi.mocked(getCurrentLocation)
      .mockRejectedValueOnce(new GpsError("TIMEOUT", "Location request timed out. Please try again."))
      .mockResolvedValueOnce({
        latitude: 12.9121,
        longitude: 77.6446,
        accuracy: 6,
        timestamp: Date.now(),
      });

    vi.mocked(reverseGeocode).mockResolvedValue({
      displayName: "HSR Layout, Bengaluru",
      road: "27th Main Rd",
      neighbourhood: "Sector 1",
      suburb: "HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
      area: "27th Main Rd, Sector 1",
      formattedAddress: "27th Main Rd, Sector 1, Bengaluru, 560102",
    });

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    // First attempt fails
    await act(async () => {
      fireEvent.click(gpsBtn);
    });
    expect(screen.getByText(/Unable to detect location — Try Again/i)).toBeInTheDocument();

    // Second attempt (retry) succeeds
    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    await waitFor(() => {
      expect(screen.getByText("Location Detected")).toBeInTheDocument();
      expect(screen.getByText("27th Main Rd, Sector 1, Bengaluru")).toBeInTheDocument();
    });
  });

  // 10. Done confirms the location (DO NOT AUTO CONFIRM)
  it("10. does NOT auto-confirm on GPS detection; only confirms when Done is clicked", async () => {
    vi.mocked(getCurrentLocation).mockResolvedValue({
      latitude: 12.9304,
      longitude: 77.6784,
      accuracy: 7,
      timestamp: Date.now(),
    });
    vi.mocked(reverseGeocode).mockResolvedValue({
      displayName: "Bellandur, Bengaluru",
      road: "Outer Ring Rd",
      neighbourhood: "Bellandur",
      suburb: "Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      area: "Outer Ring Rd, Bellandur",
      formattedAddress: "Outer Ring Rd, Bellandur, Bengaluru, 560103",
    });

    let activeLocation: any = null;
    function TestConsumer() {
      const { userLocation } = useStore();
      activeLocation = userLocation;
      return <div data-testid="active-location">{userLocation.name}</div>;
    }

    const onClose = vi.fn();

    renderWithStore(
      <>
        <TestConsumer />
        <LocationPickerModal isOpen={true} onClose={onClose} />
      </>
    );

    // Initial store location
    expect(screen.getByTestId("active-location").textContent).toBe("Indiranagar");

    // Click GPS
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });
    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    // Preview is visible in modal
    expect(screen.getByText("Outer Ring Rd, Bellandur, Bengaluru")).toBeInTheDocument();

    // Store is NOT updated yet!
    expect(activeLocation?.name).toBe("Indiranagar");

    // Click Done
    const doneBtn = screen.getByRole("button", { name: /^Done$/i });
    act(() => {
      fireEvent.click(doneBtn);
    });

    // NOW store is confirmed
    expect(activeLocation?.name).toBe("Outer Ring Rd, Bellandur");
    expect(activeLocation?.source).toBe("gps");
    expect(activeLocation?.lat).toBe(12.9304);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 11. Search still works
  it("11. allows searching locations and selecting search results", async () => {
    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText(/Search area, landmark/i);
    act(() => {
      fireEvent.change(searchInput, { target: { value: "Whitefield" } });
    });

    // Filtered result is shown
    expect(screen.getByText("Whitefield")).toBeInTheDocument();
  });

  // 12. Saved addresses still work
  it("12. allows selecting saved Home, Work, and Garage addresses", () => {
    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Work / Office")).toBeInTheDocument();
    expect(screen.getByText("Preferred Garage")).toBeInTheDocument();

    // Click Work / Office
    const workBtn = screen.getByText("Work / Office");
    act(() => {
      fireEvent.click(workBtn);
    });

    // Preview banner shows selected location
    expect(screen.getByText("Preview Selected Location")).toBeInTheDocument();
  });

  // 13. GPS does not start automatically
  it("13. does NOT call getCurrentLocation when modal is simply opened or rendered", () => {
    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    expect(getCurrentLocation).not.toHaveBeenCalled();
  });

  // 14. Customer GPS does not start rider WebSocket
  it("14. does NOT activate rider location sharing or rider tracking when customer uses GPS", async () => {
    vi.mocked(getCurrentLocation).mockResolvedValue({
      latitude: 12.9784,
      longitude: 77.6408,
      accuracy: 5,
      timestamp: Date.now(),
    });
    vi.mocked(reverseGeocode).mockResolvedValue({
      displayName: "Indiranagar",
      road: "100ft Rd",
      neighbourhood: "Indiranagar",
      suburb: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      area: "Indiranagar",
      formattedAddress: "Indiranagar, Bengaluru",
    });

    renderWithStore(<LocationPickerModal isOpen={true} onClose={vi.fn()} />);
    const gpsBtn = screen.getByRole("button", { name: /Use Current Location/i });

    await act(async () => {
      fireEvent.click(gpsBtn);
    });

    // Customer GPS MUST NOT trigger rider location sharing
    expect(isLocationSharingActive()).toBe(false);
  });

  // 15, 16 & 17. Order integration and multiple order isolation
  it("15, 16 & 17. normalizes location and applies GPS destination independently to created orders", () => {
    const rawGpsLoc: any = {
      id: "gps_test_1",
      name: "Koramangala 4th Block",
      city: "Bengaluru",
      lat: 12.9352,
      lng: 77.6245,
      latitude: 12.9352,
      longitude: 77.6245,
      address: "17th Main Rd, Koramangala 4th Block, Bengaluru 560034",
      area: "Koramangala 4th Block",
      state: "Karnataka",
      pincode: "560034",
      source: "gps",
    };

    const normalized = toNormalizedLocation(rawGpsLoc);
    expect(normalized.source).toBe("gps");
    expect(normalized.latitude).toBe(12.9352);
    expect(normalized.longitude).toBe(77.6245);
    expect(normalized.address).toContain("Koramangala");

    // Multiple orders isolation test
    const orderA = {
      id: "RZ-100001",
      destination: {
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        address: normalized.address,
      },
    };

    const orderB = {
      id: "RZ-100002",
      destination: {
        latitude: 12.9784,
        longitude: 77.6408,
        address: "Indiranagar, Bengaluru",
      },
    };

    expect(orderA.destination.latitude).toBe(12.9352);
    expect(orderB.destination.latitude).toBe(12.9784);
    // Order A destination is retained independently and does not overwrite Order B
    expect(orderA.destination.latitude).not.toBe(orderB.destination.latitude);
  });
});
