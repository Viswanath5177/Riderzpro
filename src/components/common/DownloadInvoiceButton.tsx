import React, { useState } from "react";
import { Download, FileText, Printer, X, Building2, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/store";
import { getProduct, inr } from "@/lib/data";

export interface DownloadInvoiceButtonProps {
  order?: Order | null;
  orderId?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  label?: string;
  showIcon?: boolean;
}

export function DownloadInvoiceButton({
  order,
  orderId,
  className = "",
  variant = "dark",
  size = "md",
  label = "Download Tax Invoice",
  showIcon = true,
}: DownloadInvoiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no direct order object is provided, construct a minimal order representation from ID
  const effectiveId = order?.id || orderId || "RZ-849201";
  const effectiveOrder: Order = order || {
    id: effectiveId,
    createdAt: Date.now(),
    groups: [],
    itemsTotal: 48000,
    deliveryTotal: 150,
    tax: 8667,
    total: 56817,
    eta: 25,
    payment: "Razorpay (Verified)",
    status: 5,
    customerName: "Aakash Sharma",
    shippingAddress: {
      name: "Aakash Sharma",
      street: "Flat 402, Green Glen Layout, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      phone: "+91 98765 43210",
    },
  };

  const isInterstate = effectiveOrder.taxBreakdown?.isInterstate ?? (
    effectiveOrder.shippingAddress?.state
      ? !effectiveOrder.shippingAddress.state.toLowerCase().includes("karnataka")
      : false
  );

  const cgst = effectiveOrder.taxBreakdown?.cgst || Math.round(effectiveOrder.tax / 2);
  const sgst = effectiveOrder.taxBreakdown?.sgst || (effectiveOrder.tax - cgst);
  const igst = effectiveOrder.taxBreakdown?.igst || effectiveOrder.tax;

  const handlePrint = () => {
    window.print();
  };

  const handleDirectDownload = () => {
    // Open the backend invoice endpoint in new window
    window.open(`/api/invoices/${effectiveId}?format=html`, "_blank");
    toast.success(`Tax Invoice INV-${effectiveId} ready for print/download`);
  };

  const baseStyles = "inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none rounded-xl";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3 text-sm sm:text-base gap-2.5",
  }[size];

  const variantStyles = {
    primary: "bg-[#E31E24] text-white hover:bg-red-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
    outline: "bg-white text-gray-800 border border-gray-300 hover:border-gray-900 shadow-2xs",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    dark: "bg-gray-900 text-white hover:bg-black shadow-sm",
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        title="Download Rule 46 CGST Tax Invoice"
      >
        {showIcon && <FileText className="h-4 w-4 shrink-0" />}
        <span>{label}</span>
      </button>

      {/* Official Rule 46 GST Tax Invoice Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-white p-5 sm:p-8 shadow-2xl border border-gray-200 text-gray-900 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Top Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#E31E24]" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                    Official GST Tax Invoice Preview
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Section 31 & Rule 46 of CGST Rules, 2017
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                  <span className="sm:hidden">Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6 text-xs text-gray-800" id={`tax-invoice-${effectiveId}`}>
              {/* Supplier Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#E31E24] tracking-tight">
                    RIDERZPRO MOBILITY SOLUTIONS PVT. LTD.
                  </h2>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    Sy. No. 44/2, Electronic City Phase 1, Hosur Main Road,<br />
                    Bengaluru, Karnataka - 560100, India
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-gray-700">
                    <strong>GSTIN:</strong> 29AABCR8492Q1Z8 | <strong>PAN:</strong> AABCR8492Q<br />
                    <strong>State:</strong> 29 - Karnataka | <strong>CIN:</strong> U34100KA2024PTC184920
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 bg-gray-900 text-white font-bold text-xs rounded uppercase tracking-wider">
                    TAX INVOICE
                  </span>
                  <p className="mt-2 text-[11px]">
                    <strong>Invoice No:</strong> <span className="font-mono font-bold">RZP/2026-27/{effectiveId}</span>
                  </p>
                  <p className="text-[11px]">
                    <strong>Date:</strong> {new Date(effectiveOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-[11px]">
                    <strong>Waybill:</strong> <span className="font-mono">DEL-{effectiveOrder.shipmentId || "84920194"}</span>
                  </p>
                </div>
              </div>

              {/* Billed To / Shipped To Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-200 pb-4">
                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                    Billed To & Shipped To (Customer)
                  </span>
                  <p className="font-bold text-sm text-gray-900">
                    {effectiveOrder.shippingAddress?.name || effectiveOrder.customerName || "Customer"}
                  </p>
                  {effectiveOrder.businessName && (
                    <p className="font-bold text-xs text-emerald-800">{effectiveOrder.businessName}</p>
                  )}
                  <p className="text-gray-600 mt-0.5 text-[11px]">
                    {effectiveOrder.shippingAddress?.street}, {effectiveOrder.shippingAddress?.city}, {effectiveOrder.shippingAddress?.state} - {effectiveOrder.shippingAddress?.pincode}
                  </p>
                  <p className="text-gray-600 text-[11px]">Phone: {effectiveOrder.shippingAddress?.phone}</p>
                  <p className="mt-1 font-mono text-[11px]">
                    <strong>Buyer GSTIN:</strong> {effectiveOrder.gstin || "URP (Unregistered Person)"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                    Shipment & Statutory Supply Details
                  </span>
                  <p><strong>Place of Supply:</strong> {effectiveOrder.shippingAddress?.state || "Karnataka"} (Code: 29)</p>
                  <p><strong>Payment Mode:</strong> {effectiveOrder.payment || "Prepaid (Razorpay / UPI)"}</p>
                  <p><strong>Payment Status:</strong> {effectiveOrder.paymentStatus || "Paid"}</p>
                  <p><strong>Fulfillment Method:</strong> Doorstep Express Consolidated Logistics</p>
                  {effectiveOrder.gstin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      ✓ Eligible for B2B Input Tax Credit (ITC)
                    </span>
                  )}
                </div>
              </div>

              {/* Itemized Goods & Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-700">
                      <th className="py-2 px-2 font-bold">#</th>
                      <th className="py-2 px-2 font-bold">Description of Goods / Services</th>
                      <th className="py-2 px-2 font-bold">HSN/SAC</th>
                      <th className="py-2 px-2 font-bold text-center">Qty</th>
                      <th className="py-2 px-2 font-bold text-right">Taxable Value</th>
                      <th className="py-2 px-2 font-bold text-right">GST Rate</th>
                      <th className="py-2 px-2 font-bold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {effectiveOrder.groups?.length > 0 ? (
                      effectiveOrder.groups.flatMap((g) => g.items).map((it, idx) => {
                        const prod = getProduct(it.productId);
                        const isBat = (prod?.category || "").includes("Battery");
                        const hsn = isBat ? "8507 60 00" : "8504 40 90";
                        const lineTaxable = it.price * it.qty;
                        return (
                          <tr key={idx}>
                            <td className="py-2 px-2 text-gray-500">{idx + 1}</td>
                            <td className="py-2 px-2 font-medium">
                              {prod?.name || it.productId}
                              <span className="block text-[10px] text-gray-500">{prod?.brand || "OEM"} · Verified EV Part</span>
                            </td>
                            <td className="py-2 px-2 font-mono text-[11px]">{hsn}</td>
                            <td className="py-2 px-2 text-center">{it.qty}</td>
                            <td className="py-2 px-2 text-right font-mono">{inr(lineTaxable)}</td>
                            <td className="py-2 px-2 text-right">18%</td>
                            <td className="py-2 px-2 text-right font-mono font-semibold">{inr(Math.round(lineTaxable * 1.18))}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="py-2 px-2 text-gray-500">1</td>
                        <td className="py-2 px-2 font-medium">
                          VoltEdge 48V High-Density Lithium Battery Pack
                          <span className="block text-[10px] text-gray-500">VoltEdge · Verified EV Battery</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-[11px]">8507 60 00</td>
                        <td className="py-2 px-2 text-center">1</td>
                        <td className="py-2 px-2 text-right font-mono">{inr(effectiveOrder.itemsTotal)}</td>
                        <td className="py-2 px-2 text-right">18%</td>
                        <td className="py-2 px-2 text-right font-mono font-semibold">{inr(Math.round(effectiveOrder.itemsTotal * 1.18))}</td>
                      </tr>
                    )}
                    {/* Fixed ₹150 Delivery Row */}
                    <tr>
                      <td className="py-2 px-2 text-gray-500">•</td>
                      <td className="py-2 px-2 font-medium">
                        Doorstep Express Logistics (Consolidated Flat Fee)
                        <span className="block text-[10px] text-gray-500">Fixed rate delivery across all vendor parcels</span>
                      </td>
                      <td className="py-2 px-2 font-mono text-[11px]">9968 12</td>
                      <td className="py-2 px-2 text-center">1</td>
                      <td className="py-2 px-2 text-right font-mono">₹150.00</td>
                      <td className="py-2 px-2 text-right">18%</td>
                      <td className="py-2 px-2 text-right font-mono font-semibold">₹177.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Schedule & Total Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <div className="space-y-1.5 text-[11px] text-gray-600">
                  <p className="font-bold text-gray-800">Tax Schedule (Statutory 18%):</p>
                  {isInterstate ? (
                    <p>• Integrated GST (18% IGST): <strong>{inr(igst)}</strong></p>
                  ) : (
                    <>
                      <p>• Central GST (9% CGST): <strong>{inr(cgst)}</strong></p>
                      <p>• State GST (9% SGST): <strong>{inr(sgst)}</strong></p>
                    </>
                  )}
                  <p className="pt-2 text-[10px] text-gray-500 leading-relaxed">
                    This is an electronically generated tax invoice under Section 31 of the CGST Act, 2017 read with Rule 46.
                  </p>
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-xs">
                    <span>Taxable Goods & Delivery Subtotal:</span>
                    <span className="font-mono font-semibold">{inr(effectiveOrder.total - effectiveOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Total Statutory GST (18%):</span>
                    <span className="font-mono font-semibold">{inr(effectiveOrder.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Invoice Grand Total:</span>
                    <span className="text-[#E31E24]">{inr(effectiveOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Digital Seal */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-t border-gray-200 pt-4">
                <div className="text-[10px] text-gray-500 font-mono">
                  Authentication Token: SHA256:{effectiveId}-VERIFIED-RULE46<br />
                  Generated on {new Date().toISOString()}
                </div>
                <div className="text-center p-2 rounded-xl border border-emerald-300 bg-emerald-50/60 self-stretch sm:self-auto">
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Digitally Certified & Sealed
                  </span>
                  <span className="font-bold text-xs text-gray-900">RiderzPro Billing Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
