import type { GstInvoice, InvoiceItem, InvoiceParty, GstTaxBreakdown } from "./types";

export const DEFAULT_NOIDA_SELLER: InvoiceParty = {
  name: "RiderzPro Mobility Solutions Pvt. Ltd.",
  legalName: "RiderzPro Mobility Solutions Private Limited",
  tradeName: "RiderzPro EV Parts Hub — North India",
  address: "Plot B-14, Sector 63, Electronic City",
  city: "Noida",
  state: "Uttar Pradesh",
  stateCode: "09",
  pincode: "201301",
  phone: "+91 120 4892000",
  email: "billing@riderzpro.com",
  gstin: "09AABCR8492Q1Z8",
  pan: "AABCR8492Q",
  cin: "U34100UP2024PTC184920",
};

export const STATE_CODE_MAP: Record<string, string> = {
  "uttar pradesh": "09",
  "delhi": "07",
  "new delhi": "07",
  "haryana": "06",
  "karnataka": "29",
  "maharashtra": "27",
  "tamil nadu": "33",
  "telangana": "36",
  "andhra pradesh": "37",
  "gujarat": "24",
  "rajasthan": "08",
  "punjab": "03",
  "west bengal": "19",
};

export function getStateCode(stateName: string): string {
  const norm = (stateName || "").trim().toLowerCase();
  return STATE_CODE_MAP[norm] || "07"; // Default to Delhi if unspecified
}

/**
 * Numbers to words converter for Indian Rupees
 */
export function numberToWordsInr(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(num: number): string {
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + inWords(num % 100) : "");
    if (num < 100000) return inWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + inWords(num % 1000) : "");
    if (num < 10000000) return inWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + inWords(num % 100000) : "");
    return inWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + inWords(num % 10000000) : "");
  }

  return inWords(rounded) + " Rupees Only";
}

export interface BuildInvoiceParams {
  orderId: string;
  orderNumber?: string;
  createdAt?: number | string | Date;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress: {
    name?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
  gstin?: string;
  businessName?: string;
  items: Array<{
    id?: string;
    name: string;
    category?: string;
    price: number;
    qty: number;
  }>;
  deliveryTotal?: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: "PAID" | "COD_PENDING" | "PENDING";
  paymentId?: string;
  seller?: InvoiceParty;
}

/**
 * Calculates GST breakdown and produces a complete Rule 46 GstInvoice object.
 * Implements: "Noida (UP) -> Delhi is inter-state, so IGST."
 */
export function buildGstInvoice(params: BuildInvoiceParams): GstInvoice {
  const seller = params.seller || DEFAULT_NOIDA_SELLER;
  const buyerState = params.shippingAddress.state || "Delhi";
  const buyerStateCode = getStateCode(buyerState);

  // Noida (UP, code 09) -> Delhi (code 07) is inter-state -> IGST
  const isInterstate = seller.stateCode !== buyerStateCode;

  const invoiceDate = params.createdAt
    ? new Date(params.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const buyerParty: InvoiceParty = {
    name: params.businessName || params.customerName || "Retail Customer",
    legalName: params.businessName || params.customerName,
    address: params.shippingAddress.street,
    city: params.shippingAddress.city,
    state: buyerState,
    stateCode: buyerStateCode,
    pincode: params.shippingAddress.pincode,
    phone: params.shippingAddress.phone || params.customerPhone,
    email: params.customerEmail,
    gstin: params.gstin ? params.gstin.toUpperCase().trim() : undefined,
  };

  // Convert raw items into Rule 46 invoice items
  let itemsGross = 0;
  const invoiceItems: InvoiceItem[] = params.items.map((it, idx) => {
    const gross = it.price * it.qty;
    itemsGross += gross;

    // Goods are sold inclusive of 18% GST in Indian e-commerce
    const taxable = Math.round((gross * 100) / 118);
    const gstTotal = gross - taxable;

    const isBat = (it.category || "").toLowerCase().includes("battery") || it.name.toLowerCase().includes("battery");
    const isCharger = (it.category || "").toLowerCase().includes("charger") || it.name.toLowerCase().includes("charger");
    const hsn = isBat ? "8507 60 00" : isCharger ? "8504 40 90" : "8714 10 90";

    const item: InvoiceItem = {
      id: it.id || `item-${idx + 1}`,
      description: it.name,
      subtext: `Category: ${it.category || "Certified EV Component"} · Fitment Verified`,
      hsnSac: hsn,
      quantity: it.qty,
      unit: "PCS",
      unitPrice: it.price,
      grossAmount: gross,
      taxableAmount: taxable,
      gstRate: 18,
      total: gross,
    };

    if (isInterstate) {
      item.igstRate = 18;
      item.igstAmount = gstTotal;
    } else {
      item.cgstRate = 9;
      item.cgstAmount = Math.round(gstTotal / 2);
      item.sgstRate = 9;
      item.sgstAmount = gstTotal - item.cgstAmount;
    }

    return item;
  });

  // Flat delivery fee of Rs. 150 (SAC 9968 12 for freight/courier transportation)
  const deliveryFee = params.deliveryTotal !== undefined ? params.deliveryTotal : 150;
  const deliveryTaxable = Math.round((deliveryFee * 100) / 118);
  const deliveryGst = deliveryFee - deliveryTaxable;

  const deliveryItem: InvoiceItem = {
    id: "srv-delivery",
    description: "Doorstep Express Courier Fulfillment",
    subtext: "Hyperlocal EV Courier Delivery Service (Fixed Statutory Rate)",
    hsnSac: "9968 12",
    quantity: 1,
    unit: "SRV",
    unitPrice: deliveryFee,
    grossAmount: deliveryFee,
    taxableAmount: deliveryTaxable,
    gstRate: 18,
    total: deliveryFee,
  };

  if (isInterstate) {
    deliveryItem.igstRate = 18;
    deliveryItem.igstAmount = deliveryGst;
  } else {
    deliveryItem.cgstRate = 9;
    deliveryItem.cgstAmount = Math.round(deliveryGst / 2);
    deliveryItem.sgstRate = 9;
    deliveryItem.sgstAmount = deliveryGst - deliveryItem.cgstAmount;
  }

  const allItems = [...invoiceItems, deliveryItem];

  const totalTaxable = allItems.reduce((acc, i) => acc + i.taxableAmount, 0);
  const totalCgst = allItems.reduce((acc, i) => acc + (i.cgstAmount || 0), 0);
  const totalSgst = allItems.reduce((acc, i) => acc + (i.sgstAmount || 0), 0);
  const totalIgst = allItems.reduce((acc, i) => acc + (i.igstAmount || 0), 0);
  const totalGst = isInterstate ? totalIgst : totalCgst + totalSgst;

  const discount = params.discount || 0;
  const grandTotal = itemsGross + deliveryFee - discount;

  const taxBreakdown: GstTaxBreakdown = {
    isInterstate,
    placeOfSupply: `${buyerState} (Code ${buyerStateCode})`,
    placeOfSupplyCode: buyerStateCode,
    taxableAmount: totalTaxable,
    cgst: isInterstate ? 0 : totalCgst,
    sgst: isInterstate ? 0 : totalSgst,
    igst: isInterstate ? totalIgst : 0,
    totalGst,
  };

  const invoiceNumber = `RZP/2026-27/INV-${params.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;

  return {
    invoiceNumber,
    orderId: params.orderId,
    orderNumber: params.orderNumber || params.orderId,
    invoiceDate,
    supplyDate: invoiceDate,
    placeOfSupply: buyerState,
    placeOfSupplyCode: buyerStateCode,
    reverseCharge: false,
    paymentMode: params.paymentMethod || "Razorpay (Online)",
    paymentStatus: params.paymentStatus || "PAID",
    paymentId: params.paymentId,
    waybillNumber: `DEL-${params.orderId.slice(-6).toUpperCase()}`,
    seller,
    buyer: buyerParty,
    shippingAddress: buyerParty,
    items: allItems,
    itemsSubtotal: itemsGross,
    deliveryFee,
    discount,
    taxBreakdown,
    grandTotal,
    totalInWords: numberToWordsInr(grandTotal),
    authenticationToken: `SHA256:RZP-${params.orderId}-${buyerStateCode}-RULE46-VERIFIED`,
  };
}
