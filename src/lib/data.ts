import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import charger from "@/assets/charger.jpg";
import parts from "@/assets/parts.jpg";

import heroBike from "@/assets/hero-bike.jpg";
import scooterImg from "@/assets/scooter.jpg";

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
  | "Spare Parts";
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  voltage?: number;
  capacityAh?: number;
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

const img = { b1: battery1, b2: battery2, b3: battery3, ch: charger, pt: parts };

type Seed = Omit<Product, "offers" | "id"> & { base: number; vendors: string[] };
const seeds: Seed[] = [
  { name: "VoltRide 60V 30Ah Li-ion Pack", brand: "VoltRide", category: "Battery", image: img.b1, voltage: 60, capacityAh: 30, chemistry: "NMC", warrantyMonths: 36, rangeKm: 110, weightKg: 13, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "High-density NMC pack with smart BMS, IP67 casing and fast-charge support.", base: 62000, vendors: ["v1", "v2", "v6"] },
  { name: "VoltEdge 48V 50Ah LiFePO4", brand: "VoltEdge", category: "Battery", image: img.b2, voltage: 48, capacityAh: 50, chemistry: "LiFePO4", warrantyMonths: 48, rangeKm: 120, weightKg: 18, fits: ["ather-450x", "tvs-iqube"], description: "Ultra-safe LiFePO4 chemistry with 3000+ cycles. Built for daily commuters and fleets.", base: 54000, vendors: ["v1", "v3", "v4"] },
  { name: "Titan 72V 120Ah Motorcycle Module", brand: "Titan Energy", category: "Battery", image: img.b3, voltage: 72, capacityAh: 120, chemistry: "NMC", warrantyMonths: 36, rangeKm: 180, weightKg: 38, fits: ["revolt-rv400"], description: "High-capacity module for performance EV motorcycles with CAN-bus communication.", base: 98000, vendors: ["v2", "v4", "v5"] },
  { name: "VoltRide 60V 24Ah City Pack", brand: "VoltRide", category: "Battery", image: img.b1, voltage: 60, capacityAh: 24, chemistry: "NMC", warrantyMonths: 24, rangeKm: 85, weightKg: 11, fits: ["ola-s1pro", "hero-vida-v1"], description: "Lightweight swap-friendly pack for city riders.", base: 46000, vendors: ["v1", "v5"] },
  { name: "VoltEdge 48V 30Ah Compact", brand: "VoltEdge", category: "Battery", image: img.b2, voltage: 48, capacityAh: 30, chemistry: "LiFePO4", warrantyMonths: 36, rangeKm: 75, weightKg: 12, fits: ["ather-450x", "tvs-iqube"], description: "Compact LiFePO4 replacement with plug-and-play connectors.", base: 36000, vendors: ["v3", "v6"] },
  { name: "Titan 72V 60Ah Sport", brand: "Titan Energy", category: "Battery", image: img.b3, voltage: 72, capacityAh: 60, chemistry: "NMC", warrantyMonths: 24, rangeKm: 120, weightKg: 22, fits: ["revolt-rv400"], description: "Sport-tuned discharge curve for quick acceleration.", base: 72000, vendors: ["v4", "v6"] },
  { name: "ChargeMax 3.3kW Fast Charger", brand: "ChargeMax", category: "Charger", image: img.ch, voltage: 60, warrantyMonths: 12, weightKg: 3, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "3.3kW portable fast charger with Type-2 connector and LED status.", base: 14500, vendors: ["v1", "v2", "v3", "v6"] },
  { name: "ChargeMax 48V Home Charger", brand: "ChargeMax", category: "Charger", image: img.ch, voltage: 48, warrantyMonths: 12, weightKg: 2, fits: ["ather-450x", "tvs-iqube"], description: "Smart home charger with auto cut-off and temperature protection.", base: 7800, vendors: ["v3", "v4"] },
  { name: "SmartBMS 16S 60A Board", brand: "Daly", category: "BMS", image: img.ch, voltage: 60, warrantyMonths: 12, weightKg: 0.4, fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], description: "Bluetooth BMS with cell balancing, over-current and thermal protection.", base: 4200, vendors: ["v2", "v5"] },
  { name: "QS 3000W 72V Hub Motor", brand: "QS Motor", category: "Motor", image: img.pt, voltage: 72, warrantyMonths: 18, weightKg: 9, fits: ["revolt-rv400"], description: "Brushless hub motor rated 3kW continuous with hall sensors.", base: 28000, vendors: ["v4", "v5"] },
  { name: "Kelly 72V 80A Controller", brand: "Kelly", category: "Controller", image: img.pt, voltage: 72, warrantyMonths: 12, weightKg: 1.6, fits: ["revolt-rv400"], description: "Programmable sinusoidal controller with regen braking.", base: 9500, vendors: ["v2", "v4"] },
  { name: "Wave Disc Brake Rotor 220mm", brand: "Brembo", category: "Brakes", image: img.pt, warrantyMonths: 6, weightKg: 0.8, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Stainless wave rotor for improved heat dissipation.", base: 2400, vendors: ["v1", "v3", "v6"] },
  { name: "Ather 450X Gen 3 Smart Electric Scooter", brand: "Ather Energy", category: "Electric Bikes", image: scooterImg, voltage: 48, capacityAh: 78, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 150, weightKg: 108, fits: ["ather-450x"], description: "Flagship 450X with Warp Mode, 7-inch TFT touchscreen and IP67 battery pack.", base: 145000, vendors: ["v1", "v6"] },
  { name: "Revolt RV400 Electric Motorcycle", brand: "Revolt Motors", category: "Electric Bikes", image: heroBike, voltage: 72, capacityAh: 60, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 150, weightKg: 115, fits: ["revolt-rv400"], description: "AI-enabled electric performance motorcycle with MyRevolt connectivity and 85 km/h top speed.", base: 139000, vendors: ["v4", "v6"] },
  { name: "Ola S1 Pro Gen 2 Hyperdrive Scooter", brand: "Ola Electric", category: "Electric Bikes", image: scooterImg, voltage: 60, capacityAh: 68, chemistry: "NMC", warrantyMonths: 36, rangeKm: 195, weightKg: 116, fits: ["ola-s1pro"], description: "11kW peak power, 120 km/h top speed, MoveOS 4 navigation and cruise control.", base: 129000, vendors: ["v2", "v5"] },
  { name: "70mai 4K Dual HDR Smart Dashcam with GPS & ADAS", brand: "70mai", category: "Car Accessories", image: img.pt, warrantyMonths: 12, weightKg: 0.6, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Ultra 4K front & 1080P rear HDR dashcam with parking surveillance and night owl vision.", base: 8999, vendors: ["v1", "v2", "v3"] },
  { name: "Digital Fast Tire Inflator 150PSI Auto Cut-Off", brand: "Michelin Auto", category: "Car Accessories", image: img.pt, warrantyMonths: 18, weightKg: 0.8, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "High-precision digital tire inflator for cars, e-bikes and motorcycles with LED torch.", base: 3499, vendors: ["v2", "v4", "v6"] },
  { name: "ChargeMax Level-2 Home EV Wallbox 7.4kW Type-2 AC", brand: "ChargeMax", category: "Car Accessories", image: img.ch, voltage: 230, warrantyMonths: 36, weightKg: 4.5, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "7.4kW single-phase fast wall charger compatible with all Type-2 electric cars and high-capacity e-scooters.", base: 28500, vendors: ["v1", "v3", "v6"] },
  { name: "All-Weather Heavy Duty EV Scooter Cover", brand: "Riderz Armor", category: "Bike Accessories", image: img.pt, warrantyMonths: 12, weightKg: 1.1, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "100% waterproof heat-resistant cover with double-stitched seams and anti-theft lock holes.", base: 1299, vendors: ["v1", "v4", "v5"] },
  { name: "Anti-Theft Disc Brake Lock with 110dB Siren Alarm", brand: "Kovix Security", category: "Bike Accessories", image: img.pt, warrantyMonths: 24, weightKg: 0.5, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Hardened stainless alloy body with motion vibration sensor and waterproof 110dB alarm.", base: 1850, vendors: ["v2", "v3", "v6"] },
  { name: "Waterproof Handlebar Phone Mount with 15W Qi Fast Charging", brand: "Bobo Auto", category: "Bike Accessories", image: img.pt, warrantyMonths: 12, weightKg: 0.35, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Aluminum alloy vibration damper with IP66 wireless fast-charging pad and USB-C port.", base: 2199, vendors: ["v1", "v2", "v5"] },
  { name: "Brembo Ceramic Sintered Brake Pads (Front + Rear)", brand: "Brembo", category: "Spare Parts", image: img.pt, warrantyMonths: 6, weightKg: 0.4, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "hero-vida-v1"], description: "High-friction ceramic sintered brake pads for quiet, fade-free braking.", base: 1650, vendors: ["v1", "v3", "v6"] },
  { name: "Gates Carbon Drive High-Tensile Kevlar Belt", brand: "Gates Auto", category: "Spare Parts", image: img.pt, warrantyMonths: 12, weightKg: 0.3, fits: ["ather-450x", "revolt-rv400"], description: "Polyurethane and carbon tensile cord belt designed for instantaneous EV torque.", base: 4200, vendors: ["v2", "v4", "v6"] },
  { name: "SMK Titan Carbon ECE 22.06 Smart Bluetooth Helmet", brand: "SMK Helmets", category: "Riding Gear & Helmets", image: img.pt, warrantyMonths: 24, weightKg: 1.45, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "ECE 22.06 certified composite carbon fiber shell with integrated Sena Bluetooth speakers and pinlock visor.", base: 11999, vendors: ["v1", "v2", "v6"] },
  { name: "Rynox Air GT4 All-Weather Armored Riding Jacket", brand: "Rynox Gear", category: "Riding Gear & Helmets", image: img.pt, warrantyMonths: 12, weightKg: 1.8, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "CE Level 2 Safe-Tech armors at shoulders, elbows and back with 3D mesh ventilation and rain liner.", base: 7250, vendors: ["v1", "v3", "v4"] },
  { name: "ViaTerra Holeshot Carbon Knuckle Touchscreen Gloves", brand: "ViaTerra Gear", category: "Riding Gear & Helmets", image: img.pt, warrantyMonths: 6, weightKg: 0.25, fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"], description: "Perforated goat skin leather with molded carbon fiber knuckle guards and capacitive smartphone touch fingertips.", base: 2899, vendors: ["v2", "v5", "v6"] },
  { name: "Motul Motocool Expert EV Organic Coolant 1L", brand: "Motul", category: "Spare Parts", image: img.pt, warrantyMonths: 24, weightKg: 1.1, fits: ["ola-s1pro", "ather-450x"], description: "Hybrid organic coolant engineered for electric motor and stator thermal management down to -37°C.", base: 650, vendors: ["v1", "v2", "v3", "v4"] },
];

export const products: Product[] = seeds.map((s, i) => {
  const { base, vendors: vs, ...rest } = s;
  return {
    ...rest,
    id: `p${i + 1}`,
    offers: vs.map((v, j) => ({ vendorId: v, price: Math.round(base * (1 + (j - 1) * 0.04) / 10) * 10, stock: ((i + j) * 7) % 23 })),
  };
});

export const riders: Rider[] = [
  { id: "r1", name: "Ravi Kumar", phone: "+91 98450 12345", vehicle: "Ather Rizta", plate: "KA 01 EV 4521", rating: 4.9, avatar: "RK" },
  { id: "r2", name: "Salma Begum", phone: "+91 99000 54321", vehicle: "TVS iQube", plate: "KA 03 EV 1180", rating: 4.8, avatar: "SB" },
];

import { getCatalogueProduct, getCatalogueVendor } from "./catalogue";

export const getVendor = (id: string): Vendor => {
  const dynamic = getCatalogueVendor(id);
  if (dynamic) return dynamic;
  return vendors.find((v) => v.id === id) || vendors[0];
};

export const getProduct = (id: string): Product | undefined => {
  return getCatalogueProduct(id);
};
export const getBike = (id: string) => bikes.find((b) => b.id === id);
export const bestOffer = (p: Product) => [...p.offers].sort((a, b) => a.price - b.price)[0];

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
