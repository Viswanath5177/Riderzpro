import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, products, type Category } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop EV batteries & parts — Riderzpro" },
      { name: "description", content: "Filter EV batteries, chargers, motors and BMS by voltage, capacity, chemistry and fitment." },
      { property: "og:title", content: "Shop EV batteries & parts — Riderzpro" },
      { property: "og:description", content: "Compare EV parts from multiple sellers." },
    ],
  }),
  component: Shop,
});

const CATS: (Category | "All")[] = ["All", "Battery", "Charger", "BMS", "Motor", "Controller", "Brakes"];

function Shop() {
  const { activeBikeId, setActiveBikeId } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(true);
  const [sort, setSort] = useState("relevance");

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!volt || p.voltage === volt) &&
        (!onlyFit || !activeBikeId || p.fits.includes(activeBikeId)) &&
        (q === "" || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "low") l = [...l].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    if (sort === "high") l = [...l].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    return l;
  }, [q, cat, volt, onlyFit, activeBikeId, sort]);

  const bike = activeBikeId ? getBike(activeBikeId) : null;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Marketplace</p>
            <h1 className="font-display text-5xl md:text-7xl">Batteries & parts</h1>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2">
            <span className="text-xs text-muted-foreground">Shopping for</span>
            <select value={activeBikeId ?? ""} onChange={(e) => setActiveBikeId(e.target.value || null)} className="bg-transparent font-semibold outline-none">
              <option value="">Any bike</option>
              {bikes.map((b) => <option key={b.id} value={b.id}>{b.make} {b.model}</option>)}
            </select>
          </div>
        </div>

        <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-border px-4 py-3 glass md:mx-0 md:rounded-2xl md:border">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 60V battery, charger, BMS…" className="h-10 w-full bg-transparent outline-none" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            {[48, 60, 72].map((v) => (
              <button key={v} onClick={() => setVolt(volt === v ? null : v)} className={`rounded-lg border px-3 py-1 font-display text-lg leading-none ${volt === v ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{v}V</button>
            ))}
            <label className="ml-2 flex items-center gap-2"><input type="checkbox" checked={onlyFit} onChange={(e) => setOnlyFit(e.target.checked)} className="accent-[var(--primary)]" /> Only parts that fit {bike ? `${bike.make} ${bike.model}` : ""}</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-auto rounded-lg border border-border bg-card px-2 py-1">
              <option value="relevance">Relevance</option><option value="low">Price: low → high</option><option value="high">Price: high → low</option>
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} results</p>
        {list.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-3xl">No parts match</p>
            <p className="mt-2 text-muted-foreground">Try turning off “Only parts that fit” or clearing filters.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </div>
    </SiteLayout>
  );
}
