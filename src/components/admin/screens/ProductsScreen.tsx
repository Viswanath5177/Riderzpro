import React, { useState } from "react";
import {
  Box,
  Plus,
  Star,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Tag,
  IndianRupee,
  Upload,
} from "lucide-react";
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
  const { products, bikes, sellers, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteModalProduct, setDeleteModalProduct] = useState<AdminProduct | null>(null);

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

  const filterTabs = [
    { label: "All Catalog", value: "ALL", count: products.length },
    { label: "Active", value: "Active", count: products.filter((p) => p.status === "Active").length },
    { label: "Low Stock", value: "Low Stock", count: products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length },
    { label: "Pending Review", value: "Pending Review", count: products.filter((p) => p.status === "Pending Review").length },
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
            <p className="text-[10px] text-[#6B7280] line-through font-medium">₹{p.price.toLocaleString("en-IN")}</p>
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
          <span className={`font-bold tabular-nums text-xs ${p.stock <= p.minStockThreshold ? "text-red-700" : "text-emerald-700"}`}>
            {p.stock} units
          </span>
          {p.stock <= p.minStockThreshold && (
            <p className="text-[10px] font-bold text-red-700 uppercase">Alert: Below {p.minStockThreshold}</p>
          )}
        </div>
      ),
    },
    {
      key: "compatibleBikes",
      header: "Fitment",
      render: (p) => (
        <span className="rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold text-[#374151]">
          {p.compatibleBikes.length} Bikes Compatible
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
        specs: { "Standard": "Certified OEM Replacement", "Fitment Guarantee": "100% VIN Matched" },
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
            Manage EV spare parts, batteries, chargers, threshold stock alerts and multi-brand compatibility.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          onClick={() => {
            setTitle("");
            setSku(`RZP-${Math.floor(1000 + Math.random() * 9000)}`);
            setPrice(3500);
            setDiscountPrice(2999);
            setStock(25);
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Part / Product</span>
        </GlassButton>
      </div>

      {/* Main Table */}
      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search product by title, SKU, category or seller..."
        searchKey={(p) => `${p.title} ${p.sku} ${p.category} ${p.sellerName}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(p, filter) => (filter === "Low Stock" ? p.status === "Low Stock" || p.status === "Out of Stock" : p.status === filter)}
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
        maxWidth="xl"
        title={editingProduct ? "Edit Product Details" : "Add New EV Component to Catalog"}
        description="Configure pricing, inventory stock, warranty, and compatible two-wheeler models."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-[#111111]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Product Title
              </label>
              <GlassInput
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack"
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                SKU Code
              </label>
              <GlassInput
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="BAT-VR-60V30AH"
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Category
              </label>
              <GlassSelect
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                options={[
                  { value: "Batteries", label: "Batteries & BMS" },
                  { value: "Chargers", label: "Chargers & Docks" },
                  { value: "Brakes & Suspension", label: "Brakes & Suspension" },
                  { value: "Motors & Controllers", label: "Motors & Controllers" },
                  { value: "Body & Accessories", label: "Body & Accessories" },
                  { value: "Riding Gear", label: "Riding Gear & Helmets" },
                ]}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                MRP Price (₹)
              </label>
              <GlassInput
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Discounted Offer Price (₹)
              </label>
              <GlassInput
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Available Stock Units
              </label>
              <GlassInput
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Low Stock Threshold
              </label>
              <GlassInput
                type="number"
                required
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                Image URL
              </label>
              <GlassInput
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Compatible Bikes Checklist */}
            <div className="sm:col-span-2 rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]">
              <label className="block text-[#111111] font-bold mb-2 uppercase text-[10px]">
                Compatible Bike Models (VIN Fitment Mapping)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bikes.map((b) => {
                  const isChecked = selectedBikes.includes(b.id);
                  return (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer text-xs text-[#374151] font-semibold">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBikes([...selectedBikes, b.id]);
                          else setSelectedBikes(selectedBikes.filter((id) => id !== b.id));
                        }}
                        className="rounded border-gray-300 text-[#E31E24] accent-[#E31E24] focus:ring-0 cursor-pointer"
                      />
                      <span>{b.model}</span>
                    </label>
                  );
                })}
              </div>
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
