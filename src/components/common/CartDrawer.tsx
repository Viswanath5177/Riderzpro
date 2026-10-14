// src/components/common/CartDrawer.tsx
import { Link } from "@tanstack/react-router";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Truck,
  ArrowRight,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, quoteCart } from "@/lib/store";
import { inr, products } from "@/lib/data";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    setQty,
    addToCart,
    inventoryStock,
  } = useStore();

  if (!isCartOpen) return null;

  const quote = quoteCart(cart, 0);
  const totalItemCount = cart.reduce((acc, c) => acc + c.qty, 0);

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
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition active:scale-95 cursor-pointer"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            /* Empty Cart View */
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
                    className="px-5 py-2.5 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    + Add Sample Fast Charger (₹14,500)
                  </button>
                </div>
              </div>

              {/* Recommended Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900 font-display uppercase tracking-wider">
                    Frequently Replaced EV Parts
                  </p>
                  <span className="text-[11px] text-emerald-600 font-medium">Ready to ship</span>
                </div>

                <div className="grid gap-2.5">
                  {recommendedParts.map((p) => {
                    const primaryOffer = p.offers[0];
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 transition shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {p.category} · <span className="font-bold text-gray-800">{inr(primaryOffer.price)}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p.id, primaryOffer.vendorId, 1);
                            toast.success(`Added ${p.name} to cart!`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] font-bold shadow-2xs active:scale-95 transition cursor-pointer shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Items Grouped by Supplier */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Items grouped by supplier for consolidated dispatch</span>
                <span>{quote.groups.length} supplier{quote.groups.length > 1 ? "s" : ""}</span>
              </div>

              {quote.groups.map((group) => {
                const vendor = products
                  .flatMap((p) => p.offers)
                  .find((o) => o.vendorId === group.vendorId)?.vendorName || `Supplier ${group.vendorId}`;

                return (
                  <div
                    key={group.vendorId}
                    className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    {/* Vendor header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-[#E31E24]" />
                        <span className="text-xs font-bold text-gray-900">{vendor}</span>
                      </div>
                      <span className="text-[11px] font-medium text-gray-500">
                        {group.km} km away · ~{group.eta}m
                      </span>
                    </div>

                    {/* Group Items */}
                    <div className="divide-y divide-gray-100">
                      {group.items.map((it) => {
                        const product = products.find((p) => p.id === it.productId);
                        if (!product) return null;
                        const availableStock = inventoryStock[it.productId] ?? 10;
                        const isStockLow = availableStock < 5;

                        return (
                          <div key={it.productId} className="py-3 flex items-center justify-between gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-14 w-14 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                                <span>{inr(it.price)} each</span>
                                {isStockLow && (
                                  <span className="text-amber-700 font-semibold text-[10px]">
                                    (Only {availableStock} left)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Qty increment / decrement controls */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shrink-0">
                              <button
                                onClick={() => setQty(it.productId, group.vendorId, Math.max(0, it.qty - 1))}
                                className="h-6 w-6 grid place-items-center rounded-lg bg-white text-gray-700 hover:bg-gray-200 transition active:scale-95 shadow-2xs cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-gray-900">{it.qty}</span>
                              <button
                                onClick={() => setQty(it.productId, group.vendorId, it.qty + 1)}
                                className="h-6 w-6 grid place-items-center rounded-lg bg-white text-gray-700 hover:bg-gray-200 transition active:scale-95 shadow-2xs cursor-pointer"
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
                                className="text-[11px] text-gray-400 hover:text-rose-600 transition inline-flex items-center mt-0.5 cursor-pointer"
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

              {/* Price Breakdown Card */}
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
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-[#E31E24] text-base">{inr(quote.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4 sm:p-5 shadow-lg shrink-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-gray-500">Total Amount</p>
              <p className="text-lg font-extrabold text-[#E31E24] font-mono leading-tight">{inr(quote.total)}</p>
            </div>
            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="flex-1 py-3 px-6 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs sm:text-sm font-bold text-center shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
