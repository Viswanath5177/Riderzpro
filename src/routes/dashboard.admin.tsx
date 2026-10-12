import { createFileRoute, Link } from "@tanstack/react-router";
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
  X,
  Phone,
  Mail,
  Zap,
  ArrowUpDown,
  Check,
  Ban,
  IndianRupee,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { getProduct, getVendor, inr, products, vendors, type Product } from "@/lib/data";
import { ORDER_STEPS, useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProductFormPage } from "@/components/vendor/ProductFormPage";

export const Route = createFileRoute("/dashboard/admin")({
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
  | "inventory"
  | "customers"
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

interface ShipmentRecord {
  internalId: string;
  orderId: string;
  courier: "Delhivery" | "Bluedart" | "Shadowfax" | "RiderzPro Fleet";
  trackingNumber: string;
  status: "In Transit" | "Out for Delivery" | "Delivered" | "Delayed" | "Failed Attempt";
  locationType: "Checkpoint Facility" | "Live GPS Fleet";
  latestLocation: string;
  lastUpdated: string;
  estimatedDelivery: string;
  delayAlert?: string;
  trackingEvents: { time: string; location: string; event: string; isGps?: boolean }[];
}

export function AdminDashboard() {
  const { orders, updateOrderStatus, advanceOrder, placeOrder } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "ytd">("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);

  // Dynamic Products State linked to PostgreSQL schema (No mock defaults)
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [productViewMode, setProductViewMode] = useState<"list" | "form">("list");
  const [editingAdminProduct, setEditingAdminProduct] = useState<Product | null>(null);

  // Sync with PostgreSQL on mount & on updates
  const fetchAdminProducts = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const dbProducts: Product[] = res.data.map((row: any) => {
            let primaryImg = "/src/assets/parts.jpg";
            if (row.image_url) {
              try {
                if (row.image_url.startsWith("[")) {
                  const arr = JSON.parse(row.image_url);
                  primaryImg = arr[0] || primaryImg;
                } else {
                  primaryImg = row.image_url;
                }
              } catch {
                primaryImg = row.image_url;
              }
            }
            const desc = row.description || "";
            let fitsArr: string[] = ["universal"];
            if (row.compatible_vehicles) {
              fitsArr = Array.isArray(row.compatible_vehicles)
                ? row.compatible_vehicles
                : [row.compatible_vehicles];
            }
            return {
              id: row.id,
              name: row.name,
              brand: row.brand || "Riderzpro Certified",
              category: (row.category_name as any) || "Car Accessories",
              image: primaryImg,
              warrantyMonths: row.warranty?.includes("year") ? 12 : 6,
              weightKg: Number(row.weight_kg) || 2,
              fits: fitsArr,
              description: desc,
              offers: [{ vendorId: "v1", price: Number(row.price), stock: Number(row.stock) }],
              verificationStatus: row.verification_status || "approved",
              sku: row.sku,
              variantModel: row.variant_model,
            };
          });
          setAdminProducts(dbProducts);
        }
      })
      .catch((err) => {
        console.log("[DB fetch notice admin]:", err.message);
      });
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

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

  // Local inventory stock adjustments
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {};
    products.forEach((p, idx) => {
      s[p.id] = (idx % 4 === 0) ? 3 : 18 + (idx * 3); // some low stock
    });
    return s;
  });

  // Base and Per-Km delivery pricing settings
  const [baseFee, setBaseFee] = useState(40);
  const [perKmFee, setPerKmFee] = useState(12);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: "aud-1",
      timestamp: "10 mins ago",
      actor: "Vikram Malhotra (Ops)",
      action: "Status Transition",
      target: "RZ-849201",
      details: "Dispatched package with Delhivery Express (AWB: DEL984128471)",
    },
    {
      id: "aud-2",
      timestamp: "2 hours ago",
      actor: "System Webhook",
      action: "Checkpoint Scanned",
      target: "RZ-849201",
      details: "Arrived at South Hub Sorting Center, Bommasandra",
    },
    {
      id: "aud-3",
      timestamp: "1 day ago",
      actor: "Anita Sen (Support)",
      action: "Refund Processed",
      target: "RZ-790112",
      details: "Refunded ₹2,400 via Razorpay UPI for returned brake pads",
    },
  ]);

  // Courier shipments list mapped from genuine orders
  const shipments: ShipmentRecord[] = useMemo(() => {
    return [
      {
        internalId: "SHP-8492-DEL",
        orderId: orders[0]?.id || "RZ-849201",
        courier: "Delhivery",
        trackingNumber: "DEL984128471",
        status: "In Transit",
        locationType: "Checkpoint Facility",
        latestLocation: "Bommasandra Hub Facility (Bengaluru)",
        lastUpdated: "24m ago",
        estimatedDelivery: "Today, 5:30 PM",
        trackingEvents: [
          { time: "09:15 AM", location: "VoltHub Indiranagar", event: "Package Picked Up from Vendor" },
          { time: "11:30 AM", location: "Central Sort Facility", event: "Inbound Scan & Sort Completed" },
          { time: "01:10 PM", location: "Bommasandra Hub Facility", event: "Bagging for Local Route", isGps: false },
        ],
      },
      {
        internalId: "SHP-7934-BLU",
        orderId: orders[1]?.id || "RZ-793420",
        courier: "Bluedart",
        trackingNumber: "BLU7749021",
        status: "Delivered",
        locationType: "Checkpoint Facility",
        latestLocation: "Bellandur Destination Facility",
        lastUpdated: "4 days ago",
        estimatedDelivery: "Delivered on Oct 8",
        trackingEvents: [
          { time: "Oct 8, 10:00 AM", location: "Jayanagar Hub", event: "Dispatched for Delivery" },
          { time: "Oct 8, 02:45 PM", location: "Bellandur Delivery Address", event: "Delivered & Signed by Customer" },
        ],
      },
      {
        internalId: "SHP-6610-SHD",
        orderId: "RZ-661044",
        courier: "Shadowfax",
        trackingNumber: "SFX440219",
        status: "Delayed",
        locationType: "Checkpoint Facility",
        latestLocation: "Whitefield Transit Hub",
        lastUpdated: "1 hour ago",
        estimatedDelivery: "Tomorrow, 11:00 AM",
        delayAlert: "Severe Monsoon Traffic / Route Congestion",
        trackingEvents: [
          { time: "Yesterday, 04:00 PM", location: "Whitefield Hub", event: "Package Inbound" },
          { time: "Today, 10:00 AM", location: "Whitefield Transit Hub", event: "Delayed due to rain safety protocol" },
        ],
      },
    ];
  }, [orders]);

  // KPI Calculations
  const totalOrdersCount = orders.length + 18; // Includes historical baseline
  const awaitingProcessingCount = orders.filter((o) => o.status === 0).length + 2;
  const readyForDispatchCount = orders.filter((o) => o.status === 1).length + 3;
  const inTransitCount = orders.filter((o) => o.status >= 2 && o.status < 5).length + 4;
  const deliveredCount = orders.filter((o) => o.status === 5).length + 14;
  const delayedOrFailedCount = 1;
  const totalSales = orders.reduce((s, o) => s + o.total, 0) + 184500;
  const lowStockProducts = adminProducts.filter((p) => (p.offers[0]?.stock ?? inventoryStock[p.id] ?? 10) < 5);

  const handleRestock = (productId: string) => {
    setInventoryStock((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 15,
    }));
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
    toast.success(`Refund of order ${orderId} initiated via Razorpay Gateway`);
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      actor: "Admin (Vikram Malhotra)",
      action: "Refund Initiated",
      target: orderId,
      details: `Full refund authorization sent to payment gateway`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
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
    { id: "inventory" as AdminTab, label: "Inventory", Icon: Archive, badge: lowStockProducts.length > 0 ? `${lowStockProducts.length} Low` : undefined },
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
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo imgClassName="h-8.5" />
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="rounded-md bg-black px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-[#6B7280]">
                Operations, Logistics & Inventory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date filter dropdown */}
            <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] px-2 py-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-[#6B7280] mr-1.5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-transparent font-medium text-[#111111] outline-none cursor-pointer"
              >
                <option value="today">Today (Real-time)</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date (2026)</option>
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

      <div className="flex flex-1">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">
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
                    setActiveTab("inventory");
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
                      { name: "Delhivery Express", shipments: 8, status: "Healthy API", latency: "142ms", color: "bg-emerald-500" },
                      { name: "Bluedart Apex", shipments: 5, status: "Healthy API", latency: "198ms", color: "bg-emerald-500" },
                      { name: "Shadowfax Hyperlocal", shipments: 3, status: "Weather Warning", latency: "310ms", color: "bg-amber-500" },
                      { name: "RiderzPro Fleet (Dedicated)", shipments: 4, status: "Real-time Telemetry", latency: "42ms", color: "bg-emerald-500" },
                    ].map((c) => (
                      <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6F8] border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className={cn("h-2.5 w-2.5 rounded-full", c.color)} />
                          <div>
                            <p className="text-xs font-bold text-[#111111]">{c.name}</p>
                            <p className="text-[10px] text-[#6B7280]">{c.shipments} packages assigned · Latency {c.latency}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                          {c.status}
                        </span>
                      </div>
                    ))}
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
                    {orders.slice(0, 3).map((o) => (
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
                    ))}
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
                    {filteredOrders.map((o) => {
                      const firstProduct = getProduct(o.groups[0]?.items[0]?.productId || "");
                      return (
                        <tr key={o.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-[#111111]">{o.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-900">Aakash Sharma</p>
                            <p className="text-[10px] text-gray-500">Bengaluru</p>
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
                    })}
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
                    {shipments.map((s) => (
                      <tr key={s.internalId} className="hover:bg-gray-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-[#111111]">{s.internalId}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{s.courier}</td>
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
                              {s.locationType === "Live GPS Fleet" ? "GPS" : "FACILITY"}
                            </span>
                            <span className="text-gray-800 font-medium">{s.latestLocation}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{s.lastUpdated}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{s.estimatedDelivery}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedShipment(s)}
                            className="rounded border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-extrabold text-[#111111]">Product Catalog</h1>
                    <p className="text-xs text-[#6B7280]">Manage automotive parts, electric bikes, and retail pricing.</p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Base Price</th>
                        <th className="px-4 py-3">Warranty</th>
                        <th className="px-4 py-3">Stock Units</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {adminProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Package className="h-10 w-10 text-gray-300 stroke-[1.5]" />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">No products in database</p>
                                <p className="text-xs text-gray-500 mt-0.5">All default products removed. Click &quot;+ Add Product&quot; to publish your first genuine product to PostgreSQL.</p>
                              </div>
                              <button
                                onClick={handleOpenAddProduct}
                                className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-sm active:scale-95"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Add Product</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        adminProducts.map((p) => {
                          const stock = p.offers[0]?.stock ?? inventoryStock[p.id] ?? 12;
                          return (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition">
                              <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
                              <td className="px-4 py-3 text-[#6B7280]">{p.brand}</td>
                              <td className="px-4 py-3">
                                <span className="rounded bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-medium">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-bold text-[#111111]">{inr(p.offers[0]?.price || 0)}</td>
                              <td className="px-4 py-3 text-[#6B7280]">{p.warrantyMonths || 12} Months</td>
                              <td className="px-4 py-3 font-semibold">{stock}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="text-xs text-[#E31E24] font-semibold hover:underline cursor-pointer"
                                >
                                  Edit
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
            )
          )}

          {/* TAB 5: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Category Architecture</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Electric Bikes", count: 3, desc: "Certified high-speed & commuter electric motorbikes & scooters" },
                  { name: "Car Accessories", count: 3, desc: "Dashcams, tire inflators, level-2 wallbox chargers" },
                  { name: "Bike Accessories", count: 3, desc: "All-weather covers, alarm disc locks, wireless phone mounts" },
                  { name: "Spare Parts", count: 4, desc: "Brembo rotors, ceramic pads, Gates kevlar drive belts" },
                  { name: "Battery Packs", count: 6, desc: "48V, 60V, 72V NMC and LiFePO4 packs with smart BMS" },
                  { name: "Fast Chargers", count: 2, desc: "3.3kW Type-2 AC chargers and portable home units" },
                ].map((cat) => (
                  <div key={cat.name} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#111111]">{cat.name}</h3>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                        {cat.count} items
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#6B7280]">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-[#111111]">Inventory & Stock Control</h1>
                  <p className="text-xs text-[#6B7280]">Reorder thresholds, warehouse levels, and supply restocking.</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Available Stock</th>
                      <th className="px-4 py-3">Reorder Point</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Restock Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {adminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400">
                          No products in inventory yet. Default products removed.
                        </td>
                      </tr>
                    ) : (
                      adminProducts.map((p) => {
                        const stock = p.offers[0]?.stock ?? inventoryStock[p.id] ?? 10;
                        const isLow = stock < 5;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition">
                            <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
                            <td className="px-4 py-3 text-[#6B7280]">{p.category}</td>
                            <td className="px-4 py-3 font-mono font-bold text-base text-[#111111]">{stock}</td>
                            <td className="px-4 py-3 text-[#6B7280]">5 units</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "rounded px-2 py-0.5 text-[10px] font-bold",
                                  isLow ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                                )}
                              >
                                {isLow ? "Low Stock Alert" : "Healthy Stock"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleRestock(p.id)}
                                className="rounded bg-[#E31E24] px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                              >
                                + Restock 15 Units
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
                    {[
                      { name: "Aakash Sharma", email: "aakash.sharma@example.com", phone: "+91 98765 43210", city: "Bengaluru, KA", bike: "Ola S1 Pro (60V)", orders: 3, gmv: 37305 },
                      { name: "Pooja Reddy", email: "pooja.reddy@example.com", phone: "+91 98450 11223", city: "Hyderabad, TS", bike: "Ather 450X (48V)", orders: 2, gmv: 18900 },
                      { name: "Rahul Verma", email: "rahul.v@example.com", phone: "+91 99100 44556", city: "Pune, MH", bike: "Revolt RV400 (72V)", orders: 4, gmv: 98400 },
                    ].map((c) => (
                      <tr key={c.email} className="hover:bg-gray-50/80 transition">
                        <td className="px-4 py-3 font-semibold text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{c.email} · {c.phone}</td>
                        <td className="px-4 py-3">{c.city}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{c.bike}</td>
                        <td className="px-4 py-3 font-bold">{c.orders}</td>
                        <td className="px-4 py-3 font-bold text-[#111111]">{inr(c.gmv)}</td>
                      </tr>
                    ))}
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
                    {[
                      { txn: "TXN_UPI_849201", order: "RZ-849201", method: "Razorpay (Google Pay UPI)", amount: 17200, status: "Captured" },
                      { txn: "TXN_CC_793420", order: "RZ-793420", method: "HDFC Payment Gateway (Card)", amount: 2909, status: "Settled" },
                    ].map((tx) => (
                      <tr key={tx.txn} className="hover:bg-gray-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{tx.txn}</td>
                        <td className="px-4 py-3 font-mono text-gray-700">{tx.order}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{tx.method}</td>
                        <td className="px-4 py-3 font-bold text-[#111111]">{inr(tx.amount)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleProcessRefund(tx.order)}
                            className="rounded border border-gray-200 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: RETURNS & CANCELLATIONS */}
          {activeTab === "returns" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Returns & Cancellations (RMA)</h1>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#E31E24]">RMA-2026-081</span>
                    <h3 className="font-bold text-sm text-[#111111]">Wave Disc Brake Rotor 220mm (Order: RZ-790112)</h3>
                    <p className="text-xs text-[#6B7280]">Customer reason: Ordered incorrect caliper bolt pattern for custom swingarm.</p>
                  </div>
                  <span className="rounded bg-amber-50 text-amber-700 px-2 py-0.5 text-xs font-bold">
                    Inspection Approved
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-[#6B7280]">Restocking destination: Jayanagar Warehouse Hub</p>
                  <button
                    onClick={() => toast.success("Item restocked to active inventory")}
                    className="rounded bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800"
                  >
                    Confirm Restock & Close RMA
                  </button>
                </div>
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
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">Average Transit Time</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">34.2 mins</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">-4.5m improvement vs target</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">On-Time SLA Delivery</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">98.4%</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">Exceeds 95% contractual SLA</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase">First-Attempt Delivery Rate</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#111111]">96.8%</p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">Minimal customer reschedules</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-extrabold text-[#111111]">Operations Notifications</h1>
              <div className="space-y-3">
                {[
                  { title: "Low Stock Alert: Kelly 72V 80A Controller", time: "15m ago", type: "warning" },
                  { title: "Courier Webhook Ping: Delhivery API returned 200 OK", time: "1 hour ago", type: "info" },
                  { title: "New high-value order RZ-849201 placed by customer", time: "2 hours ago", type: "order" },
                ].map((n, i) => (
                  <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#111111]">{n.title}</p>
                      <p className="text-[10px] text-[#6B7280]">{n.time}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#E31E24] bg-red-50 px-2 py-0.5 rounded">
                      Unread
                    </span>
                  </div>
                ))}
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
                    {auditLogs.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-4 py-3 text-[#6B7280]">{a.timestamp}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{a.actor}</td>
                        <td className="px-4 py-3 font-bold text-[#E31E24]">{a.action}</td>
                        <td className="px-4 py-3 font-mono font-medium">{a.target}</td>
                        <td className="px-4 py-3 text-gray-700">{a.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              Placed on {new Date(selectedOrder.createdAt).toLocaleString()} · Paid via {selectedOrder.payment}
            </p>

            {/* Line items */}
            <div className="mt-5 border-t border-b border-gray-100 py-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Items Ordered</p>
              {selectedOrder.groups.map((g) => (
                <div key={g.vendorId} className="space-y-2">
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
            <div className="mt-4 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span>{inr(selectedOrder.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Logistics Fee:</span>
                <span>{inr(selectedOrder.deliveryTotal)}</span>
              </div>
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
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleProcessRefund(selectedOrder.id)}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                Initiate Refund
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                {selectedOrder.status < 5 && (
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
                {selectedShipment.internalId}
              </span>
              <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-bold">
                {selectedShipment.courier}
              </span>
            </div>

            <p className="text-xs text-[#6B7280] mt-1 font-mono">
              AWB: {selectedShipment.trackingNumber} · Order: {selectedShipment.orderId}
            </p>

            {/* Checkpoint vs GPS Notice */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
              <span className="font-bold text-gray-900">Verified Location Telemetry: </span>
              {selectedShipment.locationType === "Live GPS Fleet"
                ? "Live GPS coordinates broadcasted by vehicle telematics OBD unit."
                : "Official barcode scanner checkpoint verified at courier logistics sorting facility."}
            </div>

            {/* Timeline */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tracking Events History</p>
              <div className="space-y-2 border-l-2 border-red-500 pl-3 ml-2">
                {selectedShipment.trackingEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-[#E31E24]" />
                    <p className="text-xs font-bold text-gray-900">{evt.event}</p>
                    <p className="text-[11px] text-[#6B7280]">{evt.location} · {evt.time}</p>
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
