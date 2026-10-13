import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "./db.server";
import {
  sendOtpEmail,
  sendVendorApplicationReceivedEmail,
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorMoreInfoEmail,
  sendProductApprovalEmail,
} from "./email.server";

export type RoleType = "customer" | "seller" | "PRODUCT_ADMIN" | "SUPPORT_ADMIN" | "SELLER_ADMIN" | "SUPER_ADMIN" | "admin";

const SESSION_COOKIE = "riderzpro_session";

function normalizeEmail(input: string): string {
  const email = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  return email;
}

function randomDigits(length = 6): string {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  const max = Math.pow(10, length);
  return String(value[0] % max).padStart(length, "0");
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function digest(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashOtp(identity: string, code: string): Promise<string> {
  const secret = process.env["OTP_HASH_SECRET"] || "riderzpro_dev_otp_secret_key_development_only";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const hash = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${identity}:${code}`));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ----------------------------------------------------------------------------
// Email OTP Services (Email Only, 5 min expiry, 60s cooldown, 5 max attempts)
// ----------------------------------------------------------------------------

export async function requestEmailOtpServer(
  rawEmail: string,
  purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP"
) {
  const email = normalizeEmail(rawEmail);
  const db = getDatabase();

  // 1. Check for duplicates based on purpose
  if (purpose === "CUSTOMER_SIGNUP") {
    const existing = await db.query<{ id: string }>("SELECT id FROM customers WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      throw new Error("An account with this email address already exists. Please sign in.");
    }
  } else if (purpose === "VENDOR_SIGNUP") {
    const existing = await db.query<{ id: string }>("SELECT id FROM sellers WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      throw new Error("A seller account with this email already exists. Please sign in to seller dashboard.");
    }
  }

  // 2. Check 60-second cooldown
  const recentOne = await db.query<{ created_at: Date }>(
    `SELECT created_at FROM email_verification_attempts 
     WHERE email = $1 AND purpose = $2 
     ORDER BY created_at DESC LIMIT 1`,
    [email, purpose]
  );
  if (recentOne.rows[0]) {
    const elapsedSec = (Date.now() - new Date(recentOne.rows[0].created_at).getTime()) / 1000;
    if (elapsedSec < 60) {
      const wait = Math.ceil(60 - elapsedSec);
      throw new Error(`Please wait ${wait} seconds before requesting a new verification code.`);
    }
  }

  // 3. Check rate limit: max 5 OTP requests in 15 minutes
  const recentAttempts = await db.query<{ count: string }>(
    `SELECT count(*)::text as count FROM email_verification_attempts 
     WHERE email = $1 AND purpose = $2 AND created_at > now() - interval '15 minutes'`,
    [email, purpose]
  );
  if (Number(recentAttempts.rows[0]?.count || 0) >= 5) {
    throw new Error("Too many verification codes requested. Please wait 15 minutes before trying again.");
  }

  // 4. Generate 6-digit OTP and HMAC hash
  const code = randomDigits(6);
  const codeHash = await hashOtp(email, code);

  // Invalidate any older unconsumed codes for this email and purpose
  await db.query(
    "UPDATE email_verification_attempts SET consumed_at = now() WHERE email = $1 AND purpose = $2 AND consumed_at IS NULL",
    [email, purpose]
  );

  // Insert new challenge (5-minute expiration)
  await db.query(
    `INSERT INTO email_verification_attempts (email, purpose, code_hash, expires_at)
     VALUES ($1, $2, $3, now() + interval '5 minutes')`,
    [email, purpose, codeHash]
  );

  // 5. Deliver Email via nodemailer / Gmail SMTP
  const emailRes = await sendOtpEmail(email, code, purpose);
  if (!emailRes.success) {
    console.warn(`[OTP] Email delivery failed, code logged for development: ${code}`);
  }

  return {
    sent: true,
    email,
    cooldownSeconds: 60,
    expiryMinutes: 5,
  };
}

export async function verifyEmailOtpServer(
  rawEmail: string,
  rawCode: string,
  purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP"
): Promise<{ verified: boolean; email: string }> {
  const email = normalizeEmail(rawEmail);
  const code = rawCode.trim();
  if (!/^\d{6}$/.test(code)) {
    throw new Error("Please enter a valid 6-digit verification code.");
  }

  const db = getDatabase();
  const res = await db.query<{ id: string; code_hash: string; attempts: number }>(
    `SELECT id, code_hash, attempts 
     FROM email_verification_attempts 
     WHERE email = $1 AND purpose = $2 AND consumed_at IS NULL AND expires_at > now() 
     ORDER BY created_at DESC LIMIT 1`,
    [email, purpose]
  );

  const attempt = res.rows[0];
  if (!attempt) {
    throw new Error("Verification code has expired or is invalid. Please request a new code.");
  }

  if (attempt.attempts >= 5) {
    await db.query("UPDATE email_verification_attempts SET consumed_at = now() WHERE id = $1", [attempt.id]);
    throw new Error("Too many incorrect attempts. Please request a new verification code.");
  }

  const expectedHash = await hashOtp(email, code);
  if (!constantTimeEqual(expectedHash, attempt.code_hash)) {
    await db.query("UPDATE email_verification_attempts SET attempts = attempts + 1 WHERE id = $1", [attempt.id]);
    throw new Error("Invalid verification code. Please check your email and try again.");
  }

  // Mark as consumed
  await db.query("UPDATE email_verification_attempts SET consumed_at = now() WHERE id = $1", [attempt.id]);
  return { verified: true, email };
}

// ----------------------------------------------------------------------------
// Customer Registration & Authentication
// ----------------------------------------------------------------------------

export async function registerCustomerServer(payload: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  otpCode: string;
}) {
  const email = normalizeEmail(payload.email);
  if (!payload.fullName || payload.fullName.trim().length < 2) {
    throw new Error("Please enter your full legal name.");
  }
  if (!payload.password || payload.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // 1. Verify Email OTP first (MANDATORY)
  await verifyEmailOtpServer(email, payload.otpCode, "CUSTOMER_SIGNUP");

  const db = getDatabase();

  // 2. Hash password securely
  const passwordHash = await bcrypt.hash(payload.password, 10);

  // 3. Create customer record
  const customerRes = await db.query<{ id: string; email: string; full_name: string; phone: string }>(
    `INSERT INTO customers (email, password_hash, full_name, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, phone`,
    [email, passwordHash, payload.fullName.trim(), payload.phone?.trim() || null]
  );
  const customer = customerRes.rows[0];

  // 4. Create customer profile with initial 100 loyalty points bonus
  await db.query(
    "INSERT INTO customer_profiles (customer_id, loyalty_points) VALUES ($1, 100) ON CONFLICT DO NOTHING",
    [customer.id]
  );

  // 5. Initialize persistent Cart and Wishlist
  await db.query("INSERT INTO carts (customer_id) VALUES ($1) ON CONFLICT DO NOTHING", [customer.id]);
  await db.query("INSERT INTO wishlists (customer_id) VALUES ($1) ON CONFLICT DO NOTHING", [customer.id]);

  // 6. Establish authenticated session
  const token = randomToken();
  const tokenHash = await digest(token);
  await db.query(
    "INSERT INTO auth_sessions (user_id, user_role, token_hash, expires_at) VALUES ($1, 'customer', $2, now() + interval '30 days')",
    [customer.id, tokenHash]
  );

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    customer: {
      id: customer.id,
      email: customer.email,
      fullName: customer.full_name,
      phone: customer.phone,
      role: "customer" as const,
    },
  };
}

export async function customerSignInServer(rawEmail: string, rawPassword: string) {
  const email = normalizeEmail(rawEmail);
  const db = getDatabase();

  const res = await db.query<{ id: string; email: string; password_hash: string; full_name: string; phone: string; is_active: boolean }>(
    "SELECT id, email, password_hash, full_name, phone, is_active FROM customers WHERE email = $1 LIMIT 1",
    [email]
  );
  const customer = res.rows[0];
  if (!customer || !customer.is_active) {
    throw new Error("Invalid email or password.");
  }

  const valid = await bcrypt.compare(rawPassword, customer.password_hash);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  // Create session
  const token = randomToken();
  const tokenHash = await digest(token);
  await db.query(
    "INSERT INTO auth_sessions (user_id, user_role, token_hash, expires_at) VALUES ($1, 'customer', $2, now() + interval '30 days')",
    [customer.id, tokenHash]
  );

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    id: customer.id,
    email: customer.email,
    fullName: customer.full_name,
    phone: customer.phone,
    role: "customer" as const,
  };
}

// ----------------------------------------------------------------------------
// Vendor Onboarding & Registration
// ----------------------------------------------------------------------------

export interface VendorRegistrationPayload {
  // Personal
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  otpCode: string;
  // Business
  storeName: string;
  businessType?: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  gstin?: string;
  // Documents
  panNumber: string;
  panDocUrl: string;
  aadhaarNumber?: string;
  aadhaarDocUrl: string;
  businessDocUrl?: string;
  // Bank details
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export async function registerVendorServer(payload: VendorRegistrationPayload) {
  const email = normalizeEmail(payload.email);
  if (!payload.fullName || !payload.storeName || !payload.streetAddress || !payload.city || !payload.pincode) {
    throw new Error("Please complete all required business and owner information.");
  }
  if (!payload.panNumber || !payload.panDocUrl) {
    throw new Error("PAN card number and document upload are required.");
  }
  if (!payload.aadhaarDocUrl) {
    throw new Error("Aadhaar front photo with address is required.");
  }
  if (!payload.accountHolderName || !payload.bankName || !payload.accountNumber || !payload.ifscCode) {
    throw new Error("Please provide complete bank account payout details.");
  }

  // 1. Verify Email OTP first (MANDATORY)
  await verifyEmailOtpServer(email, payload.otpCode, "VENDOR_SIGNUP");

  const db = getDatabase();

  // 2. Hash password
  const defaultPass = payload.password && payload.password.length >= 6 ? payload.password : "Vendor@Riderzpro2026";
  const passwordHash = await bcrypt.hash(defaultPass, 10);

  // 3. Insert Seller with PENDING_REVIEW status
  const sellerRes = await db.query<{ id: string; email: string; store_name: string; owner_name: string; status: string }>(
    `INSERT INTO sellers (
      email, phone, password_hash, store_name, owner_name, business_type, 
      business_address, city, state, pincode, country, gstin, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'PENDING_REVIEW')
    RETURNING id, email, store_name, owner_name, status`,
    [
      email,
      payload.phone.trim(),
      passwordHash,
      payload.storeName.trim(),
      payload.fullName.trim(),
      payload.businessType || "Proprietorship",
      payload.streetAddress.trim(),
      payload.city.trim(),
      payload.state.trim() || "Karnataka",
      payload.pincode.trim(),
      payload.country || "India",
      payload.gstin?.trim() || null,
    ]
  );
  const seller = sellerRes.rows[0];

  // 4. Save KYC Documents
  await db.query(
    `INSERT INTO seller_documents (seller_id, doc_type, doc_number, file_path)
     VALUES ($1, 'PAN', $2, $3)`,
    [seller.id, payload.panNumber.trim().toUpperCase(), payload.panDocUrl]
  );

  await db.query(
    `INSERT INTO seller_documents (seller_id, doc_type, doc_number, file_path)
     VALUES ($1, 'AADHAAR_FRONT', $2, $3)`,
    [seller.id, payload.aadhaarNumber?.trim() || null, payload.aadhaarDocUrl]
  );

  if (payload.businessDocUrl) {
    await db.query(
      `INSERT INTO seller_documents (seller_id, doc_type, file_path)
       VALUES ($1, 'BUSINESS_REG', $2)`,
      [seller.id, payload.businessDocUrl]
    );
  }

  // 5. Save Bank Account
  await db.query(
    `INSERT INTO seller_bank_accounts (seller_id, account_holder_name, bank_name, account_number, ifsc_code)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      seller.id,
      payload.accountHolderName.trim(),
      payload.bankName.trim(),
      payload.accountNumber.trim(),
      payload.ifscCode.trim().toUpperCase(),
    ]
  );

  // 6. Log Audit Event
  await db.query(
    `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id, details)
     VALUES ($1, 'seller', 'SUBMITTED_ONBOARDING_APPLICATION', 'seller', $1, $2)`,
    [seller.id, JSON.stringify({ storeName: seller.store_name, email: seller.email })]
  );

  // 7. Send Application Received Email
  await sendVendorApplicationReceivedEmail(seller.email, seller.owner_name, seller.store_name, seller.id);

  // 8. Establish session with 'seller' role
  const token = randomToken();
  const tokenHash = await digest(token);
  await db.query(
    "INSERT INTO auth_sessions (user_id, user_role, token_hash, expires_at) VALUES ($1, 'seller', $2, now() + interval '30 days')",
    [seller.id, tokenHash]
  );

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    applicationId: seller.id,
    storeName: seller.store_name,
    ownerName: seller.owner_name,
    status: "PENDING_REVIEW" as const,
  };
}

export async function sellerSignInServer(rawEmail: string, rawPassword: string) {
  const email = normalizeEmail(rawEmail);
  const db = getDatabase();

  const res = await db.query<{
    id: string;
    email: string;
    password_hash: string;
    store_name: string;
    owner_name: string;
    status: string;
    is_active: boolean;
  }>(
    "SELECT id, email, password_hash, store_name, owner_name, status, is_active FROM sellers WHERE email = $1 LIMIT 1",
    [email]
  );
  const seller = res.rows[0];
  if (!seller || !seller.is_active) {
    throw new Error("Invalid vendor email or password.");
  }

  const valid = await bcrypt.compare(rawPassword, seller.password_hash);
  if (!valid) {
    throw new Error("Invalid vendor email or password.");
  }

  const token = randomToken();
  const tokenHash = await digest(token);
  await db.query(
    "INSERT INTO auth_sessions (user_id, user_role, token_hash, expires_at) VALUES ($1, 'seller', $2, now() + interval '30 days')",
    [seller.id, tokenHash]
  );

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    id: seller.id,
    email: seller.email,
    storeName: seller.store_name,
    ownerName: seller.owner_name,
    status: seller.status,
    role: "seller" as const,
  };
}

export async function getAllSellersServer() {
  const db = getDatabase();

  const sellersRes = await db.query<{
    id: string;
    email: string;
    phone: string;
    store_name: string;
    owner_name: string;
    business_type: string;
    business_address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gstin: string;
    status: string;
    approved_by: string | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    created_at: Date;
  }>(
    `SELECT id, email, phone, store_name, owner_name, business_type, business_address, 
            city, state, pincode, country, gstin, status, approved_by, approved_at, 
            rejection_reason, created_at 
     FROM sellers 
     ORDER BY created_at DESC`
  );

  const sellers = sellersRes.rows;
  if (sellers.length === 0) return [];

  const docsRes = await db.query<{
    id: string;
    seller_id: string;
    doc_type: string;
    doc_number: string;
    file_path: string;
    is_verified: boolean;
  }>("SELECT id, seller_id, doc_type, doc_number, file_path, is_verified FROM seller_documents");

  const bankRes = await db.query<{
    id: string;
    seller_id: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    is_verified: boolean;
  }>("SELECT id, seller_id, account_holder_name, bank_name, account_number, ifsc_code, is_verified FROM seller_bank_accounts");

  const docsMap = new Map<string, any[]>();
  for (const doc of docsRes.rows) {
    if (!docsMap.has(doc.seller_id)) docsMap.set(doc.seller_id, []);
    docsMap.get(doc.seller_id)!.push(doc);
  }

  const bankMap = new Map<string, any>();
  for (const b of bankRes.rows) {
    bankMap.set(b.seller_id, b);
  }

  return sellers.map((s) => ({
    ...s,
    documents: docsMap.get(s.id) || [],
    bankAccount: bankMap.get(s.id) || null,
  }));
}

// ----------------------------------------------------------------------------
// Administrator Authentication & Roles (PRODUCT_ADMIN & SUPPORT_ADMIN)
// ----------------------------------------------------------------------------

export async function adminSignInServer(rawEmail: string, rawPassword: string) {
  const email = normalizeEmail(rawEmail);
  const db = getDatabase();

  const res = await db.query<{ id: string; email: string; password_hash: string; full_name: string; role: RoleType; is_active: boolean }>(
    "SELECT id, email, password_hash, full_name, role, is_active FROM admins WHERE email = $1 LIMIT 1",
    [email]
  );
  const admin = res.rows[0];
  if (!admin || !admin.is_active) {
    throw new Error("Invalid administrator credentials.");
  }

  // Support both bcrypt and pgcrypto crypt
  let valid = false;
  if (admin.password_hash.startsWith("$2a$") || admin.password_hash.startsWith("$2b$")) {
    valid = await bcrypt.compare(rawPassword, admin.password_hash);
  } else {
    const pgCheck = await db.query<{ valid: boolean }>(
      "SELECT (password_hash = crypt($1, password_hash)) AS valid FROM admins WHERE id = $2",
      [rawPassword, admin.id]
    );
    valid = Boolean(pgCheck.rows[0]?.valid);
  }

  if (!valid) {
    throw new Error("Invalid administrator credentials.");
  }

  const token = randomToken();
  const tokenHash = await digest(token);
  await db.query(
    "INSERT INTO auth_sessions (user_id, user_role, token_hash, expires_at) VALUES ($1, $2, $3, now() + interval '7 days')",
    [admin.id, admin.role, tokenHash]
  );

  await db.query(
    `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id)
     VALUES ($1, $2, 'ADMIN_LOGIN', 'admin', $1)`,
    [admin.id, admin.role]
  );

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.full_name,
    role: admin.role,
  };
}

// ----------------------------------------------------------------------------
// Current User & Session Resolution
// ----------------------------------------------------------------------------

export async function getCurrentUserServer(): Promise<{
  id: string;
  email: string;
  fullName: string;
  role: RoleType;
  sellerStatus?: string;
} | null> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;

  const db = getDatabase();
  const tokenHash = await digest(token);

  const sessRes = await db.query<{ user_id: string; user_role: RoleType }>(
    `SELECT user_id, user_role 
     FROM auth_sessions 
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() 
     LIMIT 1`,
    [tokenHash]
  );

  const session = sessRes.rows[0];
  if (!session) return null;

  // Resolve by role
  if (session.user_role === "customer") {
    const u = await db.query<{ id: string; email: string; full_name: string }>(
      "SELECT id, email, full_name FROM customers WHERE id = $1 AND is_active = true",
      [session.user_id]
    );
    if (!u.rows[0]) return null;
    return {
      id: u.rows[0].id,
      email: u.rows[0].email,
      fullName: u.rows[0].full_name,
      role: "customer",
    };
  }

  if (session.user_role === "seller") {
    const s = await db.query<{ id: string; email: string; owner_name: string; status: string }>(
      "SELECT id, email, owner_name, status FROM sellers WHERE id = $1 AND is_active = true",
      [session.user_id]
    );
    if (!s.rows[0]) return null;
    return {
      id: s.rows[0].id,
      email: s.rows[0].email,
      fullName: s.rows[0].owner_name,
      role: "seller",
      sellerStatus: s.rows[0].status,
    };
  }

  // Admin roles
  const a = await db.query<{ id: string; email: string; full_name: string; role: RoleType }>(
    "SELECT id, email, full_name, role FROM admins WHERE id = $1 AND is_active = true",
    [session.user_id]
  );
  if (!a.rows[0]) return null;
  return {
    id: a.rows[0].id,
    email: a.rows[0].email,
    fullName: a.rows[0].full_name,
    role: a.rows[0].role,
  };
}

export async function getCurrentRoleServer(): Promise<RoleType | null> {
  return (await getCurrentUserServer())?.role ?? null;
}

export async function signOutServer() {
  const token = getCookie(SESSION_COOKIE);
  if (token) {
    const db = getDatabase();
    await db.query(
      "UPDATE auth_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL",
      [await digest(token)]
    );
  }
  deleteCookie(SESSION_COOKIE, { path: "/" });
  return { success: true };
}

// ----------------------------------------------------------------------------
// Admin Review Operations (Vendor Approvals & Product Approvals)
// ----------------------------------------------------------------------------

export async function adminReviewVendorServer(adminId: string, sellerId: string, action: "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED", reason?: string) {
  const db = getDatabase();

  const sellerRes = await db.query<{ email: string; owner_name: string; store_name: string }>(
    "SELECT email, owner_name, store_name FROM sellers WHERE id = $1",
    [sellerId]
  );
  const seller = sellerRes.rows[0];
  if (!seller) throw new Error("Vendor application not found.");

  await db.query(
    `UPDATE sellers 
     SET status = $1, approved_by = $2, approved_at = CASE WHEN $1 = 'APPROVED' THEN now() ELSE NULL END, rejection_reason = $3, updated_at = now()
     WHERE id = $4`,
    [action, adminId, reason || null, sellerId]
  );

  await db.query(
    `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id, details)
     VALUES ($1, 'admin', $2, 'seller', $3, $4)`,
    [adminId, `VENDOR_${action}`, sellerId, JSON.stringify({ reason })]
  );

  // Send relevant email notification
  if (action === "APPROVED") {
    const loginUrl = "http://localhost:8081/dashboard/vendor";
    await sendVendorApprovedEmail(seller.email, seller.owner_name, seller.store_name, loginUrl);
  } else if (action === "REJECTED") {
    await sendVendorRejectedEmail(seller.email, seller.owner_name, seller.store_name, reason || "Application does not meet current marketplace criteria.");
  } else if (action === "MORE_INFORMATION_REQUIRED") {
    await sendVendorMoreInfoEmail(seller.email, seller.owner_name, seller.store_name, reason || "Please update your business documentation.");
  }

  return { success: true, status: action };
}

export async function adminReviewProductServer(adminId: string, productId: string, action: "APPROVED" | "REJECTED", reason?: string) {
  const db = getDatabase();

  const prodRes = await db.query<{ name: string; seller_id: string }>(
    "SELECT name, seller_id FROM products WHERE id = $1",
    [productId]
  );
  const product = prodRes.rows[0];
  if (!product) throw new Error("Product not found.");

  const newStatus = action === "APPROVED" ? "approved" : "rejected";
  await db.query(
    `UPDATE products 
     SET verification_status = $1, verified_by = $2, verified_at = now(), rejection_reason = $3, updated_at = now()
     WHERE id = $4`,
    [newStatus, adminId, reason || null, productId]
  );

  await db.query(
    `INSERT INTO product_approval_history (product_id, admin_id, action, reason)
     VALUES ($1, $2, $3, $4)`,
    [productId, adminId, action, reason || null]
  );

  // Notify seller
  const sellerRes = await db.query<{ email: string }>("SELECT email FROM sellers WHERE id = $1", [product.seller_id]);
  if (sellerRes.rows[0]?.email) {
    await sendProductApprovalEmail(sellerRes.rows[0].email, product.name, action === "APPROVED", reason);
  }

  return { success: true, status: newStatus };
}
