import { useState } from "react";
import { Receipt, Download, Eye, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore, type Order } from "@/lib/store";
import { getProduct, getVendor, inr } from "@/lib/data";

export function InvoicesTab() {
  const { orders, userProfile } = useStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const totalTax = orders.reduce((s, o) => s + o.tax, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Receipt View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-base font-bold text-gray-900 font-display">RiderzPro Official GST Invoice</p>
                <p className="text-xs text-gray-500 font-mono">Invoice #{selectedInvoice.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Date: {new Date(selectedInvoice.createdAt).toLocaleDateString("en-IN")}</span>
                <span>Payment Mode: {selectedInvoice.payment}</span>
              </div>

              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100">
                {selectedInvoice.groups.map((g) => {
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

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Gross Spares Subtotal</span>
                  <span>{inr(selectedInvoice.itemsTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Express Courier & Delivery Fee</span>
                  <span>{inr(selectedInvoice.deliveryTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>IGST / CGST+SGST (18%)</span>
                  <span>{inr(selectedInvoice.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                  <span>Grand Total Paid</span>
                  <span className="text-primary">{inr(selectedInvoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success(`Invoice ${selectedInvoice.id}.pdf downloaded`);
                  setSelectedInvoice(null);
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

      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 font-display">Payments & Invoices</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Download GST tax invoices, review payment methods, and reconcile parts purchases.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Invoiced</span>
          <p className="text-2xl font-extrabold text-gray-900 font-display mt-1">{inr(totalSpent)}</p>
          <span className="text-[11px] text-gray-500">{orders.length} transactions total</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total GST Input Credit</span>
          <p className="text-2xl font-extrabold text-gray-900 font-display mt-1">{inr(totalTax)}</p>
          <span className="text-[11px] text-gray-500">18% GST itemized</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Billing Profile</span>
          <p className="text-base font-bold text-gray-900 mt-1">{userProfile.name || "Customer"}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Verified Consumer</span>
        </div>
      </div>

      {/* Invoices Table */}
      {orders.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center">
          <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-700">No Invoices Generated Yet</p>
          <p className="text-xs text-gray-500 mt-0.5">Tax receipts and billing history will appear here once an order is placed.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Vendors</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">GST (18%)</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      INV-{o.id}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      {o.groups.length} EV Vendor{o.groups.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[11px]">
                        {o.payment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{inr(o.tax)}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{inr(o.total)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(o)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                          title="View Invoice"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toast.success(`Invoice INV-${o.id}.pdf downloaded`)}
                          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition"
                          title="Download PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
