import React, { useState } from "react";
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
  Phone,
} from "lucide-react";
import { useStore, type Order } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { inr, bikes, getBike } from "@/lib/data";
import { DownloadInvoiceButton } from "@/components/common/DownloadInvoiceButton";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { toast } from "sonner";

export function AppOrdersTab({ onTriggerLogin }: { onTriggerLogin?: () => void }) {
  const { orders, placeOrder, cart } = useStore();
  const { isAuthenticated } = useAuth();
  const [selectedOrderForMap, setSelectedOrderForMap] = useState<Order | null>(null);

  const activeOrders = orders && orders.length > 0 ? orders : [];

  const handleSimulateDemoOrder = () => {
    placeOrder("UPI · Paid Online");
    toast.success("Created Demo Customer Order!", {
      description: "Order is ready for Seller Pack -> Live GPS tracking verification",
    });
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
      case 1:
        return { label: "PLACED & CONFIRMED", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case 2:
        return { label: "PACKED BY SELLER", bg: "bg-amber-50 text-amber-700 border-amber-200" };
      case 3:
      case 4:
        return { label: "OUT FOR DELIVERY", bg: "bg-purple-50 text-purple-700 border-purple-200" };
      case 5:
        return { label: "DELIVERED", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      default:
        return { label: "PROCESSING", bg: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* Auth Banner if guest */}
      {!isAuthenticated && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-3.5 border border-amber-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-400 grid place-items-center text-gray-950 font-bold shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Sign in to track orders</p>
              <p className="text-[11px] text-gray-500">Sync orders across your phone and web</p>
            </div>
          </div>
          {onTriggerLogin && (
            <button
              onClick={onTriggerLogin}
              className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Your Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time Delhi 30-min delivery & live map telemetry
          </p>
        </div>

        <button
          onClick={handleSimulateDemoOrder}
          className="inline-flex items-center gap-1 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1.5 text-xs font-bold text-red-600 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Demo Order</span>
        </button>
      </div>

      {/* Order List */}
      {activeOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-900">No active orders yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            Browse our EV battery catalog or tap the button below to simulate a demo order.
          </p>
          <button
            onClick={handleSimulateDemoOrder}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 transition active:scale-95"
          >
            <span>Create Demo Order</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const totalQty = order.groups
              ? order.groups.reduce((acc, g) => acc + g.items.reduce((s, it) => s + it.qty, 0), 0)
              : 1;

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-gray-200/90 p-4 shadow-2xs space-y-3"
              >
                {/* Top Row: Order ID & Status Badge */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                      ORDER ID
                    </span>
                    <span className="text-xs font-black text-gray-900 font-mono">{order.id}</span>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Middle Info: Destination & ETA */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span className="truncate font-semibold text-gray-800">
                      {order.shippingAddress?.street || "Connaught Place, Delhi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    <Clock className="h-3 w-3" />
                    <span>{order.eta || 25}m ETA</span>
                  </div>
                </div>

                {/* Total and Items */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-500 font-medium">
                    {totalQty} {totalQty === 1 ? "item" : "items"} • {order.payment || "UPI"}
                  </span>
                  <span className="text-sm font-extrabold text-gray-900 font-mono">
                    {inr(order.total)}
                  </span>
                </div>

                {/* Action Buttons: Live Map and Invoice */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderForMap(order)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition active:scale-95"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Track Live GPS</span>
                  </button>

                  <DownloadInvoiceButton
                    order={order}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Map Modal */}
      {selectedOrderForMap && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Live Dispatch Tracking • {selectedOrderForMap.id}
                </h3>
                <p className="text-[11px] text-emerald-600 font-bold">
                  ● Rider En-Route (30-min express)
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForMap(null)}
                className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <DeliveryMap orderId={selectedOrderForMap.id} className="h-full w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
