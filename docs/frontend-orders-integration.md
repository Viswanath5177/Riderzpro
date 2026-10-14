# Frontend Orders Integration Guide & Backend Swap Checklist

This document details the single swap-point architecture for connecting Riderzpro frontend to Vamsi's backend order contract when merged.

---

## 1. Single Swap Point: `src/lib/api/orders.contract.ts`

The frontend communicates with a single normalized type `NormalizedOrder` via `normalizeOrder(raw)`. No screen or component touches backend SQL field names directly.

### Backend Swap Checklist
When Vamsi's database schema or endpoints are ready:
1. **Set Environment Variable**:
   ```env
   VITE_ORDERS_API=live
   ```
2. **Review & Adjust `normalizeOrder(raw)`**:
   - Inspect any custom field names in `src/lib/api/orders.contract.ts` (e.g. `order_number` vs `orderNumber`, snake_case address columns, or minor currency units).
   - Ensure money is parsed as integer paise (minor units) internally.
3. **Run Contract Tests**:
   ```bash
   npm test
   ```
   All fixture assertions in `src/test/orders.contract.test.ts` should pass.
4. **Smoke Test User Flow**:
   - Verify Checkout (`/cart`) -> Confirmation (`/order-confirmation/:id`) -> My Orders (`/orders`) -> Order Detail (`/order/:id`).

---

## 2. Open Questions for Teammates

### Questions for Vamsi (Orders, Addresses, Carts)
1. **Pincode Enforcement**: Does the PostgreSQL database trigger/constraint enforce Delhi-only delivery (`110001`–`110099`) server-side with `ADDRESS_NOT_SERVICEABLE` error code?
2. **Snapshot Integrity**: Are product titles, seller names, and unit prices captured as immutable snapshots on `order_items` at the moment of order placement so future price changes do not distort historic order records?
3. **Cursor vs Offset Pagination**: What is the pagination contract for `GET /api/orders/mine`? (e.g., cursor-based with `nextCursor` or `limit`/`offset` query parameters).

### Questions for Sathwik (Payments & Invoices)
1. **Payment Status Transition**: When a customer selects UPI or Card, does `POST /api/orders` return payment status `PENDING` with Razorpay/payment gateway order tokens, or is the payment created in a separate step before order confirmation?
2. **COD Handling**: For COD orders, is `amountDuePaise` tracked until courier delivery reconciliation, and does the invoice mark payment status as `COD_DUE`?
3. **Invoice Download**: What endpoint will be exposed for downloading PDF invoices (`GET /api/orders/:id/invoice`)?

### Questions for Viswanath (Logistics & Shipments)
1. **Status Mapping**: Can we confirm the exact string enum values returned by courier webhooks for status progression (`PLACED` -> `PACKED` -> `DISPATCHED` -> `OUT_FOR_DELIVERY` -> `DELIVERED` vs numeric codes)?
2. **Live Tracking Coordinates**: Will rider coordinates and GPS telemetry be pushed over SSE / WebSocket or queried via 5-second polling on `GET /api/orders/:id/tracking`?
