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

export interface PlaceSuggestion {
  id: string;
  name: string;
  description: string;
  city: string;
  state?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  source?: string;
}

/**
 * Searches places, cities, neighborhoods, landmarks, or PIN codes
 * Uses Google Places / Geocoder with fallback to high-speed Photon & OpenStreetMap.
 */
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const clean = (query || "").trim();
  if (!clean || clean.length < 2) return [];

  // 1. Query RiderzPro server endpoint (handles Google Places API key & server caches)
  try {
    const res = await fetch(`/api/location/places?q=${encodeURIComponent(clean)}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.places) && data.places.length > 0) {
        return data.places;
      }
    }
  } catch {}

  // 2. Client-side OpenStreetMap Photon fallback
  try {
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=8`);
    if (res.ok) {
      const pData = await res.json();
      if (Array.isArray(pData.features) && pData.features.length > 0) {
        return pData.features.map((f: any, idx: number) => {
          const props = f.properties || {};
          const name = props.name || props.street || props.city || clean;
          const parts = [props.street, props.city || props.county, props.state, props.postcode, props.country].filter(Boolean);
          return {
            id: `client-photon-${props.osm_id || idx}`,
            name,
            description: parts.length > 0 ? `${name}, ${parts.join(", ")}` : name,
            city: props.city || props.county || props.state || "India",
            state: props.state || "",
            pincode: props.postcode || "",
            lat: f.geometry?.coordinates?.[1] || 12.9716,
            lng: f.geometry?.coordinates?.[0] || 77.5946,
            source: "photon",
          };
        });
      }
    }
  } catch {}

  return [];
}

