import React from "react";
import {
  Package,
  Clock,
  IndianRupee,
  CheckCircle2,
  Boxes,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { inr } from "@/lib/data";
import { Vendor } from "@/lib/vendor/types";
import { useSellerOrders, SellerOrder } from "../sellerOrdersApi";
import { useSellerInventory } from "../sellerInventoryApi";

interface OverviewSectionProps {
  vendor: Vendor;
  onNavigateTab: (tab: string) => void;
}

export function OverviewSection({ vendor, onNavigateTab }: OverviewSectionProps) {
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useSellerOrders();

  const {
    products,
    loading: inventoryLoading,
    error: inventoryError,
    refetch: refetchInventory,
  } = useSellerInventory();

  const isLoading = ordersLoading || inventoryLoading;

  // -------------------------------------------------------------
  // REAL COMPUTED VALUES (Task 2: No Hardcoded Numbers)
  // -------------------------------------------------------------

  // 1. New orders (PLACED)
  const newOrders = orders.filter((o) => o.status === "PLACED");
  const newOrdersCount = newOrders.length;

  // 2. In progress (ACCEPTED through IN_TRANSIT)
  const inProgressStatuses = ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"];
  const inProgressOrders = orders.filter((o) => inProgressStatuses.includes(o.status));
  const inProgressCount = inProgressOrders.length;

  // 3. Delivered orders
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
  const deliveredCount = deliveredOrders.length;

  // 4. Today's sales (sum of amounts for orders accepted, packed, in transit, or delivered today)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayAcceptedOrDelivered = orders.filter((o) => {
    const isQualifyingStatus = [
      "ACCEPTED",
      "PACKED",
      "RIDER_ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
    ].includes(o.status);

    const orderTime = new Date(o.createdAt).getTime();
    // Count orders created today, or within the last 24 hours
    const isToday = orderTime >= startOfToday || now.getTime() - orderTime <= 24 * 3600 * 1000;
    return isQualifyingStatus && isToday;
  });

  const todaySalesAmount = todayAcceptedOrDelivered.reduce((sum, o) => sum + (o.amount || 0), 0);

  // 5. Low-stock items (stock <= 5)
  const lowStockItems = products.filter((p) => p.stock <= 5);
  const lowStockCount = lowStockItems.length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time seller store overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-xl text-gray-900">
              {vendor.businessName || "Seller Dashboard"}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
              Live Metrics
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time computed KPIs. No hardcoded statistics or invented historical charts.
          </p>
        </div>

        <button
          onClick={() => {
            refetchOrders();
            refetchInventory();
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Errors banner if any */}
      {(ordersError || inventoryError) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs flex items-center justify-between gap-3 text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{ordersError || inventoryError}. Cached values remain displayed below.</span>
          </div>
          <button
            onClick={() => {
              refetchOrders();
              refetchInventory();
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ACTION CENTER: Shows only if items need attention */}
      {(newOrdersCount > 0 || lowStockCount > 0) && (
        <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#E11D2A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-gray-900">
                  Seller Attention Required
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {newOrdersCount > 0 && (
                    <span className="font-semibold text-gray-900">
                      {newOrdersCount} new {newOrdersCount === 1 ? "order" : "orders"} awaiting
                      acceptance.{" "}
                    </span>
                  )}
                  {lowStockCount > 0 && (
                    <span className="text-amber-800">
                      {lowStockCount} {lowStockCount === 1 ? "item has" : "items have"} low stock
                      (&le; 5 units).
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {newOrdersCount > 0 && (
                <button
                  onClick={() => onNavigateTab("orders")}
                  className="rounded-xl bg-[#E11D2A] hover:bg-[#c91823] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  View New Orders
                </button>
              )}
              {lowStockCount > 0 && (
                <button
                  onClick={() => onNavigateTab("inventory")}
                  className="rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                >
                  Review Stock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPUTED KPI CARDS STRIP (5 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: New orders (PLACED) - Clickable to Orders tab */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#E11D2A]/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">New Orders</span>
            <span className="h-7 w-7 rounded-xl bg-red-50 text-[#E11D2A] flex items-center justify-center group-hover:bg-[#E11D2A] group-hover:text-white transition">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            {isLoading && orders.length === 0 ? "—" : newOrdersCount}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-[#E11D2A]">
            <span>Status: PLACED</span>
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: In Progress (ACCEPTED to IN_TRANSIT) */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-gray-300 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">In Progress</span>
            <span className="h-7 w-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            {isLoading && orders.length === 0 ? "—" : inProgressCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-2 font-medium">Accepted to transit</p>
        </div>

        {/* Card 3: Delivered */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Delivered</span>
            <span className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-emerald-600 mt-3">
            {isLoading && orders.length === 0 ? "—" : deliveredCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-2 font-medium">Completed orders</p>
        </div>

        {/* Card 4: Today's Sales */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Today's Sales</span>
            <span className="h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-xl sm:text-2xl font-black text-gray-900 mt-3 truncate">
            {isLoading && orders.length === 0 ? "—" : inr(todaySalesAmount)}
          </p>
          <p className="text-[11px] text-gray-400 mt-2 font-medium">
            {todayAcceptedOrDelivered.length}{" "}
            {todayAcceptedOrDelivered.length === 1 ? "order" : "orders"} today
          </p>
        </div>

        {/* Card 5: Low-Stock Items - Clickable to Inventory tab */}
        <div
          onClick={() => onNavigateTab("inventory")}
          className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-amber-400/50 transition cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Low-Stock Items</span>
            <span className="h-7 w-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
              <Boxes className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-rose-600 mt-3">
            {isLoading && products.length === 0 ? "—" : lowStockCount}
          </p>
          <div className="mt-2 flex items-center text-[11px] font-bold text-rose-600">
            <span>&le; 5 units</span>
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS FEED (Real Data) */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900">Live Order Activity</h3>
            <p className="text-xs text-gray-500">Most recent orders received by your store</p>
          </div>
          <button
            onClick={() => onNavigateTab("orders")}
            className="text-xs font-bold text-[#E11D2A] hover:underline cursor-pointer"
          >
            View All ({orders.length})
          </button>
        </div>

        {ordersLoading && orders.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                onClick={() => onNavigateTab("orders")}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/60 rounded-xl px-2 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-900">
                      {o.orderNumber}
                    </span>
                    <StatusChip status={o.status} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {o.customerName} · {o.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span className="font-bold text-xs text-gray-900">
                    ₹{o.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    PLACED: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "New Order" },
    ACCEPTED: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Accepted" },
    PACKED: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", label: "Packed" },
    RIDER_ASSIGNED: {
      bg: "bg-purple-50 border-purple-200",
      text: "text-purple-700",
      label: "Rider Assigned",
    },
    PICKED_UP: {
      bg: "bg-indigo-50 border-indigo-200",
      text: "text-indigo-700",
      label: "Picked Up",
    },
    IN_TRANSIT: { bg: "bg-cyan-50 border-cyan-200", text: "text-cyan-800", label: "In Transit" },
    DELIVERED: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      label: "Delivered",
    },
    REJECTED: { bg: "bg-gray-100 border-gray-200", text: "text-gray-700", label: "Rejected" },
    CANCELLED: { bg: "bg-gray-100 border-gray-200", text: "text-gray-700", label: "Cancelled" },
  };

  const c = map[status] || {
    bg: "bg-gray-100 border-gray-200",
    text: "text-gray-700",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}
