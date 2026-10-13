import React from "react";
import { Printer, X, CheckCircle2, ShieldCheck, Truck, Package } from "lucide-react";
import { inr, GST_RATE } from "@/lib/data";
import { Order, VendorGroup } from "@/lib/store";
import { Vendor } from "@/lib/vendor/types";
import { Logo } from "@/components/site/bits";

interface PrintPackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  group: VendorGroup;
  vendor: Vendor;
}

export function PrintPackingSlipModal({
  isOpen,
  onClose,
  order,
  group,
  vendor,
}: PrintPackingSlipModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace(/\D/g, "")}-${vendor.id.slice(-3)}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const taxAmount = Math.round(group.subtotal * GST_RATE);
  const totalAmount = group.subtotal + taxAmount + group.fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[96vh] w-full max-w-3xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 print:hidden">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#E31E24]" />
            <span className="font-display font-bold text-xs sm:text-base text-gray-900 truncate">
              Tax Invoice & Slip
            </span>
            <span className="rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-gray-700">
              {order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 sm:p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-4 sm:p-8 text-xs text-gray-800 print:p-0 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-gray-300 pb-5 sm:pb-6">
            <div>
              <Logo imgClassName="h-8 sm:h-9" />
              <p className="mt-1 text-[11px] text-gray-500 font-medium">
                RiderzPro Marketplace Hyperlocal Fulfilment
              </p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                CIN: U50400KA2024PTC189201 · GSTIN: 29AABCU9821R1Z8
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded-md bg-red-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                TAX INVOICE
              </span>
              <p className="mt-2 font-mono font-bold text-sm text-gray-900">{invoiceNumber}</p>
              <p className="text-gray-500 mt-0.5">Date: {invoiceDate}</p>
              <p className="text-gray-500 font-mono">Order: {order.id}</p>
            </div>
          </div>

          {/* Supplier & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-b border-gray-300 py-5 sm:py-6">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1">
                Sold By (Seller)
              </h4>
              <p className="font-bold text-sm text-gray-900">{vendor.storeName}</p>
              <p className="text-gray-600 mt-0.5">
                {vendor.onboarding?.shipping?.pickupAddress?.line1 || "Indiranagar Hub"}
                {vendor.onboarding?.shipping?.pickupAddress?.line2 && `, ${vendor.onboarding.shipping.pickupAddress.line2}`}
              </p>
              <p className="text-gray-600">
                {vendor.onboarding?.shipping?.pickupAddress?.city || "Bengaluru"},{" "}
                {vendor.onboarding?.shipping?.pickupAddress?.state || "Karnataka"} -{" "}
                {vendor.onboarding?.shipping?.pickupAddress?.pincode || "560038"}
              </p>
              <p className="mt-1 font-mono text-[11px] text-gray-700">
                GSTIN: <span className="font-bold">{vendor.onboarding?.tax?.gstin || "27AAPFU0939F1ZV"}</span>
              </p>
              <p className="font-mono text-[11px] text-gray-700">
                PAN: {vendor.onboarding?.tax?.pan || "AAPFU0939F"}
              </p>
            </div>

            <div className="text-right">
              <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1">
                Ship To (Customer)
              </h4>
              <p className="font-bold text-sm text-gray-900">
                {order.customerName || order.shippingAddress?.name || "Customer"}
              </p>
              <p className="text-gray-600 mt-0.5">
                {order.shippingAddress?.street || "MG Road, Indiranagar"}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.city || "Bengaluru"},{" "}
                {order.shippingAddress?.pincode || "560001"}
              </p>
              <p className="mt-1 text-gray-700">
                Contact: {order.customerPhone || order.shippingAddress?.phone || "+91 98450 12345"}
              </p>
              <p className="text-[11px] text-gray-500">
                Fulfilment: Hyperlocal Delivery ({group.km} km)
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left mt-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-[11px] font-bold uppercase text-gray-500">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {group.items.map((item, index) => (
                <tr key={index} className="py-2.5">
                  <td className="py-2.5">
                    <p className="font-bold text-gray-900">EV Replacement Component</p>
                    <p className="text-[10px] font-mono text-gray-500">ID: {item.productId}</p>
                  </td>
                  <td className="py-2.5 text-center font-mono">85076000</td>
                  <td className="py-2.5 text-center font-bold">{item.qty}</td>
                  <td className="py-2.5 text-right font-mono">{inr(item.price)}</td>
                  <td className="py-2.5 text-right font-mono font-bold">
                    {inr(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="mt-6 flex justify-end border-t border-gray-300 pt-4">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-mono font-semibold">{inr(group.subtotal)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Estimated GST (18%):</span>
                <span className="font-mono font-semibold">{inr(taxAmount)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Hyperlocal Delivery Fee:</span>
                <span className="font-mono font-semibold">{inr(group.fee)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-sm font-extrabold text-gray-900">
                <span>Total Amount:</span>
                <span className="font-mono text-[#E31E24]">{inr(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Declaration & Terms */}
          <div className="mt-10 border-t border-dashed border-gray-300 pt-4 text-[10px] text-gray-500">
            <p className="font-semibold text-gray-700">Declaration & Li-ion Battery Compliance:</p>
            <p className="mt-0.5">
              We declare that this invoice shows the actual price of the goods described and that all
              particulars are true and correct. Packaging meets UN38.3 handling norms for lithium-ion
              components.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <p>Computer-generated invoice. No physical signature required.</p>
              <div className="text-right">
                <p className="font-bold text-gray-800">{vendor.storeName}</p>
                <p className="text-[9px] text-gray-400">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
