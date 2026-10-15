import { pool } from "../db";

export interface ServiceBookingRecord {
  id: string;
  customer_id: string;
  vehicle_id: string | null;
  service_type: string;
  scheduled_date: string | null;
  scheduled_slot: string | null;
  address: string | null;
  notes: string | null;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface AddServiceBookingDTO {
  customer_id?: string;
  vehicle_id?: string;
  service_type: string;
  scheduled_date?: string;
  scheduled_slot?: string;
  address?: string;
  notes?: string;
  status?: string;
  total_amount?: number;
}

export class ServiceBookingModel {
  static async findByCustomer(customerId: string): Promise<ServiceBookingRecord[]> {
    const result = await pool.query<ServiceBookingRecord>(
      `SELECT * FROM service_bookings WHERE customer_id = $1 ORDER BY created_at DESC`,
      [customerId]
    );
    return result.rows;
  }

  static async addBooking(dto: AddServiceBookingDTO): Promise<ServiceBookingRecord> {
    const customerId = dto.customer_id || "usr_customer_demo";
    const bookingId = `bk_${Math.random().toString(36).substring(2, 12)}`;

    const sql = `
      INSERT INTO service_bookings (
        id, customer_id, vehicle_id, service_type, scheduled_date, scheduled_slot, address, notes, status, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      bookingId,
      customerId,
      dto.vehicle_id || null,
      dto.service_type,
      dto.scheduled_date || null,
      dto.scheduled_slot || "Tomorrow, 10:30 AM",
      dto.address || "Bengaluru",
      dto.notes || "",
      dto.status || "Confirmed",
      Number(dto.total_amount) || 299,
    ];

    const result = await pool.query<ServiceBookingRecord>(sql, params);
    return result.rows[0];
  }

  static async cancelBooking(bookingId: string, customerId?: string): Promise<ServiceBookingRecord | null> {
    const sql = customerId
      ? `UPDATE service_bookings SET status = 'Cancelled' WHERE id = $1 AND customer_id = $2 RETURNING *`
      : `UPDATE service_bookings SET status = 'Cancelled' WHERE id = $1 RETURNING *`;
    const params = customerId ? [bookingId, customerId] : [bookingId];
    const result = await pool.query<ServiceBookingRecord>(sql, params);
    return result.rows[0] || null;
  }

  static async deleteBooking(bookingId: string, customerId?: string): Promise<boolean> {
    const sql = customerId
      ? `DELETE FROM service_bookings WHERE id = $1 AND customer_id = $2`
      : `DELETE FROM service_bookings WHERE id = $1`;
    const params = customerId ? [bookingId, customerId] : [bookingId];
    const result = await pool.query(sql, params);
    return (result.rowCount ?? 0) > 0;
  }
}
