import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MapPin,
  Check,
  Truck,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Tag,
  ArrowRight,
  ExternalLink,
  Store,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, quoteCart, ORDER_STEPS, type Order } from "@/lib/store";
import { getProduct, getVendor, inr, products } from "@/lib/data";
import type { AddressRef } from "@/lib/logistics/types";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    setQty,
    clearCart,
    addToCart,
    placeOrderWithOptions,
    userProfile,
    inventoryStock,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<string>("UPI · Google Pay");
  const [couponCode, setCouponCode] = useState<string>("EVSAFE");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(500);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPlacedOrder, setRecentPlacedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<AddressRef>({
    name: userProfile.name || "Aakash Sharma",
    phone: userProfile.phone || "+91 98765 43210",
    street: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
  });

  if (!isCartOpen) return null;

  const quote = quoteCart(cart, appliedDiscount);
  const totalItemCount = cart.reduce((acc, c) => acc + c.qty, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "EVSAFE") {
      setAppliedDiscount(500);
      toast.success("Coupon EVSAFE applied! ₹500 discount subtracted.");
    } else if (code === "RIDER10") {
      const disc = Math.round(quote.itemsTotal * 0.1);
      setAppliedDiscount(disc);
      toast.success(`Coupon RIDER10 applied! ₹${disc} discount subtracted.`);
    } else {
      toast.error("Invalid coupon code. Try 'EVSAFE' or 'RIDER10'.");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const order = placeOrderWithOptions({
          payment: paymentMethod,
          shippingAddress: address,
          couponCode: appliedDiscount > 0 ? couponCode : undefined,
          discount: appliedDiscount,
        });

        setIsSubmitting(false);
        setRecentPlacedOrder(order);
        toast.success(`Order #${order.id} placed successfully!`);
      } catch (e) {
        setIsSubmitting(false);
        toast.error("Checkout failed. Please try again.");
      }
    }, 600);
  };

  // Recommended quick add products when empty or browsing
  const recommendedParts = products.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-[#F7F9FB] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-[#E31E24]">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 font-display">Shopping Cart</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E31E24] text-white">
                  {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="text-xs text-gray-500">Multi-vendor dispatch & doorstep courier fulfillment</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition active:scale-95"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {recentPlacedOrder ? (
            /* Order Placed Success View (matches My Orders) */
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center py-4 space-y-2">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 grid place-items-center mx-auto shadow-2xs">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  Order Manifested & Dispatched
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 font-display">
                  Order #{recentPlacedOrder.id} Placed!
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Courier dispatch has been initialized. Real-time GPS tracking is now live.
                </p>
              </div>

              {/* Order Milestone Progress */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Dispatch Milestone
                </p>
                <div className="grid grid-cols-6 gap-1 text-center">
                  {ORDER_STEPS.map((step, idx) => {
                    const isPassed = idx <= recentPlacedOrder.status;
                    const isCurrent = idx === recentPlacedOrder.status;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold transition-all",
                            isCurrent
                              ? "bg-primary text-white ring-4 ring-emerald-100 scale-105"
                              : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-200 text-gray-400"
                          )}
                        >
                          {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="mt-1 text-[8.5px] font-medium text-gray-600 line-clamp-1">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="font-bold text-gray-900">{inr(recentPlacedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-semibold text-gray-800">{recentPlacedOrder.payment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deliver to:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[220px]">
                    {recentPlacedOrder.shippingAddress?.street}, {recentPlacedOrder.shippingAddress?.city}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  to="/track/$id"
                  params={{ id: recentPlacedOrder.id }}
                  onClick={() => {
                    setIsCartOpen(false);
                    setRecentPlacedOrder(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold text-center shadow-xs transition"
                >
                  Track Live GPS Courier →
                </Link>
                <button
                  onClick={() => setRecentPlacedOrder(null)}
                  className="py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
                >
                  Close & Shop More
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View styled like My Orders */
            <div className="space-y-6">
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 sm:p-10 text-center space-y-3">
                <div className="h-16 w-16 rounded-3xl bg-red-50 text-[#E31E24] grid place-items-center mx-auto shadow-2xs">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-display">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You haven't added any EV spare parts, batteries, or accessories yet. Explore recommended items below.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      addToCart("p7", "v1", 1);
                      toast.success("Added ChargeMax 3.3kW Fast Charger to cart!");
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
                  >
                    + Add Sample Fast Charger (₹14,500)
                  </button>
                </div>
              </div>

              {/* Quick Add Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#E31E24]" />
                    <span>Popular EV Spares & Upgrades</span>
                  </p>
                </div>

                <div className="grid gap-3">
                  {recommendedParts.map((prod) => (
                    <div
                      key={prod.id}
                      className="rounded-2xl border border-gray-200 bg-white p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-[#E31E24]/30 transition group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-13 w-13 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#E31E24] transition">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {prod.category} · {inr(prod.offers[0]?.price || 2400)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(prod.id, prod.offers[0]?.vendorId || "v1", 1);
                          toast.success(`Added ${prod.name} to cart!`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E31E24] hover:text-white text-gray-800 text-xs font-bold transition shrink-0 active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Vendor Cart Items (Identical Card UI to My Orders) */
            <div className="space-y-4">
              {/* Order Status Tabs / Indicator */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-500">
                  Fulfillment via <span className="font-bold text-gray-800">{quote.groups.length} EV Vendors</span>
                </span>
                <button
                  onClick={() => {
                    clearCart();
                    toast.info("Cart cleared");
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear all
                </button>
              </div>

              {/* Grouped Vendor Cards */}
              {quote.groups.map((group) => {
                const vendor = getVendor(group.vendorId);
                return (
                  <div
                    key={group.vendorId}
                    className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3.5 hover:shadow-xs transition"
                  >
                    {/* Vendor Header Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-[#E31E24] shrink-0">
                          <Store className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{vendor?.name || "Verified EV Hub"}</p>
                          <p className="text-[11px] text-gray-500">
                            {group.km} km away · ~{group.eta} min dispatch
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full">
                        {inr(group.subtotal)}
                      </span>
                    </div>

                    {/* Items List in this vendor */}
                    <div className="space-y-3 divide-y divide-gray-50">
                      {group.items.map((it) => {
                        const product = getProduct(it.productId);
                        if (!product) return null;

                        return (
                          <div key={it.productId} className="flex items-center gap-3.5 pt-3 first:pt-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-14 w-14 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                              <p className="text-[11px] text-gray-500">
                                {product.brand} · {inr(it.price)} each
                              </p>
                            </div>

                            {/* Qty increment / decrement controls */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shrink-0">
                              <button
                                onClick={() => setQty(it.productId, group.vendorId, Math.max(0, it.qty - 1))}
                                className="h-6 w-6 grid place-items-center rounded-lg bg-white text-gray-700 hover:bg-gray-200 transition active:scale-95 shadow-2xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-gray-900">{it.qty}</span>
                              <button
                                onClick={() => setQty(it.productId, group.vendorId, it.qty + 1)}
                                className="h-6 w-6 grid place-items-center rounded-lg bg-white text-gray-700 hover:bg-gray-200 transition active:scale-95 shadow-2xs"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Total for item & trash */}
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-gray-900">{inr(it.price * it.qty)}</p>
                              <button
                                onClick={() => setQty(it.productId, group.vendorId, 0)}
                                className="text-[11px] text-gray-400 hover:text-rose-600 transition inline-flex items-center mt-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery notice */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-[#E31E24]" />
                        <span>Doorstep courier delivery fee:</span>
                      </span>
                      <span className="font-bold text-gray-800">{inr(group.fee)}</span>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Address Card (matching My Orders address format) */}
              <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <MapPin className="h-4 w-4 text-[#E31E24]" />
                    <span>Doorstep Fulfillment Address</span>
                  </span>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-semibold text-[#E31E24] hover:underline"
                  >
                    {isEditingAddress ? "Done" : "Change Address"}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="space-y-2.5 pt-1 text-xs">
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      placeholder="Receiver Name"
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                    />
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                    />
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Street Address / Flat / Building"
                      className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="City"
                        className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="w-full h-9 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900">{address.name} · {address.phone}</p>
                    <p className="text-gray-500 mt-0.5">{address.street}, {address.city} - {address.pincode}</p>
                  </div>
                )}
              </div>

              {/* Coupon Code Input */}
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. EVSAFE)"
                      className="w-full h-10 rounded-xl border border-gray-300 pl-8 pr-3 text-xs uppercase font-mono font-semibold outline-none focus:border-[#E31E24]"
                    />
                    <Tag className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 h-10 rounded-xl bg-gray-100 hover:bg-[#E31E24] hover:text-white text-xs font-bold text-gray-700 transition"
                  >
                    Apply
                  </button>
                </form>
                {appliedDiscount > 0 && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> ₹{appliedDiscount} discount applied via coupon.
                  </p>
                )}
              </div>

              {/* Price Breakdown Card (Invoice format from My Orders) */}
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs space-y-2.5 text-xs">
                <p className="font-bold text-gray-900 text-sm pb-1 border-b border-gray-100">Order Summary</p>
                <div className="flex justify-between text-gray-600">
                  <span>Parts Subtotal</span>
                  <span>{inr(quote.itemsTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doorstep Courier Fee</span>
                  <span>{inr(quote.deliveryTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Statutory GST (18%)</span>
                  <span>{inr(quote.tax)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- {inr(appliedDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-[#E31E24] text-base">{inr(quote.total)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs space-y-2">
                <p className="text-xs font-bold text-gray-900">Payment Option</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "UPI · Google Pay", icon: Smartphone, label: "UPI (Google Pay / PhonePe)" },
                    { id: "Credit Card (HDFC)", icon: CreditCard, label: "Credit / Debit Card" },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex items-center gap-2 transition",
                        paymentMethod === pm.id
                          ? "border-[#E31E24] bg-red-50/50 text-[#E31E24] font-bold"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <pm.icon className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] leading-tight">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && !recentPlacedOrder && (
          <div className="bg-white border-t border-gray-200 p-4 sm:p-5 shadow-lg shrink-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-gray-500">Total Amount</p>
              <p className="text-lg font-extrabold text-[#E31E24] font-mono leading-tight">{inr(quote.total)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs sm:text-sm font-bold text-center shadow-md active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isSubmitting ? "Processing..." : `Place Order · ${inr(quote.total)}`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
