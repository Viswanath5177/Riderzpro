import React, { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, AlertTriangle, X,
  Trash2, Download, RefreshCw, Eye, ArrowRight, Layers
} from "lucide-react";
import { toast } from "sonner";

export interface JsonProductItem {
  id?: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  sku: string;
  price: number;
  stock: number;
  images?: Array<{ url: string; alt?: string } | string>;
  specifications?: Record<string, any>;
  vehicle_type?: string;
  department?: string;
  warranty?: string;
  delivery_days?: string;
}

interface ParsedRow {
  index: number;
  data: JsonProductItem;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

interface JsonProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  onImportSuccess: () => void;
}

const SAMPLE_TEMPLATE = {
  products: [
    {
      name: "High Torque Ceramic Disc Brake Rotor 220mm",
      description: "Ventilated 220mm stainless steel front brake rotor with heat-dissipating aerodynamic cutouts for high-performance electric motorcycles.",
      category: "Braking & Safety",
      brand: "Brembo Racing",
      sku: "BRK-CER-220",
      price: 2499,
      stock: 5,
      images: [
        {
          url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
          alt: "Brake rotor front view"
        }
      ],
      specifications: {
        diameter: "220mm",
        material: "AISI 420 High Carbon Stainless Steel",
        bolt_pattern: "6-Bolt Direct Mount"
      }
    },
    {
      name: "Smart 72V 100A Bluetooth BMS Module",
      description: "Advanced smart battery management system with active balancing and low-temperature charge cutoff protection.",
      category: "BMS Systems",
      brand: "Daly Smart",
      sku: "BMS-72V-100A",
      price: 5899,
      stock: 12,
      images: [
        {
          url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
          alt: "Smart BMS Module"
        }
      ],
      specifications: {
        voltage: "72V 20S Li-Ion",
        discharge_current: "100A Peak",
        communication: "UART / Bluetooth 5.0"
      }
    },
    {
      name: "Quick-Release Ergonomic Handlebar Grips",
      description: "Ultra-grip dual density silicone grips with integrated vibration absorption for endurance long-distance riding.",
      category: "Accessories",
      brand: "Riderz Pro Series",
      sku: "GRP-SIL-BLK",
      price: 899,
      stock: 3,
      images: [
        {
          url: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&auto=format&fit=crop&q=80",
          alt: "Ergonomic silicone grip"
        }
      ],
      specifications: {
        color: "Stealth Black",
        inner_diameter: "22.2mm Universal"
      }
    }
  ]
};

export function JsonProductImportModal({
  isOpen,
  onClose,
  sellerId,
  onImportSuccess,
}: JsonProductImportModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [jsonText, setJsonText] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<{
    successCount: number;
    failedCount: number;
    imported: any[];
    errors: any[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateProductsArray = (rawProducts: any[]): ParsedRow[] => {
    const skuMap = new Map<string, number>();

    // Pass 1: count explicitly provided SKUs
    rawProducts.forEach((p) => {
      const sku = (p.sku || p.SKU || p.sku_code || p.product_code || "").toString().trim().toUpperCase();
      if (sku) {
        skuMap.set(sku, (skuMap.get(sku) || 0) + 1);
      }
    });

    // Pass 2: validate each row
    return rawProducts.map((p, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      const name = (p.name || p.title || p.product_name || p.productName || p.label || "").toString().trim();
      if (!name) {
        errors.push("Missing or invalid product name.");
      }

      const rawPrice = p.price ?? p.selling_price ?? p.sellingPrice ?? p.mrp ?? p.cost ?? p.amount ?? p.unit_price;
      const priceNum = Number(rawPrice);
      if (rawPrice === undefined || rawPrice === null || isNaN(priceNum) || priceNum <= 0) {
        errors.push("Price must be a valid non-negative number.");
      }

      const rawStock = p.stock ?? p.quantity ?? p.qty ?? p.inventory ?? p.units ?? 10;
      const stockNum = parseInt(String(rawStock), 10);
      if (isNaN(stockNum) || stockNum < 0) {
        errors.push("Stock must be a valid non-negative integer.");
      }

      let sku = (p.sku || p.SKU || p.sku_code || p.product_code || p.item_code || p.code || p.id || "").toString().trim();
      if (!sku) {
        sku = `SKU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`;
      } else if (skuMap.get(sku.toUpperCase()) && skuMap.get(sku.toUpperCase())! > 1) {
        // Automatically make batch duplicates unique
        sku = `${sku}-${index + 1}`;
      }

      const category = (p.category || p.department || p.category_name || p.categoryName || "Vehicle Accessories & Mounts").toString().trim();
      const brand = (p.brand || p.make || p.manufacturer || "Riderzpro Certified").toString().trim();
      const description = (p.description || p.desc || p.details || p.summary || `${brand} ${name}`).toString().trim();

      // Check stock warning
      if (stockNum <= 5 && stockNum > 0) {
        warnings.push("Stock is <= 5 (Hurry! Limited stock label will display).");
      } else if (stockNum === 0) {
        warnings.push("Stock is 0 (Will display Out of Stock).");
      }

      let images: any[] = [];
      if (Array.isArray(p.images) && p.images.length > 0) {
        images = p.images;
      } else if (p.image_url) {
        images = [p.image_url];
      } else if (p.imageUrl) {
        images = [p.imageUrl];
      } else if (p.image) {
        images = [p.image];
      }

      const rowData: JsonProductItem = {
        name,
        description,
        category,
        brand,
        sku,
        price: isNaN(priceNum) ? 0 : priceNum,
        stock: isNaN(stockNum) ? 10 : stockNum,
        images,
        specifications: p.specifications && typeof p.specifications === "object" ? p.specifications : {},
      };

      return {
        index,
        data: rowData,
        errors,
        warnings,
        isValid: errors.length === 0,
      };
    });
  };

  const handleParseJson = (rawContent: string) => {
    try {
      const parsed = JSON.parse(rawContent);
      let items: any[] = [];
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.products)) items = parsed.products;
        else if (Array.isArray(parsed.items)) items = parsed.items;
        else if (Array.isArray(parsed.data)) items = parsed.data;
        else if (Array.isArray(parsed.catalog)) items = parsed.catalog;
        else if (Array.isArray(parsed.listings)) items = parsed.listings;
        else if (Array.isArray(parsed.records)) items = parsed.records;
        else if (parsed.name || parsed.title) items = [parsed];
        else throw new Error("Could not find a list of products in the provided JSON.");
      } else {
        throw new Error("JSON must be an array of products or an object containing a 'products' array.");
      }

      if (items.length === 0) {
        toast.error("JSON file contains 0 products.");
        return;
      }

      if (items.length > 100) {
        toast.error("Maximum 100 products allowed per batch import.");
        return;
      }

      const rows = validateProductsArray(items);
      setParsedRows(rows);
      setHasParsed(true);
      const invalidCount = rows.filter((r) => !r.isValid).length;
      if (invalidCount > 0) {
        toast.warning(`Parsed ${rows.length} products. ${invalidCount} have validation errors.`);
      } else {
        toast.success(`Parsed ${rows.length} valid products ready to import!`);
      }
    } catch (err: any) {
      toast.error(`JSON Parse Error: ${err.message || "Invalid JSON format"}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      toast.error("Please upload a valid .json file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      handleParseJson(text);
    };
    reader.readAsText(file);
  };

  const handleRemoveRow = (index: number) => {
    setParsedRows((prev) => {
      const updated = prev.filter((r) => r.index !== index);
      // Re-validate for duplicate SKUs
      return validateProductsArray(updated.map((r) => r.data));
    });
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "riderzpro_products_sample_template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Sample import JSON template downloaded!");
  };

  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error("No valid products to import. Please fix errors first.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Importing ${validRows.length} products to database...`);

    try {
      const res = await fetch("/api/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          seller_id: sellerId,
          products: validRows.map((r) => r.data),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Bulk import failed on server.");
      }

      toast.dismiss(toastId);
      toast.success(`Successfully imported ${result.importedCount} products into database!`, {
        description: "Products saved in pending approval status. Admin certification required before public storefront display.",
      });

      setImportResult({
        successCount: result.importedCount,
        failedCount: result.failedCount || 0,
        imported: result.imported || [],
        errors: result.errors || [],
      });

      onImportSuccess();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to complete bulk product import.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageThumbnail = (item: JsonProductItem) => {
    if (item.images && item.images.length > 0) {
      const first = item.images[0];
      const url = typeof first === "string" ? first : first.url;
      if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
        return url;
      }
    }
    return "/src/assets/parts.jpg";
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Import Products from JSON</h2>
              <p className="text-xs text-muted-foreground">
                Bulk upload catalog specifications, images, and inventory for your store.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {importResult ? (
            /* Import Success Summary Screen */
            <div className="space-y-6 text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Bulk Import Complete!</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {importResult.successCount} products have been securely persisted to the marketplace database under your store.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-xs font-semibold text-emerald-700">Imported Successfully</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{importResult.successCount}</div>
                  <span className="text-xs text-muted-foreground">Status: Pending Admin Review</span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/40">
                  <span className="text-xs font-semibold text-muted-foreground">Failed / Skipped</span>
                  <div className="text-2xl font-bold text-foreground mt-1">{importResult.failedCount}</div>
                  <span className="text-xs text-muted-foreground">Validation rejects</span>
                </div>
              </div>

              {importResult.imported.length > 0 && (
                <div className="text-left border border-border rounded-xl p-4 bg-muted/20 max-h-48 overflow-y-auto">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Imported Records</h4>
                  <ul className="divide-y divide-border text-xs">
                    {importResult.imported.map((item, idx) => (
                      <li key={idx} className="py-2 flex items-center justify-between">
                        <span className="font-semibold text-foreground">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">{item.sku}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Pending Approval
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setImportResult(null);
                    setHasParsed(false);
                    setParsedRows([]);
                    setJsonText("");
                  }}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
                >
                  Import Another File
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90"
                >
                  Done & View Inventory
                </button>
              </div>
            </div>
          ) : !hasParsed ? (
            /* Upload & Input Screen */
            <div className="space-y-6">
              {/* Top Banner with Download Sample */}
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Need the JSON Specification Template?</h4>
                    <p className="text-xs text-muted-foreground">
                      Download the official schema template with sample products, images, and specifications.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Sample JSON
                </button>
              </div>

              {/* Tabs: Upload File vs Paste JSON */}
              <div className="flex border-b border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab("file")}
                  className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 ${
                    activeTab === "file"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Upload .JSON File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("paste")}
                  className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 ${
                    activeTab === "paste"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paste Raw JSON
                </button>
              </div>

              {activeTab === "file" ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition rounded-2xl p-10 text-center space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Click to browse or drag & drop JSON file</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Supports standard UTF-8 JSON files up to 5MB (max 100 products)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={12}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='{ "products": [ { "name": "...", "price": 1299, "stock": 4, "sku": "...", "category": "Accessories" } ] }'
                    className="w-full font-mono text-xs p-3.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!jsonText.trim()}
                      onClick={() => handleParseJson(jsonText)}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Parse & Validate JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Parsed Review & Validation Preview Screen */
            <div className="space-y-4">
              {/* Summary Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-foreground">
                    Total Products: {parsedRows.length}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {validCount} Valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      <AlertTriangle className="h-3.5 w-3.5" /> {invalidCount} Invalid
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHasParsed(false);
                      setParsedRows([]);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                  >
                    Re-upload / Change File
                  </button>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-border rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Item Preview</th>
                      <th className="px-3">Category / Brand</th>
                      <th className="px-3">SKU</th>
                      <th className="px-3">Price</th>
                      <th className="px-3">Stock & Badge</th>
                      <th className="px-3">Status</th>
                      <th className="px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedRows.map((row) => {
                      const img = getImageThumbnail(row.data);
                      const isLowStock = row.data.stock <= 5 && row.data.stock > 0;
                      const isOutOfStock = row.data.stock === 0;

                      return (
                        <tr
                          key={row.index}
                          className={`hover:bg-muted/20 transition ${
                            !row.isValid ? "bg-rose-500/5" : ""
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={img}
                                alt={row.data.name}
                                className="h-9 w-9 rounded-lg object-cover border border-border bg-muted shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                                }}
                              />
                              <div className="min-w-0 max-w-[200px]">
                                <p className="font-semibold text-foreground truncate">{row.data.name}</p>
                                {row.data.description && (
                                  <p className="text-[11px] text-muted-foreground truncate">{row.data.description}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-3">
                            <div className="font-medium text-foreground">{row.data.category}</div>
                            <div className="text-[10px] text-muted-foreground">{row.data.brand || "—"}</div>
                          </td>

                          <td className="px-3 font-mono font-medium text-foreground">
                            {row.data.sku}
                          </td>

                          <td className="px-3 font-bold text-foreground">
                            ₹{row.data.price.toLocaleString("en-IN")}
                          </td>

                          <td className="px-3">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{row.data.stock} units</span>
                              {isLowStock && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 w-max">
                                  Hurry! Limited stock
                                </span>
                              )}
                              {isOutOfStock && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 w-max">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-3">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
                            ) : (
                              <div className="space-y-0.5">
                                {row.errors.map((err, i) => (
                                  <p key={i} className="text-[10px] font-medium text-rose-600 flex items-center gap-1">
                                    <AlertTriangle className="h-2.5 w-2.5 shrink-0" /> {err}
                                  </p>
                                ))}
                              </div>
                            )}
                          </td>

                          <td className="px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.index)}
                              title="Remove item from batch"
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Warning note about approval */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-700 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Catalog Certification Notice: </span>
                  Imported products will be saved in <code className="font-mono font-bold">pending_approval</code> status.
                  Per marketplace security policies, items will become visible in customer listings once certified by Product Administrators.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!importResult && hasParsed && (
          <div className="border-t border-border px-6 py-4 bg-muted/20 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {validCount} ready for import ({invalidCount} invalid will be excluded)
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={validCount === 0 || isSubmitting}
                onClick={handleExecuteImport}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Persisting to Database...
                  </>
                ) : (
                  <>
                    Confirm Import ({validCount} Products)
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
