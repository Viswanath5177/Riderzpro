import crypto from "node:crypto";
import type { IncomingMessage } from "node:http";
import { query } from "../db";

export type SessionUser = { id: string; role: string };

function getCookie(req: IncomingMessage, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

export async function getSessionUser(req: IncomingMessage): Promise<SessionUser | null> {
  const token = getCookie(req, "auth_session");
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const result = await query<{ user_id: string; user_role: string }>(
    `SELECT user_id, user_role FROM auth_sessions
      WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()
      LIMIT 1`,
    [tokenHash],
  );
  return result.rows[0] ? { id: result.rows[0].user_id, role: result.rows[0].user_role } : null;
}
