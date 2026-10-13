import React, { useState } from "react";
import {
  CreditCard,
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Bike,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { ConfirmDialog } from "../glass/ConfirmDialog";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminPaymentTransaction } from "@/mocks/admin/types";

export function PaymentsScreen() {
  const { transactions } = useAdminStore();
  const [activeTab, setActiveTab] = useState<"All" | "Transactions" | "Seller Payouts" | "Rider Payouts" | "Refunds">("All");
  const [payoutConfirmTarget, setPayoutConfirmTarget] = useState<string | null>(null);

  const filterTabs = [
    { label: "All Activity", value: "All", count: transactions.length },
    { label: "Customer Payments", value: "Payment", count: transactions.filter((t) => t.type === "Payment").length },
    { label: "Seller Payouts", value: "Seller Payout", count: transactions.filter((t) => t.type === "Seller Payout").length },
    { label: "Rider Payouts", value: "Rider Payout", count: transactions.filter((t) => t.type === "Rider Payout").length },
    { label: "Refunds", value: "Refund", count: transactions.filter((t) => t.type === "Refund").length },
  ];

  const columns: Column<AdminPaymentTransaction>[] = [
    {
      key: "transactionRef",
      header: "Reference ID",
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-mono font-bold text-[#111111] text-xs">{t.transactionRef}</span>
          <p className="text-[10px] text-[#6B7280] font-mono">Order: {t.orderId}</p>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Beneficiary / Source",
      sortable: true,
      render: (t) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{t.customerName}</p>
          <p className="text-xs text-[#4B5563] font-medium">{t.type}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (t) => {
        const isNegative = t.type === "Refund" || t.type === "Seller Payout" || t.type === "Rider Payout";
        return (
          <div className="flex items-center gap-1 font-bold tabular-nums text-xs">
            <span className={isNegative ? "text-amber-700" : "text-emerald-700"}>
              {isNegative ? "-" : "+"}₹{t.amount.toLocaleString("en-IN")}
            </span>
          </div>
        );
      },
    },
    {
      key: "gateway",
      header: "Gateway / Rail",
      render: (t) => <span className="font-bold text-[#111111] text-xs">{t.gateway}</span>,
    },
    {
      key: "fee",
      header: "Platform Fee",
      render: (t) => <span className="font-mono text-[#4B5563] font-semibold text-xs">₹{t.fee}</span>,
    },
    {
      key: "timestamp",
      header: "Date",
      sortable: true,
      render: (t) => (
        <span className="text-[11px] text-[#6B7280] font-medium">
          {new Date(t.timestamp).toLocaleDateString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Payments, Settlement Payouts & Refunds
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Razorpay, Cashfree & UPI gateway reconciliations, automated seller commissions and rider weekly earnings.
          </p>
        </div>

        <div className="flex gap-2">
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setPayoutConfirmTarget("All Verified Sellers (₹4.2 Lakhs)")}
          >
            <Building className="h-4 w-4" />
            <span>Process Seller Payout Batch</span>
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => setPayoutConfirmTarget("Active Delivery Fleet (₹1.8 Lakhs)")}
          >
            <Bike className="h-4 w-4 text-[#E31E24]" />
            <span>Process Rider Payout Batch</span>
          </GlassButton>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Gross Volume (Apr)</p>
          <p className="font-display text-2xl font-extrabold text-[#111111] mt-1 tabular-nums">₹48,24,500</p>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-bold">
            <ArrowUpRight className="h-3 w-3" /> +18.4% growth
          </p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Pending Vendor Settlements</p>
          <p className="font-display text-2xl font-extrabold text-[#B45309] mt-1 tabular-nums">₹4,20,000</p>
          <p className="text-[11px] text-[#4B5563] mt-1 font-medium">12 vendors scheduled for T+2</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Rider Fleet Payouts</p>
          <p className="font-display text-2xl font-extrabold text-sky-700 mt-1 tabular-nums">₹1,84,500</p>
          <p className="text-[11px] text-[#4B5563] mt-1 font-medium">142 riders on active cycle</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Total Refunds Processed</p>
          <p className="font-display text-2xl font-extrabold text-red-700 mt-1 tabular-nums">₹18,400</p>
          <p className="text-[11px] text-[#4B5563] mt-1 font-medium">0.38% return rate</p>
        </div>
      </div>

      {/* Main Transactions Table */}
      <DataTable
        data={transactions}
        columns={columns}
        searchPlaceholder="Search reference ID, order # or customer..."
        searchKey={(t) => `${t.transactionRef} ${t.orderId} ${t.customerName} ${t.gateway}`}
        filterTabs={filterTabs}
        currentFilter={activeTab}
        onFilterChange={(v) => setActiveTab(v as any)}
        filterPredicate={(t, f) => (f === "All" ? true : t.type === f)}
        keyExtractor={(t) => t.id}
        exportFileName="riderzpro_financial_transactions"
      />

      {/* Process Payout Batch Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(payoutConfirmTarget)}
        onClose={() => setPayoutConfirmTarget(null)}
        onConfirm={() => {
          toast.success("Payout Batch Dispatched", {
            description: `Automated IMPS / UPI transfer executed for ${payoutConfirmTarget}.`,
          });
          setPayoutConfirmTarget(null);
        }}
        title="Execute Payout Batch?"
        description={`This will trigger instant bank settlement via Cashfree API for ${payoutConfirmTarget}.`}
        confirmLabel="Execute Transfer"
        variant="primary"
      />
    </div>
  );
}
