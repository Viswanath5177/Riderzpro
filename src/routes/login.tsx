import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { isMobileDevice } from "@/lib/native/app";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Bike,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import logoImg from "@/assets/riderzpro-logo.png";
import { useStore } from "@/lib/store";
import { bikes } from "@/lib/data";
import { useVendorAuth } from "@/lib/vendorAuth";
import { useAdminAuth, AdminUser } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

export type LoginSearch = {
  redirect?: string;
  role?: "customer" | "vendor";
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const rawRedirect = search["redirect"];
    const rawRole = search["role"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
      role: rawRole === "vendor" ? "vendor" : "customer",
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In & Registration — RiderzPro" },
      {
        name: "description",
        content:
          "Sign in or create your RiderzPro account to manage your electric vehicle garage, order verified spare parts, or manage your seller store.",
      },
      { property: "og:title", content: "Sign In & Registration — RiderzPro" },
      {
        property: "og:description",
        content: "Access your EV ownership, spares, and seller dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", search: { tab: "account" }, replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  const { userProfile, setRole, signIn, updateUserProfile, addBike } = useStore();
  const { signInWithPassword, signInWithOtp } = useVendorAuth();
  const { setAdminSession, login: adminLogin } = useAdminAuth();

  // Role: "customer" | "vendor"
  const [roleTab, setRoleTab] = useState<"customer" | "vendor">(search.role || "customer");
  // Mode: "signin" | "signup"
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In inputs (Customer & Vendor share or preserve inputs)
  const [signInContact, setSignInContact] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP login toggle
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Sign Up inputs (Customer)
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpBikeId, setSignUpBikeId] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Status & Errors
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Evaluates destination strictly based on authoritative role and permissions.
   * If a return URL exists and the role is allowed to access it, goes there;
   * otherwise directs to the role's default dashboard.
   */
  const getAllowedRedirect = (role: string, returnUrl?: string | null): string => {
    if (returnUrl && returnUrl.startsWith("/")) {
      if (role === "admin" || role.includes("ADMIN")) {
        return returnUrl;
      }
      if (role === "seller") {
        if (!returnUrl.startsWith("/admin")) {
          return returnUrl;
        }
      }
      if (role === "customer") {
        if (!returnUrl.startsWith("/admin") && !returnUrl.startsWith("/vendor")) {
          return returnUrl;
        }
      }
    }

    if (role === "admin" || role.includes("ADMIN")) {
      return "/admin";
    }
    if (role === "seller") {
      return "/vendor/dashboard";
    }
    return "/dashboard/customer";
  };

  /**
   * Unified Authentication:
   * The tab selection does NOT decide permissions or destination.
   * The authoritative role from the server/session decides destination.
   */
  interface ServerAuthResponse {
    success?: boolean;
    role?: string;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
      phone?: string;
      storeName?: string;
    };
    redirectUrl?: string;
    error?: string;
  }

  const executeUnifiedSignIn = async (contact: string, pass: string) => {
    const cleanContact = contact.trim();
    const trimmedPass = pass.trim();

    if (!cleanContact) {
      setFormError("Please enter your registered mobile number or email.");
      return;
    }
    if (!trimmedPass) {
      setFormError("Please enter your password.");
      return;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      // 1. First, check server /api/auth/signin endpoint
      let serverAuth: ServerAuthResponse | null = null;
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: cleanContact, password: trimmedPass }),
        });
        if (res.ok) {
          const data = (await res.json()) as ServerAuthResponse;
          if (data && data.success) {
            serverAuth = data;
          }
        }
      } catch {
        // Backend offline or unreachable, proceed to local auth check
      }

      // If Server successfully authenticated the credentials:
      if (serverAuth && serverAuth.role) {
        const role = serverAuth.role;

        // A. ADMIN ROLE FROM SERVER
        if (role === "admin" || String(role).includes("ADMIN")) {
          localStorage.removeItem("riderzpro_auth_user");
          localStorage.removeItem("riderzpro_auth_token");
          localStorage.removeItem("riderzpro_vendor_session");
          sessionStorage.removeItem("riderzpro_vendor_session");

          const adminObj: AdminUser = {
            id: serverAuth.user?.id || `adm_${Date.now()}`,
            name: serverAuth.user?.fullName || "Administrator",
            email: serverAuth.user?.email || cleanContact,
            role: "admin",
            roleTitle:
              role === "PRODUCT_ADMIN"
                ? "Product Administrator"
                : role === "SELLER_ADMIN"
                  ? "Seller Administrator"
                  : "Super Admin",
            department: "Operations & Platform Oversight",
          };
          setAdminSession(adminObj);
          toast.success("Welcome back to Admin Console!");
          const dest = getAllowedRedirect("admin", search.redirect || serverAuth.redirectUrl);
          navigate({ to: dest as never });
          return;
        }

        // B. SELLER ROLE FROM SERVER
        if (role === "seller") {
          localStorage.removeItem("riderzpro_admin_session");
          localStorage.removeItem("vendor_signed_out");
          const vendorSession = {
            vendorId: serverAuth.user?.id || "v1",
            email: serverAuth.user?.email || cleanContact,
            phone: serverAuth.user?.phone || "",
            storeName: serverAuth.user?.storeName || "VoltHub Partner",
            status: "approved" as const,
            token: `vtok_${Date.now()}`,
          };
          localStorage.setItem("riderzpro_vendor_session", JSON.stringify(vendorSession));
          toast.success("Welcome back to Seller Dashboard!");
          const dest = getAllowedRedirect("seller", search.redirect || serverAuth.redirectUrl);
          navigate({ to: dest as never });
          return;
        }

        // C. CUSTOMER ROLE FROM SERVER
        if (role === "customer") {
          if (roleTab === "vendor") {
            // Keep existing vendor tab behavior for customer accounts: friendly message
            setFormError(
              "No vendor account found with this mobile or email. Please sign in through the Customer tab.",
            );
            return;
          }

          localStorage.removeItem("riderzpro_admin_session");
          const sessionUser = {
            id: serverAuth.user?.id || `usr_${Date.now()}`,
            name: serverAuth.user?.fullName || "Rider",
            email: serverAuth.user?.email || cleanContact,
            phone: serverAuth.user?.phone || cleanContact,
            role: "customer" as const,
          };
          localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
          localStorage.setItem("riderzpro_auth_token", `tok_${Date.now()}`);
          signIn();
          setRole("customer");
          toast.success(`Welcome back, ${sessionUser.name.split(" ")[0]}!`);
          const dest = getAllowedRedirect("customer", search.redirect || serverAuth.redirectUrl);
          navigate({ to: dest as never });
          return;
        }
      }

      // 2. Demo Seeds & Offline Fallback Checking
      // Check Admin credentials (works on Vendor tab AND Customer tab)
      const adminAttempt = await adminLogin(cleanContact, trimmedPass);
      if (adminAttempt.success) {
        localStorage.removeItem("riderzpro_auth_user");
        localStorage.removeItem("riderzpro_auth_token");
        localStorage.removeItem("riderzpro_vendor_session");
        sessionStorage.removeItem("riderzpro_vendor_session");

        const adminObj: AdminUser = {
          id: "adm_vikram_01",
          name: "Vikram Malhotra",
          email: cleanContact,
          role: "admin",
          roleTitle: "Super Admin",
          department: "Operations & Platform Oversight",
        };
        setAdminSession(adminObj);
        toast.success("Welcome back to Admin Console!");
        const dest = getAllowedRedirect("admin", search.redirect);
        navigate({ to: dest as never });
        return;
      }

      // Check Vendor credentials
      const vendorAttempt = await signInWithPassword(cleanContact, trimmedPass, rememberMe);
      if (vendorAttempt.success) {
        localStorage.removeItem("riderzpro_admin_session");
        toast.success("Welcome back to Seller Dashboard!");
        const dest = getAllowedRedirect("seller", search.redirect);
        navigate({ to: dest as never });
        return;
      }

      // Check Customer credentials
      const isCustomerCreds =
        cleanContact === "9876543210" ||
        cleanContact.toLowerCase() === "aakash@riderzpro.com" ||
        trimmedPass === "Customer@123" ||
        trimmedPass === "Password123" ||
        (cleanContact.length >= 10 && trimmedPass.length >= 4);

      if (isCustomerCreds) {
        if (roleTab === "vendor") {
          // Keep existing behavior: friendly message
          setFormError(
            "No vendor account found with this mobile or email. Switch to the Customer tab to sign in.",
          );
          return;
        }

        const isEmail = cleanContact.includes("@");
        const customerEmail = isEmail ? cleanContact : `${cleanContact}@riderzpro.in`;
        const customerPhone = isEmail ? userProfile?.phone || "" : cleanContact;
        const customerName =
          userProfile?.name && userProfile.name !== "Rider"
            ? userProfile.name
            : isEmail
              ? cleanContact.split("@")[0]
              : "Rider";

        localStorage.removeItem("riderzpro_admin_session");
        const sessionUser = {
          id: `usr_${Date.now()}`,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          role: "customer" as const,
        };
        localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
        localStorage.setItem("riderzpro_auth_token", `tok_${Date.now()}`);
        signIn();
        setRole("customer");
        toast.success(`Welcome back, ${customerName.split(" ")[0]}!`);
        const dest = getAllowedRedirect("customer", search.redirect);
        navigate({ to: dest as never });
        return;
      }

      setFormError("Invalid credentials. Please verify your contact information and password.");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "An unexpected error occurred during sign in.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Sign In Handlers (Unified logic by role)
  // -------------------------------------------------------------
  const handleCustomerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    executeUnifiedSignIn(signInContact, signInPassword);
  };

  const handleVendorSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    executeUnifiedSignIn(signInContact, signInPassword);
  };

  // -------------------------------------------------------------
  // OTP Sign In Handler
  // -------------------------------------------------------------
  const handleSendOtp = () => {
    if (!signInContact.trim()) {
      setFormError("Please enter your mobile number to receive an OTP.");
      return;
    }
    setFormError(null);
    setOtpSent(true);
    setOtpCode("123456");
    toast.info("Demo OTP sent: 123456");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setFormError("Please enter the 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    try {
      if (roleTab === "vendor") {
        const res = await signInWithOtp(signInContact.trim(), otpCode.trim());
        if (res.success) {
          toast.success("Signed in as Vendor successfully!");
          const dest = getAllowedRedirect("seller", search.redirect);
          navigate({ to: dest as never });
        } else {
          setFormError(res.error || "Invalid OTP code.");
        }
      } else {
        handleCustomerSignIn(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fast 1-Click Demo Login
  const handleFastDemoLogin = (role: "customer" | "vendor") => {
    if (role === "vendor") {
      setSignInContact("9000000001");
      setSignInPassword("Vendor@123");
      setIsLoading(true);
      setTimeout(async () => {
        try {
          await executeUnifiedSignIn("9000000001", "Vendor@123");
        } finally {
          setIsLoading(false);
        }
      }, 200);
    } else {
      setSignInContact("9876543210");
      setSignInPassword("Customer@123");
      setIsLoading(true);
      setTimeout(async () => {
        try {
          await executeUnifiedSignIn("9876543210", "Customer@123");
        } finally {
          setIsLoading(false);
        }
      }, 200);
    }
  };

  // -------------------------------------------------------------
  // Customer Sign Up Handler (Unchanged logic)
  // -------------------------------------------------------------
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!signUpName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!signUpPhone.trim()) {
      setFormError("Please enter your mobile number.");
      return;
    }
    if (!signUpPassword.trim() || signUpPassword.length < 4) {
      setFormError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const cleanPhone = signUpPhone.trim();
      const cleanEmail = signUpEmail.trim() || `${cleanPhone}@riderzpro.in`;
      const cleanName = signUpName.trim();

      // Clear conflicting admin session
      localStorage.removeItem("riderzpro_admin_session");

      // 1. Save customer auth session in localStorage
      const sessionUser = {
        id: `usr_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: "customer" as const,
      };
      localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
      localStorage.setItem("riderzpro_auth_token", `tok_${Date.now()}`);

      // 2. Add to registered users list for compatibility
      try {
        const rawUsers = localStorage.getItem("riderzpro_registered_users");
        const existingUsers = rawUsers ? JSON.parse(rawUsers) : [];
        existingUsers.push({
          ...sessionUser,
          passwordHash: signUpPassword,
        });
        localStorage.setItem("riderzpro_registered_users", JSON.stringify(existingUsers));
      } catch (err) {
        console.warn("Could not save to registered users", err);
      }

      // 3. Update user profile
      updateUserProfile({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        city: "Bengaluru, KA",
        address: "",
      });

      // 4. If a bike was selected, register it in garage
      if (signUpBikeId && signUpBikeId !== "none") {
        const selectedBike = bikes.find((b) => b.id === signUpBikeId);
        if (selectedBike) {
          addBike({
            bikeId: selectedBike.id,
            year: selectedBike.years.at(-1),
            nickname: `${cleanName.split(" ")[0]}'s ${selectedBike.model}`,
            batteryHealth: 99,
            nextServiceDays: 90,
            odoKm: 0,
          });
        }
      }

      // 5. Authenticate and set role
      signIn();
      setRole("customer");

      toast.success(`Account created! Welcome, ${cleanName.split(" ")[0]}!`);

      const target = getAllowedRedirect("customer", search.redirect);
      navigate({ to: target as never });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#0F172A] font-sans flex flex-col justify-between selection:bg-[#E11D2A]/15 selection:text-[#E11D2A] antialiased">
      {/* Responsive Grid Container: Split Screen on Desktop (>=900px), Stacked on Mobile (<900px) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* ======================================================== */}
        {/* LEFT PANEL: HERO SHOWCASE (Desktop & Tablet >=900px)     */}
        {/* ======================================================== */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#0F172A]">
          {/* Background Photo with Smooth Dark Gradient */}
          <img
            src={evShowcaseImg}
            alt="RiderzPro Electric Motorcycle"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
          />
          {/* Subtle gradient overlay to guarantee AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-[#0F172A]/40" />

          {/* Top-Left: Logo on crisp rounded white chip */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-white/80 hover:scale-[1.02] transition"
              title="RiderzPro Home"
            >
              <img
                src={logoImg}
                alt="RiderzPro Logo"
                className="h-10 sm:h-12 w-auto object-contain filter contrast-[1.3] brightness-[0.85] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
              />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition active:scale-95"
            >
              ← Back to store
            </Link>
          </div>

          {/* Center-Bottom: Typography Headline & Value Pillars */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl xl:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Your ride. Verified spares.
              </h2>
              <p className="text-base text-zinc-300 font-normal leading-relaxed">
                EV mobility and doorstep care, delivered.
              </p>
            </div>

            {/* Three Value Points with Simple Line Icons */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-white/90">
                <ShieldCheck className="h-4.5 w-4.5 text-[#E11D2A] shrink-0" />
                <span className="text-xs font-medium">Verified spares</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/90">
                <Bike className="h-4.5 w-4.5 text-[#E11D2A] shrink-0" />
                <span className="text-xs font-medium">Live delivery tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/90">
                <FileText className="h-4.5 w-4.5 text-[#E11D2A] shrink-0" />
                <span className="text-xs font-medium">GST invoice on every order</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE HERO (<900px): Compact stacked banner            */}
        {/* ======================================================== */}
        <div className="lg:hidden relative h-48 sm:h-52 w-full overflow-hidden bg-[#0F172A] shrink-0">
          <img
            src={evShowcaseImg}
            alt="RiderzPro Electric Motorcycle"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-[#0F172A]/30" />

          {/* Mobile Top Navigation */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-white px-3.5 py-2 rounded-xl shadow-sm border border-white/80 active:scale-95 transition"
            >
              <img
                src={logoImg}
                alt="RiderzPro Logo"
                className="h-8 sm:h-9 w-auto object-contain filter contrast-[1.3] brightness-[0.85] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
              />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-semibold backdrop-blur-md border border-white/20 active:scale-95 transition"
            >
              ← Store
            </Link>
          </div>

          {/* Mobile Headline (Single clean line, no tag pill crowding) */}
          <div className="absolute bottom-9 left-4 right-4 z-10">
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              Your ride. Verified spares.
            </h2>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: SIGN-IN / CREATE ACCOUNT FORM CARD         */}
        {/* ======================================================== */}
        <div className="flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 z-10 -mt-6 lg:mt-0">
          <div className="w-full max-w-[420px] bg-white rounded-[20px] lg:rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_24px_rgba(15,23,42,0.06)] p-6 sm:p-8 space-y-5 transition-all">
            {/* 1. ROLE SELECTOR (Quiet, compact segmented control) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]/70">
              <span className="text-[13px] font-medium text-[#475569]">I am a:</span>
              <div
                role="tablist"
                aria-label="User role"
                className="inline-flex p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]/60 text-xs"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={roleTab === "customer"}
                  onClick={() => {
                    setRoleTab("customer");
                    setFormError(null);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-medium",
                    roleTab === "customer"
                      ? "bg-white text-[#0F172A] font-bold shadow-xs"
                      : "text-[#475569] hover:text-[#0F172A]",
                  )}
                >
                  Customer
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={roleTab === "vendor"}
                  onClick={() => {
                    setRoleTab("vendor");
                    setFormError(null);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer font-medium",
                    roleTab === "vendor"
                      ? "bg-white text-[#0F172A] font-bold shadow-xs"
                      : "text-[#475569] hover:text-[#0F172A]",
                  )}
                >
                  Vendor
                </button>
              </div>
            </div>

            {/* 2. MODE TABS (Underline-style tabs clearly distinct from role selector) */}
            <div className="flex border-b border-[#E2E8F0] relative">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setFormError(null);
                }}
                className={cn(
                  "flex-1 pb-3 text-center text-sm font-semibold transition-colors cursor-pointer relative",
                  activeTab === "signin"
                    ? "text-[#0F172A] font-bold"
                    : "text-[#475569] hover:text-[#0F172A]",
                )}
              >
                <span>Sign in</span>
                {activeTab === "signin" && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E11D2A] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setFormError(null);
                }}
                className={cn(
                  "flex-1 pb-3 text-center text-sm font-semibold transition-colors cursor-pointer relative",
                  activeTab === "signup"
                    ? "text-[#0F172A] font-bold"
                    : "text-[#475569] hover:text-[#0F172A]",
                )}
              >
                <span>{roleTab === "vendor" ? "Register store" : "Create account"}</span>
                {activeTab === "signup" && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E11D2A] rounded-full" />
                )}
              </button>
            </div>

            {/* 3. HEADING & SUBTITLE (Wrap comfortably, no clipping) */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-tight leading-snug">
                {activeTab === "signin"
                  ? "Welcome back"
                  : roleTab === "vendor"
                    ? "Register as Seller"
                    : "Create your account"}
              </h1>
              <p className="text-[15px] font-normal text-[#475569] leading-relaxed">
                {activeTab === "signin"
                  ? roleTab === "vendor"
                    ? "Manage orders, stock and payouts."
                    : "Sign in to continue"
                  : roleTab === "vendor"
                    ? "Sell verified EV parts and accessories across India."
                    : "Set up your EV garage to get verified spares and doorstep service."}
              </p>
            </div>

            {/* Server / Form Error Banner */}
            {formError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-[#DC2626] flex items-start gap-2 animate-in fade-in duration-150"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{formError}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* SIGN IN VIEW                                             */}
            {/* ======================================================== */}
            {activeTab === "signin" ? (
              <div className="space-y-4">
                {!isOtpMode ? (
                  <form
                    onSubmit={roleTab === "vendor" ? handleVendorSignIn : handleCustomerSignIn}
                    className="space-y-4"
                  >
                    {/* Mobile / Email Field */}
                    <div>
                      <label
                        htmlFor="signin-contact"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Mobile number or email
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signin-contact"
                          type="text"
                          name="username"
                          autoComplete="username"
                          inputMode="text"
                          value={signInContact}
                          onChange={(e) => setSignInContact(e.target.value)}
                          placeholder="Mobile number or email"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <Phone className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="signin-password"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signin-password"
                          type={showSignInPassword ? "text" : "password"}
                          name="password"
                          autoComplete="current-password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 pr-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <Lock className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                        <button
                          type="button"
                          aria-label={showSignInPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3.5 text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer transition"
                        >
                          {showSignInPassword ? (
                            <EyeOff className="h-4.5 w-4.5" />
                          ) : (
                            <Eye className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[#475569]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded-md border-[#E2E8F0] text-[#E11D2A] focus:ring-[#E11D2A]/40 cursor-pointer accent-[#E11D2A]"
                        />
                        <span className="font-medium">Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          toast.info("Password reset instructions sent to your phone/email.")
                        }
                        className="font-semibold text-[#E11D2A] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Primary Sign In Button */}
                    <button
                      type="submit"
                      id="signin-submit-btn"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-[#E11D2A] hover:bg-[#C91824] active:bg-[#B01520] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign in</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* OTP Mode */
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                        Mobile number
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={signInContact}
                          onChange={(e) => setSignInContact(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <Phone className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <KeyRound className="h-4 w-4" />
                        <span>Send 6-digit OTP</span>
                      </button>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                            Enter 6-digit OTP code
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 text-center text-lg font-mono font-bold tracking-widest text-[#0F172A] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 rounded-xl bg-[#E11D2A] hover:bg-[#C91824] text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <span>Verify & Sign in</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </>
                    )}

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpMode(false);
                          setOtpSent(false);
                        }}
                        className="text-xs font-semibold text-[#475569] hover:text-[#0F172A] underline cursor-pointer"
                      >
                        Sign in with password instead
                      </button>
                    </div>
                  </form>
                )}

                {/* Secondary OTP Divider & Button */}
                {!isOtpMode && (
                  <div className="space-y-3 pt-1">
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-[#E2E8F0] w-full" />
                      <span className="bg-white px-3 text-xs text-[#94A3B8] font-medium uppercase tracking-wider relative">
                        or
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpMode(true);
                        setFormError(null);
                      }}
                      className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#0F172A] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="h-4 w-4 text-[#475569]" />
                      <span>Sign in with OTP</span>
                    </button>
                  </div>
                )}

                {/* Quiet Fast Demo Login Helper Pill */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin(roleTab)}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition flex items-center justify-between text-xs font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#E11D2A]" />
                      <span>1-Click Fast Demo Login</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#0F172A]">
                      {roleTab === "vendor" ? "VoltHub Indiranagar" : "Demo Customer"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* CREATE ACCOUNT VIEW (Consistent styling & validation)    */
              /* ======================================================== */
              <div className="space-y-4">
                {roleTab === "vendor" ? (
                  <div className="rounded-xl border border-[#E2E8F0] p-4 bg-[#F8FAFC] space-y-3 text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E11D2A] mx-auto border border-red-200">
                      <Bike className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        Become a Partner Merchant
                      </h3>
                      <p className="text-xs text-[#475569] mt-0.5">
                        Sell EV spares, batteries, and chargers with automated courier pickup and
                        T+7 bank settlements.
                      </p>
                    </div>
                    <Link
                      to="/vendor/onboarding"
                      className="inline-flex w-full h-11 rounded-xl bg-[#E11D2A] hover:bg-[#C91824] text-white font-semibold text-xs items-center justify-center gap-1.5 shadow-none transition"
                    >
                      <span>Start Seller Onboarding</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="signup-name"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Full name
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signup-name"
                          type="text"
                          name="name"
                          autoComplete="name"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <User className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label
                        htmlFor="signup-phone"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Mobile number
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signup-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <Phone className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Optional EV Model Selection */}
                    <div>
                      <label
                        htmlFor="signup-bike"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Electric vehicle model{" "}
                        <span className="font-normal text-[#94A3B8]">(Optional)</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="signup-bike"
                          value={signUpBikeId}
                          onChange={(e) => setSignUpBikeId(e.target.value)}
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 pr-10 text-base text-[#0F172A] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition appearance-none cursor-pointer"
                        >
                          <option value="">Select your model (e.g. Ather, Ola...)</option>
                          {bikes.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.make} {b.model}
                            </option>
                          ))}
                          <option value="none">I don't own an EV yet</option>
                        </select>
                        <Bike className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                        <ChevronRight className="h-4.5 w-4.5 text-[#94A3B8] absolute right-3.5 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="signup-password"
                        className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
                      >
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signup-password"
                          type={showSignUpPassword ? "text" : "password"}
                          name="password"
                          autoComplete="new-password"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full h-12 rounded-xl border border-[#E2E8F0] bg-white px-4 pl-11 pr-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/40 transition"
                          required
                        />
                        <Lock className="h-4.5 w-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                        <button
                          type="button"
                          aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3.5 text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer transition"
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="h-4.5 w-4.5" />
                          ) : (
                            <Eye className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-[#475569]">Use at least 4 characters.</p>
                    </div>

                    {/* Terms Line */}
                    <p className="text-xs text-[#475569] leading-relaxed pt-1">
                      By continuing you agree to the{" "}
                      <Link to="/" className="text-[#E11D2A] hover:underline font-medium">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link to="/" className="text-[#E11D2A] hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </p>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-[#E11D2A] hover:bg-[#C91824] active:bg-[#B01520] text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-none mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create account</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 8. FOOTER: Security badge */}
            <div className="pt-2 border-t border-[#E2E8F0]/70 flex items-center justify-center gap-1.5 text-xs text-[#94A3B8]">
              <Lock className="h-3.5 w-3.5 text-[#94A3B8]" />
              <span>Secure sign-in · 256-bit SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
