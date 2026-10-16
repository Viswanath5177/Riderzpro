import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Navigation,
  Download,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  X,
} from "lucide-react";
import { useStore, type Order } from "@/lib/store";
import { DownloadInvoiceButton } from "@/components/common/DownloadInvoiceButton";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { toast } from "sonner";

export function AppOrdersTab() {
  const { orders, placeOrder, cart } = useStore();
  const [selectedOrderForMap, setSelectedOrderForMap] = useState<Order | null>(null);

  // If there are no orders yet in the store, provide a convenient demo order option
  const activeOrders = orders && orders.length > 0 ? orders : [];

  const handleSimulateDemoOrder = () => {
    // Generate a test order for QA validation
    const demoOrder: Order = {
      id: `RZ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: Date.now(),
      groups: [
        {
          vendorId: "v_voltride_01",
          items: [
            {
              productId: "prod_li_48v_30ah",
              qty: 1,
              price: 24500,
            },
          ],
          deliveryFee: 150,
          status: "PACKED",
        },
      ],
      itemsTotal: 24500,
      deliveryTotal: 150,
      tax: 4410,
      total: 29060,
      eta: 25,
      payment: "Razorpay (Test)",
      status: 2, // Packed
      customerName: "Harshitha QA",
      shippingAddress: {
        name: "Harshitha QA",
        street: "Connaught Place, Central Delhi",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91 98765 00001",
      },
    };

    placeOrder({
      shipping: demoOrder.shippingAddress,
      paymentMethod: "razorpay",
    });

    toast.success(`Created QA Demo Order ${demoOrder.id}`, {
      description: "Ready for Seller Pack -> Rider Pickup -> Map Tracking verification",
    });
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">My Orders & Tracking</h2>
          <p className="text-xs text-zinc-400">
            Real-time delivery telemetry and GST invoices
          </p>
        </div>
        <button
          onClick={handleSimulateDemoOrder}
          className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-zinc-300 border border-zinc-700 hover:bg-zinc-700 active:scale-95 transition"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>New QA Order</span>
        </button>
      </div>

      {/* Full-Height Tracking Modal (Stretch Goal) */}
      {selectedOrderForMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#14161a] p-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  Live Tracking • {selectedOrderForMap.id}
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Noida Hub → {selectedOrderForMap.shippingAddress?.city || "Delhi"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrderForMap(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex-1">
            <DeliveryMap
              orderId={selectedOrderForMap.id}
              className="h-full w-full"
            />
          </div>

          <div className="border-t border-zinc-800 bg-[#14161a] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Recipient</span>
                <p className="text-xs font-bold text-white">
                  {selectedOrderForMap.shippingAddress?.name || "Customer"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {selectedOrderForMap.shippingAddress?.street}
                </p>
              </div>
              <DownloadInvoiceButton
                order={selectedOrderForMap}
                size="sm"
                variant="dark"
              />
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {activeOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-zinc-200">No active orders found</h3>
          <p className="mt-1 text-xs text-zinc-400">
            You haven't placed any orders yet. Place a test order or browse catalog.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleSimulateDemoOrder}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Create Demo Order</span>
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
            >
              <span>Browse Shop</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {activeOrders.map((order) => {
            const statusLabel =
              order.status === 5
                ? "DELIVERED"
                : order.status === 4
                ? "OUT_FOR_DELIVERY"
                : order.status === 3
                ? "PICKED_UP"
                : order.status === 2
                ? "PACKED"
                : order.status === 1
                ? "ACCEPTED"
                : "CONFIRMED";

            const isDelivered = order.status === 5;
            const isOut = order.status >= 3;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/20 text-red-400">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-100">{order.id}</span>
                      <div className="text-[10px] text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isDelivered
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isOut
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {statusLabel.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-3.5 space-y-3">
                  {/* Delivery Location */}
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                    <div className="text-zinc-300">
                      <span className="font-semibold text-white">
                        {order.shippingAddress?.name || "Customer"}
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Total Amount</span>
                      <span className="font-bold text-white">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block">Payment</span>
                      <span className="font-semibold text-emerald-400 text-[11px]">
                        {order.payment || "Paid via Razorpay"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedOrderForMap(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 active:scale-95 transition"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{isDelivered ? "View Route Map" : "Track Live GPS"}</span>
                    </button>

                    <DownloadInvoiceButton
                      order={order}
                      size="sm"
                      variant="dark"
                      label="Invoice"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
