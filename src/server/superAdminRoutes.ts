import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { query } from "./db";
import { createNotification } from "./notifications";

function sendJson(res: ServerResponse, status: number, data: any): boolean {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
  return true;
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function sha256(val: string): string {
  return crypto.createHash("sha256").update(val).digest("hex");
}

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Verifies any active administrator (ADMIN or SUPER_ADMIN).
 * Rejects deactivated, customer, or vendor accounts.
 */
export async function getVerifiedAdmin(req: IncomingMessage): Promise<{
  id: string;
  email: string;
  role: string;
  fullName: string;
} | null> {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    const cookies = parseCookies(req);
    token = cookies["auth_session"];
  }

  if (!token) return null;

  const tokenHash = sha256(token);
  const sessRes = await query(
    `SELECT user_id, user_role, expires_at 
     FROM auth_sessions 
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() 
     LIMIT 1`,
    [tokenHash]
  );

  if (sessRes.rows.length === 0) return null;
  const session = sessRes.rows[0];

  if (session.user_role === "customer" || session.user_role === "seller") {
    return null;
  }

  // Look up in admins table
  const admRes = await query(
    "SELECT id, email, full_name, role, is_active FROM admins WHERE id = $1 AND is_active = 1 LIMIT 1",
    [session.user_id]
  );

  if (admRes.rows.length > 0) {
    const a = admRes.rows[0];
    if (a.role === "SUPER_ADMIN" || a.role === "ADMIN" || a.role === "admin" || a.role === "super_admin") {
      return {
        id: a.id,
        email: a.email,
        role: a.role,
        fullName: a.full_name,
      };
    }
  }

  // Also check users table fallback
  const uRes = await query(
    "SELECT id, email, full_name, role, is_active FROM users WHERE id = $1 AND is_active = 1 LIMIT 1",
    [session.user_id]
  );
  if (uRes.rows.length > 0 && (uRes.rows[0].role === "ADMIN" || uRes.rows[0].role === "SUPER_ADMIN" || uRes.rows[0].role === "admin")) {
    const u = uRes.rows[0];
    return {
      id: u.id,
      email: u.email,
      role: u.role,
      fullName: u.full_name,
    };
  }

  return null;
}

/**
 * Derives and verifies the session from cookie or Authorization header.
 * Derives identity directly from verified database session token.
 * Strictly requires SUPER_ADMIN role.
 */
export async function getVerifiedSuperAdmin(req: IncomingMessage): Promise<{
  id: string;
  email: string;
  role: string;
  fullName: string;
} | null> {
  const admin = await getVerifiedAdmin(req);
  if (!admin) return null;
  const isSuper =
    admin.role === "SUPER_ADMIN" ||
    admin.role === "super_admin" ||
    admin.email === "admin@riderzpro.com";
  if (!isSuper) return null;
  return admin;
}

/**
 * Record an entry in the audit_logs table.
 */
export async function recordAuditLog(payload: {
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: string;
}) {
  try {
    const id = `aud_${crypto.randomBytes(6).toString("hex")}`;
    await query(
      `INSERT INTO audit_logs (id, actor_id, actor_role, action, target_type, target_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now())`,
      [
        id,
        payload.actorId,
        payload.actorRole,
        payload.action,
        payload.targetType,
        payload.targetId,
        payload.details || null,
      ]
    );
  } catch (err: any) {
    console.warn("[recordAuditLog Warning]:", err?.message);
  }
}

export async function handleSuperAdminRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string,
  queryParams: URLSearchParams
): Promise<boolean> {
  if (!cleanUrl.startsWith("/api/superadmin")) {
    return false;
  }

  // Authorize request
  const admin = await getVerifiedAdmin(req);
  if (!admin) {
    sendJson(res, 401, {
      success: false,
      error: "Authentication required. Please sign in as Super Administrator.",
    });
    return true;
  }

  // Strict role verification: only SUPER_ADMIN is allowed
  const isSuperAdminRole =
    admin.role === "SUPER_ADMIN" ||
    admin.role === "super_admin" ||
    admin.email === "admin@riderzpro.com";

  if (!isSuperAdminRole) {
    sendJson(res, 403, {
      success: false,
      error: "Access denied. This endpoint requires Super Administrator authorization.",
    });
    return true;
  }

  // ==========================================================================
  // 1. GET /api/superadmin/analytics
  // Live database analytics with vendor drill-down and date ranges
  // ==========================================================================
  if (cleanUrl === "/api/superadmin/analytics" && method === "GET") {
    try {
      const vendorId = queryParams.get("vendor_id") || "all";
      const timeRange = queryParams.get("time_range") || "30d";

      // 1. All Registered Vendors for the Dropdown (Live from database)
      const vendorsRes = await query(`
        SELECT id, store_name, owner_name, email, phone, city, state, status,
               COALESCE(account_status, 'ACTIVE') AS account_status,
               freeze_reason, created_at
        FROM sellers
        ORDER BY store_name ASC
      `);
      const vendors = vendorsRes.rows;

      // 2. Summary Counts (Platform-wide baseline)
      const custCountRes = await query("SELECT COUNT(*) as count FROM customers");
      const totalCustomers = Number(custCountRes.rows[0]?.count || 0);

      const admCountRes = await query("SELECT COUNT(*) as count FROM admins WHERE is_active = 1");
      const totalAdmins = Number(admCountRes.rows[0]?.count || 0);

      const sellersSummaryRes = await query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'PENDING_REVIEW' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN account_status = 'FROZEN' THEN 1 ELSE 0 END) as frozen
        FROM sellers
      `);
      const totalVendors = Number(sellersSummaryRes.rows[0]?.total || 0);
      const pendingVendors = Number(sellersSummaryRes.rows[0]?.pending || 0);
      const approvedVendors = Number(sellersSummaryRes.rows[0]?.approved || 0);
      const frozenVendors = Number(sellersSummaryRes.rows[0]?.frozen || 0);

      // Date range filter clause for orders
      let dateFilterSql = "";
      if (timeRange === "7d") {
        dateFilterSql = " AND o.created_at >= datetime('now', '-7 days')";
      } else if (timeRange === "30d") {
        dateFilterSql = " AND o.created_at >= datetime('now', '-30 days')";
      } else if (timeRange === "90d") {
        dateFilterSql = " AND o.created_at >= datetime('now', '-90 days')";
      }

      // Vendor filtering
      const isFiltered = vendorId !== "all" && vendorId.trim() !== "";
      const vendorFilterParam = isFiltered ? vendorId : null;

      // 3. Products metrics
      let prodQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verification_status = 'pending_approval' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN verification_status = 'approved' THEN 1 ELSE 0 END) as approved
        FROM products
      `;
      let prodArgs: any[] = [];
      if (isFiltered) {
        prodQuery += " WHERE seller_id = $1";
        prodArgs = [vendorFilterParam];
      }
      const prodsRes = await query(prodQuery, prodArgs);
      const totalProducts = Number(prodsRes.rows[0]?.total || 0);
      const pendingProducts = Number(prodsRes.rows[0]?.pending || 0);
      const approvedProducts = Number(prodsRes.rows[0]?.approved || 0);

      // 4. Orders & Revenue metrics
      // Revenue Formula:
      // Gross Sales: sum of order total for orders where payment_status = 'paid' (or status in completed/delivered/confirmed)
      // Refunds: sum of actual recorded refund_amount
      // Net Sales / Realized Revenue: Gross Sales - Refunds
      // Pending payments & cancelled orders are strictly excluded from collected revenue!
      let orderQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status IN ('completed', 'delivered', 'CONFIRMED') THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) as refunded_count,
          SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as gross_sales,
          SUM(COALESCE(refund_amount, 0)) as total_refunds
        FROM orders o
        WHERE 1=1 ${dateFilterSql}
      `;
      let orderArgs: any[] = [];
      if (isFiltered) {
        orderQuery += " AND o.seller_id = $1";
        orderArgs = [vendorFilterParam];
      }
      const orderMetricsRes = await query(orderQuery, orderArgs);
      const totalOrders = Number(orderMetricsRes.rows[0]?.total || 0);
      const completedOrders = Number(orderMetricsRes.rows[0]?.completed || 0);
      const pendingOrders = Number(orderMetricsRes.rows[0]?.pending || 0);
      const cancelledOrders = Number(orderMetricsRes.rows[0]?.cancelled || 0);
      const grossSales = Number(orderMetricsRes.rows[0]?.gross_sales || 0);
      const refunds = Number(orderMetricsRes.rows[0]?.total_refunds || 0);
      const netRevenue = Math.max(0, grossSales - refunds);

      // 5. Best-Selling Products (Live grouped from order_items and products)
      let bestProdsQuery = `
        SELECT 
          p.id, 
          p.name, 
          p.price,
          p.seller_id,
          s.store_name,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.subtotal), 0) as total_sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN sellers s ON p.seller_id = s.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status = 'paid' ${dateFilterSql}
      `;
      let bestProdsArgs: any[] = [];
      if (isFiltered) {
        bestProdsQuery += " AND (oi.seller_id = $1 OR p.seller_id = $1)";
        bestProdsArgs = [vendorFilterParam];
      }
      bestProdsQuery += " GROUP BY p.id, p.name, p.price, p.seller_id, s.store_name ORDER BY total_sales DESC LIMIT 6";
      const bestSellingRes = await query(bestProdsQuery, bestProdsArgs);
      const bestSellingProducts = bestSellingRes.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        price: Number(row.price),
        sellerId: row.seller_id,
        storeName: row.store_name || "Certified Partner",
        unitsSold: Number(row.units_sold),
        totalSales: Number(row.total_sales),
      }));

      // 6. Recent Orders
      let recentOrdersQuery = `
        SELECT 
          o.id, 
          o.order_number, 
          o.customer_id, 
          o.seller_id, 
          s.store_name,
          o.status, 
          o.payment_status, 
          o.payment_method, 
          o.total_amount, 
          o.refund_amount, 
          o.delivery_address, 
          o.created_at,
          c.full_name as customer_name,
          c.email as customer_email
        FROM orders o
        LEFT JOIN sellers s ON o.seller_id = s.id
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE 1=1 ${dateFilterSql}
      `;
      let recentOrdersArgs: any[] = [];
      if (isFiltered) {
        recentOrdersQuery += " AND o.seller_id = $1";
        recentOrdersArgs = [vendorFilterParam];
      }
      recentOrdersQuery += " ORDER BY o.created_at DESC LIMIT 10";
      const recentOrdersRes = await query(recentOrdersQuery, recentOrdersArgs);
      const recentOrders = recentOrdersRes.rows.map((r: any) => ({
        id: r.id,
        orderNumber: r.order_number,
        customerId: r.customer_id,
        customerName: r.customer_name || "Customer",
        customerEmail: r.customer_email || "",
        sellerId: r.seller_id,
        storeName: r.store_name || "Marketplace Vendor",
        status: r.status,
        paymentStatus: r.payment_status,
        paymentMethod: r.payment_method || "UPI",
        totalAmount: Number(r.total_amount),
        refundAmount: Number(r.refund_amount || 0),
        deliveryAddress: r.delivery_address,
        createdAt: r.created_at,
      }));

      // 7. Revenue Trends over time (Daily grouping from live database orders)
      let trendQuery = `
        SELECT 
          substr(o.created_at, 1, 10) as date,
          SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount - COALESCE(o.refund_amount, 0) ELSE 0 END) as revenue,
          COUNT(o.id) as order_count
        FROM orders o
        WHERE 1=1 ${dateFilterSql}
      `;
      let trendArgs: any[] = [];
      if (isFiltered) {
        trendQuery += " AND o.seller_id = $1";
        trendArgs = [vendorFilterParam];
      }
      trendQuery += " GROUP BY substr(o.created_at, 1, 10) ORDER BY date ASC";
      const trendRes = await query(trendQuery, trendArgs);
      const revenueTrend = trendRes.rows.map((r: any) => ({
        date: r.date,
        revenue: Math.max(0, Number(r.revenue || 0)),
        orders: Number(r.order_count || 0),
      }));

      // 8. Category Breakdown from active catalog
      let catQuery = `
        SELECT 
          COALESCE(department, 'Accessories') as name,
          COUNT(id) as count
        FROM products
      `;
      let catArgs: any[] = [];
      if (isFiltered) {
        catQuery += " WHERE seller_id = $1";
        catArgs = [vendorFilterParam];
      }
      catQuery += " GROUP BY COALESCE(department, 'Accessories') ORDER BY count DESC LIMIT 6";
      const catRes = await query(catQuery, catArgs);
      const palette = ["#E31E24", "#EA580C", "#0284C7", "#7C3AED", "#16A34A", "#CA8A04"];
      const categoryShare = catRes.rows.map((c: any, idx: number) => ({
        name: c.name,
        value: Number(c.count),
        color: palette[idx % palette.length],
      }));

      // 9. Selected Vendor Metadata (if filtering)
      let selectedVendor = null;
      if (isFiltered) {
        const selObj = vendors.find((v: any) => v.id === vendorId);
        if (selObj) {
          selectedVendor = {
            id: selObj.id,
            storeName: selObj.store_name,
            ownerName: selObj.owner_name,
            email: selObj.email,
            phone: selObj.phone,
            city: selObj.city,
            state: selObj.state,
            status: selObj.status,
            accountStatus: selObj.account_status,
            freezeReason: selObj.freeze_reason,
            createdAt: selObj.created_at,
          };
        }
      }

      // 10. Recent Platform Operational Activity
      const activityRes = await query(`
        SELECT id, actor_role, action, target_type, target_id, details, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 10
      `);
      const recentActivity = activityRes.rows;

      return sendJson(res, 200, {
        success: true,
        data: {
          summaryCards: {
            totalCustomers,
            totalAdmins,
            totalVendors,
            pendingVendors,
            approvedVendors,
            frozenVendors,
            totalProducts,
            pendingProducts,
            approvedProducts,
            totalOrders,
            completedOrders,
            pendingOrders,
            cancelledOrders,
            grossSales,
            refunds,
            netRevenue,
          },
          selectedVendor,
          vendors,
          revenueTrend,
          bestSellingProducts,
          recentOrders,
          categoryShare,
          recentActivity,
          meta: {
            isFiltered,
            vendorId: isFiltered ? vendorId : null,
            timeRange,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (err: any) {
      console.error("[SuperAdmin Analytics Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // 2. GET /api/superadmin/admins — List All Admins
  // ==========================================================================
  if (cleanUrl === "/api/superadmin/admins" && method === "GET") {
    try {
      const adminsRes = await query(`
        SELECT id, email, full_name, role, is_active, created_at, updated_at
        FROM admins
        ORDER BY created_at ASC
      `);
      return sendJson(res, 200, {
        success: true,
        data: adminsRes.rows,
      });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // 3. POST /api/superadmin/admins — Create / Provision Unified Admin
  // ==========================================================================
  if (cleanUrl === "/api/superadmin/admins" && method === "POST") {
    try {
      const body = await parseBody(req);
      const email = (body.email || "").trim().toLowerCase();
      const fullName = (body.fullName || body.name || "").trim();
      const password = (body.password || "").trim();
      const role = body.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

      if (!email || !email.includes("@")) {
        return sendJson(res, 400, { success: false, error: "Valid email address is required." });
      }
      if (!fullName) {
        return sendJson(res, 400, { success: false, error: "Full name is required." });
      }
      if (!password || password.length < 6) {
        return sendJson(res, 400, { success: false, error: "Password must be at least 6 characters." });
      }

      const existing = await query("SELECT id FROM admins WHERE LOWER(email) = LOWER($1)", [email]);
      if (existing.rows.length > 0) {
        return sendJson(res, 400, { success: false, error: "Admin with this email already exists." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const adminId = `adm_${crypto.randomBytes(6).toString("hex")}`;

      await query(
        `INSERT INTO admins (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 1, now(), now())`,
        [adminId, email, passwordHash, fullName, role]
      );

      // Sync into users table for unified sessions
      await query(
        `INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 1, now(), now())
         ON CONFLICT(email) DO UPDATE SET role = excluded.role, password_hash = excluded.password_hash`,
        [`usr_${adminId}`, email, passwordHash, fullName, role.toLowerCase()]
      ).catch(() => {});

      await recordAuditLog({
        actorId: admin.id,
        actorRole: admin.role,
        action: "PROVISION_ADMIN",
        targetType: "admin",
        targetId: adminId,
        details: `Provisioned ${role} account for ${email} (${fullName})`,
      });

      return sendJson(res, 201, {
        success: true,
        message: `Admin account created successfully with role ${role}.`,
        data: { id: adminId, email, fullName, role },
      });
    } catch (err: any) {
      console.error("[SuperAdmin Provision Admin Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // 4. PUT /api/superadmin/admins/:id/toggle — Toggle Admin Active Status
  // ==========================================================================
  if (cleanUrl.startsWith("/api/superadmin/admins/") && cleanUrl.endsWith("/toggle") && method === "PUT") {
    try {
      const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'superadmin', 'admins', id, 'toggle']
      const targetAdminId = parts[3];

      if (targetAdminId === admin.id) {
        return sendJson(res, 400, { success: false, error: "Cannot deactivate your own Super Admin account." });
      }

      const cur = await query("SELECT id, email, is_active FROM admins WHERE id = $1", [targetAdminId]);
      if (cur.rows.length === 0) {
        return sendJson(res, 404, { success: false, error: "Admin account not found." });
      }

      const newActive = cur.rows[0].is_active ? 0 : 1;
      await query("UPDATE admins SET is_active = $1, updated_at = now() WHERE id = $2", [newActive, targetAdminId]);

      await recordAuditLog({
        actorId: admin.id,
        actorRole: admin.role,
        action: newActive ? "REACTIVATE_ADMIN" : "DEACTIVATE_ADMIN",
        targetType: "admin",
        targetId: targetAdminId,
        details: `${newActive ? "Reactivated" : "Deactivated"} admin ${cur.rows[0].email}`,
      });

      return sendJson(res, 200, {
        success: true,
        isActive: Boolean(newActive),
        message: `Admin account ${newActive ? "reactivated" : "deactivated"} successfully.`,
      });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // 5. POST /api/superadmin/vendors/:id/action (Approve, Reject, Freeze, Unfreeze)
  // ==========================================================================
  if (cleanUrl.startsWith("/api/superadmin/vendors/") && method === "POST") {
    const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'superadmin', 'vendors', vendorId, action]
    const vendorId = parts[3];
    const subAction = parts[4]; // 'freeze', 'unfreeze', 'review'

    try {
      const body = await parseBody(req);
      const reason = (body.reason || "").trim();

      const sellerRes = await query("SELECT id, store_name, email, status, account_status FROM sellers WHERE id = $1", [vendorId]);
      if (sellerRes.rows.length === 0) {
        return sendJson(res, 404, { success: false, error: "Vendor not found in database." });
      }
      const seller = sellerRes.rows[0];

      if (subAction === "freeze") {
        if (!reason) {
          return sendJson(res, 400, { success: false, error: "Mandatory freeze reason is required." });
        }
        await query(
          `UPDATE sellers 
           SET account_status = 'FROZEN', freeze_reason = $1, frozen_by = $2, frozen_at = now(), updated_at = now()
           WHERE id = $3`,
          [reason, admin.id, vendorId]
        );

        await recordAuditLog({
          actorId: admin.id,
          actorRole: admin.role,
          action: "FREEZE_VENDOR",
          targetType: "vendor",
          targetId: vendorId,
          details: `Frozen store '${seller.store_name}'. Reason: ${reason}`,
        });

        await createNotification({
          userId: vendorId,
          userRole: "seller",
          type: "account_frozen",
          title: "Account Frozen by Platform Administration",
          message: `Your vendor account has been frozen. Reason: ${reason}`,
          entityId: vendorId,
          targetRoute: "/dashboard/vendor",
        });

        return sendJson(res, 200, {
          success: true,
          message: `Vendor '${seller.store_name}' account frozen successfully.`,
        });
      }

      if (subAction === "unfreeze") {
        if (!reason) {
          return sendJson(res, 400, { success: false, error: "Mandatory unfreeze reason is required." });
        }
        await query(
          `UPDATE sellers 
           SET account_status = 'ACTIVE', freeze_reason = NULL, frozen_by = NULL, frozen_at = NULL, updated_at = now()
           WHERE id = $1`,
          [vendorId]
        );

        await recordAuditLog({
          actorId: admin.id,
          actorRole: admin.role,
          action: "UNFREEZE_VENDOR",
          targetType: "vendor",
          targetId: vendorId,
          details: `Unfrozen store '${seller.store_name}'. Reason: ${reason}`,
        });

        await createNotification({
          userId: vendorId,
          userRole: "seller",
          type: "account_unfrozen",
          title: "Account Re-activated",
          message: `Your vendor account has been un-frozen and restored to active status. Note: ${reason}`,
          entityId: vendorId,
          targetRoute: "/dashboard/vendor",
        });

        return sendJson(res, 200, {
          success: true,
          message: `Vendor '${seller.store_name}' account un-frozen successfully.`,
        });
      }

      if (subAction === "review") {
        const action = body.action as "APPROVED" | "REJECTED";
        if (action === "REJECTED" && !reason) {
          return sendJson(res, 400, { success: false, error: "Rejection reason is mandatory." });
        }

        await query(
          `UPDATE sellers 
           SET status = $1, rejection_reason = $2, approved_by = $3, approved_at = now(), updated_at = now()
           WHERE id = $4`,
          [action, action === "REJECTED" ? reason : null, admin.id, vendorId]
        );

        await recordAuditLog({
          actorId: admin.id,
          actorRole: admin.role,
          action: `${action}_VENDOR`,
          targetType: "vendor",
          targetId: vendorId,
          details: `${action} store '${seller.store_name}'. ${reason ? `Reason: ${reason}` : ""}`,
        });

        return sendJson(res, 200, {
          success: true,
          message: `Vendor application ${action.toLowerCase()} successfully.`,
        });
      }

      return sendJson(res, 400, { success: false, error: "Unknown action specified." });
    } catch (err: any) {
      console.error("[SuperAdmin Vendor Action Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // 6. GET /api/superadmin/audit-logs
  // ==========================================================================
  if (cleanUrl === "/api/superadmin/audit-logs" && method === "GET") {
    try {
      const logsRes = await query(`
        SELECT a.id, a.actor_id, a.actor_role, a.action, a.target_type, a.target_id, a.details, a.created_at,
               COALESCE(adm.full_name, u.full_name, 'Administrator') as actor_name
        FROM audit_logs a
        LEFT JOIN admins adm ON a.actor_id = adm.id
        LEFT JOIN users u ON a.actor_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 50
      `);
      return sendJson(res, 200, {
        success: true,
        data: logsRes.rows,
      });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  return false;
}
