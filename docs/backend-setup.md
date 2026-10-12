# Database setup

Riderzpro supports SQLite for local development and direct PostgreSQL in production. Server-side queries are parameterized. The local SQLite database is a file in `database/`; do not commit it.

## Local development with SQLite

1. No database server or hosting account is needed. Copy `.dev.vars.example` to `.dev.vars` and keep `DATABASE_URL=file:./database/riderzpro-dev.db`. The local Cloudflare runtime reads server bindings from `.dev.vars`.
2. Run `npm run db:migrate:local` from the project root to create the local auth tables. The dev command loads `.dev.vars` into the local Node server and provides Nitro's Cloudflare module shim.
3. Set `OTP_HASH_SECRET` to a random value of at least 32 characters in `.dev.vars`. Configure either Resend email or Twilio SMS there; never add `VITE_` prefixes or commit the file.
4. Run `npm run dev` and test the sign-in screen with an email address or phone you can access.

The SQLite schema is `database/migrations/sqlite/001_auth.sql`. To start with a fresh local database, stop the dev server and remove `database/riderzpro-dev.db` before rerunning the migration.

## Production PostgreSQL (later)

The production app runs on Cloudflare Workers and uses the `pg` driver through a Cloudflare Hyperdrive binding. Keep the PostgreSQL URL, OTP hash secret, and email/SMS credentials in Cloudflare's secret manager. Do not reuse the local SQLite file or development credentials in production.

Apply `database/migrations/001_auth.sql` to PostgreSQL with `psql` or a migration runner. Use a database owner account for migrations and a separate restricted account for app queries. Configure test and production Hyperdrive bindings separately before deployment.
