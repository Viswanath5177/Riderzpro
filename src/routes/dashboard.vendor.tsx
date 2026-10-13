import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Boxes,
  LayoutGrid,
  ShoppingBag,
  Star,
  Wallet,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Info,
  Clock,
  Truck,
  Plus,
  Eye,
  Pause,
  Play,
  Edit3,
  RefreshCw,
  AlertTriangle,
  IndianRupee,
  Store,
  ExternalLink,
  Settings,
  MessageSquare,
  Package,
  CheckCircle2,
  Sliders,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  FileText,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill, type Section } from "@/components/site/DashboardShell";
import { AreaTrend, Bars, series } from "@/components/site/Charts";
import {
  inr,
  type Product,
  type Vendor,
  type VendorOffer,
  type VendorReview,
  type VendorSettlement,
  mapDbProductToProduct,
} from "@/lib/data";
import { ProductFormPage } from "@/components/vendor/ProductFormPage";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/vendor")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login", search: { redirect: "/dashboard/vendor" } });
    if (role === "customer") throw redirect({ to: "/dashboard/customer" });
  },
  head: () => ({
    meta: [
      { title: "Vendor Portal & Operations — RiderzPro" },
      { name: "description", content: "Manage shop listings, inventory, multi-vendor orders, customer reviews, and payouts." },
      { property: "og:title", content: "Vendor Portal & Operations — RiderzPro" },
      { property: "og:description", content: "Vendor shop management and order fulfillment on RiderzPro marketplace." },
    ],
  }),
  component: VendorDashboard,
});

const vendorSections: Section[] = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "shop", label: "My Shop", Icon: Store },
  { id: "listings", label: "Product Listings", Icon: Boxes },
  { id: "inventory", label: "Inventory", Icon: Package },
  { id: "orders", label: "Incoming Orders", Icon: ShoppingBag },
  { id: "shipments", label: "Shipments & Tracking", Icon: Truck },
  { id: "reviews", label: "Customer Reviews", Icon: MessageSquare },
  { id: "settlements", label: "Payments & Settlements", Icon: Wallet },
  { id: "settings", label: "Shop Settings", Icon: Settings },
];

export function VendorDashboard() {
  const { orders, updateOrderStatus } = useStore();

  // Current logged in user & verification status
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
    sellerStatus?: string;
    storeName?: string;
    city?: string;
    state?: string;
    gstin?: string;
  } | null>(null);

  interface DbVendorData {
    id: string;
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    businessType?: string;
    city: string;
    state?: string;
    pincode?: string;
    address?: string;
    gstin?: string;
    status: string;
    created_at?: string;
    bankAccount?: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      isVerified?: boolean;
    } | null;
    documents?: any[];
  }

  interface DbVendorMetrics {
    totalGrossSales: number;
    activeListings: number;
    pendingOrders: number;
    inPreparation: number;
    outForDelivery: number;
    deliveredOrders: number;
    unitsInStock: number;
    rating: number;
    reviewCount: number;
  }

  const [dbVendor, setDbVendor] = useState<DbVendorData | null>(null);
  const [dbMetrics, setDbMetrics] = useState<DbVendorMetrics>({
    totalGrossSales: 0,
    activeListings: 0,
    pendingOrders: 0,
    inPreparation: 0,
    outForDelivery: 0,
    deliveredOrders: 0,
    unitsInStock: 0,
    rating: 0,
    reviewCount: 0,
  });

  // Profile update form state
  const [profileForm, setProfileForm] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setCurrentUser(u as any);
    });
  }, []);

  const [tab, setTab] = useState<string>("overview");

  // Dynamic Products State from DB
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [inventoryViewMode, setInventoryViewMode] = useState<"list" | "form" | "add_offer">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [vendorOffersMap, setVendorOffersMap] = useState<Record<string, VendorOffer>>({});

  // Orders for this specific vendor (Strictly real orders from DB, defaults to empty)
  interface VendorOrderItem {
    orderId: string;
    productName: string;
    productId: string;
    qty: number;
    price: number;
    customerName: string;
    customerPhone: string;
    address: string;
    createdAt: string;
    status: "New" | "Preparing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
    awbNumber?: string;
    courier?: string;
  }

  const [vendorOrders, setVendorOrders] = useState<VendorOrderItem[]>([]);

  // Fetch live dashboard & vendor profile from DB
  const fetchVendorDashboard = () => {
    fetch("/api/vendor/dashboard")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.vendor) {
            setDbVendor(res.data.vendor);
            setProfileForm({
              storeName: res.data.vendor.storeName || "",
              ownerName: res.data.vendor.ownerName || "",
              phone: res.data.vendor.phone || "",
              address: res.data.vendor.address || "",
              city: res.data.vendor.city || "",
              state: res.data.vendor.state || "",
              pincode: res.data.vendor.pincode || "",
              gstin: res.data.vendor.gstin || "",
              accountHolderName: res.data.vendor.bankAccount?.accountHolderName || res.data.vendor.ownerName || "",
              bankName: res.data.vendor.bankAccount?.bankName || "",
              accountNumber: res.data.vendor.bankAccount?.accountNumber || "",
              ifscCode: res.data.vendor.bankAccount?.ifscCode || "",
            });
          }
          if (res.data.metrics) {
            setDbMetrics(res.data.metrics);
          }
          if (Array.isArray(res.data.orders)) {
            const mappedOrders: VendorOrderItem[] = res.data.orders.map((o: any) => ({
              orderId: o.order_number || o.id,
              productName: o.product_name || o.name || "EV Spare Part",
              productId: o.product_id || o.id,
              qty: Number(o.quantity) || 1,
              price: Number(o.total_amount) || 0,
              customerName: o.customer_name || "Customer",
              customerPhone: o.customer_phone || "+91 98765 43210",
              address: o.delivery_address || "Customer Address",
              createdAt: o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recently",
              status:
                o.status === "pending"
                  ? "New"
                  : o.status === "processing"
                  ? "Preparing"
                  : o.status === "shipped"
                  ? "Shipped"
                  : o.status === "delivered"
                  ? "Delivered"
                  : "Cancelled",
            }));
            setVendorOrders(mappedOrders);
          }
        }
      })
      .catch((err) => {
        console.log("[DB vendor dashboard notice]:", err.message);
      });
  };

  useEffect(() => {
    fetchVendorDashboard();
  }, []);

  // Save profile updates to database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: dbVendor?.id || currentUser?.id,
          ...profileForm,
        }),
      });
      const data = await res.json();
      if (data.success && data.vendor) {
        setDbVendor((prev) => ({
          ...(prev || {}),
          ...data.vendor,
        }));
        toast.success("Store details and settlement accounts updated successfully in database!");
      } else {
        toast.error(data.error || "Failed to update store details");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Fetch updated catalog from DB
  const fetchProductsFromDb = () => {
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const dbProducts = res.data.map((row: any) => mapDbProductToProduct(row));
          setAllProducts(dbProducts);
        }
      })
      .catch((err) => {
        console.log("[DB fetch notice vendor]:", err.message);
      });
  };

  useEffect(() => {
    fetchProductsFromDb();
  }, []);

  const currentVendor = useMemo(() => {
    return {
      id: dbVendor?.id || currentUser?.id || "seller_01",
      name: dbVendor?.storeName || currentUser?.storeName || currentUser?.fullName || "My Store",
      ownerName: dbVendor?.ownerName || currentUser?.fullName || "Store Owner",
      area: dbVendor?.city || currentUser?.city || "",
      city: dbVendor?.city || currentUser?.city || "",
      state: dbVendor?.state || currentUser?.state || "",
      address: dbVendor?.address || (dbVendor?.city ? `${dbVendor.city}, ${dbVendor.state || ""}` : ""),
      phone: dbVendor?.phone || currentUser?.phone || "",
      email: dbVendor?.email || currentUser?.email || "",
      gstin: dbVendor?.gstin || currentUser?.gstin || "Unregistered",
      businessType: dbVendor?.businessType || "Proprietorship",
      bankAccount: dbVendor?.bankAccount || null,
      description: "Authorized automotive and spare parts supplier with verified OEM parts and rapid dispatch.",
      businessHours: "Mon - Sat: 9:00 AM - 8:30 PM",
      shippingPolicy: "Dispatch within 24-48 hours.",
      returnPolicy: "7-day replacement warranty for manufacturing defects.",
      verificationBadge: (dbVendor?.status || currentUser?.sellerStatus) === "APPROVED" ? "Official Marketplace Partner" : "Under Review",
      rating: dbMetrics.rating,
      reviewCount: dbMetrics.reviewCount,
      commissionRate: 0.1,
      deliveryCoverage: dbVendor?.city ? `${dbVendor.city} and nearby operational zones` : "Operational zones",
    };
  }, [dbVendor, currentUser, dbMetrics]);

  const sellerStatus = dbVendor?.status || currentUser?.sellerStatus || "PENDING_REVIEW";
  const isApproved = sellerStatus === "APPROVED";

  // Filter products that this vendor created or has an offer for
  const vendorProducts = useMemo(() => {
    const vId = currentVendor.id;
    const vEmail = currentVendor.email;
    return allProducts.filter(
      (p: any) =>
        (p.sellerId && p.sellerId === vId) ||
        (p.sellerEmail && p.sellerEmail === vEmail) ||
        (p.offers && p.offers.some((o: any) => o.vendorId === vId)) ||
        vendorOffersMap[p.id]
    );
  }, [allProducts, currentVendor, vendorOffersMap]);

  // Order status progression
  const updateOrderState = (orderId: string, nextStatus: VendorOrderItem["status"]) => {
    setVendorOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updated = { ...o, status: nextStatus };
          if (nextStatus === "Shipped" && !updated.awbNumber) {
            updated.courier = "Delhivery Surface";
            updated.awbNumber = `DEL-${Math.floor(100000000 + Math.random() * 900000000)}`;
          }
          return updated;
        }
        return o;
      })
    );
    toast.success(`Order ${orderId} updated to ${nextStatus}`);
  };

  const handleOpenAdd = () => {
    if (!isApproved) {
      toast.error("Product Listing Locked", {
        description: "Your seller KYC verification is currently under review. Product creation unlocks once approved.",
      });
      return;
    }
    setEditingProduct(null);
    setInventoryViewMode("form");
  };

  const handleOpenEdit = (p: Product) => {
    if (!isApproved) {
      toast.error("Product Modification Locked", {
        description: "Your seller KYC verification is currently under review.",
      });
      return;
    }
    setEditingProduct(p);
    setInventoryViewMode("form");
  };

  // Inventory Stock & Price adjuster
  const handleUpdateOffer = (productId: string, newPrice: number, newStock: number) => {
    setVendorOffersMap((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          vendorId: currentVendor.id,
          price: newPrice,
          stock: newStock,
          condition: "new",
          warrantyTerms: "12 Months Official Warranty",
          dispatchHours: 24,
          deliveryDays: "2-3 days",
          status: "active",
        }),
        price: newPrice,
        stock: newStock,
      },
    }));
    toast.success("Offer pricing and stock updated successfully!");
  };

  const handleToggleOfferStatus = (productId: string) => {
    setVendorOffersMap((prev) => {
      const curr = prev[productId];
      const nextStatus = curr?.status === "paused" ? "active" : "paused";
      toast.info(`Offer ${nextStatus === "active" ? "reactivated" : "paused"}`);
      return {
        ...prev,
        [productId]: {
          ...(curr || {
            vendorId: currentVendor.id,
            price: 5000,
            stock: 10,
          }),
          status: nextStatus,
        },
      };
    });
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    setVendorOffersMap((prev) => {
      const curr = prev[productId] || { vendorId: currentVendor.id, price: 5000, stock: 10 };
      const newStock = Math.max(0, (curr.stock || 0) + delta);
      toast.success(`Stock updated: ${newStock} units`);
      return {
        ...prev,
        [productId]: { ...curr, stock: newStock },
      };
    });
  };

  // Quick Add Offer state
  const [selectedCanonicalId, setSelectedCanonicalId] = useState<string>("");
  const [offerPriceInput, setOfferPriceInput] = useState<number>(3499);
  const [offerStockInput, setOfferStockInput] = useState<number>(15);
  const [offerWarrantyInput, setOfferWarrantyInput] = useState<string>("12 Months Manufacturer Warranty");
  const [offerDispatchInput, setOfferDispatchInput] = useState<number>(24);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCanonicalId) {
      toast.error("Please select a canonical product from catalog");
      return;
    }
    const prod = allProducts.find((p) => p.id === selectedCanonicalId);
    if (!prod) return;

    setVendorOffersMap((prev) => ({
      ...prev,
      [prod.id]: {
        vendorId: currentVendor.id,
        price: offerPriceInput,
        stock: offerStockInput,
        mrp: prod.mrp || Math.round(offerPriceInput * 1.2),
        condition: "new",
        warrantyTerms: offerWarrantyInput,
        dispatchHours: offerDispatchInput,
        deliveryDays: "2-3 days",
        status: "active",
      },
    }));
    toast.success(`New offer for ${prod.name} published to marketplace!`);
    setInventoryViewMode("list");
  };

  // Vendor KYC Status Banner Component
  const renderStatusBanner = () => {
    if (isApproved) {
      return (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">Verified Marketplace Vendor</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">KYC documents and bank account approved. You can add and publish parts catalog.</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Approved
          </span>
        </div>
      );
    }

    if (sellerStatus === "REJECTED") {
      return (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 sm:p-5 flex items-start gap-3.5 mb-6 shadow-sm">
          <div className="rounded-xl bg-red-500/20 p-2 text-red-600 dark:text-red-400 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-red-950 dark:text-red-200">Onboarding Application Not Approved</h3>
              <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-red-700 dark:text-red-300 uppercase">
                Rejected
              </span>
            </div>
            <p className="mt-1 text-xs text-red-800 dark:text-red-300 leading-relaxed">
              Your vendor application does not meet the marketplace criteria. An email has been sent to your registered address with compliance feedback.
            </p>
          </div>
        </div>
      );
    }

    if (sellerStatus === "MORE_INFORMATION_REQUIRED") {
      return (
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 sm:p-5 flex items-start gap-3.5 mb-6 shadow-sm">
          <div className="rounded-xl bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">Action Required: Additional Verification Details</h3>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 uppercase">
                More Info Needed
              </span>
            </div>
            <p className="mt-1 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Our compliance team requested updated or clearer copies of your business KYC documents. Please check your email for exact instructions.
            </p>
          </div>
        </div>
      );
    }

    // Default: PENDING_REVIEW / UNDER_REVIEW
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 mb-6 shadow-sm">
        <div className="rounded-xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400 shrink-0">
          <Clock className="h-5 w-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">KYC Verification Under Review</h3>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase">
              Pending Review
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Your vendor application and uploaded documents (PAN, Aadhaar front photo with address, GSTIN, and Bank payout details) are being reviewed by the Riderzpro operations team. Catalog publishing will unlock immediately upon approval.
          </p>
        </div>
      </div>
    );
  };


  // Reviews and Settlements for current vendor (Strictly real data, default empty)
  const vendorReviews: VendorReview[] = useMemo(() => [], []);
  const vendorSettlements: VendorSettlement[] = useMemo(() => [], []);

  // Overall metrics strictly from database
  const activeOffersCount = dbMetrics.activeListings || Object.values(vendorOffersMap).filter((o) => o.status !== "paused").length || vendorProducts.length;
  const totalStockUnits = dbMetrics.unitsInStock || Object.values(vendorOffersMap).reduce((s, o) => s + (o.stock || 0), 0);
  const pendingOrdersCount = dbMetrics.pendingOrders || vendorOrders.filter((o) => o.status === "New").length;
  const preparingOrdersCount = dbMetrics.inPreparation || vendorOrders.filter((o) => o.status === "Preparing" || o.status === "Packed").length;
  const shippedOrdersCount = dbMetrics.outForDelivery || vendorOrders.filter((o) => o.status === "Shipped").length;
  const deliveredOrdersCount = dbMetrics.deliveredOrders || vendorOrders.filter((o) => o.status === "Delivered").length;
  const totalGrossSales = dbMetrics.totalGrossSales || vendorOrders.reduce((s, o) => s + o.price * o.qty, 0);

  return (
    <DashboardShell
      title={currentVendor.name}
      subtitle={`Authorized Seller Portal · ${currentVendor.city || "Operational Hub"}${currentVendor.state ? `, ${currentVendor.state}` : ""}`}
      sections={vendorSections}
      active={tab}
      onSelect={(id) => {
        setTab(id);
        setInventoryViewMode("list");
      }}
      userProfile={{
        name: currentVendor.ownerName || currentVendor.name,
        email: currentVendor.email,
      }}
    >
      {/* Mandatory Store Location & Profile Verification Alert Banner */}
      <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white font-bold shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              Action Required: Verify & Update Store Location & Details
              <span className="rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase">Mandatory</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Your registered store location is currently set to <strong className="text-foreground">{currentVendor.city || "Not Provided"} ({currentVendor.state || "Not Provided"})</strong>. Please verify your exact store address, city, contact phone, and payout bank account. Keeping this updated ensures proper rider dispatch and timely weekly payouts.
            </p>
          </div>
        </div>
        <button
          onClick={() => setTab("settings")}
          className="shrink-0 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Settings className="h-4 w-4" />
          <span>Update Store Details</span>
        </button>
      </div>

      {/* Incoming Orders Notification for Seller */}
      {vendorOrders.length > 0 && (
        <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-4 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                🔔 You have {vendorOrders.length} incoming order(s) received!
              </p>
              <p className="text-[11px] text-muted-foreground">
                Latest: #{vendorOrders[0].orderId} for {inr(vendorOrders[0].price)} from {vendorOrders[0].customerName} ({vendorOrders[0].address})
              </p>
            </div>
          </div>
          <button
            onClick={() => setTab("orders")}
            className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            Review Orders →
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. OVERVIEW TAB
         ───────────────────────────────────────────────────────────── */}
      {renderStatusBanner()}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Vendor verified partner status banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-2xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{currentVendor.name}</h3>
                  <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[11px] font-bold">
                    {currentVendor.verificationBadge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  GSTIN: {currentVendor.gstin} · Commission Rate: {Math.round((currentVendor.commissionRate || 0.1) * 100)}% · Service Coverage: {currentVendor.deliveryCoverage}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTab("listings");
                setInventoryViewMode("add_offer");
              }}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-95 transition cursor-pointer"
            >
              + Create Product Offer
            </button>
          </div>

          {/* Real Metrics Stats from Database */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat
              label="Total Gross Sales"
              value={inr(totalGrossSales)}
              delta={totalGrossSales > 0 ? "From live DB orders" : undefined}
              Icon={IndianRupee}
            />
            <Stat label="Active Listings" value={`${activeOffersCount}`} Icon={Boxes} />
            <Stat
              label="Pending Orders"
              value={`${pendingOrdersCount}`}
              delta={pendingOrdersCount > 0 ? "Requires action" : "All clear"}
              Icon={ShoppingBag}
            />
            <Stat
              label="Shop Rating"
              value={dbMetrics.reviewCount > 0 ? `${currentVendor.rating} ★ (${dbMetrics.reviewCount})` : "No ratings yet"}
              Icon={Star}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Units in Stock" value={`${totalStockUnits} pcs`} Icon={Package} />
            <Stat label="In Preparation" value={`${preparingOrdersCount}`} Icon={Clock} />
            <Stat label="Out for Delivery" value={`${shippedOrdersCount}`} Icon={Truck} />
            <Stat
              label="Delivered Orders"
              value={`${deliveredOrdersCount}`}
              delta={deliveredOrdersCount > 0 ? "100% on-time" : undefined}
              Icon={CheckCircle2}
            />
          </div>

          {/* Charts & Incoming Orders */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Weekly Sales Trend (₹)">
              {totalGrossSales > 0 ? (
                <AreaTrend data={series([0, 0, 0, Math.round(totalGrossSales * 0.3), Math.round(totalGrossSales * 0.5), Math.round(totalGrossSales * 0.8), totalGrossSales])} />
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No sales revenue recorded in database yet
                </div>
              )}
            </Panel>

            <Panel
              title="Urgent Incoming Orders"
              action={
                <button onClick={() => setTab("orders")} className="text-xs font-bold text-primary hover:underline">
                  View All ({vendorOrders.length})
                </button>
              }
            >
              {vendorOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No incoming orders found in database
                </div>
              ) : (
                <div className="space-y-3">
                  {vendorOrders.slice(0, 3).map((ord) => (
                    <div key={ord.orderId} className="rounded-xl border border-border p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold">{ord.orderId}</span>
                        <StatusPill s={ord.status} />
                      </div>
                      <p className="text-xs font-semibold truncate">{ord.productName}</p>
                      <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                        <span>{ord.qty} unit(s) · {inr(ord.price * ord.qty)}</span>
                        <span>{ord.createdAt}</span>
                      </div>
                      {ord.status === "New" && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => updateOrderState(ord.orderId, "Preparing")}
                            className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => updateOrderState(ord.orderId, "Cancelled")}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          {/* Top Selling Products */}
          <Panel title="Top Products by Unit Volume">
            {vendorProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Boxes className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No product catalog data found for this seller in database
              </div>
            ) : (
              <Bars
                data={vendorProducts.slice(0, 6).map((p) => ({
                  name: p.name.split(" ").slice(0, 3).join(" "),
                  value: Number(p.offers?.[0]?.stock) || 0,
                }))}
              />
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MY SHOP PROFILE TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "shop" && (
        <div className="space-y-6">
          <Panel
            title="Marketplace Public Store Profile"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab("settings")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-3.5 py-2 text-xs font-bold hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Store Details</span>
                </button>
                <Link
                  to="/vendor/$id"
                  params={{ id: currentVendor.id }}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                >
                  <span>View Live Shopfront</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Shop Trading Name</label>
                  <p className="mt-1 text-base font-bold text-foreground">{currentVendor.name}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Registered Store Owner</label>
                  <p className="mt-1 text-sm font-semibold text-foreground">{currentVendor.ownerName || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">GSTIN Registration</label>
                    <p className="mt-1 font-mono text-xs font-bold">{currentVendor.gstin || "Unregistered"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Business Entity Type</label>
                    <p className="mt-1 text-xs font-bold text-foreground">{currentVendor.businessType || "Proprietorship"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Store Address & Operational Location</label>
                  <p className="mt-1 text-sm text-foreground flex items-start gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {currentVendor.address ? `${currentVendor.address}, ` : ""}{currentVendor.city || "City pending"}{currentVendor.state ? `, ${currentVendor.state}` : ""} {dbVendor?.pincode ? `- ${dbVendor.pincode}` : ""}
                    </span>
                  </p>
                </div>

                {/* Bank Payout & Settlement Box */}
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-primary" /> Bank Settlement Account (Direct NEFT/RTGS)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Account Holder:</span>
                      <strong className="text-foreground">{currentVendor.bankAccount?.accountHolderName || currentVendor.ownerName || "Not configured"}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Bank Name:</span>
                      <strong className="text-foreground">{currentVendor.bankAccount?.bankName || "Not configured"}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Account Number:</span>
                      <strong className="font-mono text-foreground">
                        {currentVendor.bankAccount?.accountNumber ? `•••• ${currentVendor.bankAccount.accountNumber.slice(-4)}` : "Not configured"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">IFSC Code:</span>
                      <strong className="font-mono text-emerald-600">{currentVendor.bankAccount?.ifscCode || "Not configured"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="text-sm font-bold">Operational Logistics & Hours</h3>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Delivery Coverage Area</label>
                  <p className="mt-1 text-xs font-semibold text-foreground">{currentVendor.deliveryCoverage}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Business Operating Hours</label>
                  <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {currentVendor.businessHours}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Official Phone</label>
                    <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {currentVendor.phone || "Not configured"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Official Email</label>
                    <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {currentVendor.email || "Not configured"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Shipping & Return Guarantee</label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentVendor.shippingPolicy} · {currentVendor.returnPolicy}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. PRODUCT LISTINGS & OFFERS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "listings" && (
        inventoryViewMode === "add_offer" ? (
          /* Add Offer to Canonical Product Modal/View */
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold font-display">Add Offer to Canonical Marketplace Product</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select an existing canonical product from RiderzPro's master automotive catalog and publish your competitive shop offer.
                </p>
              </div>
              <button
                onClick={() => setInventoryViewMode("list")}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                  1. Select Canonical Product
                </label>
                <select
                  value={selectedCanonicalId}
                  onChange={(e) => setSelectedCanonicalId(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm font-medium focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">-- Choose from Master Automotive Catalog --</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand} · {p.category}) - Baseline: {inr(p.offers[0]?.price || 5000)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    2. Your Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={offerPriceInput}
                    onChange={(e) => setOfferPriceInput(Number(e.target.value))}
                    min={1}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Must be competitive compared to other marketplace sellers.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    3. Units in Stock
                  </label>
                  <input
                    type="number"
                    value={offerStockInput}
                    onChange={(e) => setOfferStockInput(Number(e.target.value))}
                    min={1}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm font-semibold focus:border-primary focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Real inventory physically ready in your shop.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    4. Warranty & Guarantee Terms
                  </label>
                  <input
                    type="text"
                    value={offerWarrantyInput}
                    onChange={(e) => setOfferWarrantyInput(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    5. Dispatch Time Window (Hours)
                  </label>
                  <select
                    value={offerDispatchInput}
                    onChange={(e) => setOfferDispatchInput(Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value={2}>Express (Under 2 hours)</option>
                    <option value={12}>Same day (12 hours)</option>
                    <option value={24}>Next day (24 hours)</option>
                    <option value={48}>Within 48 hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-90"
                >
                  Publish Offer to Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => setInventoryViewMode("form")}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
                >
                  Can't find product? Submit New Canonical Item
                </button>
              </div>
            </form>
          </div>
        ) : inventoryViewMode === "form" ? (
          /* Full Page Product Form for submitting new canonical product */
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <ProductFormPage
              product={editingProduct}
              onCancel={() => setInventoryViewMode("list")}
              onSuccess={() => {
                fetchProductsFromDb();
                setInventoryViewMode("list");
              }}
            />
          </div>
        ) : (
          /* Standard Table of Active Offers */
          <Panel
            title={`Active Product Offers (${vendorProducts.length})`}
            action={
              <div className="flex gap-2">
                <button
                  onClick={() => setInventoryViewMode("add_offer")}
                  className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-90 transition cursor-pointer"
                >
                  + Add Offer to Product
                </button>
                <button
                  onClick={() => {
                    if (!isApproved) {
                      toast.error("Product Listing Locked", {
                        description: "Your seller KYC verification is currently under review. Product creation unlocks once approved.",
                      });
                      return;
                    }
                    setEditingProduct(null);
                    setInventoryViewMode("form");
                  }}
                  className={cn(
                    "rounded-xl border border-border px-3.5 py-2 text-xs font-semibold transition cursor-pointer",
                    isApproved
                      ? "bg-muted/40 hover:bg-muted"
                      : "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                  )}
                  title={!isApproved ? "Account pending compliance review" : "New product submission"}
                >
                  + New Product Submission {!isApproved && "(Locked)"}
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  <tr>
                    <th className="py-2.5">Product</th>
                    <th>Category</th>
                    <th>Your Offer</th>
                    <th>Stock</th>
                    <th>Warranty</th>
                    <th>Dispatch</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendorProducts.map((p) => {
                    const fallbackPrice = p.offers.length > 0 ? p.offers[0].price : (p.mrp || 0);
                    const fallbackStock = p.offers.length > 0 ? p.offers[0].stock : 0;
                    const off = vendorOffersMap[p.id] || p.offers.find((o) => o.vendorId === currentVendor.id) || p.offers[0] || {
                      price: fallbackPrice,
                      stock: fallbackStock,
                      status: "active",
                      warrantyTerms: `${p.warrantyMonths || 12} Months Warranty`,
                    };
                    const isPaused = off.status === "paused";

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="flex items-center gap-3 py-3.5">
                          <img
                            src={p.image}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div>
                            <span className="font-semibold block leading-tight">{p.name}</span>
                            <span className="text-xs text-muted-foreground">{p.brand}</span>
                          </div>
                        </td>

                        <td>
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                            {p.category}
                          </span>
                        </td>

                        <td className="font-bold text-foreground">
                          {inr(off.price)}
                        </td>

                        <td>
                          {off.stock < 5 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Low · {off.stock} left
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">{off.stock} units</span>
                          )}
                        </td>

                        <td className="text-xs text-muted-foreground max-w-[140px] truncate">
                          {off.warrantyTerms || "Standard Warranty"}
                        </td>

                        <td className="text-xs text-muted-foreground">
                          {off.dispatchHours ? `~${off.dispatchHours} hrs` : "24 hrs"}
                        </td>

                        <td>
                          {isPaused ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              <Pause className="h-3 w-3" /> Paused
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </span>
                          )}
                        </td>

                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleOfferStatus(p.id)}
                              title={isPaused ? "Resume Offer" : "Pause Offer"}
                              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-600" /> : <Pause className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                const newP = prompt("Enter new selling price in INR:", String(off.price));
                                const newS = prompt("Enter available stock units:", String(off.stock));
                                if (newP && newS) {
                                  handleUpdateOffer(p.id, Number(newP), Number(newS));
                                }
                              }}
                              className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
                            >
                              Edit Price
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        )
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. INVENTORY MANAGEMENT TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "inventory" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Total Stock Units" value={`${totalStockUnits} pcs`} Icon={Package} />
            <Stat label="Healthy Stock Items" value={`${vendorProducts.filter((p) => (vendorOffersMap[p.id]?.stock || 0) >= 5).length}`} Icon={CheckCircle2} />
            <Stat label="Low Stock Warning" value={`${vendorProducts.filter((p) => (vendorOffersMap[p.id]?.stock || 0) < 5 && (vendorOffersMap[p.id]?.stock || 0) > 0).length}`} Icon={AlertTriangle} />
            <Stat label="Out of Stock Items" value={`${vendorProducts.filter((p) => (vendorOffersMap[p.id]?.stock || 0) === 0).length}`} Icon={X} />
          </div>

          <Panel title="Stock Allocation & Instant Adjuster">
            {vendorProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No inventory stock items configured for this seller yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                    <tr>
                      <th className="py-2.5">Product SKU</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Stock Health</th>
                      <th>Quick Adjust Stock</th>
                      <th className="text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vendorProducts.map((p) => {
                      const fallbackPrice = p.offers.length > 0 ? p.offers[0].price : (p.mrp || 0);
                      const fallbackStock = p.offers.length > 0 ? p.offers[0].stock : 0;
                      const off = vendorOffersMap[p.id] || p.offers[0] || { stock: fallbackStock, price: fallbackPrice };
                      const isLow = off.stock < 5 && off.stock > 0;
                      const isOut = off.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-muted/30 transition">
                          <td className="py-3 font-semibold">
                            <p className="leading-tight">{p.name}</p>
                            <span className="text-xs text-muted-foreground font-mono">{p.brand} · {p.id}</span>
                          </td>

                          <td>
                            <span className="text-xs text-muted-foreground">{p.category}</span>
                          </td>

                          <td className="font-bold text-foreground">
                            {off.stock} units
                          </td>

                          <td>
                            {isOut ? (
                              <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-bold">Out of stock</span>
                            ) : isLow ? (
                              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold">Low stock (&lt; 5)</span>
                            ) : (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold">Healthy</span>
                            )}
                          </td>

                          <td>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleAdjustStock(p.id, -1)}
                                className="h-7 w-7 rounded-lg border border-border text-xs font-bold hover:bg-muted"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleAdjustStock(p.id, 1)}
                                className="h-7 w-7 rounded-lg border border-border text-xs font-bold hover:bg-muted"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleAdjustStock(p.id, 5)}
                                className="h-7 px-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition"
                              >
                                +5 Replenish
                              </button>
                            </div>
                          </td>

                          <td className="text-right font-bold">
                            {inr(off.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ORDERS & FULFILLMENT TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "orders" && (
        <div className="space-y-6">
          <Panel title={`Orders Containing Your Items (${vendorOrders.length})`}>
            {vendorOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground">No Incoming Orders Yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  When customers purchase your listed spare parts and accessories, their order details and shipping instructions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorOrders.map((ord) => (
                  <div key={ord.orderId} className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-extrabold text-foreground">{ord.orderId}</span>
                        <span className="text-xs text-muted-foreground">{ord.createdAt}</span>
                      </div>
                      <StatusPill s={ord.status} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
                      <div>
                        <p className="font-bold text-sm text-foreground">{ord.productName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Quantity: <span className="font-bold text-foreground">{ord.qty}</span> · Price: <span className="font-bold text-foreground">{inr(ord.price)}</span> · Total: <span className="font-bold text-primary">{inr(ord.price * ord.qty)}</span>
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-bold text-foreground">Delivery Recipient:</span> {ord.customerName} ({ord.customerPhone})
                          <p className="mt-0.5">{ord.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-border sm:pl-4 pt-3 sm:pt-0">
                        {ord.awbNumber && (
                          <div className="rounded-lg bg-muted/40 p-2.5 text-xs mb-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Courier Tracking</span>
                            <span className="font-semibold text-foreground">{ord.courier}</span>
                            <span className="font-mono text-xs block text-primary font-bold">{ord.awbNumber}</span>
                          </div>
                        )}

                        {/* Step-by-Step Fulfillment Actions */}
                        <div className="space-y-2">
                          {ord.status === "New" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateOrderState(ord.orderId, "Preparing")}
                                className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                              >
                                Accept & Prepare
                              </button>
                              <button
                                onClick={() => updateOrderState(ord.orderId, "Cancelled")}
                                className="rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {ord.status === "Preparing" && (
                            <button
                              onClick={() => updateOrderState(ord.orderId, "Packed")}
                              className="w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
                            >
                              Mark Items Packed & Ready
                            </button>
                          )}

                          {ord.status === "Packed" && (
                            <button
                              onClick={() => updateOrderState(ord.orderId, "Shipped")}
                              className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90 flex items-center justify-center gap-1.5"
                            >
                              <Truck className="h-4 w-4" />
                              Request Courier Pickup
                            </button>
                          )}

                          {ord.status === "Shipped" && (
                            <div className="text-center">
                              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                                In Transit with {ord.courier}
                              </span>
                              <p className="text-[11px] text-muted-foreground mt-1">Delivery verified via courier checkpoint webhook</p>
                            </div>
                          )}

                          {ord.status === "Delivered" && (
                            <div className="text-center">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Order Completed & Delivered
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. SHIPMENTS & COURIER TRACKING TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "shipments" && (
        <div className="space-y-6">
          <Panel title="Active Courier Dispatches & Live Waybills">
            {vendorOrders.filter((o) => o.awbNumber).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Truck className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground">No Active Shipments</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Waybills and live courier dispatches will be listed here once you mark incoming orders as shipped.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                    <tr>
                      <th className="py-2.5">Waybill (AWB)</th>
                      <th>Associated Order</th>
                      <th>Logistics Partner</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th className="text-right">Item Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vendorOrders
                      .filter((o) => o.awbNumber)
                      .map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-muted/30 transition">
                          <td className="py-3 font-mono font-bold text-primary">
                            {ord.awbNumber}
                          </td>
                          <td className="font-semibold">{ord.orderId}</td>
                          <td>{ord.courier || "Delhivery"}</td>
                          <td className="text-xs text-muted-foreground max-w-[200px] truncate">{ord.address}</td>
                          <td>
                            <StatusPill s={ord.status} />
                          </td>
                          <td className="text-right font-bold">{inr(ord.price * ord.qty)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. CUSTOMER REVIEWS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "reviews" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat
              label="Average Seller Rating"
              value={dbMetrics.reviewCount > 0 ? `${currentVendor.rating} ★` : "0.0 ★"}
              Icon={Star}
            />
            <Stat
              label="Total Shop Reviews"
              value={`${dbMetrics.reviewCount || vendorReviews.length}`}
              Icon={MessageSquare}
            />
            <Stat
              label="Packaging Rating"
              value={dbMetrics.reviewCount > 0 ? `${currentVendor.rating} / 5.0` : "N/A"}
              Icon={Package}
            />
            <Stat
              label="Delivery Speed"
              value={dbMetrics.reviewCount > 0 ? "5.0 / 5.0" : "N/A"}
              Icon={Truck}
            />
          </div>

          <Panel title="Customer Reviews for Your Shop Experience">
            {vendorReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No customer reviews recorded in database yet.</p>
            ) : (
              <div className="space-y-4">
                {vendorReviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{rev.userName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      <span className="ml-1 text-xs text-muted-foreground font-semibold">({rev.rating}/5)</span>
                    </div>

                    <p className="text-sm text-foreground">{rev.comment}</p>

                    <div className="flex gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border">
                      {rev.packagingRating && <span>Packaging: <strong className="text-foreground">{rev.packagingRating}★</strong></span>}
                      {rev.deliveryRating && <span>Delivery: <strong className="text-foreground">{rev.deliveryRating}★</strong></span>}
                      {rev.communicationRating && <span>Communication: <strong className="text-foreground">{rev.communicationRating}★</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. PAYMENTS & SETTLEMENTS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "settlements" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Gross Sales Volume" value={inr(totalGrossSales)} Icon={IndianRupee} />
            <Stat label="Platform Fee (Commission)" value={inr(Math.round(totalGrossSales * (currentVendor.commissionRate || 0.1)))} Icon={Percent} />
            <Stat label="Net Payout Settled" value={inr(Math.round(totalGrossSales * (1 - (currentVendor.commissionRate || 0.1))))} Icon={Wallet} />
            <Stat label="Settlement Cycle" value="Weekly (Every Wed)" Icon={Clock} />
          </div>

          <Panel title="Vendor Settlement Ledger">
            {vendorSettlements.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Wallet className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No settlement payouts generated in database yet. Payouts are computed automatically on settlement cycle dates for fulfilled orders.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                    <tr>
                      <th className="py-2.5">Settlement Cycle</th>
                      <th>Orders</th>
                      <th>Gross Volume</th>
                      <th>Platform Fee</th>
                      <th>Net Payout</th>
                      <th>Status</th>
                      <th className="text-right">Bank UTR / Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vendorSettlements.map((st) => (
                      <tr key={st.id} className="hover:bg-muted/30 transition">
                        <td className="py-3 font-semibold">{st.period}</td>
                        <td>{st.orderCount} orders</td>
                        <td className="font-bold">{inr(st.grossSales)}</td>
                        <td className="text-muted-foreground">
                          {inr(st.commissionAmount)} ({Math.round(st.commissionRate * 100)}%)
                        </td>
                        <td className="font-extrabold text-primary">{inr(st.netPayout)}</td>
                        <td>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-bold",
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
                        <td className="text-right font-mono text-xs text-muted-foreground">
                          {st.referenceNumber || "Pending Transfer"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. SHOP SETTINGS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "settings" && (
        <div className="space-y-6">
          <Panel title="Marketplace Store Configuration & Profile">
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
              {/* Mandatory Store Location & Address Update Note */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
                <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  Mandatory Store Details & Location Setup
                </p>
                <p className="text-amber-800/90 dark:text-amber-300 mt-1 leading-relaxed">
                  Please review and confirm your operational store location ({profileForm.city || "Pending"}), street address, and bank payout details below. All saved updates persist directly to the PostgreSQL database.
                </p>
              </div>

              {/* 1. Store & Owner Identity */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                  1. Business Identity & Contact Details
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Store / Trading Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.storeName}
                      onChange={(e) => setProfileForm({ ...profileForm, storeName: e.target.value })}
                      placeholder="e.g. Vamsi Auto Spares"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Owner / Authorized Person Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.ownerName}
                      onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                      placeholder="e.g. G Naga Vamsi"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Contact Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">GSTIN Tax ID</label>
                    <input
                      type="text"
                      value={profileForm.gstin}
                      onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                      placeholder="e.g. 37AAAAA0000A1Z5 or Unregistered"
                      className="w-full h-9 rounded-xl border border-border px-3 font-mono font-semibold bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Store Location & Address */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                  2. Operational Location & Street Address
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Store Street Address *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="e.g. 3-24/2, Near Vinayaka Temple, Garagaparru"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-muted-foreground block mb-1 font-semibold">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="e.g. Bhimavaram"
                        className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block mb-1 font-semibold">State *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        placeholder="e.g. Andhra Pradesh"
                        className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block mb-1 font-semibold">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        placeholder="e.g. 534201"
                        className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Bank Account & Settlement Payouts */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                  3. Bank Account for NEFT/RTGS Order Payouts
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Account Holder Name *</label>
                    <input
                      type="text"
                      value={profileForm.accountHolderName}
                      onChange={(e) => setProfileForm({ ...profileForm, accountHolderName: e.target.value })}
                      placeholder="Name as printed on bank passbook"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Bank Name *</label>
                    <input
                      type="text"
                      value={profileForm.bankName}
                      onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                      placeholder="e.g. Indian Bank / State Bank of India / HDFC"
                      className="w-full h-9 rounded-xl border border-border px-3 font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Bank Account Number *</label>
                    <input
                      type="text"
                      value={profileForm.accountNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, accountNumber: e.target.value })}
                      placeholder="e.g. 7738293690"
                      className="w-full h-9 rounded-xl border border-border px-3 font-mono font-semibold bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">IFSC Code *</label>
                    <input
                      type="text"
                      value={profileForm.ifscCode}
                      onChange={(e) => setProfileForm({ ...profileForm, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. IDIB000V144"
                      className="w-full h-9 rounded-xl border border-border px-3 font-mono font-bold bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Operating Preferences */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                  4. Operational Preferences
                </h4>
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-muted/20">
                  <div>
                    <h5 className="font-bold text-xs">Automated Order Confirmation</h5>
                    <p className="text-[11px] text-muted-foreground">Automatically acknowledge orders for high-stock items</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary cursor-pointer" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTab("shop")}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? "Saving to Database..." : "Save Store Details to Database"}
                </button>
              </div>
            </form>
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}
