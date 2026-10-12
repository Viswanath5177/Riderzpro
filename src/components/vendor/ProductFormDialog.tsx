import { useState, useEffect } from "react";
import { X, Check, Database, Copy, CheckCheck, Car as CarIcon, Bike as BikeIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { bikes, cars, type Product, type Category } from "@/lib/data";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null; // If provided, edit mode. If null, add mode.
  onSave: (product: Product, sqlQuery: string) => void;
}

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  // Form State
  const [vehicleType, setVehicleType] = useState<"bike" | "car" | "universal">("bike");
  const [isAccessory, setIsAccessory] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Category>("Battery");
  const [price, setPrice] = useState<number>(45000);
  const [stock, setStock] = useState<number>(10);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(24);
  const [weightKg, setWeightKg] = useState<number>(12);
  const [description, setDescription] = useState("");
  const [fits, setFits] = useState<string[]>([]);
  
  // Accessory Specific Details
  const [accessoryType, setAccessoryType] = useState("Fast Charger & Adapter");
  const [material, setMaterial] = useState("IP67 Weatherproof ABS");
  const [mounting, setMounting] = useState("Plug & Play DIY");
  const [powerRating, setPowerRating] = useState("3.3kW Fast Charge / 60V");

  // UI state
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Populate form on open or when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setCategory(product.category);
      const offer = product.offers?.[0] || { price: 50000, stock: 10 };
      setPrice(offer.price);
      setStock(offer.stock);
      setWarrantyMonths(product.warrantyMonths || 12);
      setWeightKg(product.weightKg || 5);
      setDescription(product.description || "");
      setFits(product.fits || []);
      setVehicleType(product.vehicleType || (product.fits?.some(f => cars.some(c => c.id === f)) ? "car" : "bike"));
      setIsAccessory(product.isAccessory || product.category === "Accessory" || product.category === "Charger");
      if (product.accessoryDetails) {
        setAccessoryType(product.accessoryDetails.type || "Fast Charger & Adapter");
        setMaterial(product.accessoryDetails.material || "IP67 Weatherproof ABS");
        setMounting(product.accessoryDetails.mounting || "Plug & Play DIY");
        setPowerRating(product.accessoryDetails.powerRating || "3.3kW Fast Charge / 60V");
      }
    } else {
      // Default reset
      setName("");
      setBrand("");
      setCategory("Battery");
      setPrice(52000);
      setStock(15);
      setWarrantyMonths(24);
      setWeightKg(14);
      setDescription("");
      setFits(["ola-s1pro", "ather-450x"]);
      setVehicleType("bike");
      setIsAccessory(false);
      setAccessoryType("Fast Charger & Adapter");
      setMaterial("IP67 Weatherproof ABS");
      setMounting("Plug & Play DIY");
      setPowerRating("3.3kW Fast Charge / 60V");
    }
  }, [product, open]);

  if (!open) return null;

  // Toggle fitment
  const toggleFit = (id: string) => {
    setFits(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllFits = () => {
    const all = vehicleType === "bike" ? bikes.map(b => b.id) : vehicleType === "car" ? cars.map(c => c.id) : [...bikes.map(b => b.id), ...cars.map(c => c.id)];
    setFits(all);
  };

  // Generate real PostgreSQL Query matching database/schema.sql
  const prodId = product ? product.id : `prod_${Math.random().toString(36).substring(2, 10)}`;
  const categoryId = category === "Battery" ? "cat_batteries" : "cat_accessories";
  
  const generatedSql = isEdit
    ? `UPDATE products SET
    name = '${name.replace(/'/g, "''")}',
    description = '${description.replace(/'/g, "''")}',
    price = ${Number(price).toFixed(2)},
    stock = ${Number(stock)},
    verification_status = 'pending_approval',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '${prodId}' AND seller_id = 'usr_seller_01';`
    : `INSERT INTO products (
    id, seller_id, category_id, name, description, 
    price, stock, verification_status, is_active
) VALUES (
    '${prodId}',
    'usr_seller_01',
    '${categoryId}',
    '${name.replace(/'/g, "''")}',
    '${description.replace(/'/g, "''")}',
    ${Number(price).toFixed(2)},
    ${Number(stock)},
    'pending_approval',
    TRUE
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopiedSql(true);
    toast.success("PostgreSQL query copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const savedItem: Product = {
      id: prodId,
      name,
      brand: brand || "Riderzpro Certified",
      category,
      image: product?.image || "/src/assets/battery-1.jpg",
      warrantyMonths,
      weightKg,
      fits: fits.length ? fits : ["ola-s1pro"],
      description: description || `${name} for ${vehicleType === "car" ? "Electric Cars" : "Electric Bikes"}. Conforms to OEM EV standards.`,
      offers: [
        {
          vendorId: "v1",
          price: Number(price),
          stock: Number(stock),
        },
      ],
      vehicleType,
      isAccessory,
      accessoryDetails: isAccessory
        ? {
            type: accessoryType,
            material,
            mounting,
            powerRating,
          }
        : undefined,
      verificationStatus: "pending_approval",
    };

    onSave(savedItem, generatedSql);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isEdit ? "Update Catalog Entry" : "PostgreSQL Unified Products Table"}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEdit ? `Edit Product: ${product?.name}` : "Add New EV Product / Accessory"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Saves directly to your seller inventory and prepares PostgreSQL row with <span className="font-semibold text-warning">pending_approval</span> verification status.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Vehicle & Product Target Toggles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-muted/40 p-3.5 border border-border/60">
            {/* Vehicle Type Toggle */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Target Vehicle
              </label>
              <div className="flex gap-1.5 rounded-xl bg-background p-1 border border-border">
                <button
                  type="button"
                  onClick={() => setVehicleType("bike")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    vehicleType === "bike" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BikeIcon className="h-3.5 w-3.5" />
                  Bike / 2W
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType("car")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    vehicleType === "car" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CarIcon className="h-3.5 w-3.5" />
                  Car / 4W
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType("universal")}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    vehicleType === "universal" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Universal
                </button>
              </div>
            </div>

            {/* Classification Toggle: Core Part vs Accessory */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Item Classification
              </label>
              <div className="flex gap-1.5 rounded-xl bg-background p-1 border border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccessory(false);
                    if (category === "Accessory") setCategory("Battery");
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    !isAccessory ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ⚙️ Core Part
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccessory(true);
                    setCategory("Accessory");
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isAccessory ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🔌 Accessory
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Core Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Product Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={isAccessory ? "e.g. ChargeMax 7.2kW Fast Portable EV Charger" : "e.g. VoltRide 60V 30Ah High-Performance Li-ion Pack"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Brand / Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. VoltRide, ChargeMax, Exide, Bosch"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as Category;
                  setCategory(val);
                  if (val === "Accessory") setIsAccessory(true);
                }}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Battery">🔋 Battery Pack</option>
                <option value="Charger">⚡ Fast Charger</option>
                <option value="Accessory">🔌 Vehicle Accessory</option>
                <option value="BMS">📟 Smart BMS Board</option>
                <option value="Motor">🏎️ BLDC Motor</option>
                <option value="Controller">🧠 Motor Controller</option>
                <option value="Brakes">🛑 Brake Assembly</option>
              </select>
            </div>

            {/* Price (INR) */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Selling Price (₹) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                required
                min="100"
                step="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Available Stock Units</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Warranty & Weight */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Warranty (Months)</label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">Weight (Kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

          </div>

          {/* Section 3: If Accessory -> Specific Relevant Details */}
          {isAccessory && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Accessory Relevant Specifications
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Accessory Sub-Type</label>
                  <select
                    value={accessoryType}
                    onChange={(e) => setAccessoryType(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Fast Charger & Adapter">⚡ Fast Charger & Adapter</option>
                    <option value="Mounts & Phone Holders">📱 Anti-Vibration Mobile Mount</option>
                    <option value="All-Weather Waterproof Covers">🛡️ Waterproof Body / Battery Cover</option>
                    <option value="Smart Security & Alarm">🔒 GPS Tracker & Disk Lock</option>
                    <option value="Cables & Converters">🔌 Type-2 EV Extension Cable</option>
                    <option value="Lighting & Flashers">💡 High-Intensity Auxiliary Pod</option>
                    <option value="Tyre Care & Inflator">🚲 Cordless EV Tire Inflator</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Material / Casing</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. CNC Aluminum 6061, IP67 ABS Plastic"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Mounting / Installation</label>
                  <input
                    type="text"
                    value={mounting}
                    onChange={(e) => setMounting(e.target.value)}
                    placeholder="e.g. Handlebar clamp, Plug & Play, Bolt-on"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Operating Voltage / Rating</label>
                  <input
                    type="text"
                    value={powerRating}
                    onChange={(e) => setPowerRating(e.target.value)}
                    placeholder="e.g. 12V-72V DC, 3.3kW AC, 100W PD"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Vehicle Compatibility / Fitment Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Compatible {vehicleType === "car" ? "Car Models" : vehicleType === "bike" ? "Bike Models" : "Vehicle Models"}
              </label>
              <button
                type="button"
                onClick={selectAllFits}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Select All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(vehicleType === "bike" || vehicleType === "universal") &&
                bikes.map((b) => {
                  const selected = fits.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleFit(b.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <BikeIcon className="h-3 w-3" />
                      {b.make} {b.model}
                    </button>
                  );
                })}

              {(vehicleType === "car" || vehicleType === "universal") &&
                cars.map((c) => {
                  const selected = fits.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleFit(c.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <CarIcon className="h-3 w-3" />
                      {c.make} {c.model}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 5: Description */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Description & Key Specifications</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight battery chemistry, thermal safety, charging time, OEM grade components, or warranty terms..."
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Section 6: PostgreSQL Query Inspector */}
          <div className="rounded-2xl border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSql(!showSql)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Database className="h-3.5 w-3.5 text-primary" />
                <span>PostgreSQL DB Sync Query ({showSql ? "Hide" : "Inspect"})</span>
              </button>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                {copiedSql ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedSql ? "Copied" : "Copy SQL"}
              </button>
            </div>

            {showSql && (
              <pre className="mt-2.5 overflow-x-auto rounded-xl bg-black/80 p-3 font-mono text-[11px] text-emerald-400">
                {generatedSql}
              </pre>
            )}
          </div>

          {/* Modal Footer Actions (Using matching vibrant green pill button) */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              {isEdit ? "Save Product Changes" : "+ Add Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
