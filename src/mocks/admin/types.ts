export interface AdminBike {
  id: string;
  brand: string;
  model: string;
  yearRange: string;
  voltage: number;
  batteryCapacity: string;
  connectorType: string;
  powerKw: number;
  image?: string;
  compatiblePartsCount: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: "Bengaluru" | "Hyderabad" | "Chennai" | "Pune" | "Mumbai";
  address: string;
  pincode: string;
  registeredDate: string;
  status: "Active" | "VIP" | "Blocked";
  garageBikes: string[];
  totalOrders: number;
  totalSpend: number;
  avatarUrl?: string;
}

export interface AdminSeller {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: "Bengaluru" | "Hyderabad" | "Chennai" | "Pune" | "Mumbai";
  gstin: string;
  kycStatus: "Approved" | "Pending" | "Rejected";
  rejectionReason?: string;
  commissionRate: number; // e.g. 12%
  rating: number;
  totalSales: number;
  activeProductsCount: number;
  bankAccount: string;
  joinedDate: string;
}

export interface AdminRider {
  id: string;
  name: string;
  phone: string;
  city: "Bengaluru" | "Hyderabad" | "Chennai" | "Pune" | "Mumbai";
  zone: string;
  lat: number;
  lng: number;
  status: "Online" | "Delivering" | "Idle" | "Offline";
  batteryPct: number;
  rating: number;
  completedDeliveries: number;
  todayEarnings: number;
  vehicle: string;
  documentsVerified: boolean;
  activeOrderId?: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  sku: string;
  category: "Batteries" | "Chargers" | "Brakes & Suspension" | "Motors & Controllers" | "Body & Accessories" | "Riding Gear";
  sellerId: string;
  sellerName: string;
  price: number;
  discountPrice?: number;
  stock: number;
  minStockThreshold: number;
  status: "Active" | "Low Stock" | "Pending Review" | "Out of Stock" | "Rejected";
  warrantyMonths: number;
  specs: Record<string, string>;
  compatibleBikes: string[];
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  verificationStatus?: "approved" | "pending_approval" | "rejected";
  rejectionReason?: string;
  vendorProductRecord?: any;
  pendingRevision?: any;
  [key: string]: any;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sellerId: string;
  sellerName: string;
  bikeCompatible: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: "Bengaluru" | "Hyderabad" | "Chennai" | "Pune" | "Mumbai";
  shippingAddress: string;
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxGst: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Cash on Delivery";
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  status: "Placed" | "Processing" | "Dispatched" | "In Transit" | "Delivered" | "Cancelled";
  trackingNumber: string;
  courier: "Delhivery" | "Blue Dart" | "Shadowfax" | "RiderzPro Fleet";
  riderId?: string;
  riderName?: string;
  fitmentVerified: boolean;
  notes?: string;
}

export interface AdminTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  subject: string;
  category: "Fitment Issue" | "Delayed Delivery" | "Refund Request" | "Damaged Part" | "Technical Help";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  createdAt: string;
  assignedTo: string;
  messages: {
    id: string;
    sender: "customer" | "agent" | "system";
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AdminPaymentTransaction {
  id: string;
  transactionRef: string;
  orderId: string;
  customerName: string;
  type: "Payment" | "Refund" | "Seller Payout" | "Rider Payout";
  amount: number;
  gateway: "Razorpay" | "Cashfree" | "Direct IMPS" | "UPI";
  status: "Success" | "Pending" | "Failed";
  timestamp: string;
  fee: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit: number;
  validFrom: string;
  validTill: string;
  isActive: boolean;
  applicableCategory?: string;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  status: "Approved" | "Flagged" | "Removed";
  verifiedPurchase: boolean;
}

export interface AdminWarrantyClaim {
  id: string;
  claimNumber: string;
  orderId: string;
  productName: string;
  customerName: string;
  serialNumber: string;
  dateFiled: string;
  reason: string;
  status: "Pending Inspection" | "Approved (Replacement)" | "Approved (Refund)" | "Rejected";
  resolutionNotes?: string;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Operations" | "Support" | "Finance";
  status: "Active" | "Invited" | "Suspended";
  avatarInitials: string;
  lastActive: string;
  permissions: {
    orders: boolean;
    sellers: boolean;
    riders: boolean;
    products: boolean;
    payments: boolean;
    settings: boolean;
  };
}

export interface AdminNotificationHistory {
  id: string;
  title: string;
  body: string;
  channel: "Push Notification" | "SMS" | "Email";
  targetAudience: "All Customers" | "Active Riders" | "Bengaluru Users" | "High-Value Buyers";
  sentAt: string;
  reachCount: number;
  openRate: string;
}
