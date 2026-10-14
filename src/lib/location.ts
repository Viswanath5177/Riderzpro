/**
 * Reverse Geocoding Utility for RiderzPro
 * Accurately determines city, neighborhood, and postal code from latitude and longitude.
 */

export interface GeocodedLocation {
  name: string;
  city: string;
  state?: string;
  pincode?: string;
}

export async function reverseGeocodeCoords(
  latitude: number,
  longitude: number
): Promise<GeocodedLocation> {
  // 1. Try local server reverse-geocode endpoint (avoids browser CORS or extension blocks)
  try {
    const res = await fetch(`/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && (data.name || data.city)) {
        return {
          name: data.name || data.city,
          city: data.city || data.state || "India",
          state: data.state,
          pincode: data.pincode,
        };
      }
    }
  } catch {}

  // 2. Direct client-side BigDataCloud (fast, CORS-open, no key required)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const d = await res.json();
      const locality = d.locality || d.city || d.principalSubdivision;
      const city = d.city || d.principalSubdivision || "India";
      if (locality || city) {
        return {
          name: locality || city,
          city: city,
          state: d.principalSubdivision,
          pincode: d.postcode || "",
        };
      }
    }
  } catch {}

  // 3. Direct client-side OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    if (res.ok) {
      const d = await res.json();
      const addr = d.address || {};
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        addr.subdistrict ||
        d.name;
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.city_district ||
        addr.county ||
        addr.state_district ||
        addr.state ||
        "India";
      if (locality || city) {
        return {
          name: locality || city,
          city: city,
          state: addr.state,
          pincode: addr.postcode || "",
        };
      }
    }
  } catch {}

  return {
    name: "Current Location",
    city: "India",
  };
}
