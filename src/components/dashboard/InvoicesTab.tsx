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
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Matches Screenshot 3)
         ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
          Payments &amp; Invoices
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Download GST tax invoices, review payment methods, and reconcile parts purchases.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUMMARY KPI CARDS (Matches Screenshot 3: TOTAL INVOICED, TOTAL GST INPUT CREDIT, BILLING PROFILE)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TOTAL INVOICED */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
            TOTAL INVOICED
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            {inr(totalSpent)}
          </p>
          <span className="text-xs text-gray-500 font-medium block">
            {orders.length} transactions total
          </span>
        </div>

        {/* Card 2: TOTAL GST INPUT CREDIT */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
            TOTAL GST INPUT CREDIT
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            {inr(totalTax)}
          </p>
          <span className="text-xs text-gray-500 font-medium block">
            18% GST itemized
          </span>
        </div>

        {/* Card 3: BILLING PROFILE */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1">
          <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
            BILLING PROFILE
          </span>
          <p className="text-lg sm:text-xl font-bold text-[#111111]">
            {userProfile?.name?.trim() ? userProfile.name.split(" ")[0] : "User"}
          </p>
          <span className="text-xs text-emerald-600 font-semibold block">
            Active Consumer
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. INVOICES CONTAINER (Matches Screenshot 3 Empty state or list)
         ───────────────────────────────────────────────────────────── */}
      {orders.length === 0 ? (
        /* Empty State Card matching Screenshot 3 */
        <div className="p-12 sm:p-16 rounded-3xl border border-gray-200/80 bg-white text-center space-y-3 shadow-2xs">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-50 text-gray-300 mx-auto">
            <Receipt className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#111111]">
              No Invoices Generated Yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tax receipts and billing history will appear here once an order is placed.
            </p>
          </div>
        </div>
      ) : (
        /* Invoices Table */
        <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">GST (18%)</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      INV-{o.id}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {o.payment}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {inr(o.tax)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {inr(o.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          toast.success(`Invoice INV-${o.id}.pdf downloaded`);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
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
