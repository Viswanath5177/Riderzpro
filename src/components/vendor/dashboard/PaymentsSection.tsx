import React, { useState } from "react";
import {
  CreditCard,
  Download,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Edit2,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor, Settlement } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

interface PaymentsSectionProps {
  vendor: Vendor;
}

export function PaymentsSection({ vendor }: PaymentsSectionProps) {
  const { settlements, requestBankUpdate } = useVendorStore();

  // Bank Account Change Request Modal
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [newAccHolder, setNewAccHolder] = useState(
    vendor.onboarding?.bank?.accountHolderName || ""
  );
  const [newAccNumber, setNewAccNumber] = useState("");
  const [newIfsc, setNewIfsc] = useState("");

  const vendorSettlements = settlements.filter((s) => s.vendorId === vendor.id);

  // Compute Balances
  const pendingBalance = vendorSettlements
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.netPayout, 38400);

  const processingBalance = vendorSettlements
    .filter((s) => s.status === "processing")
    .reduce((sum, s) => sum + s.netPayout, 18500);

  const totalPaidOut = vendorSettlements
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.netPayout, 245000);

  // Download CSV statement
  const handleDownloadStatement = () => {
    let csv =
      "SettlementID,PeriodStart,PeriodEnd,OrderIDs,GrossSales,CommissionDeduction,GstOnCommission,TcsDeduction,NetPayout,Status\n";
    vendorSettlements.forEach((s) => {
      csv += `"${s.id}","${s.periodStart}","${s.periodEnd}","${s.orderIds.join(";")} ",${s.grossSales},${s.commissionAmount},${s.gstOnCommission},${s.tcsTdsDeduction},${s.netPayout},"${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `riderzpro_statement_${vendor.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Statement CSV downloaded!");
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNumber || !newIfsc) {
      toast.error("Please fill all bank details");
      return;
    }
    requestBankUpdate(vendor.id, {
      accountHolderName: newAccHolder,
      accountNumber: newAccNumber,
      ifscCode: newIfsc.toUpperCase(),
      bankName: "HDFC Bank (Updated)",
    });
    toast.info("Bank account change request submitted for admin review & re-verification.");
    setIsBankModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">
            Payments, Settlements & Wallet
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Automatic T+7 payout cycles after verified delivery, fee breakdowns and bank management.
          </p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          Download Statement (CSV)
        </button>
      </div>

      {/* Wallet Balances Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Pending Payout (In Delivery Cycle)</span>
            <span className="h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {inr(pendingBalance)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Next payout batch: Every Tuesday</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Processing by Bank</span>
            <span className="h-7 w-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {inr(processingBalance)}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">NEFT batch queued</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Payouts Completed</span>
            <span className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {inr(totalPaidOut)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% on-time settlement</p>
        </div>
      </div>

      {/* Masked Bank Account Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-900">
                Settlement Bank Account
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3 w-3" /> Verified Penny Drop
              </span>
            </div>
            <p className="text-xs text-gray-600 font-mono mt-1">
              Account: {vendor.onboarding?.bank?.maskedAccountNumber || "XXXXXX1234"} · IFSC:{" "}
              {vendor.onboarding?.bank?.ifscCode || "HDFC0001234"} ·{" "}
              {vendor.onboarding?.bank?.bankName || "HDFC Bank"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Account Holder: {vendor.onboarding?.bank?.accountHolderName || vendor.storeName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBankModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition cursor-pointer shrink-0"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Request Account Change
        </button>
      </div>

      {/* Settlements Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Settlement Cycles & Per-Order Fee Breakdown
          </h4>
          <span className="text-[11px] text-gray-500">T+7 Delivery Basis</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-white text-[11px] font-bold text-gray-500 uppercase">
              <th className="py-3 px-4">Cycle ID</th>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4">Gross Sales</th>
              <th className="py-3 px-4">Commission</th>
              <th className="py-3 px-4">TCS / TDS (1%)</th>
              <th className="py-3 px-4">Net Payout</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendorSettlements.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/70 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{s.id}</td>
                <td className="py-3.5 px-4 text-gray-600">
                  {s.periodStart} to {s.periodEnd}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                  {inr(s.grossSales)}
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-500">
                  -{inr(s.commissionAmount)}
                  <span className="text-[10px] text-gray-400 block">
                    +{inr(s.gstOnCommission)} GST
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-500">
                  -{inr(s.tcsTdsDeduction)}
                </td>
                <td className="py-3.5 px-4 font-mono font-black text-emerald-800 text-sm">
                  {inr(s.netPayout)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {s.status === "paid" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Settled
                    </span>
                  )}
                  {s.status === "processing" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                      <Clock className="h-3 w-3" /> Processing
                    </span>
                  )}
                  {s.status === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Bank Account Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-display font-bold text-base text-gray-900">
              Request Bank Account Update
            </h3>
            <p className="text-xs text-gray-500">
              To prevent unauthorized changes, modifying settlement bank details requires
              penny-drop verification and admin approval before payouts shift.
            </p>

            <form onSubmit={handleBankSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={newAccHolder}
                  onChange={(e) => setNewAccHolder(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  New Account Number
                </label>
                <input
                  type="text"
                  value={newAccNumber}
                  onChange={(e) => setNewAccNumber(e.target.value)}
                  placeholder="e.g. 50100234567890"
                  className="w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={newIfsc}
                  onChange={(e) => setNewIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  className="w-full text-xs font-mono uppercase rounded-xl border border-gray-200 p-2.5 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700"
                >
                  Submit for Re-verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
