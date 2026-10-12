# Backend setup

## Backend decision

Riderzpro will use Supabase directly, managed in the team's Supabase organization. Do not create or connect a Lovable Cloud backend. The application uses Supabase Auth and Postgres with row-level security; privileged operations belong in server-side functions. The Supabase publishable/anon key is public by design and is safe for the client only when every exposed table is protected by RLS.

## Environments

Create separate Supabase projects for **test** and **production**. Keep production data and credentials out of local development. Apply database changes through reviewed migrations so both environments can be recreated consistently. The repository now has a CLI `supabase/config.toml`; local migrations use the Supabase CLI and Docker.

For local development, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the test project's URL and publishable key. Vite exposes `VITE_*` values to browser code. Never put a service-role key, OTP provider secret, payment secret, or other privileged credential in a `VITE_*` variable or commit it to Git.

After Docker Desktop is running, use `npx supabase start` and `npx supabase migration up --local` to apply migrations to the local stack. For each hosted project, authenticate with `npx supabase login`, link with its project ref using `npx supabase link --project-ref <project-ref>`, then review `npx supabase migration list` before `npx supabase db push`. Never point the production link at the test project by mistake.

## First handoff

Before implementation against real data, the owners named in [the backend API contract](backend-api-contract.md) must agree on the shared table boundaries, endpoint behavior, and courier event format. Until then, the contract remains a proposal and frontend work should use sample responses. The user identity is always derived from the verified Supabase session; clients must not choose their own role or send an authoritative user ID.

## Before exposing real data

1. Add reviewed migrations for profiles and role assignment, then the domain tables owned by Muni and Vamsi.
2. Enable and review RLS for every table exposed through the Supabase API before integrating real customer or admin data.
3. Create admin users through a restricted operator process; do not add a public role-promotion flow.
4. Configure Auth redirect URLs and OTP/email providers separately for test and production.
5. Keep service-role and integration secrets in the server-side secret store. Rotate credentials if they are ever committed or sent to a browser.

## Operator-only admin grant

Create the account through Supabase Auth first, then grant the admin role from the SQL editor or another restricted operator connection using the account's Auth UUID:

```sql
insert into public.user_roles (user_id, role)
values ('00000000-0000-0000-0000-000000000000', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Never expose this operation through a public app endpoint. Public signup always receives the `customer` role, regardless of submitted metadata.
