import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { getDatabase } from "./db.server";

type AppRole = "customer" | "admin";
type Bindings = {
  APP_ENV?: string;
  OTP_HASH_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM?: string;
};
const SESSION_COOKIE = "riderzpro_session";

function config() { return env as Bindings; }

function normalizeIdentity(input: string) {
  const value = input.trim();
  if (value.includes("@")) {
    const email = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
    return { value: email, channel: "email" as const };
  }
  const phone = value.replace(/[\s()-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Enter an email address or an E.164 phone number, such as +919876543210.");
  return { value: phone, channel: "sms" as const };
}

function randomDigits() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return String(value[0] % 1_000_000).padStart(6, "0");
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashOtp(identity: string, code: string) {
  const secret = config().OTP_HASH_SECRET ?? process.env["OTP_HASH_SECRET"];
  if (!secret || secret.length < 32) throw new Error("Configure OTP_HASH_SECRET as a server-side secret (at least 32 characters).");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const hash = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${identity}:${code}`));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function deliverCode(identity: ReturnType<typeof normalizeIdentity>, code: string) {
  const current = config();
  const message = `Your Riderzpro sign-in code is ${code}. It expires in 10 minutes.`;
  if (identity.channel === "email") {
    const key = current.RESEND_API_KEY ?? process.env["RESEND_API_KEY"];
    const from = current.RESEND_FROM ?? process.env["RESEND_FROM"];
    if (!key || !from) throw new Error("Email sign-in is not configured. Add RESEND_API_KEY and RESEND_FROM as server secrets.");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [identity.value], subject: "Your Riderzpro sign-in code", text: message }),
    });
    if (!response.ok) throw new Error("Could not deliver the email code. Try again shortly.");
    return;
  }
  const sid = current.TWILIO_ACCOUNT_SID ?? process.env["TWILIO_ACCOUNT_SID"];
  const token = current.TWILIO_AUTH_TOKEN ?? process.env["TWILIO_AUTH_TOKEN"];
  const from = current.TWILIO_FROM ?? process.env["TWILIO_FROM"];
  if (!sid || !token || !from) throw new Error("Phone sign-in is not configured. Add Twilio credentials as server secrets.");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST", headers: { authorization: `Basic ${btoa(`${sid}:${token}`)}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: identity.value, From: from, Body: message }),
  });
  if (!response.ok) throw new Error("Could not deliver the SMS code. Try again shortly.");
}

export async function requestSignInCodeServer(input: string) {
  const identity = normalizeIdentity(input);
  const pool = getDatabase();
  const recent = await pool.query<{ count: string }>(
    "select count(*)::text as count from auth_otp_challenges where identity = $1 and created_at > now() - interval '15 minutes'",
    [identity.value],
  );
  if (Number(recent.rows[0]?.count ?? 0) >= 3) throw new Error("Too many sign-in codes requested. Please wait before trying again.");
  const code = randomDigits();
  const codeHash = await hashOtp(identity.value, code);
  await pool.query(
    "insert into auth_otp_challenges (identity, channel, code_hash, expires_at) values ($1, $2, $3, now() + interval '10 minutes')",
    [identity.value, identity.channel, codeHash],
  );
  try {
    await deliverCode(identity, code);
  } catch (error) {
    await pool.query("delete from auth_otp_challenges where identity = $1 and code_hash = $2", [identity.value, codeHash]);
    throw error;
  }
  return { sent: true };
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

export async function verifySignInCodeServer(input: string, rawCode: string): Promise<AppRole> {
  const identity = normalizeIdentity(input);
  const code = rawCode.trim();
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the six-digit sign-in code.");
  const db = getDatabase();
  const client = await db.connect();
  let token = "";
  let role: AppRole = "customer";
  let committed = false;
  try {
    if (db.dialect === "postgres") await client.query("begin");
    const result = await client.query<{ id: string; code_hash: string; attempts: number }>(
      "select id, code_hash, attempts from auth_otp_challenges where identity = $1 and consumed_at is null and expires_at > now() order by created_at desc limit 1 for update",
      [identity.value],
    );
    const challenge = result.rows[0];
    if (!challenge) throw new Error("That sign-in code is invalid or expired. Request a new one.");
    if (challenge.attempts >= 5) {
      await client.query("update auth_otp_challenges set consumed_at = now() where id = $1", [challenge.id]);
      if (db.dialect === "postgres") await client.query("commit");
      else await client.commit?.();
      committed = true;
      throw new Error("Too many incorrect attempts. Request a new sign-in code.");
    }
    if (!constantTimeEqual(await hashOtp(identity.value, code), challenge.code_hash)) {
      await client.query("update auth_otp_challenges set attempts = attempts + 1 where id = $1", [challenge.id]);
      if (db.dialect === "postgres") await client.query("commit");
      else await client.commit?.();
      committed = true;
      throw new Error("That sign-in code is incorrect.");
    }
    await client.query("update auth_otp_challenges set consumed_at = now() where id = $1", [challenge.id]);
    const user = identity.channel === "email"
      ? await client.query<{ id: string; role: AppRole }>("insert into app_users (email) values ($1) on conflict (email) do update set email = excluded.email returning id, role", [identity.value])
      : await client.query<{ id: string; role: AppRole }>("insert into app_users (phone) values ($1) on conflict (phone) do update set phone = excluded.phone returning id, role", [identity.value]);
    const account = user.rows[0];
    if (!account) throw new Error("Could not create the account.");
    role = account.role;
    token = randomToken();
    await client.query("insert into auth_sessions (user_id, token_hash, expires_at) values ($1, $2, now() + interval '30 days')", [account.id, await digest(token)]);
    if (db.dialect === "postgres") await client.query("commit");
    else await client.commit?.();
    committed = true;
  } catch (error) {
    if (!committed) {
      if (db.dialect === "postgres") await client.query("rollback").catch(() => undefined);
      else await client.rollback?.().catch(() => undefined);
    }
    throw error;
  } finally {
    client.release();
  }
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true, secure: (config().APP_ENV ?? process.env["NODE_ENV"]) !== "development",
    sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60,
  });
  return role;
}

export async function getCurrentRoleServer(): Promise<AppRole | null> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;
  const result = await getDatabase().query<{ role: AppRole }>(
    "select u.role from auth_sessions s join app_users u on u.id = s.user_id where s.token_hash = $1 and s.revoked_at is null and s.expires_at > now() limit 1",
    [await digest(token)],
  );
  return result.rows[0]?.role ?? null;
}

export async function signOutServer() {
  const token = getCookie(SESSION_COOKIE);
  if (token) {
    await getDatabase().query("update auth_sessions set revoked_at = now() where token_hash = $1 and revoked_at is null", [await digest(token)]);
  }
  deleteCookie(SESSION_COOKIE, { path: "/" });
  return { success: true };
}
