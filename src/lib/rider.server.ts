import { env } from "cloudflare:workers";
import { getDatabase } from "./db.server";
import { getCurrentUserServer } from "./auth.server";
import { normalizeIndiaPhone, RIDER_LAUNCH_STATES } from "./rider.validation";

export type RiderApplicationStatus = "pending_review" | "needs_correction" | "approved" | "rejected";
export type RiderVehicleType = "motorcycle" | "scooter" | "bicycle";

export type RiderApplication = {
  id: string;
  user_id: string;
  legal_name: string;
  phone: string;
  city: string;
  service_state: string;
  vehicle_type: RiderVehicleType;
  vehicle_registration: string;
  status: RiderApplicationStatus;
  review_note: string | null;
  submitted_at: string;
};

const applicationColumns = `id, user_id, legal_name, phone, city, service_state,
  vehicle_type, vehicle_registration, status, review_note, submitted_at`;

export async function getRiderApplicationServer(): Promise<RiderApplication | null> {
  const user = await getCurrentUserServer();
  if (!user) return null;
  const result = await getDatabase().query<RiderApplication>(
    `select ${applicationColumns} from rider_applications where user_id = $1 limit 1`,
    [user.id],
  );
  return result.rows[0] ?? null;
}

export async function submitRiderApplicationServer(input: {
  legalName: string;
  phone: string;
  city: string;
  serviceState: string;
  vehicleType: RiderVehicleType;
  vehicleRegistration: string;
  accuracyConfirmed: boolean;
  eligibilityConfirmed: boolean;
  privacyNoticeAcknowledged: boolean;
}): Promise<RiderApplication> {
  const user = await getCurrentUserServer();
  if (!user) throw new Error("Sign in with your mobile number to submit a rider application.");
  if (user.role !== "customer") throw new Error("This account cannot submit a rider application.");
  if (!user.phone) throw new Error("Verify your mobile number by signing in with its one-time code before applying.");
  const phone = normalizeIndiaPhone(input.phone);
  if (normalizeIndiaPhone(user.phone) !== phone) throw new Error("The application mobile number must match the number verified on your account.");
  if (!(RIDER_LAUNCH_STATES as readonly string[]).includes(input.serviceState)) {
    throw new Error("Rider applications are currently open only in Andhra Pradesh and Telangana.");
  }
  if (!input.accuracyConfirmed || !input.eligibilityConfirmed || !input.privacyNoticeAcknowledged) {
    throw new Error("Confirm the accuracy and eligibility statements and acknowledge the rider privacy notice before submitting.");
  }

  const db = getDatabase();
  const client = await db.connect();
  let committed = false;
  try {
    if (db.dialect === "postgres") await client.query("begin");
    const prior = await client.query<RiderApplication>(
      `select ${applicationColumns} from rider_applications where user_id = $1 limit 1`, [user.id],
    );
    const existing = prior.rows[0];
    if (existing?.status === "approved") throw new Error("Your rider account is already approved.");
    if (existing?.status === "pending_review") throw new Error("Your application is already under review.");

    let result;
    if (existing) {
      result = await client.query<RiderApplication>(
        `update rider_applications
            set legal_name = $2, phone = $3, city = $4, service_state = $5,
                vehicle_type = $6, vehicle_registration = $7,
                status = 'pending_review', review_note = null, submitted_at = now(),
                reviewed_at = null, reviewer_id = null, updated_at = now()
          where user_id = $1 and status in ('needs_correction', 'rejected')
          returning ${applicationColumns}`,
        [user.id, input.legalName, phone, input.city, input.serviceState, input.vehicleType, input.vehicleRegistration],
      );
    } else {
      result = await client.query<RiderApplication>(
        `insert into rider_applications
           (user_id, legal_name, phone, city, service_state, vehicle_type, vehicle_registration, status)
         values ($1, $2, $3, $4, $5, $6, $7, 'pending_review')
         returning ${applicationColumns}`,
        [user.id, input.legalName, phone, input.city, input.serviceState, input.vehicleType, input.vehicleRegistration],
      );
    }
    const application = result.rows[0];
    if (!application) throw new Error("Your application changed while it was being submitted. Refresh and try again.");

    await client.query(
      `insert into rider_application_events (application_id, actor_id, event_type, from_status, to_status)
       values ($1, $2, $3, $4, 'pending_review')`,
      [application.id, user.id, existing ? "resubmitted" : "submitted", existing?.status ?? null],
    );
    await client.query(
      `insert into rider_application_consents
         (application_id, consent_version, accuracy_confirmed, eligibility_confirmed, privacy_notice_acknowledged)
       values ($1, 'india-rider-privacy-v1', true, true, true)`,
      [application.id],
    );
    await client.query(
      `insert into rider_notifications (user_id, title, message, kind, related_id)
       values ($1, 'Application received', 'Your rider application was submitted. We will update you when its review status changes.', 'application', $2)`,
      [user.id, application.id],
    );
    if (db.dialect === "postgres") await client.query("commit");
    else await client.commit?.();
    committed = true;
    return application;
  } catch (error) {
    if (!committed) {
      if (db.dialect === "postgres") await client.query("rollback").catch(() => undefined);
      else await client.rollback?.().catch(() => undefined);
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function listRiderApplicationsForAdminServer(): Promise<RiderApplication[]> {
  const user = await getCurrentUserServer();
  if (!user || user.role !== "admin") throw new Error("Admin access is required to review rider applications.");
  const result = await getDatabase().query<RiderApplication>(
    `select ${applicationColumns} from rider_applications
      order by case status when 'pending_review' then 0 when 'needs_correction' then 1 else 2 end,
               submitted_at desc limit 200`,
  );
  return result.rows;
}

export async function reviewRiderApplicationServer(input: {
  applicationId: string;
  status: "approved" | "needs_correction" | "rejected";
  note: string;
  verificationConfirmed: boolean;
}): Promise<RiderApplication> {
  const reviewer = await getCurrentUserServer();
  if (!reviewer || reviewer.role !== "admin") throw new Error("Admin access is required to review rider applications.");
  if (!/^[0-9a-f-]{36}$/i.test(input.applicationId)) throw new Error("Invalid application reference.");
  const note = input.note.trim();
  if (note.length > 1000) throw new Error("Review notes must be 1,000 characters or fewer.");
  if (input.status !== "approved" && note.length < 5) throw new Error("Add a short explanation for the rider.");
  if (input.status === "approved" && !input.verificationConfirmed) {
    throw new Error("Confirm that the required identity and vehicle checks were completed before approving.");
  }
  if (input.status === "approved") {
    const bindings = env as { RIDER_APPROVALS_ENABLED?: string };
    const enabled = (bindings.RIDER_APPROVALS_ENABLED ?? process.env["RIDER_APPROVALS_ENABLED"] ?? "false").toLowerCase() === "true";
    if (!enabled) throw new Error("Rider activation is disabled until Riderzpro's India verification policy and secure review process are configured.");
  }

  const db = getDatabase();
  const client = await db.connect();
  let committed = false;
  try {
    if (db.dialect === "postgres") await client.query("begin");
    const previous = await client.query<RiderApplication>(
      `select ${applicationColumns} from rider_applications where id = $1 limit 1`, [input.applicationId],
    );
    const current = previous.rows[0];
    if (!current) throw new Error("Rider application not found.");
    if (!["pending_review", "needs_correction"].includes(current.status)) {
      throw new Error("This application has already reached a final decision. The rider must resubmit before another review.");
    }
    const update = await client.query<RiderApplication>(
      `update rider_applications
          set status = $2, review_note = $3, reviewer_id = $4,
              reviewed_at = now(), updated_at = now()
        where id = $1 and status in ('pending_review', 'needs_correction')
        returning ${applicationColumns}`,
      [input.applicationId, input.status, note || null, reviewer.id],
    );
    const application = update.rows[0];
    if (!application) throw new Error("This application was updated by another reviewer. Refresh the list.");
    await client.query(
      `insert into rider_application_events (application_id, actor_id, event_type, from_status, to_status, note)
       values ($1, $2, $3, $4, $5, $6)`,
      [application.id, reviewer.id, input.status, current.status, input.status, note || null],
    );
    const notification = input.status === "approved"
      ? { title: "Rider application approved", message: "Your rider account is approved. Sign in to open your rider dashboard." }
      : input.status === "needs_correction"
        ? { title: "Application update needed", message: "The review team requested an update. Open your application status for the note and next steps." }
        : { title: "Application decision", message: "A decision has been made on your rider application. Open your application status for details." };
    await client.query(
      `insert into rider_notifications (user_id, title, message, kind, related_id)
       values ($1, $2, $3, 'application', $4)`,
      [application.user_id, notification.title, notification.message, application.id],
    );
    if (db.dialect === "postgres") await client.query("commit");
    else await client.commit?.();
    committed = true;
    return application;
  } catch (error) {
    if (!committed) {
      if (db.dialect === "postgres") await client.query("rollback").catch(() => undefined);
      else await client.rollback?.().catch(() => undefined);
    }
    throw error;
  } finally {
    client.release();
  }
}
