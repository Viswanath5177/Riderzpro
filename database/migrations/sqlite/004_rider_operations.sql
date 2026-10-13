-- SQLite local rider operations schema. No bank details or raw GPS history are stored.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS rider_notifications (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES app_users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('application', 'delivery', 'payout')),
  related_id TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rider_notifications_user_recent_idx ON rider_notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_delivery_jobs (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  external_order_id TEXT UNIQUE,
  pickup_label TEXT NOT NULL,
  dropoff_label TEXT NOT NULL,
  city TEXT NOT NULL,
  service_state TEXT NOT NULL CHECK (service_state IN ('Andhra Pradesh', 'Telangana')),
  rider_user_id TEXT NOT NULL REFERENCES app_users (id) ON DELETE RESTRICT,
  rider_earning_paise INTEGER NOT NULL CHECK (rider_earning_paise >= 0),
  status TEXT NOT NULL DEFAULT 'offered' CHECK (status IN ('offered', 'accepted', 'picked_up', 'delivered', 'cancelled')),
  created_by TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  offered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at TEXT,
  picked_up_at TEXT,
  delivered_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rider_delivery_jobs_rider_status_idx ON rider_delivery_jobs (rider_user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_delivery_events (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  delivery_id TEXT NOT NULL REFERENCES rider_delivery_jobs (id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rider_delivery_events_delivery_idx ON rider_delivery_events (delivery_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_earnings_ledger (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  rider_user_id TEXT NOT NULL REFERENCES app_users (id) ON DELETE RESTRICT,
  delivery_id TEXT NOT NULL UNIQUE REFERENCES rider_delivery_jobs (id) ON DELETE RESTRICT,
  amount_paise INTEGER NOT NULL CHECK (amount_paise >= 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'paid', 'reversed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT
);
CREATE INDEX IF NOT EXISTS rider_earnings_rider_status_idx ON rider_earnings_ledger (rider_user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_payouts (
  id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-a' || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))),
  rider_user_id TEXT NOT NULL REFERENCES app_users (id) ON DELETE RESTRICT,
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'processing', 'processed', 'failed', 'reversed', 'cancelled')),
  razorpay_payout_id TEXT UNIQUE,
  reference_id TEXT NOT NULL UNIQUE,
  utr TEXT,
  failure_reason TEXT,
  requested_by TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  approved_by TEXT REFERENCES app_users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TEXT
);
CREATE INDEX IF NOT EXISTS rider_payouts_rider_recent_idx ON rider_payouts (rider_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS rider_payout_ledger_entries (
  payout_id TEXT NOT NULL REFERENCES rider_payouts (id) ON DELETE CASCADE,
  earning_id TEXT NOT NULL UNIQUE REFERENCES rider_earnings_ledger (id) ON DELETE RESTRICT,
  PRIMARY KEY (payout_id, earning_id)
);


