import React, { useState } from "react";
import {
  Package,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Bike,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { inr, riders as RIDERS } from "@/lib/data";
import { Order, VendorGroup, useStore, ORDER_STEPS } from "@/lib/store";
import { Vendor } from "@/lib/vendor/types";
import { PrintPackingSlipModal } from "./PrintPackingSlipModal";

interface OrdersSectionProps {
  vendor: Vendor;
}

type OrderTab = "ALL" | "NEW" | "ACCEPTED" | "PACKED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";

export function OrdersSection({ vendor }: OrdersSectionProps) {
  const { orders, updateOrderStatus, cancelOrder } = useStore();
  const [activeTab, setActiveTab] = useState<OrderTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Print Modal State
  const [printModalData, setPrintModalData] = useState<{
    order: Order;
    group: VendorGroup;
  } | null>(null);

  // Handover to rider modal
  const [handoverOrder, setHandoverOrder] = useState<Order | null>(null);
  const [handoverOtp, setHandoverOtp] = useState("");

  // Reject order modal
  const [rejectOrder, setRejectOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState("Stock discrepancy / Out of stock");

  // Filter orders containing this vendor
  const vendorOrders = orders
    .map((o) => {
      const group = o.groups.find((g) => g.vendorId === vendor.id);
      return group ? { order: o, group } : null;
    })
    .filter(Boolean) as { order: Order; group: VendorGroup }[];

  const filteredOrders = vendorOrders.filter(({ order }) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesCustomer = (order.customerName || "").toLowerCase().includes(q);
      if (!matchesId && !matchesCustomer) return false;
    }

    // Status tab filter
    if (activeTab === "NEW") return order.status === 0;
    if (activeTab === "ACCEPTED") return order.status === 1;
    if (activeTab === "PACKED") return order.status === 2;
    if (activeTab === "PICKED_UP") return order.status === 3 || order.status === 4;
    if (activeTab === "DELIVERED") return order.status === 5;
    if (activeTab === "CANCELLED") return order.fulfillmentStatus === "Cancelled";
    return true;
  });

  const countByTab = {
    ALL: vendorOrders.length,
    NEW: vendorOrders.filter((vo) => vo.order.status === 0).length,
    ACCEPTED: vendorOrders.filter((vo) => vo.order.status === 1).length,
    PACKED: vendorOrders.filter((vo) => vo.order.status === 2).length,
    PICKED_UP: vendorOrders.filter((vo) => vo.order.status === 3 || vo.order.status === 4).length,
    DELIVERED: vendorOrders.filter((vo) => vo.order.status === 5).length,
    CANCELLED: vendorOrders.filter((vo) => vo.order.fulfillmentStatus === "Cancelled").length,
  };

  // Actions
  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 1);
    toast.success(`Order ${orderId} accepted! Please start packing.`);
  };

  const handleMarkPacked = (orderId: string) => {
    updateOrderStatus(orderId, 2);
    toast.success(`Order ${orderId} marked as Packed & ready for rider pickup!`);
  };

  const handleHandoverSubmit = () => {
    if (!handoverOrder) return;
    if (handoverOtp !== "4921" && handoverOtp !== "1234") {
      toast.error("Invalid Rider OTP. Please ask the rider for their 4-digit handover OTP.");
      return;
    }
    updateOrderStatus(handoverOrder.id, 3);
    toast.success(`Package handed over to rider! Status advanced to Picked up.`);
    setHandoverOrder(null);
    setHandoverOtp("");
  };

  const handleRejectSubmit = () => {
    if (!rejectOrder) return;
    cancelOrder(rejectOrder.id, rejectReason);
    toast.error(`Order ${rejectOrder.id} rejected.`);
    setRejectOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">Orders & Fulfilment</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Accept incoming customer orders, print GST packing slips and hand over packages to
            RiderzPro riders.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:border-[#E31E24]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200">
        {(
          [
            { id: "ALL", label: "All Orders" },
            { id: "NEW", label: "New (To Accept)" },
            { id: "ACCEPTED", label: "Accepted" },
            { id: "PACKED", label: "Packed" },
            { id: "PICKED_UP", label: "In Transit" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ] as const
        ).map((tab) => {
          const count = countByTab[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#E31E24] text-white shadow-xs"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(({ order, group }) => {
            const assignedRider = RIDERS[0]; // Ravi Kumar demo rider
            const statusIndex = order.status;
            const currentStepLabel = ORDER_STEPS[statusIndex] || "Processing";

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-gray-300 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#E31E24] flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-gray-900">{order.id}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {currentStepLabel}
                        </span>
                        {order.payment?.includes("COD") ? (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            Cash on Delivery
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            Prepaid
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} · Customer: {order.customerName || "Rider Customer"} ({order.customerPhone || "+91 98450 12345"})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Print Packing Slip */}
                    <button
                      onClick={() => setPrintModalData({ order, group })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Invoice & Slip
                    </button>

                    {/* Stage Actions */}
                    {statusIndex === 0 && (
                      <>
                        <button
                          onClick={() => setRejectOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer"
                        >
                          Accept Order
                        </button>
                      </>
                    )}

                    {statusIndex === 1 && (
                      <button
                        onClick={() => handleMarkPacked(order.id)}
                        className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition cursor-pointer"
                      >
                        Mark as Packed
                      </button>
                    )}

                    {statusIndex === 2 && (
                      <button
                        onClick={() => setHandoverOrder(order)}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <Bike className="h-3.5 w-3.5" />
                        Hand over to Rider
                      </button>
                    )}

                    {statusIndex >= 3 && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Handed over to {assignedRider.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this group */}
                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    {group.items.map((it, idx) => (
                      <p key={idx} className="font-semibold text-gray-800">
                        {it.qty}x Product [{it.productId}] —{" "}
                        <span className="font-mono text-gray-600">{inr(it.price)} each</span>
                      </p>
                    ))}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Group Subtotal</p>
                    <p className="font-display text-base font-black text-gray-900">
                      {inr(group.subtotal)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Delivery: {inr(group.fee)} (~{group.km} km)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No orders found</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            There are no orders matching the selected status tab or search query.
          </p>
        </div>
      )}

      {/* RIDER HANDOVER MODAL */}
      {handoverOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Bike className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">Rider Handover</h3>
                <p className="text-xs text-gray-500">Order {handoverOrder.id}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3.5 border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-800">Assigned Fleet Rider:</p>
              <p className="text-gray-600">Ravi Kumar (Ather Rizta · KA 01 EV 4521)</p>
              <p className="text-gray-500">Phone: +91 98450 12345</p>
              <p className="text-[11px] text-purple-700 font-semibold pt-1">
                Demo OTP: 4921
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Enter 4-Digit Rider Pickup OTP
              </label>
              <input
                type="text"
                maxLength={4}
                value={handoverOtp}
                onChange={(e) => setHandoverOtp(e.target.value)}
                placeholder="4921"
                className="w-full text-center text-lg font-mono font-bold tracking-widest rounded-xl border border-gray-200 p-2.5"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHandoverOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHandoverSubmit}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700"
              >
                Confirm Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT ORDER MODAL */}
      {rejectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-display font-bold text-base text-gray-900">
              Reject Order {rejectOrder.id}
            </h3>
            <p className="text-xs text-gray-500">
              Please specify the fulfillment reason for order cancellation. The customer will be
              automatically refunded.
            </p>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Reason</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
              >
                <option value="Item Out of Stock / Damaged Inventory">
                  Item Out of Stock / Damaged Inventory
                </option>
                <option value="Pickup Address Unserviceable for Courier">
                  Pickup Address Unserviceable for Courier
                </option>
                <option value="Pricing error on listing">Pricing error on listing</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT SLIP MODAL */}
      {printModalData && (
        <PrintPackingSlipModal
          isOpen={Boolean(printModalData)}
          onClose={() => setPrintModalData(null)}
          order={printModalData.order}
          group={printModalData.group}
          vendor={vendor}
        />
      )}
    </div>
  );
}
