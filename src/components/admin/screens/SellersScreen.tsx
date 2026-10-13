import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Percent,
  TrendingUp,
  Building,
  FileCheck,
  Star,
  Edit2,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassModal } from "../glass/GlassModal";
import { GlassDrawer } from "../glass/GlassDrawer";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminSeller } from "@/mocks/admin/types";

export function SellersScreen() {
  const { sellers, approveSellerKyc, rejectSellerKyc, updateSellerCommission } = useAdminStore();
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [kycFilter, setKycFilter] = useState("ALL");
  const [rejectModalSeller, setRejectModalSeller] = useState<AdminSeller | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [commissionModalSeller, setCommissionModalSeller] = useState<AdminSeller | null>(null);
  const [newCommission, setNewCommission] = useState(10);

  const filterTabs = [
    { label: "All Sellers", value: "ALL", count: sellers.length },
    { label: "KYC Approved", value: "Approved", count: sellers.filter((s) => s.kycStatus === "Approved").length },
    { label: "KYC Pending", value: "Pending", count: sellers.filter((s) => s.kycStatus === "Pending").length },
    { label: "KYC Rejected", value: "Rejected", count: sellers.filter((s) => s.kycStatus === "Rejected").length },
  ];

  const columns: Column<AdminSeller>[] = [
    {
      key: "businessName",
      header: "Business Name",
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{s.businessName}</p>
          <p className="text-xs text-[#4B5563] font-medium mt-0.5">Owner: {s.ownerName} · {s.city}</p>
        </div>
      ),
    },
    {
      key: "gstin",
      header: "GSTIN Tax ID",
      render: (s) => <span className="font-mono text-[#111111] font-bold text-xs">{s.gstin}</span>,
    },
    {
      key: "commissionRate",
      header: "Commission",
      sortable: true,
      render: (s) => (
        <span className="font-bold text-[#E31E24] tabular-nums text-xs">{s.commissionRate}%</span>
      ),
    },
    {
      key: "totalSales",
      header: "Sales Volume",
      sortable: true,
      render: (s) => (
        <span className="font-bold text-[#111111] tabular-nums text-xs">
          ₹{s.totalSales.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-1 font-bold text-[#B45309]">
          <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{s.rating}★</span>
        </div>
      ),
    },
    {
      key: "kycStatus",
      header: "KYC Status",
      sortable: true,
      render: (s) => <StatusBadge status={s.kycStatus} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {s.kycStatus === "Pending" && (
            <>
              <button
                onClick={() => approveSellerKyc(s.id)}
                className="rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 p-1.5 transition"
                title="Approve KYC"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRejectModalSeller(s)}
                className="rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition"
                title="Reject KYC"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => {
              setCommissionModalSeller(s);
              setNewCommission(s.commissionRate);
            }}
            className="rounded-lg bg-gray-100 text-[#374151] hover:bg-gray-200 p-1.5 transition cursor-pointer"
            title="Edit Commission Rate"
          >
            <Percent className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Seller Directory & KYC Approval Queue
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Verify verified manufacturer vendors, commission rates and seller payout settlement accounts.
        </p>
      </div>

      {/* Main Table */}
      <DataTable
        data={sellers}
        columns={columns}
        searchPlaceholder="Search vendor business, owner name or GSTIN..."
        searchKey={(s) => `${s.businessName} ${s.ownerName} ${s.gstin} ${s.city}`}
        filterTabs={filterTabs}
        currentFilter={kycFilter}
        onFilterChange={setKycFilter}
        filterPredicate={(s, filter) => s.kycStatus === filter}
        onRowClick={(seller) => setSelectedSeller(seller)}
        keyExtractor={(s) => s.id}
        exportFileName="riderzpro_sellers"
      />

      {/* Seller Profile Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
        width="lg"
        title={selectedSeller?.businessName}
        description={selectedSeller ? `Joined ${selectedSeller.joinedDate} · ${selectedSeller.city}` : undefined}
      >
        {selectedSeller && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Seller Header */}
            <div className="rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#111111]">{selectedSeller.businessName}</p>
                <p className="text-[#4B5563] font-medium mt-0.5">Managing Owner: {selectedSeller.ownerName}</p>
                <p className="text-[#6B7280] font-mono mt-0.5">{selectedSeller.phone} · {selectedSeller.email}</p>
              </div>
              <StatusBadge status={selectedSeller.kycStatus} size="md" />
            </div>

            {/* Rejection Reason if any */}
            {selectedSeller.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-red-800">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <span>KYC Rejection Details:</span>
                </p>
                <p className="text-xs leading-relaxed">{selectedSeller.rejectionReason}</p>
              </div>
            )}

            {/* Business & GSTIN Credentials */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm">
                <Building className="h-4 w-4 text-[#E31E24]" />
                <span>GSTIN & Banking Credentials</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Registered GSTIN:</span>
                <span className="font-mono font-bold text-[#111111]">{selectedSeller.gstin}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Payout Settlement Account:</span>
                <span className="font-mono text-[#111111] font-semibold">{selectedSeller.bankAccount}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#4B5563] font-medium">Active Platform Commission:</span>
                <span className="font-bold text-[#E31E24]">{selectedSeller.commissionRate}%</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Total Sales</p>
                <p className="font-display text-base font-bold text-[#111111] mt-1">
                  ₹{(selectedSeller.totalSales / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Catalog Items</p>
                <p className="font-display text-base font-bold text-[#111111] mt-1">
                  {selectedSeller.activeProductsCount} Parts
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Vendor Rating</p>
                <p className="font-display text-base font-bold text-[#B45309] mt-1">
                  {selectedSeller.rating}★
                </p>
              </div>
            </div>

            {/* KYC Action Buttons if Pending */}
            {selectedSeller.kycStatus === "Pending" && (
              <div className="flex gap-3 pt-2">
                <GlassButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    approveSellerKyc(selectedSeller.id);
                    setSelectedSeller({ ...selectedSeller, kycStatus: "Approved" });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve KYC Certificate</span>
                </GlassButton>
                <GlassButton
                  variant="destructive"
                  size="md"
                  className="flex-1"
                  onClick={() => setRejectModalSeller(selectedSeller)}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </GlassButton>
              </div>
            )}
          </div>
        )}
      </GlassDrawer>

      {/* Reject KYC Modal with Reason Input */}
      <GlassModal
        isOpen={Boolean(rejectModalSeller)}
        onClose={() => {
          setRejectModalSeller(null);
          setRejectReason("");
        }}
        title="Reject Seller KYC Application"
        description="Provide a clear compliance reason to send back to the vendor."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Compliance Rejection Reason
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. GSTIN certificate blurred or bank passbook name does not match trade license."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setRejectModalSeller(null);
                setRejectReason("");
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="destructive"
              size="sm"
              disabled={!rejectReason.trim()}
              onClick={() => {
                if (rejectModalSeller) {
                  rejectSellerKyc(rejectModalSeller.id, rejectReason.trim());
                  if (selectedSeller?.id === rejectModalSeller.id) {
                    setSelectedSeller({
                      ...selectedSeller,
                      kycStatus: "Rejected",
                      rejectionReason: rejectReason.trim(),
                    });
                  }
                  setRejectModalSeller(null);
                  setRejectReason("");
                }
              }}
            >
              Confirm Rejection
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Commission Rate Editor Modal */}
      <GlassModal
        isOpen={Boolean(commissionModalSeller)}
        onClose={() => setCommissionModalSeller(null)}
        title="Update Marketplace Commission Rate"
        description={`Set custom platform fee % for ${commissionModalSeller?.businessName}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Commission Rate (%)
            </label>
            <GlassInput
              type="number"
              min={2}
              max={35}
              step={0.5}
              value={newCommission}
              onChange={(e) => setNewCommission(parseFloat(e.target.value) || 0)}
              rightElement={<span className="text-[#4B5563] font-bold">%</span>}
            />
            <p className="mt-1.5 text-[#6B7280] text-[11px] font-medium">
              Standard marketplace benchmark for EV batteries and parts is 8% to 12%.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <GlassButton variant="secondary" size="sm" onClick={() => setCommissionModalSeller(null)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => {
                if (commissionModalSeller) {
                  updateSellerCommission(commissionModalSeller.id, newCommission);
                  if (selectedSeller?.id === commissionModalSeller.id) {
                    setSelectedSeller({ ...selectedSeller, commissionRate: newCommission });
                  }
                  setCommissionModalSeller(null);
                }
              }}
            >
              Save Commission
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
