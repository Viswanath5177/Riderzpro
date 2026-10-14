import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  User,
  ShieldCheck,
  ChevronRight,
  Eye,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import {
  fetchDeliveries,
  clearAllDeliveries,
  type BackendDelivery,
  ACTIVE_DELIVERY_STATUSES,
  COMPLETED_DELIVERY_STATUSES,
  isDeliveryActive,
  isDeliveryCompleted,
} from "@/lib/api";
import { getProduct, riders, inr } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Unified Delivery Item representation for Hub
// ─────────────────────────────────────────────────────────────────────────────

interface UnifiedDelivery {
  canonicalOrderId: string;
  deliveryId: string;
  status: string;
  isActive: boolean;
  isCompleted: boolean;
  riderName?: string;
  riderVehicle?: string;
  riderPhone?: string;
  etaMinutes?: number;
  destinationAddress?: string;
  lastKnownStatus?: string;
  itemsSummary: string;
  totalAmount?: number;
  createdAt?: string | number;
  order?: Order;
}

/**
 * Summarize order items for clean presentation.
 */
function getOrderItemsSummary(order?: Order, fallback?: string): string {
  if (!order || !order.groups?.length) {
    return fallback || "Automotive EV Parts Package";
  }
  const allItems = order.groups.flatMap((g) => g.items || []);
  if (!allItems.length) {
    return fallback || "Automotive EV Parts Package";
  }

  const firstItem = allItems[0];
  const product = firstItem ? getProduct(firstItem.productId) : null;
  const productName = product?.name || "EV Spare Part";
  const totalCount = allItems.reduce((acc, it) => acc + (it.qty || 1), 0);

  if (totalCount > 1) {
    return `${productName} + ${totalCount - 1} more item${totalCount - 1 > 1 ? "s" : ""}`;
  }
  return `${productName} · 1 item`;
}

/**
 * Format status badges adhering to RiderzPro design language.
 */
function getStatusBadge(status: string) {
  const norm = status.toLowerCase().trim();
  switch (norm) {
    case "in_transit":
      return {
        label: "In Transit",
        icon: "🟢",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    case "picked_up":
      return {
        label: "Picked Up",
        icon: "🟢",
        badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
        dotClass: "bg-blue-500",
      };
    case "assigned":
      return {
        label: "Rider Assigned",
        icon: "🟢",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
        dotClass: "bg-amber-500",
      };
    case "delivered":
      return {
        label: "Delivered",
        icon: "✓",
        badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
        dotClass: "bg-emerald-600",
      };
    case "pending":
      return {
        label: "Pending Dispatch",
        icon: "🟡",
        badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
        dotClass: "bg-gray-400",
      };
    default:
      return {
        label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: "•",
        badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
        dotClass: "bg-gray-400",
      };
  }
}

/**
 * Describe last known status narrative.
 */
function getLastKnownStatus(status: string, riderName?: string): string {
  const norm = status.toLowerCase().trim();
  switch (norm) {
    case "in_transit":
      return riderName
        ? `${riderName} is en route to delivery destination`
        : "Courier rider is en route to delivery destination";
    case "picked_up":
      return "Package collected from vendor dispatch facility";
    case "assigned":
      return riderName
        ? `${riderName} assigned — heading to vendor hub for pickup`
        : "Courier rider assigned — heading to vendor hub";
    case "delivered":
      return "Package successfully delivered to recipient";
    case "pending":
      return "Order confirmed — dispatch team assigning nearest rider";
    default:
      return "Order fulfillment in progress";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Track Your Deliveries Hub
// ─────────────────────────────────────────────────────────────────────────────

export function TrackingTab() {
  const { orders, userProfile, clearOrders } = useStore();
  const navigate = useNavigate();

  const [backendDeliveries, setBackendDeliveries] = useState<BackendDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [connectId, setConnectId] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  // Load deliveries from Logistics backend
  const loadDeliveries = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetchDeliveries({ limit: 100 });
      if (res?.items && Array.isArray(res.items)) {
        setBackendDeliveries(res.items);
      } else {
        setBackendDeliveries([]);
      }
    } catch (err) {
      console.warn("Could not load backend logistics deliveries:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  // Merge backend deliveries with customer store orders into a unified list
  const unifiedDeliveries = useMemo<UnifiedDelivery[]>(() => {
    const list: UnifiedDelivery[] = [];
    const processedIds = new Set<string>();

    // 1. Process real backend deliveries
    backendDeliveries.forEach((del) => {
      const canonicalOrderId = del.order_id || del.id;
      if (processedIds.has(canonicalOrderId)) return;
      processedIds.add(canonicalOrderId);

      // Find matching local order if available
      const linkedOrder = orders.find(
        (o) => o.id === canonicalOrderId || o.id === del.id || o.shipmentId === del.id
      );

      const status = del.status || "pending";
      const isActive = isDeliveryActive(status);
      const isCompleted = isDeliveryCompleted(status);

      // Rider details
      const riderName =
        del.assigned_rider?.name ||
        (linkedOrder?.riderId ? riders.find((r) => r.id === linkedOrder.riderId)?.name : undefined);
      const riderVehicle = del.assigned_rider?.vehicle_type?.replace(/_/g, " ");
      const riderPhone = del.assigned_rider?.phone;

      // ETA (Real duration from backend route if available; no fake calculation)
      const etaMinutes =
        del.latest_route?.duration_minutes !== undefined && del.latest_route?.duration_minutes !== null
          ? Math.round(del.latest_route.duration_minutes)
          : linkedOrder?.eta;

      // Destination
      const destinationAddress =
        del.dropoff_address ||
        (linkedOrder?.shippingAddress
          ? `${linkedOrder.shippingAddress.street}, ${linkedOrder.shippingAddress.city}`
          : undefined);

      const itemsSummary = getOrderItemsSummary(
        linkedOrder,
        del.package_weight_kg ? `Automotive EV Package (${del.package_weight_kg} kg)` : undefined
      );

      list.push({
        canonicalOrderId,
        deliveryId: del.id,
        status,
        isActive,
        isCompleted,
        riderName,
        riderVehicle,
        riderPhone,
        etaMinutes,
        destinationAddress,
        lastKnownStatus: getLastKnownStatus(status, riderName),
        itemsSummary,
        totalAmount: linkedOrder?.total,
        createdAt: del.created_at || linkedOrder?.createdAt,
        order: linkedOrder,
      });
    });

    // 2. Process any store orders not already tracked via backend deliveries
    orders.forEach((o) => {
      const canonicalOrderId = o.id;
      if (processedIds.has(canonicalOrderId)) return;
      processedIds.add(canonicalOrderId);

      // Map numerical status to delivery status
      const isCompleted = o.status === 5;
      const isActive = o.status >= 2 && o.status < 5;
      const status = isCompleted
        ? "delivered"
        : o.status === 4
        ? "in_transit"
        : o.status === 3
        ? "picked_up"
        : o.status === 2
        ? "assigned"
        : "pending";

      const rider = o.riderId ? riders.find((r) => r.id === o.riderId) : undefined;
      const riderName = rider?.name;
      const destinationAddress = o.shippingAddress
        ? `${o.shippingAddress.street}, ${o.shippingAddress.city}`
        : undefined;

      list.push({
        canonicalOrderId,
        deliveryId: o.shipmentId || o.id,
        status,
        isActive,
        isCompleted,
        riderName,
        riderVehicle: rider?.vehicle,
        etaMinutes: o.eta,
        destinationAddress,
        lastKnownStatus: getLastKnownStatus(status, riderName),
        itemsSummary: getOrderItemsSummary(o),
        totalAmount: o.total,
        createdAt: o.createdAt,
        order: o,
      });
    });

    return list;
  }, [backendDeliveries, orders]);

  // Partition into Active and Completed
  const activeDeliveries = useMemo(
    () => unifiedDeliveries.filter((d) => d.isActive),
    [unifiedDeliveries]
  );

  const completedDeliveries = useMemo(
    () => unifiedDeliveries.filter((d) => d.isCompleted),
    [unifiedDeliveries]
  );

  // Navigate to existing canonical tracking page
  const handleTrackLive = (orderId: string) => {
    navigate({ to: "/track/$id", params: { id: orderId } });
  };

  // Connect user's custom delivery/order directly
  const handleConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = connectId.trim();
    if (!trimmed) {
      toast.error("Please enter a valid Delivery ID or Order ID.");
      return;
    }
    navigate({ to: "/track/$id", params: { id: trimmed } });
  };

  // Clear all mock/existing delivery and order records
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllDeliveries().catch((err) => console.warn("Backend clear failed:", err));
      clearOrders();
      setBackendDeliveries([]);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("riderzpro-v8");
          localStorage.removeItem("riderzpro-v7");
          localStorage.removeItem("riderzpro-v6");
          localStorage.removeItem("riderzpro_orders");
          localStorage.removeItem("riderzpro_mock_orders");
        } catch {}
      }
      toast.success("All deliveries and orders cleared! Hub is clean and ready to connect.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to clear deliveries.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 font-display tracking-tight">
              Track Your Deliveries
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-[#E31E24] border border-red-100">
              <Truck className="h-3 w-3" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time courier dispatch status, assigned technicians, and GPS tracking hub.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => loadDeliveries(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition cursor-pointer disabled:opacity-60"
            title="Refresh delivery statuses"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-[#E31E24]")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={isClearing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 shadow-2xs transition cursor-pointer disabled:opacity-60"
            title="Clear all stored values to connect a clean delivery"
          >
            <Trash2 className={cn("h-3.5 w-3.5", isClearing && "animate-spin")} />
            <span>{isClearing ? "Clearing..." : "Clear All Values"}</span>
          </button>

          <Link
            to="/dashboard/customer"
            search={{ tab: "orders" } as any}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition"
          >
            <Package className="h-3.5 w-3.5" />
            <span>My Orders</span>
          </Link>
        </div>
      </div>

      {/* ── Direct Live Delivery Connect Bar ── */}
      <form onSubmit={handleConnect} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-gray-50/90 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Connect and track by Delivery ID or Order ID (e.g. ord_..., del_...)"
            value={connectId}
            onChange={(e) => setConnectId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-xs font-medium text-gray-900 placeholder-gray-400 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#E31E24] hover:bg-red-700 text-xs font-bold text-white shadow-xs transition cursor-pointer shrink-0"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Connect & Track</span>
        </button>
      </form>

      {/* ── Filter Pills: [ All (N) ] [ Active (X) ] [ Delivered (Y) ] ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
            filter === "all"
              ? "bg-[#111111] text-white shadow-xs"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          <span>All Deliveries</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              filter === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            )}
          >
            {unifiedDeliveries.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("active")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
            filter === "active"
              ? "bg-[#E31E24] text-white shadow-xs"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              filter === "active" ? "bg-white/20 text-white" : "bg-red-50 text-[#E31E24]"
            )}
          >
            {activeDeliveries.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("delivered")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
            filter === "delivered"
              ? "bg-emerald-700 text-white shadow-xs"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          <span>Delivered</span>
          <span
            className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              filter === "delivered" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
            )}
          >
            {completedDeliveries.length}
          </span>
        </button>
      </div>

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-5 bg-gray-200 rounded-full w-24" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-16 bg-gray-50 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded-xl w-32 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          {/* ═══════════════════════════════════════════════════════════════════
              ACTIVE DELIVERIES SECTION
              ═══════════════════════════════════════════════════════════════════ */}
          {(filter === "all" || filter === "active") && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Deliveries ({activeDeliveries.length})
                </h2>
              </div>

              {activeDeliveries.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {activeDeliveries.map((delivery) => {
                    const badge = getStatusBadge(delivery.status);

                    return (
                      <div
                        key={delivery.canonicalOrderId}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
                      >
                        {/* Top: Order ID & Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                              Order #{delivery.canonicalOrderId}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                              {delivery.itemsSummary}
                            </h3>
                          </div>

                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0",
                              badge.badgeClass
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", badge.dotClass)} />
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {/* Delivery Meta Details */}
                        <div className="rounded-xl bg-[#F8F9FA] border border-gray-100 p-3 space-y-2 text-xs">
                          {/* Rider info */}
                          {delivery.riderName && (
                            <div className="flex items-center justify-between text-gray-700">
                              <span className="text-gray-500 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-gray-400" />
                                Rider
                              </span>
                              <span className="font-semibold text-gray-900 flex items-center gap-1">
                                <span>{delivery.riderName}</span>
                                {delivery.riderVehicle && (
                                  <span className="text-[10px] text-gray-500 font-normal">
                                    ({delivery.riderVehicle})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Real ETA if available */}
                          {delivery.etaMinutes !== undefined && delivery.etaMinutes !== null && (
                            <div className="flex items-center justify-between text-gray-700">
                              <span className="text-gray-500 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-[#E31E24]" />
                                Estimated Arrival
                              </span>
                              <span className="font-bold text-[#E31E24] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                                ~{delivery.etaMinutes} min
                              </span>
                            </div>
                          )}

                          {/* Destination */}
                          {delivery.destinationAddress && (
                            <div className="flex items-start justify-between gap-2 text-gray-700">
                              <span className="text-gray-500 flex items-center gap-1.5 shrink-0 mt-0.5">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                Destination
                              </span>
                              <span className="font-medium text-gray-800 text-right text-[11px] truncate max-w-[200px]">
                                {delivery.destinationAddress}
                              </span>
                            </div>
                          )}

                          {/* Last known location status narrative */}
                          {delivery.lastKnownStatus && (
                            <div className="pt-1 border-t border-gray-200/60 text-[11px] text-gray-500 italic">
                              {delivery.lastKnownStatus}
                            </div>
                          )}
                        </div>

                        {/* Action row: Track Live */}
                        <div className="flex items-center justify-between pt-1">
                          {delivery.totalAmount && delivery.totalAmount > 0 ? (
                            <span className="text-xs text-gray-500 font-medium">
                              Total: <strong className="text-gray-900">{inr(delivery.totalAmount)}</strong>
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-mono">
                              Order #{delivery.canonicalOrderId}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleTrackLive(delivery.canonicalOrderId)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-98 transition cursor-pointer"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            <span>Track Live</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* No Active Deliveries Card */
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center space-y-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-50 text-gray-400 mx-auto border border-gray-100">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">No active deliveries</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Your active deliveries will appear here once an order is assigned for delivery.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <Link
                      to="/dashboard/customer"
                      search={{ tab: "orders" } as any}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="h-3.5 w-3.5" />
                      <span>View My Orders</span>
                    </Link>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Shop Parts</span>
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              COMPLETED DELIVERIES SECTION
              ═══════════════════════════════════════════════════════════════════ */}
          {(filter === "all" || filter === "delivered") && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Completed Deliveries ({completedDeliveries.length})
                </h2>
              </div>

              {completedDeliveries.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {completedDeliveries.map((delivery) => (
                    <div
                      key={delivery.canonicalOrderId}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
                    >
                      {/* Top: Order ID & Delivered Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                            Order #{delivery.canonicalOrderId}
                          </span>
                          <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                            {delivery.itemsSummary}
                          </h3>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Delivered</span>
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="rounded-xl bg-[#F8F9FA] border border-gray-100 p-3 space-y-1.5 text-xs text-gray-600">
                        {delivery.destinationAddress && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-400">Delivered to:</span>
                            <span className="font-medium text-gray-800 truncate text-right">
                              {delivery.destinationAddress}
                            </span>
                          </div>
                        )}
                        {delivery.createdAt && (
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Date:</span>
                            <span>
                              {typeof delivery.createdAt === "number"
                                ? new Date(delivery.createdAt).toLocaleDateString("en-IN")
                                : new Date(delivery.createdAt).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action: View Details / View Tracking */}
                      <div className="flex items-center justify-between pt-1">
                        {delivery.totalAmount && delivery.totalAmount > 0 ? (
                          <span className="text-xs text-gray-500 font-medium">
                            Paid: <strong className="text-gray-900">{inr(delivery.totalAmount)}</strong>
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Fulfillment Complete
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleTrackLive(delivery.canonicalOrderId)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-98 transition cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-gray-500" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                filter === "delivered" && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-xs text-gray-500">
                    No completed deliveries yet.
                  </div>
                )
              )}
            </section>
          )}

          {/* Completely empty state if customer has 0 deliveries and 0 orders */}
          {unifiedDeliveries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center space-y-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-50 text-gray-400 mx-auto">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No deliveries on record</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Your deliveries will appear here once you purchase EV parts and a courier is dispatched.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Shop EV Parts</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
