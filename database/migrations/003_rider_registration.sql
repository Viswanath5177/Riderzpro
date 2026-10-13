-- Registration consent and reviewer audit trail. No identity document data is stored here.
begin;

alter table rider_applications
  add column if not exists service_state text not null default '';

create table if not exists rider_application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references rider_applications (id) on delete cascade,
  actor_id uuid references app_users (id) on delete set null,
  event_type text not null check (event_type in ('submitted', 'resubmitted', 'approved', 'needs_correction', 'rejected')),
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists rider_application_events_application_idx
  on rider_application_events (application_id, created_at desc);

create table if not exists rider_application_consents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references rider_applications (id) on delete cascade,
  consent_version text not null,
  accuracy_confirmed boolean not null check (accuracy_confirmed),
  eligibility_confirmed boolean not null check (eligibility_confirmed),
  privacy_notice_acknowledged boolean not null check (privacy_notice_acknowledged),
  accepted_at timestamptz not null default now()
);

commit;
