import React, { useState, useEffect } from "react";
import {
  Box,
  Plus,
  Star,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Tag,
  IndianRupee,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassSelect } from "../glass/GlassSelect";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassModal } from "../glass/GlassModal";
import { ConfirmDialog } from "../glass/ConfirmDialog";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminProduct } from "@/mocks/admin/types";

export function ProductsScreen() {
  const { products: mockProducts, bikes, sellers, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [productsList, setProductsList] = useState<AdminProduct[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteModalProduct, setDeleteModalProduct] = useState<AdminProduct | null>(null);
  const [rejectModalProduct, setRejectModalProduct] = useState<AdminProduct | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add/Edit Form State
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<AdminProduct["category"]>("Batteries");
  const [sellerId, setSellerId] = useState(sellers[0]?.id || "seller_01");
  const [price, setPrice] = useState(2500);
  const [discountPrice, setDiscountPrice] = useState(1999);
  const [stock, setStock] = useState(20);
  const [minStockThreshold, setMinStockThreshold] = useState(5);
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  const [selectedBikes, setSelectedBikes] = useState<string[]>([bikes[0]?.id || "bike_ather_450x"]);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80");

  // Fetch real products from PostgreSQL backend
  const loadProducts = () => {
    setIsLoading(true);
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped: AdminProduct[] = res.data.map((row: any) => {
            let firstImg = "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80";
            if (row.image_url) {
              try {
                const arr = JSON.parse(row.image_url);
                if (Array.isArray(arr) && arr[0]) firstImg = arr[0];
                else if (typeof arr === "string") firstImg = arr;
              } catch {
                firstImg = row.image_url;
              }
            }

            let compBikes: string[] = [];
            if (row.compatible_vehicles) {
              try {
                compBikes = Array.isArray(row.compatible_vehicles)
                  ? row.compatible_vehicles
                  : JSON.parse(row.compatible_vehicles);
              } catch {
                compBikes = [row.compatible_vehicles];
              }
            }

            const isPending = row.verification_status === "pending_approval";
            const isRejected = row.verification_status === "rejected";
            const rowStock = Number(row.stock) || 0;
            const status: AdminProduct["status"] = isPending
              ? "Pending Review"
              : isRejected
              ? ("Pending Review" as any)
              : rowStock <= 0
              ? "Out of Stock"
              : rowStock <= 5
              ? "Low Stock"
              : "Active";

            return {
              id: row.id,
              title: row.name,
              sku: row.sku || `RZP-${row.id.slice(0, 6).toUpperCase()}`,
              category: (row.category_name || "Accessories") as any,
              sellerId: row.seller_id || "seller_01",
              sellerName: row.seller_name || row.store_name || "Riderzpro Vendor",
              price: Number(row.mrp) || Number(row.price),
              discountPrice: Number(row.price),
              stock: rowStock,
              minStockThreshold: 5,
              warrantyMonths: 12,
              compatibleBikes: compBikes,
              imageUrl: firstImg,
              status,
              specs: {
                "Fitment Type": row.fitment_type || "Universal",
                "Verification": row.verification_status || "approved",
              },
            };
          });
          setProductsList(mapped);
        } else {
          setProductsList([]);
        }
      })
      .catch((err) => {
        console.warn("[Admin Products API Notice]:", err.message);
        setProductsList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleReviewProduct = async (
    productId: string,
    action: "APPROVED" | "REJECTED",
    reason?: string
  ) => {
    const toastId = toast.loading(`Reviewing product (${action.toLowerCase()})...`);
    try {
      const res = await fetch(`/api/admin/products/${productId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update product status");
      }

      toast.success(
        action === "APPROVED"
          ? "Product Approved & Published to Customer Storefront! Vendor notified via email."
          : "Product Rejected. Compliance feedback email sent to vendor.",
        { id: toastId }
      );
      loadProducts();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const currentDisplayProducts = productsList;

  const filterTabs = [
    { label: "All Catalog", value: "ALL", count: currentDisplayProducts.length },
    {
      label: "Active",
      value: "Active",
      count: currentDisplayProducts.filter((p) => p.status === "Active").length,
    },
    {
      label: "Low Stock",
      value: "Low Stock",
      count: currentDisplayProducts.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length,
    },
    {
      label: "Pending Review",
      value: "Pending Review",
      count: currentDisplayProducts.filter((p) => p.status === "Pending Review").length,
    },
  ];

  const columns: Column<AdminProduct>[] = [
    {
      key: "title",
      header: "Product & SKU",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-10 w-10 rounded-xl object-cover border border-[#E5E7EB] shrink-0 bg-gray-100"
          />
          <div className="min-w-0 max-w-sm">
            <p className="font-bold text-[#111111] truncate text-sm">{p.title}</p>
            <p className="text-xs text-[#4B5563] font-mono mt-0.5">
              SKU: {p.sku} · Seller: {p.sellerName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (p) => <span className="font-bold text-[#111111] text-xs">{p.category}</span>,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-bold text-[#111111] tabular-nums text-xs">
            ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
          </span>
          {p.discountPrice && (
            <p className="text-[10px] text-[#6B7280] line-through font-medium">
              ₹{p.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock Units",
      sortable: true,
      render: (p) => (
        <div>
          <span
            className={`font-bold tabular-nums text-xs ${
              p.stock <= p.minStockThreshold ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {p.stock} units
          </span>
          {p.stock <= p.minStockThreshold && (
            <p className="text-[10px] font-bold text-red-700 uppercase">
              Alert: Below {p.minStockThreshold}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "compatibleBikes",
      header: "Fitment",
      render: (p) => (
        <span className="rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold text-[#374151]">
          {p.compatibleBikes.length} Fitments Mapped
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {p.status === "Pending Review" && (
            <>
              <button
                onClick={() => handleReviewProduct(p.id, "APPROVED")}
                className="rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 p-1.5 transition cursor-pointer"
                title="Approve & Publish to Storefront"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRejectModalProduct(p)}
                className="rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition cursor-pointer"
                title="Reject Product"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => {
              setEditingProduct(p);
              setTitle(p.title);
              setSku(p.sku);
              setCategory(p.category);
              setPrice(p.price);
              setDiscountPrice(p.discountPrice || p.price);
              setStock(p.stock);
              setMinStockThreshold(p.minStockThreshold);
              setWarrantyMonths(p.warrantyMonths);
              setSelectedBikes(p.compatibleBikes);
              setImageUrl(p.imageUrl);
            }}
            className="rounded-lg bg-gray-100 text-[#374151] hover:bg-gray-200 p-1.5 transition cursor-pointer"
            title="Edit Product"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteModalProduct(p)}
            className="rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const seller = sellers.find((s) => s.id === sellerId) || sellers[0];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        sku,
        category,
        price,
        discountPrice,
        stock,
        minStockThreshold,
        warrantyMonths,
        compatibleBikes: selectedBikes,
        imageUrl,
        status: stock <= 0 ? "Out of Stock" : stock <= minStockThreshold ? "Low Stock" : "Active",
      });
      setEditingProduct(null);
    } else {
      addProduct({
        title,
        sku,
        category,
        sellerId: seller.id,
        sellerName: seller.businessName,
        price,
        discountPrice,
        stock,
        minStockThreshold,
        warrantyMonths,
        compatibleBikes: selectedBikes,
        imageUrl,
        status: "Active",
        specs: { Standard: "Certified OEM Replacement", "Fitment Guarantee": "100% VIN Matched" },
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Catalog Inventory & Fitment Mapping
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Manage EV spare parts, review vendor catalog submissions, threshold stock alerts and multi-brand compatibility.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={currentDisplayProducts}
        columns={columns}
        searchPlaceholder="Search catalog title, SKU number or seller name..."
        searchKey={(p) => `${p.title} ${p.sku} ${p.sellerName} ${p.category}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(p, filter) => p.status === filter}
        keyExtractor={(p) => p.id}
        exportFileName="riderzpro_products"
      />

      {/* Add / Edit Product Modal */}
      <GlassModal
        isOpen={isAddModalOpen || Boolean(editingProduct)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Catalog Item" : "Add New EV Part SKU"}
        description={
          editingProduct
            ? `Update pricing, stock or bike fitment compatibility for ${editingProduct.sku}`
            : "Register a certified EV component with pricing and fitment mapping."
        }
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Product Title
            </label>
            <GlassInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 72V 40Ah Smart NMC Lithium Battery Pack"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                SKU Identifier
              </label>
              <GlassInput
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="RZP-BAT-7240"
                required
              />
            </div>
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                Catalog Category
              </label>
              <GlassSelect
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                options={[
                  { label: "Batteries", value: "Batteries" },
                  { label: "Chargers", value: "Chargers" },
                  { label: "Controllers", value: "Controllers" },
                  { label: "Motors", value: "Motors" },
                  { label: "Brakes", value: "Brakes" },
                  { label: "Accessories", value: "Accessories" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                MRP Price (₹)
              </label>
              <GlassInput
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                Discounted / Offer Price (₹)
              </label>
              <GlassInput
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                Inventory Units
              </label>
              <GlassInput
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                Min Alert Threshold
              </label>
              <GlassInput
                type="number"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
                Warranty (Months)
              </label>
              <GlassInput
                type="number"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Compatible EV Bikes & Scooters
            </label>
            <div className="max-h-28 overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-2.5 space-y-1.5">
              {bikes.map((bike) => {
                const checked = selectedBikes.includes(bike.id);
                return (
                  <label
                    key={bike.id}
                    className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedBikes([...selectedBikes, bike.id]);
                        else setSelectedBikes(selectedBikes.filter((id) => id !== bike.id));
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold text-xs text-[#111111]">
                      {bike.brand} {bike.model} ({bike.yearRange})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Save Product
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Reject Product Modal with Reason Input */}
      <GlassModal
        isOpen={Boolean(rejectModalProduct)}
        onClose={() => {
          setRejectModalProduct(null);
          setRejectReason("");
        }}
        title="Reject Catalog Part Submission"
        description="Provide a compliance or specification reason to send back to the vendor."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#374151] font-bold mb-1.5 uppercase text-[10px]">
              Specification Rejection Reason
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Dimensions or voltage compatibility conflict with listed models."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setRejectModalProduct(null);
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
                if (rejectModalProduct) {
                  handleReviewProduct(rejectModalProduct.id, "REJECTED", rejectReason.trim());
                  setRejectModalProduct(null);
                  setRejectReason("");
                }
              }}
            >
              Confirm Rejection & Send Email
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteModalProduct)}
        onClose={() => setDeleteModalProduct(null)}
        onConfirm={() => {
          if (deleteModalProduct) {
            deleteProduct(deleteModalProduct.id);
            setDeleteModalProduct(null);
          }
        }}
        title="Remove Product?"
        description={`Are you sure you want to delete ${deleteModalProduct?.title}? It will no longer appear on the customer storefront.`}
        confirmLabel="Delete from Catalog"
      />
    </div>
  );
}
