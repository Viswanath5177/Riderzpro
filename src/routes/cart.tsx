// src/routes/cart.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Store,
  ShieldCheck,
  Tag,
  ArrowRight,
  Package,
  AlertCircle,
  Truck,
  CreditCard,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getProduct, getVendor, inr, products, GST_RATE } from "@/lib/data";
import { useStore } from "@/lib/store";
import { createOrder, ApiError, type CreateOrderPayload } from "@/lib/api/orders";
import { useAuth } from "@/lib/auth";
import {
  isDeliverablePincode,
  isValidPincodeFormat,
  NOT_SERVICEABLE_MESSAGE,
} from "@/lib/checkoutConfig";
import {
  ContactSection,
  type ContactData,
  type ContactErrors,
} from "@/components/checkout/ContactSection";
import {
  AddressSection,
  type AddressData,
  type AddressErrors,
} from "@/components/checkout/AddressSection";
import { PaymentSection, type PaymentMethod } from "@/components/checkout/PaymentSection";
import { MissingFieldsChecklist } from "@/components/checkout/MissingFieldsChecklist";
import { ServiceabilityBanner } from "@/components/checkout/ServiceabilityBanner";
import { PaymentStepSlot } from "@/components/checkout/PaymentStepSlot";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart & Checkout — RiderzPro" },
      {
        name: "description",
        content:
          "Review items, select doorstep delivery address, apply coupon, and place verified EV parts order.",
      },
      { property: "og:title", content: "Shopping Cart & Checkout — RiderzPro" },
      {
        property: "og:description",
        content: "Multi-vendor EV parts checkout with courier delivery.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, userProfile, inventoryStock, clearCart, addToCart } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Ref to prevent double-submit
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field DOM refs for focus on error
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const localityInputRef = useRef<HTMLInputElement>(null);
  const pincodeInputRef = useRef<HTMLInputElement>(null);

  // Section 1: Contact - starts empty, pre-filled only if real profile data exists
  const [contact, setContact] = useState<ContactData>(() => {
    const isRealName =
      userProfile.name && userProfile.name !== "Rider" && userProfile.name !== "Guest Rider";
    return {
      name: isRealName ? userProfile.name : "",
      phone: userProfile.phone || "",
      email: userProfile.email || "",
    };
  });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});

  // Section 2: Address - starts empty, city/state fixed to Delhi
  const [address, setAddress] = useState<AddressData>({
    street: "",
    locality: "",
    landmark: "",
    city: "Delhi",
    state: "Delhi",
    pincode: "",
    deliveryInstructions: "",
  });
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});

  // Section 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  // Section 4: Coupons - starts empty
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null,
  );
  const [couponError, setCouponError] = useState<string>("");

  // Server error banner state
  const [serverAddressError, setServerAddressError] = useState<string | null>(null);

  // Group items by vendor and compute pricing
  const { groups, itemsTotal, deliveryTotal, discountAmount, tax, totalAmount, totalAmountPaise } =
    useMemo(() => {
      const vendorMap = new Map<
        string,
        {
          vendorId: string;
          items: {
            productId: string;
            qty: number;
            price: number;
            lineTotal: number;
            product: ReturnType<typeof getProduct>;
          }[];
          subtotal: number;
        }
      >();
      cart.forEach((c) => {
        const p = getProduct(c.productId);
        if (!p) return;
        const offer = p.offers.find((o) => o.vendorId === c.vendorId) ?? p.offers[0];
        const price = offer?.price ?? p.offers?.[0]?.price ?? 100;
        let g = vendorMap.get(c.vendorId);
        if (!g) {
          g = { vendorId: c.vendorId, items: [], subtotal: 0 };
          vendorMap.set(c.vendorId, g);
        }
        g.items.push({
          productId: c.productId,
          qty: c.qty,
          price,
          lineTotal: price * c.qty,
          product: p,
        });
        g.subtotal += price * c.qty;
      });

      const groupsList = Array.from(vendorMap.values());
      const sub = groupsList.reduce((acc, g) => acc + g.subtotal, 0);
      const deliv = groupsList.length > 0 ? groupsList.length * 49 : 49; // Consolidated delivery fee ₹49/vendor

      let disc = 0;
      if (appliedCoupon?.code === "EVSAFE") {
        disc = Math.min(sub, 500);
      } else if (appliedCoupon?.code === "RIDER10") {
        disc = Math.round(sub * 0.1);
      }

      const discountedSubtotal = Math.max(0, sub - disc);
      const tx = Math.round(discountedSubtotal * GST_RATE);
      const tot = discountedSubtotal + deliv + tx;

      return {
        groups: groupsList,
        itemsTotal: sub,
        deliveryTotal: deliv,
        discountAmount: disc,
        tax: tx,
        totalAmount: tot,
        totalAmountPaise: tot * 100,
      };
    }, [cart, appliedCoupon]);

  // Inventory / Stock Checks
  const stockErrors: string[] = useMemo(() => {
    const list: string[] = [];
    cart.forEach((item) => {
      const product = getProduct(item.productId);
      const available = inventoryStock[item.productId] ?? 10;
      if (item.qty > available) {
        list.push(
          `${product?.name || item.productId} exceeds available stock (${available} units left).`,
        );
      }
    });
    return list;
  }, [cart, inventoryStock]);

  // Validation functions
  const validateField = (field: keyof ContactData | keyof AddressData): boolean => {
    let isValid = true;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field === "name") {
      if (!contact.name.trim()) {
        setContactErrors((prev) => ({ ...prev, name: "Full name is required" }));
        isValid = false;
      } else {
        setContactErrors((prev) => ({ ...prev, name: undefined }));
      }
    }

    if (field === "phone") {
      const clean = contact.phone.trim();
      if (!clean) {
        setContactErrors((prev) => ({ ...prev, phone: "Mobile number is required" }));
        isValid = false;
      } else if (!phoneRegex.test(clean)) {
        setContactErrors((prev) => ({
          ...prev,
          phone: "Enter a valid 10-digit mobile number starting with 6-9",
        }));
        isValid = false;
      } else {
        setContactErrors((prev) => ({ ...prev, phone: undefined }));
      }
    }

    if (field === "email") {
      const clean = contact.email.trim();
      if (clean && !emailRegex.test(clean)) {
        setContactErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
        isValid = false;
      } else {
        setContactErrors((prev) => ({ ...prev, email: undefined }));
      }
    }

    if (field === "street") {
      if (!address.street.trim()) {
        setAddressErrors((prev) => ({
          ...prev,
          street: "House / Flat no. & street address is required",
        }));
        isValid = false;
      } else {
        setAddressErrors((prev) => ({ ...prev, street: undefined }));
      }
    }

    if (field === "locality") {
      if (!address.locality.trim()) {
        setAddressErrors((prev) => ({ ...prev, locality: "Locality / Area is required" }));
        isValid = false;
      } else {
        setAddressErrors((prev) => ({ ...prev, locality: undefined }));
      }
    }

    if (field === "pincode") {
      const cleanPin = address.pincode.trim();
      if (!cleanPin) {
        setAddressErrors((prev) => ({ ...prev, pincode: "Pincode is required" }));
        isValid = false;
      } else if (!isValidPincodeFormat(cleanPin)) {
        setAddressErrors((prev) => ({ ...prev, pincode: "Enter a valid 6-digit pincode." }));
        isValid = false;
      } else if (!isDeliverablePincode(cleanPin)) {
        setAddressErrors((prev) => ({
          ...prev,
          pincode: NOT_SERVICEABLE_MESSAGE,
        }));
        isValid = false;
      } else {
        setAddressErrors((prev) => ({ ...prev, pincode: undefined }));
      }
    }

    return isValid;
  };

  // Missing fields checklist
  const missingItems: string[] = useMemo(() => {
    const list: string[] = [];
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!contact.name.trim()) list.push("Enter your full name");
    if (!contact.phone.trim() || !phoneRegex.test(contact.phone.trim())) {
      list.push("Enter a valid 10-digit mobile number");
    }
    if (!address.street.trim()) list.push("Enter house/street address");
    if (!address.locality.trim()) list.push("Enter locality/area");

    const cleanPin = address.pincode.trim();
    if (!cleanPin) {
      list.push("Enter a Delhi pincode (110001–110099)");
    } else if (!isValidPincodeFormat(cleanPin)) {
      list.push("Enter a valid 6-digit pincode");
    } else if (!isDeliverablePincode(cleanPin)) {
      list.push("Enter a deliverable Delhi pincode");
    }

    if (!paymentMethod) list.push("Select a payment method");
    if (cart.length === 0) list.push("Cart is empty");
    if (stockErrors.length > 0) list.push("Adjust inventory quantities");

    return list;
  }, [contact, address, paymentMethod, cart, stockErrors]);

  const isPincodeDeliverable = isDeliverablePincode(address.pincode);
  const showNotDeliverableBanner =
    (address.pincode.trim().length === 6 && !isPincodeDeliverable) || Boolean(serverAddressError);

  const canConfirm = missingItems.length === 0 && !isSubmitting;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (code === "EVSAFE") {
      setAppliedCoupon({ code: "EVSAFE", discount: 500 });
      toast.success("Coupon EVSAFE applied! ₹500 discount added.");
    } else if (code === "RIDER10") {
      const disc = Math.round(itemsTotal * 0.1);
      setAppliedCoupon({ code: "RIDER10", discount: disc });
      toast.success(`Coupon RIDER10 applied! ₹${disc} discount added.`);
    } else {
      setCouponError("Invalid coupon code. Try 'EVSAFE' for ₹500 off or 'RIDER10' for 10% off.");
    }
  };

  const handleConfirmOrder = async () => {
    setServerAddressError(null);

    // 1. Auth check
    if (!isAuthenticated) {
      toast.info("Please sign in to place your order.");
      navigate({ to: "/auth", search: { redirect: "/cart" } });
      return;
    }

    // 2. Validate all sections and focus first invalid
    const isNameValid = validateField("name");
    const isPhoneValid = validateField("phone");
    const isEmailValid = validateField("email");
    const isStreetValid = validateField("street");
    const isLocalityValid = validateField("locality");
    const isPincodeValid = validateField("pincode");

    if (!isNameValid) {
      nameInputRef.current?.focus();
      toast.error("Please enter your full name.");
      return;
    }
    if (!isPhoneValid) {
      phoneInputRef.current?.focus();
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!isEmailValid) {
      emailInputRef.current?.focus();
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isStreetValid) {
      streetInputRef.current?.focus();
      toast.error("Please enter your street address.");
      return;
    }
    if (!isLocalityValid) {
      localityInputRef.current?.focus();
      toast.error("Please enter your locality.");
      return;
    }
    if (!isPincodeValid) {
      pincodeInputRef.current?.focus();
      toast.error(NOT_SERVICEABLE_MESSAGE);
      return;
    }

    if (stockErrors.length > 0) {
      toast.error("Please adjust quantities to match available inventory.");
      return;
    }

    // Double submit protection
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        items: cart.map((c) => ({
          productId: c.productId,
          vendorId: c.vendorId,
          qty: c.qty,
        })),
        contact: {
          name: contact.name.trim(),
          phone: contact.phone.trim(),
          email: contact.email.trim() || undefined,
        },
        shippingAddress: {
          street: address.street.trim(),
          locality: address.locality.trim(),
          landmark: address.landmark.trim() || undefined,
          city: "Delhi",
          state: "Delhi",
          pincode: address.pincode.trim(),
        },
        deliveryInstructions: address.deliveryInstructions.trim() || undefined,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const newOrder = await createOrder(payload);

      // Success: clear cart and redirect to confirmation page
      clearCart();
      toast.success(`Order ${newOrder.orderNumber || newOrder.id} confirmed!`);
      navigate({
        to: "/order-confirmation/$id",
        params: { id: newOrder.id },
      });
    } catch (err: unknown) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);

      if (err instanceof ApiError) {
        if (err.code === "ADDRESS_NOT_SERVICEABLE") {
          setServerAddressError(NOT_SERVICEABLE_MESSAGE);
          pincodeInputRef.current?.focus();
          toast.error(NOT_SERVICEABLE_MESSAGE);
          return;
        }
        if (err.status === 409 || err.code === "STOCK_CONFLICT") {
          toast.error("Some items are no longer in stock. Please update your cart.");
          return;
        }
        if (err.status === 429 || err.code === "RATE_LIMITED") {
          toast.error("Too many attempts. Please wait a moment before trying again.");
          return;
        }
        if (err.status === 401) {
          toast.error("Your session expired. Please sign in again.");
          navigate({ to: "/auth", search: { redirect: "/cart" } });
          return;
        }
      }

      const msg = err instanceof Error ? err.message : "Error processing order. Please try again.";
      toast.error(msg);
    }
  };

  if (cart.length === 0) {
    const recommendedSpares = products.slice(0, 3);

    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-[#E31E24]">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">
              Your Cart is Currently Empty
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              You don't have any items in your cart. Add genuine EV spare parts or accessories to
              proceed to checkout.
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
                to="/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <Package className="h-4 w-4 text-[#E31E24]" />
                <span>View My Orders</span>
              </Link>
            </div>
          </div>

          {/* Recommended Spares */}
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
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-extrabold text-xs text-gray-900">
                        {inr(primaryOffer.price)}
                      </span>
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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
              Checkout & Delivery
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-vendor consolidated dispatch · Delhi Service Area
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Genuine Fitment Guaranteed</span>
          </div>
        </div>

        {/* Stock Errors */}
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

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px] items-start pb-24 lg:pb-8">
          {/* Left Column: Form Sections 1, 2, 3 and Cart Items */}
          <div className="space-y-6">
            {/* Section 1: Contact Details */}
            <ContactSection
              data={contact}
              errors={contactErrors}
              onChange={(f, val) => {
                setContact((prev) => ({ ...prev, [f]: val }));
                validateField(f);
              }}
              onBlur={(f) => validateField(f)}
              nameInputRef={nameInputRef}
              phoneInputRef={phoneInputRef}
              emailInputRef={emailInputRef}
            />

            {/* Section 2: Delhi Delivery Address */}
            <AddressSection
              data={address}
              errors={addressErrors}
              onChange={(f, val) => {
                setAddress((prev) => ({ ...prev, [f]: val }));
                validateField(f);
              }}
              onBlur={(f) => validateField(f)}
              streetInputRef={streetInputRef}
              localityInputRef={localityInputRef}
              pincodeInputRef={pincodeInputRef}
            />

            {/* Section 3: Payment Method */}
            <PaymentSection
              selected={paymentMethod}
              onChange={setPaymentMethod}
              orderTotalPaise={totalAmountPaise}
            />

            {/* Sathwik's PaymentStep Integration Slot */}
            <PaymentStepSlot paymentMethod={paymentMethod} />

            {/* Ordered Items Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#E31E24]" />
                  <h3 className="text-sm font-bold text-gray-900 font-display">
                    4. Review Items ({cart.reduce((s, it) => s + it.qty, 0)})
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {groups.length} supplier{groups.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-4">
                {groups.map((g) => {
                  const v = getVendor(g.vendorId);
                  return (
                    <div
                      key={g.vendorId}
                      className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-gray-800 border-b border-gray-200/60 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 text-[#E31E24]" />
                          <span>Seller: {v.name}</span>
                        </div>
                        <span className="text-gray-500 font-normal">Delhi Hub Dispatch</span>
                      </div>

                      <div className="divide-y divide-gray-200/60">
                        {g.items.map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center justify-between py-2.5 gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={it.product?.image}
                                alt={it.product?.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/src/assets/parts.jpg";
                                }}
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-gray-900 truncate">
                                  {it.product?.name}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {inr(it.price)} each
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 p-0.5 bg-white">
                                <button
                                  aria-label="Decrease quantity"
                                  onClick={() => setQty(it.productId, g.vendorId, it.qty - 1)}
                                  className="grid h-6 w-6 place-items-center rounded hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-gray-900">
                                  {it.qty}
                                </span>
                                <button
                                  aria-label="Increase quantity"
                                  onClick={() => setQty(it.productId, g.vendorId, it.qty + 1)}
                                  className="grid h-6 w-6 place-items-center rounded hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="w-16 text-right font-extrabold text-xs text-gray-900">
                                {inr(it.lineTotal)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary, Coupon, Checklist, & Confirm Button */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
                Order Price Summary
              </h3>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <dt>Items Subtotal</dt>
                  <dd className="font-semibold text-gray-900">{inr(itemsTotal)}</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Doorstep Consolidated Logistics</dt>
                  <dd className="font-semibold text-gray-900">{inr(deliveryTotal)}</dd>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <dt className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Coupon ({appliedCoupon.code})</span>
                    </dt>
                    <dd>- {inr(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <dt>GST (18% Statutory EV Tax)</dt>
                  <dd className="font-semibold text-gray-900">{inr(tax)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-base text-gray-900">
                  <dt>Total Amount</dt>
                  <dd className="text-[#E31E24]">{inr(totalAmount)}</dd>
                </div>
              </dl>

              {/* Coupon Form */}
              <div className="pt-3 border-t border-gray-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. EVSAFE)"
                    className="flex-1 h-10 rounded-xl border border-gray-300 px-3 text-[16px] uppercase font-mono outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponError && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="mt-1.5 text-xs text-emerald-600 font-semibold">
                    ✓ Promo applied: Save {inr(discountAmount)}
                  </p>
                )}
              </div>

              {/* Serviceability Banner above Confirm Button */}
              <ServiceabilityBanner show={showNotDeliverableBanner} />

              {/* Missing Fields Checklist */}
              <MissingFieldsChecklist missingItems={missingItems} />

              {/* Confirm Order Button (Desktop view) */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={!canConfirm}
                className="w-full h-12 rounded-xl bg-[#E31E24] text-white text-sm font-bold shadow-xs hover:bg-red-700 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Securing Order & Processing...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Confirm Order · {inr(totalAmount)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-Bit SSL Secured · No Double Charges</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Sticky Bottom Confirm Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <p className="text-[11px] text-gray-500">Total Payable</p>
              <p className="font-extrabold text-base text-[#E31E24]">{inr(totalAmount)}</p>
            </div>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={!canConfirm}
              className="flex-1 h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Confirm Order · {inr(totalAmount)}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
