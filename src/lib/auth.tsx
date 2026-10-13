import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createServerFn } from "@tanstack/react-start";
import {
  getCurrentUserServer,
  getCurrentRoleServer,
  requestEmailOtpServer,
  verifyEmailOtpServer,
  registerCustomerServer,
  customerSignInServer,
  sellerSignInServer,
  registerVendorServer,
  adminSignInServer,
  adminReviewVendorServer,
  adminReviewProductServer,
  getAllSellersServer,
  signOutServer,
  type VendorRegistrationPayload,
} from "./auth.server";

// ----------------------------------------------------------------------------
// TanStack Start Server Functions
// ----------------------------------------------------------------------------

export const requestEmailOtpFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; purpose?: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" }) => data)
  .handler(({ data }) => requestEmailOtpServer(data.email, data.purpose));

export const verifyEmailOtpFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; code: string; purpose?: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" }) => data)
  .handler(({ data }) => verifyEmailOtpServer(data.email, data.code, data.purpose));

export const registerCustomerFn = createServerFn({ method: "POST" })
  .validator((data: { fullName: string; email: string; password: string; phone?: string; otpCode: string }) => data)
  .handler(({ data }) => registerCustomerServer(data));

export const customerSignInFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(({ data }) => customerSignInServer(data.email, data.password));

export const sellerSignInFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(({ data }) => sellerSignInServer(data.email, data.password));

export const registerVendorFn = createServerFn({ method: "POST" })
  .validator((data: VendorRegistrationPayload) => data)
  .handler(({ data }) => registerVendorServer(data));

export const getAllSellersFn = createServerFn({ method: "GET" })
  .handler(() => getAllSellersServer());

export const adminSignInFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(({ data }) => adminSignInServer(data.email, data.password));

export const adminReviewVendorFn = createServerFn({ method: "POST" })
  .validator((data: { adminId?: string; sellerId: string; action: "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED"; reason?: string }) => data)
  .handler(async ({ data }) => {
    const admin = await getCurrentUserServer();
    const adminId = admin?.id || data.adminId || "adm_product_01";
    return adminReviewVendorServer(adminId, data.sellerId, data.action, data.reason);
  });

export const adminReviewProductFn = createServerFn({ method: "POST" })
  .validator((data: { adminId?: string; productId: string; action: "APPROVED" | "REJECTED"; reason?: string }) => data)
  .handler(async ({ data }) => {
    const admin = await getCurrentUserServer();
    const adminId = admin?.id || data.adminId || "adm_product_01";
    return adminReviewProductServer(adminId, data.productId, data.action, data.reason);
  });

const readRole = createServerFn({ method: "GET" }).handler(() => getCurrentRoleServer());
const readCurrentUser = createServerFn({ method: "GET" }).handler(() => getCurrentUserServer());
const endSession = createServerFn({ method: "POST" }).handler(() => signOutServer());

// Client wrappers
export function sendEmailOtp(email: string, purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP") {
  return requestEmailOtpFn({ data: { email, purpose } });
}

export function verifyEmailOtp(email: string, code: string, purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP") {
  return verifyEmailOtpFn({ data: { email, code, purpose } });
}

export function registerCustomer(payload: { fullName: string; email: string; password: string; phone?: string; otpCode: string }) {
  return registerCustomerFn({ data: payload });
}

export function customerSignIn(email: string, password: string) {
  return customerSignInFn({ data: { email, password } });
}

export function sellerSignIn(email: string, password: string) {
  return sellerSignInFn({ data: { email, password } });
}

export function getAllSellers() {
  return getAllSellersFn();
}

export function registerVendor(payload: VendorRegistrationPayload) {
  return registerVendorFn({ data: payload });
}

export function adminSignIn(email: string, password: string) {
  return adminSignInFn({ data: { email, password } });
}

export function adminReviewVendor(payload: { sellerId: string; action: "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED"; reason?: string }) {
  return adminReviewVendorFn({ data: payload });
}

export function adminReviewProduct(payload: { productId: string; action: "APPROVED" | "REJECTED"; reason?: string }) {
  return adminReviewProductFn({ data: payload });
}

// Backward compatibility
export function sendSignInCode(identity: string) {
  return requestEmailOtpFn({ data: { email: identity, purpose: "CUSTOMER_SIGNUP" } });
}

export function verifySignInCode(identity: string, code: string) {
  return verifyEmailOtpFn({ data: { email: identity, code, purpose: "CUSTOMER_SIGNUP" } });
}

export function getCurrentRole() {
  return readRole();
}

export function getCurrentUser() {
  return readCurrentUser();
}

export async function signOut() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {}
  return endSession();
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer";
  avatarUrl?: string;
};

type StoredUser = User & {
  passwordHash: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (emailOrPhone: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_USER_KEY = "riderzpro_auth_user";
const AUTH_TOKEN_KEY = "riderzpro_auth_token";
const USERS_STORE_KEY = "riderzpro_registered_users";

async function hashPassword(plain: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    let hash = 0;
    for (let i = 0; i < plain.length; i++) {
      hash = (hash << 5) - hash + plain.charCodeAt(i);
      hash |= 0;
    }
    return `h_${Math.abs(hash)}`;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check local session
  useEffect(() => {
    async function initAuth() {
      try {
        // Pre-seed default customer if no users list exists yet
        const existingUsers = localStorage.getItem(USERS_STORE_KEY);
        if (!existingUsers) {
          const defaultHash = await hashPassword("Password123");
          const defaultUser: StoredUser = {
            id: "usr_aakash_default",
            name: "Aakash Sharma",
            email: "aakash@riderzpro.com",
            phone: "9876543210",
            role: "customer",
            passwordHash: defaultHash,
          };
          localStorage.setItem(USERS_STORE_KEY, JSON.stringify([defaultUser]));
        }

        const rawUser = localStorage.getItem(AUTH_USER_KEY);
        const rawToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (rawUser && rawToken) {
          const parsed = JSON.parse(rawUser) as User;
          setUser(parsed);
        }
      } catch (e) {
        console.error("Failed to restore auth session:", e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = useCallback(async (emailOrPhone: string, password: string, remember = true) => {
    try {
      const trimmed = emailOrPhone.trim();
      const isEmail = trimmed.includes("@");
      const hashed = await hashPassword(password);

      const rawUsers = localStorage.getItem(USERS_STORE_KEY);
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      // Match either email or 10-digit phone
      const found = users.find((u) => {
        if (isEmail) {
          return u.email.toLowerCase() === trimmed.toLowerCase();
        } else {
          const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);
          return u.phone.replace(/\D/g, "").slice(-10) === cleanPhone;
        }
      });

      if (!found || found.passwordHash !== hashed) {
        return { success: false, error: "Invalid email/phone or password" };
      }

      const sessionUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: "customer",
        avatarUrl: found.avatarUrl,
      };

      const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      if (remember) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      }

      setUser(sessionUser);
      return { success: true };
    } catch (e) {
      console.error("Sign in error:", e);
      return { success: false, error: "An unexpected error occurred during sign in" };
    }
  }, []);

  const signUp = useCallback(async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanPhone = data.phone.replace(/\D/g, "").slice(-10);
      const rawUsers = localStorage.getItem(USERS_STORE_KEY);
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      // Check if user already exists
      const existing = users.find(
        (u) => u.email.toLowerCase() === cleanEmail || u.phone.replace(/\D/g, "").slice(-10) === cleanPhone
      );

      if (existing) {
        if (existing.email.toLowerCase() === cleanEmail) {
          return { success: false, error: "An account with this email already exists" };
        }
        return { success: false, error: "An account with this phone number already exists" };
      }

      const passwordHash = await hashPassword(data.password);
      const newUser: StoredUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: data.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: "customer",
        passwordHash,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(updatedUsers));

      const sessionUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: "customer",
      };

      const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      setUser(sessionUser);
      return { success: true };
    } catch (e) {
      console.error("Sign up error:", e);
      return { success: false, error: "Failed to create account" };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const googleUser: User = {
        id: "usr_google_aakash",
        name: "Aakash Sharma",
        email: "aakash.sharma@gmail.com",
        phone: "9876543210",
        role: "customer",
      };

      const token = `tok_g_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      setUser(googleUser);
      return { success: true };
    } catch (e) {
      return { success: false, error: "Google sign in failed" };
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      await endSession();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut: handleSignOut,
    }),
    [user, loading, signIn, signUp, signInWithGoogle, handleSignOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
