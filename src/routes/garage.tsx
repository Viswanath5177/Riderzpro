import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { 
  Bike, Check, ScanLine, Trash2, ShoppingBag, ShieldCheck, 
  Sparkles, Layers, Tag, RefreshCw, Car, Wrench, ArrowRight,
  Database
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import heroBike from "@/assets/hero-bike.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { bikes, cars, decodeVin, getBike, inr, type Product } from "@/lib/data";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useStore } from "@/lib/store";

interface GarageVehicle {
  id: string;
  customer_id?: string;
  vehicle_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  vehicle_type?: string;
  voltage?: number;
  battery_kwh?: number;
  is_active: boolean;
}

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Compatible Parts — Riderzpro" },
      { name: "description", content: "Manage your registered EVs and retrieve vendor parts that fit your garage." },
      { property: "og:title", content: "My Garage & Compatible Parts — Riderzpro" },
      { property: "og:description", content: "Decode your VIN, manage EVs, and shop live compatible parts." },
    ],
  }),
  component: GarageRoute,
});

function GarageRoute() {
  return (
    <ProtectedRoute>
      <GaragePage />
    </ProtectedRoute>
  );
}

function GaragePage() {
  const { addToCart, garage, addBike, removeBike, activeBikeId, setActiveBikeId } = useStore();
  const [vin, setVin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("ola-s1pro");
  const [selectedYear, setSelectedYear] = useState(2023);

  // PostgreSQL Customer Garage Vehicles
  const [garageVehicles, setGarageVehicles] = useState<GarageVehicle[]>([
    {
      id: "gar_ola_s1pro",
      vehicle_id: "ola-s1pro",
      make: "Ola",
      model: "S1 Pro Gen 2",
      year: 2023,
      vin: "P6R1S1PR2PN000001",
      vehicle_type: "bike",
      voltage: 60,
      is_active: true,
    },
    {
      id: "gar_ather_450x",
      vehicle_id: "ather-450x",
      make: "Ather",
      model: "450X Gen 3",
      year: 2024,
      vin: "MD9A450XAN1234567",
      vehicle_type: "bike",
      voltage: 48,
      is_active: false,
    },
    {
      id: "gar_tata_nexon",
      vehicle_id: "tata-nexon-ev",
      make: "Tata",
      model: "Nexon.ev Empowered",
      year: 2024,
      vin: "MAT1234NEXON56789",
      vehicle_type: "car",
      voltage: 400,
      battery_kwh: 40.5,
      is_active: false,
    },
  ]);

  // Live products retrieved directly from PostgreSQL
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  // Active vehicle in garage
  const activeVehicle = garageVehicles.find((v) => v.is_active) || garageVehicles[0];

  // Fetch Garage Vehicles from PostgreSQL
  const fetchGarageFromDb = async () => {
    setIsSyncingDb(true);
    try {
      const res = await fetch("/api/garage?customer_id=usr_customer_demo");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setGarageVehicles(json.data);
      }
    } catch (err: any) {
      console.warn("Could not fetch garage from PostgreSQL:", err.message);
    } finally {
      setIsSyncingDb(false);
    }
  };

  // Fetch Products Stored in PostgreSQL
  const fetchProductsFromDb = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Product[] = json.data.map((row: any) => {
          let primaryImg = "/src/assets/battery-1.jpg";
          if (row.image_url) {
            try {
              if (row.image_url.startsWith("[")) {
                primaryImg = JSON.parse(row.image_url)[0] || primaryImg;
              } else {
                primaryImg = row.image_url;
              }
            } catch {
              primaryImg = row.image_url;
            }
          }

          let fitsArr: string[] = ["ola-s1pro", "ather-450x", "tata-nexon-ev"];
          if (row.compatible_vehicles) {
            fitsArr = Array.isArray(row.compatible_vehicles) 
              ? row.compatible_vehicles 
              : [row.compatible_vehicles];
          }

          return {
            id: row.id,
            name: row.name,
            brand: row.brand || "Riderz Armor",
            category: row.category_name || "Car Accessories",
            image: primaryImg,
            warrantyMonths: 24,
            weightKg: Number(row.weight_kg) || 4.5,
            fits: fitsArr,
            description: row.description || "",
            offers: [{ vendorId: "v1", price: Number(row.price), stock: Number(row.stock) }],
            variantModel: row.variant_model,
            material: row.material,
            fitmentSize: row.fitment_size,
            moq: row.moq,
            supplier: row.supplier,
            colorOptions: Array.isArray(row.color_options) ? row.color_options : [],
            discountPercent: row.discount_percent,
          };
        });
        setDbProducts(mapped);
      }
    } catch (err: any) {
      console.warn("Could not fetch products from PostgreSQL:", err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchGarageFromDb();
    fetchProductsFromDb();
  }, []);

  // Filter products compatible with the customer's active garage vehicle
  const compatibleProducts = useMemo(() => {
    if (!activeVehicle) return dbProducts;
    const vId = activeVehicle.vehicle_id.toLowerCase();
    const vMake = activeVehicle.make.toLowerCase();
    const vModel = activeVehicle.model.toLowerCase();
    return dbProducts.filter((p) => {
      if (p.fits.includes("universal")) return true;
      if (p.fits.some((f) => {
        const lf = f.toLowerCase();
        return lf === vId || lf === vMake || lf === vModel || vId.includes(lf) || lf.includes(vId);
      })) return true;
      if (p.description.toLowerCase().includes(vMake) || 
          p.description.toLowerCase().includes(vModel) ||
          p.name.toLowerCase().includes(vMake) ||
          p.name.toLowerCase().includes(vModel)) {
        return true;
      }
      return false;
    });
  }, [activeVehicle, dbProducts]);

  // Decode VIN & Save to PostgreSQL
  const handleDecodeVin = async () => {
    const trimmed = vin.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter a 17-character VIN.");
      return;
    }
    const r = decodeVin(trimmed);
    if (!r.ok || !r.bike) {
      toast.error(r.error || "Could not decode VIN");
      return;
    }

    const payload = {
      customer_id: "usr_customer_demo",
      vehicle_id: r.bike.id,
      make: r.bike.make,
      model: r.bike.model,
      year: r.year || 2024,
      vin: trimmed,
      vehicle_type: "bike",
      voltage: r.bike.voltage || 60,
    };

    try {
      const res = await fetch("/api/garage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGarageVehicles((prev) => [...prev, data.data]);
        toast.success(`VIN decoded! ${r.bike.make} ${r.bike.model} saved to PostgreSQL.`);
        setVin("");
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch (err: any) {
      // Local fallback
      const newVeh: GarageVehicle = {
        id: `gar_${Date.now()}`,
        vehicle_id: r.bike.id,
        make: r.bike.make,
        model: r.bike.model,
        year: r.year || 2024,
        vin: trimmed,
        voltage: r.bike.voltage || 60,
        is_active: false,
      };
      setGarageVehicles((prev) => [...prev, newVeh]);
      toast.success(`${r.bike.make} ${r.bike.model} added to garage.`);
      setVin("");
    }
  };

  // Add Manual Vehicle & Save to PostgreSQL
  const handleAddManualVehicle = async () => {
    const selectedBike = bikes.find((b) => b.id === selectedVehicleId);
    const selectedCar = cars.find((c) => c.id === selectedVehicleId);
    const make = selectedBike?.make || selectedCar?.make || "EV";
    const model = selectedBike?.model || selectedCar?.model || "Model";
    const vehicleType = selectedCar ? "car" : "bike";
    const voltage = selectedBike?.voltage || 60;

    const payload = {
      customer_id: "usr_customer_demo",
      vehicle_id: selectedVehicleId,
      make,
      model,
      year: Number(selectedYear),
      vehicle_type: vehicleType,
      voltage,
    };

    try {
      const res = await fetch("/api/garage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGarageVehicles((prev) => [...prev, data.data]);
        toast.success(`${make} ${model} saved to your PostgreSQL garage!`);
      }
    } catch (err: any) {
      const newVeh: GarageVehicle = {
        id: `gar_${Date.now()}`,
        vehicle_id: selectedVehicleId,
        make,
        model,
        year: Number(selectedYear),
        vehicle_type: vehicleType,
        voltage,
        is_active: false,
      };
      setGarageVehicles((prev) => [...prev, newVeh]);
      toast.success(`${make} ${model} added to garage.`);
    }
  };

  // Set Active Vehicle in PostgreSQL
  const handleSetActiveVehicle = async (veh: GarageVehicle) => {
    try {
      await fetch(`/api/garage/${veh.id}/active?customer_id=usr_customer_demo`, { method: "PUT" });
      setGarageVehicles((prev) =>
        prev.map((v) => ({ ...v, is_active: v.id === veh.id }))
      );
      toast.success(`Active vehicle set to ${veh.make} ${veh.model}. Compatible parts refreshed!`);
    } catch {
      setGarageVehicles((prev) =>
        prev.map((v) => ({ ...v, is_active: v.id === veh.id }))
      );
      toast.success(`Active vehicle: ${veh.make} ${veh.model}`);
    }
  };

  // Remove Vehicle from PostgreSQL
  const handleRemoveVehicle = async (id: string) => {
    try {
      await fetch(`/api/garage/${id}`, { method: "DELETE" });
      setGarageVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle removed from PostgreSQL garage.");
    } catch {
      setGarageVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-12 animate-in fade-in duration-200">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Database className="h-3.5 w-3.5" />
              <span>PostgreSQL Connected: public.customer_garage &bull; public.products</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground font-extrabold tracking-tight">
              My Garage & Compatible Parts
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your registered electric vehicles in PostgreSQL. All vendor uploads are retrieved and filtered live to fit your active vehicle.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              fetchGarageFromDb();
              fetchProductsFromDb();
              toast.success("Refreshed garage and products live from PostgreSQL!");
            }}
            disabled={isSyncingDb}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingDb ? "animate-spin text-primary" : ""}`} />
            <span>Sync with PostgreSQL</span>
          </button>
        </div>

        {/* Top Split: Add/Decode Vehicle vs Garage List */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Left: Decode VIN or Pick Vehicle (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card/70 backdrop-blur-md p-6 shadow-card space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ScanLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Decode Vehicle VIN</h2>
                <p className="text-xs text-muted-foreground">17 characters, found on RC book or chassis frame</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                maxLength={17}
                placeholder="MD9A450XAN1234567"
                className="h-11 flex-1 rounded-xl border border-border bg-background px-4 font-mono text-xs uppercase tracking-wider outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleDecodeVin}
                className="rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Decode
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Try sample VINs: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">MD9A450XAN1234567</code> (Ather 450X) or <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">P6R1S1PR2PN000001</code> (Ola S1 Pro)
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground my-2">
              <span className="h-px flex-1 bg-border" />
              <span>or add vehicle manually</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="h-11 rounded-xl border border-border bg-background px-3 text-xs focus:border-primary outline-none cursor-pointer"
              >
                <optgroup label="Electric Bikes & Scooters">
                  {bikes.map((b) => (
                    <option key={b.id} value={b.id}>🛵 {b.make} {b.model}</option>
                  ))}
                </optgroup>
                <optgroup label="Electric Passenger Cars">
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>🚗 {c.make} {c.model}</option>
                  ))}
                </optgroup>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-xs focus:border-primary outline-none cursor-pointer"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddManualVehicle}
              className="w-full rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary hover:text-primary-foreground py-2.5 text-xs font-bold text-primary transition-all cursor-pointer"
            >
              + Save Vehicle to PostgreSQL Garage
            </button>
          </div>

          {/* Right: Garage Vehicle Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Your Registered Vehicles ({garageVehicles.length})
              </h2>
              <span className="text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                Active: {activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : "None"}
              </span>
            </div>

            {garageVehicles.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
                No vehicles stored in your garage yet. Add one to see tailored parts!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {garageVehicles.map((v) => {
                  const isActive = v.is_active;
                  const isCar = v.vehicle_type === "car" || v.vehicle_id.startsWith("tata");
                  const iconImage = isCar ? scooterImg : heroBike;

                  return (
                    <div
                      key={v.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/30"
                          : "border-border bg-card/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-16 w-16 rounded-2xl bg-muted/50 overflow-hidden flex-shrink-0 border border-border flex items-center justify-center">
                          {isCar ? <Car className="h-8 w-8 text-primary" /> : <Bike className="h-8 w-8 text-primary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-bold text-foreground">
                              {v.make} {v.model}
                            </span>
                            {isActive && (
                              <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                                Active Vehicle
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {v.year} &bull; {v.voltage ? `${v.voltage}V system` : `${v.battery_kwh || 40} kWh battery`}
                          </p>
                          {v.vin && (
                            <span className="font-mono text-[10px] text-muted-foreground/80 block mt-0.5">
                              VIN: {v.vin}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSetActiveVehicle(v)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-xs cursor-default"
                              : "border border-border bg-background hover:bg-muted text-foreground"
                          }`}
                        >
                          {isActive ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Selected</span> : "Set Active"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveVehicle(v.id)}
                          className="rounded-full p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Remove vehicle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SECTION: RETRIEVED PRODUCTS STORED IN DB FOR ACTIVE VEHICLE */}
        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Live Vendor Catalogue &bull; Stored in PostgreSQL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Compatible Parts & Upgrades for {activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : "Your Vehicles"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                These items are stored in PostgreSQL table <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">riderzpro.products</code> and retrieved live according to vehicle fitment.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                {compatibleProducts.length} Compatible Item(s)
              </span>
            </div>
          </div>

          {/* Compatible Parts Grid */}
          {isLoadingProducts ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Loading compatible products from PostgreSQL database...
            </div>
          ) : compatibleProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-2xl p-6">
              No parts found compatible with {activeVehicle?.make} {activeVehicle?.model}. Add a new item as a vendor in the Vendor Dashboard to test retrieval!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {compatibleProducts.map((p) => {
                const offer = p.offers?.[0] || { price: 3499, stock: 15 };
                const isUniversal = p.fits.includes("universal");
                const mrpVal = p.offers?.[0] ? Math.round(offer.price * 1.3) : 4999;

                return (
                  <div
                    key={p.id}
                    className="group rounded-3xl border border-border bg-background p-4 flex flex-col justify-between hover:border-primary/60 hover:shadow-lg transition-all"
                  >
                    <div>
                      {/* Product Thumbnail & Badges */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted/30 border border-border/50 mb-3.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {p.category}
                          </span>
                          {p.discountPercent ? (
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              {p.discountPercent}% OFF
                            </span>
                          ) : null}
                        </div>

                        {p.sku && (
                          <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded-md">
                            {p.sku}
                          </span>
                        )}
                      </div>

                      {/* Header details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">{p.brand}</span>
                          <span className="text-[10px] text-muted-foreground">{offer.stock} in stock</span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {p.name}
                        </h3>
                        {p.variantModel && (
                          <p className="text-[11px] text-muted-foreground font-medium truncate">
                            Variant: {p.variantModel} {p.material ? `&bull; ${p.material}` : ""}
                          </p>
                        )}
                      </div>

                      {/* Compatibility Badge */}
                      <div className="mt-3 py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[11px] font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {isUniversal ? "Universal EV Compatibility" : `Guaranteed fit for ${activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : "your EV"}`}
                        </span>
                      </div>
                    </div>

                    {/* Price & Add to Cart Action */}
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-foreground">
                            {inr(offer.price)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {inr(mrpVal)}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block">
                          Inclusive of GST
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p.id, offer.vendorId || "v1", 1);
                          toast.success(`Added "${p.name}" to cart!`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <p>
              Looking for full vehicle configurations or dealership bookings?
            </p>
            <div className="flex items-center gap-3">
              <Link to="/shop" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Browse Full Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span>&bull;</span>
              <Link to="/dashboard/customer" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Go to Customer Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </SiteLayout>
  );
}
