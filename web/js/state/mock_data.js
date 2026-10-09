/* ==========================================================================
   VoltFit Mock Data & Seed Engine
   ========================================================================== */

export const MOCK_BIKE_MODELS = [
  {
    id: "bm_ather_450x",
    brand: "Ather",
    model: "450X Gen 3",
    year_from: 2021,
    year_to: 2024,
    voltage: "51.1V",
    connector: "Ather High-Flow Prop Plug",
    description: "High-performance urban scooter with intelligent battery pack",
    image: "🛵"
  },
  {
    id: "bm_ola_s1_pro",
    brand: "Ola Electric",
    model: "S1 Pro (Gen 2)",
    year_from: 2022,
    year_to: 2025,
    voltage: "72V",
    connector: "HyperCharge Dual-Pin",
    description: "Extended range 4kWh battery architecture with advanced thermal jacket",
    image: "⚡"
  },
  {
    id: "bm_tvs_iqube",
    brand: "TVS",
    model: "iQube Electric ST",
    year_from: 2020,
    year_to: 2024,
    voltage: "52V",
    connector: "TVS SmartConnect Plug",
    description: "Reliable dual-pack prismatic cells with regenerative BMS",
    image: "🔋"
  },
  {
    id: "bm_revolt_rv400",
    brand: "Revolt",
    model: "RV400",
    year_from: 2019,
    year_to: 2024,
    voltage: "72V",
    connector: "Revolt Quick-Swap Chogori",
    description: "Swappable high-draw lithium-ion motorcycle battery",
    image: "🏍️"
  },
  {
    id: "bm_hero_vida",
    brand: "Hero",
    model: "Vida V1 Pro",
    year_from: 2022,
    year_to: 2025,
    voltage: "50.4V",
    connector: "Hero Removable Modular",
    description: "Dual removable modules for flexible home charging",
    image: "🛵"
  },
  {
    id: "bm_chetak",
    brand: "Bajaj",
    model: "Chetak Premium",
    year_from: 2020,
    year_to: 2024,
    voltage: "48V",
    connector: "Bajaj Sealed Heavy-Duty",
    description: "All-metal casing IP67 lithium battery with smart sleep mode",
    image: "🛵"
  }
];

export const MOCK_BATTERIES = [
  {
    id: "bat_voltpro_72",
    vendor_id: "vnd_nexgen_ev",
    vendor_name: "NexGen Power Systems",
    name: "VoltPro Max LFP 72V 45Ah",
    brand: "VoltPro",
    chemistry: "LFP (Lithium Iron Phosphate)",
    voltage: 72,
    capacity_ah: 45,
    kwh: 3.24,
    range_km: 155,
    charge_time_hours: 3.5,
    weight_kg: 18.2,
    connector_type: "HyperCharge Dual-Pin / Revolt Quick-Swap",
    bms_features: "Smart Bluetooth CAN BMS, Over-temperature Auto-Cut, 2000+ Deep Cycles",
    ip_rating: "IP67 Waterproof & Dustproof",
    warranty_months: 60,
    price: 48999,
    stock: 12,
    rating: 4.9,
    review_count: 84,
    badge: "Best Seller",
    compatible_bike_model_ids: ["bm_ola_s1_pro", "bm_revolt_rv400"]
  },
  {
    id: "bat_nexcharge_51",
    vendor_id: "vnd_nexgen_ev",
    vendor_name: "NexGen Power Systems",
    name: "NexCharge Pro 51.1V 3.7kWh",
    brand: "NexCharge",
    chemistry: "NMC (Nickel Manganese Cobalt)",
    voltage: 51.1,
    capacity_ah: 72,
    kwh: 3.7,
    range_km: 140,
    charge_time_hours: 3.0,
    weight_kg: 19.5,
    connector_type: "Ather High-Flow Prop Plug",
    bms_features: "Active Cell Balancing, Thermal Runaway Isolation, Cloud Telematics",
    ip_rating: "IP67 Submersible",
    warranty_months: 48,
    price: 44500,
    stock: 8,
    rating: 4.8,
    review_count: 56,
    badge: "OEM Approved",
    compatible_bike_model_ids: ["bm_ather_450x"]
  },
  {
    id: "bat_ecofit_52",
    vendor_id: "vnd_powergrid_labs",
    vendor_name: "PowerGrid EV Solutions",
    name: "EcoFit Ultra Dual-Pack 52V",
    brand: "EcoFit",
    chemistry: "LFP (Lithium Iron Phosphate)",
    voltage: 52,
    capacity_ah: 65,
    kwh: 3.38,
    range_km: 130,
    charge_time_hours: 4.0,
    weight_kg: 21.0,
    connector_type: "TVS SmartConnect Plug",
    bms_features: "Dual Phase Heat Dissipation, Voltage Surge Protection, Fast-Charge 1.5C",
    ip_rating: "IP67 Rated",
    warranty_months: 36,
    price: 39999,
    stock: 15,
    rating: 4.7,
    review_count: 42,
    badge: "Value Pick",
    compatible_bike_model_ids: ["bm_tvs_iqube"]
  },
  {
    id: "bat_aurora_50",
    vendor_id: "vnd_powergrid_labs",
    vendor_name: "PowerGrid EV Solutions",
    name: "Aurora TwinModule 50.4V 3.9kWh",
    brand: "Aurora",
    chemistry: "NMC High-Density",
    voltage: 50.4,
    capacity_ah: 78,
    kwh: 3.94,
    range_km: 165,
    charge_time_hours: 3.2,
    weight_kg: 17.8,
    connector_type: "Hero Removable Modular",
    bms_features: "Individual Pack Load Balancer, Anti-Theft GPS Sync, Shock Absorption Housing",
    ip_rating: "IP67 Sealed",
    warranty_months: 48,
    price: 52000,
    stock: 5,
    rating: 4.9,
    review_count: 29,
    badge: "Long Range",
    compatible_bike_model_ids: ["bm_hero_vida"]
  },
  {
    id: "bat_bajaj_durapack",
    vendor_id: "vnd_nexgen_ev",
    vendor_name: "NexGen Power Systems",
    name: "DuraPack Heavy Duty 48V 3.2kWh",
    brand: "DuraPack",
    chemistry: "LFP Heavy Metal Encased",
    voltage: 48,
    capacity_ah: 66,
    kwh: 3.2,
    range_km: 125,
    charge_time_hours: 4.5,
    weight_kg: 22.0,
    connector_type: "Bajaj Sealed Heavy-Duty",
    bms_features: "Die-Cast Aluminum Casing, IP67 Submersion Tested, 5-Layer Short Protection",
    ip_rating: "IP67 Submersible",
    warranty_months: 36,
    price: 38500,
    stock: 3,
    rating: 4.6,
    review_count: 38,
    badge: "Heavy Duty",
    compatible_bike_model_ids: ["bm_chetak"]
  },
  {
    id: "bat_voltpro_rv_boost",
    vendor_id: "vnd_powergrid_labs",
    vendor_name: "PowerGrid EV Solutions",
    name: "VoltPro RV-Boost 72V 50Ah Performance",
    brand: "VoltPro",
    chemistry: "NMC Fast-Discharge 3C",
    voltage: 72,
    capacity_ah: 50,
    kwh: 3.6,
    range_km: 170,
    charge_time_hours: 2.8,
    weight_kg: 19.0,
    connector_type: "Revolt Quick-Swap Chogori",
    bms_features: "High-Amp Sport Mode Delivery, Regenerative Braking Optimizer, Real-Time App Link",
    ip_rating: "IP68 Submersible",
    warranty_months: 60,
    price: 56900,
    stock: 7,
    rating: 5.0,
    review_count: 67,
    badge: "Performance Edition",
    compatible_bike_model_ids: ["bm_revolt_rv400"]
  }
];

export const MOCK_SERVICE_CENTERS = [
  {
    id: "sc_indiranagar",
    vendor_id: "vnd_nexgen_ev",
    name: "VoltFit Flagship Service Hub — Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    distance_km: 2.4,
    rating: 4.9,
    reviews_count: 320,
    lat: 12.9719,
    lng: 77.6412
  },
  {
    id: "sc_koramangala",
    vendor_id: "vnd_nexgen_ev",
    name: "VoltFit EV Care Center — Koramangala 5th Block",
    address: "80 Feet Main Road, 5th Block, Koramangala, Bengaluru",
    distance_km: 4.8,
    rating: 4.8,
    reviews_count: 215,
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: "sc_hsr",
    vendor_id: "vnd_powergrid_labs",
    name: "PowerGrid High-Voltage Tech Hub — HSR Layout",
    address: "Sector 3, 27th Main, HSR Layout, Bengaluru",
    distance_km: 6.2,
    rating: 4.8,
    reviews_count: 180,
    lat: 12.9116,
    lng: 77.6389
  }
];

export const MOCK_PRICING_RULES = {
  install_home: 499,
  install_center: 299,
  travel_per_km: 15,
  exchange_credit: 2500,
  tax_rate: 0.18
};

export const MOCK_TECHNICIANS = [
  {
    id: "tech_ramesh",
    vendor_id: "vnd_nexgen_ev",
    name: "Ramesh Kumar",
    phone: "+91 98450 12345",
    rating: 4.9,
    reviews_count: 142,
    certification: "Master High-Voltage EV Certified (Level 4)",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    is_online: true,
    current_job_id: "ord_volt_102",
    lat: 12.9680,
    lng: 77.6350,
    vehicle: "VoltFit Service Van #04"
  },
  {
    id: "tech_priya",
    vendor_id: "vnd_powergrid_labs",
    name: "Priya Sharma",
    phone: "+91 97410 88765",
    rating: 4.8,
    reviews_count: 98,
    certification: "Certified Lithium BMS & Electrical Systems Specialist",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    is_online: true,
    current_job_id: null,
    lat: 12.9200,
    lng: 77.6300,
    vehicle: "VoltFit Mobile Unit #12"
  },
  {
    id: "tech_anil",
    vendor_id: "vnd_nexgen_ev",
    name: "Anil Deshmukh",
    phone: "+91 99160 55432",
    rating: 4.9,
    reviews_count: 85,
    certification: "Automotive High-Tension Safety Certified",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    is_online: false,
    current_job_id: null,
    lat: 12.9550,
    lng: 77.6500,
    vehicle: "VoltFit Scooter #08"
  }
];

export const MOCK_SAVED_BIKES = [
  {
    id: "bike_saved_1",
    user_id: "usr_customer_demo",
    bike_model_id: "bm_ather_450x",
    nickname: "Daily Stealth",
    registration_number: "KA 01 EK 4509",
    year: 2023,
    is_active: true
  },
  {
    id: "bike_saved_2",
    user_id: "usr_customer_demo",
    bike_model_id: "bm_revolt_rv400",
    nickname: "Weekend Cruiser",
    registration_number: "KA 03 HG 8812",
    year: 2022,
    is_active: false
  }
];

export const MOCK_ORDERS = [
  {
    id: "ord_volt_101",
    order_number: "VF-2026-8941",
    customer_id: "usr_customer_demo",
    customer_name: "Rahul Verma",
    customer_phone: "+91 98860 99887",
    vendor_id: "vnd_nexgen_ev",
    vendor_name: "NexGen Power Systems",
    technician_id: null,
    bike: {
      brand: "Ather",
      model: "450X Gen 3",
      year: 2023,
      registration_number: "KA 01 EK 4509",
      nickname: "Daily Stealth"
    },
    battery: {
      id: "bat_nexcharge_51",
      name: "NexCharge Pro 51.1V 3.7kWh",
      chemistry: "NMC",
      voltage: 51.1,
      capacity_ah: 72,
      price: 44500,
      warranty_months: 48
    },
    install_type: "home_visit",
    delivery_address: "Apartment 4B, Palm Meadows, Whitefield, Bengaluru - 560066",
    service_center: null,
    slot: {
      date: "Tomorrow, Oct 10",
      time: "10:00 AM - 11:30 AM",
      ready_by: "11:30 AM"
    },
    costs: {
      battery_price: 44500,
      install_fee: 499,
      travel_fee: 60,
      exchange_credit: 2500,
      tax_amount: 7660.82,
      total_amount: 50219.82
    },
    has_exchange: true,
    status: "confirmed", // placed -> confirmed -> technician_assigned -> technician_on_the_way -> installing -> completed
    created_at: "2026-10-09T09:30:00Z"
  },
  {
    id: "ord_volt_102",
    order_number: "VF-2026-7732",
    customer_id: "usr_customer_demo",
    customer_name: "Rahul Verma",
    customer_phone: "+91 98860 99887",
    vendor_id: "vnd_nexgen_ev",
    vendor_name: "NexGen Power Systems",
    technician_id: "tech_ramesh",
    bike: {
      brand: "Ola Electric",
      model: "S1 Pro (Gen 2)",
      year: 2023,
      registration_number: "KA 05 MN 1204",
      nickname: "Ola Commuter"
    },
    battery: {
      id: "bat_voltpro_72",
      name: "VoltPro Max LFP 72V 45Ah",
      chemistry: "LFP",
      voltage: 72,
      capacity_ah: 45,
      price: 48999,
      warranty_months: 60
    },
    install_type: "home_visit",
    delivery_address: "Flat 202, Green Glen Layout, Bellandur, Bengaluru",
    service_center: null,
    slot: {
      date: "Today, Oct 9",
      time: "02:00 PM - 03:30 PM",
      ready_by: "03:30 PM"
    },
    costs: {
      battery_price: 48999,
      install_fee: 499,
      travel_fee: 45,
      exchange_credit: 2500,
      tax_amount: 8467.74,
      total_amount: 55510.74
    },
    has_exchange: true,
    status: "technician_on_the_way",
    technician: {
      id: "tech_ramesh",
      name: "Ramesh Kumar",
      phone: "+91 98450 12345",
      rating: 4.9,
      certification: "Master High-Voltage EV Certified (Level 4)",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      eta_mins: 14,
      distance_km: 3.8
    },
    checklist: {
      battery_collected: true,
      vin_verified: true,
      old_removed: false,
      new_installed: false,
      diagnostics_passed: false,
      customer_signoff: false
    },
    created_at: "2026-10-09T08:00:00Z"
  },
  {
    id: "ord_volt_100",
    order_number: "VF-2026-5510",
    customer_id: "usr_customer_demo",
    customer_name: "Rahul Verma",
    customer_phone: "+91 98860 99887",
    vendor_id: "vnd_powergrid_labs",
    vendor_name: "PowerGrid EV Solutions",
    technician_id: "tech_priya",
    bike: {
      brand: "Revolt",
      model: "RV400",
      year: 2022,
      registration_number: "KA 03 HG 8812",
      nickname: "Weekend Cruiser"
    },
    battery: {
      id: "bat_voltpro_rv_boost",
      name: "VoltPro RV-Boost 72V 50Ah Performance",
      chemistry: "NMC 3C",
      voltage: 72,
      capacity_ah: 50,
      price: 56900,
      warranty_months: 60
    },
    install_type: "service_center",
    delivery_address: null,
    service_center: {
      name: "VoltFit Flagship Service Hub — Indiranagar",
      address: "100 Feet Road, Indiranagar, Bengaluru"
    },
    slot: {
      date: "Oct 2, 2026",
      time: "11:30 AM - 01:00 PM",
      ready_by: "01:00 PM"
    },
    costs: {
      battery_price: 56900,
      install_fee: 299,
      travel_fee: 0,
      exchange_credit: 2500,
      tax_amount: 9845.82,
      total_amount: 64544.82
    },
    has_exchange: true,
    status: "completed",
    technician: {
      id: "tech_priya",
      name: "Priya Sharma",
      phone: "+91 97410 88765",
      rating: 4.8,
      certification: "Certified Lithium BMS Specialist",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    },
    warranty_certificate_id: "WTY-VF-998812",
    invoice_number: "INV-2026-10492",
    created_at: "2026-10-02T10:00:00Z"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    title: "Technician Dispatched",
    message: "Ramesh Kumar is en route with your VoltPro 72V battery. ETA: 14 mins.",
    time: "5 mins ago",
    is_read: false,
    type: "tracking"
  },
  {
    id: "notif_2",
    title: "Order Confirmed",
    message: "Order #VF-2026-8941 confirmed by NexGen Power Systems.",
    time: "2 hours ago",
    is_read: true,
    type: "order"
  },
  {
    id: "notif_3",
    title: "Installation Reminder",
    message: "Your appointment is scheduled for tomorrow at 10:00 AM.",
    time: "1 day ago",
    is_read: true,
    type: "reminder"
  }
];

export const MOCK_PAYOUTS = [
  {
    id: "pay_901",
    date: "Oct 08, 2026",
    order_number: "VF-2026-5510",
    gross_amount: 64544.82,
    platform_fee: 3227.24, // 5%
    net_payout: 61317.58,
    status: "paid",
    reference: "UPI/TXN/8892104"
  },
  {
    id: "pay_902",
    date: "Oct 07, 2026",
    order_number: "VF-2026-4419",
    gross_amount: 49200.00,
    platform_fee: 2460.00,
    net_payout: 46740.00,
    status: "paid",
    reference: "UPI/TXN/8891004"
  },
  {
    id: "pay_903",
    date: "Oct 09, 2026",
    order_number: "VF-2026-7732",
    gross_amount: 55510.74,
    platform_fee: 2775.53,
    net_payout: 52735.21,
    status: "pending",
    reference: "Scheduled for next cycle"
  }
];
