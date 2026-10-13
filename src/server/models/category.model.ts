import { pool } from "../db";

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

const fallbackCategories: CategoryRecord[] = [
  { id: "cat_accessories", name: "Car Accessories", slug: "car-accessories", created_at: new Date().toISOString() },
  { id: "cat_bike_acc", name: "Bike Accessories", slug: "bike-accessories", created_at: new Date().toISOString() },
  { id: "cat_chargers", name: "Charger", slug: "charger", created_at: new Date().toISOString() },
  { id: "cat_batteries", name: "Battery", slug: "battery", created_at: new Date().toISOString() },
  { id: "cat_bms", name: "BMS", slug: "bms", created_at: new Date().toISOString() },
  { id: "cat_motors", name: "Motor", slug: "motor", created_at: new Date().toISOString() },
  { id: "cat_controllers", name: "Controller", slug: "controller", created_at: new Date().toISOString() },
  { id: "cat_brakes", name: "Brakes", slug: "brakes", created_at: new Date().toISOString() },
  { id: "cat_parts", name: "Spare Parts", slug: "spare-parts", created_at: new Date().toISOString() },
  { id: "cat_vehicles", name: "Electric Bikes", slug: "electric-bikes", created_at: new Date().toISOString() },
  { id: "cat_gear", name: "Riding Gear & Helmets", slug: "riding-gear-helmets", created_at: new Date().toISOString() },
];

export class CategoryModel {
  static async findAll(): Promise<CategoryRecord[]> {
    try {
      const result = await pool.query<CategoryRecord>(
        "SELECT * FROM categories ORDER BY name ASC"
      );
      if (result.rows && result.rows.length > 0) return result.rows;
    } catch {
      // Fallback
    }
    return fallbackCategories;
  }

  static async findById(id: string): Promise<CategoryRecord | null> {
    try {
      const result = await pool.query<CategoryRecord>(
        "SELECT * FROM categories WHERE id = $1",
        [id]
      );
      if (result.rows[0]) return result.rows[0];
    } catch {
      // Fallback
    }
    return fallbackCategories.find((c) => c.id === id) || null;
  }

  static async findBySlug(slug: string): Promise<CategoryRecord | null> {
    try {
      const result = await pool.query<CategoryRecord>(
        "SELECT * FROM categories WHERE slug = $1",
        [slug]
      );
      if (result.rows[0]) return result.rows[0];
    } catch {
      // Fallback
    }
    return fallbackCategories.find((c) => c.slug === slug) || null;
  }
}
