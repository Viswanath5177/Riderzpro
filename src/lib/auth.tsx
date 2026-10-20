import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";

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
    if (res.ok && data.success) {
      return {
        isRegistered: !!data.isRegistered,
        hasPassword: !!data.hasPassword,
        isAdmin: !!data.isAdmin || data.role?.includes("ADMIN") || data.role === "admin",
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
  return null;
}

export const AUTH_USER_KEY = "riderzpro_auth_user";
export const AUTH_TOKEN_KEY = "riderzpro_auth_token";
export const USERS_STORE_KEY = "riderzpro_registered_users";
export const AUTH_CHANNEL_NAME = "riderzpro_auth_sync";

export function broadcastAuthEvent(event: { type: "LOGOUT" | "SESSION_EXPIRED" | "LOGIN"; role?: string; user?: any; timestamp?: number }) {
  if (typeof window === "undefined") return;
  const payload = { ...event, timestamp: event.timestamp || Date.now() };
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch {}
  try {
    localStorage.setItem("riderzpro_auth_event", JSON.stringify(payload));
  } catch {}
}

export async function signOut(reason: "explicit" | "inactivity" = "explicit"): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem("riderzpro_token");
      localStorage.removeItem("riderzpro_admin_session");
      localStorage.removeItem("riderzpro_seller_store_confirmed");
      localStorage.removeItem("riderzpro-v7");
      localStorage.removeItem("riderzpro_active_bike");
      try {
        sessionStorage.clear();
      } catch {}

      try {
        await fetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      } catch (e) {
        console.warn("Server signout request failed:", e);
      }

      broadcastAuthEvent({ type: reason === "inactivity" ? "SESSION_EXPIRED" : "LOGOUT" });
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("riderzpro:signout", { detail: { reason } }));
    }
  } catch (err) {
    console.error("Sign out error:", err);
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "seller" | "admin" | "SUPER_ADMIN" | "ADMIN" | string;
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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("riderzpro_auth_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.id) return parsed;
        }
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("riderzpro_auth_user");
        if (raw) return false;
      } catch {}
    }
    return true;
  });

  const [isCustomerLoginModalOpen, setIsCustomerLoginModalOpen] = useState(false);
  const [customerLoginModalOptions, setCustomerLoginModalOptions] = useState<CustomerLoginModalOptions | null>(null);

  const lastActivityRef = useRef<number>(Date.now());
  const lastTouchApiRef = useRef<number>(Date.now());

  const openCustomerLoginModal = useCallback((options?: CustomerLoginModalOptions) => {
    setCustomerLoginModalOptions(options || null);
    setIsCustomerLoginModalOpen(true);
  }, []);

  const closeCustomerLoginModal = useCallback(() => {
    setIsCustomerLoginModalOpen(false);
    setCustomerLoginModalOptions(null);
  }, []);

  // Track user interaction for 10-minute sliding inactivity timeout
  const handleUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    const now = Date.now();
    // Debounce touch to server: send heartbeat at most once every 60s when active
    if (user && now - lastTouchApiRef.current > 60000) {
      lastTouchApiRef.current = now;
      fetch("/api/auth/activity", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const onActivity = () => handleUserActivity();
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
    };
  }, [handleUserActivity]);

  // Client-side 10-minute inactivity timer
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    const checkInterval = setInterval(async () => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= 10 * 60 * 1000) {
        setUser(null);
        await signOut("inactivity");
        const pathname = window.location.pathname;
        const isProtected =
          pathname.startsWith("/vendor/") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/dashboard") ||
          pathname === "/garage" ||
          pathname === "/orders";
        if (isProtected) {
          const isVendorOrAdmin = user.role !== "customer";
          const dest = isVendorOrAdmin ? "/vendor/login?sessionExpired=true" : "/login?sessionExpired=true";
          window.location.replace(dest);
        }
      }
    }, 5000);
    return () => clearInterval(checkInterval);
  }, [user]);

  // Multi-tab synchronization and Back-Forward Cache (bfcache) pageshow handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSyncMessage = (data: any) => {
      if (data?.type === "LOGOUT" || data?.type === "SESSION_EXPIRED") {
        setUser(null);
        const pathname = window.location.pathname;
        const isProtected =
          pathname.startsWith("/vendor/") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/dashboard") ||
          pathname === "/garage" ||
          pathname === "/orders";
        if (isProtected) {
          const isVendor = pathname.startsWith("/vendor") || pathname.startsWith("/admin");
          const dest = isVendor
            ? (data.type === "SESSION_EXPIRED" ? "/vendor/login?sessionExpired=true" : "/vendor/login")
            : (data.type === "SESSION_EXPIRED" ? "/login?sessionExpired=true" : "/");
          window.location.replace(dest);
        }
      } else if (data?.type === "LOGIN" && data.user) {
        setUser(data.user);
        lastActivityRef.current = Date.now();
      }
    };

    let bc: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel(AUTH_CHANNEL_NAME);
      bc.onmessage = (e) => handleSyncMessage(e.data);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "riderzpro_auth_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleSyncMessage(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    // Revalidate on browser Back-Forward Cache restoration
    const onPageShow = async (e: PageTransitionEvent) => {
      if (e.persisted) {
        try {
          const res = await fetch("/api/auth/me", {
            credentials: "include",
            headers: { "X-Passive-Poll": "true" },
          });
          if (!res.ok) {
            setUser(null);
            const p = window.location.pathname;
            if (p.startsWith("/vendor/") || p.startsWith("/admin") || p.startsWith("/dashboard") || p === "/orders" || p === "/garage") {
              window.location.replace(p.startsWith("/vendor") || p.startsWith("/admin") ? "/vendor/login" : "/login");
            }
            return;
          }
          const d = await res.json();
          if (!d.authenticated) {
            setUser(null);
            const p = window.location.pathname;
            if (p.startsWith("/vendor/") || p.startsWith("/admin") || p.startsWith("/dashboard") || p === "/orders" || p === "/garage") {
              window.location.replace(p.startsWith("/vendor") || p.startsWith("/admin") ? "/vendor/login" : "/login");
            }
          }
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      bc?.close();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  // Initialize and check PostgreSQL session
  useEffect(() => {
    async function initAuth() {
      try {
        const meRes = await fetch("/api/auth/me", {
          credentials: "include",
          headers: { "X-Passive-Poll": "true" },
        });
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
            lastActivityRef.current = Date.now();
            return;
          }
        }
        setUser(null);
      } catch (e) {
        console.error("Failed to restore auth session:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const onSignOutEvent = () => {
      setUser(null);
    };
    window.addEventListener("riderzpro:signout", onSignOutEvent);
    return () => window.removeEventListener("riderzpro:signout", onSignOutEvent);
  }, []);

  const signIn = useCallback(async (emailOrPhone: string, password: string, _remember = true) => {
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

      setUser(sessionUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      lastActivityRef.current = Date.now();
      broadcastAuthEvent({ type: "LOGIN", role: sessionUser.role, user: sessionUser });
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

      setUser(sessionUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      lastActivityRef.current = Date.now();
      broadcastAuthEvent({ type: "LOGIN", role: "customer", user: sessionUser });
      return { success: true };
    } catch (e: any) {
      console.error("Sign up error:", e);
      return { success: false, error: e.message || "Failed to create account" };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const meData = await res.json();
        if (meData.authenticated && meData.user) {
          const sessionUser: User = {
            id: meData.user.id,
            name: meData.user.fullName || "User",
            email: meData.user.email,
            phone: meData.user.phone || "",
            role: "customer",
          };
          setUser(sessionUser);
          return { success: true };
        }
      }
      return { success: false, error: "Google sign in failed" };
    } catch (e) {
      return { success: false, error: "Google sign in failed" };
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setUser(null);
      await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
      setUser(null);
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
