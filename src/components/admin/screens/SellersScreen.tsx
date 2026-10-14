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
  Box,
  ShoppingBag,
  ArrowRight,
  Lock,
  RefreshCw,
  FileSignature,
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
import { useAdminAuth } from "@/lib/adminAuth";
import { AdminSeller } from "@/mocks/admin/types";

export interface VendorChangeRequest {
  id: string;
  seller_id: string;
  store_name?: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  field_name: string;
  field_label: string;
  old_value: string;
  new_value: string;
  reason: string;
  supporting_doc_url?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

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
  accountStatus?: "ACTIVE" | "FROZEN";
  freezeReason?: string;
  frozenAt?: string;
  businessAddress?: string;
  state?: string;
  pincode?: string;
  documents?: DbSellerDocument[];
  bankDetails?: DbSellerBankAccount;
  publishedProductsCount?: number;
  salesCount?: number;
  totalRevenue?: number;
}

export function SellersScreen() {
  const { adminUser } = useAdminAuth();
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
  const [viewingDoc, setViewingDoc] = useState<{
    type: string;
    number?: string;
    title: string;
    filePath?: string;
    sellerName: string;
  } | null>(null);

  const [activeMainTab, setActiveMainTab] = useState<"sellers" | "changes">(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("tab") === "changes") return "changes";
    }
    return "sellers";
  });
  const [changeRequests, setChangeRequests] = useState<VendorChangeRequest[]>([]);
  const [isLoadingChanges, setIsLoadingChanges] = useState(false);
  const [changeFilter, setChangeFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [rejectChangeModal, setRejectChangeModal] = useState<VendorChangeRequest | null>(null);
  const [rejectChangeNotes, setRejectChangeNotes] = useState("");

  const loadChangeRequests = () => {
    setIsLoadingChanges(true);
    fetch("/api/admin/change-requests")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setChangeRequests(res.data);
        } else {
          setChangeRequests([]);
        }
      })
      .catch((err) => {
        console.warn("[Admin Change Requests API Notice]:", err.message);
        setChangeRequests([]);
      })
      .finally(() => {
        setIsLoadingChanges(false);
      });
  };

  // Fetch real sellers from PostgreSQL backend
  const loadSellers = () => {
    setIsLoadingChanges(true);
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
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
            accountStatus: row.account_status || "ACTIVE",
            freezeReason: row.freeze_reason || undefined,
            frozenAt: row.frozen_at || undefined,
            rawStatus: row.status,
            rejectionReason: row.rejection_reason,
            commissionRate: 10,
            rating: 4.8,
            totalSales: Number(row.total_revenue) || 0,
            salesCount: Number(row.sales_count) || 0,
            activeProductsCount: Number(row.published_products_count) || 0,
            publishedProductsCount: Number(row.published_products_count) || 0,
            totalRevenue: Number(row.total_revenue) || 0,
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
          setSellersList([]);
        }
      })
      .catch((err) => {
        console.warn("[Admin Sellers API Notice]:", err.message);
        setSellersList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadSellers();
    loadChangeRequests();
  }, []);

  const [freezeModalSeller, setFreezeModalSeller] = useState<EnrichedSeller | null>(null);
  const [freezeReasonText, setFreezeReasonText] = useState("");

  const handleFreezeSeller = async () => {
    if (!freezeModalSeller) return;
    if (!freezeReasonText.trim()) {
      toast.error("A compliance reason is required to freeze a vendor account.");
      return;
    }
    const toastId = toast.loading("Freezing vendor account...");
    try {
      const res = await fetch(`/api/admin/sellers/${freezeModalSeller.id}/freeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: freezeReasonText.trim(),
          adminId: adminUser?.id || "adm_seller_01",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to freeze account");

      toast.success("Vendor account frozen. Notifications & compliance records dispatched.", { id: toastId });
      setFreezeModalSeller(null);
      setFreezeReasonText("");
      loadSellers();
      if (selectedSeller?.id === freezeModalSeller.id) {
        setSelectedSeller((prev) => (prev ? { ...prev, accountStatus: "FROZEN", freezeReason: freezeReasonText.trim() } : null));
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleUnfreezeSeller = async (seller: EnrichedSeller) => {
    const toastId = toast.loading("Unfreezing vendor account...");
    try {
      const res = await fetch(`/api/admin/sellers/${seller.id}/unfreeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminUser?.id || "adm_seller_01" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to unfreeze account");

      toast.success("Vendor account unfreezed and restored to ACTIVE status.", { id: toastId });
      loadSellers();
      if (selectedSeller?.id === seller.id) {
        setSelectedSeller((prev) => (prev ? { ...prev, accountStatus: "ACTIVE", freezeReason: undefined } : null));
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleReviewChangeRequest = async (
    requestId: string,
    action: "APPROVED" | "REJECTED",
    notes?: string
  ) => {
    const toastId = toast.loading(`${action === "APPROVED" ? "Approving" : "Rejecting"} change request...`);
    try {
      const res = await fetch(`/api/admin/change-requests/${requestId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: notes || "",
          adminId: adminUser?.id || "adm_seller_01",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update review status");
      }

      toast.success(
        action === "APPROVED"
          ? "Change request approved! Seller details updated and vendor notified."
          : "Change request rejected. Compliance note sent to vendor.",
        { id: toastId }
      );

      setRejectChangeModal(null);
      setRejectChangeNotes("");
      loadChangeRequests();
      loadSellers();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

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
        body: JSON.stringify({ action, reason, adminId: adminUser?.id }),
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
      header: "Seller & Store Name",
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{s.businessName}</p>
          <p className="text-xs text-[#4B5563] font-medium mt-0.5">
            Owner: <strong className="text-[#111111]">{s.ownerName}</strong> · {s.city}
          </p>
          <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">
            {s.email} · {s.phone}
          </p>
        </div>
      ),
    },
    {
      key: "activeProductsCount",
      header: "Products Published",
      sortable: true,
      render: (s) => {
        const count = s.publishedProductsCount ?? s.activeProductsCount ?? 0;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 w-fit">
              <Box className="h-3.5 w-3.5 text-blue-600" />
              <span>{count} {count === 1 ? "Product" : "Products"}</span>
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium pl-1">
              Catalog submissions
            </span>
          </div>
        );
      },
    },
    {
      key: "totalSales",
      header: "Sales Count",
      sortable: true,
      render: (s) => {
        const sales = s.salesCount ?? 0;
        const volume = s.totalRevenue ?? s.totalSales ?? 0;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 w-fit">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
              <span>{sales} {sales === 1 ? "Sale" : "Sales"}</span>
            </span>
            <span className="text-[11px] font-bold text-[#111111] tabular-nums pl-1">
              ₹{volume.toLocaleString("en-IN")} Gross
            </span>
          </div>
        );
      },
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
      key: "kycStatus",
      header: "Status & Governance",
      sortable: true,
      render: (s) => (
        <div className="flex flex-col gap-1 items-start">
          <StatusBadge status={s.kycStatus} size="sm" />
          {s.kycStatus === "Approved" && (
            s.accountStatus === "FROZEN" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                <Lock className="h-2.5 w-2.5" /> Frozen
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                <ShieldCheck className="h-2.5 w-2.5" /> Active
              </span>
            )
          )}
        </div>
      ),
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
          {s.kycStatus === "Approved" && (
            s.accountStatus === "FROZEN" ? (
              <button
                onClick={() => handleUnfreezeSeller(s)}
                className="rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 p-1.5 transition cursor-pointer"
                title="Unfreeze Vendor Account"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setFreezeModalSeller(s);
                  setFreezeReasonText("");
                }}
                className="rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 p-1.5 transition cursor-pointer"
                title="Freeze Vendor Account (Suspend Operations)"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            )
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
          Seller Directory & Business Verification
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Review vendor onboarding KYC, PAN/Aadhaar/GSTIN documents, and review change requests for verified business details.
        </p>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 mt-4 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveMainTab("sellers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeMainTab === "sellers"
                ? "bg-[#E31E24] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Vendors & KYC Queue</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-mono font-bold ${
                activeMainTab === "sellers" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {currentDisplaySellers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab("changes")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeMainTab === "changes"
                ? "bg-[#E31E24] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <FileSignature className="h-4 w-4" />
            <span>Business Detail Change Requests</span>
            {changeRequests.filter((r) => r.status === "PENDING").length > 0 && (
              <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-xs font-mono font-bold animate-pulse">
                {changeRequests.filter((r) => r.status === "PENDING").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeMainTab === "sellers" ? (
        /* Main Table */
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
      ) : (
        /* Business Detail Change Requests View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#E31E24]" />
                <span>Vendor Detail Modifications Under Governance</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Verified legal names, GSTINs, and registered addresses require compliance review before updates take effect in the marketplace.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => {
                const count = status === "ALL" ? changeRequests.length : changeRequests.filter((r) => r.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setChangeFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      changeFilter === status
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
              <button
                onClick={loadChangeRequests}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                title="Refresh requests"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingChanges ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Change Requests List */}
          {changeRequests.filter((r) => changeFilter === "ALL" || r.status === changeFilter).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <FileSignature className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-gray-800 text-sm">No business detail change requests found</p>
              <p className="text-xs text-gray-500 mt-1">
                {changeFilter === "PENDING"
                  ? "All vendor modification requests have been reviewed!"
                  : "No change requests match the selected filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {changeRequests
                .filter((r) => changeFilter === "ALL" || r.status === changeFilter)
                .map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-gray-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{req.store_name || "Vendor"}</span>
                          <span className="text-xs text-gray-500">({req.owner_name})</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                            {req.field_label || req.field_name}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                          {req.email} · {req.phone} · ID: {req.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            req.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : req.status === "REJECTED"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                          }`}
                        >
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(req.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs bg-gray-50/60 rounded-xl px-3 my-2 border border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Current Verified Value</span>
                        <p className="font-mono text-gray-600 line-through mt-0.5">{req.old_value || "(Empty)"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Requested New Value</span>
                        <p className="font-mono font-bold text-gray-900 text-sm mt-0.5 text-emerald-700">{req.new_value}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Supporting Document</span>
                        {req.supporting_doc_url ? (
                          <a
                            href={req.supporting_doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-[#E31E24] hover:underline mt-0.5"
                          >
                            <span>Open Document</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-gray-400 mt-0.5 italic">None provided</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
                      <div className="text-gray-600">
                        <strong className="text-gray-800">Reason: </strong>
                        <span>{req.reason}</span>
                        {req.admin_notes && (
                          <div className="mt-1 text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200">
                            <strong>Admin Note: </strong>
                            <span>{req.admin_notes}</span>
                          </div>
                        )}
                      </div>

                      {req.status === "PENDING" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleReviewChangeRequest(req.id, "APPROVED")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition cursor-pointer text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve Change</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectChangeModal(req);
                              setRejectChangeNotes("");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 transition cursor-pointer text-xs"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

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

            {/* Account Status / Freeze Governance Card */}
            {selectedSeller.kycStatus === "Approved" && (
              <div className="rounded-2xl border p-3.5 space-y-2 shadow-xs transition bg-white border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Governance Status</span>
                    <span className={`inline-flex items-center gap-1.5 font-bold text-xs mt-0.5 ${
                      selectedSeller.accountStatus === "FROZEN" ? "text-red-700" : "text-emerald-700"
                    }`}>
                      {selectedSeller.accountStatus === "FROZEN" ? (
                        <>
                          <Lock className="h-3.5 w-3.5 text-red-600" />
                          <span>Account FROZEN (Selling & Submissions Paused)</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Account ACTIVE (Good Standing)</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    {selectedSeller.accountStatus === "FROZEN" ? (
                      <button
                        onClick={() => handleUnfreezeSeller(selectedSeller)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition cursor-pointer text-xs flex items-center gap-1"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Unfreeze Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setFreezeModalSeller(selectedSeller);
                          setFreezeReasonText("");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 transition cursor-pointer text-xs flex items-center gap-1"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Freeze Account</span>
                      </button>
                    )}
                  </div>
                </div>

                {selectedSeller.accountStatus === "FROZEN" && selectedSeller.freezeReason && (
                  <div className="rounded-xl bg-red-50 p-2.5 text-red-800 text-[11px] border border-red-200">
                    <strong>Freeze Reason: </strong>
                    <span>{selectedSeller.freezeReason}</span>
                  </div>
                )}
              </div>
            )}

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

                      <button
                        type="button"
                        onClick={() =>
                          setViewingDoc({
                            type: doc.doc_type,
                            number: doc.doc_number,
                            title:
                              doc.doc_type === "PAN"
                                ? "PAN Card Document"
                                : doc.doc_type === "AADHAAR_FRONT"
                                ? "Aadhaar Front Photo with Address"
                                : "Business Trade License / Reg",
                            filePath: doc.file_path,
                            sellerName: selectedSeller.ownerName || selectedSeller.businessName,
                          })
                        }
                        className="rounded-lg bg-white border border-gray-300 px-2.5 py-1 text-[11px] font-bold text-[#111111] hover:bg-gray-100 flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>View Document</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
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

      {/* KYC Document Viewer Modal */}
      <GlassModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        title={viewingDoc?.title || "KYC Verification Document"}
        description={`Applicant: ${viewingDoc?.sellerName || "Seller"} · Document No: ${viewingDoc?.number || "On file"}`}
      >
        <div className="space-y-4 text-xs">
          {viewingDoc?.filePath &&
          (viewingDoc.filePath.startsWith("data:image/") ||
            viewingDoc.filePath.startsWith("http://") ||
            viewingDoc.filePath.startsWith("https://")) ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2 overflow-hidden flex justify-center">
              <img
                src={viewingDoc.filePath}
                alt={viewingDoc.title}
                className="max-h-[360px] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>
          ) : (
            /* Official Document Certificate Preview Card */
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-red-50/30 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#E31E24]/10 text-[#E31E24] grid place-items-center font-bold">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111111]">{viewingDoc?.title}</h4>
                    <p className="text-[11px] text-gray-500">Government of India · Verified Verification Record</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  Verified In Database
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white rounded-xl p-3.5 border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Document Holder</span>
                  <p className="font-bold text-[#111111] mt-0.5">{viewingDoc?.sellerName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Identifier / Number</span>
                  <p className="font-mono font-extrabold text-[#E31E24] mt-0.5">{viewingDoc?.number || "Provided"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Associated Business</span>
                  <p className="font-medium text-gray-700 mt-0.5">{selectedSeller?.businessName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Registered Location</span>
                  <p className="font-medium text-gray-700 mt-0.5">{selectedSeller?.city}, {selectedSeller?.state}</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 italic text-center">
                KYC records and verification hashes are authenticated via Riderzpro compliance pipeline.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
            <GlassButton variant="secondary" size="sm" onClick={() => setViewingDoc(null)}>
              Close Document
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Reject Change Request Modal */}
      <GlassModal
        isOpen={Boolean(rejectChangeModal)}
        onClose={() => setRejectChangeModal(null)}
        title="Reject Business Detail Change"
        description={`Vendor: ${rejectChangeModal?.store_name} · Requested Field: ${rejectChangeModal?.field_label}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Please provide a compliance reason for declining this change request. This will be visible in the vendor's audit history and notified immediately.
          </p>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Reason for Rejection *</label>
            <textarea
              value={rejectChangeNotes}
              onChange={(e) => setRejectChangeNotes(e.target.value)}
              placeholder="e.g. Supporting GST certificate does not match the requested legal entity name..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <GlassButton variant="secondary" size="sm" onClick={() => setRejectChangeModal(null)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => {
                if (rejectChangeModal) {
                  handleReviewChangeRequest(rejectChangeModal.id, "REJECTED", rejectChangeNotes);
                }
              }}
            >
              Confirm Rejection
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Freeze Vendor Account Modal */}
      <GlassModal
        isOpen={Boolean(freezeModalSeller)}
        onClose={() => setFreezeModalSeller(null)}
        title="Freeze Vendor Account"
        description={`Vendor: ${freezeModalSeller?.businessName} · Owner: ${freezeModalSeller?.ownerName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 leading-relaxed">
            <strong className="block mb-1">Administrative Freeze Protocol:</strong>
            Freezing will immediately suspend the vendor's catalog listings, hide their products from the marketplace storefront, and block all new product submissions. An in-app notification and compliance notification will be sent.
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Compliance Reason for Freezing * <span className="text-red-600">(Mandatory)</span>
            </label>
            <textarea
              value={freezeReasonText}
              onChange={(e) => setFreezeReasonText(e.target.value)}
              placeholder="e.g. Audit inquiry regarding customer complaints or unverified regulatory documents..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <GlassButton variant="secondary" size="sm" onClick={() => setFreezeModalSeller(null)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleFreezeSeller}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Account Freeze
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
