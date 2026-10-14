import { query } from "../db";
import { sendVendorApprovedEmail, sendVendorRejectedEmail, sendVendorMoreInfoEmail, sendProductApprovalEmail } from "../../lib/email.server";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
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
                const docsRes = await query("SELECT id, seller_id, doc_type, doc_number, file_path, is_verified FROM seller_documents");
                const bankRes = await query("SELECT id, seller_id, account_holder_name, bank_name, account_number, ifsc_code, is_verified FROM seller_bank_accounts");

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
                const adminId = body.adminId || "adm_product_01";

                const sRes = await query("SELECT email, owner_name, store_name, phone, password_hash FROM sellers WHERE id = $1", [sellerId]);
                const seller = sRes.rows[0];
                if (!seller) {
                  return sendJson(res, 404, { success: false, error: "Seller application not found" });
                }

                await query(
                  `UPDATE sellers 
                   SET status = $1, approved_by = $2, approved_at = CASE WHEN $1 = 'APPROVED' THEN now() ELSE NULL END, rejection_reason = $3, updated_at = now()
                   WHERE id = $4`,
                  [action, adminId, reason || null, sellerId]
                );

                // When approved, mirror into users table so the vendor can log in via /api/auth/signin
                if (action === "APPROVED") {
                  await query(
                    `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
                     VALUES ($1, $2, $3, $4, $5, 'seller', true)
                     ON CONFLICT (email) DO UPDATE SET role = 'seller', is_active = true`,
                    ['usr_' + sellerId.slice(4), seller.email, seller.phone, seller.password_hash, seller.owner_name]
                  ).catch((err) => console.warn("[Seller User Mirror Warning]:", err?.message));
                }

                await query(
                  `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id, details)
                   VALUES ($1, 'admin', $2, 'seller', $3, $4)`,
                  [adminId, `VENDOR_${action}`, sellerId, JSON.stringify({ reason })]
                );

                const host = req.headers.host || "localhost:8080";
                const loginUrl = `http://${host}/login`;

                // Dispatch transactional emails via Resend API
                if (action === "APPROVED") {
                  await sendVendorApprovedEmail(seller.email, seller.owner_name, seller.store_name, loginUrl).catch(() => {});
                } else if (action === "REJECTED") {
                  await sendVendorRejectedEmail(seller.email, seller.owner_name, seller.store_name, reason || "Application does not meet marketplace compliance standards.").catch(() => {});
                } else if (action === "MORE_INFORMATION_REQUIRED") {
                  await sendVendorMoreInfoEmail(seller.email, seller.owner_name, seller.store_name, reason || "Please provide clearer copies of your business documentation.").catch(() => {});
                }

                return sendJson(res, 200, { success: true, status: action, message: `Seller KYC updated to ${action}` });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              console.error("[PostgreSQL Admin Sellers API Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
          if (cleanUrl.startsWith("/api/admin/products") && cleanUrl.includes("/review")) {
            const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'products', productId, 'review']
            const productId = parts[3];

            try {
              if (method === "POST" && productId) {
                const body = await parseBody(req);
                const action = body.action as "APPROVED" | "REJECTED";
                const reason = body.reason || "";
                const adminId = body.adminId || "adm_product_01";

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
                  [newStatus, adminId, reason || null, productId]
                );

                await query(
                  `INSERT INTO product_approval_history (product_id, admin_id, action, reason)
                   VALUES ($1, $2, $3, $4)`,
                  [productId, adminId, action, reason || null]
                );

                const sRes = await query("SELECT email FROM sellers WHERE id = $1", [product.seller_id]);
                if (sRes.rows[0]?.email) {
                  await sendProductApprovalEmail(sRes.rows[0].email, product.name, action === "APPROVED", reason).catch(() => {});
                }

                return sendJson(res, 200, { success: true, status: newStatus, message: `Product status updated to ${newStatus}` });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              console.error("[PostgreSQL Admin Product Review Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
  return false;
}
