-- Rider onboarding applications. Applications do not grant delivery access.
begin;

create table if not exists rider_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references app_users (id) on delete cascade,
  legal_name text not null,
  phone text not null,
  city text not null,
  vehicle_type text not null check (vehicle_type in ('motorcycle', 'scooter', 'bicycle')),
  vehicle_registration text not null,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'needs_correction', 'approved', 'rejected')),
  reviewer_id uuid references app_users (id) on delete set null,
  review_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rider_applications_status_idx
  on rider_applications (status, submitted_at);

commit;
