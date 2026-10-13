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
  vendors,
  products,
  getVendor,
  inr,
  getVendorReviews,
  getVendorSettlements,
  type Product,
  type Vendor,
  type VendorOffer,
  type VendorReview,
  type VendorSettlement,
  mapDbProductToProduct,
} from "@/lib/data";
import { ProductFormPage } from "@/components/vendor/ProductFormPage";
import { getCurrentRole } from "@/lib/auth";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/vendor")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login" });
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

  // Active vendor selection (allows previewing as any of the 6 verified marketplace vendors)
  const [selectedVendorId, setSelectedVendorId] = useState<string>("v1");
  const currentVendor: Vendor = useMemo(() => getVendor(selectedVendorId), [selectedVendorId]);

  const [tab, setTab] = useState<string>("overview");

  // Dynamic Products State from DB / fallback
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [inventoryViewMode, setInventoryViewMode] = useState<"list" | "form" | "add_offer">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Local state for vendor offers so mutations (toggle pause, price, stock) reflect immediately
  const [vendorOffersMap, setVendorOffersMap] = useState<Record<string, VendorOffer>>(() => {
    const map: Record<string, VendorOffer> = {};
    products.forEach((p) => {
      const off = p.offers.find((o) => o.vendorId === "v1") || p.offers[0];
      if (off) map[p.id] = { ...off };
    });
    return map;
  });

  // Re-sync offers when active vendor changes
  useEffect(() => {
    const map: Record<string, VendorOffer> = {};
    allProducts.forEach((p) => {
      const off = p.offers.find((o) => o.vendorId === selectedVendorId);
      if (off) {
        map[p.id] = { ...off };
      }
    });
    setVendorOffersMap(map);
  }, [selectedVendorId, allProducts]);

  // Fetch updated catalog from DB
  const fetchProductsFromDb = () => {
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
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

  // Filter products that this vendor has an offer for
  const vendorProducts = useMemo(() => {
    return allProducts.filter((p) => p.offers.some((o) => o.vendorId === selectedVendorId) || vendorOffersMap[p.id]);
  }, [allProducts, selectedVendorId, vendorOffersMap]);

  // Orders for this specific vendor
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

  const [vendorOrders, setVendorOrders] = useState<VendorOrderItem[]>([
    {
      orderId: "ORD-9421",
      productName: "NexWave Smart BMS 16S 60V",
      productId: "prod-3",
      qty: 1,
      price: 8499,
      customerName: "Aakash Sharma",
      customerPhone: "+91 98765 43210",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      createdAt: "15 mins ago",
      status: "New",
    },
    {
      orderId: "ORD-9388",
      productName: "VoltMaster Ultra 48V 35Ah Li-ion Battery Pack",
      productId: "prod-1",
      qty: 1,
      price: 43999,
      customerName: "Rohan Nambiar",
      customerPhone: "+91 98450 11223",
      address: "14th Main, HSR Layout Sector 4, Bengaluru 560102",
      createdAt: "2 hours ago",
      status: "Preparing",
    },
    {
      orderId: "ORD-9290",
      productName: "HyperDrive Sinewave Controller 60V-72V",
      productId: "prod-5",
      qty: 2,
      price: 9999,
      customerName: "Pooja Hegde",
      customerPhone: "+91 97410 88992",
      address: "Lavelle Road, Shanthala Nagar, Bengaluru 560001",
      createdAt: "Yesterday",
      status: "Shipped",
      courier: "Delhivery Surface",
      awbNumber: "DEL-991823481",
    },
    {
      orderId: "ORD-9102",
      productName: "ProBrembo Ceramic Sintered Disc Brake Pads",
      productId: "prod-6",
      qty: 2,
      price: 1899,
      customerName: "Sanjay Gupta",
      customerPhone: "+91 98860 33441",
      address: "7th Block, Koramangala, Bengaluru 560095",
      createdAt: "3 days ago",
      status: "Delivered",
      courier: "Bluedart Express",
      awbNumber: "BD-88231019",
    },
  ]);

  // Merge real orders placed in store by customer for this vendor
  useEffect(() => {
    if (orders.length > 0) {
      const newItems: VendorOrderItem[] = [];
      orders.forEach((o) => {
        o.groups.forEach((g) => {
          if (g.vendorId === selectedVendorId) {
            g.items.forEach((it) => {
              const p = allProducts.find((prod) => prod.id === it.productId);
              if (p) {
                newItems.push({
                  orderId: o.id,
                  productName: p.name,
                  productId: p.id,
                  qty: it.qty,
                  price: it.price,
                  customerName: o.shippingAddress?.name || "Customer",
                  customerPhone: o.shippingAddress?.phone || "+91 98765 43210",
                  address: `${o.shippingAddress?.street || ""}, ${o.shippingAddress?.city || "Bengaluru"} - ${o.shippingAddress?.pincode || "560103"}`,
                  createdAt: "Recently",
                  status: o.status === 0 ? "New" : o.status === 1 ? "Preparing" : o.status === 2 ? "Packed" : o.status < 5 ? "Shipped" : "Delivered",
                  courier: "Delhivery",
                  awbNumber: `DEL-${o.id.replace(/\D/g, "") || "881273"}`,
                });
              }
            });
          }
        });
      });
      if (newItems.length > 0) {
        setVendorOrders((prev) => {
          const existingIds = new Set(prev.map((x) => x.orderId));
          const deduped = newItems.filter((x) => !existingIds.has(x.orderId));
          return [...deduped, ...prev];
        });
      }
    }
  }, [orders, selectedVendorId, allProducts]);

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

  // Inventory Stock & Price adjuster
  const handleUpdateOffer = (productId: string, newPrice: number, newStock: number) => {
    setVendorOffersMap((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          vendorId: selectedVendorId,
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
            vendorId: selectedVendorId,
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
      const curr = prev[productId] || { vendorId: selectedVendorId, price: 5000, stock: 10 };
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
        vendorId: selectedVendorId,
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

  // Reviews and Settlements for current vendor
  const vendorReviews: VendorReview[] = useMemo(() => getVendorReviews(selectedVendorId), [selectedVendorId]);
  const vendorSettlements: VendorSettlement[] = useMemo(() => getVendorSettlements(selectedVendorId), [selectedVendorId]);

  // Overall metrics
  const activeOffersCount = Object.values(vendorOffersMap).filter((o) => o.status !== "paused").length || vendorProducts.length;
  const totalStockUnits = Object.values(vendorOffersMap).reduce((s, o) => s + (o.stock || 0), 0);
  const pendingOrdersCount = vendorOrders.filter((o) => o.status === "New").length;
  const preparingOrdersCount = vendorOrders.filter((o) => o.status === "Preparing" || o.status === "Packed").length;
  const shippedOrdersCount = vendorOrders.filter((o) => o.status === "Shipped").length;
  const deliveredOrdersCount = vendorOrders.filter((o) => o.status === "Delivered").length;
  const totalGrossSales = vendorOrders.reduce((s, o) => s + o.price * o.qty, 0) + (vendorSettlements[0]?.grossSales || 150000);

  return (
    <DashboardShell
      title={currentVendor.name}
      subtitle={`Authorized Seller Portal · ${currentVendor.area}, Bengaluru`}
      sections={vendorSections}
      active={tab}
      onSelect={(id) => {
        setTab(id);
        setInventoryViewMode("list");
      }}
      actions={
        <div className="flex items-center gap-2">
          {/* Vendor Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 shadow-2xs">
            <Store className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium">Vendor:</span>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.area})
                </option>
              ))}
            </select>
          </div>

          {/* Public Shop Profile Link */}
          <Link
            to="/vendor/$id"
            params={{ id: currentVendor.id }}
            target="_blank"
            className="flex items-center gap-1 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition"
          >
            <span className="hidden md:inline">Public Shop</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      }
    >
      {/* ─────────────────────────────────────────────────────────────
          1. OVERVIEW TAB
         ───────────────────────────────────────────────────────────── */}
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
                    {currentVendor.verificationBadge || "Verified Partner"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  GSTIN: {currentVendor.gstin || "29AABCV1234F1Z5"} · Commission Rate: {Math.round((currentVendor.commissionRate || 0.1) * 100)}% · Service Coverage: {currentVendor.deliveryCoverage || "All Bengaluru"}
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

          {/* Real Metrics Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Total Gross Sales" value={inr(totalGrossSales)} delta="+14.2% this week" Icon={IndianRupee} />
            <Stat label="Active Listings" value={`${activeOffersCount}`} Icon={Boxes} />
            <Stat label="Pending Orders" value={`${pendingOrdersCount}`} delta={pendingOrdersCount > 0 ? "Requires action" : "All clear"} Icon={ShoppingBag} />
            <Stat label="Shop Rating" value={`${currentVendor.rating} ★ (${currentVendor.reviewCount || 150}+)`} Icon={Star} />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Units in Stock" value={`${totalStockUnits} pcs`} Icon={Package} />
            <Stat label="In Preparation" value={`${preparingOrdersCount}`} Icon={Clock} />
            <Stat label="Out for Delivery" value={`${shippedOrdersCount}`} Icon={Truck} />
            <Stat label="Delivered Orders" value={`${deliveredOrdersCount}`} delta="100% on-time" Icon={CheckCircle2} />
          </div>

          {/* Charts & Incoming Orders */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Weekly Sales Trend (₹)">
              <AreaTrend data={series([34000, 52000, 48000, 69000, 61000, 84000, 41000])} />
            </Panel>

            <Panel
              title="Urgent Incoming Orders"
              action={
                <button onClick={() => setTab("orders")} className="text-xs font-bold text-primary hover:underline">
                  View All ({vendorOrders.length})
                </button>
              }
            >
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
            </Panel>
          </div>

          {/* Top Selling Products */}
          <Panel title="Top Products by Unit Volume">
            <Bars
              data={vendorProducts.slice(0, 6).map((p, idx) => ({
                name: p.name.split(" ")[0] + " " + (p.name.split(" ")[1] || ""),
                value: [42, 35, 28, 19, 14, 11][idx] || 10,
              }))}
            />
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MY SHOP PROFILE TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "shop" && (
        <div className="space-y-6">
          <Panel
            title="Public Shop Information"
            action={
              <Link
                to="/vendor/$id"
                params={{ id: currentVendor.id }}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
              >
                <span>View Live Shopfront</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Shop Trading Name</label>
                  <p className="mt-1 text-base font-bold">{currentVendor.name}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Description & Specialization</label>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {currentVendor.description || "Authorized automotive supplier with verified OEM parts and rapid dispatch."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">GSTIN Registration</label>
                    <p className="mt-1 font-mono text-xs font-bold">{currentVendor.gstin || "29AABCV1234F1Z5"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Platform Verification</label>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <ShieldCheck className="h-4 w-4" /> Official Partner
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Store Address</label>
                  <p className="mt-1 text-sm text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {currentVendor.address || "100ft Road, Indiranagar, Bengaluru 560038"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="text-sm font-bold">Operational Logistics & Hours</h3>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Delivery Coverage Area</label>
                  <p className="mt-1 text-xs font-semibold text-foreground">{currentVendor.deliveryCoverage || "Indiranagar, Koramangala, CBD (15km radius)"}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Business Operating Hours</label>
                  <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {currentVendor.businessHours || "Mon - Sat: 9:00 AM - 8:30 PM"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Official Phone</label>
                    <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {currentVendor.phone || "+91 80 4122 8900"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Official Email</label>
                    <p className="mt-1 text-xs text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {currentVendor.email || "orders@volthub.in"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Shipping & Return Guarantee</label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentVendor.shippingPolicy || "Dispatch within 1-2 hours."} · {currentVendor.returnPolicy || "7-day replacement warranty for manufacturing defects."}
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
                    setEditingProduct(null);
                    setInventoryViewMode("form");
                  }}
                  className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                >
                  + New Product Submission
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
                    const off = vendorOffersMap[p.id] || p.offers.find((o) => o.vendorId === selectedVendorId) || p.offers[0] || {
                      price: 4999,
                      stock: 10,
                      status: "active",
                      warrantyTerms: "12 Months Warranty",
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
                    const off = vendorOffersMap[p.id] || p.offers[0] || { stock: 10, price: 5000 };
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
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ORDERS & FULFILLMENT TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "orders" && (
        <div className="space-y-6">
          <Panel title={`Orders Containing Your Items (${vendorOrders.length})`}>
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
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. SHIPMENTS & COURIER TRACKING TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "shipments" && (
        <div className="space-y-6">
          <Panel title="Active Courier Dispatches & Live Waybills">
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
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. CUSTOMER REVIEWS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "reviews" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Average Seller Rating" value={`${currentVendor.rating} ★`} Icon={Star} />
            <Stat label="Total Shop Reviews" value={`${vendorReviews.length + (currentVendor.reviewCount || 100)}`} Icon={MessageSquare} />
            <Stat label="Packaging Rating" value="4.9 / 5.0" Icon={Package} />
            <Stat label="Delivery Speed" value="4.8 / 5.0" Icon={Truck} />
          </div>

          <Panel title="Customer Reviews for Your Shop Experience">
            {vendorReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No customer reviews yet.</p>
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
          </Panel>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. SHOP SETTINGS TAB
         ───────────────────────────────────────────────────────────── */}
      {tab === "settings" && (
        <div className="space-y-6">
          <Panel title="Marketplace Store Configuration">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border">
                <div>
                  <h4 className="font-bold text-sm">Automated Order Confirmation</h4>
                  <p className="text-xs text-muted-foreground">Automatically acknowledge orders for high-stock items</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-primary cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-border">
                <div>
                  <h4 className="font-bold text-sm">Store Vacation Mode</h4>
                  <p className="text-xs text-muted-foreground">Temporarily pause all product offers during inventory stock-take</p>
                </div>
                <input type="checkbox" className="h-5 w-5 accent-primary cursor-pointer" />
              </div>

              <div className="p-4 rounded-2xl border border-border space-y-3">
                <h4 className="font-bold text-sm">Bank Account for NEFT/RTGS Settlements</h4>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Account Holder Name</label>
                    <input type="text" defaultValue={currentVendor.name} className="w-full h-9 rounded-lg border border-border px-3 font-semibold" />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">IFSC Code</label>
                    <input type="text" defaultValue="HDFC0001234" className="w-full h-9 rounded-lg border border-border px-3 font-mono font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}
