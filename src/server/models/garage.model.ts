import { pool } from "../db";

export interface GarageVehicleRecord {
  id: string;
  customer_id: string;
  vehicle_id: string;
  make: string;
  model: string;
  year: number;
  vin: string | null;
  vehicle_type: string;
  voltage: number;
  battery_kwh: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddGarageVehicleDTO {
  customer_id?: string;
  vehicle_id: string;
  make: string;
  model: string;
  year?: number;
  vin?: string;
  vehicle_type?: string;
  voltage?: number;
  battery_kwh?: number;
}

export class GarageModel {
  static async findByCustomer(customerId: string): Promise<GarageVehicleRecord[]> {
    const result = await pool.query<GarageVehicleRecord>(
      `SELECT * FROM customer_garage WHERE customer_id = $1 ORDER BY is_active DESC, created_at ASC`,
      [customerId]
    );
    return result.rows;
  }

  static async addVehicle(dto: AddGarageVehicleDTO): Promise<GarageVehicleRecord> {
    const customerId = dto.customer_id || "usr_customer_demo";
    const garageId = `gar_${Math.random().toString(36).substring(2, 10)}`;

    const countRes = await pool.query(
      `SELECT count(*) FROM customer_garage WHERE customer_id = $1`,
      [customerId]
    );
    const isFirst = parseInt(countRes.rows[0].count) === 0;

    const sql = `
      INSERT INTO customer_garage (
        id, customer_id, vehicle_id, make, model, year, vin, vehicle_type, voltage, battery_kwh, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      garageId,
      customerId,
      dto.vehicle_id,
      dto.make,
      dto.model,
      Number(dto.year) || 2024,
      dto.vin || null,
      dto.vehicle_type || "bike",
      Number(dto.voltage) || 60,
      dto.battery_kwh ? Number(dto.battery_kwh) : null,
      isFirst,
    ];

    const result = await pool.query<GarageVehicleRecord>(sql, params);
    return result.rows[0];
  }

  static async setActive(garageId: string, customerId: string): Promise<GarageVehicleRecord | null> {
    await pool.query(`UPDATE customer_garage SET is_active = FALSE WHERE customer_id = $1`, [customerId]);
    const updated = await pool.query<GarageVehicleRecord>(
      `UPDATE customer_garage SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND customer_id = $2 RETURNING *`,
      [garageId, customerId]
    );
    return updated.rows[0] || null;
  }

  static async removeVehicle(garageId: string, customerId?: string): Promise<boolean> {
    const sql = customerId
      ? `DELETE FROM customer_garage WHERE id = $1 AND customer_id = $2`
      : `DELETE FROM customer_garage WHERE id = $1`;
    const params = customerId ? [garageId, customerId] : [garageId];
    const result = await pool.query(sql, params);
    return (result.rowCount ?? 0) > 0;
  }
}
