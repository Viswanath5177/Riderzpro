import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Store,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  X,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Boxes,
} from "lucide-react";
import {
  useAdminSellers,
  AdminSellerRecord,
  SellerApprovalStatus,
  SellerKycStatus,
  USE_MOCK,
} from "./adminSellersApi";
import { useAdminAuth } from "@/lib/adminAuth";

export function AdminSellersBoard() {
  const navigate = useNavigate();
  const { adminUser, isAuthenticated, loading: authLoading } = useAdminAuth();
  const { sellers, loading, error, refetch } = useAdminSellers();

  const [selectedSeller, setSelectedSeller] = useState<AdminSellerRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("ALL");
  const [kycFilter, setKycFilter] = useState<string>("ALL");

  // Filtered sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      if (approvalFilter !== "ALL" && s.approvalStatus !== approvalFilter) return false;
      if (kycFilter !== "ALL" && s.kycStatus !== kycFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.businessName.toLowerCase().includes(q);
        const matchesCity = s.city.toLowerCase().includes(q);
        const matchesGstin = s.gstin.toLowerCase().includes(q);
        const matchesOwner = s.ownerName.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesGstin && !matchesOwner) return false;
      }
      return true;
    });
  }, [sellers, approvalFilter, kycFilter, searchQuery]);

  // Role-check: only admins
  if (!authLoading && (!isAuthenticated || adminUser?.role !== "admin")) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50/50 p-8 shadow-xs">
          <ShieldAlert className="mx-auto h-12 w-12 text-[#E11D2A]" />
          <h2 className="mt-4 font-display font-black text-xl text-gray-900">
            Admin Access Restricted
          </h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            This merchant management directory requires an administrator session.
          </p>
          <a
            href="/login?redirect=/admin/sellers"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E11D2A] hover:bg-[#c91823] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
          >
            <span>Sign in to Admin Console</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  // Counts
  const approvedCount = sellers.filter((s) => s.approvalStatus === "Approved").length;
  const pendingCount = sellers.filter((s) => s.approvalStatus === "Pending").length;
  const rejectedCount = sellers.filter((s) => s.approvalStatus === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display font-black text-2xl text-gray-900 tracking-tight">
              Seller Directory & KYC Management
            </h1>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                USE_MOCK ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {USE_MOCK ? "Mock Adapter" : "Live Backend Sync"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Verified marketplace merchants, GST compliance records, and fulfillment hub addresses.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error state with retry */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs flex items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              <strong>Sync Error:</strong> {error}. Showing cached seller directory.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Total Merchants</span>
          <p className="font-display text-2xl font-black text-gray-900 mt-1">
            {loading && sellers.length === 0 ? "—" : sellers.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-700">Approved</span>
          <p className="font-display text-2xl font-black text-emerald-600 mt-1">
            {loading && sellers.length === 0 ? "—" : approvedCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-amber-700">Pending Review</span>
          <p className="font-display text-2xl font-black text-amber-600 mt-1">
            {loading && sellers.length === 0 ? "—" : pendingCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-medium text-rose-700">Rejected</span>
          <p className="font-display text-2xl font-black text-rose-600 mt-1">
            {loading && sellers.length === 0 ? "—" : rejectedCount}
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business, city, GSTIN..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E11D2A]"
            />
          </div>

          {/* Approval Filter */}
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E11D2A]"
          >
            <option value="ALL">All Approval Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* KYC Filter */}
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#E11D2A]"
          >
            <option value="ALL">All KYC Statuses</option>
            <option value="KYC Verified">KYC Verified</option>
            <option value="Pending">KYC Pending</option>
            <option value="Missing">KYC Missing</option>
          </select>
        </div>

        {(approvalFilter !== "ALL" || kycFilter !== "ALL" || searchQuery) && (
          <button
            onClick={() => {
              setApprovalFilter("ALL");
              setKycFilter("ALL");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Skeletons on initial load */}
      {loading && sellers.length === 0 && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-2xl bg-gray-200/70 border border-gray-200"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSellers.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-2xs">
          <Store className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 font-display font-bold text-base text-gray-900">
            No merchants found
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters.
          </p>
        </div>
      )}

      {/* PHONE-FRIENDLY CARD LIST (< 900px) */}
      <div className="lg:hidden space-y-3">
        {filteredSellers.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSeller(s)}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-3 cursor-pointer hover:border-gray-300 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-sm text-gray-900">{s.businessName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Owner: {s.ownerName} · {s.city}
                </p>
              </div>
              <ApprovalStatusChip status={s.approvalStatus} />
            </div>

            <div className="text-xs space-y-1 text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <p>
                <span className="font-medium text-gray-500">GSTIN:</span>{" "}
                <span className="font-mono font-bold text-gray-800">{s.gstin}</span>
              </p>
              <p className="truncate">
                <span className="font-medium text-gray-500">Pickup:</span> {s.pickupLocation}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <KycStatusChip status={s.kycStatus} />
              <span className="text-[11px] text-gray-400">Joined {s.joinedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (>= 900px) */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Business Name & Owner</th>
              <th className="py-3.5 px-4">GSTIN</th>
              <th className="py-3.5 px-4">City</th>
              <th className="py-3.5 px-4">Pickup Location</th>
              <th className="py-3.5 px-4">KYC Status</th>
              <th className="py-3.5 px-4">Approval</th>
              <th className="py-3.5 px-4 text-right">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSellers.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelectedSeller(s)}
                className="hover:bg-gray-50/80 transition cursor-pointer"
              >
                {/* Business Name & Owner */}
                <td className="py-3.5 px-4">
                  <p className="font-bold text-gray-900 text-xs">{s.businessName}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {s.ownerName} · <span className="font-mono">{s.phone}</span>
                  </p>
                </td>

                {/* GSTIN */}
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {s.gstin}
                  </span>
                </td>

                {/* City */}
                <td className="py-3.5 px-4">
                  <span className="font-medium text-gray-800">{s.city}</span>
                </td>

                {/* Pickup Location */}
                <td className="py-3.5 px-4 max-w-xs">
                  <p className="text-gray-600 truncate text-[11px]">{s.pickupLocation}</p>
                </td>

                {/* KYC Status Chip */}
                <td className="py-3.5 px-4">
                  <KycStatusChip status={s.kycStatus} />
                </td>

                {/* Approval Status Chip */}
                <td className="py-3.5 px-4">
                  <ApprovalStatusChip status={s.approvalStatus} />
                </td>

                {/* Joined Date */}
                <td className="py-3.5 px-4 text-right">
                  <span className="text-gray-500 text-[11px] font-mono">{s.joinedDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SELLER DETAIL PANEL (Slide-over drawer as specified in Task 4) */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-base text-gray-900">
                    {selectedSeller.businessName}
                  </h3>
                  <ApprovalStatusChip status={selectedSeller.approvalStatus} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Registered Partner Merchant · {selectedSeller.city}
                </p>
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 text-xs">
              {/* Primary Contact Info */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <Store className="h-4 w-4 text-gray-600" />
                  <span>Merchant Entity</span>
                </div>
                <p className="font-semibold text-gray-900">
                  Proprietor / Representative: {selectedSeller.ownerName}
                </p>
                <p className="text-gray-600 font-mono flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span>{selectedSeller.phone}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span>{selectedSeller.email}</span>
                </p>
              </div>

              {/* Tax & GSTIN Details */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span>Tax & GST Information</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">GSTIN:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedSeller.gstin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">KYC Status:</span>
                  <KycStatusChip status={selectedSeller.kycStatus} />
                </div>
              </div>

              {/* Bank Account (Masked to last 4 digits) */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span>Settlement Bank Account</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedSeller.bankName}</p>
                <p className="font-mono text-gray-600">
                  Account Number:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedSeller.bankAccountMasked}
                  </span>{" "}
                  (Masked for Security)
                </p>
              </div>

              {/* Pickup Address */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>Dispatch & Courier Pickup Location</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedSeller.pickupLocation}</p>
              </div>

              {/* Active Link: Open Live Orders filtered by this seller */}
              <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Seller Live Orders</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Inspect fulfillment velocity, pending dispatch, and rider handoffs.
                    </p>
                  </div>
                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E11D2A] hover:bg-[#c91823] text-white rounded-xl font-bold text-xs shadow-xs transition"
                  >
                    <span>View Orders</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Read-Only Notice (as per contract rules) */}
              <div className="p-3 bg-gray-100 rounded-xl text-[11px] text-gray-500 border border-gray-200/60">
                <p>
                  <strong>Note:</strong> Status changes and manual approvals are read-only until the
                  merchant lifecycle endpoints land in the API contract.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedSeller(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Approval Status Chip: Approved, Pending, Rejected
 */
function ApprovalStatusChip({ status }: { status: SellerApprovalStatus }) {
  const map: Record<
    SellerApprovalStatus,
    { bg: string; text: string; label: string; icon: React.ReactNode }
  > = {
    Approved: {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      text: "text-emerald-800",
      label: "Approved",
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-600" />,
    },
    Pending: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      text: "text-amber-800",
      label: "Pending",
      icon: <AlertTriangle className="h-3 w-3 text-amber-600" />,
    },
    Rejected: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      text: "text-rose-700",
      label: "Rejected",
      icon: <XCircle className="h-3 w-3 text-rose-600" />,
    },
  };

  const c = map[status] || {
    bg: "bg-gray-100 text-gray-700 border-gray-200",
    text: "text-gray-700",
    label: status,
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${c.bg}`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
}

/**
 * KYC Status Chip: KYC Verified, Pending, Missing
 */
function KycStatusChip({ status }: { status: SellerKycStatus }) {
  const map: Record<SellerKycStatus, { bg: string; text: string; label: string }> = {
    "KYC Verified": {
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      text: "text-blue-800",
      label: "KYC Verified",
    },
    Pending: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      text: "text-amber-800",
      label: "KYC Pending",
    },
    Missing: {
      bg: "bg-gray-100 text-gray-700 border-gray-200",
      text: "text-gray-700",
      label: "KYC Missing",
    },
  };

  const c = map[status] || {
    bg: "bg-gray-100 text-gray-700 border-gray-200",
    text: "text-gray-700",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bg}`}
    >
      {c.label}
    </span>
  );
}
