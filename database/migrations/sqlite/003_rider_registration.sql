-- service_state is added conditionally by scripts/migrate-sqlite.mjs for repeatable local migrations.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS rider_application_events (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  application_id TEXT NOT NULL REFERENCES rider_applications (id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('submitted', 'resubmitted', 'approved', 'needs_correction', 'rejected')),
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS rider_application_events_application_idx
  ON rider_application_events (application_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_application_consents (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  application_id TEXT NOT NULL REFERENCES rider_applications (id) ON DELETE CASCADE,
  consent_version TEXT NOT NULL,
  accuracy_confirmed INTEGER NOT NULL CHECK (accuracy_confirmed = 1),
  eligibility_confirmed INTEGER NOT NULL CHECK (eligibility_confirmed = 1),
  privacy_notice_acknowledged INTEGER NOT NULL CHECK (privacy_notice_acknowledged = 1),
  accepted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
