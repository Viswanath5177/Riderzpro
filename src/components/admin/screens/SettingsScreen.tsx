import React, { useState } from "react";
import {
  Settings,
  Truck,
  Percent,
  CreditCard,
  Mail,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassSelect } from "../glass/GlassSelect";
import { toast } from "sonner";

type SettingsTab =
  | "general"
  | "delivery"
  | "commission"
  | "payments"
  | "templates"
  | "appearance";

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saving, setSaving] = useState(false);

  // General Settings
  const [platformName, setPlatformName] = useState("Riderzpro Hyperlocal EV");
  const [supportEmail, setSupportEmail] = useState("ops@riderzpro.com");
  const [supportPhone, setSupportPhone] = useState("+91 80 4910 8888");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Delivery Settings
  const [cities, setCities] = useState([
    { name: "Bengaluru", active: true, radius: 25, hubs: 8 },
    { name: "Hyderabad", active: true, radius: 20, hubs: 5 },
    { name: "Chennai", active: true, radius: 18, hubs: 4 },
    { name: "Pune", active: true, radius: 15, hubs: 3 },
    { name: "Mumbai", active: true, radius: 22, hubs: 6 },
  ]);
  const [baseFee, setBaseFee] = useState("40");
  const [perKmFee, setPerKmFee] = useState("12");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("999");
  const [maxRadius, setMaxRadius] = useState("30");

  // Commission & GST
  const [defaultCommission, setDefaultCommission] = useState("12");
  const [batteryCommission, setBatteryCommission] = useState("8");
  const [sparePartsGst, setSparePartsGst] = useState("18");
  const [evBatteryGst, setEvBatteryGst] = useState("5");
  const [panNumber, setPanNumber] = useState("AABCR4920F");
  const [gstin, setGstin] = useState("29AABCR4920F1ZT");

  // Payment Gateways
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [cashfreeEnabled, setCashfreeEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(false);
  const [settlementCycle, setSettlementCycle] = useState("T+1 Days");

  // Templates
  const [orderSmsTemplate, setOrderSmsTemplate] = useState(
    "Hi {CUSTOMER_NAME}, your Riderzpro order #{ORDER_ID} for {PRODUCT_NAME} has been dispatched with rider {RIDER_NAME} ({RIDER_PHONE}). Track: {TRACKING_URL}"
  );
  const [kycEmailTemplate, setKycEmailTemplate] = useState(
    "Hello {SELLER_NAME}, your EV parts vendor account KYC verification is completed. You are now live on Riderzpro."
  );

  // Appearance
  const [defaultTheme, setDefaultTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("crimson");
  const [glassIntensity, setGlassIntensity] = useState("high");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully", {
        description: "System configurations updated across all nodes",
      });
    }, 600);
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "delivery", label: "Delivery & Cities", icon: Truck },
    { id: "commission", label: "Commission & GST", icon: Percent },
    { id: "payments", label: "Payment Gateways", icon: CreditCard },
    { id: "templates", label: "Notifications & Templates", icon: Mail },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#111111]">
            System Settings
          </h1>
          <p className="text-sm text-[#4B5563] mt-1 font-medium">
            Configure platform policies, dispatch radii, fees, taxation and payment routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton
            variant="primary"
            icon={Save}
            loading={saving}
            onClick={handleSave}
          >
            Save All Changes
          </GlassButton>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <GlassCard className="p-3 lg:col-span-1 h-fit space-y-1 bg-white border-[#E5E7EB]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-red-50 text-[#E31E24] border border-[#E31E24]/30 shadow-xs"
                    : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#E31E24]" : "text-[#6B7280]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </GlassCard>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Platform Essentials
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  General brand identity and emergency control switches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="Platform Name"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
                <GlassInput
                  label="Operations Email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
                <GlassInput
                  label="Support Helpline"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
                <GlassSelect
                  label="Primary Timezone"
                  value="Asia/Kolkata"
                  options={[
                    { value: "Asia/Kolkata", label: "Asia/Kolkata (IST +5:30)" },
                  ]}
                  onChange={() => {}}
                />
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Maintenance Mode
                  </div>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Temporarily pause public marketplace access for scheduled upgrades.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]"></div>
                </label>
              </div>
            </GlassCard>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-6">
              <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    Delivery & Fare Matrix
                  </h3>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Hyperlocal dispatch pricing algorithm for EV spare deliveries.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <GlassInput
                    label="Base Delivery Fee (₹)"
                    type="number"
                    value={baseFee}
                    onChange={(e) => setBaseFee(e.target.value)}
                  />
                  <GlassInput
                    label="Per KM Charge (₹)"
                    type="number"
                    value={perKmFee}
                    onChange={(e) => setPerKmFee(e.target.value)}
                  />
                  <GlassInput
                    label="Free Delivery Above (₹)"
                    type="number"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  />
                  <GlassInput
                    label="Max Dispatch Radius (km)"
                    type="number"
                    value={maxRadius}
                    onChange={(e) => setMaxRadius(e.target.value)}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6 space-y-4 bg-white border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      Active Operational Cities
                    </h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      Enable or adjust maximum geofence radius for supported metro regions.
                    </p>
                  </div>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    icon={Plus}
                    onClick={() => toast.info("Contact dev ops to provision new city node")}
                  >
                    Add City
                  </GlassButton>
                </div>

                <div className="space-y-2.5">
                  {cities.map((city, idx) => (
                    <div
                      key={city.name}
                      className="p-3.5 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            city.active ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-neutral-400"
                          }`}
                        />
                        <div>
                          <div className="text-sm font-bold text-[#111111]">
                            {city.name}
                          </div>
                          <div className="text-xs text-[#4B5563] font-medium">
                            {city.hubs} Micro-fulfillment Hubs · Max {city.radius} km radius
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#4B5563] font-semibold">Radius:</span>
                          <input
                            type="number"
                            value={city.radius}
                            onChange={(e) => {
                              const updated = [...cities];
                              updated[idx].radius = Number(e.target.value);
                              setCities(updated);
                            }}
                            className="w-16 bg-white border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs text-[#111111] font-bold text-center focus:outline-none focus:border-[#E31E24]"
                          />
                          <span className="text-xs text-[#4B5563] font-semibold">km</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={city.active}
                            onChange={(e) => {
                              const updated = [...cities];
                              updated[idx].active = e.target.checked;
                              setCities(updated);
                            }}
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "commission" && (
            <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Commission Slabs & GST Compliance
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Platform take-rate deductions and Indian GST tax brackets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="Standard Seller Commission (%)"
                  type="number"
                  value={defaultCommission}
                  onChange={(e) => setDefaultCommission(e.target.value)}
                />
                <GlassInput
                  label="High-value Battery Commission (%)"
                  type="number"
                  value={batteryCommission}
                  onChange={(e) => setBatteryCommission(e.target.value)}
                />
                <GlassInput
                  label="Spare Parts GST Rate (%)"
                  type="number"
                  value={sparePartsGst}
                  onChange={(e) => setSparePartsGst(e.target.value)}
                />
                <GlassInput
                  label="EV Battery Packs GST Rate (%)"
                  type="number"
                  value={evBatteryGst}
                  onChange={(e) => setEvBatteryGst(e.target.value)}
                />
                <GlassInput
                  label="Corporate PAN"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                />
                <GlassInput
                  label="Registered GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                <strong className="font-bold text-amber-950">Tax Compliance Notice:</strong> Invoices generated for orders within Karnataka apply CGST 9% + SGST 9%. Interstate dispatches across Maharashtra or Tamil Nadu incur integrated IGST 18%.
              </div>
            </GlassCard>
          )}

          {activeTab === "payments" && (
            <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Payment Gateways & Settlement
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Configure checkout payment rails, automated escrow and payout intervals.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#111111]">
                      Razorpay PG & UPI AutoPay
                    </div>
                    <div className="text-xs text-[#4B5563] font-medium">
                      Primary gateway for Cards, UPI, Netbanking and Cred
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={razorpayEnabled}
                      onChange={(e) => setRazorpayEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#111111]">
                      Cashfree Payouts API
                    </div>
                    <div className="text-xs text-[#4B5563] font-medium">
                      Automated instant IMPS/NEFT transfers to sellers and riders
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={cashfreeEnabled}
                      onChange={(e) => setCashfreeEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#111111]">
                      Cash on Delivery (COD)
                    </div>
                    <div className="text-xs text-[#4B5563] font-medium">
                      Restricted to orders under ₹3,000 to minimize return friction
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={codEnabled}
                      onChange={(e) => setCodEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="pt-2">
                  <GlassSelect
                    label="Vendor Payout Settlement Schedule"
                    value={settlementCycle}
                    options={[
                      { value: "Instant", label: "Instant (Upon Delivery Confirmed)" },
                      { value: "T+1 Days", label: "T+1 Business Days (Recommended)" },
                      { value: "T+3 Days", label: "T+3 Business Days" },
                      { value: "Weekly", label: "Weekly Batch Settlement" },
                    ]}
                    onChange={(e) => setSettlementCycle(e.target.value)}
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "templates" && (
            <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Automated Messaging Templates
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  DLT approved SMS headers and automated customer notification content.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase">
                    Order Dispatch SMS (DLT Header: RZPRO)
                  </label>
                  <textarea
                    rows={3}
                    value={orderSmsTemplate}
                    onChange={(e) => setOrderSmsTemplate(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E31E24] font-mono leading-relaxed shadow-xs"
                  />
                  <span className="text-[11px] text-[#6B7280]">
                    Variables: {"{CUSTOMER_NAME}"}, {"{ORDER_ID}"},{" "}
                    {"{PRODUCT_NAME}"}, {"{RIDER_NAME}"}, {"{RIDER_PHONE}"},{" "}
                    {"{TRACKING_URL}"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase">
                    Seller KYC Approval Notification Email
                  </label>
                  <textarea
                    rows={3}
                    value={kycEmailTemplate}
                    onChange={(e) => setKycEmailTemplate(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E31E24] font-mono leading-relaxed shadow-xs"
                  />
                  <span className="text-[11px] text-[#6B7280]">
                    Variables: {"{SELLER_NAME}"}, {"{COMMISSION_RATE}"}
                  </span>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "appearance" && (
            <GlassCard className="p-6 space-y-6 bg-white border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Console UI & Brand Preferences
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Fine-tune brand accents and contrast ratios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassSelect
                  label="Default Theme"
                  value={defaultTheme}
                  options={[
                    { value: "light", label: "Riderzpro Crisp White (Active)" },
                    { value: "dark", label: "Dark Glass Console" },
                  ]}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                />

                <GlassSelect
                  label="Accent Color Palette"
                  value={accentColor}
                  options={[
                    { value: "crimson", label: "Riderzpro Red (#E31E24)" },
                    { value: "orange", label: "Hyper Electric Orange" },
                    { value: "violet", label: "Cyber Violet" },
                  ]}
                  onChange={(e) => setAccentColor(e.target.value)}
                />

                <GlassSelect
                  label="Card Surface Elevation"
                  value={glassIntensity}
                  options={[
                    { value: "high", label: "High Definition Clean Border" },
                    { value: "medium", label: "Subtle Shadow Frost" },
                    { value: "low", label: "Flat Minimal" },
                  ]}
                  onChange={(e) => setGlassIntensity(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-gray-50/70 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#111111]">
                    Reduced Motion Mode
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    Honors system accessibility setting by disabling background animations.
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-white border border-[#E5E7EB] text-[#374151]">
                  Auto-detected
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
