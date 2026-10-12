# Riderzpro backend contract (draft)

**Status:** Draft for team review. Do not treat table names or payloads as final until Amrutha, Muni, Vamsi, Viswanath, and Sathwik agree on their shared boundaries.

## Launch assumptions

- Backend: a standalone Supabase project managed directly by the Riderzpro team, with separate test and production projects. The project must not be provisioned or managed through Lovable Cloud.
- Version-one app roles: `customer` and `admin`. Workshop, vendor, and rider roles are out of launch scope.
- One seller: admin-managed inventory; no vendor offers in the launch data model.
- Delivery: third-party courier. Courier callbacks are the only unauthenticated integration and must be verified with a courier secret/signature.
- Supabase Auth and Postgres provide identity and data access. The app may use the publishable/anon key; service-role keys and provider secrets stay server-side.
- Customer ownership comes from the verified auth subject (`auth.uid()`), never from a client-supplied user ID.

## Ownership boundaries

| Area | Owner | Shared contract needed |
| --- | --- | --- |
| Profiles, roles, auth policy, RLS, account deletion | Amrutha | `profiles`, `user_roles`, identity and authorization rules |
| Catalog, categories, images, stock, shop settings | Muni | `products`, `categories`, `product_images`, `shop_settings` |
| Bikes, fitment, addresses, carts, orders | Vamsi | `bikes`, `fitments`, `addresses`, `carts`, `cart_items`, `orders`, `order_items` |
| Courier shipments and status events | Viswanath | `shipments`, `order_status_history`, courier event format |
| Payments and invoices | Sathwik | `payments`, `invoices`, payment verification and retention rules |

Use UUID primary keys for new records, UTC ISO-8601 timestamps, integer minor currency units (paise), and explicit foreign keys. Order item price, tax, and product name must be snapshots so later catalog edits do not rewrite an order. IDs and exact columns remain subject to owner review.

## Identity and authorization

- Signup/login: Supabase Auth phone OTP and email fallback. The app does not accept a role during signup.
- `profiles.id` references `auth.users.id`; profile creation is server-triggered or through a constrained authenticated operation.
- Admin role assignment is an operator-only database action; no public endpoint grants or changes roles.
- RLS applies to every exposed table. A customer may read/write only their own profile, addresses, cart, and orders. Customers may read published catalog and their own shipment/payment summaries. Admin access is checked server-side and represented in trusted claims or a protected role lookup, not local storage.
- Service-role access is restricted to server functions and never included in browser or mobile bundles.

## App operations

Supabase Auth SDK calls are used for identity actions. Database reads/writes use the Supabase client under RLS. Privileged or third-party operations use server-side Edge Functions. The following paths describe the logical API boundary; whether an operation is implemented as a table query, RPC, or Edge Function is confirmed by the owning team.

| Operation | Caller | Contract |
| --- | --- | --- |
| `GET /me` | Signed-in user | Return profile and server-derived role; `401` when unauthenticated. |
| `PATCH /me` | Signed-in user | Update allowed profile fields only; ID and role are immutable to the caller. |
| `DELETE /me` | Signed-in user | Begin deletion; remove personal data while retaining only legally required billing records per Sathwik’s retention decision. Require recent authentication/confirmation. |
| `GET /products?query=&category=&minPrice=&maxPrice=&bikeId=` | Public/customer | Return published products and compatible fitment; pagination required. |
| `GET /bikes` and `POST /vin/lookup` | Public/customer | Return supported bikes or decoded bike/year; invalid VIN returns a validation error. |
| `GET/PUT /me/cart` | Signed-in customer | Read or replace only the caller’s cart. Server validates product IDs, stock, and quantity. |
| `GET/POST /me/addresses` | Signed-in customer | List/create caller-owned addresses; pincode is required for delivery. |
| `POST /orders` | Signed-in customer | Create a pending order from cart and address. Server recalculates prices, tax, stock, and delivery; client totals are never trusted. Payment remains pending until verified by Sathwik’s payment flow. |
| `GET /me/orders` and `GET /me/orders/{orderId}` | Signed-in customer | Return only caller-owned orders, items, payment summary, shipment timeline, and invoice link when available. |
| `GET/POST/PATCH/DELETE /admin/products...` | Admin | Manage catalog/stock; reject non-admin users before returning or changing data. Image upload uses a constrained storage bucket and signed upload policy. |
| `GET /admin/orders` and `GET /admin/customers` | Admin | Paginated/filterable operational data; customer personal data is admin-only. |
| `PATCH /admin/orders/{orderId}/status` | Admin | Append an auditable manual status correction; do not overwrite the status history. |
| `POST /webhooks/courier/{provider}` | Courier server | No user session. Verify provider signature/secret, deduplicate event IDs, validate shipment mapping, persist status, then emit an authorized update. |
| `POST /webhooks/razorpay` | Razorpay server | No user session. Verify webhook signature and idempotency before marking a payment paid/failed/refunded. Owned by Sathwik; coordinate deployment and secrets with Amrutha. |

### Standard errors

Return a stable JSON shape: `{ "error": { "code": "...", "message": "...", "requestId": "..." } }`. Use `400` for invalid input, `401` for missing/invalid session, `403` for authenticated but unauthorized, `404` for absent or inaccessible resources, `409` for state conflicts/idempotency conflicts, and `429` for rate limits. Do not reveal whether another customer's record exists.

## Order and tracking events

Proposed canonical order states, subject to Viswanath and Vamsi review:

`placed -> confirmed -> packed -> shipped -> out_for_delivery -> delivered`

Terminal alternatives: `cancelled`, `returned`. Store each transition as an append-only history row with `order_id`, `status`, `source` (`system`, `admin`, or `courier`), optional provider event ID, and `created_at`.

Proposed realtime event:

```json
{
  "type": "order.status_changed",
  "orderId": "uuid",
  "status": "out_for_delivery",
  "occurredAt": "2026-10-12T10:00:00Z",
  "trackingNumber": "optional",
  "trackingUrl": "optional"
}
```

Customers can subscribe only to their own order IDs; admins may subscribe to all orders through a separately authorized channel. Never broadcast phone numbers, addresses, or payment secrets.

## Authentication abuse controls

- Configure provider OTP limits and add application-level throttling where the provider configuration does not cover the risk.
- Validate and normalize phone, email, IDs, quantity, pincode, and pagination inputs at every server boundary.
- Use generic login/reset responses where needed to avoid account enumeration.
- Log security events with request IDs; do not log OTPs, access tokens, secrets, or full payment credentials.

## Team decisions required before migrations/API freeze

1. Confirm direct Supabase project ownership and who manages test/production access. Lovable Cloud is out of scope.
2. Muni and Vamsi confirm table names, columns, ownership, product/bike references, and stock/order transaction boundary.
3. Viswanath confirms courier provider, canonical status mapping, signature verification, and realtime transport.
4. Sathwik confirms payment/invoice schema and which records must survive account deletion for tax compliance.
5. Confirm whether account deletion is immediate or queued, and what order history is retained/anonymized.
6. Confirm API versioning and pagination convention before frontend integration.

## First implementation milestone

1. Create isolated Supabase test and production projects directly in the Supabase organization; record only project URLs and publishable keys in environment configuration.
2. Add initial auth/profile/role migrations after the owners approve the shared schema.
3. Enable RLS before exposing any user-owned tables or admin data.
4. Implement `/me`, role lookup, and protected admin authorization first.
5. Share the final contract plus example responses with the frontend and integration owners.

Production secrets, service-role keys, webhook secrets, and admin credentials must be stored in the backend secret manager and must never be committed.
