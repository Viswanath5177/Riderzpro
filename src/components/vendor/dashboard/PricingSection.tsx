import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  IndianRupee,
  Percent,
  Download,
  Upload,
  FileSpreadsheet,
  Save,
  CheckCircle2,
  TrendingUp,
  Info,
  Lock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor, VendorProduct } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

interface PricingSectionProps {
  vendor: Vendor;
}

export function PricingSection({ vendor }: PricingSectionProps) {
  const { products, updateProduct } = useVendorStore();
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  // KYC Approval Gate
  const isKycApproved = vendor.status === "approved";

  const commissionRate = vendor.commissionRate || 10; // e.g. 10%
  const [priceDrafts, setPriceDrafts] = useState<Record<string, number>>({});

  const handlePriceChange = (productId: string, val: number) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying prices.");
      return;
    }
    setPriceDrafts((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const handleSavePrice = (p: VendorProduct) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying prices.");
      return;
    }
    const newPrice = priceDrafts[p.id];
    if (newPrice === undefined) return;
    if (newPrice > p.mrp) {
      toast.error("Selling price cannot exceed MRP");
      return;
    }
    updateProduct(p.id, { sellingPrice: newPrice });
    toast.success(`Selling price for "${p.title}" updated to ${inr(newPrice)}!`);
  };

  // CSV Bulk Price Download & Upload
  const handleDownloadPricingCsv = () => {
    let csv = "SKU,Title,MRP,CurrentSellingPrice,NewSellingPrice\n";
    vendorProducts.forEach((p) => {
      csv += `"${p.sku}","${p.title.replace(/"/g, '""')}",${p.mrp},${p.sellingPrice},${p.sellingPrice}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `riderzpro_pricing_${vendor.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadPricingCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before updating prices.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      let updatedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, "").trim());
        if (cols.length < 5) continue;
        const [sku, , , , newPriceStr] = cols;
        const newPrice = Number(newPriceStr);
        if (!isNaN(newPrice) && newPrice > 0) {
          const match = vendorProducts.find((p) => p.sku === sku);
          if (match && newPrice <= match.mrp) {
            updateProduct(match.id, { sellingPrice: newPrice });
            updatedCount++;
          }
        }
      }
      toast.success(`Updated pricing for ${updatedCount} products via CSV!`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* KYC Lock Warning Banner if not approved */}
      {!isKycApproved && (
        <div className="rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-sm font-bold text-amber-900">
                  Pricing Operations Locked — KYC Verification Pending
                </h3>
                <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900">
                  Status: {vendor.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Selling price edits, promotional discounts, and bulk CSV uploads will unlock once
                your merchant KYC application is approved by the admin team.
              </p>
              <div className="mt-3">
                <Link
                  to="/vendor/pending"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition"
                >
                  <span>Check Verification Status</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">
            Pricing, Margins & Offers
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Optimize catalogue pricing, view net payout margins after RiderzPro marketplace
            commission ({commissionRate}%), and perform bulk CSV price updates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPricingCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <label
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition ${
              isKycApproved
                ? "bg-gray-900 hover:bg-black text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
            }`}
          >
            {isKycApproved ? <Upload className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span>Bulk CSV</span>
            {isKycApproved && (
              <input
                type="file"
                accept=".csv"
                onChange={handleUploadPricingCsv}
                className="hidden"
              />
            )}
          </label>
        </div>
      </div>

      {/* Margin Formula Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-gradient-to-r from-red-50/50 via-white to-gray-50 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#E31E24] text-white flex items-center justify-center shrink-0">
            <Percent className="h-4 w-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-gray-900">Your Tier Commission: {commissionRate}%</h4>
            <p className="text-gray-600 leading-relaxed">
              Net Seller Payout = Selling Price - Commission ({commissionRate}%) - 18% GST on
              Commission - 1% TCS / TDS statutory deduction.
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE PRICING CARDS (Under 768px - Touch Friendly) */}
      <div className="md:hidden space-y-3">
        {vendorProducts.map((p) => {
          const currentSellingPrice =
            priceDrafts[p.id] !== undefined ? priceDrafts[p.id] : p.sellingPrice;
          const discountPct =
            p.mrp > currentSellingPrice
              ? Math.round(((p.mrp - currentSellingPrice) / p.mrp) * 100)
              : 0;

          const commFee = Math.round(currentSellingPrice * (commissionRate / 100));
          const gstOnComm = Math.round(commFee * 0.18);
          const tcs = Math.round(currentSellingPrice * 0.01);
          const netMargin = currentSellingPrice - commFee - gstOnComm - tcs;

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-gray-900 truncate">{p.title}</p>
                  <p className="font-mono text-[11px] text-gray-400 mt-0.5">
                    SKU: {p.sku} · MRP {inr(p.mrp)}
                  </p>
                </div>

                {discountPct > 0 && (
                  <span className="rounded-md bg-red-50 text-[#E31E24] px-2 py-0.5 text-[10px] font-bold shrink-0">
                    {discountPct}% OFF
                  </span>
                )}
              </div>

              {/* Price Input and Net Payout metrics */}
              <div className="grid grid-cols-2 gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    disabled={!isKycApproved}
                    value={currentSellingPrice}
                    onChange={(e) => handlePriceChange(p.id, Number(e.target.value))}
                    className={`w-full px-2 py-1.5 rounded-lg border border-gray-200 font-bold font-mono text-center text-xs bg-white text-emerald-800 ${
                      !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">
                    Net Payout Est.
                  </label>
                  <div className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-center font-mono font-bold text-xs text-gray-900">
                    {inr(netMargin)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                <span className="text-gray-500">
                  Fee: {inr(commFee)} <span className="text-[10px] text-gray-400">(+{gstOnComm} GST)</span>
                </span>

                <button
                  onClick={() => handleSavePrice(p)}
                  disabled={!isKycApproved}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isKycApproved
                      ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isKycApproved ? <Save className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP PRICING TABLE (768px and wider) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
              <th className="py-3 px-4">Product & SKU</th>
              <th className="py-3 px-4">MRP (₹)</th>
              <th className="py-3 px-4">Selling Price (₹)</th>
              <th className="py-3 px-4">Discount %</th>
              <th className="py-3 px-4">Marketplace Fee ({commissionRate}%)</th>
              <th className="py-3 px-4">Net Margin Preview</th>
              <th className="py-3 px-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendorProducts.map((p) => {
              const currentSellingPrice =
                priceDrafts[p.id] !== undefined ? priceDrafts[p.id] : p.sellingPrice;
              const discountPct =
                p.mrp > currentSellingPrice
                  ? Math.round(((p.mrp - currentSellingPrice) / p.mrp) * 100)
                  : 0;

              const commFee = Math.round(currentSellingPrice * (commissionRate / 100));
              const gstOnComm = Math.round(commFee * 0.18);
              const tcs = Math.round(currentSellingPrice * 0.01);
              const netMargin = currentSellingPrice - commFee - gstOnComm - tcs;

              return (
                <tr key={p.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="font-mono text-[11px] text-gray-400">SKU: {p.sku}</p>
                  </td>

                  {/* MRP */}
                  <td className="py-3.5 px-4 font-mono text-gray-500">{inr(p.mrp)}</td>

                  {/* Selling Price editable */}
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      disabled={!isKycApproved}
                      value={currentSellingPrice}
                      onChange={(e) => handlePriceChange(p.id, Number(e.target.value))}
                      className={`w-28 px-2.5 py-1.5 rounded-xl border border-gray-200 font-bold font-mono text-emerald-800 focus:border-[#E31E24] ${
                        !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4">
                    <span className="rounded-md bg-red-50 text-[#E31E24] px-2 py-0.5 text-[10px] font-bold">
                      {discountPct}% OFF
                    </span>
                  </td>

                  {/* Marketplace Fee */}
                  <td className="py-3.5 px-4 font-mono text-gray-600">
                    {inr(commFee)}
                    <span className="text-[10px] text-gray-400 block">+ ₹{gstOnComm} GST</span>
                  </td>

                  {/* Net Margin */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-gray-900">{inr(netMargin)}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      ~{Math.round((netMargin / currentSellingPrice) * 100)}% of price
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSavePrice(p)}
                      disabled={!isKycApproved}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                        isKycApproved
                          ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isKycApproved ? <Save className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>Save</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
