import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassDrawer } from "../glass/GlassDrawer";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminWarrantyClaim } from "@/mocks/admin/types";

export function WarrantyScreen() {
  const { warrantyClaims, resolveWarrantyClaim } = useAdminStore();
  const [selectedClaim, setSelectedClaim] = useState<AdminWarrantyClaim | null>(null);

  const columns: Column<AdminWarrantyClaim>[] = [
    {
      key: "claimNumber",
      header: "Claim #",
      sortable: true,
      render: (w) => (
        <div>
          <span className="font-mono font-bold text-[#111111] text-xs">{w.claimNumber}</span>
          <p className="text-[10px] text-[#6B7280] font-mono">Order: {w.orderId}</p>
        </div>
      ),
    },
    {
      key: "productName",
      header: "Defective Component",
      render: (w) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{w.productName}</p>
          <p className="text-[10px] text-[#4B5563] font-mono mt-0.5">S/N: {w.serialNumber}</p>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      sortable: true,
      render: (w) => <span className="font-bold text-[#111111] text-xs">{w.customerName}</span>,
    },
    {
      key: "reason",
      header: "Failure Diagnosis",
      render: (w) => <p className="max-w-xs text-xs text-[#374151] font-medium truncate">{w.reason}</p>,
    },
    {
      key: "dateFiled",
      header: "Filed On",
      sortable: true,
      render: (w) => <span className="text-[#6B7280] font-medium text-xs">{w.dateFiled}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (w) => <StatusBadge status={w.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Warranty Claims, RMA & Replacement Desk
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Process battery degradation claims, motor controller defects and doorstep replacement logistics.
        </p>
      </div>

      <DataTable
        data={warrantyClaims}
        columns={columns}
        searchPlaceholder="Search claim #, serial # or component..."
        searchKey={(w) => `${w.claimNumber} ${w.serialNumber} ${w.productName} ${w.customerName}`}
        onRowClick={(claim) => setSelectedClaim(claim)}
        keyExtractor={(w) => w.id}
        exportFileName="riderzpro_warranty_claims"
      />

      {/* Claim Detail Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedClaim)}
        onClose={() => setSelectedClaim(null)}
        width="lg"
        title={selectedClaim ? `Claim #${selectedClaim.claimNumber}` : undefined}
        description={selectedClaim ? `Filed by ${selectedClaim.customerName} on ${selectedClaim.dateFiled}` : undefined}
      >
        {selectedClaim && (
          <div className="space-y-6 text-xs text-[#111111]">
            <div className="rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#111111] text-base">{selectedClaim.productName}</p>
                <p className="text-[#4B5563] font-mono mt-0.5 font-medium">Serial: {selectedClaim.serialNumber}</p>
              </div>
              <StatusBadge status={selectedClaim.status} size="md" />
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-[#111111] flex items-center gap-1.5 text-sm">
                <AlertTriangle className="h-4 w-4 text-[#E31E24]" />
                <span>Customer Defect Description</span>
              </h4>
              <p className="text-[#111111] leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-[#E5E7EB] font-medium">
                "{selectedClaim.reason}"
              </p>
              {selectedClaim.resolutionNotes && (
                <div className="pt-2 border-t border-[#F3F4F6]">
                  <p className="text-[#6B7280] font-bold uppercase text-[10px]">Resolution Notes:</p>
                  <p className="text-emerald-700 font-bold mt-0.5">{selectedClaim.resolutionNotes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons if Pending */}
            {selectedClaim.status === "Pending Inspection" && (
              <div className="space-y-2 pt-2">
                <GlassButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    resolveWarrantyClaim(selectedClaim.id, "Approved (Replacement)", "Hub inspection verified manufacturer defect. Doorstep replacement scheduled.");
                    setSelectedClaim({ ...selectedClaim, status: "Approved (Replacement)" });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve OEM Replacement</span>
                </GlassButton>

                <div className="flex gap-2">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      resolveWarrantyClaim(selectedClaim.id, "Approved (Refund)", "Refund approved directly to customer source account.");
                      setSelectedClaim({ ...selectedClaim, status: "Approved (Refund)" });
                    }}
                  >
                    <span>Approve Full Refund</span>
                  </GlassButton>
                  <GlassButton
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      resolveWarrantyClaim(selectedClaim.id, "Rejected", "Damage attributed to physical impact outside warranty scope.");
                      setSelectedClaim({ ...selectedClaim, status: "Rejected" });
                    }}
                  >
                    <span>Reject Claim</span>
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassDrawer>
    </div>
  );
}
