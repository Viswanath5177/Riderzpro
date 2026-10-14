import { GarageModel } from "../models";
import { query } from "../db";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
          if (cleanUrl.startsWith("/api/garage")) {
            const parts = cleanUrl.split("/").filter(Boolean);
            const garageId = parts.length > 2 ? parts[2] : null;
            const subAction = parts.length > 3 ? parts[3] : null;

            try {
              // GET /api/garage
              if (method === "GET") {
                const customerId = queryParams.get("customer_id") || "usr_customer_demo";
                const rows = await GarageModel.findByCustomer(customerId);
                return sendJson(res, 200, { success: true, data: rows });
              }

              // POST /api/garage
              if (method === "POST") {
                const body = await parseBody(req);
                if (!body.vehicle_id || !body.make || !body.model) {
                  return sendJson(res, 400, { success: false, error: "Vehicle details (vehicle_id, make, model) required." });
                }
                const created = await GarageModel.addVehicle(body);
                return sendJson(res, 201, {
                  success: true,
                  message: "Vehicle added to Customer Garage successfully in PostgreSQL",
                  data: created,
                });
              }

              // PUT /api/garage/:id/active
              if (method === "PUT" && garageId && subAction === "active") {
                const customerId = queryParams.get("customer_id") || "usr_customer_demo";
                const updated = await GarageModel.setActive(garageId, customerId);
                return sendJson(res, 200, { success: true, data: updated });
              }

              // DELETE /api/garage/:id
              if (method === "DELETE" && garageId) {
                const ok = await GarageModel.removeVehicle(garageId);
                return sendJson(res, 200, { success: ok, message: "Vehicle removed from garage" });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              console.error("[PostgreSQL Garage API Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
          if (cleanUrl === "/api/sellers" && method === "GET") {
            try {
              const sellersRes = await query(`
                SELECT id, email, phone, store_name, owner_name, business_type, business_address, 
                       city, state, pincode, country, gstin, status, created_at 
                FROM sellers 
                WHERE status = 'APPROVED' AND is_active = true
                ORDER BY created_at DESC
              `);

              const mapped = sellersRes.rows.map((s: any) => ({
                id: s.id,
                name: s.store_name,
                area: s.city || "Bengaluru",
                lat: 12.9784,
                lng: 77.6408,
                rating: 5.0,
                reviewCount: 0,
                prepMins: 15,
                isVerified: true,
                verificationBadge: "Verified Marketplace Seller",
                description: `${s.business_type || "Proprietorship"} — Authorized electric vehicle and spare parts dealer.`,
                deliveryCoverage: `${s.city || "Bengaluru"} and nearby areas`,
                businessHours: "Mon - Sat: 9:00 AM - 8:00 PM",
                phone: s.phone,
                email: s.email,
                address: s.business_address || s.city,
                gstin: s.gstin,
              }));

              return sendJson(res, 200, { success: true, data: mapped });
            } catch (error: any) {
              console.error("[PostgreSQL Public Sellers Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
  return false;
}
