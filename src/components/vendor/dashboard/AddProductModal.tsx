import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
  FileSpreadsheet,
  Download,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  ShieldCheck,
  Tag,
  Zap,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { bikes as CATALOG_BIKES, products as STATIC_CATALOG_PRODUCTS, Category } from "@/lib/data";
import { storageAdapter } from "@/lib/vendor/adapters/storage";
import { Vendor, VendorProduct, ProductRevision } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

const CATEGORIES: Category[] = [
  "Battery",
  "Charger",
  "BMS",
  "Motor",
  "Controller",
  "Brakes",
  "Electric Bikes",
  "Car Accessories",
  "Bike Accessories",
  "Riding Gear & Helmets",
  "Spare Parts",
];

const DEFAULT_GST_RATES: Record<string, number> = {
  Battery: 18,
  Charger: 18,
  BMS: 18,
  Motor: 18,
  Controller: 18,
  Brakes: 18,
  "Electric Bikes": 5,
  "Car Accessories": 18,
  "Bike Accessories": 18,
  "Riding Gear & Helmets": 18,
  "Spare Parts": 18,
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  productToEdit?: VendorProduct | null;
}

export function AddProductModal({
  isOpen,
  onClose,
  vendor,
  productToEdit,
}: AddProductModalProps) {
  const { products, addProduct, updateProduct, requestProductRevision } = useVendorStore();

  const isKycApproved = vendor.status === "approved";

  const [mode, setMode] = useState<"NEW" | "EXISTING_OFFER" | "CSV_BULK">("NEW");

  // Mode 2: Existing Product Search
  const [existingSearchQuery, setExistingSearchQuery] = useState("");
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<any | null>(null);
  const [existingOfferPrice, setExistingOfferPrice] = useState<number>(0);
  const [existingOfferStock, setExistingOfferStock] = useState<number>(10);
  const [existingOfferCondition, setExistingOfferCondition] = useState<"New" | "Refurbished">("New");

  // Form Fields
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Category>("Battery");
  const [subType, setSubType] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [richDescription, setRichDescription] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [hsnCode, setHsnCode] = useState("85076000");
  const [gstRate, setGstRate] = useState<number>(18);
  const [mrp, setMrp] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(3);
  const [condition, setCondition] = useState<"New" | "Refurbished">("New");
  const [partType, setPartType] = useState<"OEM" | "Genuine" | "Aftermarket">("Genuine");
  const [warrantyMonths, setWarrantyMonths] = useState<number>(24);
  const [weightKg, setWeightKg] = useState<number>(4.5);
  const [dimensionsCm, setDimensionsCm] = useState({ length: 30, width: 20, height: 15 });
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");
  const [manufacturerDetails, setManufacturerDetails] = useState("");
  const [inTheBox, setInTheBox] = useState("");

  // Category Specific Specs
  const [specs, setSpecs] = useState<Record<string, any>>({
    voltage: "60V",
    capacityAh: "30Ah",
    chemistry: "NMC",
    ipRating: "IP67",
    connectorType: "Chogori / Anderson",
    kw: "",
    certification: "BIS / UN38.3",
  });

  // Fitment
  const [fitsAll, setFitsAll] = useState(false);
  const [selectedBikes, setSelectedBikes] = useState<string[]>(["ola-s1pro", "ather-450x"]);

  // Images state (min 3, max 8)
  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Bulk Upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvSuccessCount, setCsvSuccessCount] = useState<number>(0);

  // Initialize form when editing or resetting
  useEffect(() => {
    if (productToEdit) {
      setMode("NEW");
      setTitle(productToEdit.title);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setSku(productToEdit.sku);
      setHsnCode(productToEdit.hsnCode || "85076000");
      setGstRate(productToEdit.gstRate || 18);
      setMrp(productToEdit.mrp);
      setSellingPrice(productToEdit.sellingPrice);
      setStock(productToEdit.stock);
      setMinStockAlert(productToEdit.minStockAlert || 3);
      setCondition(productToEdit.condition || "New");
      setPartType(productToEdit.partType || "Genuine");
      setWarrantyMonths(productToEdit.warrantyMonths);
      setWeightKg(productToEdit.weightKg || 4.5);
      setShortDescription(productToEdit.description || "");
      setSelectedBikes(productToEdit.fits || []);
      setImages(productToEdit.images || []);
      setSpecs(productToEdit.specs || {});
    } else {
      // Default initial images (3 high quality demo images to satisfy min 3 requirement)
      setImages([
        "https://images.unsplash.com/photo-1558441719-8b489c652758?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      ]);
    }
  }, [productToEdit]);

  if (!isOpen) return null;

  // Handle Category Change
  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat);
    setGstRate(DEFAULT_GST_RATES[newCat] || 18);
    if (newCat === "Battery") {
      setHsnCode("85076000");
      setSpecs((prev) => ({ ...prev, voltage: "60V", capacityAh: "30Ah", chemistry: "NMC", ipRating: "IP67" }));
    } else if (newCat === "Charger") {
      setHsnCode("85044030");
      setSpecs((prev) => ({ ...prev, voltage: "60V", kw: "3.3kW", ipRating: "IP65" }));
    } else if (newCat === "Riding Gear & Helmets") {
      setHsnCode("65061000");
      setSpecs((prev) => ({ ...prev, certification: "ECE 22.06 / ISI 4151" }));
    } else {
      setHsnCode("87141090");
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed per listing");
      return;
    }

    setIsUploadingImage(true);
    try {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5 MB limit`);
          continue;
        }
        const uploaded = await storageAdapter.uploadImage(file);
        newImageUrls.push(uploaded.url);
      }
      setImages((prev) => [...prev, ...newImageUrls]);
      toast.success(`Uploaded ${newImageUrls.length} image(s)`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to process image upload");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const makeMainImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    toast.info("Set as main thumbnail");
  };

  // Fitment toggle
  const toggleBikeFit = (bikeId: string) => {
    setSelectedBikes((prev) =>
      prev.includes(bikeId) ? prev.filter((b) => b !== bikeId) : [...prev, bikeId]
    );
  };

  // Voltage mismatch detector
  const parsedVolt = parseInt(String(specs.voltage || "").replace(/\D/g, ""), 10);
  const voltageMismatch = selectedBikes.some((bId) => {
    const b = CATALOG_BIKES.find((bk) => bk.id === bId);
    return b && b.voltage && parsedVolt && b.voltage !== parsedVolt;
  });

  // Validation
  const validateForm = () => {
    if (!title.trim() || title.length < 5) {
      toast.error("Title must be at least 5 characters long");
      return false;
    }
    if (!brand.trim()) {
      toast.error("Brand name is required");
      return false;
    }
    if (!sku.trim()) {
      toast.error("SKU is required");
      return false;
    }
    if (mrp <= 0 || sellingPrice <= 0) {
      toast.error("MRP and Selling Price must be greater than 0");
      return false;
    }
    if (sellingPrice > mrp) {
      toast.error("Selling price cannot exceed MRP");
      return false;
    }
    if (images.length < 3) {
      toast.error("Minimum 3 product images required (uploaded: " + images.length + ")");
      return false;
    }
    // Duplicate check for new products
    if (!productToEdit) {
      const exists = products.some(
        (p) =>
          p.vendorId === vendor.id &&
          (p.sku.toLowerCase() === sku.toLowerCase() ||
            p.title.trim().toLowerCase() === title.trim().toLowerCase())
      );
      if (exists) {
        toast.error("A product with this SKU or title already exists in your store");
        return false;
      }
    }
    return true;
  };

  // Save as Draft or Submit
  const handleSave = (submitForReview: boolean) => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Vendor must be KYC approved by admin before creating or modifying products."
      );
      return;
    }
    if (!validateForm()) return;

    const targetFits = fitsAll ? CATALOG_BIKES.map((b) => b.id) : selectedBikes;

    if (productToEdit) {
      // Editing existing product
      if (productToEdit.status === "live") {
        // Live product edit logic (Prompt 7b):
        // Price and stock edits apply instantly!
        // Content/spec/images edits create pending revision.
        const hasContentChanges =
          productToEdit.title !== title ||
          productToEdit.category !== category ||
          JSON.stringify(productToEdit.images) !== JSON.stringify(images) ||
          productToEdit.description !== shortDescription;

        if (hasContentChanges) {
          const revision: any = {
            id: `rev_${Date.now()}`,
            productId: productToEdit.id,
            vendorId: vendor.id,
            submittedAt: Date.now(),
            changes: {
              title,
              category,
              images,
              description: shortDescription,
              specs,
              fits: targetFits,
              sellingPrice,
              mrp,
              stock,
            },
            status: "pending_review",
          };
          if (requestProductRevision) {
            requestProductRevision(productToEdit.id, revision);
          }
          toast.success(
            "Price/stock updated instantly! Content revisions submitted for admin review."
          );
        } else {
          updateProduct(productToEdit.id, {
            sellingPrice,
            mrp,
            stock,
            minStockAlert,
          });
          toast.success("Product price and stock updated instantly!");
        }
      } else {
        // If not live, update completely
        updateProduct(productToEdit.id, {
          title,
          brand,
          category,
          sku,
          hsnCode,
          gstRate,
          mrp,
          sellingPrice,
          stock,
          minStockAlert,
          condition,
          partType,
          warrantyMonths,
          weightKg,
          fits: targetFits,
          images,
          description: shortDescription,
          specs,
          status: submitForReview ? "pending_review" : "draft",
        });
        toast.success(
          submitForReview ? "Product submitted for admin review!" : "Product draft saved."
        );
      }
    } else {
      // Creating new product
      addProduct({
        vendorId: vendor.id,
        vendorName: vendor.storeName,
        title,
        brand,
        category,
        subType,
        sku,
        barcode,
        hsnCode,
        gstRate,
        mrp,
        sellingPrice,
        stock,
        minStockAlert,
        condition,
        partType,
        warrantyMonths,
        weightKg,
        originCountry: countryOfOrigin,
        manufacturerDetails,
        fits: targetFits,
        images,
        description: shortDescription,
        specs,
        status: submitForReview ? "pending_review" : "draft",
      } as any);
      toast.success(
        submitForReview
          ? "Product created and queued for admin review!"
          : "Product saved as draft."
      );
    }
    onClose();
  };

  // Submit "Sell Existing Product" Offer
  const handleAddExistingOffer = () => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Vendor must be KYC approved by admin before publishing offers."
      );
      return;
    }
    if (!selectedCatalogProduct) {
      toast.error("Please search and select a catalog product");
      return;
    }
    if (existingOfferPrice <= 0 || existingOfferStock <= 0) {
      toast.error("Please enter a valid selling price and stock");
      return;
    }

    (addProduct as any)({
      id: `offer_${selectedCatalogProduct.id}_${vendor.id}`,
      vendorId: vendor.id,
      vendorName: vendor.storeName,
      title: selectedCatalogProduct.name,
      brand: selectedCatalogProduct.brand,
      category: selectedCatalogProduct.category,
      sku: `OFFER-${selectedCatalogProduct.id}-${vendor.id.slice(-3)}`,
      mrp: existingOfferPrice * 1.15,
      sellingPrice: existingOfferPrice,
      stock: existingOfferStock,
      condition: existingOfferCondition,
      partType: "Genuine",
      warrantyMonths: selectedCatalogProduct.warrantyMonths || 12,
      fits: selectedCatalogProduct.fits || [],
      images: [selectedCatalogProduct.image],
      description: `Offer on official ${selectedCatalogProduct.name}`,
      status: "pending_review",
    });

    toast.success("Offer submitted for admin verification!");
    onClose();
  };

  // CSV Bulk Download Template
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "Title,Brand,Category,SKU,MRP,SellingPrice,Stock,WarrantyMonths,PartType,HSN\n" +
      "Lithium 60V 30Ah Battery,VoltRide,Battery,SKU-BATT-6030,65000,58000,15,36,OEM,85076000\n" +
      "Fast Charger 3.3kW Type-2,ChargeMax,Charger,SKU-CHG-3300,16000,13500,25,12,Genuine,85044030\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "riderzpro_bulk_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV File Parse
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCsvErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setCsvErrors(["CSV file must have a header row and at least 1 data row."]);
        return;
      }

      const errors: string[] = [];
      let validCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length < 6) {
          errors.push(`Row ${i + 1}: Missing required columns`);
          continue;
        }
        const [rowTitle, rowBrand, rowCategory, rowSku, rowMrp, rowPrice] = cols;
        if (!rowTitle || !rowBrand || !rowSku) {
          errors.push(`Row ${i + 1}: Title, Brand, and SKU are required`);
          continue;
        }
        if (isNaN(Number(rowMrp)) || isNaN(Number(rowPrice))) {
          errors.push(`Row ${i + 1}: MRP and SellingPrice must be numeric`);
          continue;
        }
        validCount++;
      }

      setCsvErrors(errors);
      setCsvSuccessCount(validCount);
    };
    reader.readAsText(file);
  };

  const handleProcessCsv = () => {
    if (!isKycApproved) {
      toast.error(
        "Action blocked: Vendor must be KYC approved by admin before importing products."
      );
      return;
    }
    if (csvSuccessCount === 0) {
      toast.error("No valid rows to import");
      return;
    }
    toast.success(`Imported ${csvSuccessCount} products as drafts for review!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900">
              {productToEdit ? "Edit Product Listing" : "Add Product to Catalog"}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              {productToEdit
                ? "Update pricing or create a specification revision."
                : "List a new SKU or sell an existing catalog product."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Listing Mode Selector (if not editing) */}
        {!productToEdit && (
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white px-4 sm:px-6 pt-3 gap-4 sm:gap-6 no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setMode("NEW")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                mode === "NEW"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              1. Create New Product
            </button>
            <button
              onClick={() => setMode("EXISTING_OFFER")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                mode === "EXISTING_OFFER"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              2. Sell Existing Product (Amazon-style)
            </button>
            <button
              onClick={() => setMode("CSV_BULK")}
              className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                mode === "CSV_BULK"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              3. Bulk CSV Upload
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* KYC Lock Warning Banner */}
          {!isKycApproved && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  Catalogue Locked — KYC Verification Pending
                </p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Your seller account is currently{" "}
                  <span className="font-mono font-bold uppercase">{vendor.status.replace("_", " ")}</span>.
                  Adding and modifying products will be enabled once your seller KYC is approved by the admin.
                </p>
              </div>
            </div>
          )}

          {/* MODE 1: CREATE / EDIT PRODUCT */}
          {mode === "NEW" && (
            <>
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#E31E24]" />
                  Basic Product Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. VoltRide 60V 30Ah Li-ion NMC Battery Pack with IP67 BMS"
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. VoltRide, Brembo, Ather"
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value as Category)}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      SKU (Stock Keeping Unit) *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      placeholder="e.g. VR-6030-NMC"
                      className="w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 bg-white font-medium uppercase focus:border-[#E31E24]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Part Classification
                    </label>
                    <select
                      value={partType}
                      onChange={(e) => setPartType(e.target.value as any)}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
                    >
                      <option value="OEM">OEM (Original Equipment Manufacturer)</option>
                      <option value="Genuine">Genuine Certified</option>
                      <option value="Aftermarket">Aftermarket High Performance</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Short Description *
                    </label>
                    <textarea
                      rows={2}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Concise overview of features, chemistry, and warranty..."
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing, Tax & Inventory */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#E31E24]" />
                  Pricing, Tax & Inventory
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">MRP (₹) *</label>
                    <input
                      type="number"
                      value={mrp || ""}
                      onChange={(e) => setMrp(Number(e.target.value))}
                      placeholder="65000"
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={sellingPrice || ""}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      placeholder="58000"
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Stock Units *</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Min Stock Alert</label>
                    <input
                      type="number"
                      value={minStockAlert}
                      onChange={(e) => setMinStockAlert(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">HSN Code</label>
                    <input
                      type="text"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      className="w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">GST Slab (%)</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white"
                    >
                      <option value={5}>5% (EV Vehicles)</option>
                      <option value={12}>12%</option>
                      <option value={18}>18% (Standard Auto Parts)</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Warranty (Months)</label>
                    <input
                      type="number"
                      value={warrantyMonths}
                      onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Category-Specific Specifications */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-display font-bold text-sm text-gray-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#E31E24]" />
                    Technical Specs ({category})
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    Category specific parameters
                  </span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(category === "Battery" ||
                    category === "Charger" ||
                    category === "BMS" ||
                    category === "Motor" ||
                    category === "Controller") && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Operating Voltage
                      </label>
                      <select
                        value={specs.voltage || "60V"}
                        onChange={(e) => setSpecs((p) => ({ ...p, voltage: e.target.value }))}
                        className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
                      >
                        <option value="48V">48V (Ather / TVS)</option>
                        <option value="60V">60V (Ola / Chetak / Vida)</option>
                        <option value="72V">72V (Revolt / Performance)</option>
                      </select>
                    </div>
                  )}

                  {category === "Battery" && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Capacity (Ah)
                        </label>
                        <input
                          type="text"
                          value={specs.capacityAh || ""}
                          onChange={(e) => setSpecs((p) => ({ ...p, capacityAh: e.target.value }))}
                          placeholder="e.g. 30Ah"
                          className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Chemistry</label>
                        <select
                          value={specs.chemistry || "NMC"}
                          onChange={(e) => setSpecs((p) => ({ ...p, chemistry: e.target.value }))}
                          className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white"
                        >
                          <option value="NMC">NMC (Nickel Manganese Cobalt)</option>
                          <option value="LiFePO4">LiFePO4 (Lithium Iron Phosphate)</option>
                          <option value="LTO">LTO (Lithium Titanate)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">IP Rating</label>
                        <input
                          type="text"
                          value={specs.ipRating || "IP67"}
                          onChange={(e) => setSpecs((p) => ({ ...p, ipRating: e.target.value }))}
                          className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                        />
                      </div>
                    </>
                  )}

                  {category === "Riding Gear & Helmets" && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Safety Certification
                      </label>
                      <input
                        type="text"
                        value={specs.certification || "ISI 4151 / ECE 22.06"}
                        onChange={(e) => setSpecs((p) => ({ ...p, certification: e.target.value }))}
                        className="w-full text-xs rounded-xl border border-gray-200 p-2.5"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Fitment Compatibility */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#E31E24]" />
                    Compatible EV Bike Models
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fitsAll}
                      onChange={(e) => setFitsAll(e.target.checked)}
                      className="accent-[#E31E24] h-4 w-4 rounded"
                    />
                    Universal Fit (Fits all models)
                  </label>
                </div>

                {voltageMismatch && !fitsAll && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      Notice: Selected product voltage ({specs.voltage}) does not match the native
                      battery voltage of one or more checked bike models.
                    </span>
                  </div>
                )}

                {!fitsAll && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATALOG_BIKES.map((bike) => {
                      const isSelected = selectedBikes.includes(bike.id);
                      return (
                        <button
                          key={bike.id}
                          type="button"
                          onClick={() => toggleBikeFit(bike.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? "bg-red-50 border-[#E31E24] text-[#E31E24]"
                              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <span>
                            {(bike as any).name || `${bike.make} ${bike.model}`} ({bike.voltage}V)
                          </span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#E31E24]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Images (Min 3, Max 8) */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-gray-900 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-[#E31E24]" />
                      Product Gallery ({images.length} of 8 images)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Minimum 3 images required. High-res, square recommended.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= 8 || isUploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-2xs"
                    >
                      <img src={img} alt={`Item ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#E31E24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Main
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => makeMainImage(idx)}
                            className="bg-white text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded hover:bg-gray-100"
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {images.length < 8 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E31E24] flex flex-col items-center justify-center text-gray-400 hover:text-[#E31E24] transition cursor-pointer"
                    >
                      <Plus className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-bold">Add Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* MODE 2: SELL AN EXISTING PRODUCT */}
          {mode === "EXISTING_OFFER" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-bold text-xs text-blue-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  List Your Offer on Existing Catalog Products
                </h4>
                <p className="text-xs text-blue-800 mt-1">
                  Search from pre-verified products in the RiderzPro catalog. You only need to set
                  your selling price, available inventory, and condition.
                </p>
              </div>

              {/* Search bar */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Search Catalog by Title or Brand
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={existingSearchQuery}
                    onChange={(e) => setExistingSearchQuery(e.target.value)}
                    placeholder="Search e.g. VoltRide, Charger, Brembo..."
                    className="w-full text-xs pl-9 rounded-xl border border-gray-200 p-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Search results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {STATIC_CATALOG_PRODUCTS.filter(
                  (p) =>
                    !existingSearchQuery ||
                    p.name.toLowerCase().includes(existingSearchQuery.toLowerCase()) ||
                    p.brand.toLowerCase().includes(existingSearchQuery.toLowerCase())
                ).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedCatalogProduct(prod);
                      setExistingOfferPrice(prod.offers[0]?.price || 1000);
                    }}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                      selectedCatalogProduct?.id === prod.id
                        ? "border-[#E31E24] bg-red-50/50 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {prod.category} · {prod.brand}
                      </p>
                      <p className="text-xs font-bold text-[#E31E24] mt-0.5">
                        Base: ₹{prod.offers[0]?.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offer pricing inputs if product selected */}
              {selectedCatalogProduct && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-4">
                  <h4 className="font-bold text-xs text-gray-900">
                    Your Offer Details for: {selectedCatalogProduct.name}
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Your Price (₹)
                      </label>
                      <input
                        type="number"
                        value={existingOfferPrice}
                        onChange={(e) => setExistingOfferPrice(Number(e.target.value))}
                        className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={existingOfferStock}
                        onChange={(e) => setExistingOfferStock(Number(e.target.value))}
                        className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Condition</label>
                      <select
                        value={existingOfferCondition}
                        onChange={(e) => setExistingOfferCondition(e.target.value as any)}
                        className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
                      >
                        <option value="New">Brand New</option>
                        <option value="Refurbished">Refurbished / Certified</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleAddExistingOffer}
                      disabled={!isKycApproved}
                      className={`inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition ${
                        isKycApproved
                          ? "bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                      }`}
                    >
                      {!isKycApproved && <Lock className="h-3.5 w-3.5" />}
                      <span>Publish Offer to Catalog</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: CSV BULK UPLOAD */}
          {mode === "CSV_BULK" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-[#E31E24]" />
                    <h4 className="font-bold text-sm text-gray-900">Bulk Product CSV Upload</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV Template
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Upload multiple catalog items using our structured CSV file. The system validates
                  SKUs, mandatory columns, and tax slabs with row-level error reporting.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#E31E24] transition bg-white">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer">
                  <FileSpreadsheet className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-800">
                    {csvFile ? csvFile.name : "Click to select CSV spreadsheet"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Maximum file size: 5 MB</p>
                </label>
              </div>

              {/* Errors report */}
              {csvErrors.length > 0 && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-1">
                  <h5 className="font-bold text-xs text-red-900 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Row Validation Errors ({csvErrors.length})
                  </h5>
                  <ul className="text-xs text-red-800 list-disc pl-5 space-y-0.5 max-h-36 overflow-y-auto">
                    {csvErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {csvSuccessCount > 0 && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{csvSuccessCount} products ready to import</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleProcessCsv}
                    disabled={!isKycApproved}
                    className={`inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition ${
                      isKycApproved
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                    }`}
                  >
                    {!isKycApproved && <Lock className="h-3.5 w-3.5" />}
                    <span>Import All ({csvSuccessCount})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions for Mode 1 */}
        {mode === "NEW" && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-gray-500 hover:text-black transition py-1 text-center"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={!isKycApproved}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold transition ${
                  isKycApproved
                    ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={!isKycApproved}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition ${
                  isKycApproved
                    ? "bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {!isKycApproved && <Lock className="h-3.5 w-3.5" />}
                <span>Submit for Admin Review</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
