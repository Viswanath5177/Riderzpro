import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, ArrowRight, Check, ChevronDown, Copy, 
  Upload, Trash2, Image as ImageIcon, Loader2, Sparkles,
  ExternalLink, FileCode, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { bikes, cars, inr, type Product, type Category } from "@/lib/data";

interface ProductFormPageProps {
  product?: Product | null; // If editing, pass product. If adding, null.
  sellerId?: string;
  onCancel: () => void;
  onSuccess: (savedProduct: Product) => void;
}

export function ProductFormPage({ product, sellerId, onCancel, onSuccess }: ProductFormPageProps) {
  const isEdit = Boolean(product);
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  // Stepper state: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ----------------------------------------------------
  // STEP 1: Basic Information
  // ----------------------------------------------------
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [vehicleType, setVehicleType] = useState<"Car" | "Bike" | "Universal" | "Commercial">("Car");
  const [department, setDepartment] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");

  // ----------------------------------------------------
  // STEP 2: Pricing & Inventory
  // ----------------------------------------------------
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [mrp, setMrp] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [availability, setAvailability] = useState<"In Stock" | "Out of Stock" | "Pre-Order" | "Made to Order">("In Stock");

  // ----------------------------------------------------
  // STEP 3: Vehicle Compatibility
  // ----------------------------------------------------
  const [fitmentType, setFitmentType] = useState<"universal" | "specific" | "vin">("universal");
  const [vin, setVin] = useState("");
  const [optionsVariants, setOptionsVariants] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // ----------------------------------------------------
  // STEP 4: Images & Product Specifications
  // ----------------------------------------------------
  const [primaryImageUrl, setPrimaryImageUrl] = useState("");
  const [secondaryImageUrl, setSecondaryImageUrl] = useState("");
  const [warranty, setWarranty] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [installationPrice, setInstallationPrice] = useState<number | "">("");
  const [installationTime, setInstallationTime] = useState("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [dimensions, setDimensions] = useState("");

  // Submission state
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill when editing existing product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setBrand(product.brand || "");
      setSku(product.sku || (product.id ? `SKU-${product.id.toUpperCase()}` : "RZP-001"));
      setDescription(product.description || "");
      const offer = product.offers?.[0];
      const prodPrice = offer?.price ?? (product as any).price ?? "";
      const prodMrp = (product as any).mrp ?? (typeof prodPrice === "number" ? Math.round(prodPrice * 1.15) : "");
      const prodStock = offer?.stock ?? (product as any).stock ?? "";
      setSellingPrice(prodPrice);
      setMrp(prodMrp);
      setStock(prodStock);
      setAvailability(prodStock > 0 ? "In Stock" : "Out of Stock");
      if (product.image) setPrimaryImageUrl(product.image);
      if (product.warrantyMonths) setWarranty(`${product.warrantyMonths / 12} year`);
      if (product.variantModel) setOptionsVariants(product.variantModel);
      if (product.category) {
        setCategoryInput(product.category);
        if (product.category.includes("Batter")) setDepartment("EV Batteries");
        else if (product.category.includes("Charg")) setDepartment("Smart Chargers");
        else if (product.category.includes("Brak")) setDepartment("Braking & Safety");
        else if (product.category.includes("BMS")) setDepartment("BMS Systems");
        else if (product.category.includes("Motor")) setDepartment("Motors & Controllers");
        else if (product.category.includes("Part")) setDepartment("Spare Parts");
      }
    }
  }, [product]);

  // Derived financial calculation for Step 2
  const numSellingPrice = typeof sellingPrice === "number" ? sellingPrice : Number(sellingPrice) || 0;
  const numMrp = typeof mrp === "number" ? mrp : Number(mrp) || 0;
  const platformFee = Math.round(numSellingPrice * 0.05);
  const estimatedPayout = Math.max(0, numSellingPrice - platformFee);

  // Image file handler for primary & secondary images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB. Please upload an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isPrimary) {
        setPrimaryImageUrl(dataUrl);
        toast.success("Primary image loaded!");
      } else {
        setSecondaryImageUrl(dataUrl);
        toast.success("Secondary image loaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error("Product name is required.");
        return false;
      }
      if (!brand.trim()) {
        toast.error("Brand is required.");
        return false;
      }
      if (!sku.trim()) {
        toast.error("Product SKU / Model code is required.");
        return false;
      }
      if (!description.trim()) {
        toast.error("Description is required.");
        return false;
      }
      if (!department.trim()) {
        toast.error("Department is required.");
        return false;
      }
      if (!categoryInput.trim()) {
        toast.error("Category is required.");
        return false;
      }
    }
    if (step === 2) {
      if (!numSellingPrice || numSellingPrice <= 0) {
        toast.error("Valid selling price is required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    } else {
      onCancel();
    }
  };

  // Construct JSON representation
  const getProductJson = () => {
    return {
      name,
      brand,
      vehicle_type: vehicleType,
      department,
      category: categoryInput,
      sku,
      description,
      key_features: keyFeatures ? keyFeatures.split("\n").filter(Boolean) : [],
      pricing: {
        selling_price: numSellingPrice,
        mrp: numMrp,
        platform_fee_percent: 5,
        estimated_net_payout: estimatedPayout,
      },
      inventory: {
        stock: typeof stock === "number" ? stock : 0,
        availability,
      },
      compatibility: {
        fitment_type: fitmentType,
        vin: vin || null,
        options_variants: optionsVariants,
        make: fitmentType === "specific" ? selectedMake : null,
        model: fitmentType === "specific" ? selectedModel : null,
      },
      specifications: {
        primary_image_url: primaryImageUrl,
        secondary_image_url: secondaryImageUrl || null,
        warranty,
        delivery_details: deliveryDetails,
        installation_price: installationPrice || null,
        installation_time: installationTime || null,
        weight_kg: weightKg || null,
        dimensions: dimensions || null,
      },
    };
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(getProductJson(), null, 2);
    navigator.clipboard.writeText(jsonStr);
    toast.success("Product data copied to clipboard as JSON!");
  };

  // Submit and Publish product to database
  const handleSubmitToDatabase = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Publishing product...");

    const prodId = product ? product.id : `prod_${Math.random().toString(36).substring(2, 10)}`;
    
    // Compatible vehicles list based on fitment type
    let compatibleList: string[] = [];
    if (fitmentType === "universal") {
      compatibleList = [
        "universal",
        "ola-s1pro",
        "ather-450x",
        "tata-nexon-ev",
        "tvs-iqube",
        "bajaj-chetak",
        "revolt-rv400",
        "hero-vida-v1",
        "tata-tiago-ev",
        "mg-zs-ev",
        "mahindra-xuv400",
      ];
    } else {
      const cleanMake = selectedMake.toLowerCase().trim();
      const cleanModelNoSpecial = selectedModel.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanModelHyphen = selectedModel.toLowerCase().replace(/[^a-z0-9]/g, "-");
      compatibleList = Array.from(new Set([
        `${cleanMake}-${cleanModelNoSpecial}`,
        `${cleanMake}-${cleanModelHyphen}`,
        cleanMake,
        cleanModelHyphen,
        cleanModelNoSpecial,
        fitmentType === "vin" && vin ? `vin:${vin.toUpperCase().trim()}` : null,
      ].filter(Boolean) as string[]));
    }

    const categoryMap: Record<string, string> = {
      "Accessories": "cat_accessories",
      "Spare Parts": "cat_parts",
      "EV Batteries": "cat_batteries",
      "Smart Chargers": "cat_chargers",
      "BMS Systems": "cat_bms",
      "Motors & Controllers": "cat_motors",
      "Braking & Safety": "cat_brakes",
    };
    const categoryId = categoryMap[department] || "cat_accessories";

    const allImages = secondaryImageUrl ? [primaryImageUrl, secondaryImageUrl] : [primaryImageUrl];

    const fitmentNote = fitmentType === "universal" 
      ? "Universal fit for all electric bikes and cars" 
      : `Compatible with ${selectedMake} ${selectedModel}${vin ? ` (VIN: ${vin})` : ""}`;
    const fullDescription = `${description}\n\nKey Features:\n${keyFeatures}\n\nFitment: ${fitmentNote} | Vehicle Type: ${vehicleType} | Department: ${department} | SKU: ${sku} | Warranty: ${warranty} | Delivery: ${deliveryDetails}${dimensions ? ` | Dimensions: ${dimensions}` : ""}`;

    const payload = {
      id: prodId,
      seller_id: sellerId || "usr_seller_01",
      category_id: categoryId,
      name,
      brand,
      sku,
      description: fullDescription,
      price: numSellingPrice,
      mrp: numMrp || Math.round(numSellingPrice * 1.15),
      discount_percent: numMrp > numSellingPrice ? Math.round(((numMrp - numSellingPrice) / numMrp) * 100) : 0,
      stock: typeof stock === "number" ? stock : 0,
      moq: 1,
      supplier: brand || "Riderzpro Certified",
      variant_model: optionsVariants,
      material: categoryInput,
      fitment_size: fitmentType === "universal" ? "Universal" : `${selectedMake} ${selectedModel}`,
      fitment_type: fitmentType,
      compatible_vehicles: compatibleList,
      color_options: optionsVariants ? optionsVariants.split(",").map((s) => s.trim()) : ["Black"],
      key_features: keyFeatures,
      warranty,
      weight_kg: Number(weightKg) || 1.5,
      image_url: JSON.stringify(allImages),
      verification_status: isEdit ? "approved" : "pending_approval",
    };

    try {
      const endpoint = isEdit ? `/api/products/${prodId}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Database operation failed");
      }

      toast.success(
        isEdit 
          ? `Product "${name}" updated successfully!` 
          : `Product "${name}" submitted for approval! Product Admin will review specifications before public display.`,
        { id: toastId }
      );

      const savedProductItem: Product = {
        id: prodId,
        name,
        brand,
        category: "Car Accessories" as Category,
        image: primaryImageUrl,
        warrantyMonths: warranty.includes("year") ? 12 : 6,
        weightKg: Number(weightKg) || 1.5,
        fits: compatibleList,
        description: fullDescription,
        offers: [
          {
            vendorId: sellerId || "v1",
            price: numSellingPrice,
            stock: typeof stock === "number" ? stock : 0,
          },
        ],
        verificationStatus: "approved",
        variantModel: optionsVariants,
        sku,
      };

      onSuccess(savedProductItem);
    } catch (err: any) {
      console.warn("Database save error:", err.message);
      toast.error(`Database error: ${err.message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#09090b] text-zinc-100 p-6 sm:p-10 shadow-2xl transition-all max-w-4xl mx-auto">
      
      {/* ---------------------------------------------------- */}
      {/* FORM HEADER                                          */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <span className="inline-flex items-center rounded-full bg-blue-950/80 px-3.5 py-1 text-xs font-semibold text-blue-400 border border-blue-800/40">
            Step {currentStep} of 5
          </span>
        </div>

        <p className="text-xs text-zinc-400 -mt-1">
          {isEdit ? "Update and modify product listing in Riderzpro store." : "Create a product listing for your Riderzpro store."}
        </p>

        {/* 5-Segment Progress Bar */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {[1, 2, 3, 4, 5].map((stepNum) => {
            const isActive = stepNum <= currentStep;
            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep || validateStep(currentStep)) {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-amber-400" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
                title={`Go to Step ${stepNum}`}
              />
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* STEP 1: Basic Information                            */}
      {/* ---------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">1. Basic Information</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identify the product and organize it in the catalogue.
            </p>
          </div>

          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                Product name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 12V Heated Car Cushion"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
            </div>

            {/* Brand & Vehicle Type (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Brand <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Autoform"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Vehicle type
                </label>
                <div className="relative">
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full appearance-none rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 cursor-pointer transition-colors"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Universal">Universal</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Department & Category (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Department <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 cursor-pointer transition-colors"
                  >
                    <option value="">Select Department</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="EV Batteries">EV Batteries</option>
                    <option value="Smart Chargers">Smart Chargers</option>
                    <option value="BMS Systems">BMS Systems</option>
                    <option value="Motors & Controllers">Motors & Controllers</option>
                    <option value="Braking & Safety">Braking & Safety</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="e.g. Cushions"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Product SKU / Model Code */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                Product SKU / Model code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Unique seller product code"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product and its main benefits"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
            </div>

            {/* Key Features */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                Key features
              </label>
              <textarea
                rows={3}
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                placeholder="Enter features separated by new lines"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-6 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 2: Pricing & Inventory                          */}
      {/* ---------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              1. Basic Information
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white">2. Pricing & Inventory</h2>
          </div>

          <div className="space-y-5">
            {/* Selling Price & MRP (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Selling price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 3599"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 3999"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Available Stock & Availability (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Available stock <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Actual quantity"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Availability
                </label>
                <div className="relative">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full appearance-none rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 cursor-pointer transition-colors"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Made to Order">Made to Order</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Estimated Payout Preview */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-300 block mb-2">
                Estimated payout preview
              </span>
              <div className="h-1 w-10 rounded-full bg-emerald-500 mb-2" />
              <p className="text-xs text-zinc-400">
                Illustrative net after a 5% platform fee, before other applicable adjustments.
                {numSellingPrice > 0 && (
                  <span className="block mt-1 font-semibold text-emerald-400">
                    Net Payout: ₹{estimatedPayout.toLocaleString("en-IN")} (Platform Fee: -₹{platformFee.toLocaleString("en-IN")})
                  </span>
                )}
              </p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-zinc-500 leading-relaxed pt-2">
              The final form should also include applicable tax classification and HSN code when verified. These are not inferred from the selling price.
            </p>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-6 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 3: Vehicle Compatibility                        */}
      {/* ---------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              1. Basic Information
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white">3. Vehicle Compatibility</h2>
          </div>

          <div className="space-y-5">
            {/* Fitment Type Radio Options */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-3">
                Fitment type
              </label>
              
              <div className="space-y-3">
                {[
                  { id: "universal", label: "Universal fit" },
                  { id: "specific", label: "Specific vehicle make/model" },
                  { id: "vin", label: "VIN-specific compatibility" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-3 text-sm text-zinc-200 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="fitmentType"
                      checked={fitmentType === opt.id}
                      onChange={() => setFitmentType(opt.id as any)}
                      className="h-4 w-4 border-zinc-700 text-white bg-black focus:ring-amber-400 accent-amber-400 cursor-pointer"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Specific Vehicle Selector */}
            {fitmentType === "specific" && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Vehicle Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-[#000000] px-3 py-2 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Make</option>
                    <option value="Tata">Tata</option>
                    <option value="Ola">Ola</option>
                    <option value="Ather">Ather</option>
                    <option value="Maruti">Maruti</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Mahindra">Mahindra</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Vehicle Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-[#000000] px-3 py-2 text-xs text-zinc-200 focus:border-amber-400 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Model</option>
                    <option value="Nexon.ev">Nexon.ev</option>
                    <option value="S1 Pro">S1 Pro</option>
                    <option value="450X">450X</option>
                    <option value="Swift">Swift</option>
                    <option value="Creta">Creta</option>
                    <option value="XUV400">XUV400</option>
                  </select>
                </div>
              </div>
            )}

            {/* Vehicle VIN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Vehicle VIN
                </label>
                <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter VIN if applicable"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-1.5">
                Leave blank for universal accessories. Verify compatibility rather than relying on VIN format alone.
              </p>
            </div>

            {/* Options / Variants */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                Options / Variants
              </label>
              <input
                type="text"
                value={optionsVariants}
                onChange={(e) => setOptionsVariants(e.target.value)}
                placeholder="e.g. Black, Beige, Pack of 1"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-6 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 4: Images & Product Specifications              */}
      {/* ---------------------------------------------------- */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              1. Basic Information
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white">4. Images & Product Specifications</h2>
            <p className="text-xs text-zinc-400">
              Add up to two product images. Use valid image URLs or upload files to the configured image-storage backend.
            </p>
          </div>

          <div className="space-y-5">
            {/* Primary Image URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Primary image URL
                </label>
                <button
                  type="button"
                  onClick={() => primaryFileInputRef.current?.click()}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload File</span>
                </button>
              </div>
              <input
                type="text"
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
              <input
                type="file"
                ref={primaryFileInputRef}
                onChange={(e) => handleFileUpload(e, true)}
                accept="image/*"
                className="hidden"
              />
              {primaryImageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={primaryImageUrl} alt="Primary" className="h-10 w-10 rounded-lg object-cover border border-zinc-800" />
                  <span className="text-xs text-zinc-400 truncate max-w-sm">Image preview ready</span>
                </div>
              )}
            </div>

            {/* Secondary Image URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Secondary image URL (optional)
                </label>
                <button
                  type="button"
                  onClick={() => secondaryFileInputRef.current?.click()}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload File</span>
                </button>
              </div>
              <input
                type="text"
                value={secondaryImageUrl}
                onChange={(e) => setSecondaryImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
              <input
                type="file"
                ref={secondaryFileInputRef}
                onChange={(e) => handleFileUpload(e, false)}
                accept="image/*"
                className="hidden"
              />
              {secondaryImageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={secondaryImageUrl} alt="Secondary" className="h-10 w-10 rounded-lg object-cover border border-zinc-800" />
                  <span className="text-xs text-zinc-400 truncate max-w-sm">Secondary image ready</span>
                </div>
              )}
            </div>

            {/* Warranty & Delivery Details (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Warranty
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 1 year"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Delivery details
                </label>
                <input
                  type="text"
                  value={deliveryDetails}
                  onChange={(e) => setDeliveryDetails(e.target.value)}
                  placeholder="e.g. 3–5 business days"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Installation Price & Time (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Installation price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={installationPrice}
                  onChange={(e) => setInstallationPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Installation time
                </label>
                <input
                  type="text"
                  value={installationTime}
                  onChange={(e) => setInstallationTime(e.target.value)}
                  placeholder="e.g. 30 minutes"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Weight & Package Dimensions (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200 block mb-1.5">
                  Package dimensions (cm)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="L × W × H"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Preservation Note */}
            <p className="text-xs text-zinc-500 leading-relaxed pt-1">
              Accept images under 5 MB each. Preserve original quality; do not automatically compress images.
            </p>
          </div>

          {/* Step 4 Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-6 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 5: Review & Submit                              */}
      {/* ---------------------------------------------------- */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              1. Basic Information
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white">5. Review & Submit</h2>
          </div>

          {/* Preview Card */}
          <div className="rounded-2xl border border-zinc-800 bg-[#000000] p-6 space-y-4">
            <div className="border-b border-zinc-800/80 pb-4">
              <h3 className="text-xl font-bold text-white leading-tight">
                {name || "Untitled product"}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {brand || "Brand not entered"} · {categoryInput || "Category not entered"}
              </p>
              <p className="text-lg font-extrabold text-white mt-2">
                {numSellingPrice > 0 ? `₹${numSellingPrice.toLocaleString("en-IN")}` : "Price not entered"}
              </p>
            </div>

            {/* Key-Value Details Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">SKU</span>
                <span className="text-zinc-200 font-mono">{sku || "Not entered"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Department</span>
                <span className="text-zinc-200">{department || "Accessories"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Vehicle fitment</span>
                <span className="text-zinc-200">
                  {fitmentType === "universal" ? "Universal" : fitmentType === "specific" ? `${selectedMake} ${selectedModel}` : "VIN-specific"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">VIN</span>
                <span className="text-zinc-200 font-mono">{vin || "Not provided"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Stock</span>
                <span className="text-zinc-200">
                  {stock !== "" && stock !== 0 ? `${stock} units (${availability})` : availability}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Primary image</span>
                <span className="text-zinc-200 truncate max-w-xs">{primaryImageUrl ? "Provided" : "Not provided"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Secondary image</span>
                <span className="text-zinc-200">{secondaryImageUrl ? "Provided" : "Not provided"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500 font-medium">Warranty</span>
                <span className="text-zinc-200">{warranty || "Not provided"}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-500 font-medium">Delivery</span>
                <span className="text-zinc-200">{deliveryDetails || "Not provided"}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            This preview does not save or publish a product. Connect the form to your backend to create the database record and publish it to the customer Garage page.
          </p>

          {/* Copy product data as JSON Button */}
          <div>
            <button
              type="button"
              onClick={handleCopyJson}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy product data as JSON</span>
            </button>
          </div>

          {/* Step 5 Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSaving}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-6 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmitToDatabase}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 text-black" />
                  <span>{isEdit ? "Save Changes" : "Publish"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
