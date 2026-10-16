import React, { useState } from "react";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Plus,
  ArrowRight,
  PackageCheck,
  TrendingDown,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor } from "@/lib/vendor/types";
import { useSellerInventory, SellerInventoryProduct, USE_MOCK } from "../sellerInventoryApi";

interface InventorySectionProps {
  vendor: Vendor;
}

export function InventorySection({ vendor }: InventorySectionProps) {
  const { products, loading, error, refetch, deltas, flashingIds } = useSellerInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [autoHideOutOfStock, setAutoHideOutOfStock] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Filter products by search and category
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    if (autoHideOutOfStock && p.stock === 0) return false;
    if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const inStockCount = products.filter((p) => p.stock > 5).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner: Real-time sync & Contract Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-xl text-gray-900">Seller Inventory</h2>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                USE_MOCK ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {USE_MOCK ? "Mock Adapter (Syncs with Orders)" : "Live Backend API"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real stock per SKU. Automatically decrements when orders are accepted from the Orders
            tab.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer disabled:opacity-60"
            title="Refetch inventory"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Stock</span>
          </button>
        </div>
      </div>

      {/* Error state with retry that preserves existing data */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs flex items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              <strong>Sync Error:</strong> {error}. Showing last known cached stock levels.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Quick Stock Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Total SKUs</span>
          <p className="font-display text-2xl font-black text-gray-900 mt-1">
            {loading && products.length === 0 ? "—" : products.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-700">In Stock</span>
          <p className="font-display text-2xl font-black text-emerald-600 mt-1">
            {loading && products.length === 0 ? "—" : inStockCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-amber-700">Low Stock (&le; 5)</span>
          <p className="font-display text-2xl font-black text-amber-600 mt-1">
            {loading && products.length === 0 ? "—" : lowStockCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-rose-700">Out of Stock</span>
          <p className="font-display text-2xl font-black text-rose-600 mt-1">
            {loading && products.length === 0 ? "—" : outOfStockCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E31E24]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E31E24]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-2xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoHideOutOfStock}
            onChange={(e) => setAutoHideOutOfStock(e.target.checked)}
            className="accent-[#E31E24] h-4 w-4 rounded"
          />
          <span>Hide Out of Stock (0 units)</span>
        </label>
      </div>

      {/* Skeletons on initial load */}
      {loading && products.length === 0 && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-full animate-pulse rounded-2xl bg-gray-200/70 border border-gray-200"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-2xs">
          <Boxes className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 font-display font-bold text-base text-gray-900">
            No products match your filter
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting the
            out-of-stock filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("ALL");
              setAutoHideOutOfStock(false);
            }}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* PHONE-FRIENDLY CARD VIEW (< 768px) */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const isFlashing = flashingIds.has(p.id);
          const delta = deltas[p.id];

          return (
            <div
              key={p.id}
              className={`rounded-2xl border transition-all duration-300 bg-white p-4 shadow-2xs space-y-3 ${
                isFlashing
                  ? "border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/40"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-14 w-14 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-gray-900 leading-tight">{p.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {p.category} · <span className="font-mono text-gray-400">{p.sku}</span>
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-xs text-gray-900">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      +{p.gstPercent}% GST
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock and Chip Strip */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Stock:</span>
                  <span
                    className={`font-mono text-base font-black tabular-nums transition-colors duration-300 ${
                      isFlashing ? "text-amber-700" : "text-gray-900"
                    }`}
                  >
                    {p.stock}
                  </span>

                  {/* Delta indicator pill */}
                  {delta !== undefined && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-black font-mono animate-bounce ${
                        delta < 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  )}
                </div>

                {/* Stock Status Chip (text label always present) */}
                <div>
                  <StockChip stock={p.stock} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP INVENTORY TABLE (>= 768px) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Product Details</th>
              <th className="py-3.5 px-4">Category & SKU</th>
              <th className="py-3.5 px-4">Price & GST</th>
              <th className="py-3.5 px-4 text-center">Available Stock</th>
              <th className="py-3.5 px-4 text-right">Status Chip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => {
              const isFlashing = flashingIds.has(p.id);
              const delta = deltas[p.id];

              return (
                <tr
                  key={p.id}
                  className={`transition-colors duration-300 hover:bg-gray-50/60 ${
                    isFlashing ? "bg-amber-50/70" : ""
                  }`}
                >
                  {/* Product Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate max-w-xs">
                          {p.name}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                          {p.partType} · {p.condition}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category & SKU */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800 text-xs">{p.category}</p>
                    <p className="font-mono text-[11px] text-gray-400 mt-0.5">SKU: {p.sku}</p>
                  </td>

                  {/* Price & GST */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900 text-xs">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      GST: {p.gstPercent}% included
                    </p>
                  </td>

                  {/* Stock with Flashing & Delta indicator */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <span
                        className={`font-mono text-sm font-black tabular-nums transition-colors duration-300 ${
                          isFlashing ? "text-amber-700 font-extrabold" : "text-gray-900"
                        }`}
                      >
                        {p.stock}
                      </span>

                      {delta !== undefined && (
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-black font-mono animate-bounce ${
                            delta < 0
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock Chip with explicit text label */}
                  <td className="py-3.5 px-4 text-right">
                    <StockChip stock={p.stock} />
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

/**
 * Stock Chip Component
 * Uses explicit text labels, not color only.
 * In stock (> 5), Low stock (<= 5), Out of stock (0).
 */
function StockChip({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
        <XCircle className="h-3 w-3 text-rose-600" />
        <span>Out of stock</span>
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 shadow-2xs">
        <AlertTriangle className="h-3 w-3 text-amber-600" />
        <span>Low stock ({stock} left)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs">
      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
      <span>In stock</span>
    </span>
  );
}
