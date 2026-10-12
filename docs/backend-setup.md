# PostgreSQL backend setup

Riderzpro uses PostgreSQL directly. The app server sends parameterized SQL through the `pg` driver. SQL migrations live in `database/migrations` and can be applied with `psql` or the team's migration runner.

## Runtime connection

The app currently deploys to Cloudflare Workers. In production, connect the Worker's server-side `pg` driver through a Cloudflare Hyperdrive binding. Hyperdrive can connect to any PostgreSQL database and keeps its connection string inside the Worker environment. For local development, set `DATABASE_URL` in `.env.local` to a local PostgreSQL instance. Do not use a `VITE_` prefix for database or auth secrets.

Create separate PostgreSQL databases for test and production. The production database URL and auth-provider credentials belong in the hosting platform's secret manager. Keep migration-owner credentials separate from the runtime application's restricted database role.

## Local setup

1. Install PostgreSQL and create a local database and user, or use an existing development instance.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Apply migrations in order, for example: `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_auth.sql`.
4. Set `OTP_HASH_SECRET` to a random value. Configure Resend for email codes and Twilio for SMS codes before using those channels.

## Cloudflare setup

1. Create or select a PostgreSQL database for test and another for production.
2. Create one Hyperdrive configuration for each database. Keep their IDs in non-secret deployment config; Hyperdrive's database connection string is not exposed to browser code.
3. Bind the test Hyperdrive as `HYPERDRIVE` for test deployments and the production Hyperdrive for production deployments.
4. Add `OTP_HASH_SECRET`, email/SMS provider credentials, and other secrets with the Cloudflare secret manager.
5. Apply migrations to test first, verify access rules and auth, then apply the same ordered migrations to production.

The runtime database account must not own tables or have permission to alter schemas. It should receive only the table and sequence privileges the application needs. Database ownership and migrations should use a separate operator account.
