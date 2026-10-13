import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bike,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Star,
  Award,
  Shield,
  Clock,
  Wrench,
  X,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { bikes } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  sendEmailOtp,
  verifyEmailOtp,
  registerCustomer,
  customerSignIn,
  sellerSignIn,
  adminSignIn,
  getCurrentRole,
} from "@/lib/auth";

export type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const rawRedirect = search["redirect"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    try {
      const role = await getCurrentRole();
      if (role === "PRODUCT_ADMIN") throw redirect({ to: "/admin/products" });
      if (role === "SELLER_ADMIN") throw redirect({ to: "/admin/sellers" });
      if (role === "seller") throw redirect({ to: "/dashboard/vendor" });
      if (role === "admin") throw redirect({ to: "/dashboard/admin" });
      if (role === "customer") {
        const target = (search as any)?.redirect || "/dashboard/customer";
        throw redirect({ to: target });
      }
    } catch (e) {
      if ((e as any)?.to) throw e;
    }
  },
  head: () => ({
    meta: [
      { title: "Sign In & Register — RiderzPro" },
      {
        name: "description",
        content:
          "Sign in or register your RiderzPro account to manage your electric vehicle garage, track orders, and schedule doorstep certified service.",
      },
      { property: "og:title", content: "Customer Sign In & Registration — RiderzPro" },
      { property: "og:description", content: "Access your EV ownership, spares, and service dashboard." },
    ],
  }),
  component: () => <CustomerLogin />,
});

interface CustomerLoginProps {
  defaultTab?: "signin" | "signup";
}

export function CustomerLogin({ defaultTab }: CustomerLoginProps) {
  const navigate = useNavigate();
  const { userProfile, setRole, signIn, updateUserProfile, addBike } = useStore();

  // Tab state: "signin" | "signup"
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Read search params on mount
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      return;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") || params.get("mode");
      if (tabParam === "signup" || tabParam === "register") {
        setActiveTab("signup");
      }
    }
  }, [defaultTab]);

  // Sign In State
  const [signInMode, setSignInMode] = useState<"password" | "otp">("password");
  const [signInContact, setSignInContact] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpPhone, setOtpPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpBikeId, setSignUpBikeId] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Showcase Carousel slide
  const [activeSlide, setActiveSlide] = useState(0);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Email OTP Verification Modal State
  const [isEmailOtpModalOpen, setIsEmailOtpModalOpen] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailOtpCooldown, setEmailOtpCooldown] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // Rotate showcase slides automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Email OTP Cooldown timer
  useEffect(() => {
    let interval: any = null;
    if (emailOtpCooldown > 0) {
      interval = setInterval(() => setEmailOtpCooldown((c) => Math.max(0, c - 1)), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [emailOtpCooldown]);

  // Mobile Mock OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (otpSent && otpCountdown > 0) {
      interval = setInterval(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpCountdown]);

  // Dynamic Password Strength Meter
  const passwordStrength = useMemo(() => {
    if (!signUpPassword) return { score: 0, label: "Enter password", color: "bg-gray-200" };
    let score = 0;
    if (signUpPassword.length >= 6) score++;
    if (signUpPassword.length >= 8) score++;
    if (/[0-9]/.test(signUpPassword)) score++;
    if (/[^A-Za-z0-9]/.test(signUpPassword) || /[A-Z]/.test(signUpPassword)) score++;

    if (score === 1) return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-500" };
    return { score: 4, label: "Strong & Secure", color: "bg-emerald-500", text: "text-emerald-600" };
  }, [signUpPassword]);

  const getRedirectTarget = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir && redir.startsWith("/")) return redir;
    }
    return "/dashboard/customer";
  };

  // Handle Standard Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInContact.trim()) {
      toast.error("Please enter your mobile number or email.");
      return;
    }
    if (!signInPassword.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate with PostgreSQL database backend across admins, sellers, customers, and users
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: signInContact.trim(),
          password: signInPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Invalid email or password. Please verify your database credentials.");
        return;
      }

      const user = data.user;
      const role = data.role;
      const redirectUrl = data.redirectUrl || "/dashboard/customer";

      // 1. Update store profile with real user data from database
      updateUserProfile({
        name: user.fullName || user.storeName || "Rider",
        email: user.email,
        phone: user.phone || "",
      });
      signIn();

      // 2. Set role & persistence based on database role
      if (
        role === "PRODUCT_ADMIN" ||
        role === "SELLER_ADMIN" ||
        role === "SUPPORT_ADMIN" ||
        role === "SUPER_ADMIN" ||
        role === "admin"
      ) {
        setRole("admin");
        const adminSession = {
          token: `sess_adm_${Date.now()}`,
          role: "admin",
          user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: "admin",
            roleTitle:
              role === "PRODUCT_ADMIN"
                ? "Product Administrator"
                : role === "SELLER_ADMIN"
                ? "Seller Administrator"
                : "System Administrator",
            department:
              role === "PRODUCT_ADMIN"
                ? "Product Catalog & Inventory Review"
                : role === "SELLER_ADMIN"
                ? "Seller Verification & Compliance"
                : "Operations & Platform Oversight",
          },
          loginTime: Date.now(),
        };
        localStorage.setItem("riderzpro_admin_session", JSON.stringify(adminSession));
        localStorage.setItem(
          "riderzpro_auth_user",
          JSON.stringify({
            id: user.id,
            name: user.fullName,
            email: user.email,
            phone: user.phone || "",
            role: "admin",
          })
        );
        localStorage.setItem("riderzpro_auth_token", "session_active");

        const displayRole =
          role === "PRODUCT_ADMIN"
            ? "Product Admin"
            : role === "SELLER_ADMIN"
            ? "Seller Admin"
            : "Admin";
        toast.success(`Welcome back, ${user.fullName}! (${displayRole})`);
        navigate({ to: redirectUrl as any });
      } else if (role === "seller") {
        setRole("seller");
        localStorage.setItem(
          "riderzpro_auth_user",
          JSON.stringify({
            id: user.id,
            name: user.fullName || user.storeName,
            email: user.email,
            phone: user.phone || "",
            role: "seller",
          })
        );
        localStorage.setItem("riderzpro_auth_token", "session_active");
        toast.success(`Welcome back, ${user.storeName || user.fullName}! (Vendor Portal)`);
        navigate({ to: redirectUrl as any });
      } else {
        setRole("customer");
        localStorage.setItem(
          "riderzpro_auth_user",
          JSON.stringify({
            id: user.id,
            name: user.fullName,
            email: user.email,
            phone: user.phone || "",
            role: "customer",
          })
        );
        localStorage.setItem("riderzpro_auth_token", "session_active");
        toast.success(`Welcome back, ${user.fullName.split(" ")[0]}!`);
        const target = getRedirectTarget();
        navigate({ to: target as any });
      }
    } catch (err: any) {
      console.error("[Login Error]:", err);
      toast.error(err.message || "Failed to authenticate with database.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Quick Demo Rider Login
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateUserProfile({
        name: "Rahul Verma",
        phone: "+91 98450 12345",
        email: "rahul.verma@example.com",
        city: "Bengaluru, KA",
        address: "74, Indiranagar 100ft Rd, Bengaluru, Karnataka 560038",
        points: 450,
      });

      // Register Ather 450X if empty
      addBike({
        bikeId: "ather-450x",
        year: 2024,
        nickname: "Rahul's 450X Gen 3",
        regNo: "KA 03 EQ 4521",
        batteryHealth: 98,
        nextServiceDays: 28,
        odoKm: 3450,
      });

      signIn();
      setRole("customer");
      toast.success("Signed in as Demo Rider Rahul Verma (Ather 450X owner)!");
      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 400);
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = otpPhone.replace(/\D/g, "");
    if (clean.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCountdown(30);
      setOtpDigits(["1", "2", "3", "4"]); // Pre-fill mock OTP for effortless instant sign-in
      toast.success("Security OTP sent! Auto-filled demo code '1234'.");
    }, 400);
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 4) {
      toast.error("Please enter the 4-digit verification code.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (!userProfile?.phone) {
        updateUserProfile({ phone: `+91 ${otpPhone.trim()}` });
      }
      signIn();
      setRole("customer");
      toast.success("Mobile number verified! Welcome to RiderzPro.");
      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 400);
  };

  // Handle Customer Sign Up: Step 1 dispatches Email OTP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpName.trim()) {
      toast.error("Please enter your full legal name.");
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes("@")) {
      toast.error("Please enter a valid email address to receive your verification code.");
      return;
    }
    if (!signUpPassword.trim() || signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendEmailOtp(signUpEmail.trim(), "CUSTOMER_SIGNUP");
      setEmailOtpCooldown(res.cooldownSeconds || 60);
      setIsEmailOtpModalOpen(true);
      setEmailOtpCode("");
      toast.success(`Verification code dispatched to ${signUpEmail.trim()}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to dispatch verification code. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify Email OTP and Create Customer Account in PostgreSQL
  const handleVerifyEmailOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtpCode.trim() || emailOtpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit code received in your email.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await registerCustomer({
        fullName: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        phone: signUpPhone.trim() || undefined,
        otpCode: emailOtpCode.trim(),
      });

      updateUserProfile({
        name: res.customer.fullName,
        email: res.customer.email,
        phone: res.customer.phone || "",
        points: 100,
      });

      if (signUpBikeId && signUpBikeId !== "none") {
        const selectedBike = bikes.find((b) => b.id === signUpBikeId);
        if (selectedBike) {
          addBike({
            bikeId: selectedBike.id,
            year: selectedBike.years.at(-1),
            nickname: `${signUpName.trim().split(" ")[0]}'s ${selectedBike.model}`,
            batteryHealth: 100,
            nextServiceDays: 90,
            odoKm: 0,
          });
        }
      }

      signIn();
      setRole("customer");
      setIsEmailOtpModalOpen(false);
      toast.success(`Account verified! Welcome to RiderzPro, ${res.customer.fullName.split(" ")[0]}! 🎉 +100 ProPoints`);

      const target = getRedirectTarget();
      navigate({ to: target as any });
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired verification code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendSignupOtp = async () => {
    if (emailOtpCooldown > 0) return;
    setIsResendingOtp(true);
    try {
      await sendEmailOtp(signUpEmail.trim(), "CUSTOMER_SIGNUP");
      setEmailOtpCooldown(60);
      toast.success("A fresh verification code was sent to your email.");
    } catch (err: any) {
      toast.error(err?.message || "Could not resend code. Try again shortly.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) {
      toast.error("Please enter your registered mobile number or email.");
      return;
    }
    setIsForgotSubmitting(true);
    setTimeout(() => {
      setIsForgotSubmitting(false);
      setIsForgotModalOpen(false);
      toast.success(`Password reset link sent to ${forgotInput.trim()}!`);
      setForgotInput("");
    }, 600);
  };

  const showcaseSlides = [
    {
      title: "Guaranteed 100% OEM Spares Matching",
      desc: "Our automated fitment engine maps every lithium battery pack, BMS module, belt, and brake rotor directly to your EV's make and year.",
      stat: "18,400+",
      statLabel: "Compatible SKUs",
      icon: Zap,
    },
    {
      title: "Certified 24-Point Battery Diagnostics",
      desc: "Book doorstep BMS cell health inspections and rapid emergency roadside assistance across major EV hubs in India.",
      stat: "15 Mins",
      statLabel: "Avg. Dispatch Time",
      icon: Wrench,
    },
    {
      title: "Direct From Tier-1 OEM Manufacturers",
      desc: "Backed by direct warranty replacement guarantees and 24-48 hour expedited express delivery to your doorstep.",
      stat: "4.9 ★",
      statLabel: "Customer Satisfaction",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased selection:bg-[#E31E24]/20 selection:text-[#E31E24]">
      {/* Top Mobile Bar (Visible on mobile only) */}
      <div className="lg:hidden bg-neutral-950 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <Logo imgClassName="h-6 w-auto" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Grid: Left Cinematic Showcase + Right Form */}
      <div className="flex-1 grid lg:grid-cols-12 min-h-screen">
        {/* ─────────────────────────────────────────────────────────────
            LEFT PANE: DYNAMIC CINEMATIC SHOWCASE (Desktop & Tablet)
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 xl:col-span-6 relative bg-neutral-950 text-white overflow-hidden hidden lg:flex flex-col justify-between p-8 xl:p-14 border-r border-white/10">
          {/* Background Image with Dark Vignette */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={evShowcaseImg}
              alt="RiderzPro Electric Motorcycle"
              className="h-full w-full object-cover object-center scale-105 filter brightness-75 contrast-110"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/60" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E31E24]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          </div>

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg transition-transform group-hover:scale-105">
                <Logo imgClassName="h-7 w-auto" />
              </div>
            </Link>
          </div>

          {/* Center Dynamic Showcase Content */}
          <div className="relative z-10 my-auto py-8 xl:py-12 max-w-xl">
            {/* Headline */}
            <h1 className="text-3xl xl:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
              {showcaseSlides[activeSlide].title}
            </h1>

            {/* Description */}
            <p className="mt-4 text-base xl:text-lg text-white/75 leading-relaxed font-normal">
              {showcaseSlides[activeSlide].desc}
            </p>

            {/* Interactive Slide Pills */}
            <div className="flex items-center gap-2.5 mt-8">
              {showcaseSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    activeSlide === idx
                      ? "w-8 bg-[#E31E24] shadow-[0_0_12px_rgba(227,30,36,0.8)]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  )}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Floating Glassmorphic Telemetry Preview Card */}
            <div className="mt-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4.5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#E31E24] to-[#ff595e] grid place-items-center text-white shadow-md">
                    <Bike className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-medium">Active Garage Profile</p>
                    <p className="text-sm font-bold text-white">Ather 450X · Gen 3</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  98% Battery Health
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <p className="text-[10px] text-white/50 uppercase font-semibold">Warranty</p>
                  <p className="text-xs font-bold text-white mt-0.5">3 Years Active</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <p className="text-[10px] text-white/50 uppercase font-semibold">Diagnostics</p>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">24/24 Passed</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <p className="text-[10px] text-white/50 uppercase font-semibold">ProPoints</p>
                  <p className="text-xs font-bold text-amber-300 mt-0.5">450 Pts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof Ticker */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["/assets/rider.jpg", "/assets/workshop.jpg", "/assets/scooter.jpg"].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Rider"
                    className="h-7 w-7 rounded-full border-2 border-neutral-900 object-cover"
                  />
                ))}
              </div>
              <p className="text-white/80 font-medium">
                <span className="font-bold text-white">18,400+</span> verified EV riders
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-white">4.9 / 5</span>
              <span className="text-white/50 font-normal">Rating</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT PANE: ULTRA-PREMIUM AUTHENTICATION CONTAINER
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-5 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto min-h-screen">
          {/* Top Bar on Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-[#E31E24] hover:text-[#E31E24] text-xs font-semibold text-gray-700 transition active:scale-95 shadow-2xs group"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24] transition-colors" />
              <span>Back to Store</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              <span>Need help?</span>
              <a
                href="mailto:support@riderzpro.com"
                className="text-gray-900 font-semibold hover:text-[#E31E24] transition"
              >
                24/7 EV Support
              </a>
            </div>
          </div>

          {/* Form Shell */}
          <div className="w-full max-w-md mx-auto my-auto py-4">
            {/* Brand Logo on Mobile Hero */}
            <div className="lg:hidden mb-6 text-center">
              <div className="inline-block bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                <Logo imgClassName="h-7 w-auto mx-auto" />
              </div>
            </div>

            {/* Vendor / Seller Switcher Banner */}
            <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
              <span className="flex items-center gap-2 text-blue-900 font-medium">
                <Store className="h-4 w-4 text-[#0066cc]" />
                <span>Want to sell EV parts or batteries?</span>
              </span>
              <Link
                to="/vendor/signup"
                className="font-bold text-[#0066cc] hover:underline shrink-0"
              >
                Vendor Sign-Up →
              </Link>
            </div>

            {/* Segmented Tab Pill */}
            <div className="relative p-1 rounded-2xl bg-gray-100 border border-gray-200/80 mb-6 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "signin"
                    ? "bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.08)] font-black"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <KeyRound className={cn("h-4 w-4", activeTab === "signin" ? "text-[#E31E24]" : "text-gray-400")} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative",
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.08)] font-black"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <User className={cn("h-4 w-4", activeTab === "signup" ? "text-[#E31E24]" : "text-gray-400")} />
                <span>Create Account</span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E31E24]/10 text-[#E31E24] border border-[#E31E24]/20">
                  +100 Pts
                </span>
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                TAB 1: SIGN IN FLOW
               ───────────────────────────────────────────────────────────── */}
            {activeTab === "signin" ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-display">
                    Welcome back, Rider
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                    Access your garage, verified spares orders, and doorstep service tracking.
                  </p>
                </div>

                {/* Sub-toggle: Password vs Mobile OTP */}
                <div className="flex items-center gap-4 border-b border-gray-200 pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setSignInMode("password");
                      setOtpSent(false);
                    }}
                    className={cn(
                      "pb-2 relative transition-colors cursor-pointer",
                      signInMode === "password"
                        ? "text-[#E31E24] font-bold"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    <span>Password Login</span>
                    {signInMode === "password" && (
                      <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E31E24] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignInMode("otp")}
                    className={cn(
                      "pb-2 relative transition-colors cursor-pointer",
                      signInMode === "otp"
                        ? "text-[#E31E24] font-bold"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    <span>Instant Mobile OTP</span>
                    {signInMode === "otp" && (
                      <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E31E24] rounded-full" />
                    )}
                  </button>
                </div>

                {signInMode === "password" ? (
                  /* Standard Password Form */
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mobile Number or Email
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          name="username"
                          autoComplete="username"
                          value={signInContact}
                          onChange={(e) => setSignInContact(e.target.value)}
                          placeholder="e.g. 9876543210 or rider@example.com"
                          className="w-full h-12 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                          required
                        />
                        <Phone className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsForgotModalOpen(true)}
                          className="text-xs text-[#E31E24] font-bold hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={showSignInPassword ? "text" : "password"}
                          name="password"
                          autoComplete="current-password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Enter your account password"
                          className="w-full h-12 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                          required
                        />
                        <Lock className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer transition"
                          aria-label={showSignInPassword ? "Hide password" : "Show password"}
                        >
                          {showSignInPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded text-[#E31E24] focus:ring-[#E31E24] border-gray-300"
                        />
                        <span className="text-xs text-gray-600 font-medium">Keep me signed in for 30 days</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] via-[#ee252b] to-[#C1121F] text-white font-black text-sm shadow-[0_8px_25px_rgba(227,30,36,0.35)] hover:shadow-[0_10px_30px_rgba(227,30,36,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </span>
                      ) : (
                        <>
                          <span>Sign In to Dashboard</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* OTP Mobile Form */
                  <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="h-12 px-3 rounded-2xl border border-gray-200 bg-gray-50 flex items-center text-xs font-bold text-gray-700 shrink-0">
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel"
                          disabled={otpSent}
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Enter 4-Digit Security Code
                          </label>
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" /> Auto-filled demo code
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2.5">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-box-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = [...otpDigits];
                                next[idx] = val;
                                setOtpDigits(next);
                                if (val && idx < 3) {
                                  const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                                  nextInput?.focus();
                                }
                              }}
                              className="h-13 rounded-2xl border-2 border-gray-200 text-center text-xl font-bold text-gray-900 focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 outline-none transition bg-white"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span className="text-gray-500">
                            {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : "Didn't receive code?"}
                          </span>
                          {otpCountdown === 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setOtpCountdown(30);
                                toast.success("New OTP sent to mobile!");
                              }}
                              className="text-[#E31E24] font-bold hover:underline cursor-pointer"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] via-[#ee252b] to-[#C1121F] text-white font-black text-sm shadow-[0_8px_25px_rgba(227,30,36,0.35)] hover:shadow-[0_10px_30px_rgba(227,30,36,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </span>
                      ) : otpSent ? (
                        <>
                          <span>Verify & Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Send Verification OTP</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-gray-200" />
                  <span className="relative z-10 px-3 bg-[#F8FAFC] text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Instant Demo Login
                  </span>
                </div>

                {/* One-Click Demo Rider Access Button */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-between transition-all duration-200 active:scale-[0.98] shadow-2xs group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-xs">
                      <Zap className="h-4 w-4" />
                    </span>
                    <span className="text-left">
                      <span className="block text-xs font-black">One-Click Demo Rider</span>
                      <span className="block text-[10px] text-emerald-700 font-normal">
                        Pre-fills verified session (Rahul Verma · Ather 450X)
                      </span>
                    </span>
                  </span>
                  <span className="text-emerald-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </button>

                {/* Switch to Sign Up */}
                <div className="text-center pt-2 text-xs sm:text-sm text-gray-500">
                  New to RiderzPro?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </div>
              </div>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                  TAB 2: CREATE ACCOUNT (SIGN UP) FLOW
                 ───────────────────────────────────────────────────────────── */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-display">
                    Create Your EV Account
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                    Set up your EV garage, unlock verified spares, and claim{" "}
                    <span className="font-bold text-[#E31E24]">+100 ProPoints</span> loyalty bonus.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5 pt-1">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                        required
                      />
                      <User className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Mobile & Email 2-column on larger screens */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-[#E31E24]">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          name="tel"
                          autoComplete="tel"
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="10-digit mobile"
                          className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                          required
                        />
                        <Phone className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="name@mail.com"
                          className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                        />
                        <Mail className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Select Vehicle Model */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Primary Electric Vehicle <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Auto-maps parts & maintenance
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <select
                        value={signUpBikeId}
                        onChange={(e) => setSignUpBikeId(e.target.value)}
                        className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition text-gray-800 appearance-none cursor-pointer font-medium shadow-2xs"
                      >
                        <option value="">Select your EV model (e.g. Ather 450X, Ola S1...)</option>
                        {bikes.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.make} {b.model} ({b.voltage}V)
                          </option>
                        ))}
                        <option value="none">I don't own an EV yet</option>
                      </select>
                      <Bike className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <ChevronRight className="h-4.5 w-4.5 text-gray-400 absolute right-3.5 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password + Dynamic Password Strength Meter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Password <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a strong password (min. 6 chars)"
                        className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                        required
                      />
                      <Lock className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer transition"
                        aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                      >
                        {showSignUpPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>

                    {/* Real-time Strength Meter Bars */}
                    {signUpPassword.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-300",
                                passwordStrength.score >= step ? passwordStrength.color : "bg-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={cn("font-bold", passwordStrength.text)}>
                            {passwordStrength.label}
                          </span>
                          <span className="text-gray-400">Use 8+ chars, numbers & symbols</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions Agreement */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="h-4 w-4 mt-0.5 rounded text-[#E31E24] focus:ring-[#E31E24] border-gray-300 shrink-0"
                      />
                      <span className="text-xs text-gray-600 leading-snug">
                        I agree to RiderzPro's{" "}
                        <span className="text-gray-900 font-semibold underline">Terms of Service</span> and{" "}
                        <span className="text-gray-900 font-semibold underline">Privacy Policy</span>.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !agreedTerms}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] via-[#ee252b] to-[#C1121F] text-white font-black text-sm shadow-[0_8px_25px_rgba(227,30,36,0.35)] hover:shadow-[0_10px_30px_rgba(227,30,36,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </span>
                    ) : (
                      <>
                        <span>Create Account & Claim +100 Pts</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Sign In */}
                <div className="text-center pt-2 text-xs sm:text-sm text-gray-500">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Zap className="h-4 w-4 text-[#E31E24]" />
              <span>100% Genuine OEM Spares</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>Zero-Spam Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email OTP Verification Modal (Mandatory during customer signup) */}
      {isEmailOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsEmailOtpModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-red-50 text-[#E31E24] grid place-items-center mb-4">
              <Mail className="h-6 w-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
              Verify Your Email
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
              We've dispatched a 6-digit verification code to <span className="font-semibold text-gray-900">{signUpEmail}</span>. Code expires in <strong className="text-gray-800">5 minutes</strong>.
            </p>

            <form onSubmit={handleVerifyEmailOtpAndRegister} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={emailOtpCode}
                  onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full h-13 rounded-2xl border-2 border-gray-200 bg-gray-50/50 hover:border-gray-300 focus:bg-white px-4 text-center text-2xl font-mono tracking-[0.5em] font-bold text-gray-900 outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-xs"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                {emailOtpCooldown > 0 ? (
                  <span className="text-gray-400 font-medium">
                    Resend code in <strong className="text-gray-700">{emailOtpCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isResendingOtp}
                    onClick={handleResendSignupOtp}
                    className="font-bold text-[#E31E24] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isResendingOtp ? "Sending code..." : "Resend Email Code"}
                  </button>
                )}
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit SSL
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEmailOtpModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp || emailOtpCode.trim().length !== 6}
                  className="flex-1 py-3.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-xs font-bold text-white transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span>Verify & Register</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-red-50 text-[#E31E24] grid place-items-center mb-4">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-gray-900 tracking-tight font-display">
              Reset Your Password
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Enter your registered mobile number or email address. We'll send you an instant secure verification link.
            </p>

            <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="e.g. 9876543210 or rider@example.com"
                  className="w-full h-11.5 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition shadow-2xs font-medium text-gray-900"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#E31E24] hover:bg-red-700 text-xs font-bold text-white transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isForgotSubmitting ? "Sending..." : "Send Reset Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
