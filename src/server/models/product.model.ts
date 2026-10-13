import { pool } from "../db";

export interface ProductRecord {
  id: string;
  seller_id: string | null;
  category_id: string | null;
  name: string;
  brand: string;
  sku: string | null;
  description: string;
  price: number;
  mrp: number | null;
  discount_percent: number;
  stock: number;
  moq: number;
  supplier: string | null;
  variant_model: string | null;
  material: string | null;
  fitment_size: string | null;
  fitment_type: string;
  compatible_vehicles: string[];
  color_options: string[];
  key_features: string | null;
  warranty: string | null;
  weight_kg: number;
  image_url: string | null;
  verification_status: "approved" | "pending_approval" | "rejected";
  verified_by?: string | null;
  verified_at?: string | null;
  rejection_reason?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  seller_name?: string;
  store_name?: string;
  vehicle_type?: string | null;
  department?: string | null;
  price_type?: string | null;
  availability?: string | null;
  installation_price?: number | null;
  installation_time?: string | null;
  delivery_time?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  is_bestseller?: boolean;
  image_2?: string | null;
  additional_specs?: string | null;
  missing_details?: string | null;
  listing_status?: string | null;
}

export interface CreateProductDTO {
  id?: string;
  seller_id?: string;
  category_id?: string;
  name: string;
  brand?: string;
  sku?: string;
  description?: string;
  price: number;
  mrp?: number;
  discount_percent?: number;
  stock?: number;
  moq?: number;
  supplier?: string;
  variant_model?: string;
  material?: string;
  fitment_size?: string;
  fitment_type?: string;
  compatible_vehicles?: string[] | string;
  color_options?: string[] | string;
  key_features?: string;
  warranty?: string;
  weight_kg?: number;
  image_url?: string;
  verification_status?: "approved" | "pending_approval" | "rejected";
  is_active?: boolean;
  vehicle_type?: string;
  department?: string;
  price_type?: string;
  availability?: string;
  installation_price?: number;
  installation_time?: string;
  delivery_time?: string;
  rating?: number;
  reviews_count?: number;
  is_bestseller?: boolean;
  image_2?: string;
  additional_specs?: string;
  missing_details?: string;
  listing_status?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductFilterOptions {
  category?: string;
  seller_id?: string;
  fit_vehicle?: string;
  search?: string;
  is_active?: boolean;
  verification_status?: "approved" | "pending_approval" | "rejected";
  limit?: number;
  offset?: number;
}

const RAW_SEEDS = [
  { id: "p1", name: "VoltRide 60V 30Ah Li-ion Pack", brand: "VoltRide", category: "Battery", image: "/src/assets/battery-1.jpg", price: 62000, mrp: 71300, stock: 14, warranty: "36 Months Warranty", fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "High-density NMC pack with smart BMS, IP67 casing and fast-charge support." },
  { id: "p2", name: "VoltEdge 48V 50Ah LiFePO4", brand: "VoltEdge", category: "Battery", image: "/src/assets/battery-2.jpg", price: 54000, mrp: 62100, stock: 9, warranty: "48 Months Warranty", fits: ["ather-450x", "tvs-iqube"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "Ultra-safe LiFePO4 chemistry with 3000+ cycles. Built for daily commuters and fleets." },
  { id: "p3", name: "Titan 72V 120Ah Motorcycle Module", brand: "Titan Energy", category: "Battery", image: "/src/assets/battery-3.jpg", price: 98000, mrp: 112700, stock: 7, warranty: "36 Months Warranty", fits: ["revolt-rv400"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "High-capacity module for performance EV motorcycles with CAN-bus communication." },
  { id: "p4", name: "VoltRide 60V 24Ah City Pack", brand: "VoltRide", category: "Battery", image: "/src/assets/battery-1.jpg", price: 46000, mrp: 52900, stock: 12, warranty: "24 Months Warranty", fits: ["ola-s1pro", "hero-vida-v1"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "Lightweight swap-friendly pack for city riders." },
  { id: "p5", name: "VoltEdge 48V 30Ah Compact", brand: "VoltEdge", category: "Battery", image: "/src/assets/battery-2.jpg", price: 36000, mrp: 41400, stock: 11, warranty: "36 Months Warranty", fits: ["ather-450x", "tvs-iqube"], seller: "EV Spares Jayanagar", seller_id: "v3", desc: "Compact LiFePO4 replacement with plug-and-play connectors." },
  { id: "p6", name: "Titan 72V 60Ah Sport", brand: "Titan Energy", category: "Battery", image: "/src/assets/battery-3.jpg", price: 72000, mrp: 82800, stock: 6, warranty: "24 Months Warranty", fits: ["revolt-rv400"], seller: "Ampere Auto Hebbal", seller_id: "v4", desc: "Sport-tuned discharge curve for quick acceleration." },
  { id: "p7", name: "ChargeMax 3.3kW Fast Charger", brand: "ChargeMax", category: "Charger", image: "/src/assets/charger.jpg", price: 14500, mrp: 16675, stock: 18, warranty: "12 Months Warranty", fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "3.3kW portable fast charger with Type-2 connector and LED status." },
  { id: "p8", name: "ChargeMax 48V Home Charger", brand: "ChargeMax", category: "Charger", image: "/src/assets/charger.jpg", price: 7800, mrp: 8970, stock: 15, warranty: "12 Months Warranty", fits: ["ather-450x", "tvs-iqube"], seller: "EV Spares Jayanagar", seller_id: "v3", desc: "Smart home charger with auto cut-off and temperature protection." },
  { id: "p9", name: "SmartBMS 16S 60A Board", brand: "Daly", category: "BMS", image: "/src/assets/charger.jpg", price: 4200, mrp: 4830, stock: 20, warranty: "12 Months Warranty", fits: ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "Bluetooth BMS with cell balancing, over-current and thermal protection." },
  { id: "p10", name: "Ather 450X Gen 3 Smart Electric Scooter", brand: "Ather Energy", category: "Electric Bikes", image: "/src/assets/scooter.jpg", price: 145000, mrp: 166750, stock: 5, warranty: "36 Months Warranty", fits: ["ather-450x"], seller: "Riderz Dealer Malleshwaram", seller_id: "v6", desc: "Flagship 450X with Warp Mode, 7-inch TFT touchscreen and IP67 battery pack." },
  { id: "p11", name: "Revolt RV400 Electric Motorcycle", brand: "Revolt Motors", category: "Electric Bikes", image: "/src/assets/hero-bike.jpg", price: 139000, mrp: 159850, stock: 4, warranty: "36 Months Warranty", fits: ["revolt-rv400"], seller: "Ampere Auto Hebbal", seller_id: "v4", desc: "AI-enabled electric performance motorcycle with MyRevolt connectivity and 85 km/h top speed." },
  { id: "p12", name: "Ola S1 Pro Gen 2 Hyperdrive Scooter", brand: "Ola Electric", category: "Electric Bikes", image: "/src/assets/scooter.jpg", price: 129000, mrp: 148350, stock: 8, warranty: "36 Months Warranty", fits: ["ola-s1pro"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "11kW peak power, 120 km/h top speed, MoveOS 4 navigation and cruise control." },
  { id: "p13", name: "70mai 4K Dual HDR Smart Dashcam with GPS & ADAS", brand: "70mai", category: "Car Accessories", image: "/src/assets/parts.jpg", price: 8999, mrp: 10349, stock: 22, warranty: "12 Months Warranty", fits: ["universal"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "Ultra 4K front & 1080P rear HDR dashcam with parking surveillance and night owl vision." },
  { id: "p14", name: "Digital Fast Tire Inflator 150PSI Auto Cut-Off", brand: "Michelin Auto", category: "Car Accessories", image: "/src/assets/parts.jpg", price: 3499, mrp: 4024, stock: 19, warranty: "18 Months Warranty", fits: ["universal"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "High-precision digital tire inflator for cars, e-bikes and motorcycles with LED torch." },
  { id: "p15", name: "ChargeMax Level-2 Home EV Wallbox 7.4kW Type-2 AC", brand: "ChargeMax", category: "Car Accessories", image: "/src/assets/charger.jpg", price: 28500, mrp: 32775, stock: 8, warranty: "36 Months Warranty", fits: ["universal"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "7.4kW single-phase fast wall charger compatible with all Type-2 electric cars and high-capacity e-scooters." },
  { id: "p16", name: "All-Weather Heavy Duty EV Scooter Cover", brand: "Riderz Armor", category: "Bike Accessories", image: "/src/assets/parts.jpg", price: 1299, mrp: 1494, stock: 35, warranty: "12 Months Warranty", fits: ["universal"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "100% waterproof heat-resistant cover with double-stitched seams and anti-theft lock holes." },
  { id: "p17", name: "Anti-Theft Disc Brake Lock with 110dB Siren Alarm", brand: "Kovix Security", category: "Bike Accessories", image: "/src/assets/parts.jpg", price: 1850, mrp: 2128, stock: 25, warranty: "24 Months Warranty", fits: ["universal"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "Hardened stainless alloy body with motion vibration sensor and waterproof 110dB alarm." },
  { id: "p18", name: "Waterproof Handlebar Phone Mount with 15W Qi Fast Charging", brand: "Bobo Auto", category: "Bike Accessories", image: "/src/assets/parts.jpg", price: 2199, mrp: 2529, stock: 28, warranty: "12 Months Warranty", fits: ["universal"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "Aluminum alloy vibration damper with IP66 wireless fast-charging pad and USB-C port." },
  { id: "p19", name: "Brembo Ceramic Sintered Brake Pads (Front + Rear)", brand: "Brembo", category: "Spare Parts", image: "/src/assets/parts.jpg", price: 1650, mrp: 1898, stock: 30, warranty: "6 Months Warranty", fits: ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "hero-vida-v1"], seller: "EV Spares Jayanagar", seller_id: "v3", desc: "High-friction ceramic sintered brake pads for quiet, fade-free braking." },
  { id: "p20", name: "Gates Carbon Drive High-Tensile Kevlar Belt", brand: "Gates Auto", category: "Spare Parts", image: "/src/assets/parts.jpg", price: 4200, mrp: 4830, stock: 14, warranty: "12 Months Warranty", fits: ["ather-450x", "revolt-rv400"], seller: "ChargeKart Koramangala", seller_id: "v2", desc: "Polyurethane and carbon tensile cord belt designed for instantaneous EV torque." },
  { id: "p21", name: "SMK Titan Carbon ECE 22.06 Smart Bluetooth Helmet", brand: "SMK Helmets", category: "Riding Gear & Helmets", image: "/src/assets/parts.jpg", price: 11999, mrp: 13799, stock: 10, warranty: "24 Months Warranty", fits: ["universal"], seller: "Riderz Dealer Malleshwaram", seller_id: "v6", desc: "ECE 22.06 certified composite carbon fiber shell with integrated Sena Bluetooth speakers and pinlock visor." },
  { id: "p22", name: "Rynox Air GT4 All-Weather Armored Riding Jacket", brand: "Rynox Gear", category: "Riding Gear & Helmets", image: "/src/assets/parts.jpg", price: 7250, mrp: 8338, stock: 12, warranty: "12 Months Warranty", fits: ["universal"], seller: "VoltHub Indiranagar", seller_id: "v1", desc: "CE Level 2 Safe-Tech armors at shoulders, elbows and back with 3D mesh ventilation and rain liner." },
  { id: "p23", name: "ViaTerra Holeshot Carbon Knuckle Touchscreen Gloves", brand: "ViaTerra Gear", category: "Riding Gear & Helmets", image: "/src/assets/parts.jpg", price: 2899, mrp: 3334, stock: 16, warranty: "6 Months Warranty", fits: ["universal"], seller: "GreenWheels Whitefield", seller_id: "v5", desc: "Perforated goat skin leather with molded carbon fiber knuckle guards and capacitive smartphone touch fingertips." },
  { id: "p24", name: "Motul Motocool Expert EV Organic Coolant 1L", brand: "Motul", category: "Spare Parts", image: "/src/assets/parts.jpg", price: 650, mrp: 748, stock: 40, warranty: "24 Months Warranty", fits: ["ola-s1pro", "ather-450x"], seller: "EV Spares Jayanagar", seller_id: "v3", desc: "Hybrid organic coolant engineered for electric motor and stator thermal management down to -37°C." },
];

const inMemoryCatalog: ProductRecord[] = RAW_SEEDS.map((s, idx) => ({
  id: s.id,
  seller_id: s.seller_id,
  category_id: `cat_${idx + 1}`,
  name: s.name,
  brand: s.brand,
  sku: `SKU-${s.id}`,
  description: s.desc,
  price: s.price,
  mrp: s.mrp,
  discount_percent: Math.round(((s.mrp - s.price) / s.mrp) * 100),
  stock: s.stock,
  moq: 1,
  supplier: s.seller,
  variant_model: null,
  material: null,
  fitment_size: "Universal",
  fitment_type: s.fits.includes("universal") ? "universal" : "vehicle-specific",
  compatible_vehicles: s.fits,
  color_options: [],
  key_features: null,
  warranty: s.warranty,
  weight_kg: 2.0,
  image_url: s.image,
  verification_status: "approved",
  is_active: true,
  created_at: new Date(Date.now() - idx * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
  category_name: s.category,
  seller_name: s.seller,
  store_name: s.seller,
  vehicle_type: s.category.toLowerCase().includes("car") ? "car" : "universal",
  department: s.category,
  price_type: "Fixed",
  availability: "In Stock",
  rating: 4.8,
  reviews_count: 28,
  is_bestseller: idx < 6,
}));

export class ProductModel {
  /**
   * Retrieves products with optional filtering for vehicle compatibility, category, search, and seller.
   */
  static async findAll(options: ProductFilterOptions = {}): Promise<ProductRecord[]> {
    const {
      category,
      seller_id,
      fit_vehicle,
      search,
      is_active = true,
      verification_status,
      limit,
      offset,
    } = options;

    let sql = `
      SELECT 
        p.*, 
        c.name as category_name, 
        u.full_name as seller_name, 
        u.store_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (is_active !== undefined) {
      params.push(is_active);
      sql += ` AND p.is_active = $${params.length}`;
    }

    if (verification_status) {
      params.push(verification_status);
      sql += ` AND p.verification_status = $${params.length}`;
    }

    if (seller_id) {
      params.push(seller_id);
      sql += ` AND p.seller_id = $${params.length}`;
    }

    if (category && category !== "All") {
      params.push(`%${category}%`);
      params.push(category);
      sql += ` AND (c.name ILIKE $${params.length - 1} OR p.category_id = $${params.length})`;
    }

    if (fit_vehicle) {
      const cleanFit = fit_vehicle.toLowerCase().trim();
      params.push(JSON.stringify([cleanFit]));
      params.push(`%${cleanFit}%`);
      sql += ` AND (
        p.fitment_type = 'universal'
        OR p.compatible_vehicles @> $${params.length - 1}::jsonb
        OR p.description ILIKE $${params.length}
      )`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (
        p.name ILIKE $${params.length} 
        OR p.brand ILIKE $${params.length} 
        OR p.description ILIKE $${params.length}
        OR p.sku ILIKE $${params.length}
      )`;
    }

    sql += ` ORDER BY p.created_at DESC`;

    if (limit && limit > 0) {
      params.push(limit);
      sql += ` LIMIT $${params.length}`;
    }

    if (offset && offset > 0) {
      params.push(offset);
      sql += ` OFFSET $${params.length}`;
    }

    try {
      const result = await pool.query(sql, params);
      if (result.rows && result.rows.length > 0) {
        return result.rows.map((row) => ({
          ...row,
          price: Number(row.price),
          mrp: row.mrp !== null ? Number(row.mrp) : null,
          stock: Number(row.stock),
          weight_kg: Number(row.weight_kg),
        }));
      }
    } catch {
      // Fallback
    }

    let filtered = [...inMemoryCatalog];
    if (is_active !== undefined) {
      filtered = filtered.filter((p) => p.is_active === is_active);
    }
    if (verification_status) {
      filtered = filtered.filter((p) => p.verification_status === verification_status);
    }
    if (seller_id) {
      filtered = filtered.filter((p) => p.seller_id === seller_id);
    }
    if (category && category !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category_name?.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(p.category_name?.toLowerCase() || "")
      );
    }
    if (fit_vehicle) {
      const fv = fit_vehicle.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.compatible_vehicles?.includes("universal") ||
          p.compatible_vehicles?.includes(fv) ||
          p.description?.toLowerCase().includes(fv)
      );
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) =>
        `${p.name} ${p.brand} ${p.description} ${p.sku}`.toLowerCase().includes(s)
      );
    }
    if (offset && offset > 0) {
      filtered = filtered.slice(offset);
    }
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  }

  /**
   * Retrieves a single product by its unique primary key ID.
   */
  static async findById(id: string): Promise<ProductRecord | null> {
    const sql = `
      SELECT 
        p.*, 
        c.name as category_name, 
        u.full_name as seller_name, 
        u.store_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `;
    try {
      const result = await pool.query(sql, [id]);
      if (result.rows.length) {
        const row = result.rows[0];
        return {
          ...row,
          price: Number(row.price),
          mrp: row.mrp !== null ? Number(row.mrp) : null,
          stock: Number(row.stock),
          weight_kg: Number(row.weight_kg),
        };
      }
    } catch {
      // Fallback
    }
    return inMemoryCatalog.find((p) => p.id === id) || null;
  }

  /**
   * Inserts a new product or upserts on ID conflict.
   */
  static async create(dto: CreateProductDTO): Promise<ProductRecord> {
    const prodId = dto.id || `prod_${Math.random().toString(36).substring(2, 10)}`;
    const price = Number(dto.price) || 0;
    const mrp = dto.mrp !== undefined ? Number(dto.mrp) : Math.round(price * 1.2);
    const discount = dto.discount_percent !== undefined
      ? Number(dto.discount_percent)
      : mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    let compVehicles: string[] = ["universal"];
    if (typeof dto.compatible_vehicles === "string") {
      try {
        compVehicles = JSON.parse(dto.compatible_vehicles);
      } catch {
        compVehicles = [dto.compatible_vehicles];
      }
    } else if (Array.isArray(dto.compatible_vehicles)) {
      compVehicles = dto.compatible_vehicles;
    }

    let colors: string[] = [];
    if (typeof dto.color_options === "string") {
      try {
        colors = JSON.parse(dto.color_options);
      } catch {
        colors = dto.color_options.split(",").map((s: string) => s.trim());
      }
    } else if (Array.isArray(dto.color_options)) {
      colors = dto.color_options;
    }

    const sql = `
      INSERT INTO products (
        id, seller_id, category_id, name, brand, sku, description,
        price, mrp, discount_percent, stock, moq, supplier,
        variant_model, material, fitment_size, fitment_type,
        compatible_vehicles, color_options, key_features, warranty,
        weight_kg, image_url, verification_status, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        brand = EXCLUDED.brand,
        sku = EXCLUDED.sku,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        mrp = EXCLUDED.mrp,
        discount_percent = EXCLUDED.discount_percent,
        stock = EXCLUDED.stock,
        moq = EXCLUDED.moq,
        supplier = EXCLUDED.supplier,
        variant_model = EXCLUDED.variant_model,
        material = EXCLUDED.material,
        fitment_size = EXCLUDED.fitment_size,
        fitment_type = EXCLUDED.fitment_type,
        compatible_vehicles = EXCLUDED.compatible_vehicles,
        color_options = EXCLUDED.color_options,
        key_features = EXCLUDED.key_features,
        warranty = EXCLUDED.warranty,
        weight_kg = EXCLUDED.weight_kg,
        image_url = EXCLUDED.image_url,
        verification_status = EXCLUDED.verification_status,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const params = [
      prodId,
      dto.seller_id || "usr_seller_01",
      dto.category_id || "cat_accessories",
      dto.name,
      dto.brand || "Riderzpro Certified",
      dto.sku || null,
      dto.description || "",
      price,
      mrp,
      discount,
      Number(dto.stock) || 0,
      Number(dto.moq) || 1,
      dto.supplier || dto.brand || "Riderzpro Certified",
      dto.variant_model || null,
      dto.material || null,
      dto.fitment_size || (dto.fitment_type === "universal" ? "Universal" : "Specific"),
      dto.fitment_type || "universal",
      JSON.stringify(compVehicles),
      JSON.stringify(colors),
      dto.key_features || null,
      dto.warranty || "12 Months",
      Number(dto.weight_kg) || 2.0,
      dto.image_url || null,
      dto.verification_status || "approved",
      dto.is_active !== undefined ? dto.is_active : true,
    ];

    let createdRecord: ProductRecord = {
      id: prodId,
      seller_id: dto.seller_id || "v1",
      category_id: dto.category_id || "cat_1",
      name: dto.name,
      brand: dto.brand || "Riderzpro Certified",
      sku: dto.sku || `SKU-${prodId}`,
      description: dto.description || "",
      price,
      mrp,
      discount_percent: discount,
      stock: Number(dto.stock) || 0,
      moq: Number(dto.moq) || 1,
      supplier: dto.supplier || dto.brand || "Riderzpro Certified",
      variant_model: dto.variant_model || null,
      material: dto.material || null,
      fitment_size: dto.fitment_size || (dto.fitment_type === "universal" ? "Universal" : "Specific"),
      fitment_type: dto.fitment_type || "universal",
      compatible_vehicles: compVehicles,
      color_options: colors,
      key_features: dto.key_features || null,
      warranty: dto.warranty || "12 Months",
      weight_kg: Number(dto.weight_kg) || 2.0,
      image_url: dto.image_url || null,
      verification_status: dto.verification_status || "approved",
      is_active: dto.is_active !== undefined ? dto.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: dto.department || "Accessories",
      seller_name: dto.supplier || "VoltHub Indiranagar",
      store_name: dto.supplier || "VoltHub Indiranagar",
    };

    try {
      const result = await pool.query(sql, params);
      if (result.rows[0]) {
        createdRecord = {
          ...createdRecord,
          ...result.rows[0],
          price: Number(result.rows[0].price),
          mrp: result.rows[0].mrp !== null ? Number(result.rows[0].mrp) : null,
          stock: Number(result.rows[0].stock),
          weight_kg: Number(result.rows[0].weight_kg),
        };
      }
    } catch {
      // Fallback
    }

    inMemoryCatalog.unshift(createdRecord);
    return createdRecord;
  }

  /**
   * Updates an existing product with partial fields.
   */
  static async update(id: string, dto: UpdateProductDTO): Promise<ProductRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    let compVehicles: string[] | undefined = undefined;
    if (typeof dto.compatible_vehicles === "string") {
      try {
        compVehicles = JSON.parse(dto.compatible_vehicles);
      } catch {
        compVehicles = [dto.compatible_vehicles];
      }
    } else if (Array.isArray(dto.compatible_vehicles)) {
      compVehicles = dto.compatible_vehicles;
    }

    let colors: string[] | undefined = undefined;
    if (typeof dto.color_options === "string") {
      try {
        colors = JSON.parse(dto.color_options);
      } catch {
        colors = dto.color_options.split(",").map((s: string) => s.trim());
      }
    } else if (Array.isArray(dto.color_options)) {
      colors = dto.color_options;
    }

    const sql = `
      UPDATE products SET
        name = COALESCE($1, name),
        brand = COALESCE($2, brand),
        sku = COALESCE($3, sku),
        description = COALESCE($4, description),
        price = COALESCE($5, price),
        mrp = COALESCE($6, mrp),
        discount_percent = COALESCE($7, discount_percent),
        stock = COALESCE($8, stock),
        moq = COALESCE($9, moq),
        supplier = COALESCE($10, supplier),
        variant_model = COALESCE($11, variant_model),
        material = COALESCE($12, material),
        fitment_size = COALESCE($13, fitment_size),
        fitment_type = COALESCE($14, fitment_type),
        compatible_vehicles = COALESCE($15, compatible_vehicles),
        color_options = COALESCE($16, color_options),
        key_features = COALESCE($17, key_features),
        warranty = COALESCE($18, warranty),
        weight_kg = COALESCE($19, weight_kg),
        image_url = COALESCE($20, image_url),
        category_id = COALESCE($21, category_id),
        verification_status = COALESCE($22, verification_status),
        is_active = COALESCE($23, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $24
      RETURNING *
    `;

    const params = [
      dto.name ?? null,
      dto.brand ?? null,
      dto.sku ?? null,
      dto.description ?? null,
      dto.price !== undefined ? Number(dto.price) : null,
      dto.mrp !== undefined ? Number(dto.mrp) : null,
      dto.discount_percent !== undefined ? Number(dto.discount_percent) : null,
      dto.stock !== undefined ? Number(dto.stock) : null,
      dto.moq !== undefined ? Number(dto.moq) : null,
      dto.supplier ?? null,
      dto.variant_model ?? null,
      dto.material ?? null,
      dto.fitment_size ?? null,
      dto.fitment_type ?? null,
      compVehicles !== undefined ? JSON.stringify(compVehicles) : null,
      colors !== undefined ? JSON.stringify(colors) : null,
      dto.key_features ?? null,
      dto.warranty ?? null,
      dto.weight_kg !== undefined ? Number(dto.weight_kg) : null,
      dto.image_url ?? null,
      dto.category_id ?? null,
      dto.verification_status ?? null,
      dto.is_active !== undefined ? dto.is_active : null,
      id,
    ];

    try {
      await pool.query(sql, params);
    } catch {
      // Fallback
    }

    const idx = inMemoryCatalog.findIndex((p) => p.id === id);
    if (idx !== -1) {
      inMemoryCatalog[idx] = {
        ...inMemoryCatalog[idx],
        ...dto,
        price: dto.price !== undefined ? Number(dto.price) : inMemoryCatalog[idx].price,
        stock: dto.stock !== undefined ? Number(dto.stock) : inMemoryCatalog[idx].stock,
        updated_at: new Date().toISOString(),
      } as any;
      return inMemoryCatalog[idx];
    }
    return existing;
  }

  /**
   * Deletes a single product by ID.
   */
  static async delete(id: string): Promise<boolean> {
    await pool.query("DELETE FROM cart_items WHERE product_id = $1", [id]).catch(() => {});
    await pool.query("DELETE FROM order_items WHERE product_id = $1", [id]).catch(() => {});
    await pool.query("DELETE FROM products WHERE id = $1", [id]).catch(() => {});
    await pool.query('DELETE FROM riderzpro_catalogue_import WHERE "Product ID" = $1', [id]).catch(() => {});
    const idx = inMemoryCatalog.findIndex((p) => p.id === id);
    if (idx !== -1) inMemoryCatalog.splice(idx, 1);
    return true;
  }

  /**
   * Deletes multiple products by an array of IDs.
   */
  static async deleteMany(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    await pool.query("DELETE FROM cart_items WHERE product_id = ANY($1)", [ids]).catch(() => {});
    await pool.query("DELETE FROM order_items WHERE product_id = ANY($1)", [ids]).catch(() => {});
    await pool.query("DELETE FROM products WHERE id = ANY($1)", [ids]).catch(() => {});
    await pool.query('DELETE FROM riderzpro_catalogue_import WHERE "Product ID" = ANY($1)', [ids]).catch(() => {});
    ids.forEach((id) => {
      const idx = inMemoryCatalog.findIndex((p) => p.id === id);
      if (idx !== -1) inMemoryCatalog.splice(idx, 1);
    });
    return ids.length;
  }

  /**
   * Deletes all products from the catalog.
   */
  static async deleteAll(): Promise<number> {
    await pool.query("DELETE FROM cart_items").catch(() => {});
    await pool.query("DELETE FROM order_items").catch(() => {});
    await pool.query("DELETE FROM products").catch(() => {});
    await pool.query("DELETE FROM riderzpro_catalogue_import").catch(() => {});
    const count = inMemoryCatalog.length;
    inMemoryCatalog.length = 0;
    return count;
  }
}

