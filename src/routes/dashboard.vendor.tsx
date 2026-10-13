import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AlertTriangle, Boxes, IndianRupee, LayoutGrid, PackageOpen, ShoppingBag, Star, Wallet, Check, X, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { AreaTrend, Bars, series } from "@/components/site/Charts";
import { bikes, cars, inr, products, mapDbProductToProduct, type Product } from "@/lib/data";
import { ProductFormPage } from "@/components/vendor/ProductFormPage";
import { getCurrentRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/vendor")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login" });
    throw redirect({ to: role === "admin" ? "/dashboard/admin" : "/dashboard/customer" });
  },
  head: () => ({ meta: [
    { title: "Vendor dashboard — Riderzpro" },
    { name: "description", content: "Sales, incoming orders, inventory and fitment management for EV parts sellers." },
    { property: "og:title", content: "Vendor dashboard — Riderzpro" },
    { property: "og:description", content: "Sell EV batteries and parts on Riderzpro." },
  ] }),
  component: VendorDash,
});

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "inventory", label: "Inventory", Icon: Boxes },
  { id: "payouts", label: "Payouts", Icon: Wallet },
];

function VendorDash() {
  const [tab, setTab] = useState("overview");
  
  // Dynamic Products State linked to PostgreSQL schema (No mock defaults)
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  
  // View Mode: "list" (Table) or "form" (Full Page Add/Edit View, NOT a pop-up)
  const [inventoryViewMode, setInventoryViewMode] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sync with PostgreSQL on mount & on update
  const fetchProductsFromDb = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const dbProducts: Product[] = res.data.map((row: any) => mapDbProductToProduct(row));
          setVendorProducts(dbProducts);
        }
      })
      .catch((err) => {
        console.log("[DB fetch notice vendor]:", err.message);
      });
  };

  useEffect(() => {
    fetchProductsFromDb();
  }, []);

  const [incoming, setIncoming] = useState<
    { id: string; item: string; qty: number; amount: number; bike: string; status: string }[]
  >([]);

  const act = (id: string, status: string) => { 
    setIncoming((l) => l.map((o) => (o.id === id ? { ...o, status } : o))); 
    toast.success(`Order ${id} ${status.toLowerCase()}`); 
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setInventoryViewMode("form");
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setInventoryViewMode("form");
  };

  const handleFormSuccess = (savedItem: Product) => {
    fetchProductsFromDb();
    setInventoryViewMode("list");
  };

  return (
    <DashboardShell title="VoltHub Indiranagar" subtitle="Vendor & dealership dashboard" sections={sections} active={tab} onSelect={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Revenue (7d)" value={inr(412000)} delta="+18%" Icon={IndianRupee} />
            <Stat label="Orders (7d)" value="46" delta="+9" Icon={ShoppingBag} />
            <Stat label="Rating" value="4.8" Icon={Star} />
            <Stat label="Low stock items" value="3" Icon={AlertTriangle} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Revenue this week"><AreaTrend data={series([42, 58, 49, 71, 66, 88, 38].map((x) => x * 1000))} /></Panel>
            <Panel title="New orders"><OrderList list={incoming.filter((o) => o.status === "New")} act={act} /></Panel>
          </div>
          <Panel title="Top sellers by units">
            <Bars data={vendorProducts.slice(0, 6).map((p, i) => ({ name: p.brand, value: [34, 28, 21, 17, 12, 9][i] || 10 }))} />
          </Panel>
        </div>
      )}

      {tab === "orders" && <Panel title="All orders"><OrderList list={incoming} act={act} /></Panel>}

      {tab === "inventory" && (
        inventoryViewMode === "form" ? (
          // Full-Page Product Form (NO Pop-up)
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <ProductFormPage
              product={editingProduct}
              onCancel={() => setInventoryViewMode("list")}
              onSuccess={handleFormSuccess}
            />
          </div>
        ) : (
          // Standard Inventory List View
          <Panel 
            title="Inventory & fitment" 
            action={
              <button 
                onClick={handleOpenAdd} 
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                + Product
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  <tr>
                    <th className="py-2.5">Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Fitment</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendorProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                        No vendor products found in database. Click &quot;+ Product&quot; to add your first product.
                      </td>
                    </tr>
                  ) : (
                    vendorProducts.map((p) => { 
                      const o = p.offers?.find((x) => x.vendorId === "v1") || p.offers?.[0] || { price: 50000, stock: 10 };
                      
                      // Format fitment labels
                      const fitLabels = p.fits.map((f) => {
                      const b = bikes.find((x) => x.id === f);
                      if (b) return `${b.make} ${b.model}`;
                      const c = cars.find((x) => x.id === f);
                      if (c) return `${c.make} ${c.model}`;
                      return f;
                    }).join(", ");

                    const isPending = p.verificationStatus === "pending_approval";

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="flex items-center gap-3 py-3.5">
                          <img 
                            src={p.image} 
                            alt="" 
                            loading="lazy" 
                            width={42} 
                            height={42} 
                            className="h-10 w-10 rounded-lg object-cover border border-border" 
                          />
                          <div>
                            <span className="font-semibold block">{p.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{p.brand}</span>
                              {p.variantModel && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-medium">
                                  {p.variantModel}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                            {p.isAccessory || p.category === "Accessory" ? "🔌 Accessory" : `⚙️ ${p.category}`}
                          </span>
                        </td>

                        <td className="font-semibold">{inr(o.price)}</td>

                        <td>
                          {o.stock < 5 ? (
                            <StatusPill s={`Low · ${o.stock}`} />
                          ) : (
                            <span className="text-muted-foreground">{o.stock} in stock</span>
                          )}
                        </td>

                        <td className="text-xs text-muted-foreground max-w-[200px] truncate" title={fitLabels}>
                          {fitLabels || "Universal EV Fit"}
                        </td>

                        <td>
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
                              <Clock className="h-3 w-3" />
                              Pending Approval
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                              <ShieldCheck className="h-3 w-3" />
                              Approved
                            </span>
                          )}
                        </td>

                        <td className="text-right">
                          <button 
                            onClick={() => handleOpenEdit(p)} 
                            className="text-primary font-semibold hover:underline cursor-pointer text-sm"
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
          </Panel>
        )
      )}

      {tab === "payouts" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Stat label="Available balance" value={inr(0)} Icon={Wallet} />
          <Stat label="Next payout" value="No pending payouts" Icon={PackageOpen} />
          <Stat label="Paid this month" value={inr(0)} Icon={IndianRupee} />
          <Panel title="Payout history" className="lg:col-span-3">
            <p className="text-sm text-muted-foreground py-6 text-center">No past payout settlements recorded.</p>
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}

function OrderList({ list, act }: { list: { id: string; item: string; qty: number; amount: number; bike: string; status: string }[]; act: (id: string, s: string) => void }) {
  if (!list.length) return <p className="text-sm text-muted-foreground">No orders here 🎉</p>;
  return (
    <div className="space-y-3">
      {list.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between"><p className="font-semibold">{o.id}</p><StatusPill s={o.status} /></div>
          <p className="text-sm">{o.qty} × {o.item}</p>
          <p className="text-xs text-muted-foreground">For {o.bike} · {inr(o.amount)}</p>
          {o.status === "New" && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => act(o.id, "Accepted")} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground"><Check className="h-4 w-4" />Accept</button>
              <button onClick={() => act(o.id, "Rejected")} className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border py-2 text-sm font-semibold"><X className="h-4 w-4" />Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
