import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Box,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  Tag,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  Check,
  Search,
  CheckSquare,
  Square,
  HelpCircle,
  FileText,
  Percent,
  IndianRupee,
  ExternalLink,
  Info,
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
import { AdminProduct } from "@/mocks/admin/types";
import { bikes as CATALOG_BIKES } from "@/lib/data";

export function ProductApprovalsScreen() {
  const {
    products,
    sellers,
    approveProductReview,
    requestProductReviewChanges,
    rejectProductReview,
    approveAllPending,
  } = useAdminStore();

  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "NEW" | "REVISION" | "OFFER">("ALL");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Edit with approve fields
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<AdminProduct["category"]>("Batteries");
  const [editPrice, setEditPrice] = useState(0);
  const [editDiscountPrice, setEditDiscountPrice] = useState(0);

  // Request changes fields
  const [changeField, setChangeField] = useState("images");
  const [changeComment, setChangeComment] = useState("");

  // Reject fields
  const [rejectReason, setRejectReason] = useState("Specifications mismatch / Prohibited item");

  // Checklist state for active drawer
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    images: false,
    category: false,
    fitment: false,
    tax: false,
    genuine: false,
  });

  // Reset checklist when product changes
  useEffect(() => {
    setChecklist({
      images: false,
      category: false,
      fitment: false,
      tax: false,
      genuine: false,
    });
  }, [selectedProduct?.id]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        if (zoomedImage) setZoomedImage(null);
        else if (selectedProduct) setSelectedProduct(null);
      } else if (selectedProduct) {
        if (e.key.toLowerCase() === "a" && !isEditModalOpen && !isChangesModalOpen && !isRejectModalOpen) {
          handleApprove(selectedProduct);
        } else if (e.key.toLowerCase() === "r" && !isEditModalOpen && !isChangesModalOpen && !isRejectModalOpen) {
          setIsRejectModalOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct, zoomedImage, isEditModalOpen, isChangesModalOpen, isRejectModalOpen]);

  // Pending queue
  const pendingQueue = useMemo(() => {
    return products.filter((p) => {
      const isPending =
        p.status === "Pending Review" ||
        (p.vendorProductRecord && p.vendorProductRecord.status === "pending_review") ||
        Boolean(p.pendingRevision);
      if (!isPending) return false;

      if (filterType === "REVISION") return Boolean(p.pendingRevision);
      if (filterType === "NEW") return !p.pendingRevision && !p.id.startsWith("offer_");
      if (filterType === "OFFER") return p.id.startsWith("offer_");
      return true;
    });
  }, [products, filterType]);

  const allPendingCount = useMemo(
    () => products.filter((p) => p.status === "Pending Review" || p.pendingRevision).length,
    [products]
  );
  const revisionsCount = useMemo(() => products.filter((p) => Boolean(p.pendingRevision)).length, [products]);
  const newProductsCount = useMemo(
    () => products.filter((p) => (p.status === "Pending Review" || p.vendorProductRecord?.status === "pending_review") && !p.pendingRevision).length,
    [products]
  );

  const handleApprove = (p: AdminProduct) => {
    approveProductReview(p.id);
    toast.success(`Approved "${p.title}"! It is now live in the store.`);
    setSelectedProduct(null);
  };

  const handleApproveWithEdits = () => {
    if (!selectedProduct) return;
    approveProductReview(selectedProduct.id, {
      title: editTitle,
      category: editCategory,
      price: editPrice,
      discountPrice: editDiscountPrice,
    });
    toast.success(`Approved "${editTitle}" with revisions!`);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRequestChanges = () => {
    if (!selectedProduct) return;
    requestProductReviewChanges(selectedProduct.id, {
      [changeField]: changeComment || "Please review and rectify specified product details.",
    });
    toast.info(`Requested revisions on "${selectedProduct.title}"`);
    setIsChangesModalOpen(false);
    setSelectedProduct(null);
  };

  const handleReject = () => {
    if (!selectedProduct) return;
    rejectProductReview(selectedProduct.id, rejectReason);
    toast.error(`Rejected "${selectedProduct.title}"`);
    setIsRejectModalOpen(false);
    setSelectedProduct(null);
  };

  const handleBulkApprove = () => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach((id) => approveProductReview(id));
    toast.success(`Approved ${selectedProductIds.length} listings in bulk!`);
    setSelectedProductIds([]);
  };

  const handleBulkReject = () => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach((id) => rejectProductReview(id, "Bulk rejected during moderation batch"));
    toast.error(`Rejected ${selectedProductIds.length} listings`);
    setSelectedProductIds([]);
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === pendingQueue.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(pendingQueue.map((p) => p.id));
    }
  };

  // Price sanity check logic
  const priceSanity = useMemo(() => {
    if (!selectedProduct) return null;
    const sameCat = products.filter(
      (p) => p.id !== selectedProduct.id && p.category === selectedProduct.category && p.status === "Active"
    );
    if (sameCat.length === 0) return { status: "normal", note: "First product in category" };

    const avgPrice = sameCat.reduce((sum, p) => sum + (p.discountPrice || p.price), 0) / sameCat.length;
    const currentPrice = selectedProduct.discountPrice || selectedProduct.price;
    const diffPct = Math.round(((currentPrice - avgPrice) / avgPrice) * 100);

    if (diffPct < -40) {
      return {
        status: "low",
        note: `Price is ${Math.abs(diffPct)}% below category benchmark (₹${Math.round(avgPrice)}). Verify genuine parts.`,
      };
    } else if (diffPct > 60) {
      return {
        status: "high",
        note: `Price is ${diffPct}% above category benchmark (₹${Math.round(avgPrice)}).`,
      };
    }
    return {
      status: "normal",
      note: `Within typical category benchmark (avg ₹${Math.round(avgPrice)}).`,
    };
  }, [selectedProduct, products]);

  // Duplicate detector
  const duplicateWarning = useMemo(() => {
    if (!selectedProduct) return null;
    const dup = products.find(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.sku.toLowerCase() === selectedProduct.sku.toLowerCase() ||
          p.title.trim().toLowerCase() === selectedProduct.title.trim().toLowerCase())
    );
    return dup ? `Potential duplicate of "${dup.title}" (SKU: ${dup.sku})` : null;
  }, [selectedProduct, products]);

  // Fitment voltage compatibility check
  const fitmentWarnings = useMemo(() => {
    if (!selectedProduct) return [];
    const specsVoltageStr =
      selectedProduct.specs?.voltage ||
      selectedProduct.vendorProductRecord?.specs?.voltage ||
      "";
    const parsedVolt = parseInt(specsVoltageStr.replace(/\D/g, ""), 10);
    if (!parsedVolt) return [];

    const warnings: string[] = [];
    (selectedProduct.compatibleBikes || []).forEach((bikeId) => {
      const b = CATALOG_BIKES.find((bk) => bk.id === bikeId);
      if (b && b.voltage && b.voltage !== parsedVolt) {
        warnings.push(
          `Voltage mismatch with ${b.name}: part is ${parsedVolt}V, bike runs on ${b.voltage}V`
        );
      }
    });
    return warnings;
  }, [selectedProduct]);

  const columns: Column<AdminProduct>[] = [
    {
      key: "id",
      header: (
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="text-gray-400 hover:text-[#E31E24] transition cursor-pointer"
          >
            {selectedProductIds.length > 0 && selectedProductIds.length === pendingQueue.length ? (
              <CheckSquare className="h-4 w-4 text-[#E31E24]" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </button>
          <span>Select</span>
        </div>
      ),
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectProduct(p.id);
          }}
          className="text-gray-400 hover:text-[#E31E24] transition cursor-pointer"
        >
          {selectedProductIds.includes(p.id) ? (
            <CheckSquare className="h-4 w-4 text-[#E31E24]" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      key: "title",
      header: "Product & SKU",
      sortable: true,
      render: (p) => {
        const vp = p.vendorProductRecord;
        const mainImg = vp?.images?.[0] || p.imageUrl;
        const isRevision = Boolean(p.pendingRevision);

        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={mainImg}
                alt={p.title}
                className="h-11 w-11 rounded-xl object-cover border border-[#E5E7EB] shrink-0 bg-gray-100"
              />
              {isRevision && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-extrabold px-1 rounded-full shadow-xs">
                  REV
                </span>
              )}
            </div>
            <div className="min-w-0 max-w-xs">
              <p className="font-bold text-[#111111] truncate text-sm">{p.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-gray-500">{p.sku}</span>
                {vp?.partType && (
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-md border border-gray-200">
                    {vp.partType}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "sellerName",
      header: "Vendor Store",
      sortable: true,
      render: (p) => {
        const seller = sellers.find((s) => s.id === p.sellerId);
        return (
          <div>
            <p className="font-bold text-xs text-[#111111]">{p.sellerName || seller?.storeName || "Vendor"}</p>
            <p className="text-[10px] text-gray-500">ID: {p.sellerId}</p>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (p) => <span className="font-semibold text-xs text-[#111111]">{p.category}</span>,
    },
    {
      key: "price",
      header: "Pricing",
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-bold text-xs text-[#111111] tabular-nums">
            ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
          </span>
          {p.discountPrice && (
            <p className="text-[10px] text-gray-400 line-through tabular-nums">
              MRP ₹{p.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Submission Type",
      render: (p) => {
        if (p.pendingRevision) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="h-3 w-3" /> Revision
            </span>
          );
        }
        if (p.id.startsWith("offer_")) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Tag className="h-3 w-3" /> Offer Listing
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="h-3 w-3" /> New Product
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-2">
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(p);
            }}
            className="text-xs h-7.5 px-2.5 font-bold text-[#E31E24] hover:bg-red-50"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Review
          </GlassButton>
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(p);
            }}
            className="text-xs h-7.5 px-2 text-emerald-600 hover:bg-emerald-50"
            title="Quick Approve"
          >
            <CheckCircle2 className="h-4 w-4" />
          </GlassButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-black text-[#111111]">Product Approvals Queue</h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-[#E31E24]">
              {allPendingCount} pending
            </span>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Review vendor catalog listings, fitment compatibility, HSN tax accuracy and image authenticity.
          </p>
        </div>

        {/* Demo Mode / Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedProductIds.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-700">{selectedProductIds.length} selected</span>
              <GlassButton
                size="sm"
                onClick={handleBulkApprove}
                className="bg-emerald-600 text-white text-xs h-7 px-2.5 font-bold"
              >
                Approve
              </GlassButton>
              <GlassButton
                size="sm"
                variant="destructive"
                onClick={handleBulkReject}
                className="text-xs h-7 px-2.5 font-bold"
              >
                Reject
              </GlassButton>
            </div>
          )}

          <GlassButton
            onClick={approveAllPending}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs shadow-sm hover:from-red-700 hover:to-red-800"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Approve All Pending (Demo)
          </GlassButton>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <GlassCard className="p-4 border-l-4 border-l-[#E31E24]">
          <p className="text-xs text-gray-500 font-medium">Pending Review</p>
          <p className="text-2xl font-black text-[#111111] mt-1">{allPendingCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Average SLA: &lt; 4 hours</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-purple-500">
          <p className="text-xs text-gray-500 font-medium">New Products</p>
          <p className="text-2xl font-black text-[#111111] mt-1">{newProductsCount}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Brand new catalog SKUs</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-gray-500 font-medium">Live Revisions</p>
          <p className="text-2xl font-black text-[#111111] mt-1">{revisionsCount}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Old version remains live</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-gray-500 font-medium">Auto-Checks</p>
          <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Fitment & HSN Active
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Instant validation guardrails</p>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filterType === "ALL"
              ? "bg-[#E31E24] text-white"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          All Items ({allPendingCount})
        </button>
        <button
          onClick={() => setFilterType("NEW")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filterType === "NEW"
              ? "bg-[#E31E24] text-white"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          New Listings ({newProductsCount})
        </button>
        <button
          onClick={() => setFilterType("REVISION")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filterType === "REVISION"
              ? "bg-[#E31E24] text-white"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
        >
          Revisions ({revisionsCount})
        </button>
      </div>

      {/* Approvals Table */}
      <DataTable
        columns={columns}
        data={pendingQueue}
        selectable={false}
        keyExtractor={(p) => p.id}
        searchKeys={["title", "sku", "sellerName", "category"]}
        searchPlaceholder="Search listings by title, SKU, vendor..."
        emptyTitle="Approvals queue is clear!"
        emptyDescription="There are no products currently waiting for admin moderation."
        onRowClick={(p) => setSelectedProduct(p)}
      />

      {/* PRODUCT REVIEW DETAIL DRAWER */}
      {selectedProduct && (
        <GlassDrawer
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          title={`Review Listing: ${selectedProduct.title}`}
          subtitle={`SKU: ${selectedProduct.sku} · Submitted by ${selectedProduct.sellerName}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span>Shortcuts:</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border">A</kbd> Approve
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border">R</kbd> Reject
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border">Esc</kbd> Close
              </div>
              <div className="flex items-center gap-2">
                <GlassButton
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="font-bold text-xs"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setChangeField("images");
                    setChangeComment("");
                    setIsChangesModalOpen(true);
                  }}
                  className="font-bold text-xs"
                >
                  Request Changes
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditTitle(selectedProduct.title);
                    setEditCategory(selectedProduct.category);
                    setEditPrice(selectedProduct.price);
                    setEditDiscountPrice(selectedProduct.discountPrice || selectedProduct.price);
                    setIsEditModalOpen(true);
                  }}
                  className="font-bold text-xs"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Approve with Edits
                </GlassButton>
                <GlassButton
                  size="sm"
                  onClick={() => handleApprove(selectedProduct)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve Listing
                </GlassButton>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Revision Banner if applicable */}
            {selectedProduct.pendingRevision && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">
                      Pending Revision for Live Product
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      The original version of this product remains live to customers with existing specs.
                      Approving this replaces the live catalog version with the updated details below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Price Sanity & Duplicate Warnings */}
            <div className="space-y-2">
              {duplicateWarning && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2.5 text-xs text-red-800 font-medium">
                  <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {priceSanity && priceSanity.status !== "normal" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-800 font-medium">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{priceSanity.note}</span>
                </div>
              )}

              {fitmentWarnings.map((w, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-orange-50 border border-orange-200 p-3 flex items-center gap-2.5 text-xs text-orange-800 font-medium"
                >
                  <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>

            {/* Image Gallery */}
            <div>
              <h4 className="font-bold text-sm text-[#111111] mb-2 flex items-center justify-between">
                <span>Product Images ({selectedProduct.vendorProductRecord?.images?.length || 1})</span>
                <span className="text-xs font-normal text-gray-500">Click any image to view full-resolution</span>
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {(selectedProduct.vendorProductRecord?.images || [selectedProduct.imageUrl]).map(
                  (img, index) => (
                    <div
                      key={index}
                      onClick={() => setZoomedImage(img)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:border-[#E31E24] transition"
                    >
                      <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Specs & Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Core Listing Info
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Title:</span>
                    <span className="font-bold text-gray-900 text-right">{selectedProduct.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-bold text-gray-900">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Part Type:</span>
                    <span className="font-bold text-gray-900">
                      {selectedProduct.vendorProductRecord?.partType || "Genuine"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">SKU / Barcode:</span>
                    <span className="font-mono font-bold text-gray-900">{selectedProduct.sku}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Warranty:</span>
                    <span className="font-bold text-gray-900">
                      {selectedProduct.warrantyMonths} Months Replacement
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Stock Units:</span>
                    <span className="font-bold text-gray-900">{selectedProduct.stock} units</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Tax, Pricing & Compliance
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">MRP:</span>
                    <span className="font-bold text-gray-900">₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Selling Price:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ₹{(selectedProduct.discountPrice || selectedProduct.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">HSN Code:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {selectedProduct.vendorProductRecord?.hsnCode || "85076000"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">GST Slab:</span>
                    <span className="font-bold text-gray-900">
                      {selectedProduct.vendorProductRecord?.gstRate || 18}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Li-ion Hazardous:</span>
                    <span className="font-bold text-gray-900">
                      {selectedProduct.category === "Batteries" ? "Yes (UN38.3 Certified)" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Technical Parameters
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded-xl text-xs">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{key}</span>
                      <span className="font-bold text-gray-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fitment Compatibility */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
                <span>Compatible EV Bike Models</span>
                <span className="text-xs font-semibold text-[#E31E24]">
                  {selectedProduct.compatibleBikes?.length || 0} models mapped
                </span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {(selectedProduct.compatibleBikes || []).map((bikeId) => {
                  const b = CATALOG_BIKES.find((bk) => bk.id === bikeId);
                  return (
                    <span
                      key={bikeId}
                      className="px-2.5 py-1 bg-red-50 text-[#E31E24] border border-red-200 rounded-lg text-xs font-bold"
                    >
                      {b?.name || bikeId} {b?.voltage ? `(${b.voltage}V)` : ""}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Admin Verification Checklist */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#E31E24]" />
                Admin Moderation Checklist
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.images}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, images: e.target.checked }))}
                    className="accent-[#E31E24] h-4 w-4 rounded"
                  />
                  <span>Images are authentic and unwatermarked</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.category}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, category: e.target.checked }))}
                    className="accent-[#E31E24] h-4 w-4 rounded"
                  />
                  <span>Category & sub-type accurately matched</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.fitment}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, fitment: e.target.checked }))}
                    className="accent-[#E31E24] h-4 w-4 rounded"
                  />
                  <span>Fitment & voltage compatibility verified</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.tax}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, tax: e.target.checked }))}
                    className="accent-[#E31E24] h-4 w-4 rounded"
                  />
                  <span>HSN code & GST slab compliant</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={checklist.genuine}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, genuine: e.target.checked }))}
                    className="accent-[#E31E24] h-4 w-4 rounded"
                  />
                  <span>No prohibited or counterfeit parts detected</span>
                </label>
              </div>
            </div>
          </div>
        </GlassDrawer>
      )}

      {/* APPROVE WITH EDITS MODAL */}
      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Approve with Revisions"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Fix minor taxonomy or naming issues directly so the vendor does not need to re-submit.
          </p>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Product Title</label>
            <GlassInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
            >
              <option value="Batteries">Batteries</option>
              <option value="Motors & Controllers">Motors & Controllers</option>
              <option value="Chargers & Cables">Chargers & Cables</option>
              <option value="Brakes & Suspension">Brakes & Suspension</option>
              <option value="Tires & Wheels">Tires & Wheels</option>
              <option value="Accessories">Accessories</option>
              <option value="Riding Gear">Riding Gear</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">MRP (₹)</label>
              <GlassInput
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Selling Price (₹)</label>
              <GlassInput
                type="number"
                value={editDiscountPrice}
                onChange={(e) => setEditDiscountPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton onClick={handleApproveWithEdits} className="bg-emerald-600 text-white font-bold text-xs">
              Save & Approve Live
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* REQUEST CHANGES MODAL */}
      <GlassModal
        isOpen={isChangesModalOpen}
        onClose={() => setIsChangesModalOpen(false)}
        title="Request Changes from Vendor"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Specify the section that needs attention. The vendor will receive an in-app notice to update and resubmit.
          </p>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Field / Area</label>
            <select
              value={changeField}
              onChange={(e) => setChangeField(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
            >
              <option value="images">Product Images (Quality / Missing main image)</option>
              <option value="title_description">Title & Description</option>
              <option value="specs">Technical Specs / Battery Voltage</option>
              <option value="fitment">Bike Fitment Mapping</option>
              <option value="tax_pricing">HSN Code or GST Slab</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Admin Feedback Note</label>
            <textarea
              rows={3}
              value={changeComment}
              onChange={(e) => setChangeComment(e.target.value)}
              placeholder="e.g. Please upload higher-resolution non-blurry images of the terminal connectors..."
              className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setIsChangesModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton onClick={handleRequestChanges} className="bg-amber-600 text-white font-bold text-xs">
              Send Revision Request
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* REJECT MODAL */}
      <GlassModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Listing"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Rejection delists this product permanently from the queue. State the regulatory or marketplace reason.
          </p>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Rejection Reason</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
            >
              <option value="Prohibited or counterfeit automotive item">
                Prohibited or counterfeit automotive item
              </option>
              <option value="Uncertified Li-ion cells / Missing UN38.3 test summary">
                Uncertified Li-ion cells / Missing UN38.3 test summary
              </option>
              <option value="Incorrect brand claim or unauthorized resale">
                Incorrect brand claim or unauthorized resale
              </option>
              <option value="Severe price gouging or misleading listing">
                Severe price gouging or misleading listing
              </option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton variant="destructive" onClick={handleReject} className="font-bold text-xs">
              Confirm Rejection
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* FULL IMAGE ZOOM MODAL */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Zoomed Product"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain bg-white"
            />
            <p className="text-center text-white/80 text-xs mt-2">Click anywhere or press Esc to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
