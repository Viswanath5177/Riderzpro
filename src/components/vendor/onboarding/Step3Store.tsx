import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Store,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Tag,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor, VendorSellerType, VendorBrandListing } from "@/lib/vendor/types";
import { vendorStoreSchema } from "@/lib/vendor/validators";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import type { Category } from "@/lib/data";

const ALL_CATEGORIES: Category[] = [
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

const SUGGESTED_BRANDS = [
  "VoltRide",
  "ChargeMax",
  "Daly",
  "QS Motor",
  "Kelly",
  "Brembo",
  "Ather Energy",
  "Ola Electric",
  "Revolt Motors",
  "SMK Helmets",
  "Rynox Gear",
  "ViaTerra Gear",
  "Motul",
];

interface Step3StoreProps {
  vendor: Vendor;
  onBack: () => void;
  onSaveAndNext: (data: any) => void;
}

export function Step3Store({ vendor, onBack, onSaveAndNext }: Step3StoreProps) {
  const { vendors } = useVendorStore();
  const defaultStore = vendor.onboarding.store;

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    defaultStore?.categories?.length ? defaultStore.categories : ["Battery", "Charger"]
  );

  const [brands, setBrands] = useState<VendorBrandListing[]>(
    defaultStore?.brands?.length
      ? defaultStore.brands
      : [
          { name: "VoltRide", authType: "Authorised" },
          { name: "ChargeMax", authType: "Authorised" },
        ]
  );
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandAuth, setNewBrandAuth] = useState<"Authorised" | "Own brand" | "Unbranded">("Authorised");

  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    defaultStore?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    defaultStore?.bannerUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorStoreSchema),
    defaultValues: {
      storeName: defaultStore?.storeName || vendor.storeName || "VoltHub Indiranagar",
      slug: defaultStore?.slug || vendor.slug || "volthub-indiranagar",
      tagline: defaultStore?.tagline || "Premier EV Batteries & Chargers",
      description: defaultStore?.description || "Verified distributor and dealer for EV spares, batteries and high-power fast chargers.",
      sellerType: (defaultStore?.sellerType || "Authorised dealer") as VendorSellerType,
      categories: selectedCategories,
      brands: brands,
      yearsInBusiness: defaultStore?.yearsInBusiness ?? 3,
      website: defaultStore?.website || "",
      instagram: defaultStore?.instagram || "",
    },
  });

  const storeNameValue = watch("storeName");

  // Check name uniqueness live
  const isNameAvailable =
    storeNameValue &&
    storeNameValue.trim().length >= 3 &&
    !vendors.some(
      (v) => v.id !== vendor.id && v.storeName?.toLowerCase() === storeNameValue.trim().toLowerCase()
    );

  const handleNameChange = (val: string) => {
    setValue("storeName", val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", generatedSlug);
  };

  const toggleCategory = (cat: Category) => {
    let next: Category[];
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        toast.error("Select at least one category to sell");
        return;
      }
      next = selectedCategories.filter((c) => c !== cat);
    } else {
      next = [...selectedCategories, cat];
    }
    setSelectedCategories(next);
    setValue("categories", next);
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim()) return;
    if (brands.some((b) => b.name.toLowerCase() === newBrandName.trim().toLowerCase())) {
      toast.error("Brand already added");
      return;
    }
    const updated = [...brands, { name: newBrandName.trim(), authType: newBrandAuth }];
    setBrands(updated);
    setValue("brands", updated);
    setNewBrandName("");
  };

  const handleRemoveBrand = (index: number) => {
    if (brands.length <= 1) {
      toast.error("Please keep at least one brand listed");
      return;
    }
    const updated = brands.filter((_, i) => i !== index);
    setBrands(updated);
    setValue("brands", updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setLogoPreview(url);
        setValue("storeName", watch("storeName")); // trigger touch
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setBannerPreview(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (formData: any) => {
    if (!selectedCategories.length) {
      toast.error("Select at least one category to sell");
      return;
    }
    if (!brands.length) {
      toast.error("Please add at least one brand");
      return;
    }

    onSaveAndNext({
      store: {
        ...formData,
        categories: selectedCategories,
        brands,
        logoUrl: logoPreview,
        bannerUrl: bannerPreview,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 3 of 6</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
          Store Profile & Brand Offerings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define your storefront brand name, customer slug, categories and authorized dealership brands.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Store Name & Slug */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Store Display Name
              </label>
              {isNameAvailable && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Name Available
                </span>
              )}
            </div>
            <input
              type="text"
              {...register("storeName")}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. VoltHub Indiranagar"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-bold outline-none focus:border-primary"
            />
            {errors.storeName && (
              <p className="mt-1 text-xs text-destructive">{errors.storeName.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Storefront URL Slug
            </label>
            <div className="flex items-center rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground font-mono">
              <span className="shrink-0 text-gray-400">/store/</span>
              <input
                type="text"
                {...register("slug")}
                className="w-full bg-transparent font-bold text-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tagline & Description */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Store Tagline
            </label>
            <input
              type="text"
              {...register("tagline")}
              placeholder="e.g. Authorized EV Batteries & Fast Chargers"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Store Description (Max 300 Characters)
            </label>
            <textarea
              rows={2}
              maxLength={300}
              {...register("description")}
              placeholder="Tell riders about your genuine parts, battery certifications and warranty support..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message as string}</p>
            )}
          </div>
        </div>

        {/* Seller Type & Years in Business */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Seller Type
            </label>
            <select
              {...register("sellerType")}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer"
            >
              <option value="Authorised dealer">Authorised Dealer</option>
              <option value="Manufacturer">Manufacturer / OEM</option>
              <option value="Distributor">Distributor / Stockist</option>
              <option value="Retailer">Independent Retailer</option>
              <option value="Reseller">Reseller</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Years in Auto / EV Business
            </label>
            <input
              type="number"
              min={0}
              max={100}
              {...register("yearsInBusiness")}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Categories Multi-Select */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Categories You Intend to Sell (Multi-Select)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    active
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands Section */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <label className="block text-xs font-bold text-foreground">
            Brands You Sell & Authorization Status
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {brands.map((b, idx) => (
              <span
                key={b.name + idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-border text-xs font-semibold shadow-2xs"
              >
                <span>{b.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">({b.authType})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBrand(idx)}
                  className="text-gray-400 hover:text-destructive"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add brand input */}
          <div className="flex flex-wrap gap-2 pt-1">
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Brand name (e.g. Daly, Brembo)"
              className="flex-1 min-w-[140px] rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
            />
            <select
              value={newBrandAuth}
              onChange={(e) => setNewBrandAuth(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none cursor-pointer"
            >
              <option value="Authorised">Authorised</option>
              <option value="Own brand">Own Brand</option>
              <option value="Unbranded">Unbranded</option>
            </select>
            <button
              type="button"
              onClick={handleAddBrand}
              className="rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold hover:opacity-90 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Brand
            </button>
          </div>
        </div>

        {/* Logo and Banner Upload Previews */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Store Logo (Square)
            </label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Store Logo"
                  className="h-14 w-14 rounded-xl object-cover border border-border bg-white shrink-0"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition">
                  <Upload className="h-3.5 w-3.5" /> Change Logo
                </span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Storefront Banner
            </label>
            <div className="flex items-center gap-3">
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt="Store Banner"
                  className="h-14 w-24 rounded-xl object-cover border border-border bg-white shrink-0"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition">
                  <Upload className="h-3.5 w-3.5" /> Change Banner
                </span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
          >
            <span>Continue to Shipping & Pickup</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
