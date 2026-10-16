export interface InvoiceParty {
  name: string;
  legalName?: string;
  tradeName?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string; // e.g. "09" for UP, "07" for Delhi, "29" for Karnataka
  pincode: string;
  phone?: string;
  email?: string;
  gstin?: string; // Buyer GSTIN if B2B, or URP if unregistered
  pan?: string;
  cin?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  subtext?: string;
  hsnSac: string; // e.g. "8507 60 00" for batteries, "8504 40 90" for chargers, "9968 12" for courier
  quantity: number;
  unit: string; // e.g. "PCS" or "SRV"
  unitPrice: number;
  grossAmount: number;
  taxableAmount: number;
  gstRate: number; // e.g. 18 for 18%
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  total: number;
}

export interface GstTaxBreakdown {
  isInterstate: boolean;
  placeOfSupply: string;
  placeOfSupplyCode: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
}

export interface GstInvoice {
  invoiceNumber: string;
  orderId: string;
  orderNumber?: string;
  invoiceDate: string;
  supplyDate: string;
  placeOfSupply: string;
  placeOfSupplyCode: string;
  reverseCharge: boolean;
  paymentMode: string;
  paymentStatus: "PAID" | "COD_PENDING" | "PENDING";
  paymentId?: string;
  waybillNumber?: string;
  seller: InvoiceParty;
  buyer: InvoiceParty;
  shippingAddress: InvoiceParty;
  items: InvoiceItem[];
  itemsSubtotal: number;
  deliveryFee: number;
  discount: number;
  taxBreakdown: GstTaxBreakdown;
  grandTotal: number;
  totalInWords: string;
  authenticationToken: string;
}
