import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Save,
  Search,
  Lock,
  ShieldAlert,
  ArrowRight,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor, VendorProduct } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

interface InventorySectionProps {
  vendor: Vendor;
}

export function InventorySection({ vendor }: InventorySectionProps) {
  const { products, updateProduct } = useVendorStore();
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  // KYC Approval Gate
  const isKycApproved = vendor.status === "approved";

  // Local draft stock quantities before saving
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});
  const [thresholdDrafts, setThresholdDrafts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [autoHideOutOfStock, setAutoHideOutOfStock] = useState(true);

  const handleStockChange = (productId: string, val: number) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
      return;
    }
    setStockDrafts((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const handleThresholdChange = (productId: string, val: number) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying thresholds.");
      return;
    }
    setThresholdDrafts((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const handleSaveRow = (productId: string) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
      return;
    }
    const newStock = stockDrafts[productId];
    const newThreshold = thresholdDrafts[productId];
    const updates: Partial<VendorProduct> = {};

    if (newStock !== undefined) updates.stock = newStock;
    if (newThreshold !== undefined) updates.minStockAlert = newThreshold;

    updateProduct(productId, updates);
    toast.success("Inventory stock levels updated!");
  };

  const handleQuickAdd = (productId: string, currentStock: number, addQty: number) => {
    if (!isKycApproved) {
      toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
      return;
    }
    const updated = currentStock + addQty;
    updateProduct(productId, { stock: updated });
    toast.success(`Restocked +${addQty} units! Current stock: ${updated}`);
  };

  const filtered = vendorProducts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

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
                  Inventory Management Locked — KYC Verification Pending
                </h3>
                <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900">
                  Status: {vendor.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Stock updates, quick restock actions, and low-inventory threshold modifications will be
                unlocked once your seller KYC is approved by RiderzPro administration.
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
          <h2 className="font-display font-black text-xl text-gray-900">Inventory Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time per-SKU stock control, low-inventory warning thresholds, and auto-hide settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-2xs cursor-pointer">
            <input
              type="checkbox"
              checked={autoHideOutOfStock}
              onChange={(e) => {
                setAutoHideOutOfStock(e.target.checked);
                toast.info(
                  e.target.checked
                    ? "Enabled auto-hide for 0-stock listings"
                    : "Disabled auto-hide: out of stock items will show 'Unavailable' label"
                );
              }}
              className="accent-[#E31E24] h-4 w-4 rounded"
            />
            <span>Auto-hide out of stock</span>
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter inventory by SKU or name..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E31E24]"
        />
      </div>

      {/* MOBILE INVENTORY CARDS (Under 768px - Touch Friendly) */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const currentStock = stockDrafts[p.id] !== undefined ? stockDrafts[p.id] : p.stock;
          const currentThreshold =
            thresholdDrafts[p.id] !== undefined
              ? thresholdDrafts[p.id]
              : p.minStockAlert || 3;
          const isLow = currentStock <= currentThreshold;

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-gray-900 truncate">{p.title}</p>
                  <p className="font-mono text-[11px] text-gray-400 mt-0.5">SKU: {p.sku}</p>
                </div>

                <div>
                  {currentStock === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                      Out of Stock
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                      <AlertTriangle className="h-3 w-3" /> Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Healthy
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Input & Threshold Grid */}
              <div className="grid grid-cols-2 gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">
                    Available Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={!isKycApproved}
                    value={currentStock}
                    onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                    className={`w-full px-2 py-1.5 rounded-lg border border-gray-200 font-bold font-mono text-center text-xs bg-white ${
                      !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    min={1}
                    disabled={!isKycApproved}
                    value={currentThreshold}
                    onChange={(e) => handleThresholdChange(p.id, Number(e.target.value))}
                    className={`w-full px-2 py-1.5 rounded-lg border border-gray-200 text-center font-semibold text-xs bg-white ${
                      !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Quick Restock and Save actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">Restock:</span>
                  <button
                    onClick={() => handleQuickAdd(p.id, p.stock, 5)}
                    disabled={!isKycApproved}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      isKycApproved
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleQuickAdd(p.id, p.stock, 20)}
                    disabled={!isKycApproved}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      isKycApproved
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    +20
                  </button>
                </div>

                <button
                  onClick={() => handleSaveRow(p.id)}
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

      {/* DESKTOP INVENTORY TABLE (768px and wider) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
              <th className="py-3 px-4">Product & SKU</th>
              <th className="py-3 px-4">Available Units</th>
              <th className="py-3 px-4">Restock Shortcut</th>
              <th className="py-3 px-4">Low-Stock Alert Threshold</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => {
              const currentStock = stockDrafts[p.id] !== undefined ? stockDrafts[p.id] : p.stock;
              const currentThreshold =
                thresholdDrafts[p.id] !== undefined
                  ? thresholdDrafts[p.id]
                  : p.minStockAlert || 3;
              const isLow = currentStock <= currentThreshold;

              return (
                <tr key={p.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="font-mono text-[11px] text-gray-400">SKU: {p.sku}</p>
                  </td>

                  {/* Inline Stock Input */}
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      min={0}
                      disabled={!isKycApproved}
                      value={currentStock}
                      onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                      className={`w-24 px-2.5 py-1.5 rounded-xl border border-gray-200 font-bold font-mono text-center text-gray-900 focus:border-[#E31E24] ${
                        !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </td>

                  {/* Restock Buttons */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAdd(p.id, p.stock, 5)}
                        disabled={!isKycApproved}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                          isKycApproved
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleQuickAdd(p.id, p.stock, 20)}
                        disabled={!isKycApproved}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                          isKycApproved
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +20
                      </button>
                    </div>
                  </td>

                  {/* Alert Threshold */}
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      min={1}
                      disabled={!isKycApproved}
                      value={currentThreshold}
                      onChange={(e) => handleThresholdChange(p.id, Number(e.target.value))}
                      className={`w-20 px-2 py-1 rounded-xl border border-gray-200 text-center font-semibold text-gray-700 ${
                        !isKycApproved ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3.5 px-4">
                    {currentStock === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                        <AlertTriangle className="h-3 w-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Healthy
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSaveRow(p.id)}
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
