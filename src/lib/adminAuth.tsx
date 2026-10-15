import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, useLocation } from "@tanstack/react-router";
import { adminSignIn } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  roleTitle: string;
  department: string;
  avatarUrl?: string;
}

export interface AdminSession {
  token: string;
  role: "admin";
  user: AdminUser;
  loginTime: number;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  adminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; requireOtp?: boolean }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDevBypass: () => void;
  logout: () => void;
}

const ADMIN_SESSION_KEY = "riderzpro_admin_session";

const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: "adm_vikram_01",
  name: "Vikram Malhotra",
  email: "admin@riderzpro.com",
  role: "admin",
  roleTitle: "Super Admin",
  department: "Operations & Platform Oversight",
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user && parsed.user.email) {
          setAdminUser(parsed.user);
        } else if (parsed.email && (parsed.role?.includes("ADMIN") || parsed.role === "admin")) {
          const userObj: AdminUser = {
            id: parsed.id || "adm_session",
            name: parsed.fullName || parsed.name || "Administrator",
            email: parsed.email,
            role: "admin",
            roleTitle:
              parsed.role === "SUPER_ADMIN"
                ? "Super Administrator"
                : "Operations Administrator",
            department:
              parsed.role === "SUPER_ADMIN"
                ? "Executive Platform Oversight"
                : "Seller Compliance & Product Catalog Moderation",
          };
          setAdminUser(userObj);
        }
      }
    } catch (e) {
      console.error("Failed to restore admin session:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback((user: AdminUser) => {
    const session: AdminSession = {
      token: `mock_jwt_adm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role: "admin",
      user,
      loginTime: Date.now(),
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    setAdminUser(user);
    setPendingUser(null);
  }, []);

  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string; requireOtp?: boolean }> => {
      const trimmedEmail = email.trim().toLowerCase();

      try {
        const backendRes = await adminSignIn(trimmedEmail, pass);
        if (backendRes) {
          const userObj: AdminUser = {
            id: backendRes.id,
            name: backendRes.fullName,
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
      } catch (err: any) {
        // Fallback for default local test account
        if (trimmedEmail === "admin@riderzpro.com" && pass === "Admin@123") {
          setPendingUser(DEFAULT_SUPER_ADMIN);
          return { success: true, requireOtp: true };
        }
        return { success: false, error: err?.message || "Invalid admin credentials" };
      }

      if (trimmedEmail === "admin@riderzpro.com" && pass === "Admin@123") {
        setPendingUser(DEFAULT_SUPER_ADMIN);
        return { success: true, requireOtp: true };
      }

      return { success: false, error: "Invalid admin credentials" };
    },
    []
  );

  const verifyOtp = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      await new Promise((res) => setTimeout(res, 350));
      if (code === "123456" || code === "111111") {
        saveSession(pendingUser || DEFAULT_SUPER_ADMIN);
        return { success: true };
      }
      return { success: false, error: "Invalid OTP code. Please enter 123456 for testing." };
    },
    [pendingUser, saveSession]
  );

  const loginWithDevBypass = useCallback(() => {
    saveSession(DEFAULT_SUPER_ADMIN);
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminUser(null);
    setPendingUser(null);
  }, []);

  const value = useMemo<AdminAuthContextType>(
    () => ({
      isAuthenticated: Boolean(adminUser),
      loading,
      adminUser,
      login,
      verifyOtp,
      loginWithDevBypass,
      logout,
    }),
    [adminUser, loading, login, verifyOtp, loginWithDevBypass, logout]
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
 * Redirects unauthenticated visits to /login with return path preserved.
 */
export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
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
    return <Navigate to="/admin/login" search={{ redirect: location.pathname }} replace />;
  }

  return <>{children}</>;
}
