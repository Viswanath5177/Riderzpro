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
  Eye,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  MapPin,
  Clock,
  ArrowRight,
  Ban,
  Check,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
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
  const {
    sellers,
    approveSellerKyc,
    requestSellerChanges,
    rejectSellerKyc,
    suspendSeller,
    reinstateSeller,
    updateSellerCommission,
    approveAllPending,
  } = useAdminStore();

  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [kycFilter, setKycFilter] = useState("ALL");

  // Approval Modal State
  const [approveModalSeller, setApproveModalSeller] = useState<AdminSeller | null>(null);
  const [approveCommission, setApproveCommission] = useState(10);
  const [approveTier, setApproveTier] = useState<"Standard" | "Gold" | "Platinum">("Standard");

  // Reject Modal State
  const [rejectModalSeller, setRejectModalSeller] = useState<AdminSeller | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRejectTemplate, setSelectedRejectTemplate] = useState("Illegible or incomplete statutory documents");

  // Request Changes Modal State
  const [changesModalSeller, setChangesModalSeller] = useState<AdminSeller | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>(["tax", "documents"]);
  const [changesNotes, setChangesNotes] = useState("");

  // Commission Edit Modal State
  const [commissionModalSeller, setCommissionModalSeller] = useState<AdminSeller | null>(null);
  const [newCommission, setNewCommission] = useState(10);

  // Bank reveal state
  const [revealedBankId, setRevealedBankId] = useState<string | null>(null);

  // Document inline zoom modal state
  const [zoomedDocUrl, setZoomedDocUrl] = useState<string | null>(null);

  // Interactive verification checklist state per seller
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    gst_active: true,
    pan_matches: true,
    bank_verified: true,
    docs_legible: true,
    brand_auth_valid: true,
    address_serviceable: true,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterTabs = [
    { label: "All Sellers", value: "ALL", count: sellers.length },
    { label: "KYC Pending", value: "Pending", count: sellers.filter((s) => s.kycStatus === "Pending").length },
    { label: "Approved", value: "Approved", count: sellers.filter((s) => s.kycStatus === "Approved").length },
    { label: "Changes Requested", value: "Changes Requested", count: sellers.filter((s) => s.kycStatus === "Changes Requested").length },
    { label: "Rejected / Suspended", value: "Rejected", count: sellers.filter((s) => s.kycStatus === "Rejected" || s.kycStatus === "Suspended").length },
  ];

  const columns: Column<AdminSeller>[] = [
    {
      key: "businessName",
      header: "Business & Store",
      sortable: true,
      render: (s) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#111111] text-sm">{s.businessName}</p>
            {s.vendorRecord?.onboarding?.shipping?.sellsLiIon && (
              <span className="rounded bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5">
                Li-ion
              </span>
            )}
            {s.vendorRecord?.onboarding?.tax?.gstExempt && (
              <span className="rounded bg-gray-100 text-gray-700 text-[9px] font-bold px-1.5 py-0.5">
                Exempt
              </span>
            )}
          </div>
          <p className="text-xs text-[#4B5563] font-medium mt-0.5">
            Owner: {s.ownerName} · {s.city}
          </p>
        </div>
      ),
    },
    {
      key: "gstin",
      header: "GSTIN Tax ID",
      render: (s) => (
        <span className="font-mono text-[#111111] font-bold text-xs">{s.gstin}</span>
      ),
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
                type="button"
                onClick={() => {
                  setApproveModalSeller(s);
                  setApproveCommission(s.commissionRate || 10);
                }}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-xs transition shadow-2xs"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangesModalSeller(s);
                  setChangesNotes("");
                }}
                className="rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold px-2 py-1 text-xs transition"
              >
                Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectModalSeller(s);
                  setRejectReason("");
                }}
                className="rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2 py-1 text-xs transition"
              >
                Reject
              </button>
            </>
          )}

          {s.kycStatus === "Approved" && (
            <button
              type="button"
              onClick={() => {
                setCommissionModalSeller(s);
                setNewCommission(s.commissionRate);
              }}
              className="text-[#6B7280] hover:text-[#E31E24] p-1.5 transition"
              title="Edit commission rate"
            >
              <Percent className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const vr = selectedSeller?.vendorRecord;
  const ob = vr?.onboarding;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[#111111]">
            Sellers & Vendor KYC Queue
          </h1>
          <p className="text-xs text-[#4B5563] font-medium mt-0.5">
            Audit seller registrations, verify GSTIN certificates and manage platform commission tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dev Mode Helper */}
          <button
            type="button"
            onClick={approveAllPending}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-2xs"
          >
            <span>⚡ Demo: Approve All Pending</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={sellers}
        columns={columns}
        searchPlaceholder="Search by business name, owner, city, or GSTIN..."
        filterTabs={filterTabs}
        currentFilter={kycFilter}
        onFilterChange={setKycFilter}
        filterPredicate={(s, filter) => {
          if (filter === "Rejected") return s.kycStatus === "Rejected" || s.kycStatus === "Suspended";
          return s.kycStatus === filter;
        }}
        onRowClick={(seller) => setSelectedSeller(seller)}
        keyExtractor={(s) => s.id}
        exportFileName="riderzpro_sellers"
      />

      {/* Full Seller Profile Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
        width="lg"
        title={selectedSeller?.businessName}
        description={selectedSeller ? `Joined ${selectedSeller.joinedDate} · ${selectedSeller.city}` : undefined}
      >
        {selectedSeller && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Header info card */}
            <div className="rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#111111]">{selectedSeller.businessName}</p>
                <p className="text-[#4B5563] font-medium mt-0.5">Managing Owner: {selectedSeller.ownerName}</p>
                <p className="text-[#6B7280] font-mono mt-0.5">{selectedSeller.phone} · {selectedSeller.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={selectedSeller.kycStatus} size="md" />
                {vr?.tier && (
                  <span className="rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                    {vr.tier} Tier
                  </span>
                )}
              </div>
            </div>

            {/* Badges strip: Li-ion / GST Exempt */}
            <div className="flex flex-wrap gap-2">
              {ob?.shipping?.sellsLiIon && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Li-ion Packaging Compliant (UN38.3 Declared)</span>
                </div>
              )}
              {ob?.tax?.gstExempt && (
                <div className="rounded-xl border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-800 font-bold flex items-center gap-1.5">
                  <span>Exempt Seller (Non-GST)</span>
                </div>
              )}
            </div>

            {/* Verification Checklist */}
            <div className="rounded-2xl border border-border bg-white p-4 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>KYC Verification Checklist</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.gst_active}
                    onChange={() => toggleCheck("gst_active")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>GSTIN Status Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.pan_matches}
                    onChange={() => toggleCheck("pan_matches")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>PAN matches signatory</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.bank_verified}
                    onChange={() => toggleCheck("bank_verified")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>Bank penny drop matches</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.docs_legible}
                    onChange={() => toggleCheck("docs_legible")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>Uploaded docs legible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.brand_auth_valid}
                    onChange={() => toggleCheck("brand_auth_valid")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>Brand authorization valid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.address_serviceable}
                    onChange={() => toggleCheck("address_serviceable")}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>Hub address serviceable</span>
                </label>
              </div>
            </div>

            {/* Tax & Banking Credentials */}
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
                <span className="text-[#4B5563] font-medium">Derived PAN:</span>
                <span className="font-mono font-bold text-[#111111]">
                  {ob?.tax?.pan || selectedSeller.gstin?.slice(2, 12)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Settlement Account:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#111111] font-semibold">
                    {revealedBankId === selectedSeller.id
                      ? ob?.bank?.accountNumber || selectedSeller.bankAccount
                      : selectedSeller.bankAccount}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (revealedBankId === selectedSeller.id) {
                        setRevealedBankId(null);
                      } else {
                        if (window.confirm("Confirm admin security credential reveal?")) {
                          setRevealedBankId(selectedSeller.id);
                        }
                      }
                    }}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    {revealedBankId === selectedSeller.id ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    <span>{revealedBankId === selectedSeller.id ? "Mask" : "Reveal"}</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">IFSC Code & Bank:</span>
                <span className="font-mono font-bold text-[#111111]">
                  {ob?.bank?.ifsc || "HDFC0000038"} ({ob?.bank?.bankName || "Bank"})
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#4B5563] font-medium">Platform Commission:</span>
                <span className="font-bold text-[#E31E24]">{selectedSeller.commissionRate}%</span>
              </div>
            </div>

            {/* Pickup Hub Details */}
            {ob?.shipping?.pickupAddress && (
              <div className="rounded-2xl border border-border bg-white p-4 space-y-2 shadow-2xs">
                <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Pickup Dispatch Hub & Logistics</span>
                </h4>
                <div className="text-xs text-muted-foreground space-y-1 pt-1">
                  <p>
                    <span className="font-semibold text-foreground">Address:</span>{" "}
                    {ob.shipping.pickupAddress.line1}, {ob.shipping.pickupAddress.city} - {ob.shipping.pickupAddress.pincode}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Coordinates:</span>{" "}
                    {ob.shipping.pickupAddress.lat}, {ob.shipping.pickupAddress.lng}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Prep / Handling Time:</span>{" "}
                    {ob.shipping.handlingTimeMins || 15} mins
                  </p>
                </div>
              </div>
            )}

            {/* Document Inline Zoom Previews */}
            <div className="rounded-2xl border border-border bg-white p-4 space-y-3 shadow-2xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <FileCheck className="h-4 w-4 text-primary" />
                <span>Uploaded KYC Certificates (Click to Zoom)</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {ob?.documents?.panDocUrl && (
                  <button
                    type="button"
                    onClick={() => setZoomedDocUrl(ob.documents.panDocUrl!)}
                    className="p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group"
                  >
                    <img
                      src={ob.documents.panDocUrl}
                      alt="PAN Doc"
                      className="h-16 w-full object-cover rounded-lg mb-1"
                    />
                    <span className="text-[10px] font-bold group-hover:text-primary">PAN Card</span>
                  </button>
                )}
                {ob?.documents?.gstDocUrl && (
                  <button
                    type="button"
                    onClick={() => setZoomedDocUrl(ob.documents.gstDocUrl!)}
                    className="p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group"
                  >
                    <img
                      src={ob.documents.gstDocUrl}
                      alt="GST Doc"
                      className="h-16 w-full object-cover rounded-lg mb-1"
                    />
                    <span className="text-[10px] font-bold group-hover:text-primary">GST Cert</span>
                  </button>
                )}
                {ob?.documents?.chequeDocUrl && (
                  <button
                    type="button"
                    onClick={() => setZoomedDocUrl(ob.documents.chequeDocUrl!)}
                    className="p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group"
                  >
                    <img
                      src={ob.documents.chequeDocUrl}
                      alt="Cheque Doc"
                      className="h-16 w-full object-cover rounded-lg mb-1"
                    />
                    <span className="text-[10px] font-bold group-hover:text-primary">Cheque</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audit History Timeline */}
            {vr?.auditTimeline && (
              <div className="rounded-2xl border border-border bg-gray-50/60 p-4 space-y-3">
                <h4 className="font-bold text-foreground text-xs">Audit History Timeline</h4>
                <div className="space-y-2 text-xs">
                  {vr.auditTimeline.map((evt: any, i: number) => (
                    <div key={evt.id || i} className="border-l-2 border-primary pl-3 py-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{evt.action}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">By {evt.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-2 flex flex-wrap gap-2">
              {selectedSeller.kycStatus === "Pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setApproveModalSeller(selectedSeller);
                      setApproveCommission(selectedSeller.commissionRate || 10);
                    }}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs shadow-xs transition"
                  >
                    Approve KYC
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangesModalSeller(selectedSeller);
                      setChangesNotes("");
                    }}
                    className="flex-1 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold py-2.5 text-xs transition"
                  >
                    Request Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModalSeller(selectedSeller);
                      setRejectReason("");
                    }}
                    className="flex-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold py-2.5 text-xs transition"
                  >
                    Reject
                  </button>
                </>
              ) : selectedSeller.kycStatus === "Suspended" ? (
                <button
                  type="button"
                  onClick={() => {
                    reinstateSeller(selectedSeller.id);
                    setSelectedSeller({ ...selectedSeller, kycStatus: "Approved" });
                  }}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs transition"
                >
                  Reinstate Vendor to Active
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    suspendSeller(selectedSeller.id);
                    setSelectedSeller({ ...selectedSeller, kycStatus: "Suspended" });
                  }}
                  className="w-full rounded-xl border border-destructive text-destructive hover:bg-destructive/10 font-bold py-2.5 text-xs transition"
                >
                  Suspend Vendor Account
                </button>
              )}
            </div>
          </div>
        )}
      </GlassDrawer>

      {/* Approve Modal */}
      {approveModalSeller && (
        <GlassModal
          isOpen={Boolean(approveModalSeller)}
          onClose={() => setApproveModalSeller(null)}
          title="Approve Seller KYC Application"
          description={`Grant marketplace access to ${approveModalSeller.businessName}`}
        >
          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Platform Commission Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={approveCommission}
                onChange={(e) => setApproveCommission(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-sm font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">
                Merchant Tier Assignment
              </label>
              <select
                value={approveTier}
                onChange={(e) => setApproveTier(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold outline-none"
              >
                <option value="Standard">Standard Tier (Standard SLAs)</option>
                <option value="Gold">Gold Tier (Featured Store)</option>
                <option value="Platinum">Platinum Tier (Priority Fulfillment)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <GlassButton variant="outline" size="sm" onClick={() => setApproveModalSeller(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => {
                  approveSellerKyc(approveModalSeller.id, approveCommission, approveTier);
                  if (selectedSeller?.id === approveModalSeller.id) {
                    setSelectedSeller({
                      ...selectedSeller,
                      kycStatus: "Approved",
                      commissionRate: approveCommission,
                    });
                  }
                  setApproveModalSeller(null);
                }}
              >
                Confirm Approval
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* Request Changes Modal */}
      {changesModalSeller && (
        <GlassModal
          isOpen={Boolean(changesModalSeller)}
          onClose={() => setChangesModalSeller(null)}
          title="Request Modifications from Seller"
          description={`Flag specific onboarding sections for ${changesModalSeller.businessName}`}
        >
          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-foreground mb-1.5">
                Flagged Sections (Reopened on Vendor's End)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["tax", "store", "shipping", "bank", "documents"].map((sec) => (
                  <label key={sec} className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(sec)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSections([...selectedSections, sec]);
                        } else {
                          setSelectedSections(selectedSections.filter((s) => s !== sec));
                        }
                      }}
                      className="accent-primary"
                    />
                    <span className="capitalize">{sec} Details</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">
                Reviewer Instructions & Notes
              </label>
              <textarea
                rows={3}
                value={changesNotes}
                onChange={(e) => setChangesNotes(e.target.value)}
                placeholder="Specify exactly what needs to be re-uploaded or corrected..."
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <GlassButton variant="outline" size="sm" onClick={() => setChangesModalSeller(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!changesNotes.trim()) {
                    toast.error("Please add instructions for the vendor");
                    return;
                  }
                  requestSellerChanges(changesModalSeller.id, selectedSections, changesNotes);
                  if (selectedSeller?.id === changesModalSeller.id) {
                    setSelectedSeller({ ...selectedSeller, kycStatus: "Changes Requested" });
                  }
                  setChangesModalSeller(null);
                }}
              >
                Send Request
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* Reject Modal */}
      {rejectModalSeller && (
        <GlassModal
          isOpen={Boolean(rejectModalSeller)}
          onClose={() => setRejectModalSeller(null)}
          title="Reject Seller KYC"
          description={`Provide rejection grounds for ${rejectModalSeller.businessName}`}
        >
          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Standard Reason Template
              </label>
              <select
                value={selectedRejectTemplate}
                onChange={(e) => {
                  setSelectedRejectTemplate(e.target.value);
                  setRejectReason(e.target.value);
                }}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none cursor-pointer"
              >
                <option value="Illegible or incomplete statutory documents">Illegible or incomplete statutory documents</option>
                <option value="GSTIN status is cancelled or inactive">GSTIN status is cancelled or inactive</option>
                <option value="Entity name mismatch with PAN card">Entity name mismatch with PAN card</option>
                <option value="Prohibited non-homologated goods reported">Prohibited non-homologated goods reported</option>
                <option value="Custom">Custom grounds...</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">
                Detailed Rejection Note
              </label>
              <textarea
                rows={3}
                value={rejectReason || selectedRejectTemplate}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why the seller KYC cannot be approved..."
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <GlassButton variant="outline" size="sm" onClick={() => setRejectModalSeller(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="destructive"
                size="sm"
                onClick={() => {
                  rejectSellerKyc(rejectModalSeller.id, rejectReason || selectedRejectTemplate);
                  if (selectedSeller?.id === rejectModalSeller.id) {
                    setSelectedSeller({ ...selectedSeller, kycStatus: "Rejected" });
                  }
                  setRejectModalSeller(null);
                }}
              >
                Confirm Rejection
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* Commission Edit Modal */}
      {commissionModalSeller && (
        <GlassModal
          isOpen={Boolean(commissionModalSeller)}
          onClose={() => setCommissionModalSeller(null)}
          title="Update Platform Commission"
          description={`Adjust commission for ${commissionModalSeller.businessName}`}
        >
          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Commission Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={newCommission}
                onChange={(e) => setNewCommission(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-sm font-bold outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <GlassButton variant="outline" size="sm" onClick={() => setCommissionModalSeller(null)}>
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => {
                  updateSellerCommission(commissionModalSeller.id, newCommission);
                  if (selectedSeller?.id === commissionModalSeller.id) {
                    setSelectedSeller({ ...selectedSeller, commissionRate: newCommission });
                  }
                  setCommissionModalSeller(null);
                }}
              >
                Save Rate
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* Zoomed Document Modal */}
      {zoomedDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center pb-2 border-b border-border mb-3">
              <span className="text-xs font-bold">Document Zoom Inspector</span>
              <button
                type="button"
                onClick={() => setZoomedDocUrl(null)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Close ✕
              </button>
            </div>
            <img
              src={zoomedDocUrl}
              alt="KYC Zoom"
              className="w-full max-h-[70vh] object-contain rounded-xl bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
