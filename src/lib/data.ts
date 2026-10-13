import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import charger from "@/assets/charger.jpg";
import parts from "@/assets/parts.jpg";

import heroBike from "@/assets/hero-bike.jpg";
import scooterImg from "@/assets/scooter.jpg";

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
  {
    id: "v1",
    name: "VoltHub Indiranagar",
    area: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    rating: 4.8,
    reviewCount: 342,
    prepMins: 15,
    isVerified: true,
    verificationBadge: "RiderzPro Platinum Partner",
    description: "Specialized in high-density Li-ion battery modules, Type-2 fast chargers, and smart performance parts with factory warranties.",
    deliveryCoverage: "Indiranagar, Domlur, HAL, MG Road, CBD (12km radius)",
    businessHours: "Mon - Sat: 9:00 AM - 8:30 PM",
    phone: "+91 80 4122 8900",
    email: "orders@volthub.in",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    gstin: "29AABCV1234F1Z5",
    shippingPolicy: "Dispatch within 1-2 hours. Free shipping over ₹2,000.",
    returnPolicy: "7-day replacement warranty for manufacturing defects.",
    commissionRate: 0.10,
  },
  {
    id: "v2",
    name: "ChargeKart Koramangala",
    area: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    rating: 4.6,
    reviewCount: 218,
    prepMins: 20,
    isVerified: true,
    verificationBadge: "RiderzPro Verified Partner",
    description: "Premium EV wallboxes, portable chargers, motor controllers, and smart digital accessories for all two-wheelers and cars.",
    deliveryCoverage: "Koramangala, HSR Layout, BTM Layout, Bellandur (10km radius)",
    businessHours: "Mon - Sat: 9:30 AM - 9:00 PM",
    phone: "+91 80 4910 2211",
    email: "support@chargekart.co",
    address: "80 Feet Rd, 4th Block, Koramangala, Bengaluru 560034",
    gstin: "29AABCK5678B2Z1",
    shippingPolicy: "Same-day express dispatch across South Bengaluru.",
    returnPolicy: "10-day replacement on electrical hardware.",
    commissionRate: 0.08,
  },
  {
    id: "v3",
    name: "EV Spares Jayanagar",
    area: "Jayanagar",
    lat: 12.925,
    lng: 77.5938,
    rating: 4.5,
    reviewCount: 184,
    prepMins: 25,
    isVerified: true,
    verificationBadge: "RiderzPro Verified Partner",
    description: "OEM brake discs, ceramic pads, Kevlar drive belts, coolants and replacement mechanical components.",
    deliveryCoverage: "Jayanagar, JP Nagar, Banashankari, Basavanagudi (12km radius)",
    businessHours: "Mon - Sat: 10:00 AM - 8:00 PM",
    phone: "+91 80 2654 3322",
    email: "spares@evsparesjnr.in",
    address: "11th Main, 4th Block, Jayanagar, Bengaluru 560011",
    gstin: "29AABCE9876C3Z8",
    shippingPolicy: "Careful bubble & anti-shock packaging for fragile parts.",
    returnPolicy: "7-day fitment return guarantee.",
    commissionRate: 0.09,
  },
  {
    id: "v4",
    name: "Ampere Auto Hebbal",
    area: "Hebbal",
    lat: 13.0358,
    lng: 77.597,
    rating: 4.7,
    reviewCount: 156,
    prepMins: 15,
    isVerified: true,
    verificationBadge: "RiderzPro Verified Partner",
    description: "Performance BLDC hub motors, heavy-duty LiFePO4 modules, and commercial fleet battery packs.",
    deliveryCoverage: "Hebbal, RT Nagar, Yelahanka, Sahakarnagar (15km radius)",
    businessHours: "Mon - Sat: 9:00 AM - 7:30 PM",
    phone: "+91 80 2363 4455",
    email: "care@ampereauto.com",
    address: "Bellary Road, Hebbal Flyover, Bengaluru 560024",
    gstin: "29AABCA4321D4Z2",
    shippingPolicy: "Heavy item insured pallet shipping with tracking.",
    returnPolicy: "Manufacturer on-site warranty support.",
    commissionRate: 0.10,
  },
  {
    id: "v5",
    name: "GreenWheels Whitefield",
    area: "Whitefield",
    lat: 12.9698,
    lng: 77.75,
    rating: 4.4,
    reviewCount: 129,
    prepMins: 30,
    isVerified: true,
    verificationBadge: "RiderzPro Verified Partner",
    description: "Certified riding gear, smart dashcams, anti-theft alarms, phone mounts, and waterproof scooter covers.",
    deliveryCoverage: "Whitefield, Marathahalli, Kadugodi, Hoodi (14km radius)",
    businessHours: "Mon - Sun: 10:00 AM - 9:00 PM",
    phone: "+91 80 6789 5566",
    email: "contact@greenwheels.in",
    address: "ITPL Main Road, Whitefield, Bengaluru 560066",
    gstin: "29AABCG8765E5Z9",
    shippingPolicy: "Standard courier & 90-minute hyperlocal delivery.",
    returnPolicy: "Exchange within 7 days for size/fitment.",
    commissionRate: 0.08,
  },
  {
    id: "v6",
    name: "Riderz Dealer Malleshwaram",
    area: "Malleshwaram",
    lat: 13.0035,
    lng: 77.5709,
    rating: 4.9,
    reviewCount: 412,
    prepMins: 10,
    isVerified: true,
    verificationBadge: "RiderzPro Flagship Dealer",
    description: "Official RiderzPro showroom & regional fulfillment center. Electric bikes, batteries, chargers, and priority delivery.",
    deliveryCoverage: "Malleshwaram, Rajajinagar, Yeshwanthpur, Sadashivanagar (15km radius)",
    businessHours: "Mon - Sun: 8:30 AM - 9:30 PM",
    phone: "+91 80 2334 7788",
    email: "malleshwaram@riderzpro.com",
    address: "Sampige Road, 8th Cross, Malleshwaram, Bengaluru 560003",
    gstin: "29AABCR1122F6Z4",
    shippingPolicy: "Ultra-fast dispatch in under 15 minutes with live courier assignment.",
    returnPolicy: "Instant 7-day doorstep replacement or refund.",
    commissionRate: 0.05,
  },
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

export const riders: Rider[] = [
  { id: "r1", name: "Ravi Kumar", phone: "+91 98450 12345", vehicle: "Ather Rizta", plate: "KA 01 EV 4521", rating: 4.9, avatar: "RK" },
  { id: "r2", name: "Salma Begum", phone: "+91 99000 54321", vehicle: "TVS iQube", plate: "KA 03 EV 1180", rating: 4.8, avatar: "SB" },
];

// Initial Verified Product Reviews
export const initialProductReviews: ProductReview[] = [
  {
    id: "rev-p1-1",
    productId: "p1",
    userId: "usr-101",
    userName: "Vikram Shenoy",
    userCity: "Bengaluru",
    rating: 5,
    title: "Incredible battery life & perfect fit on Ola S1 Pro",
    comment: "Installed this VoltRide 60V 30Ah pack 2 months ago. Getting consistently 105+ km in normal mode. Fast charging works without any heating issues. Seller Indiranagar VoltHub provided prompt dispatch.",
    fitmentVehicle: "Ola S1 Pro",
    isVerifiedPurchase: true,
    date: "14 days ago",
    helpfulCount: 24,
    status: "published",
  },
  {
    id: "rev-p1-2",
    productId: "p1",
    userId: "usr-102",
    userName: "Deepak Menon",
    userCity: "Mysuru",
    rating: 4,
    title: "High quality build with CAN communication",
    comment: "Solid IP67 casing. Connectors mated seamlessly with the harness. Cell balancing was within 8mV right out of the box. Highly recommended.",
    fitmentVehicle: "Bajaj Chetak",
    isVerifiedPurchase: true,
    date: "1 month ago",
    helpfulCount: 15,
    status: "published",
  },
  {
    id: "rev-p2-1",
    productId: "p2",
    userId: "usr-103",
    userName: "Pooja Hegde",
    userCity: "Bengaluru",
    rating: 5,
    title: "Safest battery choice for daily commute",
    comment: "LiFePO4 gives peace of mind during hot summers. True 3000 cycle rating. Heavy weight compared to NMC but the thermal stability is totally worth it.",
    fitmentVehicle: "Ather 450X",
    isVerifiedPurchase: true,
    date: "3 weeks ago",
    helpfulCount: 18,
    status: "published",
  },
  {
    id: "rev-p10-1",
    productId: "p10",
    userId: "usr-104",
    userName: "Rohit Deshmukh",
    userCity: "Bengaluru",
    rating: 5,
    title: "Genuine Ather 450X experience with Warp mode",
    comment: "Delivery was arranged within 45 minutes by Riderz Dealer Malleshwaram. Scooter runs buttery smooth, touchscreen dashboard is snappy. Absolutely loving the acceleration.",
    fitmentVehicle: "Ather 450X Gen 3",
    isVerifiedPurchase: true,
    date: "5 days ago",
    helpfulCount: 31,
    status: "published",
  },
  {
    id: "rev-p13-1",
    productId: "p13",
    userId: "usr-105",
    userName: "Suresh Nambiar",
    userCity: "Bengaluru",
    rating: 5,
    title: "Crisp 4K video and accurate ADAS warnings",
    comment: "Dashcam records exceptional license plate details even at night. Wiring kit was included. Seller packed it securely.",
    fitmentVehicle: "Tata Nexon.ev",
    isVerifiedPurchase: true,
    date: "2 weeks ago",
    helpfulCount: 12,
    status: "published",
  },
  {
    id: "rev-p19-1",
    productId: "p19",
    userId: "usr-106",
    userName: "Karthik Raj",
    userCity: "Bengaluru",
    rating: 5,
    title: "Zero brake fade and silent stopping",
    comment: "Installed front Brembo ceramic pads on my S1 Pro. Immediate bite improvement without squeaking. Worth every rupee.",
    fitmentVehicle: "Ola S1 Pro",
    isVerifiedPurchase: true,
    date: "1 week ago",
    helpfulCount: 9,
    status: "published",
  },
];

// Initial Verified Vendor / Shop Reviews
export const initialVendorReviews: VendorReview[] = [
  {
    id: "vrev-1",
    vendorId: "v1",
    userId: "usr-201",
    userName: "Aditya Rao",
    rating: 5,
    packagingRating: 5,
    deliveryRating: 5,
    communicationRating: 5,
    comment: "VoltHub Indiranagar is top-notch. Dispatched my battery order within 20 minutes, battery arrived in reinforced crate with test report.",
    orderId: "ORD-9201",
    isVerifiedPurchase: true,
    date: "10 days ago",
    status: "published",
  },
  {
    id: "vrev-2",
    vendorId: "v1",
    userId: "usr-202",
    userName: "Manish Verma",
    rating: 4,
    packagingRating: 5,
    deliveryRating: 4,
    communicationRating: 5,
    comment: "Very helpful team over phone when confirming vehicle compatibility before dispatch. Will buy again.",
    orderId: "ORD-8942",
    isVerifiedPurchase: true,
    date: "3 weeks ago",
    status: "published",
  },
  {
    id: "vrev-3",
    vendorId: "v6",
    userId: "usr-203",
    userName: "Sneha Nair",
    rating: 5,
    packagingRating: 5,
    deliveryRating: 5,
    communicationRating: 5,
    comment: "Malleshwaram flagship dealer is unbeatable. Rider was assigned in 3 minutes and package reached me before expected time.",
    orderId: "ORD-9411",
    isVerifiedPurchase: true,
    date: "4 days ago",
    status: "published",
  },
  {
    id: "vrev-4",
    vendorId: "v2",
    userId: "usr-204",
    userName: "Gautam Iyer",
    rating: 4,
    packagingRating: 4,
    deliveryRating: 4,
    communicationRating: 5,
    comment: "ChargeKart Koramangala explained installation steps for wallbox charger clearly. Prompt service.",
    orderId: "ORD-8812",
    isVerifiedPurchase: true,
    date: "1 month ago",
    status: "published",
  },
  {
    id: "vrev-5",
    vendorId: "v3",
    userId: "usr-205",
    userName: "Harish Gowda",
    rating: 5,
    packagingRating: 5,
    deliveryRating: 4,
    communicationRating: 5,
    comment: "EV Spares Jayanagar stock only genuine OEM components. Brake rotors were precision machined.",
    orderId: "ORD-9022",
    isVerifiedPurchase: true,
    date: "2 weeks ago",
    status: "published",
  },
];

// Initial Vendor Settlements Ledger
export const initialVendorSettlements: VendorSettlement[] = [
  {
    id: "set-001",
    vendorId: "v1",
    vendorName: "VoltHub Indiranagar",
    period: "Oct 1 - Oct 7, 2026",
    orderCount: 28,
    grossSales: 342000,
    commissionRate: 0.10,
    commissionAmount: 34200,
    shippingFee: 2150,
    netPayout: 309950,
    status: "Paid",
    payoutDate: "Oct 8, 2026",
    referenceNumber: "NEFT-HDFC-99182371",
  },
  {
    id: "set-002",
    vendorId: "v6",
    vendorName: "Riderz Dealer Malleshwaram",
    period: "Oct 1 - Oct 7, 2026",
    orderCount: 42,
    grossSales: 618000,
    commissionRate: 0.05,
    commissionAmount: 30900,
    shippingFee: 3400,
    netPayout: 590500,
    status: "Paid",
    payoutDate: "Oct 8, 2026",
    referenceNumber: "NEFT-ICIC-44128910",
  },
  {
    id: "set-003",
    vendorId: "v2",
    vendorName: "ChargeKart Koramangala",
    period: "Oct 1 - Oct 7, 2026",
    orderCount: 19,
    grossSales: 184500,
    commissionRate: 0.08,
    commissionAmount: 14760,
    shippingFee: 1520,
    netPayout: 171260,
    status: "Paid",
    payoutDate: "Oct 8, 2026",
    referenceNumber: "NEFT-SBIN-88231012",
  },
  {
    id: "set-004",
    vendorId: "v1",
    vendorName: "VoltHub Indiranagar",
    period: "Oct 8 - Oct 14, 2026",
    orderCount: 18,
    grossSales: 214000,
    commissionRate: 0.10,
    commissionAmount: 21400,
    shippingFee: 1420,
    netPayout: 194020,
    status: "Processing",
  },
  {
    id: "set-005",
    vendorId: "v3",
    vendorName: "EV Spares Jayanagar",
    period: "Oct 8 - Oct 14, 2026",
    orderCount: 14,
    grossSales: 96800,
    commissionRate: 0.09,
    commissionAmount: 8712,
    shippingFee: 1100,
    netPayout: 89188,
    status: "Pending",
  },
];

// Initial Vendor Applications for Admin Approval
export const initialVendorApplications: VendorApplication[] = [
  {
    id: "vapp-101",
    businessName: "EcoRide Motors & Spares",
    contactName: "Naveen Prasad",
    email: "naveen@ecoride.in",
    phone: "+91 98451 22334",
    gstin: "29AABCE4455G1Z9",
    area: "Electronic City Phase 1",
    city: "Bengaluru",
    primaryCategories: ["Battery", "Charger", "Spare Parts"],
    status: "pending",
    appliedAt: "2 days ago",
  },
  {
    id: "vapp-102",
    businessName: "Precision EV Dyno Works",
    contactName: "Arun Kulkarni",
    email: "arun@precisiondyno.com",
    phone: "+91 97400 99881",
    gstin: "29AABCP8899H2Z4",
    area: "Peenya Industrial Area",
    city: "Bengaluru",
    primaryCategories: ["Motor", "Controller", "BMS"],
    status: "pending",
    appliedAt: "Yesterday",
  },
];

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

export const getVendor = (id: string): Vendor =>
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
    commissionRate: 0.10,
  };
export const getProduct = (id: string) => products.find((p) => p.id === id);

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
export const bestOffer = (p: Product) =>
  [...(p.offers || [])].sort((a, b) => a.price - b.price)[0] || {
    vendorId: "v1",
    price: 0,
    stock: 0,
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
