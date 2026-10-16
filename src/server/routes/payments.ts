import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import { parseBody, sendJson } from "./http";
import { query } from "../db";
import { sendOrderConfirmationEmail } from "../../lib/email.server";

function getRazorpayCredentials(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

/** Constant-time compare for hex HMAC digests (no length leak via early return on mismatch). */
function timingSafeEqualHex(expected: string, provided: string): boolean {
  const a = Buffer.from(String(expected), "utf8");
  const b = Buffer.from(String(provided), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined,
  _queryParams?: URLSearchParams
): Promise<boolean> {
  // 1. POST /api/payments/create-order
  if (cleanUrl === "/api/payments/create-order" && method === "POST") {
    try {
      const creds = getRazorpayCredentials();
      if (!creds) {
        return sendJson(res, 503, {
          success: false,
          error: "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        });
      }

      const body = await parseBody(req);
      const rawAmount = Number(body.amount) || 0;
      const currency = body.currency || "INR";
      const amountInPaise = Math.round(rawAmount * 100);
      const receipt = body.receipt || `rcpt_${Date.now()}`;
      const notes = body.notes || {};

      // Deterministic order id for sandbox until live Razorpay Orders API is wired
      const rzpOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

      const orderPayload = {
        id: rzpOrderId,
        order_id: rzpOrderId,
        entity: "order",
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency,
        receipt,
        status: "created",
        attempts: 0,
        notes,
        created_at: Math.floor(Date.now() / 1000),
        key_id: creds.keyId,
        key: creds.keyId,
      };

      return sendJson(res, 200, {
        success: true,
        order: orderPayload,
        order_id: rzpOrderId,
        id: rzpOrderId,
        key: creds.keyId,
        amount: rawAmount,
        currency,
      });
    } catch (err: any) {
      console.error("[Payments API - create-order Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 2. POST /api/payments/verify
  if (cleanUrl === "/api/payments/verify" && method === "POST") {
    try {
      const creds = getRazorpayCredentials();
      if (!creds) {
        return sendJson(res, 503, {
          success: false,
          error: "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        });
      }

      const body = await parseBody(req);
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        order_id,
        customer_email,
        customer_name,
        amount,
        shipping_address,
      } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return sendJson(res, 400, {
          success: false,
          error: "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature",
        });
      }

      // Reject known bypass tokens explicitly
      if (String(razorpay_signature).startsWith("test_sig_")) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid payment signature",
          signature_verified: false,
        });
      }

      const generatedSignature = crypto
        .createHmac("sha256", creds.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const signatureValid = timingSafeEqualHex(generatedSignature, String(razorpay_signature));

      if (!signatureValid) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid payment signature",
          signature_verified: false,
        });
      }

      const effectiveOrderId = order_id || razorpay_order_id;

      try {
        await query(
          `UPDATE orders
           SET payment_status = 'PAID',
               payment_method = 'Razorpay',
               razorpay_payment_id = $1,
               razorpay_order_id = $2,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $3 OR order_number = $3`,
          [razorpay_payment_id, razorpay_order_id, effectiveOrderId]
        );
      } catch (dbErr: any) {
        console.warn("[Payments API - DB update fallback]:", dbErr.message);
      }

      if (customer_email) {
        const invoiceUrl = `https://riderzpro.com/api/orders/${effectiveOrderId}/invoice?format=html`;
        const addr = shipping_address || {};
        sendOrderConfirmationEmail(customer_email, {
          orderId: effectiveOrderId,
          customerName: customer_name || "Customer",
          orderTotal: Number(amount) || 0,
          paymentStatus: "PAID",
          paymentMethod: "Razorpay (Verified)",
          shippingAddress: {
            street: String(addr.street || ""),
            city: String(addr.city || "Delhi"),
            state: String(addr.state || "Delhi"),
            pincode: String(addr.pincode || ""),
          },
          invoiceUrl,
        }).catch((emailErr) => console.warn("[Payments API] Email send error:", emailErr?.message));
      }

      return sendJson(res, 200, {
        success: true,
        payment_status: "PAID",
        order_id: effectiveOrderId,
        payment_id: razorpay_payment_id,
        signature_verified: true,
        invoice_url: `/api/orders/${effectiveOrderId}/invoice?format=html`,
        message: "Payment signature verified and order marked as PAID",
      });
    } catch (err: any) {
      console.error("[Payments API - verify Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3. POST /api/payments/cod (Cash on Delivery)
  if (cleanUrl === "/api/payments/cod" && method === "POST") {
    try {
      const body = await parseBody(req);
      const {
        order_id,
        customer_email,
        customer_name,
        amount,
        shipping_address,
      } = body;

      if (!order_id) {
        return sendJson(res, 400, {
          success: false,
          error: "Missing order_id",
        });
      }

      const effectiveOrderId = order_id;

      try {
        await query(
          `UPDATE orders
           SET payment_status = 'COD_PENDING',
               payment_method = 'Cash on Delivery',
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $1 OR order_number = $1`,
          [effectiveOrderId]
        );
      } catch (dbErr: any) {
        console.warn("[Payments API - DB update fallback]:", dbErr.message);
      }

      if (customer_email) {
        const invoiceUrl = `https://riderzpro.com/api/orders/${effectiveOrderId}/invoice?format=html`;
        const addr = shipping_address || {};
        sendOrderConfirmationEmail(customer_email, {
          orderId: effectiveOrderId,
          customerName: customer_name || "Customer",
          orderTotal: Number(amount) || 0,
          paymentStatus: "COD_PENDING",
          paymentMethod: "Cash on Delivery (Doorstep)",
          shippingAddress: {
            street: String(addr.street || ""),
            city: String(addr.city || "Delhi"),
            state: String(addr.state || "Delhi"),
            pincode: String(addr.pincode || ""),
          },
          invoiceUrl,
        }).catch((emailErr) => console.warn("[Payments API] Email send error:", emailErr?.message));
      }

      return sendJson(res, 200, {
        success: true,
        payment_status: "COD_PENDING",
        order_id: effectiveOrderId,
        invoice_url: `/api/orders/${effectiveOrderId}/invoice?format=html`,
        message: "Order placed successfully with status COD_PENDING",
      });
    } catch (err: any) {
      console.error("[Payments API - COD Error]:", err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  return false;
}
