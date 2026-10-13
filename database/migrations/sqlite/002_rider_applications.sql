-- Rider onboarding applications. Applications do not grant delivery access.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS rider_applications (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL UNIQUE REFERENCES app_users (id) ON DELETE CASCADE,
  legal_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motorcycle', 'scooter', 'bicycle')),
  vehicle_registration TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'needs_correction', 'approved', 'rejected')),
  reviewer_id TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  review_note TEXT,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS rider_applications_status_idx
  ON rider_applications (status, submitted_at);
