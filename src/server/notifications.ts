import crypto from "node:crypto";
import { query } from "./db";

export interface NotificationPayload {
  userId: string;
  userRole: "customer" | "seller" | "PRODUCT_ADMIN" | "SELLER_ADMIN" | "SUPER_ADMIN" | "admin" | string;
  type: string;
  title: string;
  message: string;
  entityId?: string | null;
  targetRoute?: string | null;
}

/**
 * Creates and persists a centralized notification for a user or admin role.
 */
export async function createNotification(payload: NotificationPayload): Promise<string> {
  const notifId = `notif_${crypto.randomBytes(8).toString("hex")}`;
  try {
    // Avoid duplicate notifications for exact same entity and type within last 5 minutes
    if (payload.entityId) {
      const check = await query(
        `SELECT id FROM notifications 
         WHERE user_id = $1 AND type = $2 AND entity_id = $3 AND created_at > datetime('now', '-5 minutes')
         LIMIT 1`,
        [payload.userId, payload.type, payload.entityId]
      );
      if (check.rows.length > 0) {
        return check.rows[0].id;
      }
    }

    await query(
      `INSERT INTO notifications (id, user_id, user_role, type, title, message, entity_id, target_route, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, datetime('now'))`,
      [
        notifId,
        payload.userId,
        payload.userRole,
        payload.type,
        payload.title,
        payload.message,
        payload.entityId || null,
        payload.targetRoute || null,
      ]
    );
    return notifId;
  } catch (err: any) {
    console.warn("[Notifications] Failed to create notification:", err?.message);
    return notifId;
  }
}

/**
 * Notifies all admins of a specific role (e.g., SELLER_ADMIN, PRODUCT_ADMIN, SUPER_ADMIN).
 */
export async function notifyAdminRole(role: string, payload: Omit<NotificationPayload, "userId" | "userRole">) {
  try {
    const adminsRes = await query("SELECT id, role FROM admins WHERE role = $1 AND is_active = 1", [role]);
    for (const admin of adminsRes.rows) {
      await createNotification({
        ...payload,
        userId: admin.id,
        userRole: admin.role,
      });
    }
  } catch (err: any) {
    console.warn(`[Notifications] Failed to notify admin role ${role}:`, err?.message);
  }
}
