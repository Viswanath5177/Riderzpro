import crypto from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { query, isPostgresAvailable } from "../db";
import { parseBody, sendJson } from "./http";
import { buildGstInvoice, renderInvoiceHtml } from "../../lib/invoice";
import {
  memoryGetOrder,
  memoryListAllOrders,
  memoryListOrdersForCustomer,
  memorySaveOrder,
  memoryUpdateOrder,
  toApiOrderShape,
  type StoredOrder,
  type StoredOrderItem,
} from "../ordersStore";

const DELIVERY_FEE = 150;
const GST_RATE = 0.18;

function parseCookies(req: IncomingMessage): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k) out[k] = decodeURIComponent(rest.join("=") || "");
  }
  return out;
}

function resolveCustomerId(req: IncomingMessage, bodyCustomerId?: string): string {
  if (bodyCustomerId) return String(bodyCustomerId);
  const cookies = parseCookies(req);
  return cookies["riderzpro_uid"] || cookies["uid"] || "cst_guest";
}

async function lookupProductPrice(
  productId: string,
): Promise<{ name: string; price: number; imageUrl: string } | null> {
  try {
    const res = await query(
      `SELECT id, name, COALESCE(price, 0) as price, COALESCE(image_url, '') as image_url
       FROM products WHERE id = $1 LIMIT 1`,
      [productId],
    );
    if (res.rows[0] && Number(res.rows[0].price) > 0) {
      return {
        name: String(res.rows[0].name || "EV Part"),
        price: Number(res.rows[0].price) || 0,
        imageUrl: String(res.rows[0].image_url || "/src/assets/parts.jpg"),
      };
    }
  } catch {
    // fall through to catalog seed
  }

  // Server-side catalog seed (never trust browser prices)
  try {
    const { getProduct, getBestOffer } = await import("../../lib/data");
    const product = getProduct(productId);
    if (product) {
      const offer = getBestOffer(productId);
      const price = Number(offer?.price) || 0;
      if (price > 0) {
        return {
          name: product.name,
          price,
          imageUrl: product.image || "/src/assets/parts.jpg",
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function loadOrderFromDb(idOrNumber: string): Promise<StoredOrder | null> {
  if (!isPostgresAvailable) return null;
  try {
    const res = await query(
      `SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email
       FROM orders o
       LEFT JOIN users c ON o.customer_id = c.id
       WHERE o.id = $1 OR o.order_number = $1
       LIMIT 1`,
      [idOrNumber],
    );
    if (!res.rows[0]) return null;
    const row = res.rows[0];

    let itemsRes = { rows: [] as any[] };
    try {
      itemsRes = await query(
        `SELECT oi.*, p.name as product_name, p.image_url
         FROM order_items oi
         LEFT JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [row.id],
      );
    } catch {
      // order_items may be empty
    }

    let shipping: Record<string, unknown> = {};
    const rawShip = row.shipping_address || row.delivery_address;
    if (rawShip) {
      try {
        shipping = typeof rawShip === "string" ? JSON.parse(rawShip) : rawShip;
      } catch {
        shipping = { street: String(rawShip) };
      }
    }

    const items: StoredOrderItem[] = (itemsRes.rows || []).map((it: any) => ({
      productId: String(it.product_id),
      name: String(it.product_name || "EV Part"),
      imageUrl: String(it.image_url || "/src/assets/parts.jpg"),
      qty: Number(it.quantity || 1),
      unitPrice: Number(it.unit_price || 0),
      lineTotal: Number(it.subtotal || 0),
      sellerId: String(row.seller_id || "v1"),
      sellerName: "Seller",
    }));

    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    const totalAmount = Number(row.total_amount) || 0;

    return {
      id: String(row.id),
      orderNumber: String(row.order_number || row.id),
      customerId: String(row.customer_id || "cst_guest"),
      sellerId: String(row.seller_id || "v1"),
      status: String(row.order_status || row.status || "PLACED"),
      totalAmount,
      subtotal: subtotal || Math.max(0, totalAmount - DELIVERY_FEE),
      deliveryFee: DELIVERY_FEE,
      discount: 0,
      tax: Math.round(Math.max(0, (subtotal || totalAmount) - DELIVERY_FEE) * GST_RATE * 100) / 100,
      paymentMethod: String(row.payment_method || "UPI"),
      paymentStatus: String(row.payment_status || "PENDING"),
      shippingAddress: shipping,
      contact: {
        name: String(row.customer_name || shipping.name || "Customer"),
        phone: String(row.customer_phone || shipping.phone || ""),
        email: row.customer_email ? String(row.customer_email) : undefined,
      },
      items,
      razorpayOrderId: row.razorpay_order_id || undefined,
      razorpayPaymentId: row.razorpay_payment_id || undefined,
      createdAt: row.created_at
        ? new Date(row.created_at).toISOString()
        : new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn("[Orders] DB load failed:", err?.message);
    return null;
  }
}

export async function getOrderTotalRupees(idOrNumber: string): Promise<{
  order: StoredOrder;
  totalRupees: number;
} | null> {
  const mem = memoryGetOrder(idOrNumber);
  if (mem) return { order: mem, totalRupees: mem.totalAmount };

  const dbOrder = await loadOrderFromDb(idOrNumber);
  if (dbOrder) {
    memorySaveOrder(dbOrder);
    return { order: dbOrder, totalRupees: dbOrder.totalAmount };
  }
  return null;
}

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined,
  queryParams: URLSearchParams,
): Promise<boolean> {
  // GET invoice — Muni/Sathwik endpoint used by DownloadInvoiceButton
  const invoiceMatch =
    cleanUrl.match(/^\/api\/orders\/([^/]+)\/invoice$/) ||
    cleanUrl.match(/^\/api\/invoices\/([^/]+)$/);
  if (invoiceMatch && method === "GET") {
    try {
      const orderId = decodeURIComponent(invoiceMatch[1]);
      const format = queryParams.get("format") || "html";

      const found = await getOrderTotalRupees(orderId);
      const order = found?.order;

      if (!order) {
        return sendJson(res, 404, { success: false, error: "Order not found" });
      }

      const shipping = order.shippingAddress || {};
      const invoiceItems =
        order.items.length > 0
          ? order.items.map((it) => ({
              name: it.name,
              category: "EV Parts",
              price: it.unitPrice,
              qty: it.qty,
            }))
          : [
              {
                name: "EV Parts Order",
                category: "EV Parts",
                price: Math.max(0, order.totalAmount - order.deliveryFee),
                qty: 1,
              },
            ];

      const invoice = buildGstInvoice({
        orderId: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        customerName: order.contact.name,
        customerPhone: order.contact.phone,
        customerEmail: order.contact.email,
        shippingAddress: {
          street: String(shipping.street || ""),
          city: String(shipping.city || "Delhi"),
          state: String(shipping.state || "Delhi"),
          pincode: String(shipping.pincode || "110001"),
          phone: String(shipping.phone || order.contact.phone || ""),
        },
        gstin: shipping.gstin ? String(shipping.gstin) : undefined,
        businessName: shipping.businessName ? String(shipping.businessName) : undefined,
        items: invoiceItems,
        deliveryTotal: order.deliveryFee,
        discount: order.discount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus as any,
        paymentId: order.razorpayPaymentId,
      });

      if (format === "json") {
        return sendJson(res, 200, { success: true, invoice });
      }

      const html = renderInvoiceHtml(invoice);
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
      });
      res.end(html);
      return true;
    } catch (invErr: any) {
      console.error("[Invoice Route Error]:", invErr);
      return sendJson(res, 500, { success: false, error: invErr.message });
    }
  }

  // GET /api/orders/mine
  if (cleanUrl === "/api/orders/mine" && method === "GET") {
    try {
      const customerId = resolveCustomerId(req);
      let list = memoryListOrdersForCustomer(customerId);

      if (isPostgresAvailable) {
        try {
          const dbRes = await query(
            `SELECT id, order_number FROM orders
             WHERE customer_id = $1
             ORDER BY created_at DESC
             LIMIT 50`,
            [customerId],
          );
          for (const row of dbRes.rows) {
            const loaded = await loadOrderFromDb(String(row.id));
            if (loaded) memorySaveOrder(loaded);
          }
          list = memoryListOrdersForCustomer(customerId);
          if (list.length === 0 && customerId === "cst_guest") {
            list = memoryListAllOrders();
          }
        } catch (err: any) {
          console.warn("[Orders /mine] DB list failed:", err?.message);
        }
      }

      return sendJson(res, 200, {
        success: true,
        data: list.map(toApiOrderShape),
      });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // GET /api/orders/:id (not invoice, not bare /api/orders)
  const orderMatch = cleanUrl.match(/^\/api\/orders\/([^/]+)$/);
  if (orderMatch && method === "GET") {
    try {
      const id = decodeURIComponent(orderMatch[1]);
      const found = await getOrderTotalRupees(id);
      if (!found) {
        return sendJson(res, 404, {
          success: false,
          error: { code: "ORDER_NOT_FOUND", message: `Order not found: ${id}` },
        });
      }
      return sendJson(res, 200, { success: true, data: toApiOrderShape(found.order) });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  if (!cleanUrl.startsWith("/api/orders")) return false;

  try {
    // GET /api/orders?customer_id=... or seller_id=...
    if (method === "GET" && cleanUrl === "/api/orders") {
      const customerId = queryParams.get("customer_id");
      const sellerId = queryParams.get("seller_id");

      if (customerId) {
        const list = memoryListOrdersForCustomer(customerId);
        return sendJson(res, 200, { success: true, data: list.map(toApiOrderShape) });
      }
      if (sellerId) {
        const list = memoryListAllOrders().filter((o) => o.sellerId === sellerId);
        return sendJson(res, 200, { success: true, data: list.map(toApiOrderShape) });
      }
      return sendJson(res, 200, { success: true, data: memoryListAllOrders().map(toApiOrderShape) });
    }

    // POST /api/orders — CreateOrderPayload (no client prices trusted for charge amount)
    if (method === "POST" && cleanUrl === "/api/orders") {
      const body = await parseBody(req);
      const orderNum = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderId = `ord_${crypto.randomBytes(8).toString("hex")}`;
      const customerId = resolveCustomerId(req, body.customer_id || body.customerId);

      const contact = body.contact || {};
      const shippingAddress = body.shippingAddress || body.shipping_address || {};
      const paymentMethod = String(
        body.paymentMethod || body.payment_method || "UPI",
      ).toUpperCase();
      const isCod = paymentMethod.includes("COD");

      const rawItems: any[] = Array.isArray(body.items) ? body.items : [];
      if (rawItems.length === 0) {
        return sendJson(res, 400, {
          success: false,
          error: { code: "EMPTY_CART", message: "Order must include at least one item" },
        });
      }

      const items: StoredOrderItem[] = [];
      for (const raw of rawItems) {
        const productId = String(raw.productId || raw.product_id || "");
        const qty = Math.max(1, Number(raw.qty || raw.quantity || 1));
        const sellerId = String(raw.vendorId || raw.sellerId || raw.vendor_id || "v1");
        const catalog = productId ? await lookupProductPrice(productId) : null;
        // Server-side price only — never trust client unitPrice
        const unitPrice = catalog?.price ?? 0;
        if (!catalog || unitPrice <= 0) {
          // Demo fallback: reject unknown priced products when PG has no catalog row
          // Allow minimal demo pricing only when product exists in request with no DB (0) — use 1 to avoid free orders
          return sendJson(res, 400, {
            success: false,
            error: {
              code: "PRODUCT_PRICE_UNAVAILABLE",
              message: `Cannot price product ${productId}. Ensure catalog is seeded.`,
            },
          });
        }
        items.push({
          productId,
          name: catalog.name,
          imageUrl: catalog.imageUrl,
          qty,
          unitPrice,
          lineTotal: unitPrice * qty,
          sellerId,
          sellerName: `Seller ${sellerId}`,
        });
      }

      const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
      const discount = 0;
      const taxable = Math.max(0, subtotal - discount);
      const tax = Math.round(taxable * GST_RATE * 100) / 100;
      const totalAmount = Math.round((taxable + tax + DELIVERY_FEE) * 100) / 100;
      const primarySeller = items[0]?.sellerId || "v1";

      const stored: StoredOrder = {
        id: orderId,
        orderNumber: orderNum,
        customerId,
        sellerId: primarySeller,
        status: "PLACED",
        totalAmount,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        discount,
        tax,
        paymentMethod: isCod ? "COD" : paymentMethod.includes("CARD") ? "CARD" : "UPI",
        paymentStatus: isCod ? "COD_PENDING" : "PENDING",
        shippingAddress: {
          ...shippingAddress,
          name: contact.name || shippingAddress.name,
          phone: contact.phone || shippingAddress.phone,
        },
        contact: {
          name: String(contact.name || "Customer").trim(),
          phone: String(contact.phone || "").trim(),
          email: contact.email ? String(contact.email).trim() : undefined,
        },
        deliveryInstructions: body.deliveryInstructions || body.delivery_instructions,
        couponCode: body.couponCode || body.coupon_code,
        items,
        createdAt: new Date().toISOString(),
      };

      memorySaveOrder(stored);

      // Best-effort Postgres persist
      if (isPostgresAvailable) {
        try {
          const addrJson = JSON.stringify(stored.shippingAddress);
          await query(
            `INSERT INTO orders (
               id, order_number, customer_id, seller_id, status, total_amount,
               delivery_address, payment_method, payment_status
             ) VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8)
             ON CONFLICT (id) DO NOTHING`,
            [
              orderId,
              orderNum,
              customerId,
              primarySeller,
              totalAmount,
              addrJson,
              stored.paymentMethod,
              stored.paymentStatus,
            ],
          );
          for (const it of items) {
            const itemId = `oi_${crypto.randomBytes(6).toString("hex")}`;
            await query(
              `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT (id) DO NOTHING`,
              [itemId, orderId, it.productId, it.qty, it.unitPrice, it.lineTotal],
            );
          }
        } catch (dbErr: any) {
          console.warn("[Orders POST] DB persist skipped:", dbErr?.message);
        }
      }

      return sendJson(res, 201, {
        success: true,
        data: toApiOrderShape(stored),
        message: "Order placed successfully",
      });
    }

    return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
  } catch (error: any) {
    console.error("[Orders API Error]:", error);
    return sendJson(res, 500, { success: false, error: error.message });
  }
}

/** Used by payments verify/cod to sync payment status */
export async function markOrderPayment(
  idOrNumber: string,
  patch: {
    paymentStatus: string;
    paymentMethod?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  },
): Promise<StoredOrder | null> {
  const updated = memoryUpdateOrder(idOrNumber, {
    paymentStatus: patch.paymentStatus,
    paymentMethod: patch.paymentMethod,
    razorpayOrderId: patch.razorpayOrderId,
    razorpayPaymentId: patch.razorpayPaymentId,
  });

  if (isPostgresAvailable) {
    try {
      await query(
        `UPDATE orders
         SET payment_status = $1,
             payment_method = COALESCE($2, payment_method),
             razorpay_payment_id = COALESCE($3, razorpay_payment_id),
             razorpay_order_id = COALESCE($4, razorpay_order_id),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 OR order_number = $5`,
        [
          patch.paymentStatus,
          patch.paymentMethod || null,
          patch.razorpayPaymentId || null,
          patch.razorpayOrderId || null,
          idOrNumber,
        ],
      );
    } catch (err: any) {
      console.warn("[Orders] payment mark DB update:", err?.message);
    }
  }

  return updated || (await loadOrderFromDb(idOrNumber));
}
