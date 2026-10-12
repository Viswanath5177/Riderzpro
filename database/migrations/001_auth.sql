-- Core identity, OTP, and session tables for the direct PostgreSQL backend.
-- Apply with a migration-owner account; the application role must not own these tables.

begin;

create extension if not exists pgcrypto;

create type app_role as enum ('customer', 'admin');

create table app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text unique,
  display_name text,
  role app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_users_identity_present check (email is not null or phone is not null)
);

create table auth_otp_challenges (
  id uuid primary key default gen_random_uuid(),
  identity text not null,
  channel text not null check (channel in ('email', 'sms')),
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts smallint not null default 0 check (attempts between 0 and 5),
  created_at timestamptz not null default now()
);

create index auth_otp_identity_recent_idx
  on auth_otp_challenges (identity, created_at desc);

create table auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users (id) on delete cascade,
  token_hash char(64) not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index auth_sessions_user_active_idx
  on auth_sessions (user_id, expires_at desc)
  where revoked_at is null;

-- Public signups receive customer by default. Grant admin with an operator-only SQL action:
-- UPDATE app_users SET role = 'admin' WHERE id = '<auth user UUID>';
-- Do not expose role changes through a public API.

commit;
