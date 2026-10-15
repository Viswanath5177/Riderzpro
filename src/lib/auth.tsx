import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

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

// Client wrappers using direct PostgreSQL backend API
export async function checkPhoneExists(phone: string): Promise<{ exists: boolean; error?: string; role?: string; storeName?: string }> {
  if (typeof window === "undefined") {
    return { exists: false };
  }
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length < 10) {
    return { exists: false };
  }
  try {
    const res = await fetch("/api/auth/check-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanPhone }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { exists: !!data.exists, error: data.error, role: data.role, storeName: data.storeName };
    }
  } catch (e) {
    console.warn("[checkPhoneExists failed]", e);
  }
  return { exists: false };
}

export async function checkEmailExists(
  email: string,
  portal: "customer" | "vendor" = "customer"
): Promise<{
  isRegistered: boolean;
  hasPassword?: boolean;
  isAdmin?: boolean;
  error?: string;
  role?: string;
  fullName?: string;
  redirectUrl?: string;
}> {
  if (typeof window === "undefined") {
    return { isRegistered: false };
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { isRegistered: false };
  }
  try {
    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, portal }),
    });
    const data = await res.json();
    if (data.isAdmin || data.role?.includes("ADMIN") || data.role === "admin") {
      return {
        isRegistered: false,
        isAdmin: true,
        role: data.role,
        fullName: data.fullName,
        error: "Invalid email.",
        redirectUrl: "/vendor/login",
      };
    }
    if (res.ok && data.success) {
      return {
        isRegistered: !!data.isRegistered,
        hasPassword: !!data.hasPassword,
        role: data.role,
        fullName: data.fullName,
        error: data.error,
      };
    }
  } catch (e) {
    console.warn("[checkEmailExists failed]", e);
  }
  return { isRegistered: false };
}

export async function sendEmailOtp(email: string, purpose: "CUSTOMER_SIGNUP" | "CUSTOMER_SIGNIN" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP") {
  if (typeof window === "undefined") {
    return { success: true };
  }
  const res = await fetch("/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to send verification code.");
  return data;
}

export async function verifyEmailOtp(email: string, code: string, purpose: "CUSTOMER_SIGNUP" | "VENDOR_SIGNUP" | "RESET_PASSWORD" = "CUSTOMER_SIGNUP") {
  if (typeof window === "undefined") {
    return { success: true };
  }
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, purpose }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Invalid verification code.");
  return data;
}

export async function registerCustomer(payload: { fullName: string; email: string; password: string; phone?: string; otpCode: string }) {
  if (typeof window === "undefined") {
    return { success: false, error: "Registration requires client browser environment" };
  }
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to register customer.");
  return data;
}

export async function unifiedSignIn(emailOrContact: string, password: string) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: emailOrContact.trim(), password: password.trim() }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function customerSignIn(email: string, password: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim(), password: password.trim(), portal: "customer" }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Invalid email or password.");
  return data.user;
}

export async function sellerSignIn(email: string, password: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim(), password: password.trim(), portal: "vendor" }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Invalid vendor credentials.");
  return data.user;
}

export function getAllSellers() {
  if (typeof window === "undefined") {
    return Promise.resolve([]);
  }
  return fetch("/api/admin/sellers").then((r) => r.json()).then((d) => d.data || []);
}

export async function registerVendor(payload: VendorRegistrationPayload) {
  if (typeof window === "undefined") {
    return { success: false, error: "Registration requires client browser environment" };
  }
  const res = await fetch("/api/auth/vendor-signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to register vendor.");
  return data;
}

export async function adminSignIn(email: string, password: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim(), password: password.trim() }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Invalid administrator credentials.");
  return data.user;
}

export async function adminReviewVendor(payload: { sellerId: string; action: "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED"; reason?: string }) {
  if (typeof window === "undefined") {
    return { success: false };
  }
  const res = await fetch(`/api/admin/sellers/${payload.sellerId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: payload.action, reason: payload.reason }),
  });
  return res.json();
}

export async function adminReviewProduct(payload: { productId: string; action: "APPROVED" | "REJECTED"; reason?: string }) {
  if (typeof window === "undefined") {
    return { success: false };
  }
  const res = await fetch(`/api/admin/products/${payload.productId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: payload.action, reason: payload.reason }),
  });
  return res.json();
}

// Backward compatibility
export function sendSignInCode(identity: string) {
  return sendEmailOtp(identity, "CUSTOMER_SIGNUP");
}

export function verifySignInCode(identity: string, code: string) {
  return verifyEmailOtp(identity, code, "CUSTOMER_SIGNUP");
}

export async function getCurrentRole(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.role) {
        return data.role;
      }
    }
  } catch {}
  try {
    const adm = localStorage.getItem("riderzpro_admin_session");
    if (adm) {
      const parsed = JSON.parse(adm);
      if (parsed?.role) return parsed.role;
    }
    const usr = localStorage.getItem("riderzpro_auth_user");
    if (usr) {
      const parsed = JSON.parse(usr);
      if (parsed?.role) return parsed.role;
    }
  } catch {}
  return null;
}

export async function getCurrentUser(): Promise<any> {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        return data.user;
      }
    }
  } catch {}
  try {
    const usr = localStorage.getItem("riderzpro_auth_user");
    if (usr) return JSON.parse(usr);
  } catch {}
  return null;
}

export async function signOut() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem("riderzpro_admin_session");
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" }).catch(() => {});
    }
  } catch {}
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller" | "admin" | "SUPER_ADMIN" | "PRODUCT_ADMIN" | "SELLER_ADMIN" | string;
  storeName?: string;
  avatarUrl?: string;
};

type StoredUser = User & {
  passwordHash: string;
};

export type CustomerLoginModalOptions = {
  redirectTo?: string;
  onAuthenticated?: () => void;
  initialIdentifier?: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (emailOrPhone: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isCustomerLoginModalOpen: boolean;
  customerLoginModalOptions: CustomerLoginModalOptions | null;
  openCustomerLoginModal: (options?: CustomerLoginModalOptions) => void;
  closeCustomerLoginModal: () => void;
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

  // Customer Login Modal state & controls
  const [isCustomerLoginModalOpen, setIsCustomerLoginModalOpen] = useState(false);
  const [customerLoginModalOptions, setCustomerLoginModalOptions] = useState<CustomerLoginModalOptions | null>(null);

  const openCustomerLoginModal = useCallback((options?: CustomerLoginModalOptions) => {
    setCustomerLoginModalOptions(options || null);
    setIsCustomerLoginModalOpen(true);
  }, []);

  const closeCustomerLoginModal = useCallback(() => {
    setIsCustomerLoginModalOpen(false);
    setCustomerLoginModalOptions(null);
  }, []);

  // Initialize and check PostgreSQL session
  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Verify active HTTP-only cookie session with PostgreSQL backend
        try {
          const meRes = await fetch("/api/auth/me", { credentials: "include" });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.authenticated && meData.user) {
              const u: User = {
                id: meData.user.id,
                name: meData.user.fullName || meData.user.storeName || "Rider",
                email: meData.user.email,
                phone: meData.user.phone || "",
                role: (meData.role || meData.user.role || "customer") as any,
                storeName: meData.user.storeName,
              };
              setUser(u);
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
              localStorage.setItem(AUTH_TOKEN_KEY, "session_active");
              return;
            }
          }
        } catch {}

        // 2. Fallback to localStorage session
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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailOrPhone.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Invalid email or password." };
      }

      const dbUser = data.user;
      const sessionUser: User = {
        id: dbUser.id,
        name: dbUser.fullName || dbUser.storeName || "Rider",
        email: dbUser.email,
        phone: dbUser.phone || "",
        role: (data.role || dbUser.role || "customer") as any,
        storeName: dbUser.storeName,
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
      return { success: true, redirectUrl: data.redirectUrl, role: data.role, user: dbUser };
    } catch (e: any) {
      console.error("Sign in error:", e);
      return { success: false, error: e.message || "An unexpected error occurred during sign in" };
    }
  }, []);

  const signUp = useCallback(async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          password: data.password,
        }),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || "Failed to create account" };
      }

      const dbUser = resData.user;
      const sessionUser: User = {
        id: dbUser.id,
        name: dbUser.fullName,
        email: dbUser.email,
        phone: dbUser.phone || "",
        role: "customer",
      };

      const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      setUser(sessionUser);
      return { success: true };
    } catch (e: any) {
      console.error("Sign up error:", e);
      return { success: false, error: e.message || "Failed to create account" };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const googleUser: User = {
        id: "usr_google_aakash",
        name: "User",
        email: "aakash.sharma@gmail.com",
        phone: "",
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
      await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut: handleSignOut,
      isCustomerLoginModalOpen,
      customerLoginModalOptions,
      openCustomerLoginModal,
      closeCustomerLoginModal,
    }),
    [user, loading, signIn, signUp, signInWithGoogle, handleSignOut, isCustomerLoginModalOpen, customerLoginModalOptions, openCustomerLoginModal, closeCustomerLoginModal]
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
