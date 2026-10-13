import React, { useState } from "react";
import {
  Package,
  Bike,
  User,
  Store,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassDrawer } from "../glass/GlassDrawer";
import { Timeline } from "../glass/Timeline";
import { ConfirmDialog } from "../glass/ConfirmDialog";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminOrder } from "@/mocks/admin/types";

export function OrdersScreen() {
  const { orders, riders, updateOrderStatus, cancelOrder, refundOrder, reassignRider } = useAdminStore();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [newRiderId, setNewRiderId] = useState("");

  const filterTabs = [
    { label: "All Orders", value: "ALL", count: orders.length },
    { label: "Placed", value: "Placed", count: orders.filter((o) => o.status === "Placed").length },
    { label: "Processing", value: "Processing", count: orders.filter((o) => o.status === "Processing").length },
    { label: "In Transit", value: "In Transit", count: orders.filter((o) => o.status === "In Transit").length },
    { label: "Delivered", value: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
    { label: "Cancelled", value: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
  ];

  const columns: Column<AdminOrder>[] = [
    {
      key: "orderNumber",
      header: "Order ID",
      sortable: true,
      render: (o) => (
        <div>
          <span className="font-mono font-bold text-[#111111] text-xs">{o.orderNumber}</span>
          <p className="text-[10px] text-[#6B7280] font-medium">{new Date(o.date).toLocaleDateString("en-IN")}</p>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      sortable: true,
      render: (o) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{o.customerName}</p>
          <p className="text-xs text-[#4B5563] font-medium">{o.customerCity} · {o.customerPhone}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Parts Ordered",
      render: (o) => (
        <div className="max-w-xs">
          <p className="font-bold text-[#111111] text-xs truncate">{o.items[0]?.productName || "EV Parts"}</p>
          {o.items.length > 1 && (
            <p className="text-[10px] text-[#E31E24] font-bold">+{o.items.length - 1} more items</p>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      render: (o) => (
        <div>
          <span className="font-bold text-[#111111] tabular-nums text-xs">₹{o.totalAmount.toLocaleString("en-IN")}</span>
          <p className="text-[10px] text-[#6B7280] font-medium">{o.paymentMethod}</p>
        </div>
      ),
    },
    {
      key: "courier",
      header: "Courier / Rider",
      render: (o) => (
        <div>
          <p className="font-bold text-[#111111] text-xs">{o.courier}</p>
          <p className="text-[10px] text-[#4B5563] font-mono truncate">{o.trackingNumber}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (o) => <StatusBadge status={o.status} size="sm" />,
    },
  ];

  // Animated Timeline steps generator for current selected order
  const getTimelineSteps = (order: AdminOrder) => {
    const statuses: AdminOrder["status"][] = ["Placed", "Processing", "Dispatched", "In Transit", "Delivered"];
    const currentIdx = statuses.indexOf(order.status);

    if (order.status === "Cancelled") {
      return [
        { title: "Order Placed", time: new Date(order.date).toLocaleTimeString("en-IN"), status: "complete" as const },
        { title: "Order Cancelled & Refunded", description: order.notes || "Customer cancellation", status: "current" as const },
      ];
    }

    return [
      {
        title: "Order Placed & Payment Verified",
        description: `Verified via ${order.paymentMethod}`,
        time: new Date(order.date).toLocaleTimeString("en-IN"),
        status: currentIdx >= 0 ? ("complete" as const) : ("upcoming" as const),
      },
      {
        title: "Packed by Vendor Hub",
        description: order.items[0]?.sellerName || "Verified Seller",
        time: currentIdx >= 1 ? "1 hour later" : undefined,
        status: currentIdx > 1 ? ("complete" as const) : currentIdx === 1 ? ("current" as const) : ("upcoming" as const),
      },
      {
        title: "Dispatched with Carrier",
        description: `${order.courier} (AWB: ${order.trackingNumber})`,
        time: currentIdx >= 2 ? "2 hours later" : undefined,
        status: currentIdx > 2 ? ("complete" as const) : currentIdx === 2 ? ("current" as const) : ("upcoming" as const),
      },
      {
        title: "Out for Doorstep Delivery",
        description: order.riderName ? `Rider: ${order.riderName}` : "Courier Hub Driver assigned",
        status: currentIdx > 3 ? ("complete" as const) : currentIdx === 3 ? ("current" as const) : ("upcoming" as const),
      },
      {
        title: "Delivered to Customer",
        description: "Verified with OTP & fitment checklist",
        status: currentIdx >= 4 ? ("complete" as const) : ("upcoming" as const),
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Order Management & Live Dispatches
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Real-time multi-vendor fulfillment, express courier tracking and doorstep SLA monitoring.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search order #, customer name, phone or tracking..."
        searchKey={(o) => `${o.orderNumber} ${o.customerName} ${o.customerPhone} ${o.trackingNumber} ${o.courier}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(o, filter) => o.status === filter}
        onRowClick={(order) => setSelectedOrder(order)}
        keyExtractor={(o) => o.id}
        exportFileName="riderzpro_orders"
      />

      {/* Order Detail Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        width="xl"
        title={selectedOrder ? `Order #${selectedOrder.orderNumber}` : undefined}
        description={selectedOrder ? `Placed on ${new Date(selectedOrder.date).toLocaleString("en-IN")}` : undefined}
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Status and Action Buttons */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="text-[#4B5563] font-bold">Current Status:</span>
                <StatusBadge status={selectedOrder.status} size="md" />
              </div>

              {selectedOrder.status !== "Cancelled" && selectedOrder.status !== "Delivered" && (
                <div className="flex gap-2">
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "Delivered");
                      setSelectedOrder({ ...selectedOrder, status: "Delivered" });
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Delivered</span>
                  </GlassButton>

                  <GlassButton
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </GlassButton>
                </div>
              )}
            </div>

            {/* Fitment Check Badge */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-emerald-950">100% Fitment Verified</p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Component tested against customer bike chassis specs.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                PASSED
              </span>
            </div>

            {/* Status Timeline */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <h4 className="font-bold text-[#111111] mb-3 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#E31E24]" />
                <span>Live Fulfillment Timeline</span>
              </h4>
              <Timeline steps={getTimelineSteps(selectedOrder)} />
            </div>

            {/* Items Ordered List */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <h4 className="font-bold text-[#111111] mb-3 text-sm">Items Breakdown</h4>
              <div className="divide-y divide-[#F3F4F6] space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#111111]">{item.productName}</p>
                      <p className="text-[11px] text-[#6B7280] font-medium">
                        Seller: {item.sellerName} · Qty: {item.quantity} · Fitment: {item.bikeCompatible}
                      </p>
                    </div>
                    <span className="font-bold text-[#111111] tabular-nums">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F4F6] space-y-1.5 text-[#4B5563] text-[11px] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#111111] font-bold">₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (12%):</span>
                  <span className="text-[#111111] font-bold">₹{selectedOrder.taxGst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="text-[#111111] font-bold">₹{selectedOrder.deliveryFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E5E7EB]">
                  <span>Total Amount:</span>
                  <span className="text-[#E31E24] tabular-nums font-extrabold text-base">
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Card */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5 space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#E31E24]" />
                  <span>Customer Details</span>
                </p>
                <p className="font-bold text-[#111111]">{selectedOrder.customerName}</p>
                <p className="text-[#4B5563] font-medium">{selectedOrder.customerPhone}</p>
                <p className="text-[#6B7280] leading-relaxed font-medium">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Rider / Carrier Card */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5 space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5">
                  <Bike className="h-3.5 w-3.5 text-orange-500" />
                  <span>Logistics Carrier</span>
                </p>
                <p className="font-bold text-[#111111]">{selectedOrder.courier}</p>
                <p className="font-mono text-[#4B5563] font-semibold">{selectedOrder.trackingNumber}</p>
                <p className="text-[#111111] font-medium">
                  {selectedOrder.riderName ? `Assigned: ${selectedOrder.riderName}` : "Standard carrier routing"}
                </p>

                {/* Reassign Rider Option */}
                {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[#4B5563] font-bold block mb-1">Reassign Local Fleet Rider:</label>
                    <div className="flex gap-1.5">
                      <select
                        value={newRiderId}
                        onChange={(e) => setNewRiderId(e.target.value)}
                        className="rounded-xl border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] text-[#111111] font-medium flex-1 outline-none"
                      >
                        <option value="">Select available rider...</option>
                        {riders.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.zone})
                          </option>
                        ))}
                      </select>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        disabled={!newRiderId}
                        onClick={() => {
                          reassignRider(selectedOrder.id, newRiderId);
                          const r = riders.find((x) => x.id === newRiderId);
                          if (r) {
                            setSelectedOrder({
                              ...selectedOrder,
                              riderId: r.id,
                              riderName: `${r.name} (${r.phone})`,
                            });
                          }
                          setNewRiderId("");
                        }}
                      >
                        Assign
                      </GlassButton>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Refund Action if Cancelled */}
            {selectedOrder.status === "Cancelled" && selectedOrder.paymentStatus !== "Refunded" && (
              <GlassButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setShowRefundDialog(true)}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Process Customer Refund (₹{selectedOrder.totalAmount.toLocaleString("en-IN")})</span>
              </GlassButton>
            )}
          </div>
        )}
      </GlassDrawer>

      {/* Cancel Order Confirm Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          if (selectedOrder) {
            cancelOrder(selectedOrder.id, "Cancelled by Admin console request");
            setSelectedOrder({ ...selectedOrder, status: "Cancelled", paymentStatus: "Refunded" });
          }
        }}
        title="Cancel Order?"
        description="Are you sure you want to cancel this order? This will halt dispatch and initiate an automated refund."
        confirmLabel="Cancel Order & Refund"
      />

      {/* Process Refund Confirm Dialog */}
      <ConfirmDialog
        isOpen={showRefundDialog}
        onClose={() => setShowRefundDialog(false)}
        onConfirm={() => {
          if (selectedOrder) {
            refundOrder(selectedOrder.id);
            setSelectedOrder({ ...selectedOrder, paymentStatus: "Refunded" });
          }
        }}
        title="Approve Refund?"
        description="This will send an instant settlement request to Razorpay for this customer."
        confirmLabel="Process Refund"
      />
    </div>
  );
}
