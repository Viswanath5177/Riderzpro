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

/**
 * Backend Product Model handling database interactions with PostgreSQL.
 * Provides type-safe queries, fitment calculations, and mutations.
 */
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

    const result = await pool.query(sql, params);
    return result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
      mrp: row.mrp !== null ? Number(row.mrp) : null,
      stock: Number(row.stock),
      weight_kg: Number(row.weight_kg),
    }));
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
    const result = await pool.query(sql, [id]);
    if (!result.rows.length) return null;

    const row = result.rows[0];
    return {
      ...row,
      price: Number(row.price),
      mrp: row.mrp !== null ? Number(row.mrp) : null,
      stock: Number(row.stock),
      weight_kg: Number(row.weight_kg),
    };
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

    const result = await pool.query(sql, params);
    const created = result.rows[0];

    // Fetch with category and seller joined
    return (await this.findById(created.id)) || {
      ...created,
      price: Number(created.price),
      mrp: created.mrp !== null ? Number(created.mrp) : null,
      stock: Number(created.stock),
      weight_kg: Number(created.weight_kg),
    };
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

    const result = await pool.query(sql, params);
    if (!result.rows.length) return null;
    return this.findById(id);
  }

  /**
   * Deletes a single product by ID.
   */
  static async delete(id: string): Promise<boolean> {
    await pool.query("DELETE FROM cart_items WHERE product_id = $1", [id]).catch(() => {});
    await pool.query("DELETE FROM order_items WHERE product_id = $1", [id]).catch(() => {});
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    await pool.query('DELETE FROM riderzpro_catalogue_import WHERE "Product ID" = $1', [id]).catch(() => {});
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Deletes multiple products by an array of IDs.
   */
  static async deleteMany(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    await pool.query("DELETE FROM cart_items WHERE product_id = ANY($1)", [ids]).catch(() => {});
    await pool.query("DELETE FROM order_items WHERE product_id = ANY($1)", [ids]).catch(() => {});
    const result = await pool.query("DELETE FROM products WHERE id = ANY($1)", [ids]);
    await pool.query('DELETE FROM riderzpro_catalogue_import WHERE "Product ID" = ANY($1)', [ids]).catch(() => {});
    return result.rowCount ?? 0;
  }

  /**
   * Deletes all products from the catalog.
   */
  static async deleteAll(): Promise<number> {
    await pool.query("DELETE FROM cart_items").catch(() => {});
    await pool.query("DELETE FROM order_items").catch(() => {});
    const result = await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM riderzpro_catalogue_import").catch(() => {});
    return result.rowCount ?? 0;
  }
}

