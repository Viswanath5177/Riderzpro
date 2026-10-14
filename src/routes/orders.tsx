// src/routes/orders.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Package,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Clock,
  Truck,
  Search,
  X,
  Store,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { getMyOrders, formatPaise, type ApiOrder } from "@/lib/api/orders";
import { getPaymentBadgeProps, getOrderStatusBadgeProps, isOrderActive } from "@/lib/orderStatus";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — RiderzPro" },
      { name: "description", content: "All your EV parts orders and their live courier status." },
      { property: "og:title", content: "My Orders — RiderzPro" },
      { property: "og:description", content: "Track all your RiderzPro orders." },
    ],
  }),
  component: OrdersPage,
});

type FilterTab = "all" | "active" | "delivered" | "cancelled";

const PAGE_SIZE = 10;

function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const { syncApiOrders } = useStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ApiOrder[], Error>({
    queryKey: ["orders", user?.id],
    queryFn: () => getMyOrders(user?.id),
    enabled: isAuthenticated && !!user?.id,
  });

  // Mirror into store for legacy parts of the app (dashboards, vendors, cart)
  useEffect(() => {
    if (orders && orders.length > 0) {
      syncApiOrders(orders);
    }
  }, [orders, syncApiOrders]);

  // Reset pagination on filter or search query change
  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchQuery]);

  // Filter & Search & Newest-first Sort
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // 1. Status Filter
        if (activeFilter === "active" && !isOrderActive(o.status)) return false;
        if (activeFilter === "delivered" && o.status !== "DELIVERED") return false;
        if (activeFilter === "cancelled" && o.status !== "CANCELLED" && o.status !== "RETURNED") {
          return false;
        }

        // 2. Search Query (orderNumber, item title, seller name)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesId = (o.orderNumber || o.id).toLowerCase().includes(q);
          const matchesItem = (o.items || []).some((it) => it.name.toLowerCase().includes(q));
          const matchesSeller = (o.sellers || []).some((s) => s.name.toLowerCase().includes(q));
          if (!matchesId && !matchesItem && !matchesSeller) return false;
        }

        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [orders, activeFilter, searchQuery]);

  // Client Pagination
  const pagedOrders = useMemo(() => {
    return filteredOrders.slice(0, page * PAGE_SIZE);
  }, [filteredOrders, page]);

  const hasMore = pagedOrders.length < filteredOrders.length;

  // Counts for filter chips
  const counts = useMemo(() => {
    let active = 0;
    let delivered = 0;
    let cancelled = 0;
    orders.forEach((o) => {
      if (isOrderActive(o.status)) active++;
      else if (o.status === "DELIVERED") delivered++;
      else if (o.status === "CANCELLED" || o.status === "RETURNED") cancelled++;
    });
    return {
      all: orders.length,
      active,
      delivered,
      cancelled,
    };
  }, [orders]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
                My Orders
              </h1>
              {isAuthenticated && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  {orders.length} Total
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Live fulfillment status, item snapshots, and delivery receipts.
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* State 1: Signed Out */}
        {!isAuthenticated ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-10 sm:p-14 text-center shadow-2xs space-y-4">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-[#E31E24]">
              <Package className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Sign in to view your orders
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Please sign in with your customer account to view your past purchases, courier
              tracking, and invoices.
            </p>
            <div className="pt-2">
              <Link
                to="/auth"
                search={{ redirect: "/orders" } as { redirect?: string }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] hover:bg-red-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition"
              >
                Sign in to your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          /* State 2: Skeleton Loading */
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                  <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                  <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-4 w-1/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* State 3: Error State + Retry */
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
            <h2 className="text-base font-bold text-gray-900">Failed to load orders</h2>
            <p className="text-xs text-gray-600">
              {error?.message || "An unexpected error occurred while fetching your orders."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* State 4: Global Empty State */
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 sm:p-16 text-center space-y-4">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-500">
              <Package className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Explore our genuine Delhi EV parts catalog.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition"
              >
                <span>Start Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* State 5: Order List with Filters, Search, Cards, and Pagination */
          <div className="mt-6 space-y-6">
            {/* Filter Chips & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeFilter === "all"
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("active")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeFilter === "active"
                      ? "bg-[#E31E24] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Active ({counts.active})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("delivered")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeFilter === "delivered"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Delivered ({counts.delivered})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("cancelled")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeFilter === "cancelled"
                      ? "bg-rose-700 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cancelled ({counts.cancelled})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, items, sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-8 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Empty State */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center space-y-3">
                <Search className="mx-auto h-7 w-7 text-gray-400" />
                <h3 className="text-base font-bold text-gray-900">No orders match your filter</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different status filter chip.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Order Cards List */
              <div className="space-y-4">
                {pagedOrders.map((o) => {
                  const itemCount = (o.items || []).reduce((sum, it) => sum + (it.qty || 1), 0);
                  const dateStr = new Date(o.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });
                  const paymentBadge = getPaymentBadgeProps(o.payment?.status || "PENDING");
                  const orderStatusBadge = getOrderStatusBadgeProps(o.status);
                  const formattedTotal = formatPaise(o.totalPaise);

                  // Extract item thumbnails
                  const itemThumbnails = (o.items || []).slice(0, 3).map((it) => {
                    const prod = getProduct(it.productId);
                    const src = it.imageUrl || prod?.image;
                    return { id: it.productId, title: it.name, src };
                  });
                  const extraItemCount = Math.max(0, (o.items || []).length - 3);

                  // Extract seller summary
                  const sellerNames = (o.sellers || []).map((s) => s.name).filter(Boolean);
                  const sellerSummary =
                    sellerNames.length > 0 ? sellerNames.join(", ") : "RiderzPro Verified Supplier";

                  return (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-gray-300 hover:shadow-xs transition space-y-4"
                    >
                      {/* Top Ribbon */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to="/order/$id"
                            params={{ id: o.id }}
                            className="font-mono font-bold text-sm text-gray-900 hover:text-[#E31E24] transition"
                          >
                            {o.orderNumber || o.id}
                          </Link>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${paymentBadge.className}`}
                          >
                            {paymentBadge.label}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${orderStatusBadge.className}`}
                          >
                            {orderStatusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Thumbnails & Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          {/* Item Thumbnails */}
                          <div className="flex items-center gap-2">
                            {itemThumbnails.map((th, idx) => (
                              <div
                                key={`${th.id}-${idx}`}
                                className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center p-1"
                                title={th.title}
                              >
                                {th.src ? (
                                  <img
                                    src={th.src}
                                    alt={th.title}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <Package className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            ))}
                            {extraItemCount > 0 && (
                              <div className="h-12 px-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">
                                +{extraItemCount} more
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-600 space-y-0.5">
                            <p>
                              {itemCount} item{itemCount !== 1 ? "s" : ""} · Deliver to{" "}
                              <strong className="text-gray-900">
                                {o.shippingAddress?.locality || "Delhi"}
                              </strong>{" "}
                              ({o.shippingAddress?.pincode})
                            </p>
                            <p className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Store className="h-3 w-3 text-gray-400" />
                              <span>Fulfillment: {sellerSummary}</span>
                            </p>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <p className="text-lg font-extrabold text-[#E31E24]">{formattedTotal}</p>

                          <div className="flex items-center gap-2">
                            <Link
                              to="/order/$id"
                              params={{ id: o.id }}
                              className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                            >
                              <span>View Details</span>
                            </Link>
                            <Link
                              to="/track/$id"
                              params={{ id: o.id }}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#E31E24] px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs"
                            >
                              <Truck className="h-3.5 w-3.5" />
                              <span>Track</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination "Load More" */}
                {hasMore && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev + 1)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-2xs"
                    >
                      <span>Load More Orders</span>
                      <span className="text-gray-400">
                        ({filteredOrders.length - pagedOrders.length} remaining)
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
