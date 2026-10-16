import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Truck,
  Clock,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  Package,
  PlusCircle,
  Edit3,
  Trash2,
  Check,
  X,
  Home,
  Briefcase,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getProduct, getVendor, inr, products } from "@/lib/data";
import { quoteCart, useStore, type Order } from "@/lib/store";
import type { AddressRef } from "@/lib/logistics/types";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart & Checkout — RiderzPro" },
      { name: "description", content: "Review items, select doorstep delivery address, and place verified EV parts order." },
      { property: "og:title", content: "Shopping Cart & Checkout — RiderzPro" },
      { property: "og:description", content: "Multi-vendor EV parts checkout with courier delivery." },
    ],
  }),
  component: CartPage,
});

interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  street_address: string;
  house_flat?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: number;
  delivery_instructions?: string | null;
}

interface ActiveCoupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order_value?: number;
  maximum_discount?: number;
  expires_at?: string;
  productId?: string;
}

import { isMobileDevice } from "@/lib/native/app";

function CartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  const { cart, setQty, clearCart, placeOrderWithOptions, inventoryStock, addToCart, setUserLocation } = useStore();
  const { user, isAuthenticated, openCustomerLoginModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Address state: strictly database backed
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Address Modal (Add / Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    recipientName: "",
    phone: "",
    houseFlat: "",
    streetLocality: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "",
    deliveryInstructions: "",
    isDefault: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Active vendor promotions discovered for cart products
  const [cartCoupons, setCartCoupons] = useState<ActiveCoupon[]>([]);

  // Filter cart to only valid existing active products
  const validCart = useMemo(() => {
    return cart.filter((it) => Boolean(getProduct(it.productId)));
  }, [cart]);

  // Clean stale/phantom items if any invalid items were present
  useEffect(() => {
    if (cart.length > 0 && validCart.length === 0) {
      clearCart();
    }
  }, [cart, validCart, clearCart]);

  // Load database addresses for authenticated user
  const loadAddresses = useCallback(() => {
    setIsLoadingAddresses(true);
    fetch("/api/customer/addresses", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSavedAddresses(data.data);
          if (data.data.length > 0) {
            const def = data.data.find((a: any) => a.is_default) || data.data[0];
            setSelectedAddressId((prev) => {
              if (prev && data.data.some((a: any) => a.id === prev)) return prev;
              return def.id;
            });
            setUserLocation({
              id: def.id,
              name: def.street_address || def.city || "Bengaluru",
              city: def.city || "Bengaluru",
              pincode: def.pincode || "560001",
              lat: 12.9716,
              lng: 77.5946,
              tag: `${def.label || "Saved"} (Default)`,
            });
          } else {
            setSelectedAddressId(null);
          }
        } else {
          setSavedAddresses([]);
          setSelectedAddressId(null);
        }
      })
      .catch(() => {
        setSavedAddresses([]);
        setSelectedAddressId(null);
      })
      .finally(() => setIsLoadingAddresses(false));
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses, isAuthenticated]);

  // Check applicable vendor coupons for current valid cart items
  useEffect(() => {
    if (validCart.length === 0) {
      setCartCoupons([]);
      return;
    }

    let isMounted = true;
    const fetchPromos = async () => {
      const found: ActiveCoupon[] = [];
      const seenCouponIds = new Set<string>();

      for (const item of validCart) {
        try {
          const res = await fetch(`/api/coupons/applicable?product_id=${encodeURIComponent(item.productId)}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.coupons)) {
            for (const c of data.coupons) {
              if (!seenCouponIds.has(c.id)) {
                seenCouponIds.add(c.id);
                found.push({ ...c, productId: item.productId });
              }
            }
          }
        } catch {}
      }

      if (isMounted) {
        setCartCoupons(found);
      }
    };

    fetchPromos();
    return () => {
      isMounted = false;
    };
  }, [validCart]);

  // Calculate real vendor coupon discount
  const { appliedVendorDiscount, bestPromo } = useMemo(() => {
    if (validCart.length === 0 || cartCoupons.length === 0) {
      return { appliedVendorDiscount: 0, bestPromo: null };
    }

    let maxDisc = 0;
    let selectedPromo: ActiveCoupon | null = null;

    for (const promo of cartCoupons) {
      // Find matching items in cart for this promo's product
      const matchingItems = validCart.filter((it) => it.productId === promo.productId);
      const subtotalForProduct = matchingItems.reduce((acc, it) => {
        const prod = getProduct(it.productId);
        const price = prod?.offers?.find((o) => o.vendorId === it.vendorId)?.price || prod?.offers?.[0]?.price || 0;
        return acc + price * it.qty;
      }, 0);

      if (promo.minimum_order_value && subtotalForProduct < promo.minimum_order_value) {
        continue;
      }

      let calcDiscount = 0;
      if (promo.discount_type === "percentage") {
        calcDiscount = Math.round(subtotalForProduct * (promo.discount_value / 100));
        if (promo.maximum_discount && calcDiscount > promo.maximum_discount) {
          calcDiscount = promo.maximum_discount;
        }
      } else {
        calcDiscount = Math.min(promo.discount_value, subtotalForProduct);
      }

      if (calcDiscount > maxDisc) {
        maxDisc = calcDiscount;
        selectedPromo = promo;
      }
    }

    return { appliedVendorDiscount: maxDisc, bestPromo: selectedPromo };
  }, [validCart, cartCoupons]);

  const quote = quoteCart(validCart, appliedVendorDiscount);

  // Stock check
  const stockErrors: string[] = [];
  validCart.forEach((item) => {
    const product = getProduct(item.productId);
    const available = inventoryStock[item.productId] ?? 10;
    if (item.qty > available) {
      stockErrors.push(`${product?.name || item.productId} exceeds available stock (${available} units left).`);
    }
  });

  const selectedAddress = useMemo(() => {
    return savedAddresses.find((a) => a.id === selectedAddressId) || null;
  }, [savedAddresses, selectedAddressId]);

  // Open Add Address Modal
  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: "Home",
      recipientName: user?.name || "",
      phone: "",
      houseFlat: "",
      streetLocality: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "",
      deliveryInstructions: "",
      isDefault: savedAddresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  // Open Edit Address Modal
  const handleOpenEditModal = (addr: CustomerAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label || "Home",
      recipientName: addr.recipient_name || "",
      phone: addr.phone || "",
      houseFlat: addr.house_flat || "",
      streetLocality: addr.street_address || "",
      city: addr.city || "Bengaluru",
      state: addr.state || "Karnataka",
      pincode: addr.pincode || "",
      deliveryInstructions: addr.delivery_instructions || "",
      isDefault: addr.is_default === 1,
    });
    setIsAddressModalOpen(true);
  };

  // Save Address (POST or PUT)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.recipientName.trim()) {
      toast.error("Please enter recipient's full name");
      return;
    }
    const cleanPhone = addressForm.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!addressForm.streetLocality.trim()) {
      toast.error("Please enter street address or locality");
      return;
    }
    const cleanPin = addressForm.pincode.replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setIsSavingAddress(true);
    try {
      const isEditing = Boolean(editingAddressId);
      const url = isEditing
        ? `/api/customer/addresses?id=${encodeURIComponent(editingAddressId!)}`
        : "/api/customer/addresses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: addressForm.recipientName.trim(),
          phone: cleanPhone,
          houseFlat: addressForm.houseFlat.trim(),
          streetLocality: addressForm.streetLocality.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          pincode: cleanPin,
          label: addressForm.label,
          deliveryInstructions: addressForm.deliveryInstructions.trim(),
          isDefault: addressForm.isDefault,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Delivery address updated." : "Delivery address saved.");
        setIsAddressModalOpen(false);
        loadAddresses();
        if (data.data?.id) {
          setSelectedAddressId(data.data.id);
          setUserLocation({
            id: data.data.id,
            name: addressForm.streetLocality.trim(),
            city: addressForm.city.trim(),
            pincode: cleanPin,
            lat: 12.9716,
            lng: 77.5946,
            tag: `${addressForm.label} (Selected)`,
          });
        }
      } else {
        toast.error(data.error || "Failed to save delivery address");
      }
    } catch {
      toast.error("Network error while saving address. Please try again.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved delivery address?")) {
      return;
    }

    setDeletingAddressId(addrId);
    try {
      const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(addrId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Delivery address removed.");
        loadAddresses();
        if (selectedAddressId === addrId) {
          setSelectedAddressId(null);
        }
      } else {
        toast.error(data.error || "Failed to delete address");
      }
    } catch {
      toast.error("Network error while deleting address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to complete your checkout.");
      openCustomerLoginModal({
        onAuthenticated: () => {
          toast.success("Signed in! Review your delivery address and confirm order.");
          loadAddresses();
        },
      });
      return;
    }

    if (validCart.length === 0 || quote.itemsTotal <= 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (stockErrors.length > 0) {
      toast.error("Please adjust quantities to match available inventory.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select or add a delivery address to proceed.");
      handleOpenAddModal();
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const shippingAddress: AddressRef = {
      name: selectedAddress.recipient_name,
      phone: selectedAddress.phone,
      street: selectedAddress.house_flat
        ? `${selectedAddress.house_flat}, ${selectedAddress.street_address}`
        : selectedAddress.street_address,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
    };

    // Save order in backend database
    try {
      const orderItems = quote.groups.flatMap((g) =>
        g.items.map((it) => ({
          productId: it.productId,
          qty: it.qty,
          price: it.price,
        }))
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: user?.id,
          seller_id: quote.groups[0]?.vendorId || "sel_volthub_01",
          total_amount: quote.total,
          payment_method: paymentMethod,
          items: orderItems,
          groups: quote.groups,
          shipping_address: {
            ...shippingAddress,
            deliveryInstructions: selectedAddress.delivery_instructions,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsSubmitting(false);
        toast.error(data.error || "Error processing order. Please try again.");
        return;
      }

      const backendOrder = data.data;

      // Sync local store confirmation
      const localOrder = placeOrderWithOptions({
        payment: paymentMethod,
        shippingAddress,
        couponCode: bestPromo?.code,
        discount: appliedVendorDiscount,
      });

      // Override with authoritative backend order details
      const confirmed = {
        ...localOrder,
        id: backendOrder.order_number || backendOrder.id || localOrder.id,
        total: backendOrder.total_amount || localOrder.total,
      };

      clearCart();
      setIsSubmitting(false);
      setConfirmedOrder(confirmed);
      toast.success(`Order #${confirmed.id} placed successfully!`);
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to connect to checkout service. Please try again.");
    }
  };

  // Confirmed Order Screen
  if (confirmedOrder) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center animate-in fade-in duration-200">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="mt-4 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Order Confirmed & Manifested
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Thank you, {confirmedOrder.customerName || "Customer"}!
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Your order <span className="font-mono font-bold text-[#111111]">#{confirmedOrder.id}</span> has been received and scheduled for courier pickup.
          </p>

          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 text-left shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="text-xs font-semibold text-[#6B7280] uppercase">Delivery Address</span>
              <span className="text-xs font-bold text-[#E31E24]">Doorstep Fulfillment</span>
            </div>
            <div className="text-xs text-[#111111] space-y-1">
              <p className="font-bold">{confirmedOrder.shippingAddress?.name}</p>
              <p className="text-[#6B7280]">
                {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city} - {confirmedOrder.shippingAddress?.pincode}
              </p>
              <p className="text-[#6B7280]">Phone: {confirmedOrder.shippingAddress?.phone}</p>
            </div>

            <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-center text-sm">
              <span className="text-xs text-[#6B7280]">Total Paid ({confirmedOrder.payment})</span>
              <span className="font-bold text-lg text-[#111111]">{inr(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard/customer"
              search={{ tab: "orders" } as any}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
            >
              <Truck className="h-4 w-4" />
              <span>Track in Customer Dashboard</span>
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Empty Cart Screen: Exactly matching UI convention with 0 items
  if (validCart.length === 0) {
    const recommendedSpares = products.slice(0, 3);

    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 text-center shadow-2xs space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-[#E31E24]">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Your Cart is Currently Empty
            </h1>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto">
              You don't have any items in your cart. You can check your existing order status in My Orders, or add genuine EV spares below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
              >
                <span>Shop Catalog & Spares</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/customer"
                search={{ tab: "orders" } as any}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <Package className="h-4 w-4 text-[#E31E24]" />
                <span>View My Orders & Deliveries</span>
              </Link>
            </div>
          </div>

          {/* Recommended EV Spares */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 font-display">
                  Recommended EV Spares & Fast Delivery Parts
                </h2>
                <p className="text-xs text-gray-500">
                  Ready for immediate courier dispatch with verified fitment.
                </p>
              </div>
              <Link to="/shop" className="text-xs font-semibold text-[#E31E24] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {recommendedSpares.map((p) => {
                const primaryOffer = p.offers[0];
                return (
                  <div
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-xs transition space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          In Stock
                        </span>
                        <span>{p.brand}</span>
                      </div>
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={200}
                        height={200}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                        }}
                        className="my-3 h-28 w-full rounded-xl object-contain bg-gray-50 p-2"
                      />
                      <h3 className="font-bold text-xs text-gray-900 line-clamp-2">{p.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-1">{p.category}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-extrabold text-xs text-gray-900">{inr(primaryOffer.price)}</span>
                      <button
                        onClick={() => {
                          addToCart(p.id, primaryOffer.vendorId, 1);
                          toast.success(`Added ${p.name} to cart!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white text-[11px] font-bold transition shadow-2xs cursor-pointer"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Active Cart View
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
              Cart & Checkout
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {quote.groups.length} authorized supplier{quote.groups.length > 1 ? "s" : ""} · Combined consolidated dispatch
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Genuine Fitment Guaranteed</span>
          </div>
        </div>

        {stockErrors.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Inventory Allocation Warning:</span>
            </div>
            {stockErrors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* Left Column: Delivery Address & Cart Items */}
          <div className="space-y-6">
            {/* ─────────────────────────────────────────────────────────────
                SECTION 2 — DATABASE-BASED DELIVERY ADDRESS
               ───────────────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E31E24]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    DELIVERY ADDRESS
                  </h3>
                </div>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>+ Add Address</span>
                  </button>
                )}
              </div>

              {/* Case A: Customer has no saved addresses */}
              {isLoadingAddresses ? (
                <div className="py-6 text-center text-xs text-gray-500">
                  Loading saved delivery addresses...
                </div>
              ) : savedAddresses.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#E31E24]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">No saved delivery address</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Please add your doorstep delivery address to check courier serviceability and complete your order.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>+ Add Address</span>
                  </button>
                </div>
              ) : (
                /* Case B: Customer has existing saved addresses (Horizontally Scrollable Cards) */
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2.5">
                    Select delivery destination ({savedAddresses.length} saved):
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = selectedAddressId === addr.id;
                      const IconLabel =
                        addr.label?.toLowerCase() === "work"
                          ? Briefcase
                          : addr.label?.toLowerCase() === "other"
                          ? Building
                          : Home;

                      // Distinguish duplicate labels (e.g. Home (Default), Home #2)
                      const sameType = savedAddresses.filter((a) => a.label === addr.label);
                      let displayLabel = addr.label || "Home";
                      if (addr.is_default) {
                        displayLabel = `${addr.label || "Home"} (Default)`;
                      } else if (sameType.length > 1) {
                        const typeIndex = sameType.findIndex((a) => a.id === addr.id) + 1;
                        displayLabel = `${addr.label || "Home"} #${typeIndex}`;
                      }

                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setUserLocation({
                              id: addr.id,
                              name: addr.street_address || addr.city || "Bengaluru",
                              city: addr.city || "Bengaluru",
                              pincode: addr.pincode || "560001",
                              lat: 12.9716,
                              lng: 77.5946,
                              tag: `${addr.label || "Saved"} (Selected)`,
                            });
                          }}
                          className={`relative flex-shrink-0 w-72 rounded-2xl border p-4 text-xs transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[#E31E24] bg-red-50/20 shadow-md ring-2 ring-[#E31E24]/20"
                              : "border-[#E5E7EB] bg-white hover:border-gray-300 shadow-2xs"
                          }`}
                        >
                          <div>
                            {/* Card Top: Type Label & Radio Indicator */}
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  isSelected
                                    ? "bg-[#E31E24] text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                <IconLabel className="h-3 w-3" />
                                {displayLabel}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                                    isSelected
                                      ? "border-[#E31E24] bg-[#E31E24] text-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                </span>
                              </div>
                            </div>

                            {/* Recipient Details */}
                            <div className="space-y-1">
                              <p className="font-bold text-gray-900 text-xs truncate">
                                {addr.recipient_name}
                              </p>
                              <p className="text-gray-500 text-[11px] font-mono">
                                +91 {addr.phone}
                              </p>
                              <p className="text-gray-700 leading-snug line-clamp-2 mt-1">
                                {addr.house_flat ? `${addr.house_flat}, ` : ""}
                                {addr.street_address}
                              </p>
                              <p className="text-gray-600 font-medium">
                                {addr.city}, {addr.state} - <span className="font-mono font-bold text-gray-900">{addr.pincode}</span>
                              </p>
                              {addr.delivery_instructions && (
                                <p className="text-[10px] text-gray-400 italic line-clamp-1 mt-1">
                                  "{addr.delivery_instructions}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions: Edit / Delete */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                            <span
                              className={`text-[11px] font-bold ${
                                isSelected ? "text-[#E31E24]" : "text-gray-400"
                              }`}
                            >
                              {isSelected ? "Deliver Here" : "Click to Select"}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditModal(addr, e)}
                                title="Edit Address"
                                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingAddressId === addr.id}
                                onClick={(e) => handleDeleteAddress(addr.id, e)}
                                title="Delete Address"
                                className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add New Address Card in scroll row */}
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="flex-shrink-0 w-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-red-50/30 hover:border-red-300 transition p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer text-gray-600 hover:text-[#E31E24]"
                    >
                      <PlusCircle className="h-6 w-6 text-[#E31E24]" />
                      <span className="text-xs font-bold">+ Add Another Address</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items Grouped by Authorized Supplier */}
            <div className="space-y-4">
              {quote.groups.map((g) => {
                const v = getVendor(g.vendorId);
                return (
                  <div key={g.vendorId} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-[#E31E24]" />
                        <span className="font-bold text-xs text-[#111111]">{v.name}</span>
                        <span className="text-[11px] text-[#6B7280]">({v.area})</span>
                      </div>
                      <span className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1 font-medium">
                          <Truck className="h-3.5 w-3.5 text-gray-400" />
                          {g.km} km · {inr(g.fee)}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          ~{g.eta} min
                        </span>
                      </span>
                    </div>

                    <div className="divide-y divide-[#E5E7EB]">
                      {g.items.map((it) => {
                        const p = getProduct(it.productId)!;
                        const availableStock = inventoryStock[it.productId] ?? p?.offers?.[0]?.stock ?? 10;
                        const isStockLow = availableStock < 5;
                        return (
                          <div key={it.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <img
                                src={p?.image}
                                alt={p?.name}
                                loading="lazy"
                                width={70}
                                height={70}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                                }}
                                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-[#E5E7EB] shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs text-[#111111] leading-tight truncate">
                                  {p?.name}
                                </p>
                                <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">
                                  {inr(it.price)} per unit
                                </p>
                                {isStockLow && (
                                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
                                    Only {availableStock} left in stock
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-gray-50 p-0.5">
                                <button
                                  aria-label="Decrease"
                                  onClick={() => setQty(it.productId, g.vendorId, it.qty - 1)}
                                  className="grid h-6 w-6 place-items-center rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-gray-900">{it.qty}</span>
                                <button
                                  aria-label="Increase"
                                  onClick={() => setQty(it.productId, g.vendorId, it.qty + 1)}
                                  className="grid h-6 w-6 place-items-center rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="w-20 text-right font-extrabold text-xs text-[#111111]">
                                {inr(it.price * it.qty)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Correct Checkout Price Summary */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-[#111111] pb-3 border-b border-[#E5E7EB]">
                Price Summary
              </h3>

              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <dt>Items Subtotal</dt>
                  <dd className="font-semibold text-[#111111]">{inr(quote.itemsTotal)}</dd>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <dt>Doorstep Consolidated Logistics</dt>
                  <dd className="font-semibold text-[#111111]">{inr(quote.deliveryTotal)}</dd>
                </div>

                {/* Valid Vendor Product Coupon Discount */}
                {appliedVendorDiscount > 0 && bestPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
                    <dt className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-emerald-600" />
                      <span>Vendor Promotion ({bestPromo.code})</span>
                    </dt>
                    <dd>- {inr(appliedVendorDiscount)}</dd>
                  </div>
                )}

                <div className="flex justify-between text-[#6B7280]">
                  <dt>GST (18% Statutory EV Tax)</dt>
                  <dd className="font-semibold text-[#111111]">{inr(quote.tax)}</dd>
                </div>

                <div className="border-t border-[#E5E7EB] pt-3 flex justify-between font-extrabold text-base text-[#111111]">
                  <dt>Total Amount</dt>
                  <dd className="text-[#E31E24]">{inr(quote.total)}</dd>
                </div>
              </dl>

              {/* Payment Method Selector */}
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#111111] mb-2 uppercase tracking-wider">
                  Payment Method
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    ["UPI", Smartphone],
                    ["Card", CreditCard],
                    ["COD", Banknote],
                  ].map(([label, IconComp]) => {
                    const Icon = IconComp as typeof Smartphone;
                    const isSelected = paymentMethod === label;
                    return (
                      <button
                        key={label as string}
                        type="button"
                        onClick={() => setPaymentMethod(label as string)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label as string}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || stockErrors.length > 0 || !selectedAddressId}
                className="mt-5 w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order & Manifesting...</span>
                ) : !isAuthenticated ? (
                  <>
                    <span>Sign in to Checkout · {inr(quote.total)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : !selectedAddressId ? (
                  <span>Select Delivery Address</span>
                ) : (
                  <>
                    <span>Confirm Order · {inr(quote.total)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified 256-Bit SSL Checkout · No Duplicate Submissions</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ADDRESS MODAL (ADD / EDIT)
         ───────────────────────────────────────────────────────────── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#E31E24]" />
                <h3 className="text-base font-bold font-display text-[#111111]">
                  {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              {/* Address Type Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        addressForm.label === lbl
                          ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name & Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
              </div>

              {/* House / Flat & Street */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Flat / House / Building No.</label>
                  <input
                    type="text"
                    value={addressForm.houseFlat}
                    onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                    placeholder="e.g. Flat 302, Green Glen"
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="e.g. 560103"
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Street Address / Locality / Landmark *</label>
                <input
                  type="text"
                  required
                  value={addressForm.streetLocality}
                  onChange={(e) => setAddressForm({ ...addressForm, streetLocality: e.target.value })}
                  placeholder="e.g. Bellandur Main Road, Near EcoSpace"
                  className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={addressForm.deliveryInstructions}
                  onChange={(e) => setAddressForm({ ...addressForm, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Leave with security, call on arrival"
                  className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]"
                />
                <span className="text-xs font-semibold text-gray-700">Set as my default delivery address</span>
              </label>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-5 py-2 rounded-lg bg-[#E31E24] text-white text-xs font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isSavingAddress ? "Saving Address..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
