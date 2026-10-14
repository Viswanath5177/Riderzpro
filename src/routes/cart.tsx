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
  QrCode,
  Lock,
  Building2,
  FileText,
  Check,
  X,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
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

  // B2B GSTIN state
  const [hasGstin, setHasGstin] = useState(false);
  const [gstin, setGstin] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstinError, setGstinError] = useState("");

  // In-App Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [customUpiId, setCustomUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("Aakash Sharma");
  const [saveCard, setSaveCard] = useState(true);
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStage, setPaymentStage] = useState("");

  // Tax Invoice Modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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

  const isInterstate = address.state
    ? !address.state.toLowerCase().includes("karnataka")
    : false;
  const cgst = quote.taxBreakdown?.cgst || Math.round(quote.tax / 2);
  const sgst = quote.taxBreakdown?.sgst || (quote.tax - cgst);
  const igst = quote.tax;

  const isValidGstin = (val: string) =>
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.trim().toUpperCase());

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

  const handleOpenPaymentModal = () => {
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
      toast.error("Please complete your delivery address before proceeding.");
      setIsEditingAddress(true);
      return;
    }
    if (hasGstin) {
      if (!gstin.trim()) {
        toast.error("Please enter your 15-digit GSTIN or uncheck the B2B tax invoice box.");
        return;
      }
      if (!isValidGstin(gstin)) {
        toast.error("Please enter a valid 15-digit GSTIN (e.g. 29AABCR8492Q1Z8).");
        return;
      }
    }
    setIsPaymentModalOpen(true);
  };

  const handleCompletePayment = (methodUsed: string) => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    setPaymentStage("Connecting to 256-bit secure gateway rails...");

    setTimeout(() => {
      setPaymentStage(`Authorizing ${inr(quote.total)} with banking switch...`);
      setTimeout(() => {
        try {
          const order = placeOrderWithOptions({
            payment: methodUsed,
            shippingAddress: address,
            couponCode: appliedCoupon?.code,
            discount: appliedCoupon?.discount,
            gstin: hasGstin ? gstin.toUpperCase().trim() : undefined,
            businessName: hasGstin ? businessName.trim() : undefined,
          });

          setIsProcessingPayment(false);
          setIsPaymentModalOpen(false);
          setConfirmedOrder(order);
          toast.success(`Payment verified! Order #${order.id} placed.`);
        } catch {
          setIsProcessingPayment(false);
          toast.error("Error processing transaction. Please retry.");
        }
      }, 700);
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

            {/* Delivery address & Tax details */}
            <div className="border-t border-[#E5E7EB] pt-3 space-y-1.5 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#111111]">{inr(confirmedOrder.itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Express Delivery (Fixed):</span>
                <span className="font-semibold text-[#111111]">{inr(confirmedOrder.deliveryTotal)}</span>
              </div>
              {confirmedOrder.taxBreakdown?.isInterstate ? (
                <div className="flex justify-between">
                  <span>Integrated GST (18% IGST):</span>
                  <span className="font-semibold text-[#111111]">{inr(confirmedOrder.tax)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Central GST (9% CGST):</span>
                    <span className="font-semibold text-[#111111]">
                      {inr(confirmedOrder.taxBreakdown?.cgst || Math.round(confirmedOrder.tax / 2))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>State GST (9% SGST):</span>
                    <span className="font-semibold text-[#111111]">
                      {inr(confirmedOrder.taxBreakdown?.sgst || (confirmedOrder.tax - Math.round(confirmedOrder.tax / 2)))}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* B2B GSTIN section if present */}
            {confirmedOrder.gstin && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Building2 className="h-4 w-4" />
                  <span>B2B Tax Invoice · 18% Input Tax Credit Eligible</span>
                </div>
                <div className="mt-1 flex flex-col sm:flex-row sm:justify-between text-[11px] text-emerald-700">
                  <span>Legal Entity: <strong>{confirmedOrder.businessName || "Registered Firm"}</strong></span>
                  <span>GSTIN: <strong className="font-mono">{confirmedOrder.gstin}</strong></span>
                </div>
              </div>
            )}

            <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-center text-sm">
              <span className="text-xs text-[#6B7280]">Total Paid ({confirmedOrder.payment})</span>
              <span className="font-bold text-lg text-[#111111]">{inr(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-black transition cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>View & Print GST Tax Invoice</span>
            </button>
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

        {/* Official Rule 46 GST Tax Invoice Preview Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-200 text-gray-900 space-y-6">
              {/* Top Toolbar */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#E31E24]" />
                  <span className="font-bold text-sm text-gray-900">
                    Tax Invoice Preview (CGST Rule 46 Compliant)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Printable Document Body */}
              <div className="space-y-6 text-xs text-gray-800" id="tax-invoice-content">
                {/* Supplier & Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#E31E24] tracking-tight">
                      RIDERZPRO MOBILITY SOLUTIONS PVT. LTD.
                    </h2>
                    <p className="text-[11px] text-gray-600 mt-1">
                      Sy. No. 44/2, Electronic City Phase 1, Hosur Main Road,<br />
                      Bengaluru, Karnataka - 560100, India
                    </p>
                    <p className="mt-1.5 font-mono text-[11px]">
                      <strong>GSTIN:</strong> 29AABCR8492Q1Z8 | <strong>PAN:</strong> AABCR8492Q<br />
                      <strong>State:</strong> 29 - Karnataka | <strong>CIN:</strong> U34100KA2024PTC184920
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 bg-gray-900 text-white font-bold text-xs rounded uppercase tracking-wider">
                      TAX INVOICE
                    </span>
                    <p className="mt-2 text-[11px]">
                      <strong>Invoice No:</strong> <span className="font-mono font-bold">RZP/2026-27/{confirmedOrder.id}</span>
                    </p>
                    <p className="text-[11px]">
                      <strong>Date:</strong> {new Date(confirmedOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-[11px]">
                      <strong>Waybill:</strong> <span className="font-mono">DEL-{confirmedOrder.shipmentId || "849201"}</span>
                    </p>
                  </div>
                </div>

                {/* Billed To / Shipped To */}
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                      Billed To (Customer Details)
                    </span>
                    <p className="font-bold text-sm text-gray-900">{confirmedOrder.shippingAddress?.name}</p>
                    {confirmedOrder.businessName && (
                      <p className="font-semibold text-emerald-800">{confirmedOrder.businessName}</p>
                    )}
                    <p className="text-gray-600 mt-0.5">
                      {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city}, {confirmedOrder.shippingAddress?.state} - {confirmedOrder.shippingAddress?.pincode}
                    </p>
                    <p className="text-gray-600">Phone: {confirmedOrder.shippingAddress?.phone}</p>
                    <p className="mt-1 font-mono">
                      <strong>Buyer GSTIN:</strong> {confirmedOrder.gstin || "URP (Unregistered Person)"}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-1">
                      Shipment & Dispatch Summary
                    </span>
                    <p><strong>Place of Supply:</strong> {confirmedOrder.shippingAddress?.state || "Karnataka"} (Code: 29)</p>
                    <p><strong>Payment Mode:</strong> {confirmedOrder.payment}</p>
                    <p><strong>Payment Status:</strong> {confirmedOrder.paymentStatus || "Paid"}</p>
                    <p><strong>Fulfillment:</strong> Delhivery Consolidated Courier</p>
                    {confirmedOrder.gstin && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        ✓ Eligible for B2B Input Tax Credit
                      </span>
                    )}
                  </div>
                </div>

                {/* Itemized Goods & Services Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b bg-gray-50 text-gray-700">
                        <th className="py-2 px-2 font-bold">#</th>
                        <th className="py-2 px-2 font-bold">Description of Goods / Services</th>
                        <th className="py-2 px-2 font-bold">HSN/SAC</th>
                        <th className="py-2 px-2 font-bold text-center">Qty</th>
                        <th className="py-2 px-2 font-bold text-right">Taxable Value</th>
                        <th className="py-2 px-2 font-bold text-right">GST Rate</th>
                        <th className="py-2 px-2 font-bold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {confirmedOrder.groups?.flatMap((g) => g.items).map((it, idx) => {
                        const prod = getProduct(it.productId);
                        const isBat = (prod?.category || "").includes("Battery");
                        const hsn = isBat ? "8507 60 00" : "8504 40 90";
                        const lineTaxable = it.price * it.qty;
                        return (
                          <tr key={idx}>
                            <td className="py-2 px-2 text-gray-500">{idx + 1}</td>
                            <td className="py-2 px-2 font-medium">
                              {prod?.name || it.productId}
                              <span className="block text-[10px] text-gray-500">{prod?.brand} · Certified EV Component</span>
                            </td>
                            <td className="py-2 px-2 font-mono text-[11px]">{hsn}</td>
                            <td className="py-2 px-2 text-center">{it.qty}</td>
                            <td className="py-2 px-2 text-right font-mono">{inr(lineTaxable)}</td>
                            <td className="py-2 px-2 text-right">18%</td>
                            <td className="py-2 px-2 text-right font-mono font-semibold">{inr(Math.round(lineTaxable * 1.18))}</td>
                          </tr>
                        );
                      })}
                      {/* Fixed Delivery Charge Row */}
                      <tr>
                        <td className="py-2 px-2 text-gray-500">•</td>
                        <td className="py-2 px-2 font-medium">
                          Doorstep Express Logistics (Consolidated Flat Fee)
                          <span className="block text-[10px] text-gray-500">Fixed rate delivery across all vendor parcels</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-[11px]">9968 12</td>
                        <td className="py-2 px-2 text-center">1</td>
                        <td className="py-2 px-2 text-right font-mono">₹150.00</td>
                        <td className="py-2 px-2 text-right">18%</td>
                        <td className="py-2 px-2 text-right font-mono font-semibold">₹177.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tax Partition & Total Summary */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-1 text-[11px] text-gray-600">
                    <p className="font-bold text-gray-800">Tax Schedule (Statutory 18%):</p>
                    {confirmedOrder.taxBreakdown?.isInterstate ? (
                      <p>• Integrated GST (18% IGST): <strong>{inr(confirmedOrder.tax)}</strong></p>
                    ) : (
                      <>
                        <p>• Central GST (9% CGST): <strong>{inr(confirmedOrder.taxBreakdown?.cgst || Math.round(confirmedOrder.tax / 2))}</strong></p>
                        <p>• State GST (9% SGST): <strong>{inr(confirmedOrder.taxBreakdown?.sgst || (confirmedOrder.tax - Math.round(confirmedOrder.tax / 2)))}</strong></p>
                      </>
                    )}
                    <p className="pt-2 text-[10px] text-gray-500">
                      This is an electronically generated tax invoice under Section 31 of CGST Act. No physical signature is required.
                    </p>
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between text-xs">
                      <span>Taxable Goods & Delivery Subtotal:</span>
                      <span className="font-mono font-semibold">{inr(confirmedOrder.total - confirmedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total GST Amount (18%):</span>
                      <span className="font-mono font-semibold">{inr(confirmedOrder.tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-base font-extrabold text-gray-900">
                      <span>Invoice Grand Total:</span>
                      <span className="text-[#E31E24]">{inr(confirmedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Digital Seal */}
                <div className="flex justify-between items-end border-t pt-4">
                  <div className="text-[10px] text-gray-500 font-mono">
                    Authentication Token: SHA256:{confirmedOrder.id}-VERIFIED-RULE46<br />
                    Generated on {new Date().toISOString()}
                  </div>
                  <div className="text-center p-2 rounded-xl border border-emerald-300 bg-emerald-50/50">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase">Digitally Certified</span>
                    <span className="font-bold text-xs text-gray-900">RiderzPro Billing Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  <dt>Doorstep Express Delivery (Fixed)</dt>
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
                <div className="rounded-lg bg-gray-50/80 p-2.5 space-y-1.5 text-[11px] text-[#6B7280] border border-gray-100">
                  <div className="flex justify-between font-semibold text-[#111111]">
                    <span>GST (18% Statutory Rate)</span>
                    <span>{inr(quote.tax)}</span>
                  </div>
                  {isInterstate ? (
                    <div className="flex justify-between pl-2 border-l-2 border-primary/40 text-[10.5px]">
                      <span>• Integrated GST (18% IGST)</span>
                      <span>{inr(igst)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between pl-2 border-l-2 border-primary/40 text-[10.5px]">
                        <span>• Central GST (9% CGST)</span>
                        <span>{inr(cgst)}</span>
                      </div>
                      <div className="flex justify-between pl-2 border-l-2 border-primary/40 text-[10.5px]">
                        <span>• State GST (9% SGST)</span>
                        <span>{inr(sgst)}</span>
                      </div>
                    </>
                  )}
                  <p className="text-[10px] text-gray-400 pt-0.5">
                    *Applicable on discounted items + ₹150 doorstep express logistics.
                  </p>
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

              {/* B2B GSTIN Section */}
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasGstin}
                    onChange={(e) => setHasGstin(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                    <Building2 className="h-3.5 w-3.5 text-[#E31E24]" />
                    <span>Claim 18% Input Tax Credit (B2B GSTIN)</span>
                  </div>
                </label>
                {hasGstin && (
                  <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Company / Registered Entity Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. VoltRide Mobility Pvt Ltd"
                        className="w-full h-8 px-2.5 text-xs rounded-lg border border-gray-300 bg-white outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-semibold text-gray-700">
                          15-Digit GSTIN <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-mono">Rule 46 Compliant</span>
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        value={gstin}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setGstin(val);
                          if (val.length === 15 && !isValidGstin(val)) {
                            setGstinError("Invalid GSTIN format (e.g. 29AABCR8492Q1Z8)");
                          } else {
                            setGstinError("");
                          }
                        }}
                        placeholder="e.g. 29AABCR8492Q1Z8"
                        className="w-full h-8 px-2.5 text-xs font-mono uppercase rounded-lg border border-gray-300 bg-white outline-none focus:border-[#E31E24]"
                      />
                      {gstinError && <p className="mt-1 text-[10px] text-red-600">{gstinError}</p>}
                      {gstin && !gstinError && gstin.length === 15 && (
                        <p className="mt-1 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Valid GSTIN format · 18% ITC invoice will be generated</span>
                        </p>
                      )}
                    </div>
                  </div>
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
                        onClick={() => {
                          setPaymentMethod(label as string);
                          setPaymentTab(
                            label === "UPI" ? "upi" : label === "Card" ? "card" : "cod"
                          );
                        }}
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
                onClick={handleOpenPaymentModal}
                disabled={stockErrors.length > 0}
                className="mt-5 w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {!isAuthenticated ? (
                  <>
                    <span>Sign in to Checkout · {inr(quote.total)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Proceed to Secure Payment · {inr(quote.total)}</span>
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

      {/* Riderzpro Custom In-App Payment Gateway Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                    <span>RiderzPro In-App Checkout</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      256-Bit SSL
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct White-Label Orchestrator · Zero Third-Party Redirects
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isProcessingPayment) setIsPaymentModalOpen(false);
                }}
                disabled={isProcessingPayment}
                className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer disabled:opacity-30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Total Amount Banner */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-gray-200/80">
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Total Payable Amount
                </span>
                <p className="text-xl font-extrabold text-[#111111]">{inr(quote.total)}</p>
              </div>
              <div className="text-right text-[11px] text-gray-600 space-y-0.5">
                <p>Includes ₹150 Express Delivery</p>
                <p className="font-semibold text-emerald-600">✓ 18% Statutory GST Included</p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-gray-100 text-xs font-bold">
              {[
                { id: "upi", label: "UPI & QR", icon: Smartphone },
                { id: "card", label: "Cards", icon: CreditCard },
                { id: "netbanking", label: "NetBanking", icon: Store },
                { id: "cod", label: "COD", icon: Banknote },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = paymentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentTab(tab.id as any)}
                    disabled={isProcessingPayment}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition cursor-pointer ${
                      isActive
                        ? "bg-white text-[#E31E24] shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[11px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {paymentTab === "upi" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                  {/* Dynamic QR Code */}
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                    <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" />
                      {/* Corner markers */}
                      <rect x="10" y="10" width="24" height="24" fill="black" />
                      <rect x="14" y="14" width="16" height="16" fill="white" />
                      <rect x="18" y="18" width="8" height="8" fill="black" />
                      <rect x="66" y="10" width="24" height="24" fill="black" />
                      <rect x="70" y="14" width="16" height="16" fill="white" />
                      <rect x="74" y="18" width="8" height="8" fill="black" />
                      <rect x="10" y="66" width="24" height="24" fill="black" />
                      <rect x="14" y="70" width="16" height="16" fill="white" />
                      <rect x="18" y="74" width="8" height="8" fill="black" />
                      {/* Random data pattern */}
                      <rect x="42" y="12" width="6" height="6" fill="black" />
                      <rect x="52" y="18" width="6" height="6" fill="black" />
                      <rect x="44" y="28" width="8" height="6" fill="black" />
                      <rect x="20" y="42" width="6" height="8" fill="black" />
                      <rect x="34" y="42" width="6" height="6" fill="black" />
                      <rect x="46" y="40" width="8" height="8" fill="#E31E24" />
                      <rect x="60" y="44" width="8" height="6" fill="black" />
                      <rect x="76" y="42" width="6" height="8" fill="black" />
                      <rect x="42" y="66" width="6" height="6" fill="black" />
                      <rect x="54" y="72" width="6" height="8" fill="black" />
                      <rect x="68" y="68" width="8" height="6" fill="black" />
                      <rect x="78" y="78" width="8" height="8" fill="black" />
                    </svg>
                    <span className="mt-1 text-[10px] font-mono text-gray-500 uppercase">
                      Scan to Pay
                    </span>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs font-bold text-gray-900">
                      Scan with any UPI App or tap below
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Supports Google Pay, PhonePe, Paytm, CRED & BHIM. Auto-detects payment within 3 seconds.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: "gpay", name: "Google Pay" },
                        { id: "phonepe", name: "PhonePe" },
                        { id: "paytm", name: "Paytm" },
                        { id: "cred", name: "CRED UPI" },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`px-3 py-2 rounded-lg border text-xs font-semibold text-center transition cursor-pointer ${
                            selectedUpiApp === app.id
                              ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-700">
                    Or Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    placeholder="e.g. mobile@okhdfcbank or user@paytm"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-[#E31E24]"
                  />
                </div>
              </div>
            )}

            {paymentTab === "card" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* Virtual Card Preview */}
                <div className="rounded-2xl bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 p-4 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-20">
                    <CreditCard className="h-20 w-20" />
                  </div>
                  <div className="flex justify-between items-center text-xs tracking-wider uppercase font-semibold">
                    <span>RiderzPro Secure Pass</span>
                    <span className="font-bold text-amber-400">
                      {cardNumber.startsWith("4") ? "VISA" : cardNumber.startsWith("5") ? "MASTERCARD" : cardNumber.startsWith("6") ? "RUPAY" : "CARD"}
                    </span>
                  </div>
                  <div className="mt-4 font-mono text-base tracking-widest">
                    {cardNumber || "•••• •••• •••• 4242"}
                  </div>
                  <div className="mt-3 flex justify-between text-[11px] text-gray-300">
                    <div>
                      <span className="block text-[9px] uppercase text-gray-400">Cardholder</span>
                      <span className="font-semibold">{cardHolder || "Aakash Sharma"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-gray-400">Expires</span>
                      <span className="font-semibold">{cardExpiry || "12/28"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                        setCardNumber(formatted);
                      }}
                      placeholder="4532 •••• •••• 8492"
                      className="w-full h-9 px-3 font-mono text-xs rounded-xl border border-gray-300 outline-none focus:border-[#E31E24]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full h-9 px-3 font-mono text-xs rounded-xl border border-gray-300 outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full h-9 px-3 font-mono text-xs rounded-xl border border-gray-300 outline-none focus:border-[#E31E24]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Aakash Sharma"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-[#E31E24]"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-gray-600">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]"
                    />
                    <span>Save card securely per RBI Tokenization Framework</span>
                  </label>
                </div>
              </div>
            )}

            {paymentTab === "netbanking" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-gray-800">Select Your Bank</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer flex items-center justify-between ${
                        selectedBank === b
                          ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBank === b && <Check className="h-3.5 w-3.5 text-[#E31E24]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentTab === "cod" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Banknote className="h-4 w-4" />
                  <span>Doorstep Collection on Delivery</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Pay securely via UPI QR or Cash to the delivery rider when your parcel arrives in Bellandur.
                  Our courier carries digital UPI handheld scanners for zero-contact settlement.
                </p>
                <p className="font-semibold text-[11px] text-gray-700">
                  Total Payable at Doorstep: <strong className="text-[#111111]">{inr(quote.total)}</strong>
                </p>
              </div>
            )}

            {/* Authorize Button & Progress */}
            <div className="pt-2 border-t border-gray-100">
              {isProcessingPayment ? (
                <div className="p-3.5 rounded-xl bg-gray-900 text-white text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold">
                    <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                    <span>{paymentStage}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Please do not refresh or press back</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const method = paymentTab === "upi"
                      ? `UPI (${selectedUpiApp.toUpperCase()})`
                      : paymentTab === "card"
                      ? "Card (Tokenized)"
                      : paymentTab === "netbanking"
                      ? `NetBanking (${selectedBank})`
                      : "Cash on Delivery";
                    handleCompletePayment(method);
                  }}
                  className="w-full h-11 rounded-xl bg-[#E31E24] text-white text-sm font-bold shadow-md hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {paymentTab === "cod" ? "Confirm Order with COD" : `Authorize & Pay ${inr(quote.total)}`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
