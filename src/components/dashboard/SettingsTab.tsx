import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Check,
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
  Sparkles,
  Camera,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { inr, getBike } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SettingsTab() {
  const { userProfile, updateUserProfile, garage, orders } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<"personal" | "addresses" | "garage" | "notifications" | "security">("personal");

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [city, setCity] = useState(userProfile.city);
  const [secondaryAddress, setSecondaryAddress] = useState("WeWork Galaxy, 43 Residency Rd, Shanthala Nagar, Bengaluru, Karnataka 560025");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 94480 12345");
  const [deliveryInstruction, setDeliveryInstruction] = useState("Call upon arrival for OTP. Leave with front gate security if unavailable.");

  // Preferences toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [recallsAlerts, setRecallsAlerts] = useState(true);
  const [telemetrySync, setTelemetrySync] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUserProfile({
        name,
        email,
        phone,
        address,
        city,
      });
      setIsSaving(false);
      toast.success("Profile & Account preferences updated successfully!");
    }, 400);
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AS";

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO PROFILE BANNER (APPLE GLASSMORPHIC THEME)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-white/85 backdrop-blur-2xl backdrop-saturate-180 p-6 sm:p-8 text-gray-950 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
        {/* Apple Specular Top Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

        {/* Multi-layered Apple ambient illumination glows */}
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#E31E24]/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#E31E24]/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-rose-500/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl bg-[#E31E24] text-white font-black text-2xl sm:text-3xl shadow-[0_12px_32px_rgba(227,30,36,0.4)] ring-4 ring-white">
                {initials}
              </div>
              <button
                type="button"
                onClick={() => toast.info("Profile photo upload: In demo mode, avatar is generated from initials.")}
                className="absolute -bottom-1 -right-1 grid h-7.5 w-7.5 place-items-center rounded-full bg-white text-[#E31E24] shadow-md hover:bg-red-50 hover:scale-110 active:scale-95 transition cursor-pointer border border-black/[0.08]"
                title="Change Avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                  {name || "Aakash Sharma"}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24] border border-red-200 shadow-2xs backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#E31E24]" />
                  <span>Verified EV Rider</span>
                </span>
              </div>

              <p className="text-xs text-gray-500 font-medium flex flex-wrap items-center gap-2">
                <span>{email || "aakash.sharma@example.com"}</span>
                <span className="text-gray-300">·</span>
                <span>{phone || "+91 98765 43210"}</span>
                <span className="text-gray-300">·</span>
                <span>{city || "Bengaluru, KA"}</span>
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24] border border-red-200 shadow-2xs backdrop-blur-sm">
                  <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                  <span>Gold Tier Member · {userProfile.points || 450} ProPoints</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  (50 pts to Platinum EV Specialist)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tier Progress Bar & Action (Red Theme) */}
          <div className="md:w-80 space-y-2.5 rounded-2xl bg-white/90 hover:bg-white p-4 border border-red-100 shadow-2xs backdrop-blur-md transition-all duration-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-900 font-bold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#E31E24]" />
                Loyalty Tier Progress
              </span>
              <span className="font-black text-white bg-[#E31E24] px-2.5 py-0.5 rounded-md text-[11px] shadow-xs">
                90%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-red-50 overflow-hidden border border-red-200/60 p-0.5">
              <div className="h-full rounded-full bg-[#E31E24] shadow-[0_0_10px_rgba(227,30,36,0.4)]" style={{ width: "90%" }} />
            </div>
            <p className="text-[11px] text-gray-500 leading-snug font-medium">
              Earn 10 pts per ₹1,000 order to unlock free doorstep technician visits.
            </p>
          </div>
        </div>

        {/* 4 Bottom Metric Tiles */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 border-t border-black/[0.06]">
          {/* Card 1: Total Orders */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Total Orders</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-[#E31E24] transition-colors">
                <Package className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{orders.length}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              ✓ 100% On-time
            </span>
          </div>

          {/* Card 2: EVs in Garage */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">EVs in Garage</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-blue-600 transition-colors">
                <Bike className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{garage.length}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              ⚡ Telemetry Connected
            </span>
          </div>

          {/* Card 3: Spare Parts Invested */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Spare Parts Invested</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-amber-600 transition-colors">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">{inr(totalSpent || 20109)}</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              🛡️ OEM Verified
            </span>
          </div>

          {/* Card 4: Saved Addresses */}
          <div className="rounded-2xl bg-white/80 hover:bg-white p-4 border border-black/[0.06] hover:border-black/[0.12] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md group">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Saved Addresses</p>
              <div className="h-7 w-7 rounded-xl bg-black/[0.03] grid place-items-center text-gray-500 group-hover:text-emerald-600 transition-colors">
                <MapPin className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-1.5 tracking-tight">2</p>
            <span className="inline-block mt-1.5 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              📍 Doorstep Ready
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUB-NAVIGATION TABS
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
          3. TAB CONTENT
         ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Personal & Contact */}
        {activeSubTab === "personal" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-display">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Primary customer identity used for invoices and courier dispatches.</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>KYC Verified</span>
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                      required
                    />
                    <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Primary Phone (Delivery OTPs)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                      required
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address (Tax Invoices)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                      required
                    />
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Emergency Backup Contact
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                    />
                    <Smartphone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Verified Documents Section */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Verified Identity & Motor Documents
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-gray-900">Driving License</p>
                        <p className="text-[11px] text-gray-500 font-mono">DL-0420210084920</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded text-[10px]">
                      Verified ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-gray-900">Vehicle RC Status</p>
                        <p className="text-[11px] text-gray-500 font-mono">KA-01-EQ-4421</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded text-[10px]">
                      Active Link ✓
                    </span>
                  </div>
                </div>
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
                  <h2 className="text-base font-bold text-gray-900 font-display">Saved Doorstep Delivery Addresses</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Rider partners use these geocoded addresses for rapid doorstep delivery.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("New address modal: You can customize the primary and secondary delivery destinations below.")}
                  className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#E31E24] hover:bg-red-100 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Location</span>
                </button>
              </div>

              {/* Address 1: Primary Home */}
              <div className="p-4 rounded-2xl border-2 border-red-200 bg-red-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E31E24] text-white text-xs font-bold">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <p className="font-bold text-xs text-gray-900">Primary Home Address (Default Delivery)</p>
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
                    placeholder="Street, Flat, Landmark..."
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
                      defaultValue="560103"
                      placeholder="PIN Code"
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Address 2: Work/Office */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-200 text-gray-700 text-xs font-bold">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <p className="font-bold text-xs text-gray-900">Workplace / Office Address</p>
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
                  placeholder="Office street, floor, tech park..."
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
                  placeholder="e.g. Call before arrival, leave with security guard..."
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
                            <p className="text-[10px] text-gray-500 font-mono">Reg: {g.regNo || "KA 01 EQ 4421"}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                          {g.batteryHealth ?? 92}% Health
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400">Odometer:</span>
                          <span className="font-bold text-gray-800 ml-1">{(g.odoKm ?? 4820).toLocaleString()} km</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Next Service:</span>
                          <span className="font-bold text-emerald-600 ml-1">In {g.nextServiceDays ?? 45} days</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Automated Telemetry Diagnostics Toggle */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#E31E24]" />
                    <span className="text-xs font-bold text-gray-900">
                      Live Battery & Motor Telemetry Sync
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={telemetrySync}
                      onChange={(e) => setTelemetrySync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
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
                <h2 className="text-base font-bold text-gray-900 font-display">Communication & Dispatch Alerts</h2>
                <p className="text-xs text-gray-500 mt-0.5">Select how and when you receive real-time courier and order updates.</p>
              </div>

              <div className="space-y-4">
                {/* SMS OTP */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Live SMS Dispatch Alerts & Courier Arrival OTPs</p>
                    <p className="text-[11px] text-gray-500">Sent to {phone} when rider departs supplier hub and reaches doorstep.</p>
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

                {/* WhatsApp Invoices */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">WhatsApp Delivery Updates & Digital Tax Receipts</p>
                    <p className="text-[11px] text-gray-500">Instant PDF invoice download and live GPS map tracking link via WhatsApp.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E31E24]" />
                  </label>
                </div>

                {/* Email Invoices */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Email GST Tax Invoices & Warranty Certificates</p>
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
                    <p className="text-xs font-bold text-gray-900">OEM Safety Advisories & Battery Recalls</p>
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
                <h2 className="text-base font-bold text-gray-900 font-display">Account Security & Credentials</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage authentication, 2-factor protection, and active device logins.</p>
              </div>

              <div className="space-y-4">
                {/* 2FA */}
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-gray-600">Requires 6-digit SMS OTP verification during new logins and high-value orders.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                {/* Active Sessions */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active Authorized Session</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="h-4 w-4 text-[#E31E24]" />
                      <div>
                        <p className="font-bold text-gray-900">Chrome on Windows 11</p>
                        <p className="text-[11px] text-gray-500">Bengaluru, India · IP 152.58.x.x (Active Now)</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      Current Device
                    </span>
                  </div>
                </div>

                {/* Password Change Action */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Account Password</p>
                    <p className="text-[11px] text-gray-500">Last changed 28 days ago.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success("Password reset link sent to your registered email.")}
                    className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            4. SAVE BAR
           ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <p className="text-xs text-gray-500">
            Changes will take effect immediately across all orders and delivery partner manifests.
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
    </div>
  );
}
