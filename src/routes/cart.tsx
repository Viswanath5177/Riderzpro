import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DELIVERY_BASE, DELIVERY_PER_KM, getProduct, getVendor, inr, products } from "@/lib/data";
import { quoteCart, useStore, type Order } from "@/lib/store";
import type { AddressRef } from "@/lib/logistics/types";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart & Checkout — RiderzPro" },
      { name: "description", content: "Review items, select doorstep delivery address, apply coupon, and place verified EV parts order." },
      { property: "og:title", content: "Shopping Cart & Checkout — RiderzPro" },
      { property: "og:description", content: "Multi-vendor EV parts checkout with courier delivery." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, placeOrderWithOptions, userProfile, inventoryStock, addToCart } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [couponInput, setCouponInput] = useState<string>("EVSAFE");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: "EVSAFE",
    discount: 500,
  });
  const [couponError, setCouponError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Address state prefilled from profile
  const [address, setAddress] = useState<AddressRef>({
    name: userProfile.name || "Aakash Sharma",
    phone: userProfile.phone || "+91 98765 43210",
    street: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const quote = quoteCart(cart, discountAmount);

  // Stock check
  const stockErrors: string[] = [];
  cart.forEach((item) => {
    const product = getProduct(item.productId);
    const available = inventoryStock[item.productId] ?? 10;
    if (item.qty > available) {
      stockErrors.push(`${product?.name || item.productId} exceeds available stock (${available} units left).`);
    }
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    if (code === "EVSAFE") {
      setAppliedCoupon({ code: "EVSAFE", discount: 500 });
      toast.success("Coupon EVSAFE applied! ₹500 discount added.");
    } else if (code === "RIDER10") {
      const disc = Math.round(quote.itemsTotal * 0.1);
      setAppliedCoupon({ code: "RIDER10", discount: disc });
      toast.success(`Coupon RIDER10 applied! ₹${disc} discount added.`);
    } else {
      setCouponError("Invalid coupon code. Try 'EVSAFE' for ₹500 off.");
    }
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to place your order.");
      navigate({ to: "/auth", search: { redirect: "/cart" } });
      return;
    }
    if (stockErrors.length > 0) {
      toast.error("Please adjust quantities to match available inventory.");
      return;
    }
    if (!address.name || !address.phone || !address.street || !address.pincode) {
      toast.error("Please complete your delivery address before placing order.");
      setIsEditingAddress(true);
      return;
    }

    // Prevent duplicate orders
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const order = placeOrderWithOptions({
          payment: paymentMethod,
          shippingAddress: address,
          couponCode: appliedCoupon?.code,
          discount: appliedCoupon?.discount,
        });

        setIsSubmitting(false);
        setConfirmedOrder(order);
        toast.success(`Order ${order.id} placed successfully!`);
      } catch (err) {
        setIsSubmitting(false);
        toast.error("Error processing order. Please try again.");
      }
    }, 600);
  };

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
              <p className="text-[#6B7280]">{confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city} - {confirmedOrder.shippingAddress?.pincode}</p>
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition"
            >
              <Truck className="h-4 w-4" />
              <span>Track in Customer Dashboard</span>
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (cart.length === 0) {
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
                className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition"
              >
                <span>Shop Catalog & Spares</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/customer"
                search={{ tab: "orders" } as any}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <Package className="h-4 w-4 text-[#E31E24]" />
                <span>View My Orders & Deliveries</span>
              </Link>
            </div>
          </div>

          {/* Recommended EV Spares with 1-click Quick Add */}
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
                          In Stock ({inventoryStock[p.id] ?? 10})
                        </span>
                        <span>{p.category}</span>
                      </div>
                      <p className="font-bold text-xs text-gray-900 mt-2 line-clamp-1">{p.name}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{p.description}</p>
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
          {/* Left Column: Items & Delivery Address */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E31E24]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Doorstep Delivery Address
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-semibold text-[#E31E24] hover:underline cursor-pointer"
                >
                  {isEditingAddress ? "Done" : "Change Address"}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">Street Address / Landmark</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-start justify-between text-xs text-[#6B7280]">
                  <div>
                    <p className="font-bold text-[#111111]">{address.name} ({address.phone})</p>
                    <p className="mt-0.5">{address.street}, {address.city} - {address.pincode}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Truck className="h-3 w-3" /> Serviceable via Delhivery & Bluedart
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items by Vendor */}
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
                                <div className="mt-0.5 flex items-center gap-2 text-[10.5px] sm:text-[11px] text-[#6B7280]">
                                  <span>{inr(it.price)} each</span>
                                  <span>·</span>
                                  {isStockLow ? (
                                    <span className="text-amber-700 font-bold flex items-center gap-1 truncate">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                      Hurry limited Stock ({availableStock} left)
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 font-semibold truncate">In Stock ({availableStock})</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pl-15 sm:pl-0">
                              <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] p-0.5 bg-gray-50">
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

          {/* Right Column: Order Summary & Payment */}
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
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <dt className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Coupon ({appliedCoupon.code})</span>
                    </dt>
                    <dd>- {inr(appliedCoupon.discount)}</dd>
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

              {/* Coupon Form */}
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. EVSAFE)"
                    className="flex-1 h-9 rounded-lg border border-gray-300 px-3 text-xs uppercase font-mono outline-none focus:border-[#E31E24]"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="mt-1 text-[11px] text-red-600">{couponError}</p>}
                {appliedCoupon && (
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                    ✓ Promo applied: Save {inr(appliedCoupon.discount)}
                  </p>
                )}
              </div>

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
                disabled={isSubmitting || stockErrors.length > 0}
                className="mt-5 w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order & Manifesting...</span>
                ) : !isAuthenticated ? (
                  <>
                    <span>Sign in to Checkout · {inr(quote.total)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
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
    </SiteLayout>
  );
}
