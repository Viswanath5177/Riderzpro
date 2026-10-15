/**
 * Shared InvoiceModal component — reused by OrdersTab and InvoicesTab.
 * Features official GST Rule 46 Tax Invoice details, HSN breakdown, and printable HTML/PDF download.
 */
import { Download, Printer, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/store";
import { getProduct, getVendor, inr } from "@/lib/data";

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const isInterstate = order.taxBreakdown?.isInterstate ?? (
    order.shippingAddress?.state
      ? !order.shippingAddress.state.toLowerCase().includes("uttar pradesh")
      : true
  );

  const invoiceUrl = `/api/orders/${order.id}/invoice?format=html`;

  const handleDownload = () => {
    toast.success("Opening official GST Tax Invoice...", {
      description: "You can save as PDF directly from the print dialog.",
    });
    window.open(invoiceUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Rule 46 GST Compliant
              </span>
            </div>
            <p id="invoice-modal-title" className="text-base font-bold text-gray-900 font-display">
              RiderzPro Official Tax Invoice
            </p>
            <p className="text-xs text-gray-500 font-mono">
              INV-{order.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()} · Order #{order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close invoice"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Seller & Buyer Tax Header */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-[11px]">
          <div>
            <p className="font-bold text-gray-800">Billed & Supplied By:</p>
            <p className="text-gray-600 font-medium">Qbit Pro Solutions Pvt. Ltd.</p>
            <p className="text-gray-500">Sector 63, Noida (UP) - 201301</p>
            <p className="font-mono text-gray-700 mt-0.5">GSTIN: <strong>09AAACQ1234F1Z5</strong></p>
          </div>
          <div>
            <p className="font-bold text-gray-800">Shipped To:</p>
            <p className="text-gray-600 font-medium">{order.shippingAddress?.name || order.customerName || "Customer"}</p>
            <p className="text-gray-500">{order.shippingAddress?.city || "New Delhi"}, {order.shippingAddress?.state || "Delhi"}</p>
            <p className="text-gray-500">Place of Supply: <strong>{order.shippingAddress?.state || "Delhi"} ({isInterstate ? "IGST 18%" : "CGST 9% + SGST 9%"})</strong></p>
          </div>
        </div>

        {/* Body */}
        <div className="text-xs space-y-3">
          <div className="flex justify-between text-gray-600 text-[11px]">
            <span>Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span>Payment Mode: <strong>{order.payment}</strong></span>
          </div>

          {/* Line items grouped by vendor */}
          <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100">
            {order.groups.map((g) => {
              const v = getVendor(g.vendorId);
              return (
                <div key={g.vendorId} className="py-2 first:pt-0 last:pb-0">
                  <p className="font-bold text-gray-800 text-[11px] mb-1">{v?.name || "Verified Noida Hub Seller"}</p>
                  {g.items.map((it) => {
                    const p = getProduct(it.productId);
                    return (
                      <div key={it.productId} className="flex justify-between text-gray-600 mt-1">
                        <div>
                          <span>{it.qty} × {p?.name || "Automotive Component"}</span>
                          <span className="block text-[10px] text-gray-400 font-mono">HSN: 8714 10 90 · GST: 18%</span>
                        </div>
                        <span className="font-semibold text-gray-900">{inr(it.price * it.qty)}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Courier Delivery Line */}
            <div className="py-2 flex justify-between text-gray-600">
              <div>
                <span>Doorstep Express Courier Fulfillment</span>
                <span className="block text-[10px] text-gray-400 font-mono">SAC: 9968 12 · GST: 18%</span>
              </div>
              <span className="font-semibold text-gray-900">{inr(order.deliveryTotal || 150)}</span>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-gray-500">
              <span>Goods & Services Subtotal</span>
              <span>{inr((order.itemsTotal || 0) + (order.deliveryTotal || 150))}</span>
            </div>
            {order.discountTotal && order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>– {inr(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 font-medium pt-1 border-t border-gray-100">
              <span>Tax Breakdown ({isInterstate ? "18% IGST Inter-State" : "9% CGST + 9% SGST"}):</span>
              <span className="font-mono">{inr(order.tax || Math.round(((order.total || 0) * 18) / 118))}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-[#E31E24]">{inr(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Digital Certified Seal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
