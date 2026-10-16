import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
  Zap,
  Bell,
  Smartphone,
  Award,
  Plus,
  Bike,
  CheckCircle2,
  Lock,
  Camera,
  Package,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { inr, getBike } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SettingsTab() {
  const { userProfile, updateUserProfile, garage, orders, signOut: storeSignOut, setUserLocation } = useStore();
  const { signOut: authSignOut } = useAuth();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    toast.info("Signing out...", { duration: 1500 });
    try {
      storeSignOut();
      await authSignOut();
    } catch (e) {
      console.warn("Signout error:", e);
    } finally {
      try {
        localStorage.removeItem("riderzpro_auth_user");
        localStorage.removeItem("riderzpro_auth_token");
        localStorage.removeItem("riderzpro_token");
        localStorage.removeItem("riderzpro_admin_session");
        localStorage.removeItem("riderzpro_seller_store_confirmed");
        localStorage.removeItem("riderzpro-v7");
        localStorage.removeItem("riderzpro_active_bike");
        sessionStorage.clear();
      } catch {}
      window.location.href = "/";
    }
  };

  const [activeSubTab, setActiveSubTab] = useState<"personal" | "addresses" | "garage" | "notifications" | "security">("personal");

  const [name, setName] = useState(userProfile.name || "User");
  const [email, setEmail] = useState(userProfile.email || "");
  const [phone, setPhone] = useState(userProfile.phone || "");
  const [address, setAddress] = useState(userProfile.address || "");
  const [city, setCity] = useState(userProfile.city || "");
  const [pincode, setPincode] = useState("560001");
  const [secondaryAddress, setSecondaryAddress] = useState("");
  const [deliveryInstruction, setDeliveryInstruction] = useState("");

  // Password & Security State
  const [hasPassword, setHasPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);

  // Preferences toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [recallsAlerts, setRecallsAlerts] = useState(true);
  const [telemetrySync, setTelemetrySync] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  // Sync profile & addresses directly from database on mount
  useEffect(() => {
    fetch("/api/customer/profile", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.profile) {
          setName(d.profile.name || "User");
          setEmail(d.profile.email || "");
          setPhone(d.profile.phone || "");
          if (d.profile.address) setAddress(d.profile.address);
          if (d.profile.city) setCity(d.profile.city);
          setHasPassword(Boolean(d.profile.hasPassword));
        }
      })
      .catch(() => {});

    fetch("/api/customer/addresses", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const def = d.data.find((a: any) => a.is_default) || d.data[0];
          if (def) {
            if (def.street_address) setAddress(def.street_address);
            if (def.city) setCity(def.city);
            if (def.pincode) setPincode(def.pincode);
            if (def.delivery_instructions) setDeliveryInstruction(def.delivery_instructions);
          }
          const secondary = d.data.find((a: any) => !a.is_default || a.label?.toLowerCase() === "work");
          if (secondary && secondary.id !== def?.id) {
            setSecondaryAddress(secondary.street_address || "");
          }
        }
      })
      .catch(() => {});
  }, []);

  // OTP countdown timer
  useEffect(() => {
    let timer: any = null;
    if (otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((c) => Math.max(0, c - 1)), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpCountdown]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const cleanName = name.trim() || "User";
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanPincode = pincode.trim() || "560001";

    // 1. Update client state
    updateUserProfile({
      name: cleanName,
      phone: cleanPhone,
      address: cleanAddress,
      city: cleanCity,
    });

    try {
      // 2. Persist to customer profile
      await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          address: cleanAddress,
          city: cleanCity,
        }),
      });

      // 3. Save / Upsert primary delivery address in PostgreSQL customer_addresses
      if (cleanAddress) {
        await fetch("/api/customer/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: cleanName,
            phone: cleanPhone || "9876543210",
            streetLocality: cleanAddress,
            city: cleanCity || "Bengaluru",
            state: "Karnataka",
            pincode: cleanPincode,
            label: "Home",
            deliveryInstructions: deliveryInstruction.trim(),
            isDefault: true,
            upsertByLabel: true,
          }),
        });

        // 4. Update site-wide location badge on top immediately
        setUserLocation({
          id: `addr_primary_${Date.now()}`,
          name: cleanAddress,
          city: cleanCity || "Bengaluru",
          pincode: cleanPincode,
          lat: 12.9716,
          lng: 77.5946,
          tag: "Home (Primary)",
        });
      }

      // 5. If secondary address is provided, save it too
      if (secondaryAddress.trim()) {
        await fetch("/api/customer/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: cleanName,
            phone: cleanPhone || "9876543210",
            streetLocality: secondaryAddress.trim(),
            city: cleanCity || "Bengaluru",
            state: "Karnataka",
            pincode: cleanPincode,
            label: "Work",
            isDefault: false,
            upsertByLabel: true,
          }),
        });
      }

      toast.success("Profile & Delivery Addresses saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Send OTP for password creation/change
  const handleSendPasswordOtp = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordModalError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordModalError("Passwords do not match.");
      return;
    }

    setPasswordModalError(null);
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/customer/send-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setOtpSent(true);
      setOtpCountdown(60);
      toast.success(`6-digit confirmation code dispatched to ${email}`);
    } catch (err: any) {
      setPasswordModalError(err.message || "Failed to send code.");
      toast.error(err.message || "Failed to send code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Confirm OTP and save password
  const handleConfirmSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setPasswordModalError("Please enter the 6-digit code received in your email.");
      return;
    }

    setPasswordModalError(null);
    setIsSettingPassword(true);
    try {
      const res = await fetch("/api/customer/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: newPassword,
          otpCode: otpCode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm password.");
      }

      setHasPassword(true);
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setOtpSent(false);
      toast.success("Account password set and verified successfully!");
    } catch (err: any) {
      setPasswordModalError(err.message || "Password confirmation failed.");
      toast.error(err.message || "Password confirmation failed.");
    } finally {
      setIsSettingPassword(false);
    }
  };

  const initials = name && name.trim()
    ? name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl">
      {/* ─────────────────────────────────────────────────────────────
          1. PASSWORD SETUP PROMPT (If password is empty)
         ───────────────────────────────────────────────────────────── */}
      {!hasPassword && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white grid place-items-center shrink-0 shadow-sm">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Account Password Not Set
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                You currently sign in using Email OTP. Would you like to set a password for quick logins? Requires a quick email OTP confirmation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPasswordModalError(null);
              setOtpSent(false);
              setOtpCode("");
              setNewPassword("");
              setConfirmPassword("");
              setIsPasswordModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shrink-0 transition shadow-xs cursor-pointer"
          >
            Set Account Password
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. HERO PROFILE BANNER (APPLE GLASSMORPHIC THEME)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-white/85 backdrop-blur-2xl backdrop-saturate-180 p-6 sm:p-8 text-gray-950 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
        {/* Apple Specular Top Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

        {/* Ambient illumination glows */}
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#E31E24]/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#E31E24]/[0.05] blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl bg-[#E31E24] text-white font-black text-2xl sm:text-3xl shadow-[0_12px_32px_rgba(227,30,36,0.4)] ring-4 ring-white">
                {initials}
              </div>
              <button
                type="button"
                onClick={() => toast.info("Profile photo upload: avatar is generated from initials.")}
                className="absolute -bottom-1 -right-1 grid h-7.5 w-7.5 place-items-center rounded-full bg-white text-[#E31E24] shadow-md hover:bg-red-50 hover:scale-110 active:scale-95 transition cursor-pointer border border-black/[0.08]"
                title="Change Avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                  {name || "User"}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24] border border-red-200 shadow-2xs backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#E31E24]" />
                  <span>Verified Customer</span>
                </span>
              </div>

              <p className="text-xs text-gray-500 font-medium flex flex-wrap items-center gap-2">
                <span>{email || "No email"}</span>
                {phone ? (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>{phone}</span>
                  </>
                ) : null}
                {city ? (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>{city}</span>
                  </>
                ) : null}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24] border border-red-200 shadow-2xs backdrop-blur-sm">
                  <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                  <span>Member · {userProfile.points || 0} ProPoints</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {hasPassword ? "Password protected ✓" : "Email OTP access"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tier Progress Bar */}
          <div className="md:w-80 space-y-2.5 rounded-2xl bg-white/90 hover:bg-white p-4 border border-red-100 shadow-2xs backdrop-blur-md transition-all duration-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-900 font-bold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                Loyalty Tier Status
              </span>
              <span className="font-black text-white bg-[#E31E24] px-2.5 py-0.5 rounded-md text-[11px] shadow-xs">
                Active
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-red-50 overflow-hidden border border-red-200/60 p-0.5">
              <div className="h-full rounded-full bg-[#E31E24]" style={{ width: `${Math.min(100, Math.max(10, (userProfile.points || 0) / 10))}%` }} />
            </div>
            <p className="text-[11px] text-gray-500 leading-snug font-medium">
              Earn 10 points per ₹1,000 order to unlock discounts & certified doorstep support.
            </p>
          </div>
        </div>

        {/* 4 Bottom Metric Tiles */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 border-t border-black/[0.06]">
          {/* Card 1: Total Orders */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Total Orders</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-[#E31E24] transition-colors">
                <Package className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{orders.length}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Verified
            </span>
          </div>

          {/* Card 2: EVs in Garage */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">EVs in Garage</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-blue-600 transition-colors">
                <Bike className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{garage.length}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              ⚡ Fitment Ready
            </span>
          </div>

          {/* Card 3: Spare Parts Invested */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Order Investment</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-amber-600 transition-colors">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{inr(totalSpent)}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              🛡️ OEM Verified
            </span>
          </div>

          {/* Card 4: Delivery Location */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Saved Address</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-emerald-600 transition-colors">
                <MapPin className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">
              {address ? "1" : "0"}
            </p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              {city || "Set Location"}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SUB-NAVIGATION TABS
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {[
          { id: "personal", label: "Personal & Contact", icon: User },
          { id: "addresses", label: "Delivery Addresses", icon: MapPin },
          { id: "garage", label: "Registered Vehicles", icon: Bike },
          { id: "notifications", label: "Dispatch Alerts", icon: Bell },
          { id: "security", label: "Security & Login", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer",
                isActive
                  ? "bg-[#E31E24] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT
         ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Personal & Contact */}
        {activeSubTab === "personal" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-display">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Primary customer identity used for invoices and courier delivery.</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Authenticated</span>
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                      required
                    />
                    <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Defaults to &quot;User&quot; until you set your preferred name.
                  </p>
                </div>

                {/* Email Address — PERMANENTLY FROZEN */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email Address (Permanent &amp; Verified)
                    </label>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="h-3 w-3 text-gray-400" />
                      <span>Locked</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="w-full h-11 rounded-2xl border border-gray-200 bg-gray-100/80 px-3.5 pl-10 text-sm text-gray-500 cursor-not-allowed outline-none select-none font-medium"
                    />
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Email address is verified upon sign in and cannot be edited.
                  </p>
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Primary Phone (Delivery OTPs)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* City & State */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    City &amp; Region
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru, Karnataka"
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                    />
                    <MapPin className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Default Street Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, Street name, Landmark, Postal code..."
                  className="w-full rounded-2xl border border-gray-300 p-3 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Delivery Addresses */}
        {activeSubTab === "addresses" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-display">Saved Delivery Destinations</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Addresses used for courier deliveries and technician home visits.</p>
                </div>
              </div>

              {/* Address 1: Primary Home */}
              <div className="p-4 rounded-2xl border-2 border-red-200 bg-red-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E31E24] text-white text-xs font-bold">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <p className="font-bold text-xs text-gray-900">Primary Delivery Address</p>
                  </div>
                  <span className="rounded-full bg-[#E31E24] text-white px-2 py-0.5 text-[10px] font-bold">
                    Primary
                  </span>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs outline-none focus:border-[#E31E24] bg-white"
                    placeholder="Enter primary address..."
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City & State"
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Address 2: Secondary / Workplace */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-200 text-gray-700 text-xs font-bold">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <p className="font-bold text-xs text-gray-900">Secondary / Workplace Address (Optional)</p>
                  </div>
                  <span className="rounded-full bg-gray-200 text-gray-700 px-2 py-0.5 text-[10px] font-bold">
                    Secondary
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={secondaryAddress}
                  onChange={(e) => setSecondaryAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs outline-none focus:border-[#E31E24] bg-white"
                  placeholder="Optional secondary address (e.g. office, workshop)..."
                />
              </div>

              {/* Delivery Instructions */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Standard Delivery Partner Instructions
                </label>
                <input
                  type="text"
                  value={deliveryInstruction}
                  onChange={(e) => setDeliveryInstruction(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] bg-white"
                  placeholder="e.g. Call before arrival, leave at security..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Registered EV Vehicles */}
        {activeSubTab === "garage" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-display">Registered Electric Vehicles</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Vehicles synced to your account for fitment verification and spare parts matching.</p>
                </div>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                  {garage.length} Registered
                </span>
              </div>

              {garage.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200">
                  <Bike className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">No Vehicles Registered Yet</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Add your EV in the Garage tab to get exact-fit part recommendations.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {garage.map((g) => {
                    const bMeta = getBike(g.bikeId);
                    return (
                      <div
                        key={g.bikeId}
                        className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                              <Bike className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="font-bold text-xs text-gray-900">{bMeta ? `${bMeta.make} ${bMeta.model}` : g.nickname || g.bikeId}</p>
                              <p className="text-[10px] text-gray-500 font-mono">Reg: {g.regNo || "Verified"}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                            {g.batteryHealth ?? 95}% Health
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Automated Telemetry Diagnostics Toggle */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#E31E24]" />
                    <span className="text-xs font-bold text-gray-900">
                      Live Battery &amp; Motor Telemetry Sync
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={telemetrySync}
                      onChange={(e) => setTelemetrySync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
                  </label>
                </div>
                <p className="text-[11px] text-gray-500">
                  Allow RiderzPro to monitor battery cell degradation and recommend verified replacement parts before critical wear.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Communication & Dispatch Alerts */}
        {activeSubTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 font-display">Communication &amp; Dispatch Alerts</h2>
                <p className="text-xs text-gray-500 mt-0.5">Select how and when you receive real-time courier and order updates.</p>
              </div>

              <div className="space-y-4">
                {/* SMS Alerts */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Live SMS Dispatch Alerts &amp; Delivery OTPs</p>
                    <p className="text-[11px] text-gray-500">Sent when courier departs supplier hub and reaches doorstep.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
                  </label>
                </div>

                {/* Email Invoices */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Email GST Tax Invoices &amp; Warranty Certificates</p>
                    <p className="text-[11px] text-gray-500">Sent to {email} upon delivery sign-off.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={emailInvoices}
                      onChange={(e) => setEmailInvoices(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
                  </label>
                </div>

                {/* Safety Advisories */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">OEM Safety Advisories &amp; Battery Recalls</p>
                    <p className="text-[11px] text-gray-500">Priority security broadcast if your registered vehicle has a mandatory technical advisory.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={recallsAlerts}
                      onChange={(e) => setRecallsAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Security & Login */}
        {activeSubTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 font-display">Account Security &amp; Credentials</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage authentication, email OTP confirmation, and password credentials.</p>
              </div>

              <div className="space-y-4">
                {/* Password Status Card */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("grid h-10 w-10 place-items-center rounded-xl shrink-0 font-bold", hasPassword ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {hasPassword ? "Account Password: Active" : "No Password Set (OTP-Only Sign In)"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {hasPassword
                          ? "Your account is secured with a password and email OTP backup."
                          : "You currently sign in using 6-digit email OTPs. You can set a password with OTP confirmation."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordModalError(null);
                      setOtpSent(false);
                      setOtpCode("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setIsPasswordModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-semibold shrink-0 transition shadow-xs cursor-pointer"
                  >
                    {hasPassword ? "Change Password" : "Set Account Password"}
                  </button>
                </div>

                {/* 2FA Card */}
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Email OTP Security</p>
                      <p className="text-[11px] text-gray-600">Requires verified 6-digit email OTP codes for password changes and passwordless sign in.</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded text-[11px]">
                    Enabled ✓
                  </span>
                </div>

                {/* Session & Sign Out Card */}
                <div className="p-4 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-[#E31E24] shrink-0 font-bold">
                      <LogOut className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Active Account Session</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        End your session and sign out of your account on this device.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="px-4 py-2 rounded-xl bg-[#E31E24] hover:bg-red-700 active:scale-95 text-white text-xs font-bold shrink-0 transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            5. SAVE BAR
           ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <p className="text-xs text-gray-500">
            Changes will be saved directly to your account profile. Email remains permanently locked.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ─────────────────────────────────────────────────────────────
          6. SET/CHANGE PASSWORD MODAL WITH EMAIL OTP VERIFICATION
         ───────────────────────────────────────────────────────────── */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPasswordModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-red-100 text-[#E31E24] grid place-items-center mb-3">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-gray-950">
                {hasPassword ? "Change Password" : "Set Account Password"}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                To secure your account, a 6-digit confirmation code will be sent to{" "}
                <span className="font-semibold text-gray-800">{email}</span>.
              </p>
            </div>

            {passwordModalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{passwordModalError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pr-10 text-sm outline-none focus:border-[#E31E24]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-11 rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-[#E31E24]"
                />
              </div>

              {/* Step 2: Request OTP or Enter OTP */}
              {!otpSent ? (
                <button
                  type="button"
                  disabled={isSendingOtp || !newPassword || newPassword !== confirmPassword}
                  onClick={handleSendPasswordOtp}
                  className="w-full h-12 rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Dispatching Security OTP...</span>
                    </>
                  ) : (
                    <span>Send Email OTP to Confirm</span>
                  )}
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        6-Digit Email OTP
                      </label>
                      <button
                        type="button"
                        disabled={otpCountdown > 0 || isSendingOtp}
                        onClick={handleSendPasswordOtp}
                        className="text-xs text-[#E31E24] hover:underline font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Resend code"}
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="• • • • • •"
                      className="w-full h-12 text-center text-xl font-mono font-bold tracking-[0.4em] rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#E31E24] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSettingPassword || otpCode.length !== 6}
                    className="w-full h-12 rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSettingPassword ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Verifying &amp; Saving...</span>
                      </>
                    ) : (
                      <span>Confirm &amp; Save Password</span>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
