import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Package, ArrowRight, Check, MapPin, Download, RefreshCw, ShoppingBag, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import { getProduct, getVendor, inr } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export function OrdersTab() {
  const { user } = useAuth();
  const { clearOrders, deleteOrder } = useStore();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    const query = user?.id ? `?customer_id=${encodeURIComponent(user.id)}` : "";
    fetch(`/api/orders${query}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped: Order[] = res.data.map((o: any) => ({
            id: o.order_number || o.id,
            createdAt: o.created_at || new Date().toISOString(),
            payment: o.payment_method || "UPI",
            status: (o.status === "completed" || o.status === "delivered" ? 5 : 2) as any,
            total: Number(o.total_amount) || 0,
            itemsTotal: Number(o.total_amount) || 0,
            deliveryTotal: 0,
            tax: 0,
            shippingAddress: {
              name: o.customer_name || user?.name || "Customer",
              street: o.delivery_address || "Doorstep Address",
              city: "Bengaluru",
              pincode: "560038",
              phone: o.customer_phone || "+91 98765 43210",
            },
            groups: [
              {
                vendorId: o.seller_id || "sel_volthub_01",
                items: Array.isArray(o.items) && o.items.length > 0
                  ? o.items.map((it: any) => ({
                      productId: it.product_id,
                      qty: Number(it.quantity) || 1,
                      price: Number(it.unit_price) || 0,
                    }))
                  : [
                      {
                        productId: "prod_generic",
                        qty: 1,
                        price: Number(o.total_amount) || 0,
                      },
                    ],
              },
            ],
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load customer orders:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.status < 5;
    if (filter === "delivered") return o.status === 5;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Invoice modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-base font-bold text-gray-900 font-display">Tax Invoice & Receipt</p>
                <p className="text-xs text-gray-500 font-mono">Invoice #{selectedInvoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString("en-IN")}</span>
                <span>Payment: {selectedInvoiceOrder.payment}</span>
              </div>

              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100">
                {selectedInvoiceOrder.groups.map((g: any) => {
                  const v = getVendor(g.vendorId);
                  return (
                    <div key={g.vendorId} className="py-2 first:pt-0 last:pb-0">
                      <p className="font-bold text-gray-800">{v?.name || "Verified EV Vendor"}</p>
                      {g.items.map((it: any) => {
                        const p = getProduct(it.productId);
                        return (
                          <div key={it.productId} className="flex justify-between text-gray-600 mt-1">
                            <span>{it.qty} × {p?.name || "EV Spare"}</span>
                            <span className="font-semibold text-gray-900">{inr(it.price * it.qty)}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{inr(selectedInvoiceOrder.itemsTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Doorstep Delivery (GPS Logged)</span>
                  <span>{inr(selectedInvoiceOrder.deliveryTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18% Statutory EV Tax)</span>
                  <span>{inr(selectedInvoiceOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Amount Paid</span>
                  <span className="text-primary">{inr(selectedInvoiceOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success(`Invoice ${selectedInvoiceOrder.id}.pdf downloaded`);
                  setSelectedInvoiceOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-600 transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                      {o.groups.reduce((s: number, g: any) => s + g.items.reduce((n: number, i: any) => n + (i.qty || 0), 0), 0)} items total
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
                                ? "bg-primary text-white ring-4 ring-emerald-100 scale-105"
                                : isPassed
                                ? "bg-emerald-600 text-white"
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
                  {o.groups.map((g: any) => {
                    const v = getVendor(g.vendorId);
                    return (
                      <div key={g.vendorId} className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-gray-900">{v?.name || "EV Spares Hub"}</span>
                          <span className="text-gray-400 ml-2">({g.km} km away · ~{g.eta} min dispatch)</span>
                        </div>
                        <div className="text-gray-600">
                          {g.items.map((it: any) => {
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
                    <button
                      onClick={() => setSelectedInvoiceOrder(o)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Invoice</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete order ${o.id}?`)) {
                          deleteOrder(o.id);
                          setOrders((prev) => prev.filter((item) => item.id !== o.id));
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
                    params={{ id: o.id }}
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
