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
  // 1. GET /api/admin/orders & GET /api/admin/orders/:id
  // ====================================================================
  if (cleanUrl.startsWith("/api/admin/orders/")) {
    const orderId = decodeURIComponent(cleanUrl.slice("/api/admin/orders/".length).trim());
    if (method !== "GET") {
      return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
    }

    try {
      const orderRes = await query(`
        SELECT 
          o.id,
          o.order_number,
          o.customer_id,
          o.seller_id,
          o.total_amount,
          o.payment_method,
          COALESCE(o.payment_status, 'PENDING') as payment_status,
          COALESCE(o.status::text, 'placed') as raw_status,
          COALESCE(o.delivery_address, '') as delivery_address,
          o.created_at,
          COALESCE(c.full_name, cu.full_name, 'Customer') AS customer_name,
          COALESCE(c.phone, cu.phone, '') AS customer_phone,
          COALESCE(s.store_name, su.store_name, su.full_name, 'Seller Hub') AS seller_name,
          COALESCE(s.phone, su.phone, '') AS seller_phone,
          COALESCE(s.business_address, su.address, '') AS seller_address,
          COALESCE(s.city, su.city, '') AS city,
          d.id AS delivery_id,
          d.status::text AS delivery_status,
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
        WHERE o.id = $1 OR o.order_number = $1
        LIMIT 1
      `, [orderId]);

      if (orderRes.rows.length === 0) {
        return sendJson(res, 404, { success: false, error: "Order not found" });
      }

      const o = orderRes.rows[0];
      let items: Array<{ name: string; qty: number; price: number }> = [];
      try {
        const itemsRes = await query(`
          SELECT oi.quantity as qty, oi.unit_price as price, COALESCE(p.name, 'EV Component') as name
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1
        `, [o.id]);
        items = itemsRes.rows.map((it: any) => ({
          name: it.name,
          qty: Number(it.qty || 1),
          price: Number(it.price || 0),
        }));
      } catch {
        items = [];
      }

      // Check if order_status_history table exists
      let statusHistory = null;
      try {
        const histRes = await query(`
          SELECT status, created_at as timestamp, note, source
          FROM order_status_history
          WHERE order_id = $1
          ORDER BY created_at ASC
        `, [o.id]);
        if (histRes.rows.length > 0) {
          statusHistory = histRes.rows;
        }
      } catch {
        statusHistory = null;
      }

      const rawStatus = (o.delivery_status || o.raw_status || "PLACED").toUpperCase();
      let status = rawStatus;
      if (rawStatus === "PENDING" || rawStatus === "CONFIRMED" || rawStatus === "PLACED") status = "PLACED";
      else if (rawStatus === "READY_FOR_PICKUP" || rawStatus === "PACKED") status = "PACKED";

      const pRaw = (o.payment_status || "PENDING").toUpperCase();
      let paymentStatus: "PAID" | "COD_PENDING" | "PENDING" | "FAILED" = "PENDING";
      if (pRaw === "PAID") paymentStatus = "PAID";
      else if (pRaw === "COD_PENDING" || pRaw === "COD") paymentStatus = "COD_PENDING";
      else if (pRaw === "FAILED") paymentStatus = "FAILED";

      return sendJson(res, 200, {
        success: true,
        order: {
          id: o.id,
          orderNumber: o.order_number || `RZ-${o.id.slice(-6)}`,
          createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
          status,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          deliveryAddress: o.delivery_address,
          city: o.city,
          seller: {
            id: o.seller_id || "",
            name: o.seller_name,
          },
          sellerId: o.seller_id || "",
          sellerName: o.seller_name,
          sellerPhone: o.seller_phone,
          sellerAddress: o.seller_address,
          rider: o.rider_id ? {
            id: o.rider_id,
            name: o.rider_name || "Rider",
            phone: o.rider_phone || "",
          } : null,
          riderName: o.rider_name || null,
          riderPhone: o.rider_phone || null,
          payment: {
            method: o.payment_method || "UPI",
            status: paymentStatus,
          },
          paymentStatus,
          paymentMethod: o.payment_method || "UPI",
          amount: Number(o.total_amount || 0),
          items,
          statusHistory,
        },
      });
    } catch (err: any) {
      console.error("[Admin Order Detail Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  if (cleanUrl === "/api/admin/orders") {
    if (method !== "GET") {
      return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
    }

    try {
      const statusParam = queryParams.get("status");
      const sellerParam = queryParams.get("seller");
      const paymentParam = queryParams.get("payment");
      const qParam = queryParams.get("q");
      const cursorParam = queryParams.get("cursor");
      const limit = Math.min(Math.max(parseInt(queryParams.get("limit") || "25", 10) || 25, 1), 100);

      const conditions: string[] = [];
      const values: any[] = [];

      // Status filter
      if (statusParam && statusParam !== "ALL") {
        values.push(statusParam.toUpperCase());
        conditions.push(`(
          CASE 
            WHEN UPPER(COALESCE(d.status::text, o.status::text, 'PLACED')) IN ('PENDING', 'CONFIRMED', 'PLACED') THEN 'PLACED'
            WHEN UPPER(COALESCE(d.status::text, o.status::text, 'PLACED')) IN ('READY_FOR_PICKUP', 'PACKED') THEN 'PACKED'
            ELSE UPPER(COALESCE(d.status::text, o.status::text, 'PLACED'))
          END = $${values.length}
        )`);
      }

      // Seller filter
      if (sellerParam && sellerParam !== "ALL") {
        values.push(sellerParam);
        values.push(`%${sellerParam}%`);
        conditions.push(`(
          o.seller_id = $${values.length - 1} 
          OR COALESCE(s.store_name, su.store_name, su.full_name, '') ILIKE $${values.length}
        )`);
      }

      // Payment filter
      if (paymentParam && paymentParam !== "ALL") {
        values.push(paymentParam.toUpperCase());
        conditions.push(`UPPER(COALESCE(o.payment_status, 'PENDING')) = $${values.length}`);
      }

      // q search (order number, customer name, id)
      if (qParam && qParam.trim()) {
        values.push(`%${qParam.trim()}%`);
        conditions.push(`(
          o.order_number ILIKE $${values.length} 
          OR COALESCE(c.full_name, cu.full_name, '') ILIKE $${values.length}
          OR o.id ILIKE $${values.length}
        )`);
      }

      // Cursor pagination (newest first, created_at < cursor)
      if (cursorParam && cursorParam.trim()) {
        const cursorDate = new Date(cursorParam);
        if (!isNaN(cursorDate.getTime())) {
          values.push(cursorDate.toISOString());
          conditions.push(`o.created_at < $${values.length}`);
        }
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      values.push(limit + 1);
      const limitPlaceholder = `$${values.length}`;

      const ordersRes = await query(`
        SELECT 
          o.id,
          o.order_number,
          o.customer_id,
          o.seller_id,
          o.total_amount,
          o.payment_method,
          COALESCE(o.payment_status, 'PENDING') as payment_status,
          COALESCE(o.status::text, 'placed') as raw_status,
          COALESCE(o.delivery_address, '') as delivery_address,
          o.created_at,
          COALESCE(c.full_name, cu.full_name, 'Customer') AS customer_name,
          COALESCE(c.phone, cu.phone, '') AS customer_phone,
          COALESCE(s.store_name, su.store_name, su.full_name, 'Vendor Hub') AS seller_name,
          COALESCE(s.phone, su.phone, '') AS seller_phone,
          COALESCE(s.business_address, su.address, '') AS seller_address,
          COALESCE(s.city, su.city, '') AS city,
          d.id AS delivery_id,
          d.status::text AS delivery_status,
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
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ${limitPlaceholder}
      `, values);

      const hasMore = ordersRes.rows.length > limit;
      const ordersToReturn = hasMore ? ordersRes.rows.slice(0, limit) : ordersRes.rows;
      const nextCursor = (hasMore && ordersToReturn.length > 0)
        ? (ordersToReturn[ordersToReturn.length - 1].created_at ? new Date(ordersToReturn[ordersToReturn.length - 1].created_at).toISOString() : null)
        : null;

      // Load order items for the fetched orders
      const itemsMap = new Map<string, Array<{ name: string; qty: number; price: number }>>();
      if (ordersToReturn.length > 0) {
        try {
          const orderIds = ordersToReturn.map((o: any) => o.id);
          const itemsRes = await query(`
            SELECT oi.order_id, oi.quantity as qty, oi.unit_price as price, COALESCE(p.name, 'EV Part Component') as name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ANY($1)
          `, [orderIds]);
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
      }

      // Compute summary metrics (total, inProgress, delivered, awaitingSeller, unassignedRider)
      let summary = {
        total: 0,
        inProgress: 0,
        delivered: 0,
        awaitingSeller: 0,
        unassignedRider: 0,
      };

      try {
        const summaryRes = await query(`
          SELECT 
            COUNT(*)::int AS total,
            COUNT(CASE WHEN normalized_status IN ('ACCEPTED', 'PACKED', 'RIDER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT') THEN 1 END)::int AS in_progress,
            COUNT(CASE WHEN normalized_status = 'DELIVERED' THEN 1 END)::int AS delivered,
            COUNT(CASE WHEN normalized_status = 'PLACED' THEN 1 END)::int AS awaiting_seller,
            COUNT(CASE WHEN normalized_status = 'PACKED' AND rider_id IS NULL THEN 1 END)::int AS unassigned_rider
          FROM (
            SELECT 
              o.id,
              d.rider_id,
              CASE 
                WHEN UPPER(COALESCE(d.status::text, o.status::text, 'PLACED')) IN ('PENDING', 'CONFIRMED', 'PLACED') THEN 'PLACED'
                WHEN UPPER(COALESCE(d.status::text, o.status::text, 'PLACED')) IN ('READY_FOR_PICKUP', 'PACKED') THEN 'PACKED'
                ELSE UPPER(COALESCE(d.status::text, o.status::text, 'PLACED'))
              END AS normalized_status
            FROM orders o
            LEFT JOIN deliveries d ON d.order_id = o.id
          ) sub
        `);
        if (summaryRes.rows.length > 0) {
          const s = summaryRes.rows[0];
          summary = {
            total: Number(s.total || 0),
            inProgress: Number(s.in_progress || 0),
            delivered: Number(s.delivered || 0),
            awaitingSeller: Number(s.awaiting_seller || 0),
            unassignedRider: Number(s.unassigned_rider || 0),
          };
        }
      } catch {
        // Fallback calculation from returned batch
        summary = {
          total: ordersToReturn.length,
          inProgress: ordersToReturn.filter((o: any) => ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes((o.delivery_status || o.raw_status || "").toUpperCase())).length,
          delivered: ordersToReturn.filter((o: any) => (o.delivery_status || o.raw_status || "").toUpperCase() === "DELIVERED").length,
          awaitingSeller: ordersToReturn.filter((o: any) => ["PENDING", "CONFIRMED", "PLACED"].includes((o.delivery_status || o.raw_status || "").toUpperCase())).length,
          unassignedRider: ordersToReturn.filter((o: any) => ["READY_FOR_PICKUP", "PACKED"].includes((o.delivery_status || o.raw_status || "").toUpperCase()) && !o.rider_id).length,
        };
      }

      const results = ordersToReturn.map((o: any) => {
        const rawStatus = (o.delivery_status || o.raw_status || "PLACED").toUpperCase();
        let status = rawStatus;
        if (rawStatus === "PENDING" || rawStatus === "CONFIRMED" || rawStatus === "PLACED") status = "PLACED";
        else if (rawStatus === "READY_FOR_PICKUP" || rawStatus === "PACKED") status = "PACKED";

        const pRaw = (o.payment_status || "PENDING").toUpperCase();
        let paymentStatus: "PAID" | "COD_PENDING" | "PENDING" | "FAILED" = "PENDING";
        if (pRaw === "PAID") paymentStatus = "PAID";
        else if (pRaw === "COD_PENDING" || pRaw === "COD") paymentStatus = "COD_PENDING";
        else if (pRaw === "FAILED") paymentStatus = "FAILED";

        const items = itemsMap.get(o.id) || [];

        return {
          id: o.id,
          orderNumber: o.order_number || `RZ-${o.id.slice(-6)}`,
          createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
          status,
          customerName: o.customer_name || "Customer",
          customerPhone: o.customer_phone || "",
          deliveryAddress: o.delivery_address || "",
          city: o.city || "",
          seller: {
            id: o.seller_id || "",
            name: o.seller_name || "Seller",
          },
          sellerId: o.seller_id || "",
          sellerName: o.seller_name || "Seller",
          sellerPhone: o.seller_phone || "",
          sellerAddress: o.seller_address || "",
          rider: o.rider_id ? {
            id: o.rider_id,
            name: o.rider_name || "Rider",
            phone: o.rider_phone || "",
          } : null,
          riderName: o.rider_name || null,
          riderPhone: o.rider_phone || null,
          payment: {
            method: o.payment_method || "UPI",
            status: paymentStatus,
          },
          paymentStatus,
          paymentMethod: o.payment_method || "UPI",
          amount: Number(o.total_amount || 0),
          items,
          statusHistory: null, // Table does not exist in schema; returning null per contract
        };
      });

      return sendJson(res, 200, {
        success: true,
        orders: results,
        summary,
        nextCursor,
      });
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

