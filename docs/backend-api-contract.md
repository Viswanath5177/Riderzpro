# Riderzpro SQL backend contract (SQLite locally, PostgreSQL in production)

## Backend boundary

- PostgreSQL is the production source of truth. Local development uses SQLite; server-side code uses parameterized SQL in both environments.
- The browser and mobile app never connect to PostgreSQL directly. All reads and writes cross authenticated server functions or server routes.
- Production Cloudflare Workers connect through Hyperdrive; local development uses the SQLite `DATABASE_URL` file URL.
- User ownership and role checks happen in server-side code. A client-supplied user ID or role is never authoritative.
- V1 roles are `customer` and `admin`; admin grants are operator-only SQL updates.

## Ownership and proposed tables

| Area | Owner | Tables |
| --- | --- | --- |
| Identity, roles, sessions, OTP and account deletion | Amrutha | `app_users`, `auth_otp_challenges`, `auth_sessions` |
| Catalog, categories, images, stock and shop settings | Muni | `products`, `categories`, `product_images`, `shop_settings` |
| Bikes, fitment, addresses, carts and orders | Vamsi | `bikes`, `fitments`, `addresses`, `carts`, `cart_items`, `orders`, `order_items` |
| Courier shipments and status events | Viswanath | `shipments`, `order_status_history` |
| Payments and invoices | Sathwik | `payments`, `invoices` |

Use UUID primary keys, UTC `timestamptz` values, integer minor currency units (paise), foreign keys, and database constraints. Order items store product-name, unit-price, and tax snapshots so catalog changes do not rewrite past orders. Table boundaries remain subject to team review.

## Auth operations

| Operation | Contract |
| --- | --- |
| `POST /api/auth/request-code` | Accept normalized email or E.164 phone; rate-limit; store only a keyed hash of the code; deliver through the configured provider. |
| `POST /api/auth/verify-code` | Enforce expiry and attempt limits; consume the code once; create a customer account if needed; issue an opaque, HttpOnly session cookie and store only its hash. |
| `GET /api/auth/me` | Validate the session against PostgreSQL and return the user ID and database role. |
| `POST /api/auth/logout` | Revoke the current session and clear its cookie. |
| `DELETE /api/me` | Require a recent session; delete/anonymize personal data while retaining only billing records the team determines must be kept. |

All queries must be parameterized. OTP codes, session tokens, database URLs, and provider credentials must never be logged or returned to clients. Use generic errors where needed to avoid account enumeration.

## Other app operations

- Public/customer catalog reads return only active products, with pagination and compatible-bike filtering.
- Cart, address, order, and shipment reads are scoped to the authenticated customer.
- Order totals, stock, and delivery charges are calculated on the server. Clients cannot mark an order paid.
- Admin inventory, order, customer, and settings operations check the role from the database on every request.
- Courier webhooks are unauthenticated at the user level but require provider signature verification, event deduplication, and shipment validation.
- Razorpay webhooks require signature verification and idempotency before a payment state changes.

## Errors and status history

Return a stable JSON error shape: `{ "error": { "code": "...", "message": "...", "requestId": "..." } }`. Use `400` for invalid input, `401` for absent/invalid session, `403` for insufficient role, `404` for absent or inaccessible resources, `409` for state conflicts, and `429` for rate limits.

Store status changes as append-only rows with order ID, status, source (`system`, `admin`, or `courier`), optional provider event ID, and timestamp. The customer may see only events for their own orders; admin access is checked server-side.

## Decisions still needed

1. Select the PostgreSQL host and create separate test and production databases.
2. Configure Cloudflare Hyperdrive for both environments.
3. Confirm OTP delivery providers and credentials for email and SMS.
4. Muni and Vamsi confirm table names, columns, and stock/order transaction boundaries.
5. Viswanath confirms courier status mapping and event format.
6. Sathwik confirms payment/invoice tables and tax-record retention for account deletion.
