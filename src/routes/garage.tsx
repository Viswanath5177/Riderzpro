import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, Check, ScanLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { bikes, decodeVin, getBike } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & VIN lookup — Riderzpro" },
      {
        name: "description",
        content: "Save your EVs and decode your VIN to see only parts that fit.",
      },
      { property: "og:title", content: "My Garage & VIN lookup — Riderzpro" },
      { property: "og:description", content: "Decode your VIN and find compatible EV parts." },
    ],
  }),
  component: Garage,
});

function Garage() {
  const { garage, addBike, removeBike, activeBikeId, setActiveBikeId } = useStore();
  const [vin, setVin] = useState("");
  const [bikeId, setBikeId] = useState(bikes[0].id);
  const [year, setYear] = useState(bikes[0].years.at(-1)!);
  const sel = getBike(bikeId)!;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="font-display text-5xl md:text-7xl">My Garage</h1>
        <p className="text-muted-foreground">
          Your bikes decide which parts we show as compatible.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ScanLine className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-3xl">Decode VIN</p>
            <p className="text-sm text-muted-foreground">
              17 characters, found on your RC book or frame.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                maxLength={17}
                placeholder="MD9A450XAN1234567"
                className="h-12 flex-1 rounded-xl border border-border bg-background px-4 font-mono uppercase tracking-wider outline-none focus:border-primary"
              />
              <button
                onClick={() => {
                  const r = decodeVin(vin);
                  if (!r.ok || !r.bike) return toast.error(r.error);
                  addBike({ bikeId: r.bike.id, year: r.year, vin: vin.toUpperCase() });
                  toast.success(`${r.bike.make} ${r.bike.model} ${r.year ?? ""} added`);
                  setVin("");
                }}
                className="rounded-xl bg-primary px-5 font-semibold text-primary-foreground"
              >
                Decode
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {vin.length}/17 · Try MD9A450XAN1234567 (Ather) or P6R1S1PR2PN000001 (Ola)
            </p>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or pick manually
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={bikeId}
                onChange={(e) => {
                  setBikeId(e.target.value);
                  setYear(getBike(e.target.value)!.years.at(-1)!);
                }}
                className="h-12 rounded-xl border border-border bg-background px-3"
              >
                {bikes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.make} {b.model}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="h-12 rounded-xl border border-border bg-background px-3"
              >
                {sel.years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                addBike({ bikeId, year });
                toast.success("Bike added");
              }}
              className="mt-3 w-full rounded-xl border border-primary py-3 font-semibold text-primary"
            >
              Add to garage
            </button>
          </div>
          <div className="space-y-3">
            {garage.length === 0 && (
              <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
                No bikes yet.
              </p>
            )}
            {garage.map((g) => {
              const b = getBike(g.bikeId)!;
              const active = activeBikeId === g.bikeId;
              return (
                <div
                  key={g.bikeId}
                  className={`flex items-center gap-4 overflow-hidden rounded-3xl border bg-card p-3 shadow-card ${active ? "border-primary" : "border-border"}`}
                >
                  <img
                    src={scooterImg}
                    alt={b.model}
                    loading="lazy"
                    width={96}
                    height={96}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-2xl leading-none">
                      {b.make} {b.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {g.year ?? "—"} · {b.voltage}V system
                    </p>
                    {g.vin && <p className="font-mono text-xs text-muted-foreground">{g.vin}</p>}
                  </div>
                  <button
                    onClick={() => setActiveBikeId(g.bikeId)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-primary text-primary-foreground" : "border border-border"}`}
                  >
                    {active ? (
                      <>
                        <Check className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      "Set active"
                    )}
                  </button>
                  <button
                    aria-label="Remove"
                    onClick={() => removeBike(g.bikeId)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-foreground"
            >
              <Bike className="h-4 w-4" /> Shop parts for my active bike
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
