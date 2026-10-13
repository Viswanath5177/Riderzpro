import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Archive,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Trash2,
  Tag,
  IndianRupee,
  Package,
  Layers,
  Sparkles,
  Lock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor, VendorProduct } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import { AddProductModal } from "./AddProductModal";

interface ProductsSectionProps {
  vendor: Vendor;
}

export function ProductsSection({ vendor }: ProductsSectionProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useVendorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);

  // KYC Approval Gate
  const isKycApproved = vendor.status === "approved";

  // Filter vendor's own products
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  const filteredProducts = vendorProducts.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    return true;
  });

  const handleOpenAdd = () => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Your seller KYC must be approved by admin before adding products."
      );
      return;
    }
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: VendorProduct) => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Your seller KYC must be approved by admin before editing products."
      );
      return;
    }
    setEditingProduct(p);
    setIsAddModalOpen(true);
  };

  const handleDuplicate = (p: VendorProduct) => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Your seller KYC must be approved by admin before duplicating products."
      );
      return;
    }
    try {
      addProduct({
        ...p,
        sku: `${p.sku}-COPY`,
        title: `${p.title} (Copy)`,
        status: "draft",
      });
      toast.success(`Duplicated "${p.title}" as draft!`);
    } catch (e: any) {
      toast.error(e.message || "Failed to duplicate product");
    }
  };

  const handleToggleArchive = (p: VendorProduct) => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Your seller KYC must be approved by admin before modifying products."
      );
      return;
    }
    const nextStatus = p.status === "archived" ? "draft" : "archived";
    updateProduct(p.id, { status: nextStatus });
    toast.info(`Product marked as ${nextStatus}`);
  };

  const handleDelete = (id: string) => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Your seller KYC must be approved by admin before deleting products."
      );
      return;
    }
    deleteProduct(id);
    toast.error("Product removed from store");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* KYC Lock Warning Banner if not approved */}
      {!isKycApproved && (
        <div className="rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-sm font-bold text-amber-900">
                  Catalogue Locked — KYC Verification Pending
                </h3>
                <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900">
                  Status: {vendor.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                In compliance with marketplace regulations, adding, editing, duplicating, or
                deleting catalog products unlocks only after your KYC verification has been
                completed and approved by the RiderzPro admin team.
              </p>
              <div className="mt-3">
                <Link
                  to="/vendor/pending"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition"
                >
                  <span>View Verification Status & SLA</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">Product Catalogue</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your EV parts, pricing, stock levels, and review status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          disabled={!isKycApproved}
          title={
            isKycApproved
              ? "Add a new product to catalogue"
              : "KYC verification must be completed by admin before adding products"
          }
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0 ${
            isKycApproved
              ? "bg-[#E31E24] text-white hover:bg-red-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
          }`}
        >
          {isKycApproved ? <Plus className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
          {[
            { id: "ALL", label: "All Items" },
            { id: "live", label: "Live in Shop" },
            { id: "pending_review", label: "Pending Review" },
            { id: "changes_requested", label: "Needs Changes" },
            { id: "draft", label: "Drafts" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E31E24]"
          />
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        <>
          {/* MOBILE CARDS VIEW (Under 768px - Touch Friendly, No Horizontal Table Scroll) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((p) => {
              const mainImage =
                p.images?.[0] ||
                "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80";

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3"
                >
                  {/* Top: Image + Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={mainImage}
                      alt={p.title}
                      className="h-16 w-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">
                          {p.title}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600">
                          {p.sku}
                        </span>
                        <span className="text-[10px] text-gray-400">·</span>
                        <span className="text-[10px] text-gray-500 font-semibold">{p.category}</span>
                      </div>

                      <div className="mt-1.5">
                        {p.status === "live" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Live
                          </span>
                        )}
                        {p.status === "pending_review" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" /> Under Review
                          </span>
                        )}
                        {p.status === "changes_requested" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                            <AlertCircle className="h-3 w-3" /> Changes Needed
                          </span>
                        )}
                        {p.status === "draft" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                            Draft
                          </span>
                        )}
                        {p.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mid: Price and Stock metrics */}
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 border border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Selling Price</span>
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="font-bold text-gray-900">{inr(p.sellingPrice)}</span>
                        {p.mrp > p.sellingPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {inr(p.mrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block font-medium">Stock</span>
                      <span
                        className={`font-bold ${
                          p.stock <= (p.minStockAlert || 5)
                            ? "text-rose-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      disabled={!isKycApproved}
                      title={isKycApproved ? "Edit Product" : "KYC approval required"}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        isKycApproved
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {isKycApproved ? <Edit2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(p)}
                      disabled={!isKycApproved}
                      title={isKycApproved ? "Duplicate SKU" : "KYC approval required"}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        isKycApproved
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={() => handleToggleArchive(p)}
                      disabled={!isKycApproved}
                      title={isKycApproved ? "Archive" : "KYC approval required"}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        isKycApproved
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Archive className="h-3 w-3" />
                      <span>{p.status === "archived" ? "Unarchive" : "Archive"}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={!isKycApproved}
                      title={isKycApproved ? "Delete Product" : "KYC approval required"}
                      className={`p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
                        !isKycApproved ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (768px and wider) */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
                    <th className="py-3 px-4">Product & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Units</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const mainImage =
                      p.images?.[0] ||
                      "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80";

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition">
                        {/* Product & SKU */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={mainImage}
                              alt={p.title}
                              className="h-11 w-11 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-gray-900 truncate">{p.title}</p>
                              <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                                SKU: {p.sku} · {p.brand}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-700">{p.category}</span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-gray-900">{inr(p.sellingPrice)}</span>
                          {p.mrp > p.sellingPrice && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              MRP {inr(p.mrp)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold ${
                              p.stock <= (p.minStockAlert || 5)
                                ? "text-rose-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>

                        {/* Approval Status */}
                        <td className="py-3.5 px-4">
                          {p.status === "live" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> Live
                            </span>
                          )}
                          {p.status === "pending_review" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                              <Clock className="h-3 w-3" /> Under Review
                            </span>
                          )}
                          {p.status === "changes_requested" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 border border-orange-200">
                              <AlertCircle className="h-3 w-3" /> Changes Needed
                            </span>
                          )}
                          {p.status === "draft" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
                              Draft
                            </span>
                          )}
                          {p.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                              <XCircle className="h-3 w-3" /> Rejected
                            </span>
                          )}
                          {p.pendingRevision && (
                            <span className="block text-[10px] text-amber-600 font-semibold mt-0.5">
                              Revision pending
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              disabled={!isKycApproved}
                              title={isKycApproved ? "Edit Listing" : "KYC approval required"}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isKycApproved
                                  ? "text-gray-500 hover:text-black hover:bg-gray-100"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              {isKycApproved ? (
                                <Edit2 className="h-3.5 w-3.5" />
                              ) : (
                                <Lock className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDuplicate(p)}
                              disabled={!isKycApproved}
                              title={isKycApproved ? "Duplicate SKU" : "KYC approval required"}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isKycApproved
                                  ? "text-gray-500 hover:text-black hover:bg-gray-100"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleArchive(p)}
                              disabled={!isKycApproved}
                              title={isKycApproved ? "Archive" : "KYC approval required"}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isKycApproved
                                  ? "text-gray-500 hover:text-black hover:bg-gray-100"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={!isKycApproved}
                              title={isKycApproved ? "Delete" : "KYC approval required"}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isKycApproved
                                  ? "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                  : "text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No products match your filter</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Try adjusting your search query or add a new product to your catalog.
          </p>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          vendor={vendor}
          productToEdit={editingProduct}
        />
      )}
    </div>
  );
}
