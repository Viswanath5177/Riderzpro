import React, { useState } from "react";
import {
  Store,
  Clock,
  MapPin,
  FileText,
  Palmtree,
  ShieldCheck,
  Upload,
  Save,
  CheckCircle2,
  Lock,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

interface SettingsSectionProps {
  vendor: Vendor;
}

export function SettingsSection({ vendor }: SettingsSectionProps) {
  const { updateVendorOnboarding } = useVendorStore();

  const [storeName, setStoreName] = useState(vendor.storeName || "");
  const [tagline, setTagline] = useState(vendor.onboarding?.store?.tagline || "");
  const [description, setDescription] = useState(vendor.onboarding?.store?.description || "");
  const [prepMins, setPrepMins] = useState(
    vendor.prepMins || vendor.onboarding?.shipping?.prepMins || 15
  );
  const [holidayMode, setHolidayMode] = useState(
    Boolean(vendor.onboarding?.store?.holidayMode)
  );

  // Address
  const [line1, setLine1] = useState(
    vendor.onboarding?.shipping?.pickupAddress?.line1 || "Indiranagar Hub"
  );
  const [city, setCity] = useState(
    vendor.onboarding?.shipping?.pickupAddress?.city || "Bengaluru"
  );
  const [pincode, setPincode] = useState(
    vendor.onboarding?.shipping?.pickupAddress?.pincode || "560038"
  );

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorOnboarding(vendor.id, {
      store: {
        ...(vendor.onboarding?.store as any),
        storeName,
        tagline,
        description,
        holidayMode,
      },
      shipping: {
        ...(vendor.onboarding?.shipping as any),
        prepMins,
        pickupAddress: {
          ...(vendor.onboarding?.shipping?.pickupAddress as any),
          line1,
          city,
          pincode,
        },
      },
    });

    toast.success(
      holidayMode
        ? "Settings saved! Holiday mode is ACTIVE (all customer listings paused)."
        : "Store profile & shipping preferences updated!"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-xl text-gray-900">
          Store Profile & Settings
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure store identity, operating hours, holiday mode, prep time, and documents center.
        </p>
      </div>

      {/* Holiday Mode Toggle Banner */}
      <div
        className={`rounded-3xl border p-5 transition shadow-2xs ${
          holidayMode ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                holidayMode ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <Palmtree className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-gray-900">Holiday Mode (Vacation Pause)</h4>
                {holidayMode && (
                  <span className="rounded-full bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                    Currently Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Temporarily pause your products from appearing in customer search and catalog while
                you take time off or manage inventory offline.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={holidayMode}
              onChange={(e) => setHolidayMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSaveStoreProfile} className="space-y-6">
        {/* Core Store Info */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
            <Store className="h-4 w-4 text-[#E31E24]" />
            Storefront Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Store Display Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Authorized EV Spares & Fast Chargers"
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Store Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Fulfilment & Pickup Address */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#E31E24]" />
            Fulfilment SLA & Pickup Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Order Prep / Handling Time (Mins)
              </label>
              <select
                value={prepMins}
                onChange={(e) => setPrepMins(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium bg-white"
              >
                <option value={10}>10 Minutes (Express Hyperlocal)</option>
                <option value={15}>15 Minutes (Standard Fast)</option>
                <option value={25}>25 Minutes</option>
                <option value={40}>40 Minutes</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Pickup Address Line 1
              </label>
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Documents Centre */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#E31E24]" />
            Statutory Documents Centre
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">GST Registration Certificate</p>
                <p className="text-[11px] text-gray-500 font-mono">
                  {vendor.onboarding?.tax?.gstin || "27AAPFU0939F1ZV"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">PAN Verification</p>
                <p className="text-[11px] text-gray-500 font-mono">
                  {vendor.onboarding?.tax?.pan || "AAPFU0939F"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
