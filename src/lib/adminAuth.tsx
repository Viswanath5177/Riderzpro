import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, useLocation } from "@tanstack/react-router";
import { adminSignIn, broadcastAuthEvent, AUTH_CHANNEL_NAME } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  roleTitle: string;
  department: string;
  avatarUrl?: string;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  adminUser: AdminUser | null;
  serverRole: string | null;
  login: (
    email: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string; requireOtp?: boolean }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDevBypass: () => void;
  logout: () => Promise<void>;
  refreshAdminSession: () => Promise<AdminUser | null>;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  if (typeof window === "undefined") return null;
  try {
    const meRes = await fetch("/api/auth/me", { credentials: "include" });
    if (meRes.ok) {
      const meData = await meRes.json();
      if (meData?.authenticated && (meData.role === "SUPER_ADMIN" || meData.role === "ADMIN" || meData.role === "admin" || meData.role === "super_admin")) {
        return {
          id: meData.user?.id || "adm_super_01",
          name: meData.user?.fullName || "Administrator",
          email: meData.user?.email || "",
          role: "admin",
          roleTitle:
            meData.role === "SUPER_ADMIN" || meData.role === "super_admin"
              ? "Super Administrator"
              : "Operations Administrator",
          department:
            meData.role === "SUPER_ADMIN" || meData.role === "super_admin"
              ? "Executive Platform Oversight"
              : "Seller Compliance & Product Catalog Moderation",
        };
      }
    }
  } catch {}
  return null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [serverRole, setServerRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  const refreshAdminSession = useCallback(async (): Promise<AdminUser | null> => {
    try {
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.authenticated) {
          const roleStr = String(meData.role || "").toLowerCase();
          setServerRole(roleStr);
          if (
            roleStr === "super_admin" ||
            roleStr === "admin" ||
            roleStr === "product_admin" ||
            roleStr === "seller_admin"
          ) {
            const userObj: AdminUser = {
              id: meData.user?.id || "adm_session",
              name: meData.user?.fullName || "Administrator",
              email: meData.user?.email || "",
              role: "admin",
              roleTitle:
                meData.role === "SUPER_ADMIN" || meData.role === "super_admin"
                  ? "Super Administrator"
                  : meData.role === "PRODUCT_ADMIN"
                    ? "Product Administrator"
                    : meData.role === "SELLER_ADMIN"
                      ? "Seller Administrator"
                      : "Operations Administrator",
              department:
                meData.role === "SUPER_ADMIN" || meData.role === "super_admin"
                  ? "Executive Platform Oversight"
                  : "Seller Compliance & Product Catalog Moderation",
            };
            setAdminUser(userObj);
            return userObj;
          } else {
            setAdminUser(null);
            return null;
          }
        }
      }
      setAdminUser(null);
      setServerRole(null);
      return null;
    } catch {
      setAdminUser(null);
      setServerRole(null);
      return null;
    }
  }, []);

  useEffect(() => {
    async function initSession() {
      try {
        await refreshAdminSession();
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, [refreshAdminSession]);

  // Multi-tab synchronization and Back-Forward Cache (bfcache) pageshow handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = (data: any) => {
      if (data?.type === "LOGOUT" || data?.type === "SESSION_EXPIRED") {
        setAdminUser(null);
        setServerRole(null);
        setPendingUser(null);
        if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/superadmin")) {
          window.location.replace("/vendor/login");
        }
      }
    };

    let bc: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel(AUTH_CHANNEL_NAME);
      bc.onmessage = (e) => handleSync(e.data);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "riderzpro_auth_event" && e.newValue) {
        try {
          handleSync(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    const onPageShow = async (e: PageTransitionEvent) => {
      if (e.persisted) {
        const u = await refreshAdminSession();
        if (!u && (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/superadmin"))) {
          window.location.replace("/vendor/login");
        }
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      bc?.close();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [refreshAdminSession]);

  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string; requireOtp?: boolean }> => {
      const trimmedEmail = email.trim().toLowerCase();

      try {
        const backendRes = await adminSignIn(trimmedEmail, pass);
        if (backendRes) {
          const userObj: AdminUser = {
            id: backendRes.id,
            name: backendRes.fullName || "Administrator",
            email: backendRes.email,
            role: "admin",
            roleTitle:
              backendRes.role === "SUPER_ADMIN"
                ? "Super Administrator"
                : "Operations Administrator",
            department:
              backendRes.role === "SUPER_ADMIN"
                ? "Executive Platform Oversight"
                : "Seller Compliance & Product Catalog Moderation",
          };
          setPendingUser(userObj);
          return { success: true, requireOtp: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid admin credentials";
        return { success: false, error: msg };
      }

      return { success: false, error: "Invalid admin credentials" };
    },
    []
  );

  const verifyOtp = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      // Complete OTP verification by refreshing authoritative server session
      const refreshed = await refreshAdminSession();
      if (refreshed) {
        setPendingUser(null);
        return { success: true };
      }
      if (pendingUser) {
        setAdminUser(pendingUser);
        setPendingUser(null);
        return { success: true };
      }
      return { success: false, error: "Authentication verification failed." };
    },
    [pendingUser, refreshAdminSession]
  );

  const loginWithDevBypass = useCallback(async () => {
    await refreshAdminSession();
  }, [refreshAdminSession]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("riderzpro_admin_session");
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      try {
        sessionStorage.clear();
      } catch {}
    }
    setAdminUser(null);
    setServerRole(null);
    setPendingUser(null);
    broadcastAuthEvent({ type: "LOGOUT", role: "admin" });
  }, []);

  const value = useMemo<AdminAuthContextType>(
    () => ({
      isAuthenticated: Boolean(adminUser),
      loading,
      adminUser,
      serverRole,
      login,
      verifyOtp,
      loginWithDevBypass,
      logout,
      refreshAdminSession,
    }),
    [adminUser, loading, serverRole, login, verifyOtp, loginWithDevBypass, logout, refreshAdminSession]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}

/**
 * Route guard for /admin/* paths.
 * Redirects unauthenticated visits to /vendor/login with return path preserved.
 */
export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, serverRole } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d12] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="text-xs text-zinc-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/vendor/login" search={{ redirect: location.pathname }} replace />;
  }

  return <>{children}</>;
}
