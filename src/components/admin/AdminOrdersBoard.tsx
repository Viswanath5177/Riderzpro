import React, { useState, useMemo } from "react";
import {
  Package,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  User,
  Store,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Layers,
  MapPin,
  Phone,
} from "lucide-react";
import {
  useAdminOrders,
  AdminOrderJoined,
  OrderStatus,
  PaymentStatus,
  USE_MOCK,
} from "./adminOrdersApi";
import { useAdminAuth } from "@/lib/adminAuth";

export function AdminOrdersBoard() {
  const { adminUser, isAuthenticated, loading: authLoading } = useAdminAuth();
  const { orders, loading, error, refetch, statusChangedIds } = useAdminOrders();

  const [selectedOrder, setSelectedOrder] = useState<AdminOrderJoined | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sellerFilter, setSellerFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Extract unique sellers for filter dropdown
  const sellerNames = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.sellerName))).filter(Boolean);
  }, [orders]);

  // Compute summary metrics
  const totalOrdersCount = orders.length;
  const inProgressCount = orders.filter((o) =>
    ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status),
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const awaitingSellerCount = orders.filter((o) => o.status === "PLACED").length;
  // Unassigned rider = PACKED with no rider
  const unassignedRiderCount = orders.filter(
    (o) => o.status === "PACKED" && (!o.riderName || o.riderName.trim() === ""),
  ).length;

  // Filtered orders (Newest first)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (sellerFilter !== "ALL" && o.sellerName !== sellerFilter) return false;
      if (paymentFilter !== "ALL" && o.paymentStatus !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = o.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.includes(q);
        if (!matchesNumber && !matchesCustomer && !matchesPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, sellerFilter, paymentFilter, searchQuery]);

  // Pagination slice
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // 1. Role-check: only admins can view this page
  if (!authLoading && (!isAuthenticated || adminUser?.role !== "admin")) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50/50 p-8 shadow-xs">
          <ShieldAlert className="mx-auto h-12 w-12 text-[#E11D2A]" />
          <h2 className="mt-4 font-display font-black text-xl text-gray-900">
            Admin Access Restricted
          </h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            This live operations console requires an authenticated Administrator session. Customer
            and vendor accounts are not permitted to inspect system-wide logistics.
          </p>
          <a
            href="/admin/login"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E11D2A] hover:bg-[#c91823] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
          >
            <span>Sign in to Admin Console</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display font-black text-2xl text-gray-900 tracking-tight">
              Live Orders Operations Board
            </h1>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                USE_MOCK ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {USE_MOCK ? "Mock Adapter (6s Poll)" : "Live Backend Sync"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time joined view of all marketplace orders across customers, sellers, and dispatch
            riders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error state with Retry that preserves existing data */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs flex items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              <strong>Sync Error:</strong> {error}. Showing cached operations board data.
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

      {/* SUMMARY STRIP (5 Cards as specified in Task 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Total Orders</span>
          <p className="font-display text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {loading && orders.length === 0 ? "—" : totalOrdersCount}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">All marketplace transactions</p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-blue-700">In Progress</span>
          <p className="font-display text-2xl sm:text-3xl font-black text-blue-600 mt-2">
            {loading && orders.length === 0 ? "—" : inProgressCount}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Accepted through transit</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-700">Delivered</span>
          <p className="font-display text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {loading && orders.length === 0 ? "—" : deliveredCount}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Successfully fulfilled</p>
        </div>

        {/* Awaiting Seller Action (PLACED) */}
        <div
          onClick={() => {
            setStatusFilter("PLACED");
            setCurrentPage(1);
          }}
          className={`p-4 sm:p-5 rounded-2xl border shadow-2xs cursor-pointer transition ${
            statusFilter === "PLACED"
              ? "bg-red-50/60 border-red-300 ring-2 ring-red-400/30"
              : "bg-white border-gray-200 hover:border-red-300"
          }`}
        >
          <span className="text-[11px] font-medium text-red-700">Awaiting Seller</span>
          <p className="font-display text-2xl sm:text-3xl font-black text-red-600 mt-2">
            {loading && orders.length === 0 ? "—" : awaitingSellerCount}
          </p>
          <p className="text-[10px] text-red-600/80 mt-1 font-bold">Status: PLACED</p>
        </div>

        {/* Unassigned Rider (PACKED with no rider) */}
        <div
          onClick={() => {
            setStatusFilter("PACKED");
            setCurrentPage(1);
          }}
          className={`p-4 sm:p-5 rounded-2xl border shadow-2xs cursor-pointer transition col-span-2 sm:col-span-1 ${
            statusFilter === "PACKED"
              ? "bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/30"
              : "bg-white border-gray-200 hover:border-amber-300"
          }`}
        >
          <span className="text-[11px] font-medium text-amber-800">Unassigned Rider</span>
          <p className="font-display text-2xl sm:text-3xl font-black text-amber-700 mt-2">
            {loading && orders.length === 0 ? "—" : unassignedRiderCount}
          </p>
          <p className="text-[10px] text-amber-700/80 mt-1 font-bold">PACKED awaiting rider</p>
        </div>
      </div>

      {/* FILTER & SEARCH STRIP */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search order #, customer, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E11D2A]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E11D2A]"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="PLACED">Placed / New</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PACKED">Packed</option>
            <option value="RIDER_ASSIGNED">Rider Assigned</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Seller Filter */}
          <select
            value={sellerFilter}
            onChange={(e) => {
              setSellerFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E11D2A]"
          >
            <option value="ALL">All Sellers</option>
            {sellerNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E11D2A]"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="COD_PENDING">COD_PENDING</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {(statusFilter !== "ALL" ||
          sellerFilter !== "ALL" ||
          paymentFilter !== "ALL" ||
          searchQuery) && (
          <button
            onClick={() => {
              setStatusFilter("ALL");
              setSellerFilter("ALL");
              setPaymentFilter("ALL");
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer shrink-0 self-start lg:self-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Skeletons on initial load */}
      {loading && orders.length === 0 && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-2xl bg-gray-200/70 border border-gray-200"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-2xs">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 font-display font-bold text-base text-gray-900">
            No orders match the selected filters
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your status, seller, or search keyword to view the complete order list.
          </p>
        </div>
      )}

      {/* PHONE-FRIENDLY CARD LIST (< 900px) */}
      <div className="lg:hidden space-y-3">
        {paginatedOrders.map((o) => {
          const isChanged = statusChangedIds.has(o.id);

          return (
            <div
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className={`rounded-2xl border bg-white p-4 shadow-2xs space-y-3 cursor-pointer transition-all duration-300 ${
                isChanged
                  ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/40"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-gray-900">{o.orderNumber}</span>
                  <span className="text-[10px] text-gray-400 ml-2">
                    {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <OrderStatusChip status={o.status} />
              </div>

              <div className="text-xs space-y-1">
                <p className="font-semibold text-gray-800">
                  Customer: <span className="text-gray-900">{o.customerName}</span> ({o.city})
                </p>
                <p className="text-gray-600">
                  Seller: <span className="font-medium text-gray-800">{o.sellerName}</span>
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-gray-500">Rider:</span>
                  {o.riderName ? (
                    <span className="font-medium text-purple-700">{o.riderName}</span>
                  ) : (
                    <span className="px-2 py-0.2 rounded bg-gray-100 text-gray-500 font-bold text-[10px]">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <div>
                  <PaymentStatusChip status={o.paymentStatus} method={o.paymentMethod} />
                </div>
                <span className="font-mono font-black text-gray-900">
                  ₹{o.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW (>= 900px) */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Order ID & Time</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Seller Name</th>
              <th className="py-3.5 px-4">Status Chip</th>
              <th className="py-3.5 px-4">Rider</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((o) => {
              const isChanged = statusChangedIds.has(o.id);

              return (
                <tr
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`transition-colors duration-300 cursor-pointer ${
                    isChanged ? "bg-amber-50/80 hover:bg-amber-100/70" : "hover:bg-gray-50/80"
                  }`}
                >
                  {/* Order Number & Time */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-900 text-xs">
                      {o.orderNumber}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      ·{" "}
                      {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-900">{o.customerName}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{o.customerPhone}</p>
                  </td>

                  {/* Seller Name */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800">{o.sellerName}</p>
                    <p className="text-[10px] text-gray-400">{o.city}</p>
                  </td>

                  {/* Status Chip */}
                  <td className="py-3.5 px-4">
                    <OrderStatusChip status={o.status} />
                  </td>

                  {/* Rider */}
                  <td className="py-3.5 px-4">
                    {o.riderName ? (
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{o.riderName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{o.riderPhone}</p>
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Payment Status & Method */}
                  <td className="py-3.5 px-4">
                    <PaymentStatusChip status={o.paymentStatus} method={o.paymentMethod} />
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-black text-gray-900 text-sm">
                      ₹{o.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Strip */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}{" "}
            orders
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white font-medium hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-gray-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white font-medium hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL SLIDE-OVER DRAWER (Task 3) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-gray-900">
                    {selectedOrder.orderNumber}
                  </span>
                  <OrderStatusChip status={selectedOrder.status} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 text-xs">
              {/* Customer & Delivery */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <User className="h-4 w-4 text-gray-600" />
                  <span>Customer Information</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-500 font-mono">{selectedOrder.customerPhone}</p>
                <p className="text-gray-700 flex items-start gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress}</span>
                </p>
              </div>

              {/* Seller Details */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <Store className="h-4 w-4 text-gray-600" />
                  <span>Fulfilling Seller</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedOrder.sellerName}</p>
                <p className="text-gray-500 font-mono">{selectedOrder.sellerPhone}</p>
                <p className="text-gray-700 flex items-start gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.sellerAddress}</span>
                </p>
              </div>

              {/* Rider Details */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <Truck className="h-4 w-4 text-purple-600" />
                  <span>Assigned Courier / Rider</span>
                </div>
                {selectedOrder.riderName ? (
                  <>
                    <p className="font-semibold text-gray-900">{selectedOrder.riderName}</p>
                    <p className="text-gray-500 font-mono">{selectedOrder.riderPhone}</p>
                  </>
                ) : (
                  <p className="text-amber-800 font-medium">
                    No rider assigned yet. Order is waiting for seller pack confirmation or
                    broadcast.
                  </p>
                )}
              </div>

              {/* Items Ordered */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Ordered Parts & Spares</h4>
                <div className="border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-semibold text-gray-900">{it.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {it.qty}</p>
                      </div>
                      <span className="font-mono font-bold text-gray-900">
                        ₹{(it.price * it.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-900">
                    <span>Total Order Amount</span>
                    <span className="font-mono text-sm">
                      ₹{selectedOrder.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    Payment Method
                  </span>
                  <p className="font-bold text-gray-900 text-xs mt-0.5">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <PaymentStatusChip
                    status={selectedOrder.paymentStatus}
                    method={selectedOrder.paymentMethod}
                  />
                </div>
              </div>

              {/* Status History Timeline */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Audit & Lifecycle Timeline</h4>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-200">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="relative flex items-start gap-3 pl-7">
                      <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#E11D2A] ring-4 ring-white" />
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{h.status}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(h.timestamp).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {h.note && <p className="text-gray-600 mt-1">{h.note}</p>}
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-gray-400">
                          Source: {h.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Status Chip with explicit text label and icon
 */
function OrderStatusChip({ status }: { status: OrderStatus }) {
  const map: Record<
    OrderStatus,
    { bg: string; text: string; label: string; icon: React.ReactNode }
  > = {
    PLACED: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      label: "Placed",
      icon: <Clock className="h-3 w-3 text-red-600" />,
    },
    ACCEPTED: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      label: "Accepted",
      icon: <CheckCircle2 className="h-3 w-3 text-blue-600" />,
    },
    PACKED: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      label: "Packed",
      icon: <Package className="h-3 w-3 text-amber-600" />,
    },
    RIDER_ASSIGNED: {
      bg: "bg-purple-50 border-purple-200",
      text: "text-purple-700",
      label: "Rider Assigned",
      icon: <Truck className="h-3 w-3 text-purple-600" />,
    },
    PICKED_UP: {
      bg: "bg-indigo-50 border-indigo-200",
      text: "text-indigo-700",
      label: "Picked Up",
      icon: <Truck className="h-3 w-3 text-indigo-600" />,
    },
    IN_TRANSIT: {
      bg: "bg-cyan-50 border-cyan-200",
      text: "text-cyan-800",
      label: "In Transit",
      icon: <Truck className="h-3 w-3 text-cyan-600" />,
    },
    DELIVERED: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      label: "Delivered",
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-600" />,
    },
    REJECTED: {
      bg: "bg-gray-100 border-gray-200",
      text: "text-gray-700",
      label: "Rejected",
      icon: <XCircle className="h-3 w-3 text-gray-500" />,
    },
    CANCELLED: {
      bg: "bg-gray-100 border-gray-200",
      text: "text-gray-700",
      label: "Cancelled",
      icon: <XCircle className="h-3 w-3 text-gray-500" />,
    },
  };

  const c = map[status] || {
    bg: "bg-gray-100 border-gray-200",
    text: "text-gray-700",
    label: status,
    icon: <Clock className="h-3 w-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${c.bg} ${c.text}`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
}

/**
 * Payment Status Chip with text label
 */
function PaymentStatusChip({ status, method }: { status: PaymentStatus; method?: string }) {
  const map: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
    PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "PAID", label: "PAID" },
    COD_PENDING: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      text: "COD_PENDING",
      label: "COD_PENDING",
    },
    PENDING: {
      bg: "bg-yellow-50 text-yellow-800 border-yellow-200",
      text: "PENDING",
      label: "PENDING",
    },
    FAILED: { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "FAILED", label: "FAILED" },
  };

  const c = map[status] || {
    bg: "bg-gray-100 text-gray-700 border-gray-200",
    text: status,
    label: status,
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${c.bg}`}
      >
        {c.label}
      </span>
      {method && <span className="text-[10px] text-gray-500 font-medium">{method}</span>}
    </div>
  );
}
