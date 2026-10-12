import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Flag,
  Trash2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminReview } from "@/mocks/admin/types";

export function ReviewsScreen() {
  const { reviews, moderateReview } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filterTabs = [
    { label: "All Reviews", value: "ALL", count: reviews.length },
    { label: "Approved", value: "Approved", count: reviews.filter((r) => r.status === "Approved").length },
    { label: "Flagged", value: "Flagged", count: reviews.filter((r) => r.status === "Flagged").length },
    { label: "Removed", value: "Removed", count: reviews.filter((r) => r.status === "Removed").length },
  ];

  const columns: Column<AdminReview>[] = [
    {
      key: "productName",
      header: "Product",
      sortable: true,
      render: (r) => (
        <div className="max-w-xs">
          <p className="font-bold text-[#111111] truncate text-sm">{r.productName}</p>
          <p className="text-xs text-[#4B5563] font-medium mt-0.5">By {r.customerName} · {r.date}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1 font-bold text-[#B45309]">
          <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{r.rating} / 5</span>
        </div>
      ),
    },
    {
      key: "comment",
      header: "Review Details",
      render: (r) => (
        <div className="max-w-md">
          <p className="font-bold text-[#111111] text-xs">{r.title}</p>
          <p className="text-[#374151] text-[11px] font-medium line-clamp-2 mt-0.5">{r.comment}</p>
        </div>
      ),
    },
    {
      key: "verifiedPurchase",
      header: "Verification",
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
            r.verifiedPurchase ? "bg-emerald-50 text-emerald-800 border border-emerald-300" : "bg-gray-100 text-[#4B5563] border border-gray-200"
          }`}
        >
          {r.verifiedPurchase ? "Verified Buyer" : "Unverified"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <StatusBadge status={r.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Moderation",
      className: "text-right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {r.status !== "Approved" && (
            <button
              onClick={() => moderateReview(r.id, "Approved")}
              className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-1.5 transition cursor-pointer"
              title="Approve Review"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          {r.status !== "Flagged" && (
            <button
              onClick={() => moderateReview(r.id, "Flagged")}
              className="rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 p-1.5 transition cursor-pointer"
              title="Flag for Review"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
          {r.status !== "Removed" && (
            <button
              onClick={() => moderateReview(r.id, "Removed")}
              className="rounded-lg bg-red-100 hover:bg-red-200 text-red-700 p-1.5 transition cursor-pointer"
              title="Remove Review"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Customer Reviews & Content Moderation
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Approve verified purchaser testimonials, filter spam and maintain high catalog integrity.
        </p>
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        searchPlaceholder="Search review text or customer name..."
        searchKey={(r) => `${r.title} ${r.comment} ${r.customerName} ${r.productName}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(r, f) => r.status === f}
        keyExtractor={(r) => r.id}
        exportFileName="riderzpro_reviews"
      />
    </div>
  );
}
