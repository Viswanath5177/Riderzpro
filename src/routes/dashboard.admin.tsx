import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Box,
  Layers,
  Archive,
  Users,
  CreditCard,
  RotateCcw,
  Tag,
  BarChart3,
  Bell,
  Settings2,
  FileText,
  Sliders,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  MapPin,
  ChevronRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  Calendar,
  Eye,
  Menu,
  X,
  Phone,
  Mail,
  Zap,
  ArrowUpDown,
  Check,
  Ban,
  IndianRupee,
  Lock,
  Trash2,
  Store,
  MessageSquare,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import {
  getProduct,
  getVendor,
  inr,
  products,
  vendors,
  mapDbProductToProduct,
  type Product,
  type Vendor,
  type VendorApplication,
  type VendorSettlement,
  type ProductReview,
  type VendorReview,
  getVendorApplications,
  updateVendorApplicationStatus,
  getVendorSettlements,
  getAllProductReviews,
  getAllVendorReviews,
} from "@/lib/data";
import { ORDER_STEPS, useStore, type Order } from "@/lib/store";
import type { NormalizedShipment, LogisticsProvider, ShipmentStatus } from "@/lib/logistics/types";
import { cn } from "@/lib/utils";
import { ProductFormPage } from "@/components/vendor/ProductFormPage";
import { getCurrentRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/admin")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login" });
    if (role !== "admin") throw redirect({ to: "/dashboard/customer" });
  },
  head: () => ({
    meta: [
      { title: "Operations & Admin Console — RiderzPro" },
      { name: "description", content: "Executive administrative interface for order fulfillment, courier tracking, inventory, and refunds." },
      { property: "og:title", content: "Operations & Admin Console — RiderzPro" },
      { property: "og:description", content: "Manage RiderzPro marketplace, courier shipments, orders and inventory." },
    ],
  }),
  component: AdminDashboard,
});

type AdminTab =
  | "overview"
  | "orders"
  | "shipments"
  | "products"
  | "categories"
  | "customers"
  | "vendors"
  | "vendor_applications"
  | "vendor_offers"
  | "commissions"
  | "reviews_moderation"
  | "payments"
  | "returns"
  | "offers"
  | "reports"
  | "notifications"
  | "integrations"
  | "audit"
  | "settings";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export function AdminDashboard() {
  const {
    orders,
    shipments,
    createShipment,
    updateShipmentStatus,
    processWebhook,
    inventoryStock,
    updateInventoryStock,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "ytd">("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<NormalizedShipment | null>(null);

  // Dynamic Products State linked to PostgreSQL schema (No mock defaults)
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [productViewMode, setProductViewMode] = useState<"list" | "form">("list");
  const [editingAdminProduct, setEditingAdminProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState<"all" | "approved" | "pending_approval">("all");
  const [productPage, setProductPage] = useState(1);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // Multi-vendor marketplace management state
  const [marketplaceVendors, setMarketplaceVendors] = useState<Vendor[]>(vendors);
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => getVendorApplications());
  const [adminSettlements, setAdminSettlements] = useState<VendorSettlement[]>(() => getVendorSettlements());
  const [defaultPlatformCommission, setDefaultPlatformCommission] = useState<number>(10);
  const [adminProductReviews, setAdminProductReviews] = useState<ProductReview[]>(() => getAllProductReviews());
  const [adminVendorReviews, setAdminVendorReviews] = useState<VendorReview[]>(() => getAllVendorReviews());
  const [reviewTabMode, setReviewTabMode] = useState<"product" | "vendor">("product");
  const [vendorSearch, setVendorSearch] = useState<string>("");

  const pendingApplicationsCount = vendorApplications.filter((a) => a.status === "pending").length;

  const handleToggleVendorStatus = (vendorId: string) => {
    setMarketplaceVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const isSuspended = v.verificationBadge === "Suspended";
          const newBadge = isSuspended ? "RiderzPro Verified Partner" : "Suspended";
          toast.success(`Vendor ${v.name} ${isSuspended ? "reactivated" : "suspended"}`);
          return { ...v, verificationBadge: newBadge };
        }
        return v;
      })
    );
  };

  const handleUpdateVendorCommission = (vendorId: string, rate: number) => {
    setMarketplaceVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, commissionRate: rate / 100 } : v))
    );
    toast.success(`Commission rate updated to ${rate}%`);
  };

  const handleApproveVendorApplication = (id: string) => {
    updateVendorApplicationStatus(id, "approved");
    setVendorApplications([...getVendorApplications()]);
    toast.success("Vendor application approved! Onboarding credentials sent.");
  };

  const handleRejectVendorApplication = (id: string) => {
    updateVendorApplicationStatus(id, "rejected");
    setVendorApplications([...getVendorApplications()]);
    toast.info("Vendor application rejected.");
  };

  const handleMarkSettlementPaid = (settlementId: string) => {
    const utr = prompt("Enter Bank Settlement Reference / UTR Number:", `NEFT-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`);
    if (!utr) return;
    setAdminSettlements((prev) =>
      prev.map((s) => (s.id === settlementId ? { ...s, status: "Paid", payoutDate: "Today", referenceNumber: utr } : s))
    );
    toast.success(`Settlement ${settlementId} marked as Paid (UTR: ${utr})`);
  };

  const handleModerateProductReview = (id: string, action: "published" | "rejected" | "deleted") => {
    if (action === "deleted") {
      setAdminProductReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted from database");
    } else {
      setAdminProductReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
      toast.success(`Review status changed to ${action}`);
    }
  };

  const handleModerateVendorReview = (id: string, action: "published" | "rejected" | "deleted") => {
    if (action === "deleted") {
      setAdminVendorReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Vendor review deleted");
    } else {
      setAdminVendorReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
      toast.success(`Vendor review status changed to ${action}`);
    }
  };

  // Sync with PostgreSQL on mount & on updates
  const fetchAdminProducts = () => {
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const dbProducts: Product[] = res.data.map((row: any) => mapDbProductToProduct(row));
          setAdminProducts(dbProducts);
        }
      })
      .catch((err) => {
        console.log("[DB fetch notice admin]:", err.message);
      });
  };

  const fetchDbCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDbCategories(res.data);
        }
      })
      .catch((err) => {
        console.log("[DB fetch categories notice]:", err.message);
      });
  };

  useEffect(() => {
    fetchAdminProducts();
    fetchDbCategories();
  }, []);

  const handleQuickApproveProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_status: "approved", is_active: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product approved and published to Customer Shop!");
        fetchAdminProducts();
      } else {
        toast.error(data.error || "Failed to approve product");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error");
    }
  };

  const handleOpenAddProduct = () => {
    setEditingAdminProduct(null);
    setProductViewMode("form");
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingAdminProduct(p);
    setProductViewMode("form");
  };

  const handleProductFormSuccess = (savedItem: Product) => {
    fetchAdminProducts();
    setProductViewMode("list");
  };

  // Product Selection & Batch Deletion
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isDeletingProducts, setIsDeletingProducts] = useState(false);

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllOnPage = (items: Product[]) => {
    setSelectedProductIds((prev) => {
      const pageIds = items.map((p) => p.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAllFiltered = (items: Product[]) => {
    setSelectedProductIds(new Set(items.map((p) => p.id)));
  };

  const handleClearSelection = () => {
    setSelectedProductIds(new Set());
  };

  const handleDeleteSingleProduct = async (product: Product) => {
    const confirmMsg = `Are you sure you want to permanently delete "${product.name}" (ID: ${product.id})?\n\nThis will remove it from the catalog and PostgreSQL database.`;
    if (!window.confirm(confirmMsg)) return;

    setIsDeletingProducts(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted "${product.name}" successfully`);
        setSelectedProductIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
        fetchAdminProducts();
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error deleting product");
    } finally {
      setIsDeletingProducts(false);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    const count = selectedProductIds.size;
    if (count === 0) return;

    const confirmMsg = `Are you sure you want to permanently delete ${count} selected product(s) from the database? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    setIsDeletingProducts(true);
    try {
      const ids = Array.from(selectedProductIds);
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully deleted ${data.deletedCount ?? count} product(s)`);
        setSelectedProductIds(new Set());
        fetchAdminProducts();
      } else {
        toast.error(data.error || "Failed to delete selected products");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error deleting selected products");
    } finally {
      setIsDeletingProducts(false);
    }
  };

  const handleDeleteAllFiltered = async (items: Product[]) => {
    const count = items.length;
    if (count === 0) return;

    const confirmMsg = `WARNING: Are you sure you want to delete ALL ${count} product(s) currently displayed? This will permanently erase them from PostgreSQL.`;
    if (!window.confirm(confirmMsg)) return;

    setIsDeletingProducts(true);
    try {
      const ids = items.map((p) => p.id);
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted ${data.deletedCount ?? count} products`);
        setSelectedProductIds(new Set());
        fetchAdminProducts();
      } else {
        toast.error(data.error || "Failed to delete all products");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error deleting products");
    } finally {
      setIsDeletingProducts(false);
    }
  };

  // Webhook simulator test inputs
  const [testWebhookProvider, setTestWebhookProvider] = useState<LogisticsProvider>("Delhivery");
  const [testWebhookTracking, setTestWebhookTracking] = useState("");
  const [testWebhookStatus, setTestWebhookStatus] = useState("In Transit");
  const [testWebhookLocation, setTestWebhookLocation] = useState("Whitefield Transit Hub");
  const [lastTestEventId, setLastTestEventId] = useState("");
  const [webhookLogs, setWebhookLogs] = useState<{ id: string; time: string; msg: string; isDup: boolean }[]>([]);

  // Base and Per-Km delivery pricing settings
  const [baseFee, setBaseFee] = useState(40);
  const [perKmFee, setPerKmFee] = useState(12);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // KPI Calculations
  const totalOrdersCount = orders.length;
  const awaitingProcessingCount = orders.filter((o) => o.status === 0).length;
  const readyForDispatchCount = orders.filter((o) => o.status === 1).length;
  const inTransitCount = orders.filter((o) => o.status >= 2 && o.status < 5).length;
  const deliveredCount = orders.filter((o) => o.status === 5).length;
  const delayedOrFailedCount = shipments.filter((s) => s.status === "Delayed").length;
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const lowStockProducts = adminProducts.filter((p) => (p.offers[0]?.stock ?? inventoryStock[p.id] ?? 10) < 5);

  const handleRestock = (productId: string) => {
    updateInventoryStock(productId, 15);
    toast.success("Inventory restocked (+15 units) successfully");
  };

  const handleAdvanceOrderStatus = (orderId: string, currentStatus: number) => {
    if (currentStatus >= 5) {
      toast.info("Order is already fully delivered");
      return;
    }
    const nextStatus = currentStatus + 1;
    updateOrderStatus(orderId, nextStatus);
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      actor: "Admin (Vikram Malhotra)",
      action: "Status Transition",
      target: orderId,
      details: `Transitioned status to ${ORDER_STEPS[nextStatus]}`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    toast.success(`Order ${orderId} updated to: ${ORDER_STEPS[nextStatus]}`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleProcessRefund = (orderId: string) => {
    refundOrder(orderId, "Customer return request approved by admin");
    toast.success(`Refund of order ${orderId} processed via payment gateway`);
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      actor: "Admin (Vikram Malhotra)",
      action: "Refund Initiated",
      target: orderId,
      details: `Full refund authorization processed & recorded`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleCancelOrder = (orderId: string, reason = "Cancelled by admin request") => {
    cancelOrder(orderId, reason);
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      actor: "Admin (Vikram Malhotra)",
      action: "Order Cancelled",
      target: orderId,
      details: `Cancelled (${reason}). Inventory automatically returned.`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    toast.success(`Order ${orderId} cancelled. Stock units restored.`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  const handleCreateCourierShipment = (order: Order, courier: LogisticsProvider) => {
    const newShp = createShipment({
      orderId: order.id,
      provider: courier,
      pickupAddress: {
        name: "RiderzPro Central Hub",
        street: "Electronic City Phase 1",
        city: "Bengaluru",
        pincode: "560100",
        phone: "+91 80 4000 1100",
      },
      destinationAddress: order.shippingAddress || {
        name: order.customerName || "Customer",
        street: "Doorstep Location",
        city: "Bengaluru",
        pincode: "560103",
        phone: order.customerPhone || "+91 98765 43210",
      },
      weightKg: 3.5,
      itemDescription: `EV Spares & Components`,
      orderValue: order.total,
    });

    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      actor: "Admin (Vikram Malhotra)",
      action: "Courier Manifest Created",
      target: order.id,
      details: `Manifested with ${courier} (AWB: ${newShp.trackingNumber})`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    toast.success(`Shipment manifested with ${courier}! AWB: ${newShp.trackingNumber}`);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder((prev) => (prev ? { ...prev, shipmentId: newShp.shipmentId, status: 3 } : null));
    }
  };

  // Filtered orders table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        qMatches(o.id, searchQuery) ||
        o.groups.some((g) =>
          g.items.some((it) => qMatches(getProduct(it.productId)?.name || "", searchQuery))
        );
      if (!matchesSearch) return false;
      if (orderStatusFilter === "ALL") return true;
      if (orderStatusFilter === "PLACED") return o.status === 0;
      if (orderStatusFilter === "CONFIRMED") return o.status === 1;
      if (orderStatusFilter === "TRANSIT") return o.status >= 2 && o.status <= 4;
      if (orderStatusFilter === "DELIVERED") return o.status === 5;
      return true;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  function qMatches(val: string, q: string) {
    return val.toLowerCase().includes(q.toLowerCase());
  }

  const navItems = [
    { id: "overview" as AdminTab, label: "Dashboard", Icon: LayoutDashboard },
    { id: "orders" as AdminTab, label: "Orders", Icon: Package, badge: `${awaitingProcessingCount + readyForDispatchCount}` },
    { id: "shipments" as AdminTab, label: "Shipments & Tracking", Icon: Truck, badge: `${inTransitCount}` },
    { id: "products" as AdminTab, label: "Products", Icon: Box },
    { id: "categories" as AdminTab, label: "Categories", Icon: Layers },
    { id: "vendors" as AdminTab, label: "Marketplace Vendors", Icon: Store, badge: `${marketplaceVendors.length}` },
    { id: "vendor_applications" as AdminTab, label: "Vendor Applications", Icon: ShieldCheck, badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount}` : undefined },
    { id: "vendor_offers" as AdminTab, label: "Vendor Offers Moderation", Icon: Sliders },
    { id: "commissions" as AdminTab, label: "Commissions & Settlements", Icon: IndianRupee },
    { id: "reviews_moderation" as AdminTab, label: "Reviews Moderation", Icon: MessageSquare },
    { id: "customers" as AdminTab, label: "Customers", Icon: Users },
    { id: "payments" as AdminTab, label: "Payments & Refunds", Icon: CreditCard },
    { id: "returns" as AdminTab, label: "Returns & Cancellations", Icon: RotateCcw },
    { id: "offers" as AdminTab, label: "Offers & Coupons", Icon: Tag },
    { id: "reports" as AdminTab, label: "Reports & Analytics", Icon: BarChart3 },
    { id: "notifications" as AdminTab, label: "Notifications", Icon: Bell },
    { id: "integrations" as AdminTab, label: "Delivery Integration Settings", Icon: Sliders },
    { id: "audit" as AdminTab, label: "Audit Logs", Icon: FileText },
    { id: "settings" as AdminTab, label: "Settings", Icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#111111] flex flex-col font-sans">
      {/* ─────────────────────────────────────────────────────────────
          ADMIN TOP EXECUTIVE BAR
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white shadow-2xs">
        <div className="flex h-16 items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 md:hidden cursor-pointer"
              aria-label="Toggle admin navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo imgClassName="h-9 sm:h-11 md:h-12 w-auto" />
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="rounded-md bg-black px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-[#6B7280]">
                Operations, Logistics & Inventory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date filter dropdown */}
            <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] px-2 py-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-[#6B7280] mr-1.5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-transparent font-medium text-[#111111] outline-none cursor-pointer text-xs"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>

            {/* Switch to customer dashboard */}
            <Link
              to="/dashboard/customer"
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] transition"
            >
              <span>Customer Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E31E24] text-xs font-bold text-white shadow-2xs">
                VM
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#111111]">Vikram Malhotra</p>
                <p className="text-[10px] text-[#6B7280]">Operations Lead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer for Admin */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-4/5 max-w-xs bg-white p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Logo imgClassName="h-8 w-auto" />
                <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-gray-900 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Operations & Modules
            </p>
            <nav className="mt-2 space-y-0.5 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition text-left cursor-pointer",
                      isActive
                        ? "bg-red-50 text-[#E31E24] font-semibold border-l-3 border-[#E31E24]"
                        : "text-[#6B7280] hover:bg-gray-100 hover:text-[#111111]"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <item.Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#E31E24]" : "text-[#6B7280]")} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                          isActive ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-gray-200">
              <Link
                to="/dashboard/customer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#E31E24] py-1"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Customer Portal
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-w-0">
        {/* ─────────────────────────────────────────────────────────────
            ADMIN SIDEBAR (15 TABS)
           ───────────────────────────────────────────────────────────── */}
        <aside className="w-64 border-r border-[#E5E7EB] bg-white p-3 shrink-0 hidden md:block">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition text-left",
                    isActive
                      ? "bg-red-50 text-[#E31E24] font-semibold border-l-3 border-[#E31E24]"
                      : "text-[#6B7280] hover:bg-gray-100 hover:text-[#111111]"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <item.Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#E31E24]" : "text-[#6B7280]")} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                        isActive ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 px-3 text-[11px] text-[#6B7280]">
            <p className="font-semibold text-gray-800">RiderzPro Core 2.4.0</p>
            <p className="mt-0.5 text-[10px]">Connected to Bluedart & Delhivery Logistics</p>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            MAIN CONTENT AREA
           ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 max-w-7xl w-full overflow-x-hidden">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111]">
                    Operational Overview
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Live telemetry across orders, courier dispatches, and warehouse inventory.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success("Refreshed operational metrics")}
                    className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-50 shadow-2xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  THE 8 CLICKABLE ADMIN KPI METRIC CARDS
                 ───────────────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* 1. Total Orders */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setOrderStatusFilter("ALL");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Total Orders</span>
                    <Package className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#111111] font-display">{totalOrdersCount}</p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">+14% vs last period</p>
                </div>

                {/* 2. Orders Awaiting Processing */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setOrderStatusFilter("PLACED");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Awaiting Processing</span>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-600 font-display">{awaitingProcessingCount}</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">Requires vendor accept</p>
                </div>

                {/* 3. Orders Ready for Dispatch */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setOrderStatusFilter("CONFIRMED");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Ready for Dispatch</span>
                    <Box className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-blue-600 font-display">{readyForDispatchCount}</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">Packing completed</p>
                </div>

                {/* 4. Shipments in Transit */}
                <div
                  onClick={() => {
                    setActiveTab("shipments");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Shipments in Transit</span>
                    <Truck className="h-4 w-4 text-[#E31E24]" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#E31E24] font-display">{inTransitCount}</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">Couriers on route</p>
                </div>

                {/* 5. Delivered Orders */}
                <div
                  onClick={() => {
                    setActiveTab("orders");
                    setOrderStatusFilter("DELIVERED");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Delivered Orders</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-700 font-display">{deliveredCount}</p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">98.4% on-time SLA</p>
                </div>

                {/* 6. Delayed / Failed Deliveries */}
                <div
                  onClick={() => {
                    setActiveTab("shipments");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Delayed / Failed</span>
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-rose-600 font-display">{delayedOrFailedCount}</p>
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">1 weather alert</p>
                </div>

                {/* 7. Sales Over Selected Period */}
                <div
                  onClick={() => {
                    setActiveTab("payments");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Gross Sales</span>
                    <IndianRupee className="h-4 w-4 text-gray-700" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#111111] font-display">{inr(totalSales)}</p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">Settled to merchants</p>
                </div>

                {/* 8. Low-Stock Products */}
                <div
                  onClick={() => {
                    setActiveTab("products");
                  }}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="font-semibold uppercase tracking-wider">Low-Stock Items</span>
                    <Archive className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-600 font-display">{lowStockProducts.length}</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">Below 5 units threshold</p>
                </div>
              </div>

              {/* Two-column operational breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Courier Logistics Status */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#111111]">Integrated Courier Logistics Performance</h3>
                    <span className="text-xs text-[#6B7280]">Active API Adapters</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Delhivery Express", provider: "Delhivery", status: "Healthy API", latency: "142ms", color: "bg-emerald-500" },
                      { name: "Bluedart Apex", provider: "Bluedart", status: "Healthy API", latency: "198ms", color: "bg-emerald-500" },
                      { name: "Shadowfax Hyperlocal", provider: "Shadowfax", status: "Active Adapter", latency: "310ms", color: "bg-emerald-500" },
                      { name: "RiderzPro Fleet (Dedicated)", provider: "RiderzPro Fleet", status: "Real-time Telemetry", latency: "42ms", color: "bg-emerald-500" },
                    ].map((c) => {
                      const count = shipments.filter((s) => s.provider === c.provider).length;
                      return (
                        <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6F8] border border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className={cn("h-2.5 w-2.5 rounded-full", c.color)} />
                            <div>
                              <p className="text-xs font-bold text-[#111111]">{c.name}</p>
                              <p className="text-[10px] text-[#6B7280]">{count} packages assigned · Latency {c.latency}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                            {c.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Urgent Fulfillment Queue */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#111111]">Urgent Dispatch Action Queue</h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-semibold text-[#E31E24] hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {orders.length === 0 ? (
                      <p className="text-xs text-[#6B7280] text-center py-6">No urgent dispatch orders pending</p>
                    ) : (
                      orders.slice(0, 3).map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#111111]">{o.id}</span>
                              <span className="rounded bg-red-50 text-[#E31E24] px-1.5 py-0.5 text-[10px] font-semibold">
                                {ORDER_STEPS[o.status]}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {o.groups[0]?.items.length} line items · {inr(o.total)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="rounded-md border border-[#E5E7EB] px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Details
                            </button>
                            {o.status < 5 && (
                              <button
                                onClick={() => handleAdvanceOrderStatus(o.id, o.status)}
                                className="rounded-md bg-[#E31E24] px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">Order Management</h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">Search, review status, dispatch and process customer orders.</p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 h-4 w-4 text-[#6B7280]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Order ID, customer, parts..."
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] pl-9 pr-3 text-xs text-[#111111] focus:bg-white focus:border-[#E31E24] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-[#6B7280] shrink-0">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#111111] outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PLACED">Placed (Awaiting Accept)</option>
                    <option value="CONFIRMED">Confirmed / Packing</option>
                    <option value="TRANSIT">In Transit / Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Fulfillment</th>
                      <th className="px-4 py-3">Latest Update</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center text-xs text-gray-400">
                          No orders match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const firstProduct = getProduct(o.groups[0]?.items[0]?.productId || "");
                        return (
                          <tr key={o.id} className="hover:bg-gray-50/80 transition">
                            <td className="px-4 py-3 font-mono font-bold text-[#111111]">{o.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-900">{o.customerName || "Customer"}</p>
                              <p className="text-[10px] text-gray-500">{o.shippingAddress?.city || "Bengaluru"}</p>
                            </td>
                            <td className="px-4 py-3 text-[#6B7280]">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-gray-800 line-clamp-1 max-w-[150px]">
                                {firstProduct?.name || "Automotive Spare"}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-[#111111]">{inr(o.total)}</td>
                            <td className="px-4 py-3">
                              <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                                Paid ({o.payment.split("•")[0].split("·")[0]})
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "rounded px-2 py-0.5 text-[10px] font-bold",
                                  o.status === 5
                                    ? "bg-emerald-50 text-emerald-700"
                                    : o.status >= 3
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-700"
                                )}
                              >
                                {ORDER_STEPS[o.status]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#6B7280] text-[11px]">
                              {o.status === 5 ? "Delivered & Signed" : o.status >= 3 ? "Out with Courier" : "Processing at Hub"}
                            </td>
                            <td className="px-4 py-3 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="rounded border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100"
                              >
                                View
                              </button>
                              {o.status < 5 && (
                                <button
                                  onClick={() => handleAdvanceOrderStatus(o.id, o.status)}
                                  className="rounded bg-[#E31E24] px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700"
                                >
                                  Step →
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SHIPMENTS & TRACKING */}
          {activeTab === "shipments" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                    Shipments & Logistics Tracking
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Integrated courier statuses (Delhivery, Bluedart, Shadowfax, Fleet) with verified facility events.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Shipment ID</th>
                      <th className="px-4 py-3">Courier</th>
                      <th className="px-4 py-3">AWB / Tracking</th>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Latest Reported Location</th>
                      <th className="px-4 py-3">Last Updated</th>
                      <th className="px-4 py-3">Est. Delivery</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center text-xs text-gray-400">
                          No active shipments registered.
                        </td>
                      </tr>
                    ) : (
                      shipments.map((s) => (
                        <tr key={s.shipmentId} className="hover:bg-gray-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-[#111111]">{s.shipmentId}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{s.provider}</td>
                          <td className="px-4 py-3 font-mono text-[#6B7280]">{s.trackingNumber}</td>
                          <td className="px-4 py-3 font-mono font-medium text-gray-800">{s.orderId}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-[10px] font-bold",
                                s.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : s.status === "Delayed"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-blue-50 text-blue-700"
                              )}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="rounded bg-gray-100 text-gray-600 px-1 text-[9px] font-bold">
                                {s.locationType === "Live GPS Telemetry" ? "GPS" : "FACILITY"}
                              </span>
                              <span className="text-gray-800 font-medium">{s.latestLocation}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">{s.lastEventTimestamp}</td>
                          <td className="px-4 py-3 text-[#6B7280]">{s.estimatedDelivery}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedShipment(s)}
                              className="rounded border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              Timeline
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTS */}
          {activeTab === "products" && (
            productViewMode === "form" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setProductViewMode("list")}
                    className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 transition bg-white px-3.5 py-2 rounded-lg border border-gray-200 shadow-2xs hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Product Catalog</span>
                  </button>
                  <span className="text-xs text-gray-500 font-medium">
                    {editingAdminProduct ? `Editing: ${editingAdminProduct.name}` : "New Product Listing (PostgreSQL Sync)"}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#09090b] p-4 sm:p-8 shadow-sm">
                  <ProductFormPage
                    product={editingAdminProduct}
                    onCancel={() => setProductViewMode("list")}
                    onSuccess={handleProductFormSuccess}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-extrabold text-[#111111]">Product Catalog</h1>
                    <p className="text-xs text-[#6B7280]">
                      Manage all {adminProducts.length} automotive parts & retail catalogue items synchronized with PostgreSQL.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProductIds.size > 0 && (
                      <button
                        onClick={handleDeleteSelectedProducts}
                        disabled={isDeletingProducts}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Selected ({selectedProductIds.size})</span>
                      </button>
                    )}
                    <button
                      onClick={handleOpenAddProduct}
                      className="flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-sm active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {(
                      [
                        { id: "all", label: "All Products", count: adminProducts.length },
                        {
                          id: "approved",
                          label: "Approved & Live",
                          count: adminProducts.filter((p) => (p.verificationStatus || "approved") === "approved").length,
                        },
                        {
                          id: "pending_approval",
                          label: "Pending Review",
                          count: adminProducts.filter((p) => p.verificationStatus === "pending_approval").length,
                        },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setProductStatusFilter(f.id);
                          setProductPage(1);
                        }}
                        className={cn(
                          "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
                          productStatusFilter === f.id
                            ? "bg-[#111111] text-white shadow-2xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        <span>{f.label}</span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.2 rounded-full",
                          productStatusFilter === f.id ? "bg-white/20 text-white" : "bg-white text-gray-800"
                        )}>
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setProductPage(1);
                      }}
                      placeholder="Search name, SKU, brand..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#E31E24]"
                    />
                  </div>
                </div>

                {/* Products Table */}
                {(() => {
                  const filtered = adminProducts.filter((p) => {
                    const matchesStatus =
                      productStatusFilter === "all" ||
                      (p.verificationStatus || "approved") === productStatusFilter;
                    const query = productSearch.toLowerCase().trim();
                    const matchesSearch =
                      !query ||
                      `${p.name} ${p.brand} ${p.category} ${p.sku || ""} ${p.id}`
                        .toLowerCase()
                        .includes(query);
                    return matchesStatus && matchesSearch;
                  });

                  const PAGE_SIZE = 50;
                  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
                  const currentPage = Math.min(productPage, totalPages);
                  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

                  const allPageSelected = paginated.length > 0 && paginated.every((p) => selectedProductIds.has(p.id));
                  const somePageSelected = paginated.some((p) => selectedProductIds.has(p.id));

                  return (
                    <div className="space-y-3">
                      {/* Active Selection Banner */}
                      {selectedProductIds.size > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl text-xs shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-950">
                              {selectedProductIds.size} of {filtered.length} product{selectedProductIds.size > 1 ? "s" : ""} selected
                            </span>
                            {selectedProductIds.size < filtered.length && (
                              <button
                                onClick={() => handleSelectAllFiltered(filtered)}
                                className="text-red-700 underline font-semibold hover:text-red-900 cursor-pointer ml-1"
                              >
                                Select all {filtered.length} products
                              </button>
                            )}
                            <button
                              onClick={handleClearSelection}
                              className="text-gray-600 underline hover:text-gray-800 cursor-pointer ml-1"
                            >
                              Deselect all
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleDeleteSelectedProducts}
                              disabled={isDeletingProducts}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white font-bold px-3.5 py-1.5 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Selected ({selectedProductIds.size})</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="w-10 px-3 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={allPageSelected}
                                  ref={(el) => {
                                    if (el) {
                                      el.indeterminate = somePageSelected && !allPageSelected;
                                    }
                                  }}
                                  onChange={() => handleSelectAllOnPage(paginated)}
                                  title="Select all products on this page"
                                  className="h-4 w-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24] cursor-pointer accent-[#E31E24]"
                                />
                              </th>
                              <th className="px-4 py-3">Product Name & ID</th>
                              <th className="px-4 py-3">Brand</th>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Price</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Stock Units</th>
                              <th className="px-4 py-3 text-right">Action</th>
                              <th className="px-4 py-3 text-center text-red-600 font-bold">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5E7EB]">
                            {filtered.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                  <div className="flex flex-col items-center justify-center space-y-3">
                                    <Package className="h-10 w-10 text-gray-300 stroke-[1.5]" />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">No matching products found</p>
                                      <p className="text-xs text-gray-500 mt-0.5">Try adjusting your search query or status filter.</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              paginated.map((p) => {
                                const stock = p.offers[0]?.stock ?? inventoryStock[p.id] ?? 0;
                                const isApproved = (p.verificationStatus || "approved") === "approved";
                                const priceVal = p.offers[0]?.price || 0;
                                const isSelected = selectedProductIds.has(p.id);

                                return (
                                  <tr
                                    key={p.id}
                                    className={cn(
                                      "transition",
                                      isSelected
                                        ? "bg-red-50/50 hover:bg-red-50/70"
                                        : "hover:bg-gray-50/80"
                                    )}
                                  >
                                    <td className="w-10 px-3 py-3 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelectProduct(p.id)}
                                        title={`Select ${p.name}`}
                                        className="h-4 w-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24] cursor-pointer accent-[#E31E24]"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                                      <div className="text-[10px] font-mono text-gray-400">{p.id} {p.sku ? `· ${p.sku}` : ""}</div>
                                    </td>
                                    <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{p.brand}</td>
                                    <td className="px-4 py-3">
                                      <span className="rounded bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap">
                                        {p.category}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-[#111111] whitespace-nowrap">
                                      {priceVal > 0 ? inr(priceVal) : <span className="text-[10px] text-gray-500 font-normal">On Request</span>}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      {isApproved ? (
                                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                          Approved
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                          Pending
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{stock}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                      <div className="flex items-center justify-end gap-2">
                                        {!isApproved && (
                                          <button
                                            onClick={() => handleQuickApproveProduct(p.id)}
                                            className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-2xs transition cursor-pointer"
                                          >
                                            Approve
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleOpenEditProduct(p)}
                                          className="text-xs text-[#E31E24] font-semibold hover:underline cursor-pointer px-1 py-0.5"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                      <button
                                        onClick={() => handleDeleteSingleProduct(p)}
                                        disabled={isDeletingProducts}
                                        title={`Delete ${p.name}`}
                                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded-md font-semibold transition cursor-pointer active:scale-95 disabled:opacity-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Bar */}
                      {filtered.length > PAGE_SIZE && (
                        <div className="flex items-center justify-between text-xs text-gray-500 px-2 py-2">
                          <span>
                            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} products
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={currentPage <= 1}
                              onClick={() => setProductPage((prev) => Math.max(1, prev - 1))}
                              className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                            >
                              Previous
                            </button>
                            <span className="px-2 font-bold text-gray-800">
                              {currentPage} / {totalPages}
                            </span>
                            <button
                              disabled={currentPage >= totalPages}
                              onClick={() => setProductPage((prev) => Math.min(totalPages, prev + 1))}
                              className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )
          )}

          {/* TAB 5: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">Category Architecture</h1>
                  <p className="text-xs text-[#6B7280]">
                    Total {dbCategories.length > 0 ? dbCategories.length : 93} categories synchronized with PostgreSQL database.
                  </p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#E31E24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(dbCategories.length > 0
                  ? dbCategories.filter((c) =>
                      !categorySearch ||
                      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
                      (c.department && c.department.toLowerCase().includes(categorySearch.toLowerCase()))
                    )
                  : [
                      { name: "Electric Bikes", slug: "electric-bikes", department: "Vehicles" },
                      { name: "Car Accessories", slug: "car-accessories", department: "Interior" },
                      { name: "Bike Accessories", slug: "bike-accessories", department: "Accessories" },
                      { name: "Spare Parts", slug: "spare-parts", department: "Spares" },
                      { name: "Battery Packs", slug: "ev-batteries", department: "Electronics" },
                      { name: "Fast Chargers", slug: "smart-chargers", department: "Multimedia" },
                    ]
                ).map((cat: any) => {
                  const dynamicCount = adminProducts.filter((p) =>
                    p.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                    cat.name.toLowerCase().includes(p.category.toLowerCase())
                  ).length;
                  return (
                    <div key={cat.id || cat.slug} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:shadow-xs transition">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-xs text-[#111111] line-clamp-1">{cat.name}</h3>
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 shrink-0">
                          {dynamicCount} items
                        </span>
                      </div>
                      {cat.department && (
                        <span className="mt-2 inline-block rounded bg-red-50 text-[#E31E24] px-1.5 py-0.5 text-[9px] font-semibold">
                          {cat.department}
                        </span>
                      )}
                      <p className="mt-1 text-[11px] text-[#6B7280] font-mono">slug: {cat.slug}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOMERS */}
          {activeTab === "customers" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Registered Customers</h1>
              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Email & Phone</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Registered EV</th>
                      <th className="px-4 py-3">Total Orders</th>
                      <th className="px-4 py-3">Lifetime GMV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400">
                          No registered customers or customer orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-4 py-3 font-semibold text-gray-900">{o.customerName || "Customer"}</td>
                          <td className="px-4 py-3 text-[#6B7280]">{o.customerPhone || "N/A"}</td>
                          <td className="px-4 py-3">{o.shippingAddress?.city || "Bengaluru, KA"}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">Electric Vehicle</td>
                          <td className="px-4 py-3 font-bold">1</td>
                          <td className="px-4 py-3 font-bold text-[#111111]">{inr(o.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENTS & REFUNDS */}
          {activeTab === "payments" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Payments & Gateway Ledger</h1>
              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Txn Reference</th>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Gateway / Method</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Settlement</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400">
                          No payment transactions processed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => {
                        const txnId = `TXN_${o.payment.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase().slice(0, 8)}_${o.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6)}`;
                        return (
                          <tr key={o.id} className="hover:bg-gray-50/80 transition">
                            <td className="px-4 py-3 font-mono font-bold text-gray-900">{txnId}</td>
                            <td className="px-4 py-3 font-mono text-gray-700">{o.id}</td>
                            <td className="px-4 py-3 text-[#6B7280]">{o.payment}</td>
                            <td className="px-4 py-3 font-bold text-[#111111]">{inr(o.total)}</td>
                            <td className="px-4 py-3">
                              <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                {o.status === 5 ? "Settled" : "Captured"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleProcessRefund(o.id)}
                                className="rounded border border-gray-200 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                Refund
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: RETURNS & CANCELLATIONS */}
          {activeTab === "returns" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Returns & Cancellations (RMA)</h1>
              <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center shadow-2xs">
                <RotateCcw className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-700">No Pending Return or RMA Requests</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Return requests and warranty replacements will be listed here.</p>
              </div>
            </div>
          )}

          {/* TAB 10: OFFERS & COUPONS */}
          {activeTab === "offers" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">Promotions & Coupons</h1>
                  <p className="text-xs text-[#6B7280]">Create and inspect active discount codes.</p>
                </div>
                <button
                  onClick={() => toast.success("New coupon creation dialog")}
                  className="rounded-lg bg-[#E31E24] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  + New Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { code: "EVSAFE", desc: "₹500 off on 60V chargers & diagnostics", usage: "142 used", active: true },
                  { code: "RIDERZ200", desc: "Flat ₹200 off on first spare parts order", usage: "389 used", active: true },
                  { code: "MONSOON10", desc: "10% off waterproofing bike covers", usage: "88 used", active: false },
                ].map((c) => (
                  <div key={c.code} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-[#E31E24]">{c.code}</span>
                      <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", c.active ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600")}>
                        {c.active ? "Active" : "Expired"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#111111] font-medium">{c.desc}</p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">{c.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: REPORTS & ANALYTICS */}
          {activeTab === "reports" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Logistics & Sales Analytics</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">Total Realized GMV</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">{inr(totalSales)}</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">Calculated across all orders</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">Delivered Orders</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">{deliveredCount} / {orders.length}</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">Doorstep completion rate</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">Consignments In Transit</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">{inTransitCount}</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">Active courier tracking</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Operations Notifications</h1>
              <div className="space-y-3">
                {lowStockProducts.length === 0 && orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-xs text-gray-400">
                    No operational alerts. Systems running smoothly.
                  </div>
                ) : (
                  [
                    ...lowStockProducts.map((p) => ({
                      title: `Low Stock Alert: ${p.name}`,
                      time: "Threshold reached (<5 units)",
                      type: "warning" as const,
                    })),
                    ...orders.slice(0, 3).map((o) => ({
                      title: `Order ${o.id} - ${inr(o.total)} placed`,
                      time: new Date(o.createdAt).toLocaleDateString(),
                      type: "order" as const,
                    })),
                  ].map((n, i) => (
                    <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#111111]">{n.title}</p>
                        <p className="text-[10px] text-[#6B7280]">{n.time}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#E31E24] bg-red-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: DELIVERY INTEGRATION SETTINGS */}
          {activeTab === "integrations" && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                  Delivery Integration & Pricing Settings
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Configure courier API adapters, webhook secrets, and distance pricing formulas.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distance Pricing Formula */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <h3 className="font-bold text-sm text-[#111111] mb-2">Distance-Based Delivery Pricing</h3>
                  <p className="text-xs text-[#6B7280] mb-4">
                    Fee per vendor = Base fee + (Per km rate × Distance from vendor hub to customer).
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Base Fee (₹)</label>
                      <input
                        type="number"
                        value={baseFee}
                        onChange={(e) => setBaseFee(+e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#E31E24] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Per Km Rate (₹)</label>
                      <input
                        type="number"
                        value={perKmFee}
                        onChange={(e) => setPerKmFee(+e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#E31E24] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[#F5F6F8] border border-gray-200 text-xs">
                    <p className="font-semibold text-gray-800">Example 8 km Delivery calculation:</p>
                    <p className="text-gray-600 mt-0.5">
                      ₹{baseFee} + (8 × ₹{perKmFee}) = <span className="font-bold text-[#E31E24]">₹{baseFee + 8 * perKmFee}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => toast.success("Delivery pricing saved successfully")}
                    className="mt-4 rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Save Pricing Changes
                  </button>
                </div>

                {/* API Adapters & Webhooks */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-4">
                  <h3 className="font-bold text-sm text-[#111111]">Courier API Adapters</h3>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">Inbound Webhook Endpoint</label>
                    <input
                      type="text"
                      readOnly
                      value="https://api.riderzpro.com/v1/webhooks/courier-tracking"
                      className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">Webhook Secret Key (HMAC-SHA256)</label>
                    <input
                      type="password"
                      readOnly
                      value="rzp_sec_live_9941a87b32c449e0"
                      className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-800 font-semibold">
                      API Credentials Protected on Server Environment
                    </span>
                  </div>
                </div>

                {/* Inbound Webhook Testing & Simulation Console */}
                <div className="lg:col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#E31E24]" />
                        <span>Interactive Courier Webhook Simulator & Idempotency Testing</span>
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        Simulate authenticated inbound webhook callbacks from Delhivery, Bluedart, Shadowfax & Fleet. Demonstrates duplicate event prevention.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Sandbox Simulation Mode
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Provider Adapter</label>
                      <select
                        value={testWebhookProvider}
                        onChange={(e) => setTestWebhookProvider(e.target.value as LogisticsProvider)}
                        className="w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                      >
                        <option value="Delhivery">Delhivery Express</option>
                        <option value="Bluedart">Bluedart Apex</option>
                        <option value="Shadowfax">Shadowfax Regional</option>
                        <option value="RiderzPro Fleet">RiderzPro Fleet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Target Tracking Number (AWB)</label>
                      <input
                        type="text"
                        value={testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471"}
                        onChange={(e) => setTestWebhookTracking(e.target.value)}
                        placeholder="e.g. DEL984128471"
                        className="w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Simulated Status</label>
                      <select
                        value={testWebhookStatus}
                        onChange={(e) => setTestWebhookStatus(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                      >
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered & Signed</option>
                        <option value="Delayed">Delayed (Route Congestion)</option>
                        <option value="Failed Attempt">Failed Delivery Attempt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Checkpoint Location</label>
                      <input
                        type="text"
                        value={testWebhookLocation}
                        onChange={(e) => setTestWebhookLocation(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newEventId = `evt-${Date.now()}`;
                        setLastTestEventId(newEventId);
                        const trackingNum = testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471";
                        const result = processWebhook({
                          eventId: newEventId,
                          provider: testWebhookProvider,
                          trackingNumber: trackingNum,
                          rawStatus: testWebhookStatus,
                          location: testWebhookLocation,
                        });
                        setWebhookLogs((prev) => [
                          { id: newEventId, time: new Date().toLocaleTimeString(), msg: result.message, isDup: result.isDuplicate },
                          ...prev,
                        ]);
                        toast.success(result.message);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#E31E24] text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                    >
                      🚀 Fire Authenticated Webhook
                    </button>

                    <button
                      type="button"
                      disabled={!lastTestEventId}
                      onClick={() => {
                        const trackingNum = testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471";
                        const result = processWebhook({
                          eventId: lastTestEventId,
                          provider: testWebhookProvider,
                          trackingNumber: trackingNum,
                          rawStatus: testWebhookStatus,
                          location: testWebhookLocation,
                        });
                        setWebhookLogs((prev) => [
                          { id: lastTestEventId, time: new Date().toLocaleTimeString(), msg: result.message, isDup: result.isDuplicate },
                          ...prev,
                        ]);
                        toast.warning(result.message);
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                    >
                      🔁 Test Idempotent Repeat (Duplicate Event ID)
                    </button>
                  </div>

                  {webhookLogs.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5 max-h-40 overflow-y-auto font-mono">
                      <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Webhook Execution Log:</p>
                      {webhookLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          <span className="text-gray-400">[{log.time}]</span>
                          <span className={log.isDup ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>
                            {log.isDup ? "[DUPLICATE SKIPPED]" : "[200 OK PROCESSED]"}
                          </span>
                          <span className="text-gray-700 truncate">{log.msg}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Audit Trail & Security Logs</h1>
              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Actor</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Target Reference</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-xs text-gray-400">
                          No audit entries recorded yet. Operational updates and status changes will appear here.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-4 py-3 text-[#6B7280]">{a.timestamp}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{a.actor}</td>
                          <td className="px-4 py-3 font-bold text-[#E31E24]">{a.action}</td>
                          <td className="px-4 py-3 font-mono font-medium">{a.target}</td>
                          <td className="px-4 py-3 text-gray-700">{a.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MARKETPLACE VENDORS */}
          {activeTab === "vendors" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                    Authorized Marketplace Vendors ({marketplaceVendors.length})
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Manage certified EV parts sellers, commercial dealerships, service coverage, and commission terms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vendors or areas..."
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      className="h-9 w-60 rounded-lg border border-gray-200 pl-8 pr-3 text-xs focus:border-[#E31E24] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-3.5">Vendor / Shop</th>
                        <th className="p-3.5">Verification & Status</th>
                        <th className="p-3.5">Customer Rating</th>
                        <th className="p-3.5">Coverage & Contact</th>
                        <th className="p-3.5">Commission Rate</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {marketplaceVendors
                        .filter(
                          (v) =>
                            !vendorSearch ||
                            v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
                            v.area.toLowerCase().includes(vendorSearch.toLowerCase())
                        )
                        .map((v) => {
                          const isSuspended = v.verificationBadge === "Suspended";
                          return (
                            <tr key={v.id} className="hover:bg-gray-50/80 transition">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-[#E31E24] font-bold shrink-0">
                                    <Store className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-[#111111]">{v.name}</span>
                                      <Link
                                        to="/vendor/$id"
                                        params={{ id: v.id }}
                                        target="_blank"
                                        className="text-[10px] text-gray-400 hover:text-[#E31E24] inline-flex items-center gap-0.5"
                                        title="View public shopfront"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Link>
                                    </div>
                                    <p className="text-[11px] text-[#6B7280]">{v.address || v.area}</p>
                                    <span className="font-mono text-[10px] text-gray-400">GST: {v.gstin || "29AABCR0000Z1Z0"}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                {isSuspended ? (
                                  <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-bold">
                                    Suspended
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-bold border border-emerald-200">
                                    <ShieldCheck className="h-3 w-3" />
                                    {v.verificationBadge || "Verified Partner"}
                                  </span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center gap-1 font-bold text-amber-600">
                                  <span>{v.rating} ★</span>
                                  <span className="text-[11px] text-gray-400 font-normal">({v.reviewCount || 120})</span>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <p className="text-[#111111] font-medium">{v.deliveryCoverage || "All Bengaluru"}</p>
                                <p className="text-[11px] text-[#6B7280]">{v.phone || "+91 80 4000 1122"}</p>
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    defaultValue={Math.round((v.commissionRate || 0.1) * 100)}
                                    onBlur={(e) => handleUpdateVendorCommission(v.id, Number(e.target.value))}
                                    className="w-14 h-7 rounded border border-gray-200 px-1.5 text-center font-bold"
                                    min={1}
                                    max={30}
                                  />
                                  <span className="text-gray-500 font-semibold">%</span>
                                </div>
                              </td>

                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleToggleVendorStatus(v.id)}
                                  className={cn(
                                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                                    isSuspended
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                      : "bg-red-50 text-[#E31E24] hover:bg-red-100 border border-red-200"
                                  )}
                                >
                                  {isSuspended ? "Reactivate" : "Suspend"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VENDOR ONBOARDING APPLICATIONS */}
          {activeTab === "vendor_applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                    Vendor Onboarding Applications ({vendorApplications.length})
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Verify applicant business details, GSTIN tax registration, and authorized product categories.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-3.5">Business Name & Contact</th>
                        <th className="p-3.5">Location & Area</th>
                        <th className="p-3.5">GSTIN Registration</th>
                        <th className="p-3.5">Primary Categories</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {vendorApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/80 transition">
                          <td className="p-3.5">
                            <p className="font-bold text-[#111111]">{app.businessName}</p>
                            <p className="text-[11px] text-[#6B7280]">{app.contactName} · {app.phone}</p>
                            <span className="text-[10px] text-gray-400">{app.email} · Applied {app.appliedAt}</span>
                          </td>

                          <td className="p-3.5">
                            <p className="font-medium text-[#111111]">{app.area}</p>
                            <p className="text-[11px] text-[#6B7280]">{app.city}</p>
                          </td>

                          <td className="p-3.5 font-mono font-bold text-gray-800">
                            {app.gstin}
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {app.primaryCategories.map((c) => (
                                <span key={c} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                                app.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : app.status === "rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              )}
                            >
                              {app.status === "approved" ? "Approved" : app.status === "rejected" ? "Rejected" : "Pending Review"}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            {app.status === "pending" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveVendorApplication(app.id)}
                                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectVendorApplication(app.id)}
                                  className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VENDOR OFFERS MODERATION */}
          {activeTab === "vendor_offers" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                  Vendor Offers & Pricing Moderation
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Inspect and moderate all active offers attached to canonical products by vendors across the marketplace.
                </p>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-3.5">Canonical Product</th>
                        <th className="p-3.5">Vendor / Seller</th>
                        <th className="p-3.5">Offer Price & MRP</th>
                        <th className="p-3.5">Stock Allocation</th>
                        <th className="p-3.5">Warranty & Dispatch</th>
                        <th className="p-3.5 text-right">Offer Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminProducts.flatMap((p) =>
                        p.offers.map((off, idx) => {
                          const v = getVendor(off.vendorId);
                          return (
                            <tr key={`${p.id}-${off.vendorId}-${idx}`} className="hover:bg-gray-50/80 transition">
                              <td className="p-3.5">
                                <div className="flex items-center gap-2.5">
                                  <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                                  <div>
                                    <p className="font-bold text-[#111111] leading-tight">{p.name}</p>
                                    <span className="text-[11px] text-[#6B7280]">{p.brand} · {p.category}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span className="font-bold text-[#111111] block">{v.name}</span>
                                <span className="text-[11px] text-[#6B7280]">{v.area}</span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-extrabold text-sm text-[#111111]">{inr(off.price)}</span>
                                {off.mrp && off.mrp > off.price && (
                                  <span className="text-[11px] text-gray-400 line-through block">{inr(off.mrp)}</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                {off.stock < 5 ? (
                                  <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                                    Low · {off.stock} units
                                  </span>
                                ) : (
                                  <span className="font-semibold text-gray-700">{off.stock} in stock</span>
                                )}
                              </td>

                              <td className="p-3.5 text-[#6B7280]">
                                <p className="font-medium text-[#111111]">{off.warrantyTerms || "Standard Warranty"}</p>
                                <p className="text-[11px]">Dispatch in {off.dispatchHours || 24}h</p>
                              </td>

                              <td className="p-3.5 text-right">
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                                  Live in Catalog
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMMISSIONS & SETTLEMENTS */}
          {activeTab === "commissions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                    Platform Commission & Settlements
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Automated fee deductions, vendor settlement ledgers, and payout disbursement reconciliation.
                  </p>
                </div>
              </div>

              {/* Commission Rule Configuration */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-[#111111]">Marketplace Commission Rules</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Standard default take-rate calculated on fulfilled order gross value.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold">
                    <span>Default Commission:</span>
                    <input
                      type="number"
                      value={defaultPlatformCommission}
                      onChange={(e) => setDefaultPlatformCommission(Number(e.target.value))}
                      className="w-12 bg-transparent text-center text-[#E31E24] outline-none"
                    />
                    <span>%</span>
                  </div>
                  <button
                    onClick={() => toast.success(`Platform commission rule updated to ${defaultPlatformCommission}%`)}
                    className="rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Apply Rate
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase">Total Gross GMV</span>
                  <p className="mt-2 text-2xl font-extrabold text-[#111111] font-display">
                    {inr(adminSettlements.reduce((s, x) => s + x.grossSales, 0))}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">All settled periods</p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase">Platform Revenue</span>
                  <p className="mt-2 text-2xl font-extrabold text-[#E31E24] font-display">
                    {inr(adminSettlements.reduce((s, x) => s + x.commissionAmount, 0))}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">Take-rate earnings</p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase">Disbursed to Vendors</span>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-600 font-display">
                    {inr(adminSettlements.filter((s) => s.status === "Paid").reduce((s, x) => s + x.netPayout, 0))}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">Transferred via NEFT/RTGS</p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase">Pending Settlements</span>
                  <p className="mt-2 text-2xl font-extrabold text-amber-600 font-display">
                    {inr(adminSettlements.filter((s) => s.status !== "Paid").reduce((s, x) => s + x.netPayout, 0))}
                  </p>
                  <p className="mt-1 text-[11px] text-amber-600 font-medium">Awaiting disbursement</p>
                </div>
              </div>

              {/* Settlements Ledger Table */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#111111]">Vendor Settlement Records & Ledger</h3>
                  <span className="text-xs text-[#6B7280]">Audited against verified logistics delivered events</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-3.5">Vendor Name</th>
                        <th className="p-3.5">Settlement Period</th>
                        <th className="p-3.5">Orders</th>
                        <th className="p-3.5">Gross Sales</th>
                        <th className="p-3.5">Platform Commission</th>
                        <th className="p-3.5">Net Payout</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Bank UTR / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminSettlements.map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50/80 transition">
                          <td className="p-3.5 font-bold text-[#111111]">
                            {st.vendorName}
                            <span className="block text-[10px] font-mono text-gray-400">{st.id}</span>
                          </td>

                          <td className="p-3.5 text-gray-700">{st.period}</td>

                          <td className="p-3.5">{st.orderCount} orders</td>

                          <td className="p-3.5 font-semibold text-[#111111]">{inr(st.grossSales)}</td>

                          <td className="p-3.5 text-[#E31E24] font-medium">
                            {inr(st.commissionAmount)} ({Math.round(st.commissionRate * 100)}%)
                          </td>

                          <td className="p-3.5 font-extrabold text-emerald-700">{inr(st.netPayout)}</td>

                          <td className="p-3.5">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                                st.status === "Paid"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : st.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              )}
                            >
                              {st.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right font-mono text-xs">
                            {st.status === "Paid" ? (
                              <span className="text-gray-600 text-[11px]" title={`Paid on ${st.payoutDate}`}>
                                {st.referenceNumber}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMarkSettlementPaid(st.id)}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Disburse & Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS MODERATION */}
          {activeTab === "reviews_moderation" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">
                    Customer Reviews & Quality Moderation
                  </h1>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Maintain catalog authenticity. Moderate product performance feedback and vendor shop delivery experiences.
                  </p>
                </div>
                <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    onClick={() => setReviewTabMode("product")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition",
                      reviewTabMode === "product" ? "bg-[#E31E24] text-white" : "text-gray-600 hover:text-black"
                    )}
                  >
                    Product Reviews ({adminProductReviews.length})
                  </button>
                  <button
                    onClick={() => setReviewTabMode("vendor")}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition",
                      reviewTabMode === "vendor" ? "bg-[#E31E24] text-white" : "text-gray-600 hover:text-black"
                    )}
                  >
                    Vendor Shop Reviews ({adminVendorReviews.length})
                  </button>
                </div>
              </div>

              {reviewTabMode === "product" ? (
                <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Rating & Review</th>
                          <th className="p-3.5">Vehicle Fitment</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {adminProductReviews.map((rev) => {
                          const prod = getProduct(rev.productId);
                          return (
                            <tr key={rev.id} className="hover:bg-gray-50/80 transition">
                              <td className="p-3.5">
                                <p className="font-bold text-[#111111]">{rev.userName}</p>
                                <span className="text-[10px] text-gray-400">{rev.date}</span>
                                {rev.isVerifiedPurchase && (
                                  <span className="block mt-0.5 text-[10px] font-bold text-emerald-700">Verified Buyer</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <p className="font-semibold text-[#111111] max-w-[180px] truncate">{prod?.name || rev.productId}</p>
                                <span className="text-[11px] text-[#6B7280]">{prod?.brand}</span>
                              </td>

                              <td className="p-3.5 max-w-sm">
                                <div className="flex items-center gap-1 text-amber-500 font-bold mb-0.5">
                                  <span>{"★".repeat(rev.rating)}</span>
                                  <span className="text-[#111111] ml-1">{rev.title}</span>
                                </div>
                                <p className="text-gray-700 leading-snug">{rev.comment}</p>
                              </td>

                              <td className="p-3.5 text-gray-600">
                                {rev.fitmentVehicle || "Universal Fit"}
                              </td>

                              <td className="p-3.5">
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    rev.status === "published"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  )}
                                >
                                  {rev.status}
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {rev.status !== "published" && (
                                    <button
                                      onClick={() => handleModerateProductReview(rev.id, "published")}
                                      className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 text-xs font-semibold hover:bg-emerald-100"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {rev.status === "published" && (
                                    <button
                                      onClick={() => handleModerateProductReview(rev.id, "rejected")}
                                      className="rounded-lg bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 text-xs font-semibold hover:bg-amber-100"
                                    >
                                      Unpublish
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleModerateProductReview(rev.id, "deleted")}
                                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                                    title="Delete Review"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
              ) : (
                <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F6F8] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Vendor Shop</th>
                          <th className="p-3.5">Rating & Review</th>
                          <th className="p-3.5">Sub-Scores</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {adminVendorReviews.map((rev) => {
                          const v = getVendor(rev.vendorId);
                          return (
                            <tr key={rev.id} className="hover:bg-gray-50/80 transition">
                              <td className="p-3.5">
                                <p className="font-bold text-[#111111]">{rev.userName}</p>
                                <span className="text-[10px] text-gray-400">{rev.date}</span>
                                {rev.isVerifiedPurchase && (
                                  <span className="block mt-0.5 text-[10px] font-bold text-emerald-700">Verified Buyer</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <p className="font-semibold text-[#111111]">{v.name}</p>
                                <span className="text-[11px] text-[#6B7280]">{v.area}</span>
                              </td>

                              <td className="p-3.5 max-w-sm">
                                <div className="flex items-center gap-1 text-amber-500 font-bold mb-0.5">
                                  <span>{"★".repeat(rev.rating)}</span>
                                  <span className="text-[#111111] ml-1">({rev.rating}/5)</span>
                                </div>
                                <p className="text-gray-700 leading-snug">{rev.comment}</p>
                              </td>

                              <td className="p-3.5 text-[11px] text-[#6B7280]">
                                <span>Packaging: {rev.packagingRating}★</span>
                                <br />
                                <span>Delivery: {rev.deliveryRating}★</span>
                              </td>

                              <td className="p-3.5">
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    rev.status === "published"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  )}
                                >
                                  {rev.status}
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {rev.status !== "published" && (
                                    <button
                                      onClick={() => handleModerateVendorReview(rev.id, "published")}
                                      className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 text-xs font-semibold hover:bg-emerald-100"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {rev.status === "published" && (
                                    <button
                                      onClick={() => handleModerateVendorReview(rev.id, "rejected")}
                                      className="rounded-lg bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 text-xs font-semibold hover:bg-amber-100"
                                    >
                                      Unpublish
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleModerateVendorReview(rev.id, "deleted")}
                                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                                    title="Delete Review"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
              )}
            </div>
          )}

          {/* TAB 15: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Platform Settings</h1>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs max-w-xl space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Platform Operating City</label>
                  <input
                    type="text"
                    defaultValue="Bengaluru, Karnataka (HQ)"
                    className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Support Hotline Phone</label>
                  <input
                    type="text"
                    defaultValue="+91 98765 43210"
                    className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Emergency Operations Email</label>
                  <input
                    type="email"
                    defaultValue="ops@riderzpro.com"
                    className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
                  />
                </div>
                <button
                  onClick={() => toast.success("Settings saved")}
                  className="rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Save Platform Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ORDER DETAILS MODAL
         ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-[#111111]">
                Order {selectedOrder.id}
              </span>
              <span className="rounded bg-red-50 text-[#E31E24] px-2 py-0.5 text-xs font-bold">
                {ORDER_STEPS[selectedOrder.status]}
              </span>
            </div>

            <p className="text-xs text-[#6B7280] mt-1">
              Payment: <span className="font-semibold text-emerald-700">{selectedOrder.paymentStatus || "Paid"}</span> · {selectedOrder.payment}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-[#F5F6F8] border border-gray-200 text-xs text-gray-600">
              <p>
                Recipient: <span className="font-semibold text-gray-800">{selectedOrder.customerName || "Aakash Sharma"}</span> ({selectedOrder.customerPhone || "+91 98765 43210"})
              </p>
              {selectedOrder.shipmentId && (
                <p className="mt-1 text-[11px] font-mono text-[#E31E24] font-bold">
                  Linked Shipment: {selectedOrder.shipmentId}
                </p>
              )}
            </div>

            {/* Courier Dispatch Actions if not manifested */}
            {selectedOrder.fulfillmentStatus !== "Cancelled" && (
              <div className="mt-3 p-3 rounded-xl bg-red-50/50 border border-red-200 text-xs">
                <p className="font-bold text-[#111111] mb-1.5">Manifest Courier Consignment:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["Delhivery", "Bluedart", "Shadowfax", "RiderzPro Fleet"] as LogisticsProvider[]).map((cr) => (
                    <button
                      key={cr}
                      type="button"
                      onClick={() => handleCreateCourierShipment(selectedOrder, cr)}
                      className="px-2.5 py-1 rounded-md bg-white border border-gray-300 text-[11px] font-semibold text-gray-800 hover:border-[#E31E24] hover:text-[#E31E24] transition shadow-2xs cursor-pointer"
                    >
                      + {cr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Line items */}
            <div className="mt-4 border-t border-b border-gray-100 py-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Items Ordered</p>
              {selectedOrder.groups.map((g) => (
                <div key={g.vendorId} className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">Vendor: {getVendor(g.vendorId).name}</p>
                  {g.items.map((it) => {
                    const prod = getProduct(it.productId);
                    return (
                      <div key={it.productId} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#111111]">
                          {it.qty} × {prod?.name || "Part"}
                        </span>
                        <span className="font-bold text-[#111111]">{inr(it.price * it.qty)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Total and Fees */}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span>{inr(selectedOrder.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Logistics Fee:</span>
                <span>{inr(selectedOrder.deliveryTotal)}</span>
              </div>
              {selectedOrder.discountTotal ? (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({selectedOrder.couponCode || "PROMO"}):</span>
                  <span>- {inr(selectedOrder.discountTotal)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <span>GST (18%):</span>
                <span>{inr(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#111111] pt-2 border-t border-gray-100">
                <span>Grand Total:</span>
                <span>{inr(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {selectedOrder.fulfillmentStatus !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id, "Admin cancellation with inventory rollback")}
                    className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel Order
                  </button>
                )}
                {selectedOrder.paymentStatus !== "Refunded" && (
                  <button
                    onClick={() => handleProcessRefund(selectedOrder.id)}
                    className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Initiate Refund
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                {selectedOrder.status < 5 && selectedOrder.fulfillmentStatus !== "Cancelled" && (
                  <button
                    onClick={() => handleAdvanceOrderStatus(selectedOrder.id, selectedOrder.status)}
                    className="rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Transition to {ORDER_STEPS[selectedOrder.status + 1]} →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SHIPMENT DETAILS MODAL
         ───────────────────────────────────────────────────────────── */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <button
              onClick={() => setSelectedShipment(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-[#111111]">
                {selectedShipment.shipmentId}
              </span>
              <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-bold">
                {selectedShipment.provider}
              </span>
            </div>

            <p className="text-xs text-[#6B7280] mt-1 font-mono">
              AWB: {selectedShipment.trackingNumber} · Order: {selectedShipment.orderId}
            </p>

            {/* Checkpoint vs GPS Notice */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
              <span className="font-bold text-gray-900">Verified Location Telemetry: </span>
              {selectedShipment.locationType === "Live GPS Telemetry"
                ? "Live GPS coordinates broadcasted by vehicle telematics OBD unit."
                : "Official barcode scanner checkpoint verified at courier logistics sorting facility."}
            </div>

            {/* Timeline */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tracking Events History</p>
              <div className="space-y-2 border-l-2 border-red-500 pl-3 ml-2">
                {selectedShipment.events.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative">
                    <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-[#E31E24]" />
                    <p className="text-xs font-bold text-gray-900">{evt.description}</p>
                    <p className="text-[11px] text-[#6B7280]">{evt.location} · {evt.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedShipment(null)}
                className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
              >
                Close Tracking Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
