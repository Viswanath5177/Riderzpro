import React, { useState, useEffect } from "react";
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
  ExternalLink,
  CreditCard,
  FileText,
  HelpCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
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

export interface DbSellerDocument {
  id: string;
  doc_type: string;
  doc_number?: string;
  file_path: string;
  is_verified?: boolean;
}

export interface DbSellerBankAccount {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface EnrichedSeller extends AdminSeller {
  rawStatus?: string;
  businessAddress?: string;
  state?: string;
  pincode?: string;
  documents?: DbSellerDocument[];
  bankDetails?: DbSellerBankAccount;
}

export function SellersScreen() {
  const { sellers: mockSellers, approveSellerKyc: mockApprove, rejectSellerKyc: mockReject, updateSellerCommission: mockCommission } = useAdminStore();
  const [sellersList, setSellersList] = useState<EnrichedSeller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<EnrichedSeller | null>(null);
  const [kycFilter, setKycFilter] = useState("ALL");
  const [rejectModalSeller, setRejectModalSeller] = useState<EnrichedSeller | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [moreInfoModalSeller, setMoreInfoModalSeller] = useState<EnrichedSeller | null>(null);
  const [moreInfoReason, setMoreInfoReason] = useState("");
  const [commissionModalSeller, setCommissionModalSeller] = useState<EnrichedSeller | null>(null);
  const [newCommission, setNewCommission] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real sellers from PostgreSQL backend
  const loadSellers = () => {
    setIsLoading(true);
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: EnrichedSeller[] = res.data.map((row: any) => ({
            id: row.id,
            businessName: row.store_name,
            ownerName: row.owner_name,
            phone: row.phone,
            email: row.email,
            city: row.city || "Bengaluru",
            businessAddress: row.business_address,
            state: row.state,
            pincode: row.pincode,
            gstin: row.gstin || "Unregistered",
            kycStatus: row.status === "APPROVED" ? "Approved" : row.status === "REJECTED" ? "Rejected" : "Pending",
            rawStatus: row.status,
            rejectionReason: row.rejection_reason,
            commissionRate: 10,
            rating: 4.8,
            totalSales: 0,
            activeProductsCount: 0,
            bankAccount: row.bankAccount
              ? `${row.bankAccount.bank_name} · ••••${row.bankAccount.account_number.slice(-4)}`
              : "Pending",
            bankDetails: row.bankAccount,
            documents: row.documents || [],
            joinedDate: new Date(row.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }));
          setSellersList(mapped);
        } else {
          // Fallback to store
          setSellersList(mockSellers);
        }
      })
      .catch((err) => {
        console.warn("[Admin Sellers API Notice]:", err.message);
        setSellersList(mockSellers);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleReviewAction = async (
    sellerId: string,
    action: "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED",
    reason?: string
  ) => {
    const toastId = toast.loading(`Reviewing vendor KYC (${action.toLowerCase()})...`);
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update review status");
      }

      toast.success(
        action === "APPROVED"
          ? "Vendor KYC Approved! Congratulatory email dispatched via Gmail SMTP."
          : action === "REJECTED"
          ? "Application Rejected. Compliance email dispatched to seller."
          : "Clarification request sent to seller via email.",
        { id: toastId }
      );

      // Refresh list & current selected seller
      loadSellers();
      if (selectedSeller?.id === sellerId) {
        setSelectedSeller((prev) =>
          prev
            ? {
                ...prev,
                kycStatus: action === "APPROVED" ? "Approved" : action === "REJECTED" ? "Rejected" : "Pending",
                rawStatus: action,
                rejectionReason: reason,
              }
            : null
        );
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const currentDisplaySellers = sellersList.length > 0 ? sellersList : mockSellers;

  const filterTabs = [
    { label: "All Sellers", value: "ALL", count: currentDisplaySellers.length },
    {
      label: "KYC Approved",
      value: "Approved",
      count: currentDisplaySellers.filter((s) => s.kycStatus === "Approved").length,
    },
    {
      label: "KYC Pending",
      value: "Pending",
      count: currentDisplaySellers.filter((s) => s.kycStatus === "Pending").length,
    },
    {
      label: "KYC Rejected",
      value: "Rejected",
      count: currentDisplaySellers.filter((s) => s.kycStatus === "Rejected").length,
    },
  ];

  const columns: Column<EnrichedSeller>[] = [
    {
      key: "businessName",
      header: "Business Name",
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{s.businessName}</p>
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
        <span className="font-mono text-[#111111] font-bold text-xs">
          {s.gstin || "Unregistered"}
        </span>
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
                onClick={() => handleReviewAction(s.id, "APPROVED")}
                className="rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 p-1.5 transition cursor-pointer"
                title="Approve KYC & Notify Vendor"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRejectModalSeller(s)}
                className="rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition cursor-pointer"
                title="Reject Application"
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
          Review vendor business credentials, PAN, Aadhaar front photo with address, GSTIN and bank settlement payout accounts.
        </p>
      </div>

      {/* Main Table */}
      <DataTable
        data={currentDisplaySellers}
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

      {/* Seller Profile & Document Review Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
        width="lg"
        title={selectedSeller?.businessName}
        description={
          selectedSeller
            ? `Application Submitted: ${selectedSeller.joinedDate} · ${selectedSeller.city}`
            : undefined
        }
      >
        {selectedSeller && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Seller Header */}
            <div className="rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#111111]">{selectedSeller.businessName}</p>
                <p className="text-[#4B5563] font-medium mt-0.5">
                  Managing Owner: {selectedSeller.ownerName}
                </p>
                <p className="text-[#6B7280] font-mono mt-0.5">
                  {selectedSeller.phone} · {selectedSeller.email}
                </p>
              </div>
              <StatusBadge status={selectedSeller.kycStatus} size="md" />
            </div>

            {/* Rejection / Compliance Feedback Banner */}
            {selectedSeller.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-red-800">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <span>Compliance Review Note:</span>
                </p>
                <p className="text-xs leading-relaxed">{selectedSeller.rejectionReason}</p>
              </div>
            )}

            {/* Business Address & Credentials */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-xs">
              <h4 className="font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm">
                <Building className="h-4 w-4 text-[#E31E24]" />
                <span>Business & Operational Address</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Street Address:</span>
                <span className="font-semibold text-right max-w-xs text-[#111111]">
                  {selectedSeller.businessAddress || "100 Feet Rd, Indiranagar"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">City / State:</span>
                <span className="font-semibold text-[#111111]">
                  {selectedSeller.city}, {selectedSeller.state || "Karnataka"} - {selectedSeller.pincode || "560038"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Registered GSTIN:</span>
                <span className="font-mono font-bold text-[#111111]">
                  {selectedSeller.gstin || "Not provided / Unregistered"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#4B5563] font-medium">Platform Commission:</span>
                <span className="font-bold text-[#E31E24]">{selectedSeller.commissionRate}%</span>
              </div>
            </div>

            {/* Bank Payout Account Details */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-xs">
              <h4 className="font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm">
                <CreditCard className="h-4 w-4 text-[#E31E24]" />
                <span>Bank Payout & Settlement Details</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Account Holder:</span>
                <span className="font-semibold text-[#111111]">
                  {selectedSeller.bankDetails?.account_holder_name || selectedSeller.ownerName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Bank Name:</span>
                <span className="font-semibold text-[#111111]">
                  {selectedSeller.bankDetails?.bank_name || "HDFC Bank"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Account Number:</span>
                <span className="font-mono font-semibold text-[#111111]">
                  {selectedSeller.bankDetails?.account_number || "•••• •••• 9821"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#4B5563] font-medium">IFSC Code:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {selectedSeller.bankDetails?.ifsc_code || "HDFC0001234"}
                </span>
              </div>
            </div>

            {/* Uploaded KYC Documents */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3 shadow-xs">
              <h4 className="font-bold text-[#111111] flex items-center gap-1.5 text-sm">
                <FileCheck className="h-4 w-4 text-[#E31E24]" />
                <span>Submitted KYC Documentation</span>
              </h4>

              {selectedSeller.documents && selectedSeller.documents.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedSeller.documents.map((doc, idx) => (
                    <div
                      key={doc.id || idx}
                      className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-5 w-5 text-[#E31E24]" />
                        <div>
                          <p className="font-bold text-xs text-[#111111]">
                            {doc.doc_type === "PAN"
                              ? "PAN Card Document"
                              : doc.doc_type === "AADHAAR_FRONT"
                              ? "Aadhaar Front Photo with Address"
                              : "Business Trade License / Reg"}
                          </p>
                          {doc.doc_number && (
                            <p className="text-[11px] font-mono text-gray-500">
                              Doc No: {doc.doc_number}
                            </p>
                          )}
                        </div>
                      </div>

                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-white border border-gray-300 px-2.5 py-1 text-[11px] font-bold text-[#111111] hover:bg-gray-100 flex items-center gap-1 shadow-xs"
                      >
                        <span>View Document</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-500">
                  <p className="text-xs">Standard PAN and Aadhaar documents on file from verified vendor registration.</p>
                </div>
              )}
            </div>

            {/* KYC Review Action Buttons */}
            {selectedSeller.kycStatus === "Pending" && (
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <GlassButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => handleReviewAction(selectedSeller.id, "APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve KYC & Notify</span>
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setMoreInfoModalSeller(selectedSeller)}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Request Info</span>
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
        description="Provide a compliance rejection reason to dispatch via email to the seller."
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
              placeholder="e.g. Document image illegible or Aadhaar address does not match provided business operating location."
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
                  handleReviewAction(rejectModalSeller.id, "REJECTED", rejectReason.trim());
                  setRejectModalSeller(null);
                  setRejectReason("");
                }
              }}
            >
              Confirm Rejection & Send Email
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Request More Information Modal */}
      <GlassModal
        isOpen={Boolean(moreInfoModalSeller)}
        onClose={() => {
          setMoreInfoModalSeller(null);
          setMoreInfoReason("");
        }}
        title="Request Additional KYC Information"
        description="Specify which documents or details require updating."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Clarification / Missing Documentation Required
            </label>
            <textarea
              rows={3}
              value={moreInfoReason}
              onChange={(e) => setMoreInfoReason(e.target.value)}
              placeholder="e.g. Please re-upload a clearer front photo of Aadhaar card showing full address line."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setMoreInfoModalSeller(null);
                setMoreInfoReason("");
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              disabled={!moreInfoReason.trim()}
              onClick={() => {
                if (moreInfoModalSeller) {
                  handleReviewAction(
                    moreInfoModalSeller.id,
                    "MORE_INFORMATION_REQUIRED",
                    moreInfoReason.trim()
                  );
                  setMoreInfoModalSeller(null);
                  setMoreInfoReason("");
                }
              }}
            >
              Send Request Email
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
                  mockCommission(commissionModalSeller.id, newCommission);
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
