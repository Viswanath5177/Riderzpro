export interface PincodeLookupResult {
  pincode: string;
  city: string;
  state: string;
  area: string;
  lat: number;
  lng: number;
}

const PINCODE_MAP: Record<string, Omit<PincodeLookupResult, "pincode">> = {
  // Bengaluru Hubs
  "560038": { city: "Bengaluru", state: "Karnataka", area: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  "560034": { city: "Bengaluru", state: "Karnataka", area: "Koramangala", lat: 12.9352, lng: 77.6245 },
  "560011": { city: "Bengaluru", state: "Karnataka", area: "Jayanagar", lat: 12.925, lng: 77.5938 },
  "560024": { city: "Bengaluru", state: "Karnataka", area: "Hebbal", lat: 13.0358, lng: 77.597 },
  "560066": { city: "Bengaluru", state: "Karnataka", area: "Whitefield", lat: 12.9698, lng: 77.75 },
  "560003": { city: "Bengaluru", state: "Karnataka", area: "Malleshwaram", lat: 13.0035, lng: 77.5709 },
  "560001": { city: "Bengaluru", state: "Karnataka", area: "MG Road / CBD", lat: 12.9716, lng: 77.5946 },
  "560076": { city: "Bengaluru", state: "Karnataka", area: "BTM Layout", lat: 12.9165, lng: 77.6101 },
  "560100": { city: "Bengaluru", state: "Karnataka", area: "Electronic City", lat: 12.8452, lng: 77.6602 },
  "560095": { city: "Bengaluru", state: "Karnataka", area: "Koramangala 1st Block", lat: 12.9279, lng: 77.6271 },
  // Mumbai
  "400001": { city: "Mumbai", state: "Maharashtra", area: "Fort", lat: 18.9322, lng: 72.8354 },
  "400093": { city: "Mumbai", state: "Maharashtra", area: "Andheri East", lat: 19.1136, lng: 72.8697 },
  "400050": { city: "Mumbai", state: "Maharashtra", area: "Bandra West", lat: 19.0596, lng: 72.8295 },
  // Hyderabad
  "500081": { city: "Hyderabad", state: "Telangana", area: "Hitec City", lat: 17.4435, lng: 78.3772 },
  "500001": { city: "Hyderabad", state: "Telangana", area: "Abids", lat: 17.385, lng: 78.4867 },
  // Chennai
  "600002": { city: "Chennai", state: "Tamil Nadu", area: "Anna Salai", lat: 13.0674, lng: 80.2678 },
  // Pune
  "411001": { city: "Pune", state: "Maharashtra", area: "Shivajinagar", lat: 18.5314, lng: 73.8446 },
  // Delhi
  "110001": { city: "New Delhi", state: "Delhi", area: "Connaught Place", lat: 28.6315, lng: 77.2167 },
};

export const pincodeAdapter = {
  async lookup(pincode: string): Promise<PincodeLookupResult> {
    const clean = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      throw new Error("Invalid Indian postal pincode");
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (PINCODE_MAP[clean]) {
      return {
        pincode: clean,
        ...PINCODE_MAP[clean],
      };
    }

    // Default heuristics based on prefix
    if (clean.startsWith("56")) {
      return { pincode: clean, city: "Bengaluru", state: "Karnataka", area: `Bengaluru (${clean})`, lat: 12.9716, lng: 77.5946 };
    }
    if (clean.startsWith("40")) {
      return { pincode: clean, city: "Mumbai", state: "Maharashtra", area: `Mumbai (${clean})`, lat: 19.076, lng: 72.8777 };
    }
    if (clean.startsWith("50")) {
      return { pincode: clean, city: "Hyderabad", state: "Telangana", area: `Hyderabad (${clean})`, lat: 17.385, lng: 78.4867 };
    }
    if (clean.startsWith("60")) {
      return { pincode: clean, city: "Chennai", state: "Tamil Nadu", area: `Chennai (${clean})`, lat: 13.0827, lng: 80.2707 };
    }
    if (clean.startsWith("41")) {
      return { pincode: clean, city: "Pune", state: "Maharashtra", area: `Pune (${clean})`, lat: 18.5204, lng: 73.8567 };
    }
    if (clean.startsWith("11")) {
      return { pincode: clean, city: "New Delhi", state: "Delhi", area: `Delhi (${clean})`, lat: 28.6139, lng: 77.209 };
    }

    return {
      pincode: clean,
      city: "Bengaluru",
      state: "Karnataka",
      area: `Area ${clean}`,
      lat: 12.9716,
      lng: 77.5946,
    };
  },
};
