import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import charger from "@/assets/charger.jpg";
import parts from "@/assets/parts.jpg";

import heroBike from "@/assets/hero-bike.jpg";
import scooterImg from "@/assets/scooter.jpg";
import catalog from "@/data/accessory_catalog.json";
import vehicleCatalog from "../../web/data/ev_two_wheeler_catalog.json";
import demoProductsJson from "../../database/demo_products.json";

export type Bike = { id: string; make: string; model: string; years: number[]; voltage: number; wmi: string };
export type Car = { id: string; make: string; model: string; years: number[]; batteryKWh?: number };

export type VendorOffer = {
  vendorId: string;
  price: number;
  stock: number;
  mrp?: number;
  condition?: "new" | "refurbished";
  warrantyMonths?: number;
  warrantyTerms?: string;
  shippingCharge?: number;
  dispatchHours?: number;
  deliveryDays?: string;
  status?: "active" | "paused" | "out_of_stock";
};

export type Vendor = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  prepMins: number;
  reviewCount?: number;
  isVerified?: boolean;
  verificationBadge?: string;
  description?: string;
  deliveryCoverage?: string;
  businessHours?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  commissionRate?: number;
};

export type ProductReview = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userCity?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  fitmentVehicle?: string;
  isVerifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
  status: "published" | "pending" | "rejected";
};

export type VendorReview = {
  id: string;
  vendorId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  packagingRating?: number;
  deliveryRating?: number;
  communicationRating?: number;
  comment: string;
  orderId?: string;
  isVerifiedPurchase: boolean;
  date: string;
  status: "published" | "pending" | "rejected";
};

export type VendorSettlement = {
  id: string;
  vendorId: string;
  vendorName: string;
  period: string;
  orderCount: number;
  grossSales: number;
  commissionRate: number;
  commissionAmount: number;
  shippingFee: number;
  netPayout: number;
  status: "Pending" | "Processing" | "Paid";
  payoutDate?: string;
  referenceNumber?: string;
};

export type VendorApplication = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  area: string;
  city: string;
  primaryCategories: string[];
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
};

export type Category =
  | "Battery"
  | "Charger"
  | "BMS"
  | "Motor"
  | "Controller"
  | "Brakes"
  | "Accessory"
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
  imageFallback?: string;
  voltage?: number;
  capacityAh?: number;
  batteryCapacityKwh?: number;
  batterySpec?: string;
  chemistry?: string;
  warrantyMonths: number;
  rangeKm?: number;
  weightKg: number;
  fits: string[]; // bike or car ids
  description: string;
  offers: VendorOffer[];
  vehicleType?: "bike" | "car" | "both" | "universal" | string;
  department?: string;
  availability?: string;
  priceType?: string;
  isAccessory?: boolean;
  accessoryDetails?: {
    type?: string;
    material?: string;
    mounting?: string;
    powerRating?: string;
  };
  verificationStatus?: "pending_approval" | "approved" | "rejected";
  variantModel?: string;
  material?: string;
  fitmentSize?: string;
  colorOptions?: string[];
  discountPercent?: number;
  moq?: number;
  supplier?: string;
  sku?: string;
  mrp?: number;
};
export type Rider = { id: string; name: string; phone: string; vehicle: string; plate: string; rating: number; avatar: string };

export const CUSTOMER_LOCATION = { lat: 12.9716, lng: 77.5946, label: "MG Road, Bengaluru" };

export type LocationArea = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  pincode?: string;
  tag?: string;
  isPopular?: boolean;
};

export const DEFAULT_LOCATION: LocationArea = {
  id: "indiranagar",
  name: "Indiranagar",
  city: "Bengaluru",
  lat: 12.9784,
  lng: 77.6408,
  pincode: "560038",
  tag: "Central-East Hub",
  isPopular: true,
};

export const POPULAR_LOCATIONS: LocationArea[] = [
  { id: "indiranagar", name: "Indiranagar", city: "Bengaluru", lat: 12.9784, lng: 77.6408, pincode: "560038", tag: "Central-East", isPopular: true },
  { id: "koramangala", name: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245, pincode: "560034", tag: "South-East", isPopular: true },
  { id: "mg-road", name: "MG Road / CBD", city: "Bengaluru", lat: 12.9716, lng: 77.5946, pincode: "560001", tag: "Central CBD", isPopular: true },
  { id: "jayanagar", name: "Jayanagar", city: "Bengaluru", lat: 12.9250, lng: 77.5938, pincode: "560011", tag: "South Hub", isPopular: true },
  { id: "whitefield", name: "Whitefield", city: "Bengaluru", lat: 12.9698, lng: 77.7500, pincode: "560066", tag: "East Tech Hub", isPopular: true },
  { id: "malleshwaram", name: "Malleshwaram", city: "Bengaluru", lat: 13.0035, lng: 77.5709, pincode: "560003", tag: "North-West", isPopular: true },
  { id: "hebbal", name: "Hebbal", city: "Bengaluru", lat: 13.0358, lng: 77.5970, pincode: "560024", tag: "North Hub", isPopular: true },
  { id: "hsr-layout", name: "HSR Layout", city: "Bengaluru", lat: 12.9121, lng: 77.6446, pincode: "560102", tag: "South-East", isPopular: true },
  { id: "bellandur", name: "Bellandur / Green Glen", city: "Bengaluru", lat: 12.9304, lng: 77.6784, pincode: "560103", tag: "Outer Ring Rd", isPopular: true },
  { id: "electronic-city", name: "Electronic City Phase 1", city: "Bengaluru", lat: 12.8399, lng: 77.6770, pincode: "560100", tag: "South Tech Corridor", isPopular: false },
  { id: "rajajinagar", name: "Rajajinagar", city: "Bengaluru", lat: 12.9982, lng: 77.5530, pincode: "560010", tag: "West Commercial", isPopular: false },
  { id: "banashankari", name: "Banashankari", city: "Bengaluru", lat: 12.9150, lng: 77.5736, pincode: "560070", tag: "South Corridor", isPopular: false },
  { id: "marathahalli", name: "Marathahalli", city: "Bengaluru", lat: 12.9591, lng: 77.6974, pincode: "560037", tag: "East Junction", isPopular: false },
  { id: "yelahanka", name: "Yelahanka", city: "Bengaluru", lat: 13.1007, lng: 77.5963, pincode: "560064", tag: "North Suburbs", isPopular: false },
];

export const bikes: Bike[] = [
  { id: "ather-450x", make: "Ather", model: "450X", years: [2021, 2022, 2023, 2024, 2025], voltage: 48, wmi: "MD9" },
  { id: "ola-s1pro", make: "Ola", model: "S1 Pro", years: [2022, 2023, 2024, 2025], voltage: 60, wmi: "P6R" },
  { id: "tvs-iqube", make: "TVS", model: "iQube S", years: [2021, 2022, 2023, 2024], voltage: 48, wmi: "MD6" },
  { id: "bajaj-chetak", make: "Bajaj", model: "Chetak", years: [2020, 2021, 2022, 2023, 2024, 2025], voltage: 60, wmi: "MD2" },
  { id: "revolt-rv400", make: "Revolt", model: "RV400", years: [2020, 2021, 2022, 2023, 2024], voltage: 72, wmi: "MCR" },
  { id: "hero-vida-v1", make: "Hero", model: "Vida V1", years: [2023, 2024, 2025], voltage: 60, wmi: "MBL" },
];

export const cars: Car[] = [
  { id: "tata-nexon-ev", make: "Tata", model: "Nexon.ev", years: [2021, 2022, 2023, 2024, 2025], batteryKWh: 40.5 },
  { id: "tata-tiago-ev", make: "Tata", model: "Tiago.ev", years: [2022, 2023, 2024, 2025], batteryKWh: 24 },
  { id: "mg-zs-ev", make: "MG", model: "ZS EV", years: [2020, 2021, 2022, 2023, 2024, 2025], batteryKWh: 50.3 },
  { id: "mahindra-xuv400", make: "Mahindra", model: "XUV400 EV", years: [2023, 2024, 2025], batteryKWh: 39.4 },
  { id: "hyundai-ioniq5", make: "Hyundai", model: "Ioniq 5", years: [2023, 2024, 2025], batteryKWh: 72.6 },
  { id: "byd-atto3", make: "BYD", model: "Atto 3", years: [2022, 2023, 2024, 2025], batteryKWh: 60.48 },
];

export const vendors: Vendor[] = [
  { id: "v1", name: "VoltHub Indiranagar", area: "Indiranagar", lat: 12.9784, lng: 77.6408, rating: 4.8, prepMins: 15 },
  { id: "v2", name: "ChargeKart Koramangala", area: "Koramangala", lat: 12.9352, lng: 77.6245, rating: 4.6, prepMins: 20 },
  { id: "v3", name: "EV Spares Jayanagar", area: "Jayanagar", lat: 12.925, lng: 77.5938, rating: 4.5, prepMins: 25 },
  { id: "v4", name: "Ampere Auto Hebbal", area: "Hebbal", lat: 13.0358, lng: 77.597, rating: 4.7, prepMins: 15 },
  { id: "v5", name: "GreenWheels Whitefield", area: "Whitefield", lat: 12.9698, lng: 77.75, rating: 4.4, prepMins: 30 },
  { id: "v6", name: "Riderz Dealer Malleshwaram", area: "Malleshwaram", lat: 13.0035, lng: 77.5709, rating: 4.9, prepMins: 10 },
  {
    id: "usr_seller_qbit",
    name: "Qbit Pro",
    area: "Sector 63, Noida",
    lat: 28.628,
    lng: 77.378,
    rating: 4.8,
    reviewCount: 142,
    prepMins: 20,
    isVerified: true,
    verificationBadge: "Verified Seller · Noida Hub",
    description: "Official authorized dealer & distributor for Blaupunkt, Recoil, and Riderzpro car accessories.",
    deliveryCoverage: "Delhi NCR & Pan India",
    businessHours: "Mon-Sat: 09:30 AM - 07:00 PM",
    phone: "+91 120 456 7890",
    email: "support@qbitpro.com",
    address: "H-Block, Sector 63, Noida, Uttar Pradesh 201301",
    gstin: "09AAACQ1234F1Z5",
    shippingPolicy: "Ships from Noida. Same-day dispatch for Delhi NCR orders.",
    returnPolicy: "10-day replacement warranty.",
    commissionRate: 0.08,
  },
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
  { name: "Ather 450X Gen 3 Smart Electric Scooter", brand: "Ather Energy", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/196337/450x-right-side-view-2.png?isig=0&q=90", voltage: 48, capacityAh: 78, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 150, weightKg: 108, fits: ["ather-450x"], description: "Flagship 450X with Warp Mode, 7-inch TFT touchscreen and IP67 battery pack.", base: 145000, vendors: ["v1", "v6"] },
  { name: "Ather Konarc", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/209108/konarc-right-side-view-16.jpeg?isig=0&q=90", warrantyMonths: 0, weightKg: 0, fits: [], description: "Starting ex-showroom price from the supplied catalog; city and variant pricing may differ.", base: 99999, vendors: ["v1", "v6"] },
  { name: "Ather 450", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/196337/450x-right-side-view-2.png?isig=0&q=90", warrantyMonths: 0, weightKg: 0, fits: [], description: "Starting ex-showroom price from the supplied catalog; confirm the selected battery and city price.", base: 135999, vendors: ["v1", "v6"] },
  { name: "Ather Rizta", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/168965/rizta-right-side-view-4.png?isig=0&q=90", warrantyMonths: 0, weightKg: 0, fits: [], description: "Rizta S starting ex-showroom price from the supplied catalog; other variants are priced separately.", base: 121999, vendors: ["v1", "v6"] },
  { name: "Ather 450S", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/149605/450s-right-side-view-2.png?isig=0&q=90", warrantyMonths: 0, rangeKm: 161, weightKg: 0, fits: [], description: "Starting ex-showroom listing price; verify current price and availability with a dealer. Claimed range: 161 km. Top speed: 90 km/h. Charging time: 5.15 hours.", base: 127888, vendors: ["v1", "v6"] },
  { name: "Ather 450 Apex", brand: "Ather", category: "Electric Bikes", vehicleType: "bike", image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/167915/450-apex-right-side-view.png?isig=0&q=90", warrantyMonths: 0, rangeKm: 165, weightKg: 0, fits: [], description: "Starting ex-showroom listing price; verify current price and availability with a dealer. Claimed range: 165 km. Top speed: 100 km/h. Charging time: 5.15 hours.", base: 194946, vendors: ["v1", "v6"] },
  { name: "TVS iQube 2.3 kWh", brand: "TVS", category: "Electric Bikes", vehicleType: "bike", image: "https://www.tvsmotor.com/electric-scooters/tvs-iqube/-/media/Vehicles/Feature/Iqube/Variant/Comparison/23new.webp?h=820&la=en&w=1200", voltage: 52, capacityAh: 44, chemistry: "Li-ion", warrantyMonths: 36, rangeKm: 114, weightKg: 109, fits: [], description: "TVS iQube electric scooter with 2.3 kWh battery and up to 114 km IDC range. Price and availability can vary by city.", base: 116310, vendors: ["v2", "v6"] },
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
    mrp: Math.round(base * 1.15),
    offers: vs.map((v, j) => {
      const diffPct = (j - 1) * 0.035;
      const offerPrice = Math.round((base * (1 + diffPct)) / 10) * 10;
      const offerMrp = Math.round(offerPrice * 1.15);
      return {
        vendorId: v,
        price: offerPrice,
        mrp: offerMrp,
        stock: Math.max(3, ((i + j) * 7) % 24),
        condition: "new" as const,
        warrantyMonths: rest.warrantyMonths,
        warrantyTerms: `${rest.warrantyMonths} Months Manufacturer Warranty`,
        dispatchHours: v === "v6" ? 1 : v === "v1" ? 2 : 4,
        deliveryDays: v === "v6" ? "Express (15-30m)" : "Same-day",
        status: "active" as const,
      };
    }),
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

function higherResolutionBikeImage(url: string): string {
  return url
    .replace(/\/272x153\//, "/1280x720/")
    .replace(/\/0x0\//, "/1280x720/")
    .replace(/([?&]q=)80\b/, (_match, prefix: string) => `${prefix}90`);
}

const uploadedBrandProducts: Product[] = vehicleCatalog.products
  .filter((item) => requestedVehicleBrands.has(item.brand) && !(item.brand === "Revolt" && item.model === "RV400"))
  .map((item, index) => {
    const variant = item.variant && !["Base", "Base / listing entry"].includes(item.variant) ? ` ${item.variant}` : "";
    const battery = verifiedBatterySpecs[item.id] ?? {};
    const sourceImage = typeof item.image_url === "string" ? item.image_url : "";
    const image = higherResolutionBikeImage(sourceImage);
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
      image,
      ...(image !== sourceImage ? { imageFallback: sourceImage } : {}),
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

export const demoCatalogProducts: Product[] = ((demoProductsJson as any[]) || []).map((p) => {
  const basePrice = Number(p.price) || 0;
  const mrpPrice = Number(p.mrp) || Math.round(basePrice * 1.15);
  const primaryImage = (Array.isArray(p.image_urls) && p.image_urls[0]) || p.image_url || "";
  const sellerId = p.seller_id || "usr_seller_qbit";
  const stock = Number(p.stock) || 0;

  return {
    id: p.id,
    name: p.name,
    brand: p.brand || "Riderzpro",
    category: p.category || p.category_name || "Car Accessories",
    subcategory: p.department || p.category || "Accessories",
    subcategories: [p.category, p.department, ...(p.features || [])].filter(Boolean),
    vehicleType: (p.vehicle_type as any) || "car",
    image: primaryImage,
    warrantyMonths: typeof p.warranty === "string" ? (parseInt(p.warranty) || 12) : 12,
    weightKg: Number(p.weight_kg) || 1,
    fits: Array.isArray(p.compatible_vehicles) ? p.compatible_vehicles : ["universal"],
    description: p.description || "",
    mrp: mrpPrice,
    sku: p.sku,
    offers: [
      {
        vendorId: sellerId,
        price: basePrice,
        mrp: mrpPrice,
        stock: stock,
        condition: "new" as const,
        warrantyMonths: typeof p.warranty === "string" ? (parseInt(p.warranty) || 12) : 12,
        warrantyTerms: p.warranty || "2 Years Manufacturer Warranty",
        shippingCharge: 0,
        dispatchHours: 2,
        deliveryDays: "Tomorrow",
        status: stock > 0 ? "active" : "out_of_stock",
      },
    ],
  };
});

export const products: Product[] = [...demoCatalogProducts, ...coreProducts, ...uploadedBrandProducts, ...catalogProducts];

export const riders: Rider[] = [
  { id: "r1", name: "Ravi Kumar", phone: "+91 98450 12345", vehicle: "Ather Rizta", plate: "KA 01 EV 4521", rating: 4.9, avatar: "RK" },
  { id: "r2", name: "Salma Begum", phone: "+91 99000 54321", vehicle: "TVS iQube", plate: "KA 03 EV 1180", rating: 4.8, avatar: "SB" },
];

import { getCatalogueProduct, getCatalogueVendor } from "./catalogue";

// Initial Verified Product Reviews
export const initialProductReviews: ProductReview[] = [];

// Initial Verified Vendor / Shop Reviews
export const initialVendorReviews: VendorReview[] = [];

// Initial Vendor Settlements Ledger
export const initialVendorSettlements: VendorSettlement[] = [];

// Initial Vendor Applications for Admin Approval
export const initialVendorApplications: VendorApplication[] = [];

let globalProductReviews = [...initialProductReviews];
let globalVendorReviews = [...initialVendorReviews];
let globalVendorSettlements = [...initialVendorSettlements];
let globalVendorApplications = [...initialVendorApplications];

export function getProductReviews(productId: string): ProductReview[] {
  return globalProductReviews.filter((r) => r.productId === productId && r.status === "published");
}

export function getAllProductReviews(): ProductReview[] {
  return globalProductReviews;
}

export function addProductReview(review: Omit<ProductReview, "id" | "date" | "helpfulCount" | "status">): ProductReview {
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: "Just now",
    helpfulCount: 0,
    status: "published",
  };
  globalProductReviews = [newRev, ...globalProductReviews];
  return newRev;
}

export function getVendorReviews(vendorId: string): VendorReview[] {
  return globalVendorReviews.filter((r) => r.vendorId === vendorId && r.status === "published");
}

export function getAllVendorReviews(): VendorReview[] {
  return globalVendorReviews;
}

export function addVendorReview(review: Omit<VendorReview, "id" | "date" | "status">): VendorReview {
  const newRev: VendorReview = {
    ...review,
    id: `vrev-${Date.now()}`,
    date: "Just now",
    status: "published",
  };
  globalVendorReviews = [newRev, ...globalVendorReviews];
  return newRev;
}

export function getVendorSettlements(vendorId?: string): VendorSettlement[] {
  if (vendorId) return globalVendorSettlements.filter((s) => s.vendorId === vendorId);
  return globalVendorSettlements;
}

export function getVendorApplications(): VendorApplication[] {
  return globalVendorApplications;
}

export function updateVendorApplicationStatus(id: string, status: "approved" | "rejected") {
  globalVendorApplications = globalVendorApplications.map((a) => (a.id === id ? { ...a, status } : a));
}

export function getOffersForProduct(productId: string): (VendorOffer & { vendor: Vendor })[] {
  const p = products.find((prod) => prod.id === productId);
  if (!p || !p.offers) return [];
  return p.offers.map((offer) => ({
    ...offer,
    vendor: getVendor(offer.vendorId),
  }));
}

export function getVendorOffers(vendorId: string): { product: Product; offer: VendorOffer }[] {
  const results: { product: Product; offer: VendorOffer }[] = [];
  products.forEach((prod) => {
    const offer = prod.offers?.find((o) => o.vendorId === vendorId);
    if (offer) {
      results.push({ product: prod, offer });
    }
  });
  return results;
}

export const getVendor = (id: string): Vendor => {
  if (id === "usr_seller_qbit") {
    return (
      vendors.find((v) => v.id === "usr_seller_qbit") || {
        id: "usr_seller_qbit",
        name: "Qbit Pro",
        area: "Sector 63, Noida",
        lat: 28.628,
        lng: 77.378,
        rating: 4.8,
        prepMins: 20,
        reviewCount: 142,
        isVerified: true,
        verificationBadge: "Verified Seller · Noida Hub",
      }
    );
  }
  const dynamic = getCatalogueVendor(id);
  if (dynamic) return dynamic;
  return (
    vendors.find((v) => v.id === id) || {
      id: id || "v1",
      name: "Riderzpro Certified",
      area: "Bengaluru",
      lat: 12.9784,
      lng: 77.6408,
      rating: 4.9,
      reviewCount: 150,
      prepMins: 15,
      isVerified: true,
      verificationBadge: "Official Marketplace Partner",
      description: "Official authorized dealer on RiderzPro marketplace.",
      deliveryCoverage: "All Bengaluru",
      businessHours: "Mon-Sat: 09:00 AM - 08:00 PM",
      phone: "+91 80 4000 1122",
      email: "support@riderzpro.com",
      address: "MG Road, Bengaluru 560001",
      gstin: "29AABCR0000Z1Z0",
      shippingPolicy: "Express delivery across city.",
      returnPolicy: "7-day replacement warranty.",
      commissionRate: 0.1,
    }
  );
};

export const getProduct = (id: string): Product | undefined => {
  return (
    demoCatalogProducts.find((p) => p.id === id) ||
    getCatalogueProduct(id) ||
    products.find((p) => p.id === id)
  );
};

export function mapDbProductToProduct(row: any): Product {
  let primaryImg = parts;
  if (row.image_url) {
    try {
      if (typeof row.image_url === "string" && row.image_url.startsWith("[")) {
        const arr = JSON.parse(row.image_url);
        primaryImg = arr[0] || primaryImg;
      } else if (typeof row.image_url === "string") {
        primaryImg = row.image_url;
      }
    } catch {
      primaryImg = row.image_url;
    }
  }

  let fitsArr: string[] = ["universal"];
  if (row.compatible_vehicles) {
    fitsArr = Array.isArray(row.compatible_vehicles)
      ? row.compatible_vehicles
      : [row.compatible_vehicles];
  }

  const offerPrice = Number(row.price) || 0;
  const mrpPrice = Number(row.mrp) || Math.round(offerPrice * 1.15);
  const voltMatch = row.description?.match(/(\d+)V/i)?.[1];

  return {
    id: row.id,
    name: row.name,
    brand: row.brand || "Riderzpro Certified",
    category: (row.category_name as any) || "Car Accessories",
    image: primaryImg,
    warrantyMonths: row.warranty?.includes("year") ? 12 : 6,
    weightKg: Number(row.weight_kg) || 2,
    fits: fitsArr,
    description: row.description || "",
    voltage: voltMatch ? Number(voltMatch) : undefined,
    mrp: mrpPrice,
    offers: [
      {
        vendorId: row.seller_id || "v1",
        price: offerPrice,
        stock: Number(row.stock) || 0,
      },
    ],
    verificationStatus: row.verification_status || "approved",
    sku: row.sku,
    variantModel: row.variant_model,
    vehicleType: row.vehicle_type || (row.category_name?.toLowerCase().includes("car") ? "car" : "universal"),
    department: row.department || undefined,
    availability: row.availability || undefined,
    priceType: row.price_type || undefined,
  };
}

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
  if (km > 100) return 0; // FREE Delivery on express courier
  return Math.round(DELIVERY_BASE + km * DELIVERY_PER_KM);
}
export function etaMinutes(km: number, prepMins: number) {
  if (km > 100) return 1440; // Next-day delivery (24 hrs)
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
