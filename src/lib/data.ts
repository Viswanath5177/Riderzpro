import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import charger from "@/assets/charger.jpg";
import parts from "@/assets/parts.jpg";

import heroBike from "@/assets/hero-bike.jpg";
import scooterImg from "@/assets/scooter.jpg";
import catalog from "@/data/accessory_catalog.json";
import vehicleCatalog from "../../web/data/ev_two_wheeler_catalog.json";

export type Bike = { id: string; make: string; model: string; years: number[]; voltage: number; wmi: string };
export type Vendor = { id: string; name: string; area: string; lat: number; lng: number; rating: number; prepMins: number };
export type Category =
  | "Battery"
  | "Charger"
  | "BMS"
  | "Motor"
  | "Controller"
  | "Brakes"
  | "Electric Bikes"
  | "Car Accessories"
  | "Bike Accessories"
  | "Riding Gear & Helmets"
  | "Spare Parts"
  | string;

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  isAccessoryProduct?: boolean;
  subcategory?: string;
  subcategories?: string[];
  vehicleType?: "car" | "bike" | "both";
  image: string;
  voltage?: number;
  capacityAh?: number;
  batteryCapacityKwh?: number;
  batterySpec?: string;
  chemistry?: string;
  warrantyMonths: number;
  rangeKm?: number;
  weightKg: number;
  fits: string[]; // bike ids
  description: string;
  offers: { vendorId: string; price: number; stock: number }[];
};
export type Rider = { id: string; name: string; phone: string; vehicle: string; plate: string; rating: number; avatar: string };

export const CUSTOMER_LOCATION = { lat: 12.9716, lng: 77.5946, label: "MG Road, Bengaluru" };

export const bikes: Bike[] = [
  { id: "ather-450x", make: "Ather", model: "450X", years: [2021, 2022, 2023, 2024, 2025], voltage: 48, wmi: "MD9" },
  { id: "ola-s1pro", make: "Ola", model: "S1 Pro", years: [2022, 2023, 2024, 2025], voltage: 60, wmi: "P6R" },
  { id: "tvs-iqube", make: "TVS", model: "iQube S", years: [2021, 2022, 2023, 2024], voltage: 48, wmi: "MD6" },
  { id: "bajaj-chetak", make: "Bajaj", model: "Chetak", years: [2020, 2021, 2022, 2023, 2024, 2025], voltage: 60, wmi: "MD2" },
  { id: "revolt-rv400", make: "Revolt", model: "RV400", years: [2020, 2021, 2022, 2023, 2024], voltage: 72, wmi: "MCR" },
  { id: "hero-vida-v1", make: "Hero", model: "Vida V1", years: [2023, 2024, 2025], voltage: 60, wmi: "MBL" },
];

export const vendors: Vendor[] = [
  { id: "v1", name: "VoltHub Indiranagar", area: "Indiranagar", lat: 12.9784, lng: 77.6408, rating: 4.8, prepMins: 15 },
  { id: "v2", name: "ChargeKart Koramangala", area: "Koramangala", lat: 12.9352, lng: 77.6245, rating: 4.6, prepMins: 20 },
  { id: "v3", name: "EV Spares Jayanagar", area: "Jayanagar", lat: 12.925, lng: 77.5938, rating: 4.5, prepMins: 25 },
  { id: "v4", name: "Ampere Auto Hebbal", area: "Hebbal", lat: 13.0358, lng: 77.597, rating: 4.7, prepMins: 15 },
  { id: "v5", name: "GreenWheels Whitefield", area: "Whitefield", lat: 12.9698, lng: 77.75, rating: 4.4, prepMins: 30 },
  { id: "v6", name: "Riderz Dealer Malleshwaram", area: "Malleshwaram", lat: 13.0035, lng: 77.5709, rating: 4.9, prepMins: 10 },
];

export const ALL_PRODUCT_CATEGORIES = Array.from(
  new Set(
    catalog.products
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c && typeof c === "string" && c.trim() !== ""))
  )
).sort((a, b) => a.localeCompare(b));

const img = { b1: battery1, b2: battery2, b3: battery3, ch: charger, pt: parts };

type Seed = Omit<Product, "offers" | "id"> & { base: number; vendors: string[] };
const coreSeeds: Seed[] = [
  { name: "VoltRide 60V 30Ah Li-ion Pack", brand: "VoltRide", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b1, voltage: 60, capacityAh: 30, chemistry: "NMC", warrantyMonths: 36, rangeKm: 110, weightKg: 13, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "High-density NMC pack with smart BMS, IP67 casing and fast-charge support.", base: 62000, vendors: ["v1", "v2", "v6"] },
  { name: "VoltEdge 48V 50Ah LiFePO4", brand: "VoltEdge", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b2, voltage: 48, capacityAh: 50, chemistry: "LiFePO4", warrantyMonths: 48, rangeKm: 120, weightKg: 18, fits: ["ather-450x", "tvs-iqube"], description: "Ultra-safe LiFePO4 chemistry with 3000+ cycles. Built for daily commuters and fleets.", base: 54000, vendors: ["v1", "v3", "v4"] },
  { name: "Titan 72V 120Ah Motorcycle Module", brand: "Titan Energy", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b3, voltage: 72, capacityAh: 120, chemistry: "NMC", warrantyMonths: 36, rangeKm: 180, weightKg: 38, fits: ["revolt-rv400"], description: "High-capacity module for performance EV motorcycles with CAN-bus communication.", base: 98000, vendors: ["v2", "v4", "v5"] },
  { name: "VoltRide 60V 24Ah City Pack", brand: "VoltRide", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b1, voltage: 60, capacityAh: 24, chemistry: "NMC", warrantyMonths: 24, rangeKm: 85, weightKg: 11, fits: ["ola-s1pro", "hero-vida-v1"], description: "Lightweight swap-friendly pack for city riders.", base: 46000, vendors: ["v1", "v5"] },
  { name: "VoltEdge 48V 30Ah Compact", brand: "VoltEdge", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b2, voltage: 48, capacityAh: 30, chemistry: "LiFePO4", warrantyMonths: 36, rangeKm: 75, weightKg: 12, fits: ["ather-450x", "tvs-iqube"], description: "Compact LiFePO4 replacement with plug-and-play connectors.", base: 36000, vendors: ["v3", "v6"] },
  { name: "Titan 72V 60Ah Sport", brand: "Titan Energy", category: "Battery", subcategory: "EV Accessories", vehicleType: "bike", image: img.b3, voltage: 72, capacityAh: 60, chemistry: "NMC", warrantyMonths: 24, rangeKm: 120, weightKg: 22, fits: ["revolt-rv400"], description: "Sport-tuned discharge curve for quick acceleration.", base: 72000, vendors: ["v4", "v6"] },
  { name: "ChargeMax 3.3kW Fast Charger", brand: "ChargeMax", category: "Charger", subcategory: "EV Accessories", vehicleType: "both", image: img.ch, voltage: 60, warrantyMonths: 12, weightKg: 3, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "3.3kW portable fast charger with Type-2 connector and LED status.", base: 14500, vendors: ["v1", "v2", "v3", "v6"] },
  { name: "ChargeMax 48V Home Charger", brand: "ChargeMax", category: "Charger", subcategory: "EV Accessories", vehicleType: "both", image: img.ch, voltage: 48, warrantyMonths: 12, weightKg: 2, fits: ["ather-450x", "tvs-iqube"], description: "Smart home charger with auto cut-off and temperature protection.", base: 7800, vendors: ["v3", "v4"] },
  { name: "SmartBMS 16S 60A Board", brand: "Daly", category: "BMS", subcategory: "Utilities", vehicleType: "both", image: img.ch, voltage: 60, warrantyMonths: 12, weightKg: 0.4, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "Bluetooth BMS with cell balancing, over-current and thermal protection.", base: 4200, vendors: ["v2", "v5"] },
  { name: "QS 3000W 72V Hub Motor", brand: "QS Motor", category: "Motor", subcategory: "Utilities", vehicleType: "bike", image: img.pt, voltage: 72, warrantyMonths: 18, weightKg: 9, fits: ["revolt-rv400"], description: "Brushless hub motor rated 3kW continuous with hall sensors.", base: 28000, vendors: ["v4", "v5"] },
  { name: "Kelly 72V 80A Controller", brand: "Kelly", category: "Controller", subcategory: "Utilities", vehicleType: "bike", image: img.pt, voltage: 72, warrantyMonths: 12, weightKg: 1.6, fits: ["revolt-rv400"], description: "Programmable sinusoidal controller with regen braking.", base: 9500, vendors: ["v2", "v4"] },
  { name: "Wave Disc Brake Rotor 220mm", brand: "Brembo", category: "Brakes", subcategory: "Utilities", vehicleType: "bike", image: img.pt, warrantyMonths: 6, weightKg: 0.8, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Stainless wave rotor for improved heat dissipation.", base: 2400, vendors: ["v1", "v3", "v6"] },
  { name: "Ather 450X Gen 3 Smart Electric Scooter", brand: "Ather Energy", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/196337/450x-right-side-view-2.png?isig=0&q=80", voltage: 48, capacityAh: 78, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 150, weightKg: 108, fits: ["ather-450x"], description: "Flagship 450X with Warp Mode, 7-inch TFT touchscreen and IP67 battery pack.", base: 145000, vendors: ["v1", "v6"] },
  { name: "Ather Konarc", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/209108/konarc-right-side-view-16.jpeg?isig=0&q=80", warrantyMonths: 0, weightKg: 0, fits: [], description: "Starting ex-showroom price from the supplied catalog; city and variant pricing may differ.", base: 99999, vendors: ["v1", "v6"] },
  { name: "Ather 450", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/196337/450x-right-side-view-2.png?isig=0&q=80", warrantyMonths: 0, weightKg: 0, fits: [], description: "Starting ex-showroom price from the supplied catalog; confirm the selected battery and city price.", base: 135999, vendors: ["v1", "v6"] },
  { name: "Ather Rizta", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/168965/rizta-right-side-view-4.png?isig=0&q=80", warrantyMonths: 0, weightKg: 0, fits: [], description: "Rizta S starting ex-showroom price from the supplied catalog; other variants are priced separately.", base: 121999, vendors: ["v1", "v6"] },
  { name: "Ather 450S", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/149605/450s-right-side-view-2.png?isig=0&q=80", warrantyMonths: 0, rangeKm: 161, weightKg: 0, fits: [], description: "Starting ex-showroom listing price; verify current price and availability with a dealer. Claimed range: 161 km. Top speed: 90 km/h. Charging time: 5.15 hours.", base: 127888, vendors: ["v1", "v6"] },
  { name: "Ather 450 Apex", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/167915/450-apex-right-side-view.png?isig=0&q=80", warrantyMonths: 0, rangeKm: 165, weightKg: 0, fits: [], description: "Starting ex-showroom listing price; verify current price and availability with a dealer. Claimed range: 165 km. Top speed: 100 km/h. Charging time: 5.15 hours.", base: 194946, vendors: ["v1", "v6"] },
  { name: "TVS iQube 2.3 kWh", brand: "TVS", category: "Electric Bikes", vehicleType: "bike", image: "https://www.tvsmotor.com/electric-scooters/tvs-iqube/-/media/Vehicles/Feature/Iqube/Variant/Comparison/23new.webp?h=260&la=en&w=380", voltage: 52, capacityAh: 44, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 114, weightKg: 109, fits: [], description: "TVS iQube electric scooter with 2.3 kWh battery and up to 114 km IDC range. Price and availability can vary by city.", base: 116310, vendors: ["v2", "v6"] },
  { name: "TVS X Electric Scooter", brand: "TVS", category: "Electric Bikes", vehicleType: "bike", image: "https://www.tvsmotor.com/U388_Assets/images/360images/28.webp", voltage: 72, capacityAh: 53, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 140, weightKg: 140, fits: [], description: "Premium electric scooter with 3.8 kWh battery, 140 km IDC range and 105 km/h top speed. Starting ex-showroom price; final price varies by city.", base: 266141, vendors: ["v2", "v6"] },
  { name: "TVS Orbiter V2 Electric Scooter", brand: "TVS", category: "Electric Bikes", vehicleType: "bike", image: "https://asset.autocarindia.com/static/image-galleries/images/20251216_111800_4c55f888.png?q=75&w=728", voltage: 48, capacityAh: 65, chemistry: "Li-ion", warrantyMonths: 60, rangeKm: 158, weightKg: 112, fits: [], description: "TVS Orbiter V2 with 3.1 kWh battery and up to 158 km IDC range. Price and availability can vary by city.", base: 103650, vendors: ["v2", "v6"] },
  { name: "Revolt RV400 Electric Motorcycle", brand: "Revolt Motors", category: "Electric Bikes", vehicleType: "bike", image: heroBike, batteryCapacityKwh: 3.24, chemistry: "NMC", warrantyMonths: 36, rangeKm: 150, weightKg: 115, fits: ["revolt-rv400"], description: "AI-enabled electric performance motorcycle with a 3.24 kWh NMC battery, MyRevolt connectivity and 85 km/h top speed.", base: 139000, vendors: ["v4", "v6"] },
  { name: "Ola S1 Pro Gen 2 Hyperdrive Scooter", brand: "Ola Electric", category: "Electric Bikes", vehicleType: "bike", image: scooterImg, voltage: 60, capacityAh: 68, chemistry: "NMC", warrantyMonths: 36, rangeKm: 195, weightKg: 116, fits: ["ola-s1pro"], description: "11kW peak power, 120 km/h top speed, MoveOS 4 navigation and cruise control.", base: 129000, vendors: ["v2", "v5"] },
];

const coreProducts: Product[] = coreSeeds.map((s, i) => {
  const { base, vendors: vs, ...rest } = s;
  return {
    ...rest,
    id: `p${i + 1}`,
    offers: vs.map((v, j) => ({
      vendorId: v,
      price: Math.round(((base * (1 + (j - 1) * 0.04)) / 10)) * 10,
      stock: ((i + j) * 7) % 23 + 2,
    })),
  };
});

const requestedVehicleBrands = new Set(["Ola Electric", "Ampere", "Komaki", "Revolt", "VIDA (Hero)"]);
const verifiedBatterySpecs: Record<string, Partial<Pick<Product, "voltage" | "capacityAh" | "batteryCapacityKwh" | "batterySpec" | "chemistry">>> = {
  "ampere-magnus-gmax": { batteryCapacityKwh: 3, chemistry: "LFP" },
  "ampere-nexus-explus": { batteryCapacityKwh: 3, chemistry: "LFP" },
  "ampere-reo-vyb": { batteryCapacityKwh: 1.44, chemistry: "LFP" },
  "ampere-reo": { batteryCapacityKwh: 1.44, chemistry: "LFP" },
  "ampere-nexus": { batteryCapacityKwh: 3, chemistry: "LFP" },
  "ampere-magnus-neo": { batteryCapacityKwh: 2.3, chemistry: "LFP" },
  "komaki-xgt-cat-2-0": { batterySpec: "Variant options: 60/72 V, 20–45 Ah; gel or lithium-ion battery." },
  "komaki-xgt-km": { voltage: 60, capacityAh: 34, chemistry: "Graphene" },
  "komaki-xr7": { chemistry: "LiFePO4" },
  "komaki-mg-pro": { batterySpec: "Battery chemistry and capacity vary by MG Pro variant." },
  "komaki-ranger": { chemistry: "LiFePO4" },
  "komaki-mx16-pro": { batteryCapacityKwh: 4.5, chemistry: "LiFePO4" },
  "ola-s1-z": { batteryCapacityKwh: 3.1 },
  "ola-s1-x-plus": { batteryCapacityKwh: 4 },
  "ola-s1-pro-plus": { batteryCapacityKwh: 5.2 },
  "ola-electric-s1-x-plus": { batteryCapacityKwh: 4 },
  "ola-electric-s1-pro-sport": { batterySpec: "Battery variants: 4 kWh or 5.2 kWh; this catalog listing does not specify which one." },
  "ola-electric-roadster": { batteryCapacityKwh: 3.5 },
  "ola-electric-roadster-x": { batteryCapacityKwh: 2.5 },
  "ola-electric-roadster-pro": { batteryCapacityKwh: 8 },
  "revolt-rv1": { batteryCapacityKwh: 2.2, chemistry: "LFP" },
  "revolt-rv1-plus": { batteryCapacityKwh: 3.24, chemistry: "NMC" },
  "revolt-rv400-brz": { batteryCapacityKwh: 3.24, chemistry: "NMC" },
  "revolt-blazex": { batteryCapacityKwh: 3.24, chemistry: "NMC" },
  "revolt-rvx": { batteryCapacityKwh: 3.24, chemistry: "NMC" },
  "vida-vx2-go": { batteryCapacityKwh: 2.2 },
  "vida-vx2-plus": { batteryCapacityKwh: 3.4 },
  "vida-hero-v2": { batteryCapacityKwh: 3.94 },
};
const uploadedBrandProducts: Product[] = vehicleCatalog.products
  .filter((item) => requestedVehicleBrands.has(item.brand) && !(item.brand === "Revolt" && item.model === "RV400"))
  .map((item, index) => {
    const variant = item.variant && !["Base", "Base / listing entry"].includes(item.variant) ? ` ${item.variant}` : "";
    const battery = verifiedBatterySpecs[item.id] ?? {};
    const specs = [
      battery.batteryCapacityKwh ? `${battery.batteryCapacityKwh} kWh ${battery.chemistry ?? ""} battery` : "",
      battery.batterySpec ?? "",
      battery.voltage && battery.capacityAh ? `${battery.voltage} V ${battery.capacityAh} Ah ${battery.chemistry ?? ""} battery` : "",
      item.claimed_range_km ? `${item.claimed_range_km} km claimed range` : "",
      item.top_speed_kmh ? `${item.top_speed_kmh} km/h top speed` : "",
      item.charging_time_text ? `${item.charging_time_text} charging time` : "",
    ].filter(Boolean);

    return {
      id: `catalog-${item.id}`,
      name: `${item.brand} ${item.model}${variant}`,
      brand: item.brand,
      category: "Electric Bikes",
      vehicleType: "bike",
      image: item.image_url,
      ...battery,
      ...(typeof item.claimed_range_km === "number" ? { rangeKm: item.claimed_range_km } : {}),
      warrantyMonths: 0,
      weightKg: 0,
      fits: [],
      description: [item.price_note, ...specs].filter(Boolean).join(" "),
      offers: [{ vendorId: vendors[index % vendors.length].id, price: item.price_inr, stock: 10 }],
    };
  });

const catalogBrandNames = new Map<string, string>();
const catalogProducts: Product[] = (catalog.products as any[]).map((p, i) => {
  const basePrice = Math.round(Number(p.price) || Number(p.mrp) || 999);
  const primaryImage = p.imageUrls && p.imageUrls.length > 0 && p.imageUrls[0] ? p.imageUrls[0].trim() : "";
  const v1 = vendors[i % vendors.length].id;
  const v2 = vendors[(i + 2) % vendors.length].id;
  const v3 = vendors[(i + 4) % vendors.length].id;

  const stock1 = p.stock !== null && p.stock !== undefined ? Number(p.stock) : ((i * 7) % 19 + 3);
  const stock2 = (i * 5) % 14 + 2;
  const stock3 = (i * 3) % 11 + 1;
  const fitText = String(p.fits || "").toLowerCase();
  const verifiedBikeFits = bikes
    .filter((bike) => {
      const model = bike.model.toLowerCase();
      return fitText.includes(model);
    })
    .map((bike) => bike.id);
  const rawBrand = String(p.brand || "Riderzpro").trim() || "Riderzpro";
  const brandKey = rawBrand.toLocaleLowerCase();
  const brand = catalogBrandNames.get(brandKey) || rawBrand;
  catalogBrandNames.set(brandKey, brand);
  const vehicleType = ["car", "bike", "both"].includes(p.vehicleType)
    ? (p.vehicleType as "car" | "bike" | "both")
    : undefined;

  return {
    id: p.id,
    name: p.name,
    brand,
    category: String(p.category || "Accessories").trim() || "Accessories",
    isAccessoryProduct: true,
    subcategory: p.category || "Accessories",
    subcategories: [p.category, p.department, ...(p.features || [])].filter(Boolean) as string[],
    vehicleType,
    image: primaryImage,
    warrantyMonths: typeof p.warranty === "string" ? parseInt(p.warranty) || 12 : 12,
    weightKg: 1,
    fits: verifiedBikeFits,
    description:
      p.description?.trim() ||
      (p.features && p.features.length > 0 ? p.features.join(". ") : `${p.name} from ${p.brand || "Riderzpro"}. Official catalog component.`),
    offers: [
      { vendorId: v1, price: basePrice, stock: stock1 },
      { vendorId: v2, price: Math.round((basePrice * 1.05) / 10) * 10, stock: stock2 },
      { vendorId: v3, price: Math.round((basePrice * 0.96) / 10) * 10, stock: stock3 },
    ],
  };
});

export const products: Product[] = [...coreProducts, ...uploadedBrandProducts, ...catalogProducts];

export const riders: Rider[] = [
  { id: "r1", name: "Ravi Kumar", phone: "+91 98450 12345", vehicle: "Ather Rizta", plate: "KA 01 EV 4521", rating: 4.9, avatar: "RK" },
  { id: "r2", name: "Salma Begum", phone: "+91 99000 54321", vehicle: "TVS iQube", plate: "KA 03 EV 1180", rating: 4.8, avatar: "SB" },
];

export const getVendor = (id: string) => vendors.find((v) => v.id === id) || vendors[0];
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getBike = (id: string) => bikes.find((b) => b.id === id);
export const bestOffer = (p: Product) => {
  if (!p || !p.offers || p.offers.length === 0) return { vendorId: "v1", price: 999, stock: 5 };
  return [...p.offers].sort((a, b) => a.price - b.price)[0];
};


export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const DELIVERY_BASE = 40;
export const DELIVERY_PER_KM = 12;
export const GST_RATE = 0.18;

export function deliveryFee(km: number) {
  return Math.round(DELIVERY_BASE + km * DELIVERY_PER_KM);
}
export function etaMinutes(km: number, prepMins: number) {
  return Math.round(prepMins + (km / 22) * 60 + 5);
}

export type Fitment = "compatible" | "incompatible" | "unknown";
export function fitmentFor(p: Product, bikeId?: string | null): Fitment {
  if (!bikeId) return "unknown";
  if (!p.fits.length) return "unknown";
  return p.fits.includes(bikeId) ? "compatible" : "incompatible";
}

const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";
export function decodeVin(raw: string): { ok: boolean; error?: string; bike?: Bike; year?: number } {
  const vin = raw.trim().toUpperCase();
  if (vin.length !== 17) return { ok: false, error: "VIN must be exactly 17 characters" };
  if (/[IOQ]/.test(vin)) return { ok: false, error: "VIN cannot contain I, O or Q" };
  if (!/^[A-Z0-9]+$/.test(vin)) return { ok: false, error: "Only letters and numbers allowed" };
  const bike = bikes.find((b) => vin.startsWith(b.wmi));
  const idx = YEAR_CODES.indexOf(vin[9]);
  const year = idx >= 0 ? 2010 + idx : undefined;
  if (!bike) return { ok: false, error: "Manufacturer not recognised — pick your bike manually" };
  return { ok: true, bike, year };
}
