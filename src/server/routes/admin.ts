import { query } from "../db";
import {
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorMoreInfoEmail,
  sendProductApprovalEmail,
} from "../../lib/email.server";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";
import { requireRole, AuthError, type SessionUser } from "./session";

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined,
  queryParams: URLSearchParams,
): Promise<boolean> {
  // Only process /api/admin/* routes
  if (!cleanUrl.startsWith("/api/admin")) {
    return false;
  }

  // TASK C: Enforce requireRole(req, 'admin') on EVERY route under /api/admin/*
  let adminUser: SessionUser;
  try {
    adminUser = await requireRole(req, "admin", res);
  } catch (err) {
    if (err instanceof AuthError) {
      return true;
    }
    throw err;
  }

  // ====================================================================
  // 1. GET /api/admin/orders
  // ====================================================================
  if (cleanUrl === "/api/admin/orders") {
    if (method !== "GET") {
      return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
    }

    try {
      const ordersRes = await query(`
        SELECT 
          o.id,
          o.order_number,
          o.customer_id,
          o.seller_id,
          o.total_amount,
          o.payment_method,
          COALESCE(o.payment_status, 'PAID') as payment_status,
          COALESCE(o.status, o.order_status, 'placed') as raw_status,
          o.delivery_address,
          o.created_at,
          COALESCE(c.full_name, cu.full_name, 'Customer') AS customer_name,
          COALESCE(c.phone, cu.phone, '+91 98765 43210') AS customer_phone,
          COALESCE(s.store_name, su.store_name, su.full_name, 'Vendor Hub') AS seller_name,
          COALESCE(s.phone, su.phone, '+91 98450 11111') AS seller_phone,
          COALESCE(s.business_address, su.address, 'Sector 63, Noida, UP') AS seller_address,
          COALESCE(s.city, su.city, 'Noida') AS city,
          d.id AS delivery_id,
          d.status AS delivery_status,
          d.rider_id,
          r.full_name AS rider_name,
          r.phone AS rider_phone
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users cu ON o.customer_id = cu.id
        LEFT JOIN sellers s ON o.seller_id = s.id
        LEFT JOIN users su ON o.seller_id = su.id
        LEFT JOIN deliveries d ON d.order_id = o.id
        LEFT JOIN users r ON d.rider_id = r.id
        ORDER BY o.created_at DESC
      `);

      // Attempt to load order items
      let itemsMap = new Map<string, Array<{ name: string; qty: number; price: number }>>();
      try {
        const itemsRes = await query(`
          SELECT oi.order_id, oi.quantity as qty, oi.unit_price as price, COALESCE(p.name, 'EV Part Component') as name
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
        `);
        for (const item of itemsRes.rows) {
          if (!itemsMap.has(item.order_id)) itemsMap.set(item.order_id, []);
          itemsMap.get(item.order_id)!.push({
            name: item.name,
            qty: Number(item.qty || 1),
            price: Number(item.price || 0),
          });
        }
      } catch {
        // order_items table optional
      }

      const results = ordersRes.rows.map((o: any) => {
        const rawStatus = (o.delivery_status || o.raw_status || "PLACED").toUpperCase();
        let status = rawStatus;
        if (status === "PENDING" || status === "CONFIRMED") status = "PLACED";

        const items = itemsMap.get(o.id) || [
          {
            name: "EV High-Performance Assembly Pack",
            qty: 1,
            price: Number(o.total_amount || 0),
          },
        ];

        return {
          id: o.id,
          orderNumber: o.order_number || `RZ-${o.id.slice(-6)}`,
          createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          deliveryAddress: o.delivery_address || "Connaught Place, New Delhi",
          city: o.city || "New Delhi",
          sellerId: o.seller_id || "sel_noida_01",
          sellerName: o.seller_name,
          sellerPhone: o.seller_phone,
          sellerAddress: o.seller_address,
          status,
          riderName: o.rider_name || null,
          riderPhone: o.rider_phone || null,
          paymentStatus: (o.payment_status || "PAID").toUpperCase(),
          paymentMethod: o.payment_method || "Razorpay (Online)",
          amount: Number(o.total_amount || 0),
          items,
          statusHistory: [
            {
              status,
              timestamp: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
              source: "system",
              note: "Order recorded in system",
            },
          ],
        };
      });

      return sendJson(res, 200, { success: true, orders: results });
    } catch (error: any) {
      console.error("[Admin Orders API Error]:", error);
      return sendJson(res, 500, { success: false, error: error.message });
    }
  }

  // ====================================================================
  // 2. /api/admin/sellers
  // ====================================================================
  if (cleanUrl.startsWith("/api/admin/sellers")) {
    const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'sellers', sellerId?, subAction?]
    const sellerId = parts.length > 3 ? parts[3] : null;
    const subAction = parts.length > 4 ? parts[4] : null;

    try {
      // GET /api/admin/sellers
      if (method === "GET") {
        const sellersRes = await query(`
          SELECT id, email, phone, store_name, owner_name, business_type, business_address, 
                 city, state, pincode, country, gstin, status, approved_by, approved_at, 
                 rejection_reason, created_at 
          FROM sellers 
          ORDER BY created_at DESC
        `);
        const docsRes = await query(
          "SELECT id, seller_id, doc_type, doc_number, file_path, is_verified FROM seller_documents",
        );
        const bankRes = await query(
          "SELECT id, seller_id, account_holder_name, bank_name, account_number, ifsc_code, is_verified FROM seller_bank_accounts",
        );

        const docsMap = new Map<string, any[]>();
        for (const doc of docsRes.rows) {
          if (!docsMap.has(doc.seller_id)) docsMap.set(doc.seller_id, []);
          docsMap.get(doc.seller_id)!.push(doc);
        }

        const bankMap = new Map<string, any>();
        for (const b of bankRes.rows) {
          bankMap.set(b.seller_id, b);
        }

        const results = sellersRes.rows.map((s: any) => ({
          ...s,
          documents: docsMap.get(s.id) || [],
          bankAccount: bankMap.get(s.id) || null,
        }));

        return sendJson(res, 200, { success: true, data: results });
      }

      // POST /api/admin/sellers/:id/review
      if (method === "POST" && sellerId && (subAction === "review" || parts.length === 4)) {
        const body = await parseBody(req);
        const action = body.action as "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
        const reason = body.reason || "";
        // Derive actor admin strictly from authenticated session user
        const adminId = adminUser.id;

        const sRes = await query(
          "SELECT email, owner_name, store_name, phone, password_hash FROM sellers WHERE id = $1",
          [sellerId],
        );
        const seller = sRes.rows[0];
        if (!seller) {
          return sendJson(res, 404, { success: false, error: "Seller application not found" });
        }

        await query(
          `UPDATE sellers 
           SET status = $1, approved_by = $2, approved_at = CASE WHEN $1 = 'APPROVED' THEN now() ELSE NULL END, rejection_reason = $3, updated_at = now()
           WHERE id = $4`,
          [action, adminId, reason || null, sellerId],
        );

        // When approved, mirror into users table so the vendor can log in via /api/auth/signin
        if (action === "APPROVED") {
          await query(
            `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
             VALUES ($1, $2, $3, $4, $5, 'seller', true)
             ON CONFLICT (email) DO UPDATE SET role = 'seller', is_active = true`,
            ["usr_" + sellerId.slice(4), seller.email, seller.phone, seller.password_hash, seller.owner_name],
          ).catch((err) => console.warn("[Seller User Mirror Warning]:", err?.message));
        }

        await query(
          `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id, details)
           VALUES ($1, 'admin', $2, 'seller', $3, $4)`,
          [adminId, `VENDOR_${action}`, sellerId, JSON.stringify({ reason })],
        );

        const host = req.headers.host || "localhost:8080";
        const loginUrl = `http://${host}/login`;

        // Dispatch transactional emails via Resend API
        if (action === "APPROVED") {
          await sendVendorApprovedEmail(seller.email, seller.owner_name, seller.store_name, loginUrl).catch(
            () => {},
          );
        } else if (action === "REJECTED") {
          await sendVendorRejectedEmail(
            seller.email,
            seller.owner_name,
            seller.store_name,
            reason || "Application does not meet marketplace compliance standards.",
          ).catch(() => {});
        } else if (action === "MORE_INFORMATION_REQUIRED") {
          await sendVendorMoreInfoEmail(
            seller.email,
            seller.owner_name,
            seller.store_name,
            reason || "Please provide clearer copies of your business documentation.",
          ).catch(() => {});
        }

        return sendJson(res, 200, {
          success: true,
          status: action,
          message: `Seller KYC updated to ${action}`,
        });
      }

      return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
    } catch (error: any) {
      console.error("[PostgreSQL Admin Sellers API Error]:", error);
      return sendJson(res, 500, { success: false, error: error.message });
    }
  }

  // ====================================================================
  // 3. /api/admin/products/:id/review
  // ====================================================================
  if (cleanUrl.startsWith("/api/admin/products") && cleanUrl.includes("/review")) {
    const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'products', productId, 'review']
    const productId = parts[3];

    try {
      if (method === "POST" && productId) {
        const body = await parseBody(req);
        const action = body.action as "APPROVED" | "REJECTED";
        const reason = body.reason || "";
        // Derive actor admin strictly from authenticated session user
        const adminId = adminUser.id;

        const prodRes = await query("SELECT name, seller_id FROM products WHERE id = $1", [productId]);
        const product = prodRes.rows[0];
        if (!product) {
          return sendJson(res, 404, { success: false, error: "Product not found" });
        }

        const newStatus = action === "APPROVED" ? "approved" : "rejected";
        await query(
          `UPDATE products 
           SET verification_status = $1, verified_by = $2, verified_at = now(), rejection_reason = $3, updated_at = now()
           WHERE id = $4`,
          [newStatus, adminId, reason || null, productId],
        );

        await query(
          `INSERT INTO product_approval_history (product_id, admin_id, action, reason)
           VALUES ($1, $2, $3, $4)`,
          [productId, adminId, action, reason || null],
        );

        const sRes = await query("SELECT email FROM sellers WHERE id = $1", [product.seller_id]);
        if (sRes.rows[0]?.email) {
          await sendProductApprovalEmail(sRes.rows[0].email, product.name, action === "APPROVED", reason).catch(
            () => {},
          );
        }

        return sendJson(res, 200, {
          success: true,
          status: newStatus,
          message: `Product status updated to ${newStatus}`,
        });
      }

      return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
    } catch (error: any) {
      console.error("[PostgreSQL Admin Product Review Error]:", error);
      return sendJson(res, 500, { success: false, error: error.message });
    }
  }

  // Any other unknown /api/admin/* endpoint returns 404
  return sendJson(res, 404, { success: false, error: "Admin endpoint not found." });
}

