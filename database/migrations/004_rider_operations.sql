-- Rider-owned dispatch, in-app notices, delivery earnings, and payout reconciliation.
-- No government ID, bank account number, or raw GPS history is stored here.
begin;

create table if not exists rider_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users (id) on delete cascade,
  title text not null,
  message text not null,
  kind text not null check (kind in ('application', 'delivery', 'payout')),
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists rider_notifications_user_recent_idx
  on rider_notifications (user_id, created_at desc);

create table if not exists rider_delivery_jobs (
  id uuid primary key default gen_random_uuid(),
  external_order_id text unique,
  pickup_label text not null,
  dropoff_label text not null,
  city text not null,
  service_state text not null check (service_state in ('Andhra Pradesh', 'Telangana')),
  rider_user_id uuid not null references app_users (id) on delete restrict,
  rider_earning_paise bigint not null check (rider_earning_paise >= 0),
  status text not null default 'offered'
    check (status in ('offered', 'accepted', 'picked_up', 'delivered', 'cancelled')),
  created_by uuid references app_users (id) on delete set null,
  offered_at timestamptz not null default now(),
  accepted_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists rider_delivery_jobs_rider_status_idx
  on rider_delivery_jobs (rider_user_id, status, created_at desc);

create table if not exists rider_delivery_events (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references rider_delivery_jobs (id) on delete cascade,
  actor_id uuid references app_users (id) on delete set null,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists rider_delivery_events_delivery_idx
  on rider_delivery_events (delivery_id, created_at desc);

create table if not exists rider_earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  rider_user_id uuid not null references app_users (id) on delete restrict,
  delivery_id uuid not null unique references rider_delivery_jobs (id) on delete restrict,
  amount_paise bigint not null check (amount_paise >= 0),
  status text not null default 'available' check (status in ('available', 'paid', 'reversed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists rider_earnings_rider_status_idx
  on rider_earnings_ledger (rider_user_id, status, created_at desc);

create table if not exists rider_payouts (
  id uuid primary key default gen_random_uuid(),
  rider_user_id uuid not null references app_users (id) on delete restrict,
  amount_paise bigint not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'processing', 'processed', 'failed', 'reversed', 'cancelled')),
  razorpay_payout_id text unique,
  reference_id text not null unique,
  utr text,
  failure_reason text,
  requested_by uuid references app_users (id) on delete set null,
  approved_by uuid references app_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists rider_payouts_rider_recent_idx
  on rider_payouts (rider_user_id, created_at desc);

create table if not exists rider_payout_ledger_entries (
  payout_id uuid not null references rider_payouts (id) on delete cascade,
  earning_id uuid not null references rider_earnings_ledger (id) on delete restrict,
  primary key (payout_id, earning_id),
  unique (earning_id)
);

commit;
