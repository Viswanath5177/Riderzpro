/**
 * OpenStreetMap / Nominatim Reverse Geocoding Service
 * Converts real device GPS coordinates (lat, lng) to a human-readable street address.
 */

export interface ReverseGeocodeResult {
  displayName: string;
  road: string;
  neighbourhood: string;
  suburb: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
  formattedAddress: string;
}

/**
 * Reverse geocode latitude and longitude using OpenStreetMap Nominatim API.
 * Uses a 5-second timeout and gracefully falls back to coordinate descriptors if offline.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<ReverseGeocodeResult> {
  // If an external signal is not passed, create a 5s timeout signal
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let effectiveSignal = signal;

  if (!effectiveSignal && typeof AbortController !== "undefined") {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 6000);
    effectiveSignal = controller.signal;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}&format=jsonv2&addressdetails=1`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "RiderzPro/1.0 (Logistics Delivery)",
      },
      signal: effectiveSignal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Reverse geocoding failed with HTTP status ${res.status}`);
    }

    const data = await res.json();
    const addr = data?.address || {};

    const road =
      addr.road || addr.pedestrian || addr.street || addr.highway || addr.path || "";
    const neighbourhood =
      addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || "";
    const suburb = addr.suburb || addr.city_district || "";
    const city =
      addr.city || addr.town || addr.village || addr.municipality || addr.county || "Bengaluru";
    const state = addr.state || "Karnataka";
    const pincode = addr.postcode || "";
    const displayName = data.display_name || "";

    // Build a clean, natural Indian urban locality name
    const areaParts = [road, neighbourhood || suburb].filter(Boolean);
    const area =
      areaParts.length > 0
        ? areaParts.join(", ")
        : neighbourhood || suburb || city || `Area (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

    // Build standard multi-part formatted address
    const formattedAddressParts = [road, neighbourhood || suburb, city, pincode].filter(Boolean);
    const formattedAddress =
      formattedAddressParts.length > 0
        ? formattedAddressParts.join(", ")
        : displayName || `${city}, ${state}`;

    return {
      displayName,
      road,
      neighbourhood,
      suburb,
      city,
      state,
      pincode,
      area,
      formattedAddress,
    };
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);
    console.warn("[ReverseGeocode] Geocoding service fallback:", err?.message || err);

    // Fallback descriptor keeping exact GPS coordinates intact
    const coordLabel = `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    return {
      displayName: coordLabel,
      road: "",
      neighbourhood: "",
      suburb: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "",
      area: coordLabel,
      formattedAddress: `${coordLabel}, Bengaluru`,
    };
  }
}
