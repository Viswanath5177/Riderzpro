import crypto from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { query } from "../db";
import { sendJson } from "./http";

export type SessionUser = { id: string; role: string };

export class AuthError extends Error {
  statusCode: 401 | 403;
  constructor(statusCode: 401 | 403, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

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

interface StoredSession {
  id: string;
  role: string;
  expiresAt: number;
}

const devSessionStore = new Map<string, StoredSession>();

export function saveDevSession(tokenHash: string, user: SessionUser, ttlMs: number = 30 * 24 * 3600 * 1000): void {
  devSessionStore.set(tokenHash, {
    id: user.id,
    role: user.role,
    expiresAt: Date.now() + ttlMs,
  });
}

export function revokeDevSession(tokenHash: string): void {
  devSessionStore.delete(tokenHash);
}

export async function getSessionUser(req: IncomingMessage): Promise<SessionUser | null> {
  const token = getCookie(req, "auth_session");
  if (!token) return null;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // 1. Check PostgreSQL auth_sessions if pool is available
  try {
    const result = await query<{ id: string; user_id: string; user_role: string; last_active_at: string; expires_at: string; revoked_at: string | null }>(
      `SELECT id, user_id, user_role, last_active_at, expires_at, revoked_at FROM auth_sessions
        WHERE token_hash = $1
        LIMIT 1`,
      [tokenHash],
    );
    if (result.rows[0]) {
      const sess = result.rows[0];
      if (sess.revoked_at) return null;
      const now = Date.now();
      if (new Date(sess.expires_at).getTime() <= now) return null;

      const lastActiveTime = sess.last_active_at ? new Date(sess.last_active_at).getTime() : 0;
      if (lastActiveTime > 0 && now - lastActiveTime > 10 * 60 * 1000) {
        await query("UPDATE auth_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = $1", [sess.id]).catch(() => {});
        return null;
      }

      const passiveHeader = req.headers["x-passive-poll"] || req.headers["x-background-poll"];
      if (passiveHeader !== "true" && passiveHeader !== "1") {
        if (now - lastActiveTime > 5000) {
          query("UPDATE auth_sessions SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1", [sess.id]).catch(() => {});
        }
      }

      const { user_id, user_role } = sess;

      // Cross-reference with users table to ensure user is active and role is fresh
      try {
        const uRes = await query<{ id: string; role: string; is_active: boolean }>(
          `SELECT id, role, is_active FROM users WHERE id = $1 LIMIT 1`,
          [user_id],
        );
        if (uRes.rows[0]) {
          if (uRes.rows[0].is_active === false) return null;
          return { id: uRes.rows[0].id, role: uRes.rows[0].role || user_role };
        }
      } catch {
        // If users table is unavailable or user exists in legacy role tables
      }

      return { id: user_id, role: user_role };
    }
  } catch {
    // Database connection offline
  }

  // 1b. Check local SQLite database if configured
  try {
    const rawDbUrl = process.env.DATABASE_URL || "";
    if (rawDbUrl.startsWith("file:")) {
      const { createClient } = await import("@libsql/client");
      const client = createClient({ url: rawDbUrl });
      try {
        const result = await client.execute({
          sql: `SELECT s.user_id, COALESCE(u.role, 'customer') as user_role 
                FROM auth_sessions s 
                LEFT JOIN app_users u ON s.user_id = u.id 
                WHERE s.token_hash = ? AND s.revoked_at IS NULL AND datetime(s.expires_at) > datetime('now') 
                LIMIT 1`,
          args: [tokenHash],
        });
        if (result.rows.length > 0) {
          const r = result.rows[0];
          const rawRole = String(r.user_role || "");
          const effectiveRole = rawRole === "rider" || String(r.user_id).includes("rider") ? "rider" : (rawRole || "customer");
          return { id: String(r.user_id), role: effectiveRole };
        }
      } finally {
        client.close();
      }
    }
  } catch {
    // SQLite query fallback skipped
  }

  // 2. Check local dev fallback session store
  const devSess = devSessionStore.get(tokenHash);
  if (devSess) {
    if (devSess.expiresAt > Date.now()) {
      return { id: devSess.id, role: devSess.role };
    }
    devSessionStore.delete(tokenHash);
  }

  return null;
}

export async function requireRole(
  req: IncomingMessage,
  role: "admin" | "seller" | "rider" | "customer" | string | Array<"admin" | "seller" | "rider" | "customer" | string>,
  res?: ServerResponse,
): Promise<SessionUser> {
  const user = await getSessionUser(req);
  if (!user) {
    if (res && !res.headersSent) {
      sendJson(res, 401, { success: false, error: "Authentication required." });
    }
    throw new AuthError(401, "Authentication required.");
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  const userRole = (user.role || "").toLowerCase();

  const isAuthorized = allowedRoles.some((r) => {
    const target = r.toLowerCase();
    if (target === "admin") {
      return userRole === "admin" || userRole.includes("admin");
    }
    return userRole === target;
  });

  if (!isAuthorized) {
    if (res && !res.headersSent) {
      sendJson(res, 403, { success: false, error: "Access forbidden: insufficient role permissions." });
    }
    throw new AuthError(403, "Access forbidden: insufficient role permissions.");
  }

  return user;
}

