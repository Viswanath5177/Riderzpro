import { describe, it, expect, beforeAll } from "vitest";
import crypto from "node:crypto";
import { buildGstInvoice, renderInvoiceHtml, DEFAULT_NOIDA_SELLER } from "../lib/invoice";
import { handleRoute as paymentsRoute } from "../server/routes/payments";
import { handleRoute as assistantRoute } from "../server/routes/assistant";
import { handleRoute as ordersRoute } from "../server/routes/orders";

// Mock minimal HTTP request / response helpers for Node route testing
function createMockHttp(method: string, bodyObj?: any) {
  const req: any = {
    method,
    headers: { "content-type": "application/json" },
    on: (event: string, callback: any) => {
      if (event === "data" && bodyObj) {
        callback(Buffer.from(JSON.stringify(bodyObj)));
      }
      if (event === "end") {
        callback();
      }
      return req;
    },
  };

  let responseData = "";
  const headers: Record<string, string> = {};

  const res: any = {
    statusCode: 200,
    writeHead: (code: number, hdrs?: any) => {
      res.statusCode = code;
      if (hdrs) Object.assign(headers, hdrs);
      return res;
    },
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    end: (chunk?: any) => {
      if (chunk) responseData += chunk.toString();
    },
    getStatusCode: () => res.statusCode,
    getHeaders: () => headers,
    getBody: () => {
      try {
        return JSON.parse(responseData);
      } catch {
        return responseData;
      }
    },
  };

  return { req, res };
}

describe("Sathwik Task Validation: GST Tax Invoice Engine (Rule 46)", () => {
  it("uses default Noida (UP) seller with GSTIN 09AABCR8492Q1Z8", () => {
    expect(DEFAULT_NOIDA_SELLER.stateCode).toBe("09");
    expect(DEFAULT_NOIDA_SELLER.city).toBe("Noida");
    expect(DEFAULT_NOIDA_SELLER.gstin).toBe("09AABCR8492Q1Z8");
  });

  it("calculates 18% IGST for Noida (UP) -> Delhi (07) inter-state transactions", () => {
    const invoice = buildGstInvoice({
      orderId: "ord_demo_test",
      customerName: "Aakash Sharma",
      shippingAddress: {
        street: "B-12, Connaught Place",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
      },
      items: [
        {
          name: "Lithium 60V 30Ah Battery",
          category: "EV Battery",
          price: 48000,
          qty: 1,
        },
      ],
      deliveryTotal: 150,
    });

    expect(invoice.taxBreakdown.isInterstate).toBe(true);
    expect(invoice.taxBreakdown.placeOfSupplyCode).toBe("07");
    expect(invoice.buyer.stateCode).toBe("07");
    expect(invoice.seller.stateCode).toBe("09");
    expect(invoice.taxBreakdown.igst).toBeGreaterThan(0);
    expect(invoice.taxBreakdown.cgst).toBe(0);
    expect(invoice.taxBreakdown.sgst).toBe(0);

    // Verify HSN codes: 8507 60 00 for battery, 9968 12 for freight/delivery
    const batteryItem = invoice.items.find((i) => i.description.includes("Battery"));
    expect(batteryItem?.hsnSac).toBe("8507 60 00");

    const deliveryItem = invoice.items.find((i) => i.hsnSac === "9968 12");
    expect(deliveryItem).toBeDefined();
    expect(deliveryItem?.grossAmount).toBe(150);
  });

  it("renders statutory Rule 46 HTML invoice with print capability", () => {
    const invoice = buildGstInvoice({
      orderId: "ord_html_test",
      customerName: "Priya Verma",
      shippingAddress: {
        street: "Sector 14, Gurugram",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
      },
      items: [
        {
          name: "60V Smart Fast Charger",
          category: "EV Charger",
          price: 4500,
          qty: 1,
        },
      ],
    });

    const html = renderInvoiceHtml(invoice);
    expect(html).toContain("RIDERZPRO");
    expect(html).toContain("09AABCR8492Q1Z8");
    expect(html).toContain("TAX INVOICE");
    expect(html).toContain("window.print()");
    expect(html).toContain("8504 40 90"); // Charger HSN
  });
});

describe("Sathwik Task Validation: Razorpay & Payments API Routes", () => {
  const TEST_KEY_ID = "rzp_test_demo_key";
  const TEST_KEY_SECRET = "sathwik_rzp_secret_test_5177";

  beforeAll(() => {
    process.env.RAZORPAY_KEY_ID = TEST_KEY_ID;
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
  });

  it("POST /api/payments/create-order creates Razorpay order with amount in paise", async () => {
    const { req, res } = createMockHttp("POST", {
      amount: 48150,
      currency: "INR",
      receipt: "rcpt_test_123",
      notes: { customer_name: "Aakash Sharma" },
    });

    const handled = await paymentsRoute(req, res, "/api/payments/create-order", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.order.amount).toBe(4815000); // 48150 * 100 paise
    expect(body.order.currency).toBe("INR");
    expect(body.order.id).toMatch(/^order_/);
  });

  it("POST /api/payments/verify validates HMAC SHA-256 signature and returns PAID status", async () => {
    const rzpOrderId = "order_test_verified_123";
    const rzpPaymentId = "pay_test_verified_456";

    const validSignature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(`${rzpOrderId}|${rzpPaymentId}`)
      .digest("hex");

    const { req, res } = createMockHttp("POST", {
      razorpay_order_id: rzpOrderId,
      razorpay_payment_id: rzpPaymentId,
      razorpay_signature: validSignature,
      order_id: "RZ-TEST-999",
      amount: 48150,
      customer_email: "test@riderzpro.com",
    });

    const handled = await paymentsRoute(req, res, "/api/payments/verify", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.payment_status).toBe("PAID");
    expect(body.signature_verified).toBe(true);
    expect(body.invoice_url).toContain("/api/orders/RZ-TEST-999/invoice?format=html");
  });

  it("POST /api/payments/verify rejects test_sig_ bypass tokens", async () => {
    const { req, res } = createMockHttp("POST", {
      razorpay_order_id: "order_x",
      razorpay_payment_id: "pay_x",
      razorpay_signature: "test_sig_bypass",
      order_id: "RZ-BYPASS",
    });

    const handled = await paymentsRoute(req, res, "/api/payments/verify", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(401);

    const body = res.getBody();
    expect(body.success).toBe(false);
    expect(body.signature_verified).toBe(false);
  });

  it("POST /api/payments/create-order fails when Razorpay keys are missing", async () => {
    const prevId = process.env.RAZORPAY_KEY_ID;
    const prevSecret = process.env.RAZORPAY_KEY_SECRET;
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    delete process.env.VITE_RAZORPAY_KEY_ID;

    const { req, res } = createMockHttp("POST", { amount: 100 });
    const handled = await paymentsRoute(req, res, "/api/payments/create-order", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(503);

    process.env.RAZORPAY_KEY_ID = prevId;
    process.env.RAZORPAY_KEY_SECRET = prevSecret;
  });

  it("POST /api/payments/cod records COD_PENDING status", async () => {
    const { req, res } = createMockHttp("POST", {
      order_id: "RZ-COD-111",
      customer_name: "Rohan Patel",
      customer_email: "rohan@example.com",
      amount: 2450,
    });

    const handled = await paymentsRoute(req, res, "/api/payments/cod", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.payment_status).toBe("COD_PENDING");
  });
});

describe("Sathwik Task Validation: AI Assistant Route & Order Invoices", () => {
  it("POST /api/assistant answers 'where is my order' with live tracking and invoice", async () => {
    const { req, res } = createMockHttp("POST", {
      query: "Where is my order RZ-849201?",
      order_id: "RZ-849201",
    });

    const handled = await assistantRoute(req, res, "/api/assistant", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.order.id).toBe("RZ-849201");
    expect(body.order.track_url).toBe("/track/RZ-849201");
    expect(body.order.invoice_url).toContain("/api/orders/RZ-849201/invoice?format=html");
  });

  it("POST /api/assistant recommends real catalogue items for vehicle query", async () => {
    const { req, res } = createMockHttp("POST", {
      query: "What 60V battery is compatible with Ather 450X?",
      vehicle_model: "Ather 450X",
    });

    const handled = await assistantRoute(req, res, "/api/assistant", "POST");
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.recommendations.length).toBeGreaterThan(0);
    expect(body.recommendations[0].name).toContain("Battery");
    expect(body.response).toContain("Ather 450X");
  });

  it("GET /api/orders/:id/invoice returns HTML tax invoice", async () => {
    const { req, res } = createMockHttp("GET");
    const queryParams = new URLSearchParams("format=html");

    const handled = await ordersRoute(req, res, "/api/orders/RZ-849201/invoice", "GET", queryParams);
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);
    expect(res.getHeaders()["Content-Type"]).toContain("text/html");

    const html = res.getBody();
    expect(html).toContain("TAX INVOICE");
    expect(html).toContain("RZ-849201");
    expect(html).toContain("09AABCR8492Q1Z8");
  });

  it("GET /api/orders/:id/invoice returns JSON format when requested", async () => {
    const { req, res } = createMockHttp("GET");
    const queryParams = new URLSearchParams("format=json");

    const handled = await ordersRoute(req, res, "/api/orders/RZ-849201/invoice", "GET", queryParams);
    expect(handled).toBe(true);
    expect(res.getStatusCode()).toBe(200);

    const body = res.getBody();
    expect(body.success).toBe(true);
    expect(body.invoice.seller.gstin).toBe("09AABCR8492Q1Z8");
    expect(body.invoice.taxBreakdown.isInterstate).toBe(true);
  });
});
