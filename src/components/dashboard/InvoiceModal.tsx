/**
 * Shared InvoiceModal component — reused by OrdersTab and InvoicesTab.
 * Avoids duplicating the same JSX in two places.
 */
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/store";
import { getProduct, getVendor, inr } from "@/lib/data";

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <p id="invoice-modal-title" className="text-base font-bold text-gray-900 font-display">
              RiderzPro Tax Invoice
            </p>
            <p className="text-xs text-gray-500 font-mono">INV-{order.id}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close invoice"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="text-xs space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
            <span>Payment: {order.payment}</span>
          </div>

          {/* Line items grouped by vendor */}
          <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100">
            {order.groups.map((g) => {
              const v = getVendor(g.vendorId);
              return (
                <div key={g.vendorId} className="py-2 first:pt-0 last:pb-0">
                  <p className="font-bold text-gray-800">{v?.name || "Verified EV Vendor"}</p>
                  {g.items.map((it) => {
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

          {/* Totals */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-gray-500">
              <span>Parts Subtotal</span>
              <span>{inr(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Doorstep Delivery</span>
              <span>{inr(order.deliveryTotal)}</span>
            </div>
            {order.discountTotal && order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>– {inr(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>GST (18%)</span>
              <span>{inr(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Paid</span>
              <span className="text-[#E31E24]">{inr(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              toast.success(`INV-${order.id}.pdf downloaded`);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
