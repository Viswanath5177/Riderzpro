import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Package, ArrowRight, Check, MapPin, Download, RefreshCw, ShoppingBag, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import { getProduct, getVendor, inr } from "@/lib/data";
import { DownloadInvoiceButton } from "@/components/common/DownloadInvoiceButton";

export function OrdersTab() {
  const { orders, deleteOrder, clearOrders } = useStore();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.status < 5;
    if (filter === "delivered") return o.status === 5;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">Orders & Delivery Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor real-time courier dispatch progress, vendor acceptance, and access tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {orders.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all orders?")) {
                  clearOrders();
                  toast.success("All orders cleared");
                }
              }}
              className="px-3.5 py-2 rounded-2xl border border-red-200 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
            >
              Clear All Orders
            </button>
          )}
          <Link
            to="/shop"
            className="px-4 py-2 rounded-2xl bg-[#E31E24] text-white text-xs font-semibold shadow-xs hover:bg-red-700 transition"
          >
            Shop Parts
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: `All Orders (${orders.length})` },
          { id: "active", label: `Active Deliveries (${orders.filter((o) => o.status < 5).length})` },
          { id: "delivered", label: `Delivered (${orders.filter((o) => o.status === 5).length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filter === t.id
                ? "bg-[#111111] text-white border-[#111111]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-bold text-gray-800 font-display">No Orders Found</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {filter === "active"
              ? "No live orders currently in transit. Explore our catalog of EV batteries, chargers, and spare parts."
              : "You haven't placed any orders yet."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              to="/shop"
              className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold shadow-xs hover:bg-red-700 transition"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => {
            const isLive = o.status < 5;

            return (
              <div
                key={o.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md transition space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-100 text-gray-700 font-mono text-xs font-bold">
                      #{o.id.slice(-4)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm font-mono">{o.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 5
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800 animate-pulse"
                          }`}
                        >
                          {ORDER_STEPS[o.status]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed on {new Date(o.createdAt).toLocaleString("en-IN")} · Paid via {o.payment}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-extrabold text-gray-900">{inr(o.total)}</p>
                    <span className="text-[11px] text-gray-500">
                      {o.groups.reduce((s, g) => s + g.items.reduce((n, i) => n + i.qty, 0), 0)} items total
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="py-1">
                  <div className="grid grid-cols-6 gap-1 text-center">
                    {ORDER_STEPS.map((step, idx) => {
                      const isPassed = idx <= o.status;
                      const isCurrent = idx === o.status;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold transition-all ${
                              isCurrent
                                ? "bg-[#E31E24] text-white ring-4 ring-red-100 scale-105"
                                : isPassed
                                ? "bg-[#E31E24] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`mt-1.5 text-[9px] line-clamp-1 ${
                              isCurrent ? "font-bold text-gray-900" : isPassed ? "font-medium text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Vendor Summary */}
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                  {o.groups.map((g) => {
                    const v = getVendor(g.vendorId);
                    return (
                      <div key={g.vendorId} className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-gray-900">{v?.name || "EV Spares Hub"}</span>
                          <span className="text-gray-400 ml-2">({g.km} km away · ~{g.eta} min dispatch)</span>
                        </div>
                        <div className="text-gray-600">
                          {g.items.map((it) => {
                            const p = getProduct(it.productId);
                            return (
                              <span key={it.productId} className="inline-block mr-2 font-medium">
                                {it.qty}x {p?.name || "Spare"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <DownloadInvoiceButton
                      order={o}
                      variant="outline"
                      size="sm"
                      label="Download Tax Invoice"
                    />
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete order ${o.id}?`)) {
                          deleteOrder(o.id);
                          toast.success(`Order ${o.id} deleted`);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition flex items-center gap-1 cursor-pointer"
                      title="Delete order"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Order</span>
                    </button>
                  </div>

                  <Link
                    to="/track/$id"
                    params={{ id: o.shipmentId || o.id }}
                    className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold shadow-xs hover:bg-red-700 transition flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Track Live GPS Courier</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
