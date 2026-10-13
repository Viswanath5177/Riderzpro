import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import type { Vendor, VendorBusinessType, VendorOnboarding } from "./vendor/types";
import { useVendorStore, VENDORS_STORAGE_KEY } from "./vendor/vendorStore";
import { otpAdapter, DEMO_OTP } from "./vendor/adapters/otp";

export interface VendorUserSession {
  vendorId: string;
  email: string;
  phone: string;
  storeName: string;
  status: Vendor["status"];
  token: string;
}

export interface VendorAuthContextType {
  vendor: Vendor | null;
  currentVendor: Vendor | null;
  session: VendorUserSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithPassword: (emailOrPhone: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  signInWithOtp: (emailOrPhone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signUpVendor: (data: {
    fullName: string;
    businessType: VendorBusinessType;
    mobile: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; vendorId?: string }>;
  resetPasswordWithOtp: (emailOrPhone: string, code: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  signOutVendor: () => Promise<void>;
  logout: () => Promise<void>;
  refreshVendorSession: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextType | null>(null);

const VENDOR_SESSION_KEY = "riderzpro_vendor_session";
const VENDOR_AUTH_CRED_KEY = "riderzpro_vendor_credentials"; // Store password hashes separately from vendor records

async function hashPassword(plain: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    let hash = 0;
    for (let i = 0; i < plain.length; i++) {
      hash = (hash << 5) - hash + plain.charCodeAt(i);
      hash |= 0;
    }
    return `vh_${Math.abs(hash)}`;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const { vendors, saveVendorDraft, getVendorByPhone, getVendorByEmail, getVendor } = useVendorStore();
  const [session, setSession] = useState<VendorUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize seed password credentials if not present
  useEffect(() => {
    async function initCredentials() {
      try {
        const stored = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
        if (!stored) {
          const defaultHash = await hashPassword("Vendor@123");
          const defaultCreds: Record<string, string> = {
            "9000000001": defaultHash,
            "volthub@riderzpro.com": defaultHash,
            "9000000002": defaultHash,
            "ecocharge@spares.in": defaultHash,
            "9000000003": defaultHash,
            "torque@evparts.com": defaultHash,
          };
          localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(defaultCreds));
        }

        const wasExplicitlySignedOut = localStorage.getItem("vendor_signed_out") === "true";
        const rawSession = localStorage.getItem(VENDOR_SESSION_KEY) || sessionStorage.getItem(VENDOR_SESSION_KEY);
        if (rawSession) {
          const parsed = JSON.parse(rawSession) as VendorUserSession;
          setSession(parsed);
        } else if (!wasExplicitlySignedOut) {
          // In demo environment, pre-seed default approved vendor (v1 VoltHub Indiranagar) on first visit
          const defaultVendor = vendors.find((v) => v.id === "v1");
          if (defaultVendor) {
            const defaultSession: VendorUserSession = {
              vendorId: defaultVendor.id,
              email: defaultVendor.email,
              phone: defaultVendor.phone,
              storeName: defaultVendor.storeName,
              status: defaultVendor.status,
              token: `vtok_demo_default`,
            };
            setSession(defaultSession);
            localStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(defaultSession));
          }
        }
      } catch (e) {
        console.error("Failed to restore vendor session:", e);
      } finally {
        setLoading(false);
      }
    }

    initCredentials();
  }, []);

  const currentVendor = useMemo(() => {
    if (!session?.vendorId) return null;
    return getVendor(session.vendorId) || null;
  }, [session, getVendor]);

  const setVendorSession = useCallback((vendor: Vendor, remember = true) => {
    localStorage.removeItem("vendor_signed_out");
    const s: VendorUserSession = {
      vendorId: vendor.id,
      email: vendor.email,
      phone: vendor.phone,
      storeName: vendor.storeName,
      status: vendor.status,
      token: `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    if (remember) {
      localStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(s));
    } else {
      sessionStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(s));
    }
    setSession(s);
  }, []);

  const signInWithPassword = useCallback(
    async (emailOrPhone: string, password: string, remember = true) => {
      try {
        const trimmed = emailOrPhone.trim();
        const isEmail = trimmed.includes("@");
        const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);

        const matchedVendor = isEmail ? getVendorByEmail(trimmed) : getVendorByPhone(cleanPhone);
        if (!matchedVendor) {
          return { success: false, error: "No vendor account found with this mobile or email" };
        }

        const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
        const creds: Record<string, string> = rawCreds ? JSON.parse(rawCreds) : {};
        const expectedHash = creds[cleanPhone] || creds[matchedVendor.email.toLowerCase()];
        const inputHash = await hashPassword(password);

        if (!expectedHash || expectedHash !== inputHash) {
          return { success: false, error: "Invalid password. (Demo: Vendor@123)" };
        }

        setVendorSession(matchedVendor, remember);
        toast.success(`Welcome back, ${matchedVendor.storeName || "Vendor"}!`);
        return { success: true };
      } catch (e) {
        return { success: false, error: "An unexpected error occurred during vendor sign in" };
      }
    },
    [getVendorByEmail, getVendorByPhone, setVendorSession]
  );

  const signInWithOtp = useCallback(
    async (emailOrPhone: string, code: string) => {
      try {
        const trimmed = emailOrPhone.trim();
        const isEmail = trimmed.includes("@");
        const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);

        const matchedVendor = isEmail ? getVendorByEmail(trimmed) : getVendorByPhone(cleanPhone);
        if (!matchedVendor) {
          return { success: false, error: "No vendor account found with this mobile or email" };
        }

        const channel = isEmail ? "email" : "sms";
        const verifyRes = await otpAdapter.verify(channel, trimmed, code);
        if (!verifyRes.success) {
          return { success: false, error: verifyRes.error || "Invalid OTP" };
        }

        setVendorSession(matchedVendor, true);
        toast.success(`Welcome back, ${matchedVendor.storeName || "Vendor"}!`);
        return { success: true };
      } catch (e) {
        return { success: false, error: "OTP verification failed" };
      }
    },
    [getVendorByEmail, getVendorByPhone, setVendorSession]
  );

  const signUpVendor = useCallback(
    async (data: {
      fullName: string;
      businessType: VendorBusinessType;
      mobile: string;
      email: string;
      password: string;
    }) => {
      try {
        const cleanEmail = data.email.trim().toLowerCase();
        const cleanPhone = data.mobile.replace(/\D/g, "").slice(-10);

        // Check duplicates
        if (getVendorByPhone(cleanPhone)) {
          return { success: false, error: "A vendor account with this mobile number already exists." };
        }
        if (getVendorByEmail(cleanEmail)) {
          return { success: false, error: "A vendor account with this email address already exists." };
        }

        // Store credentials
        const passwordHash = await hashPassword(data.password);
        const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
        const creds: Record<string, string> = rawCreds ? JSON.parse(rawCreds) : {};
        creds[cleanPhone] = passwordHash;
        creds[cleanEmail] = passwordHash;
        localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(creds));

        const vendorId = `v_${Date.now()}`;
        const defaultStoreName = `${data.fullName}'s EV Store`;
        const slug = defaultStoreName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const initialOnboarding: VendorOnboarding = {
          currentStep: 2,
          completedSteps: [1],
          account: {
            fullName: data.fullName,
            businessType: data.businessType,
            mobile: cleanPhone,
            email: cleanEmail,
            mobileVerified: true,
            emailVerified: true,
            agreedToTerms: true,
          },
          tax: {
            gstExempt: false,
            legalName: data.fullName,
            pan: "",
            registeredAddress: "",
            sameAsGstAddress: true,
            chargesIgst: true,
            govtIdType: "Passport",
            govtIdLast4: "",
          },
          store: {
            storeName: defaultStoreName,
            slug,
            tagline: "Quality EV Spares & Accessories",
            description: "Supplying verified electric vehicle parts and accessories across the city.",
            sellerType: "Retailer",
            categories: ["Spare Parts", "Bike Accessories"],
            brands: [],
            yearsInBusiness: 1,
          },
          shipping: {
            pickupAddress: {
              line1: "",
              pincode: "560038",
              city: "Bengaluru",
              state: "Karnataka",
              lat: 12.9716,
              lng: 77.5946,
            },
            contactName: data.fullName,
            contactPhone: cleanPhone,
            workingHours: {
              monday: { open: "09:00", close: "19:00" },
              tuesday: { open: "09:00", close: "19:00" },
              wednesday: { open: "09:00", close: "19:00" },
              thursday: { open: "09:00", close: "19:00" },
              friday: { open: "09:00", close: "19:00" },
              saturday: { open: "09:00", close: "19:00" },
            },
            handlingTimeMins: 20,
            fulfillmentMode: "hyperlocal",
            serviceableRadiusKm: 20,
            acceptsCod: false,
            returnWindowDays: 7,
            returnAddressSameAsPickup: true,
            sellsLiIon: false,
            un38_3Declared: false,
          },
          bank: {
            accountHolderName: data.fullName,
            accountNumber: "",
            maskedAccountNumber: "",
            ifsc: "",
            bankName: "",
            branchName: "",
            accountType: "Current",
            pennyDropVerified: false,
          },
          documents: {
            brandAuthDocs: [],
            safetyCertDocs: [],
            agreementAccepted: false,
            signatureName: data.fullName,
          },
        };

        const newVendor: Vendor = {
          id: vendorId,
          email: cleanEmail,
          phone: cleanPhone,
          businessName: data.fullName,
          storeName: defaultStoreName,
          slug,
          status: "draft",
          commissionRate: 12,
          rating: 5.0,
          totalSales: 0,
          activeProductsCount: 0,
          holidayMode: false,
          lat: 12.9716,
          lng: 77.5946,
          prepMins: 20,
          area: "Bengaluru",
          onboarding: initialOnboarding,
          auditTimeline: [
            {
              id: `evt_${Date.now()}`,
              timestamp: Date.now(),
              actor: data.fullName,
              actorRole: "vendor",
              action: "Created seller account",
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        saveVendorDraft(newVendor);
        setVendorSession(newVendor, true);

        return { success: true, vendorId };
      } catch (e) {
        console.error("Vendor sign up error:", e);
        return { success: false, error: "Failed to create vendor account" };
      }
    },
    [getVendorByEmail, getVendorByPhone, saveVendorDraft, setVendorSession]
  );

  const resetPasswordWithOtp = useCallback(
    async (emailOrPhone: string, code: string, newPass: string) => {
      try {
        const clean = emailOrPhone.trim();
        const isEmail = clean.includes("@");
        const channel = isEmail ? "email" : "sms";

        const verifyRes = await otpAdapter.verify(channel, clean, code);
        if (!verifyRes.success) {
          return { success: false, error: verifyRes.error || "Invalid OTP" };
        }

        const hashed = await hashPassword(newPass);
        const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
        const creds: Record<string, string> = rawCreds ? JSON.parse(rawCreds) : {};
        creds[clean] = hashed;
        localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(creds));

        toast.success("Password reset successfully. You can now sign in.");
        return { success: true };
      } catch (e) {
        return { success: false, error: "Failed to reset password" };
      }
    },
    []
  );

  const signOutVendor = useCallback(async () => {
    localStorage.setItem("vendor_signed_out", "true");
    localStorage.removeItem(VENDOR_SESSION_KEY);
    sessionStorage.removeItem(VENDOR_SESSION_KEY);
    setSession(null);
    toast.info("Signed out of Vendor Portal");
    if (typeof window !== "undefined") {
      window.location.href = "/vendor/auth";
    }
  }, []);

  const refreshVendorSession = useCallback(() => {
    const raw = localStorage.getItem(VENDOR_SESSION_KEY) || sessionStorage.getItem(VENDOR_SESSION_KEY);
    if (raw) {
      setSession(JSON.parse(raw));
    }
  }, []);

  const value = useMemo<VendorAuthContextType>(
    () => ({
      vendor: currentVendor,
      currentVendor,
      session,
      isAuthenticated: Boolean(session && currentVendor),
      loading,
      signInWithPassword,
      signInWithOtp,
      signUpVendor,
      resetPasswordWithOtp,
      signOutVendor,
      logout: signOutVendor,
      refreshVendorSession,
    }),
    [
      currentVendor,
      session,
      loading,
      signInWithPassword,
      signInWithOtp,
      signUpVendor,
      resetPasswordWithOtp,
      signOutVendor,
      refreshVendorSession,
    ]
  );

  return <VendorAuthContext.Provider value={value}>{children}</VendorAuthContext.Provider>;
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error("useVendorAuth must be used within VendorAuthProvider");
  }
  return context;
}

/**
 * Route guard for Vendor portal screens.
 */
export function VendorRouteGuard({
  children,
  allowPending = false,
}: {
  children: React.ReactNode;
  allowPending?: boolean;
}) {
  const { vendor, isAuthenticated, loading } = useVendorAuth();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const currentPath = useRouterState({
    select: (s) => s.location.pathname + (s.location.searchStr ? `?${s.location.searchStr}` : ""),
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">Checking vendor credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !vendor) {
    return <Navigate to="/vendor/auth" search={{ redirect: currentPath }} replace />;
  }

  // If onboarding is incomplete, redirect to onboarding stepper (unless already on onboarding page)
  if (vendor.status === "draft" && (vendor.onboarding?.currentStep ?? 1) < 6) {
    if (pathname !== "/vendor/onboarding") {
      return <Navigate to="/vendor/onboarding" replace />;
    }
  }

  // If vendor is not approved, gate dashboard access (unless allowPending or already on pending page)
  if (!allowPending && vendor.status !== "approved") {
    if (pathname !== "/vendor/pending") {
      return <Navigate to="/vendor/pending" replace />;
    }
  }

  return <>{children}</>;
}
