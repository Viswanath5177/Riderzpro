import { pool } from "../db";

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export class CategoryModel {
  static async findAll(): Promise<CategoryRecord[]> {
    const result = await pool.query<CategoryRecord>(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    return result.rows;
  }

  static async findById(id: string): Promise<CategoryRecord | null> {
    const result = await pool.query<CategoryRecord>(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<CategoryRecord | null> {
    const result = await pool.query<CategoryRecord>(
      "SELECT * FROM categories WHERE slug = $1",
      [slug]
    );
    return result.rows[0] || null;
  }
}
