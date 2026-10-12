import React, { useState } from "react";
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  Sparkles,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassSelect } from "../glass/GlassSelect";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassModal } from "../glass/GlassModal";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminCoupon } from "@/mocks/admin/types";

export function OffersScreen() {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useAdminStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(2500);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(1000);
  const [usageLimit, setUsageLimit] = useState(500);
  const [validTill, setValidTill] = useState("2026-06-30");

  const columns: Column<AdminCoupon>[] = [
    {
      key: "code",
      header: "Promo Code",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[#E31E24] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg text-xs">
            {c.code}
          </span>
          {c.applicableCategory && (
            <span className="text-[10px] text-[#6B7280] font-medium">({c.applicableCategory} only)</span>
          )}
        </div>
      ),
    },
    {
      key: "discountValue",
      header: "Benefit",
      sortable: true,
      render: (c) => (
        <span className="font-bold text-[#111111] tabular-nums text-xs">
          {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
          {c.maxDiscount ? ` (up to ₹${c.maxDiscount})` : ""}
        </span>
      ),
    },
    {
      key: "minOrderValue",
      header: "Min Order",
      sortable: true,
      render: (c) => <span className="font-bold text-[#111111] text-xs">₹{c.minOrderValue}</span>,
    },
    {
      key: "usageCount",
      header: "Usage Redeemed",
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-bold text-[#111111] tabular-nums text-xs">{c.usageCount} / {c.usageLimit}</span>
          <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#E31E24] h-full rounded-full"
              style={{ width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "validTill",
      header: "Expires On",
      sortable: true,
      render: (c) => <span className="text-[#4B5563] font-medium text-xs">{c.validTill}</span>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (c) => <StatusBadge status={c.isActive ? "Active" : "Expired"} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleCouponActive(c.id)}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 p-1.5 text-[#374151] transition cursor-pointer"
            title={c.isActive ? "Pause Coupon" : "Activate Coupon"}
          >
            {c.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          </button>
          <button
            onClick={() => deleteCoupon(c.id)}
            className="rounded-lg bg-red-100 hover:bg-red-200 p-1.5 text-red-700 transition cursor-pointer"
            title="Delete Coupon"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount: discountType === "percentage" ? maxDiscount : undefined,
      usageLimit,
      validFrom: new Date().toISOString().split("T")[0],
      validTill,
      isActive: true,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Offers, Coupons & Promotional Banners
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Configure checkout discount coupons, minimum cart thresholds and storefront promotion campaigns.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          onClick={() => {
            setCode("SUPER" + Math.floor(10 + Math.random() * 90));
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Create New Coupon</span>
        </GlassButton>
      </div>

      {/* Main Coupons Table */}
      <DataTable
        data={coupons}
        columns={columns}
        searchPlaceholder="Search coupon code..."
        searchKey="code"
        keyExtractor={(c) => c.id}
        exportFileName="riderzpro_coupons"
      />

      {/* Storefront Hero Banners Manager Card */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#E31E24]" />
            <h3 className="font-bold text-sm text-[#111111]">Storefront Hero Promo Banners</h3>
          </div>
          <span className="text-xs text-[#6B7280] font-bold">3 Banners Active on Landing Page</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111]">100% Fitment Guaranteed</span>
              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                Active
              </span>
            </div>
            <p className="text-[#4B5563] leading-relaxed text-[11px] font-medium">
              "Enter your VIN or pick your EV, compare sellers, order in one cart."
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111]">Monsoon Battery Care Fest</span>
              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                Active
              </span>
            </div>
            <p className="text-[#4B5563] leading-relaxed text-[11px] font-medium">
              "Up to ₹1,500 off certified NMC & LiFePO4 packs with coupon BATTERYBOOST."
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111]">Doorstep Tech Installation</span>
              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                Active
              </span>
            </div>
            <p className="text-[#4B5563] leading-relaxed text-[11px] font-medium">
              "Certified technicians visit your garage in 3 hours across Bengaluru."
            </p>
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <GlassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="md"
        title="Create Promotional Coupon"
        description="Set the promo code, percentage/flat discount and minimum cart value."
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs text-[#111111]">
          <div>
            <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
              Coupon Code
            </label>
            <GlassInput
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MONSOON20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Discount Type
              </label>
              <GlassSelect
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                options={[
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (₹)" },
                ]}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Value ({discountType === "percentage" ? "%" : "₹"})
              </label>
              <GlassInput
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Min Order Value (₹)
              </label>
              <GlassInput
                type="number"
                required
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Max Discount Cap (₹)
              </label>
              <GlassInput
                type="number"
                value={maxDiscount || ""}
                onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || undefined)}
                placeholder="Optional cap"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Total Usage Limit
              </label>
              <GlassInput
                type="number"
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Expiry Date
              </label>
              <GlassInput
                type="date"
                required
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
            <GlassButton type="button" variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Save Coupon
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
