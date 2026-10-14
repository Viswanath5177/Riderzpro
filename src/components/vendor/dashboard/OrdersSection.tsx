import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Bike,
  Truck,
  MapPin,
  AlertCircle,
  Check,
  Search,
  RefreshCw,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Vendor } from "@/lib/vendor/types";
import {
  useSellerOrders,
  updateSellerOrder,
  SellerOrder,
  SellerOrderStatus,
  SellerOrderAction,
  USE_MOCK,
  ApiError,
} from "../sellerOrdersApi";

interface OrdersSectionProps {
  vendor: Vendor;
  onPlacedCountChange?: (count: number) => void;
}

type FilterTab = "ALL" | "NEW" | "IN_PROGRESS" | "COMPLETED" | "REJECTED_CANCELLED";

const PROGRESS_STEPS: { key: SellerOrderStatus; label: string }[] = [
  { key: "PLACED", label: "Placed" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "PACKED", label: "Packed" },
  { key: "RIDER_ASSIGNED", label: "Rider Assigned" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERED", label: "Delivered" },
];

function getStepIndex(status: SellerOrderStatus): number {
  switch (status) {
    case "PLACED":
      return 0;
    case "ACCEPTED":
      return 1;
    case "PACKED":
      return 2;
    case "RIDER_ASSIGNED":
      return 3;
    case "PICKED_UP":
      return 4;
    case "IN_TRANSIT":
      return 5;
    case "DELIVERED":
      return 6;
    default:
      return -1;
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 45000) return "Just now";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "Recently";
  }
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function OrdersSection({ vendor, onPlacedCountChange }: OrdersSectionProps) {
  const { orders, loading, error, refetch, newOrderIds, clearNewOrderId } = useSellerOrders();

  // Local optimistic orders state for instantaneous UI responses
  const [localOrders, setLocalOrders] = useState<SellerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pending action tracking: orderId -> true
  const [pendingActions, setPendingActions] = useState<Record<string, boolean>>({});

  // Confirmation Modals State
  const [rejectModalOrder, setRejectModalOrder] = useState<SellerOrder | null>(null);
  const [rejectReason, setRejectReason] = useState("Inventory discrepancy / Out of stock");
  const [customRejectReason, setCustomRejectReason] = useState("");

  const [packModalOrder, setPackModalOrder] = useState<SellerOrder | null>(null);

  // Sync server/mock orders with local state
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Report PLACED count upward
  const placedCount = useMemo(() => {
    return localOrders.filter((o) => o.status === "PLACED").length;
  }, [localOrders]);

  useEffect(() => {
    if (onPlacedCountChange) {
      onPlacedCountChange(placedCount);
    }
  }, [placedCount, onPlacedCountChange]);

  // Toast notifications for newly arrived orders & auto-clear highlight after 8s
  const notifiedIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    newOrderIds.forEach((id) => {
      if (!notifiedIds.current.has(id)) {
        notifiedIds.current.add(id);
        const order = localOrders.find((o) => o.id === id);
        if (order) {
          toast.info(`New order #${order.orderNumber} received!`, {
            description: `${order.customerName} · ${order.deliveryCity} (${formatINR(order.amount)})`,
            duration: 6000,
          });
        }
        // Auto-fade highlight pulse after 8 seconds
        setTimeout(() => {
          clearNewOrderId(id);
        }, 8000);
      }
    });
  }, [newOrderIds, localOrders, clearNewOrderId]);

  // Filter calculations
  const countsByTab = useMemo(() => {
    return {
      ALL: localOrders.length,
      NEW: localOrders.filter((o) => o.status === "PLACED").length,
      IN_PROGRESS: localOrders.filter((o) =>
        ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status)
      ).length,
      COMPLETED: localOrders.filter((o) => o.status === "DELIVERED").length,
      REJECTED_CANCELLED: localOrders.filter((o) =>
        ["REJECTED", "CANCELLED"].includes(o.status)
      ).length,
    };
  }, [localOrders]);

  const filteredOrders = useMemo(() => {
    return localOrders.filter((order) => {
      // Tab filter
      if (activeTab === "NEW" && order.status !== "PLACED") return false;
      if (
        activeTab === "IN_PROGRESS" &&
        !["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(order.status)
      ) {
        return false;
      }
      if (activeTab === "COMPLETED" && order.status !== "DELIVERED") return false;
      if (
        activeTab === "REJECTED_CANCELLED" &&
        !["REJECTED", "CANCELLED"].includes(order.status)
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = order.orderNumber.toLowerCase().includes(q);
        const matchesCust = order.customerName.toLowerCase().includes(q);
        const matchesCity = order.deliveryCity.toLowerCase().includes(q);
        const matchesItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesNum && !matchesCust && !matchesCity && !matchesItem) {
          return false;
        }
      }

      return true;
    });
  }, [localOrders, activeTab, searchQuery]);

  // Handle manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Orders refreshed");
    } catch {
      // error handled by hook
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generic Order Action with Optimistic Update and Rollback
  const performOrderAction = async (
    order: SellerOrder,
    action: SellerOrderAction,
    reason?: string
  ) => {
    if (pendingActions[order.id]) return;

    // Snapshot previous state for rollback
    const previousOrders = [...localOrders];

    // Optimistically calculate next status
    let nextStatus: SellerOrderStatus = order.status;
    if (action === "accept") nextStatus = "ACCEPTED";
    if (action === "reject") nextStatus = "REJECTED";
    if (action === "packed") nextStatus = "PACKED";

    setPendingActions((prev) => ({ ...prev, [order.id]: true }));

    // Apply optimistic update
    setLocalOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: nextStatus,
              rejectReason: action === "reject" ? reason || "Order rejected by seller" : o.rejectReason,
            }
          : o
      )
    );

    try {
      const updated = await updateSellerOrder(order.id, action, reason);

      // Reconcile with updated order
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updated : o))
      );

      if (action === "accept") {
        toast.success(`Order #${order.orderNumber} accepted! Start packing.`);
      } else if (action === "packed") {
        toast.success(`Order #${order.orderNumber} marked packed! Waiting for rider assignment.`);
      } else if (action === "reject") {
        toast.warning(`Order #${order.orderNumber} rejected.`);
      }
    } catch (err: unknown) {
      // Rollback optimistic update
      setLocalOrders(previousOrders);

      if (err instanceof ApiError) {
        if (err.status === 401) {
          toast.error("Session expired. Redirecting to login...");
          if (typeof window !== "undefined") {
            window.location.href = "/vendor/auth";
          }
          return;
        }
        if (err.status === 409) {
          toast.error("Order status has changed. Refreshing orders...");
          await refetch();
          return;
        }
        toast.error(err.message || "Failed to update order");
      } else {
        toast.error("Failed to update order. Please try again.");
      }
    } finally {
      setPendingActions((prev) => {
        const next = { ...prev };
        delete next[order.id];
        return next;
      });
    }
  };

  // Status Chip Renderer
  const renderStatusChip = (status: SellerOrderStatus) => {
    switch (status) {
      case "PLACED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 ring-2 ring-amber-500/10 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Placed (New)</span>
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300 ring-2 ring-blue-500/10 shadow-xs">
            <Check className="h-3.5 w-3.5 text-blue-600" />
            <span>Accepted</span>
          </span>
        );
      case "PACKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 ring-2 ring-indigo-500/10 shadow-xs">
            <Package className="h-3.5 w-3.5 text-indigo-600" />
            <span>Packed & Ready</span>
          </span>
        );
      case "RIDER_ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300 ring-2 ring-orange-500/10 shadow-xs">
            <Bike className="h-3.5 w-3.5 text-orange-600" />
            <span>Rider Assigned</span>
          </span>
        );
      case "PICKED_UP":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300 ring-2 ring-orange-500/10 shadow-xs">
            <Bike className="h-3.5 w-3.5 text-orange-600" />
            <span>Picked Up</span>
          </span>
        );
      case "IN_TRANSIT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300 ring-2 ring-orange-500/10 shadow-xs">
            <Truck className="h-3.5 w-3.5 text-orange-600" />
            <span>In Transit</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 ring-2 ring-rose-500/10 shadow-xs">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 ring-2 ring-rose-500/10 shadow-xs">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  // Compact Stepper Renderer
  const renderProgressStepper = (order: SellerOrder) => {
    const isCancelledOrRejected = order.status === "REJECTED" || order.status === "CANCELLED";

    if (isCancelledOrRejected) {
      return (
        <div className="rounded-xl bg-rose-50/80 border border-rose-200/80 p-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-900">
              {order.status === "REJECTED" ? "Order Rejected by Store" : "Order Cancelled"}
            </p>
            {order.rejectReason && (
              <p className="text-rose-700 mt-0.5">{order.rejectReason}</p>
            )}
          </div>
        </div>
      );
    }

    const currentStepIdx = getStepIndex(order.status);

    return (
      <div className="w-full py-2">
        {/* Stepper on Desktop/Tablet */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Track line behind steps */}
          <div className="absolute left-4 right-4 top-3.5 -translate-y-1/2 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-[#E31E24] transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIdx) / (PROGRESS_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {PROGRESS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIdx > idx;
            const isCurrent = currentStepIdx === idx;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ring-4 ring-white",
                    isCompleted && "bg-[#E31E24] text-white shadow-xs",
                    isCurrent && "bg-white border-2 border-[#E31E24] text-[#E31E24] ring-[#E31E24]/20 shadow-sm scale-110",
                    !isCompleted && !isCurrent && "bg-gray-100 border border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1.5 font-medium whitespace-nowrap transition-colors",
                    isCurrent ? "font-bold text-[#E31E24]" : isCompleted ? "text-gray-800" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stepper on Mobile (Compact Bar) */}
        <div className="sm:hidden space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-gray-600">Fulfillment Progress</span>
            <span className="font-bold text-[#E31E24]">
              {PROGRESS_STEPS[currentStepIdx]?.label || order.status}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{
                width: `${((currentStepIdx + 1) / PROGRESS_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Action Buttons / Status Notes Renderer
  const renderOrderActions = (order: SellerOrder) => {
    const isPending = !!pendingActions[order.id];

    switch (order.status) {
      case "PLACED":
        return (
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            <button
              type="button"
              disabled={isPending}
              onClick={() => performOrderAction(order, "accept")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E31E24] hover:bg-red-700 active:scale-95 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 stroke-[2.5]" />
              )}
              <span>Accept Order</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setRejectReason("Inventory discrepancy / Out of stock");
                setCustomRejectReason("");
                setRejectModalOrder(order);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 px-3.5 py-2.5 text-xs font-bold text-gray-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <XCircle className="h-4 w-4 text-gray-500 hover:text-red-600" />
              <span>Reject</span>
            </button>
          </div>
        );

      case "ACCEPTED":
        return (
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setPackModalOrder(order)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Package className="h-4 w-4" />
              )}
              <span>Mark Packed</span>
            </button>
          </div>
        );

      case "PACKED":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200/80 px-3 py-2 text-xs font-semibold text-indigo-900 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
            </span>
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            <span>Waiting for rider assignment</span>
          </div>
        );

      case "RIDER_ASSIGNED":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200/80 px-3 py-2 text-xs font-semibold text-orange-950">
            <Bike className="h-4 w-4 text-orange-600" />
            <span>Rider assigned & heading to store</span>
          </div>
        );

      case "PICKED_UP":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200/80 px-3 py-2 text-xs font-semibold text-orange-950">
            <Bike className="h-4 w-4 text-orange-600" />
            <span>Picked up by rider</span>
          </div>
        );

      case "IN_TRANSIT":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200/80 px-3 py-2 text-xs font-semibold text-orange-950">
            <Truck className="h-4 w-4 text-orange-600" />
            <span>On the way to customer</span>
          </div>
        );

      case "DELIVERED":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-2 text-xs font-semibold text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Delivered & Closed</span>
          </div>
        );

      case "REJECTED":
      case "CANCELLED":
        return (
          <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600">
            <XCircle className="h-4 w-4 text-gray-500" />
            <span>Closed</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner / Mode indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 tracking-tight">
              Seller Orders Central
            </h2>
            {USE_MOCK ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <Sparkles className="h-3 w-3" /> Mock Simulation Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                <ShieldCheck className="h-3 w-3" /> Live API Connected
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Accept incoming client orders, pack components, and monitor rider dispatch to Noida customers.
          </p>
        </div>

        {/* Refresh & status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Refresh orders list"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-[#E31E24]")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error Banner with Retry (Preserves existing list) */}
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center justify-between gap-3 text-rose-900 text-xs shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Sync Error</p>
              <p className="text-rose-700">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer",
              activeTab === "ALL"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-gray-900 border border-black/[0.06] hover:bg-gray-50"
            )}
          >
            <span>All</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                activeTab === "ALL" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              )}
            >
              {countsByTab.ALL}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("NEW")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer",
              activeTab === "NEW"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-gray-900 border border-black/[0.06] hover:bg-gray-50"
            )}
          >
            <span>New</span>
            {countsByTab.NEW > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-black",
                  activeTab === "NEW" ? "bg-white text-amber-600" : "bg-amber-100 text-amber-800"
                )}
              >
                {countsByTab.NEW}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer",
              activeTab === "IN_PROGRESS"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-gray-900 border border-black/[0.06] hover:bg-gray-50"
            )}
          >
            <span>In Progress</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                activeTab === "IN_PROGRESS" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              )}
            >
              {countsByTab.IN_PROGRESS}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer",
              activeTab === "COMPLETED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-gray-900 border border-black/[0.06] hover:bg-gray-50"
            )}
          >
            <span>Completed</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                activeTab === "COMPLETED" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              )}
            >
              {countsByTab.COMPLETED}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("REJECTED_CANCELLED")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer",
              activeTab === "REJECTED_CANCELLED"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-gray-600 hover:text-gray-900 border border-black/[0.06] hover:bg-gray-50"
            )}
          >
            <span>Rejected / Cancelled</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                activeTab === "REJECTED_CANCELLED" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              )}
            >
              {countsByTab.REJECTED_CANCELLED}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, item..."
            className="w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 py-2 text-xs placeholder:text-gray-400 focus:border-[#E31E24] focus:outline-none focus:ring-2 focus:ring-[#E31E24]/10 shadow-2xs"
          />
        </div>
      </div>

      {/* Orders List Area */}
      {loading && localOrders.length === 0 ? (
        // Loading Skeletons
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-gray-200 rounded-md" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="h-4 w-48 bg-gray-100 rounded-md" />
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        // Empty State
        <div className="rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 bg-white/70 p-12 text-center shadow-xs">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-400">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-gray-900">
            {searchQuery ? "No matching orders found" : "No orders yet"}
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? `No orders matched "${searchQuery}". Clear your search query to see all records.`
              : "No orders yet. New orders appear here automatically."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        // Orders Feed
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isNew = newOrderIds.has(order.id);

            return (
              <div
                key={order.id}
                className={cn(
                  "bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-6 shadow-xs relative overflow-hidden",
                  isNew
                    ? "border-amber-400 ring-4 ring-amber-400/20 bg-amber-50/[0.12] animate-pulse"
                    : "border-black/[0.06] hover:border-black/[0.12] hover:shadow-md"
                )}
              >
                {/* Brand new highlight tag */}
                {isNew && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white font-black text-[9px] tracking-wider uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>NEW ORDER</span>
                  </div>
                )}

                {/* Top Row: Order ID, Timestamp & Status Chip */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-mono font-black text-sm sm:text-base text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{formatRelativeTime(order.createdAt)}</span>
                    </span>
                    {order.paymentStatus === "PAID" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                        <span>PAID</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span>{order.paymentStatus}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStatusChip(order.status)}
                  </div>
                </div>

                {/* Middle Row: Customer Details & Order Amount */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 border-b border-black/[0.04]">
                  {/* Customer Info */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Customer & Destination
                    </p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{order.customerName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#E31E24] shrink-0" />
                      <span className="truncate">{order.deliveryCity}</span>
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Payment Details
                    </p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{order.paymentMethod}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Status: <span className="font-semibold text-gray-700">{order.paymentStatus}</span>
                    </p>
                  </div>

                  {/* Total Value */}
                  <div className="md:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Order Amount
                    </p>
                    <p className="text-base sm:text-lg font-black text-gray-900 font-display mt-0.5">
                      {formatINR(order.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {order.items.reduce((s, i) => s + i.qty, 0)} item
                      {order.items.reduce((s, i) => s + i.qty, 0) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Items Summary Breakdown */}
                <div className="py-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Items to Pack & Dispatch
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-gray-50/80 border border-gray-100 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-white text-[10px] font-bold text-gray-700 border border-gray-200 shrink-0">
                            {item.qty}x
                          </span>
                          <span className="font-medium text-gray-800 truncate" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold text-gray-700 shrink-0">
                          {formatINR(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stepper Progression */}
                <div className="py-2 border-t border-black/[0.04]">
                  {renderProgressStepper(order)}
                </div>

                {/* Rider Assignment Snippet (Shown ONLY from RIDER_ASSIGNED onward) */}
                {["RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"].includes(order.status) &&
                  order.rider && (
                    <div className="mt-2 p-3 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/50 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-600 text-white shadow-xs shrink-0">
                          <Bike className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100/80 px-1.5 py-0.2 rounded-sm">
                              Delivery Partner
                            </span>
                            <span className="text-xs font-bold text-gray-900">
                              {order.rider.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            Rider Assigned for Noida Hub Route
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${order.rider.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-orange-100/60 border border-orange-300 px-3 py-1.5 text-xs font-bold text-orange-950 shadow-2xs hover:shadow-xs transition cursor-pointer self-start sm:self-auto"
                      >
                        <Phone className="h-3.5 w-3.5 text-orange-600" />
                        <span>{order.rider.phone}</span>
                      </a>
                    </div>
                  )}

                {/* Bottom Actions Row */}
                <div className="mt-3 pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-500 font-medium">
                    Store Order ID: <span className="font-mono text-gray-700">{order.id}</span>
                  </div>

                  <div>{renderOrderActions(order)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-gray-100">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  Reject Order #{rejectModalOrder.orderNumber}?
                </h3>
                <p className="text-xs text-gray-500">
                  Client will be notified and issued an automatic refund.
                </p>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-bold text-gray-700">
                Select Reason for Rejection:
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-red-500 focus:outline-none"
              >
                <option value="Inventory discrepancy / Out of stock">
                  Inventory discrepancy / Out of stock
                </option>
                <option value="Store closing / Operational hours ended">
                  Store closing / Operational hours ended
                </option>
                <option value="Delivery address out of service range">
                  Delivery address out of service range
                </option>
                <option value="Product damaged in warehouse">Product damaged in warehouse</option>
                <option value="Other reason">Other reason</option>
              </select>

              {rejectReason === "Other reason" && (
                <textarea
                  rows={2}
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  placeholder="Specify brief reason for customer notification..."
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-red-500 focus:outline-none"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalReason =
                    rejectReason === "Other reason"
                      ? customRejectReason || "Order rejected by seller"
                      : rejectReason;
                  const target = rejectModalOrder;
                  setRejectModalOrder(null);
                  performOrderAction(target, "reject", finalReason);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK PACKED CONFIRMATION MODAL */}
      {packModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  Mark Order #{packModalOrder.orderNumber} as Packed?
                </h3>
                <p className="text-xs text-gray-500">
                  Confirm all components are packed and ready for rider pickup.
                </p>
              </div>
            </div>

            <div className="py-4 space-y-2">
              <p className="text-xs font-bold text-gray-700">Packing checklist:</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {packModalOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 text-xs text-gray-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{item.qty}x</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 italic pt-1">
                Once marked packed, nearby delivery riders will be alerted for immediate pickup.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPackModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = packModalOrder;
                  setPackModalOrder(null);
                  performOrderAction(target, "packed");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition cursor-pointer"
              >
                Confirm Packed & Ready
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
