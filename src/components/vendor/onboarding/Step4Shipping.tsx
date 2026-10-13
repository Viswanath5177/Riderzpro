import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Truck,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor } from "@/lib/vendor/types";
import { vendorShippingSchema } from "@/lib/vendor/validators";
import { pincodeAdapter } from "@/lib/vendor/adapters/pincode";

interface Step4ShippingProps {
  vendor: Vendor;
  onBack: () => void;
  onSaveAndNext: (data: any) => void;
}

export function Step4Shipping({ vendor, onBack, onSaveAndNext }: Step4ShippingProps) {
  const defaultShipping = vendor.onboarding.shipping;

  const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);
  const [sellsLiIon, setSellsLiIon] = useState(defaultShipping?.sellsLiIon ?? true);
  const [unDeclared, setUnDeclared] = useState(defaultShipping?.un38_3Declared ?? true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorShippingSchema),
    defaultValues: {
      pickupAddress: {
        line1: defaultShipping?.pickupAddress?.line1 || "Plot 42, 100ft Road, HAL 2nd Stage",
        line2: defaultShipping?.pickupAddress?.line2 || "",
        landmark: defaultShipping?.pickupAddress?.landmark || "Near Metro Station",
        pincode: defaultShipping?.pickupAddress?.pincode || "560038",
        city: defaultShipping?.pickupAddress?.city || "Bengaluru",
        state: defaultShipping?.pickupAddress?.state || "Karnataka",
        lat: defaultShipping?.pickupAddress?.lat || 12.9784,
        lng: defaultShipping?.pickupAddress?.lng || 77.6408,
      },
      contactName: defaultShipping?.contactName || vendor.onboarding.account.fullName || "Store Dispatcher",
      contactPhone: defaultShipping?.contactPhone || vendor.phone || "9000000001",
      handlingTimeMins: defaultShipping?.handlingTimeMins || 15,
      fulfillmentMode: defaultShipping?.fulfillmentMode || "hyperlocal",
      serviceableRadiusKm: defaultShipping?.serviceableRadiusKm || 25,
      acceptsCod: defaultShipping?.acceptsCod ?? true,
      returnWindowDays: defaultShipping?.returnWindowDays ?? 10,
      returnAddressSameAsPickup: defaultShipping?.returnAddressSameAsPickup ?? true,
      sellsLiIon: sellsLiIon,
      un38_3Declared: unDeclared,
    },
  });

  const pincodeVal = watch("pickupAddress.pincode");

  const handlePincodeBlur = async (code: string) => {
    if (code && code.trim().length === 6) {
      setPincodeLookupLoading(true);
      try {
        const res = await pincodeAdapter.lookup(code);
        setValue("pickupAddress.city", res.city);
        setValue("pickupAddress.state", res.state);
        setValue("pickupAddress.lat", res.lat);
        setValue("pickupAddress.lng", res.lng);
        toast.success(`Location set: ${res.area}, ${res.city}`);
      } catch (e: any) {
        toast.error("Invalid pincode");
      } finally {
        setPincodeLookupLoading(false);
      }
    }
  };

  const onSubmit = (formData: any) => {
    if (sellsLiIon && !unDeclared) {
      toast.error("You must declare packaging compliance (UN38.3) for Li-ion battery logistics");
      return;
    }

    onSaveAndNext({
      shipping: {
        ...formData,
        sellsLiIon,
        un38_3Declared: unDeclared,
        workingHours: defaultShipping?.workingHours || {
          monday: { open: "09:00", close: "19:00" },
          tuesday: { open: "09:00", close: "19:00" },
          wednesday: { open: "09:00", close: "19:00" },
          thursday: { open: "09:00", close: "19:00" },
          friday: { open: "09:00", close: "19:00" },
          saturday: { open: "09:00", close: "19:00" },
        },
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 4 of 6</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
          Shipping Preferences & Pickup Hub
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your dispatch address and handling prep time directly calculate live customer delivery fee and rider ETA.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Pickup Address Form */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Warehouse / Shop Dispatch Address</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Pincode (Auto-fills City & GPS)
              </label>
              <input
                type="text"
                maxLength={6}
                {...register("pickupAddress.pincode")}
                onBlur={(e) => handlePincodeBlur(e.target.value)}
                placeholder="560038"
                className="w-full font-mono font-bold rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
              />
              {errors.pickupAddress?.pincode && (
                <p className="text-[10px] text-destructive mt-0.5">
                  {errors.pickupAddress.pincode.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">City</label>
              <input
                type="text"
                {...register("pickupAddress.city")}
                placeholder="Bengaluru"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">State</label>
              <input
                type="text"
                {...register("pickupAddress.state")}
                placeholder="Karnataka"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Address Line 1 (Building, Street, Unit No.)
            </label>
            <input
              type="text"
              {...register("pickupAddress.line1")}
              placeholder="e.g. 42, 100 Feet Road, Indiranagar"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            {errors.pickupAddress?.line1 && (
              <p className="text-[10px] text-destructive mt-0.5">
                {errors.pickupAddress.line1.message as string}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                {...register("pickupAddress.landmark")}
                placeholder="e.g. Opposite Metro Pillar 42"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Coordinates (Lat / Lng)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  {...register("pickupAddress.lat", { valueAsNumber: true })}
                  className="w-1/2 rounded-xl border border-border bg-muted px-2.5 py-1.5 text-[11px] font-mono"
                />
                <input
                  type="number"
                  step="any"
                  {...register("pickupAddress.lng", { valueAsNumber: true })}
                  className="w-1/2 rounded-xl border border-border bg-muted px-2.5 py-1.5 text-[11px] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Contact & Prep Time */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Dispatch Contact Name
            </label>
            <input
              type="text"
              {...register("contactName")}
              placeholder="e.g. Store Manager"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Dispatch Phone (+91)
            </label>
            <input
              type="tel"
              maxLength={10}
              {...register("contactPhone")}
              placeholder="9876543210"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Prep Time (Minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                min={5}
                max={180}
                {...register("handlingTimeMins", { valueAsNumber: true })}
                placeholder="15"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary font-bold"
              />
              <Clock className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Calculates order ETA</p>
          </div>
        </div>

        {/* Fulfillment Mode & Radius */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Fulfilment Mode
            </label>
            <select
              {...register("fulfillmentMode")}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer"
            >
              <option value="hyperlocal">RiderzPro rider pickup (Hyperlocal EV Delivery)</option>
              <option value="courier">I ship via my own courier (Surface / Air)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Serviceable Hyperlocal Radius
            </label>
            <select
              {...register("serviceableRadiusKm", { valueAsNumber: true })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer"
            >
              <option value={10}>10 km radius</option>
              <option value={15}>15 km radius</option>
              <option value={20}>20 km radius</option>
              <option value={25}>25 km radius (Standard City Wide)</option>
              <option value={35}>35 km radius</option>
            </select>
          </div>
        </div>

        {/* Return Policy & COD */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Customer Return Window
            </label>
            <select
              {...register("returnWindowDays", { valueAsNumber: true })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer"
            >
              <option value={0}>No returns (Replacement for DOA only)</option>
              <option value={7}>7 Days Return Policy</option>
              <option value={10}>10 Days Return Policy (Recommended)</option>
              <option value={15}>15 Days Return Policy</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer p-2.5 rounded-xl border border-border bg-muted/20">
              <input
                type="checkbox"
                {...register("acceptsCod")}
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <span>Accept Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* EV Hazardous Goods Li-ion Declaration (Important for EV parts) */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              EV Hazardous Goods & Li-ion Battery Compliance
            </span>
            <label className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={sellsLiIon}
                onChange={(e) => setSellsLiIon(e.target.checked)}
                className="h-4 w-4 accent-amber-600"
              />
              <span>We sell Li-ion Batteries / Fast Chargers</span>
            </label>
          </div>

          {sellsLiIon && (
            <div className="pt-2 text-xs space-y-2 text-amber-900 dark:text-amber-300">
              <p className="text-[11px] leading-relaxed">
                Lithium-ion cells and battery modules require UN38.3 test certifications and fire-retardant outer packaging for dispatch via RiderzPro hyperlocal logistics fleet.
              </p>
              <label className="flex items-start gap-2 text-xs font-bold text-amber-950 dark:text-amber-100 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={unDeclared}
                  onChange={(e) => setUnDeclared(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-amber-600"
                />
                <span>
                  I declare that all Li-ion battery packages comply with UN38.3 testing norms and AIS-156 safety guidelines.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
          >
            <span>Continue to Bank Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
