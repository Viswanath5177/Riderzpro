# Amrutha backend and login task status

This tracks Amrutha's assignments from the app launch plan against the current SQL implementation. The project uses SQLite for local development and PostgreSQL for production; it does not use Supabase. The shared API contract is in [backend-api-contract.md](./backend-api-contract.md).

## Ready in this branch

- **Backend choice and local setup:** server-side parameterized SQL supports a local SQLite database and PostgreSQL. Separate PostgreSQL test and production environments still need to be provisioned by the team before deployment.
- **API contract:** `backend-api-contract.md` records the ownership boundaries, table names, auth operations, errors, and unresolved cross-team decisions. Current auth calls are TanStack server functions for this web app, not stable public REST URLs; add HTTP adapters matching the documented operations before native/mobile clients consume the backend. The team handoff/approval itself is not represented in Git.
- **Customer sign-in:** email and E.164 phone OTP, one-time challenge consumption, expiry, attempt limits, hashed OTPs and opaque hashed sessions are implemented. There is no password to reset; users request a new one-time code.
- **Logout and current identity:** sessions are revoked on logout. `getCurrentUser()` returns the authenticated database user ID and role; route guards use the database role.
- **Roles:** only `customer` and `admin` are valid. New OTP registrations receive `customer`. Admin promotion is only possible through a trusted database SQL action in the migration instructions; there is no public role-change or admin-signup operation.
- **Route authorization:** customer and admin routes check the server session and role. Vendor, rider, and workshop dashboards are hidden from the role picker and redirect away; their demo content is not an authorized workspace.
- **Abuse checks:** identity input is normalized and validated; OTP requests are capped at 3 per identity per 15 minutes, and each challenge is limited to 5 verification attempts. There is not yet an IP/global limit across multiple identities.
- **Secrets:** provider keys, OTP hash key, and database connection details are loaded from server environment/bindings and are not committed as project credentials.

## Waiting on dependencies or team actions

- **Table-level ownership/security:** the shared business tables for products, carts, addresses and orders have not been added by Muni and Vamsi. Add the authenticated owner/admin checks to every operation when those tables and endpoints land. The current dashboard screens still use demo store data, so route guards do not make that demo data a real backend.
- **Account deletion:** wait for Muni/Vamsi's user-linked table inventory and Sathwik's tax-record retention decision. Then implement deletion/anonymization transactionally across all user-owned records and revoke all sessions. Deleting only `app_users` now would either leave personal data or fail when dependent tables arrive.
- **Production deployment and URL:** no production PostgreSQL host, deployment credentials, or deployed backend URL is configured in this checkout. Provision these with the team and pass the URL to Aakash through the agreed secret/config channel.
- **Reviewer demo accounts:** create one customer and one admin only after the target test database has been migrated and approved test identities/sample data are available. Promote the admin using the trusted SQL migration instructions, never an app control.
- **Final security test:** run with Harshith's admin screens and real API endpoints available. Confirm anonymous access is denied, a customer is redirected away from admin routes, customer-owned records cannot cross users, and admin operations reject customer sessions. Current route guards cover navigation; business-data isolation cannot be proven until those endpoints exist.
- **Cross-team handoff:** confirm the API/table contract with Muni, Vamsi, Viswanath, and Sathwik, especially table ownership, status events, and invoice retention. Git contains the proposed contract, but cannot prove it was shared or agreed in team chat.

## Implementation details

- OTP/session schema: `database/migrations/001_auth.sql` and `database/migrations/sqlite/001_auth.sql`.
- Local migration command: `npm run db:migrate:local`.
- Auth server functions: `src/lib/auth.server.ts` and `src/lib/auth.ts`.
- Local SMTP/SMS/provider configuration belongs in ignored local environment files; production values belong in the deployment secret manager.
