import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Truck,
  Store,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Boxes,
  CheckCircle2,
} from "lucide-react";
import { AdminRouteGuard } from "@/lib/adminAuth";
import { useAdminOrders } from "@/components/admin/adminOrdersApi";
import { useAdminSellers } from "@/components/admin/adminSellersApi";
import { SHOW_ADMIN_SELLERS } from "@/components/admin/mockFlags";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Console — RiderzPro Admin" },
      {
        name: "description",
        content: "Platform overview, live orders fulfillment, and merchant directory.",
      },
    ],
  }),
  component: AdminIndexPage,
});

function AdminIndexPage() {
  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-[#F6F7F9] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <AdminHomeDashboard />
        </div>
      </div>
    </AdminRouteGuard>
  );
}

function AdminHomeDashboard() {
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useAdminOrders();

  const {
    sellers,
    loading: sellersLoading,
    error: sellersError,
    refetch: refetchSellers,
  } = useAdminSellers();

  const isLoading = ordersLoading || sellersLoading;

  // -------------------------------------------------------------
  // COMPUTED METRICS (Task 4: Real Data, No Hardcoded Numbers)
  // -------------------------------------------------------------

  // 1. Total Orders
  const totalOrders = orders.length;

  // 2. Active Orders (PLACED through IN_TRANSIT)
  const activeOrders = orders.filter((o) =>
    ["PLACED", "ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(
      o.status,
    ),
  ).length;

  // 3. Sellers (Approved & Pending)
  const approvedSellers = sellers.filter((s) => s.approvalStatus === "Approved").length;
  const pendingSellers = sellers.filter((s) => s.approvalStatus === "Pending").length;

  // 4. Orders Needing Attention: PLACED (awaiting seller action) OR PACKED with unassigned rider
  const ordersNeedingAttention = orders.filter((o) => {
    if (o.status === "PLACED") return true;
    if (o.status === "PACKED" && (!o.riderName || o.riderName.trim() === "")) return true;
    return false;
  }).length;

  // 5. Delivered Orders
  const deliveredOrders = orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;

  return (
    <div className="space-y-6">
      {/* Operations Console Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display font-black text-2xl text-gray-900 tracking-tight">
              Admin Operations Console
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 uppercase">
              Live Console
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time platform dispatch oversight, seller governance, and fulfillment monitoring.
          </p>
        </div>

        <button
          onClick={() => {
            refetchOrders();
            refetchSellers();
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Errors banner if any */}
      {(ordersError || sellersError) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs flex items-center justify-between gap-3 text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{ordersError || sellersError}. Showing cached platform metrics.</span>
          </div>
          <button
            onClick={() => {
              refetchOrders();
              refetchSellers();
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* COMPUTED KPI CARDS (4 Cards linked to respective pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Orders -> links to /admin/orders */}
        <Link
          to="/admin/orders"
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-[#E11D2A]/60 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-semibold">Total Orders</span>
            <span className="h-8 w-8 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center group-hover:bg-[#E11D2A] group-hover:text-white transition">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-3xl font-black text-gray-900 mt-3">
            {isLoading && orders.length === 0 ? "—" : totalOrders}
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-[#E11D2A]">
            <span>View Live Orders Board</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* 2. Active Orders -> links to /admin/orders */}
        <Link
          to="/admin/orders"
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-blue-400/60 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-semibold">Active Orders</span>
            <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-3xl font-black text-blue-600 mt-3">
            {isLoading && orders.length === 0 ? "—" : activeOrders}
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-blue-600">
            <span>In Fulfillment Pipeline</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* 3. Sellers (Approved / Pending) or Completed Deliveries */}
        {SHOW_ADMIN_SELLERS ? (
          <Link
            to="/admin/sellers"
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-emerald-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span className="font-semibold">Merchants</span>
              <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Store className="h-4 w-4" />
              </span>
            </div>
            <p className="font-display text-3xl font-black text-gray-900 mt-3">
              {isLoading && sellers.length === 0 ? "—" : sellers.length}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-gray-600">
              <span className="text-emerald-700 font-bold">{approvedSellers} Approved</span>
              <span className="mx-1.5">·</span>
              <span className="text-amber-700 font-bold">{pendingSellers} Pending</span>
            </div>
          </Link>
        ) : (
          <Link
            to="/admin/orders"
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-emerald-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span className="font-semibold">Delivered Orders</span>
              <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <p className="font-display text-3xl font-black text-emerald-600 mt-3">
              {isLoading && orders.length === 0 ? "—" : deliveredOrders}
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-emerald-600">
              <span>Completed Deliveries</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        )}

        {/* 4. Orders Needing Attention -> links to /admin/orders */}
        <Link
          to="/admin/orders"
          className="rounded-3xl border border-red-200 bg-red-50/50 p-5 shadow-2xs hover:border-red-400 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-red-700 text-xs">
            <span className="font-bold">Attention Required</span>
            <span className="h-8 w-8 rounded-xl bg-red-100 text-[#E11D2A] flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-3xl font-black text-[#E11D2A] mt-3">
            {isLoading && orders.length === 0 ? "—" : ordersNeedingAttention}
          </p>
          <div className="mt-3 flex items-center text-xs font-bold text-[#E11D2A]">
            <span>Awaiting Action / Unassigned</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* RECENT LIVE ORDERS FEED (Computed from real orders) */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900">Live Order Stream</h3>
            <p className="text-xs text-gray-500">
              Recent order activity across customer orders and fulfilling hubs
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#E11D2A] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Orders Board</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {ordersLoading && orders.length === 0 ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No orders found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 6).map((o) => (
              <Link
                key={o.id}
                to="/admin/orders"
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/60 rounded-xl px-2.5 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-900">
                      {o.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                      {o.status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {o.city} · Seller: {o.sellerName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Customer: <span className="text-gray-900 font-medium">{o.customerName}</span> ·{" "}
                    {o.items.map((it) => `${it.name} (x${it.qty})`).join(", ")}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span className="font-mono font-bold text-xs text-gray-900">
                    ₹{o.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* QUICK MANAGEMENT SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/orders"
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-gray-300 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#E11D2A] flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Orders Operations</h4>
              <p className="text-xs text-gray-500">Filter, inspect, and track rider handoffs</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Link>

        {SHOW_ADMIN_SELLERS && (
          <Link
            to="/admin/sellers"
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-gray-300 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Seller Directory</h4>
                <p className="text-xs text-gray-500">Inspect verified hubs, GST compliance & KYC</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
        )}
      </div>
    </div>
  );
}
