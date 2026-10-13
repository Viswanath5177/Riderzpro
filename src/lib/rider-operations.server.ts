import { getDatabase } from "./db.server";
import { getCurrentUserServer } from "./auth.server";

export type RiderDeliveryStatus = "offered" | "accepted" | "picked_up" | "delivered" | "cancelled";
export type RiderDelivery = {
  id: string;
  external_order_id: string | null;
  pickup_label: string;
  dropoff_label: string;
  city: string;
  service_state: string;
  rider_user_id: string;
  rider_earning_paise: number;
  status: RiderDeliveryStatus;
  offered_at: string;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
};
export type RiderNotification = {
  id: string;
  title: string;
  message: string;
  kind: "application" | "delivery" | "payout";
  created_at: string;
  read_at: string | null;
};

const deliveryColumns = `id, external_order_id, pickup_label, dropoff_label, city, service_state,
  rider_user_id, rider_earning_paise, status, offered_at, accepted_at, picked_up_at, delivered_at`;

async function requireAdmin() {
  const user = await getCurrentUserServer();
  if (!user || user.role !== "admin") throw new Error("Admin access is required.");
  return user;
}

export async function listApprovedRidersForDispatchServer() {
  await requireAdmin();
  const result = await getDatabase().query<{
    user_id: string; legal_name: string; phone: string; city: string; service_state: string;
  }>(`select a.user_id, a.legal_name, a.phone, a.city, a.service_state
      from rider_applications a where a.status = 'approved' order by a.service_state, a.city, a.legal_name`);
  return result.rows;
}

export async function listRiderDeliveriesServer(): Promise<RiderDelivery[]> {
  const user = await getCurrentUserServer();
  if (!user) throw new Error("Sign in to view your deliveries.");
  const access = await getDatabase().query<{ status: string }>(
    "select status from rider_applications where user_id = $1 limit 1", [user.id],
  );
  if (user.role !== "customer" || access.rows[0]?.status !== "approved") {
    throw new Error("Only approved riders can access delivery assignments.");
  }
  const result = await getDatabase().query<RiderDelivery>(
    `select ${deliveryColumns} from rider_delivery_jobs where rider_user_id = $1
      order by case status when 'offered' then 0 when 'accepted' then 1 when 'picked_up' then 2 else 3 end,
               created_at desc limit 100`, [user.id],
  );
  return result.rows;
}

export async function listAllRiderDeliveriesServer(): Promise<RiderDelivery[]> {
  await requireAdmin();
  const result = await getDatabase().query<RiderDelivery>(
    `select ${deliveryColumns} from rider_delivery_jobs order by created_at desc limit 200`,
  );
  return result.rows;
}

export async function createRiderDeliveryJobServer(input: {
  riderUserId: string;
  externalOrderId: string;
  pickupLabel: string;
  dropoffLabel: string;
  city: string;
  serviceState: string;
  earningPaise: number;
}) {
  const admin = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(input.riderUserId)) throw new Error("Choose an approved rider.");
  const externalOrderId = input.externalOrderId.trim();
  const pickupLabel = input.pickupLabel.trim();
  const dropoffLabel = input.dropoffLabel.trim();
  const city = input.city.trim();
  if (externalOrderId.length > 100 || pickupLabel.length < 3 || pickupLabel.length > 240 || dropoffLabel.length < 3 || dropoffLabel.length > 240) {
    throw new Error("Enter a valid order reference and pickup/dropoff location labels (3–240 characters each).");
  }
  if (city.length < 2 || city.length > 100) throw new Error("Enter a valid delivery city.");
  if (!(input.serviceState === "Andhra Pradesh" || input.serviceState === "Telangana")) throw new Error("Dispatch is currently configured for Andhra Pradesh and Telangana.");
  if (!Number.isSafeInteger(input.earningPaise) || input.earningPaise < 0 || input.earningPaise > 10_000_000) {
    throw new Error("Enter rider earnings between ₹0 and ₹100,000 for this delivery.");
  }
  const db = getDatabase();
  const assignedRider = await db.query<{ status: string; service_state: string }>(
    "select status, service_state from rider_applications where user_id = $1 limit 1", [input.riderUserId],
  );
  const rider = assignedRider.rows[0];
  if (!rider || rider.status !== "approved") throw new Error("Only approved riders can receive delivery offers.");
  if (rider.service_state !== input.serviceState) throw new Error("The selected rider is not approved for this service state.");

  const client = await db.connect();
  let committed = false;
  try {
    if (db.dialect === "postgres") await client.query("begin");
    const inserted = await client.query<RiderDelivery>(
      `insert into rider_delivery_jobs
        (external_order_id, pickup_label, dropoff_label, city, service_state, rider_user_id, rider_earning_paise, created_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning ${deliveryColumns}`,
      [externalOrderId || null, pickupLabel, dropoffLabel, city, input.serviceState, input.riderUserId, input.earningPaise, admin.id],
    );
    const job = inserted.rows[0];
    if (!job) throw new Error("Could not create the delivery offer.");
    await client.query(
      `insert into rider_delivery_events (delivery_id, actor_id, from_status, to_status)
       values ($1, $2, null, 'offered')`, [job.id, admin.id],
    );
    await client.query(
      `insert into rider_notifications (user_id, title, message, kind, related_id)
       values ($1, 'New delivery offer', $2, 'delivery', $3)`,
      [input.riderUserId, `A delivery in ${city} is available. Open your rider dashboard to review it.`, job.id],
    );
    if (db.dialect === "postgres") await client.query("commit");
    else await client.commit?.();
    committed = true;
    return job;
  } catch (error) {
    if (!committed) {
      if (db.dialect === "postgres") await client.query("rollback").catch(() => undefined);
      else await client.rollback?.().catch(() => undefined);
    }
    throw error;
  } finally { client.release(); }
}

const allowedTransitions: Record<string, RiderDeliveryStatus[]> = {
  offered: ["accepted", "cancelled"],
  accepted: ["picked_up", "cancelled"],
  picked_up: ["delivered", "cancelled"],
};
const transitionTimestamp: Record<string, string> = {
  accepted: "accepted_at", picked_up: "picked_up_at", delivered: "delivered_at", cancelled: "cancelled_at",
};

export async function updateRiderDeliveryStatusServer(input: { deliveryId: string; status: RiderDeliveryStatus }) {
  const user = await getCurrentUserServer();
  if (!user || user.role !== "customer") throw new Error("Rider sign-in is required.");
  if (!/^[0-9a-f-]{36}$/i.test(input.deliveryId)) throw new Error("Invalid delivery reference.");
  const db = getDatabase();
  const client = await db.connect();
  let committed = false;
  try {
    if (db.dialect === "postgres") await client.query("begin");
    const currentResult = await client.query<RiderDelivery>(
      `select ${deliveryColumns} from rider_delivery_jobs where id = $1 and rider_user_id = $2 limit 1`,
      [input.deliveryId, user.id],
    );
    const current = currentResult.rows[0];
    if (!current) throw new Error("Delivery not found.");
    if (!allowedTransitions[current.status]?.includes(input.status)) throw new Error("This delivery cannot move to that status.");
    const timestamp = transitionTimestamp[input.status];
    const updated = await client.query<RiderDelivery>(
      `update rider_delivery_jobs set status = $3, ${timestamp} = now(), updated_at = now()
        where id = $1 and rider_user_id = $2 and status = $4 returning ${deliveryColumns}`,
      [input.deliveryId, user.id, input.status, current.status],
    );
    const job = updated.rows[0];
    if (!job) throw new Error("Another update changed this delivery. Refresh and try again.");
    await client.query(
      `insert into rider_delivery_events (delivery_id, actor_id, from_status, to_status)
       values ($1, $2, $3, $4)`, [job.id, user.id, current.status, input.status],
    );
    if (input.status === "delivered") {
      await client.query(
        `insert into rider_earnings_ledger (rider_user_id, delivery_id, amount_paise)
         values ($1, $2, $3) on conflict (delivery_id) do nothing`,
        [user.id, job.id, job.rider_earning_paise],
      );
    }
    if (db.dialect === "postgres") await client.query("commit");
    else await client.commit?.();
    committed = true;
    return job;
  } catch (error) {
    if (!committed) {
      if (db.dialect === "postgres") await client.query("rollback").catch(() => undefined);
      else await client.rollback?.().catch(() => undefined);
    }
    throw error;
  } finally { client.release(); }
}

export async function getRiderEarningsServer() {
  const user = await getCurrentUserServer();
  if (!user || user.role !== "customer") throw new Error("Rider sign-in is required.");
  const result = await getDatabase().query<{
    available_paise: number; paid_paise: number; deliveries: number;
  }>(`select
        coalesce(sum(case when status = 'available' then amount_paise else 0 end), 0) as available_paise,
        coalesce(sum(case when status = 'paid' then amount_paise else 0 end), 0) as paid_paise,
        count(*) as deliveries
      from rider_earnings_ledger where rider_user_id = $1`, [user.id]);
  return result.rows[0] ?? { available_paise: 0, paid_paise: 0, deliveries: 0 };
}

export async function getRiderNotificationsServer(): Promise<RiderNotification[]> {
  const user = await getCurrentUserServer();
  if (!user) throw new Error("Sign in to view notifications.");
  const result = await getDatabase().query<RiderNotification>(
    `select id, title, message, kind, created_at, read_at from rider_notifications
      where user_id = $1 order by created_at desc limit 50`, [user.id],
  );
  return result.rows;
}
