import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import {
  AdminOrder,
  AdminCustomer,
  AdminSeller,
  AdminRider,
  AdminProduct,
  AdminBike,
  AdminTicket,
  AdminPaymentTransaction,
  AdminCoupon,
  AdminReview,
  AdminWarrantyClaim,
  AdminTeamMember,
  AdminNotificationHistory,
} from "./types";
import { MOCK_ADMIN_BIKES } from "./bikes";
import { MOCK_ADMIN_CUSTOMERS } from "./customers";
import { MOCK_ADMIN_SELLERS } from "./sellers";
import { MOCK_ADMIN_RIDERS } from "./riders";
import { MOCK_ADMIN_PRODUCTS } from "./products";
import { MOCK_ADMIN_ORDERS } from "./orders";
import { MOCK_ADMIN_TICKETS } from "./tickets";
import { MOCK_ADMIN_TRANSACTIONS } from "./payments";
import { MOCK_ADMIN_COUPONS } from "./offers";
import { MOCK_ADMIN_REVIEWS } from "./reviews";
import { MOCK_ADMIN_WARRANTY } from "./warranty";
import { MOCK_ADMIN_TEAM } from "./team";
import { MOCK_ADMIN_NOTIFICATIONS } from "./notifications";

export interface DeliverySettings {
  activeCities: string[];
  serviceRadiusKm: number;
  baseDeliveryFee: number;
  perKmRate: number;
  freeDeliveryThreshold: number;
  surgeMultiplier: number;
}

export interface AdminStoreContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  bikes: AdminBike[];
  customers: AdminCustomer[];
  sellers: AdminSeller[];
  riders: AdminRider[];
  products: AdminProduct[];
  orders: AdminOrder[];
  tickets: AdminTicket[];
  transactions: AdminPaymentTransaction[];
  coupons: AdminCoupon[];
  reviews: AdminReview[];
  warrantyClaims: AdminWarrantyClaim[];
  team: AdminTeamMember[];
  notifications: AdminNotificationHistory[];
  deliverySettings: DeliverySettings;

  // Actions
  updateOrderStatus: (orderId: string, status: AdminOrder["status"], riderId?: string, notes?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  refundOrder: (orderId: string, reason?: string) => void;
  reassignRider: (orderId: string, riderId: string) => void;
  toggleCustomerBlock: (customerId: string) => void;
  approveSellerKyc: (sellerId: string, commissionRate?: number, tier?: "Standard" | "Gold" | "Platinum") => void;
  requestSellerChanges: (sellerId: string, sections: string[], notes: string) => void;
  rejectSellerKyc: (sellerId: string, reason: string) => void;
  suspendSeller: (sellerId: string, reason?: string) => void;
  reinstateSeller: (sellerId: string) => void;
  updateSellerCommission: (sellerId: string, commissionRate: number) => void;
  toggleRiderStatus: (riderId: string, status: AdminRider["status"]) => void;
  addProduct: (product: Omit<AdminProduct, "id" | "rating" | "reviewsCount" | "salesCount">) => void;
  updateProduct: (productId: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (productId: string) => void;
  approveProductReview: (productId: string, adminEdits?: Partial<AdminProduct>) => void;
  requestProductReviewChanges: (productId: string, comments: Record<string, string>) => void;
  rejectProductReview: (productId: string, reason: string) => void;
  approveAllPending: () => void;
  addCoupon: (coupon: Omit<AdminCoupon, "id" | "usageCount">) => void;
  toggleCouponActive: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;
  replyToTicket: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: AdminTicket["status"]) => void;
  moderateReview: (reviewId: string, status: AdminReview["status"]) => void;
  resolveWarrantyClaim: (claimId: string, resolution: AdminWarrantyClaim["status"], notes?: string) => void;
  inviteTeamMember: (member: Omit<AdminTeamMember, "id" | "lastActive" | "status" | "avatarInitials">) => void;
  removeTeamMember: (memberId: string) => void;
  sendNotificationCampaign: (title: string, body: string, channel: AdminNotificationHistory["channel"], targetAudience: AdminNotificationHistory["targetAudience"]) => void;
  updateDeliverySettings: (updates: Partial<DeliverySettings>) => void;
}

export function mapCategoryToAdmin(cat: string): AdminProduct["category"] {
  switch (cat) {
    case "Battery":
    case "BMS":
      return "Batteries";
    case "Charger":
      return "Chargers";
    case "Motor":
    case "Controller":
      return "Motors & Controllers";
    case "Brakes":
    case "Spare Parts":
      return "Brakes & Suspension";
    case "Riding Gear & Helmets":
      return "Riding Gear";
    case "Electric Bikes":
    case "Car Accessories":
    case "Bike Accessories":
    default:
      return "Body & Accessories";
  }
}

const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const vendorStore = useVendorStore();
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [bikes] = useState<AdminBike[]>(MOCK_ADMIN_BIKES);
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_ADMIN_CUSTOMERS);
  const [mockSellers, setMockSellers] = useState<AdminSeller[]>(MOCK_ADMIN_SELLERS);
  const [riders, setRiders] = useState<AdminRider[]>(MOCK_ADMIN_RIDERS);
  const [mockProducts, setMockProducts] = useState<AdminProduct[]>(MOCK_ADMIN_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [tickets, setTickets] = useState<AdminTicket[]>(MOCK_ADMIN_TICKETS);
  const [transactions, setTransactions] = useState<AdminPaymentTransaction[]>(MOCK_ADMIN_TRANSACTIONS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(MOCK_ADMIN_COUPONS);
  const [reviews, setReviews] = useState<AdminReview[]>(MOCK_ADMIN_REVIEWS);
  const [warrantyClaims, setWarrantyClaims] = useState<AdminWarrantyClaim[]>(MOCK_ADMIN_WARRANTY);
  const [team, setTeam] = useState<AdminTeamMember[]>(MOCK_ADMIN_TEAM);
  const [notifications, setNotifications] = useState<AdminNotificationHistory[]>(MOCK_ADMIN_NOTIFICATIONS);

  // Merge real vendors with mock sellers
  const sellers = useMemo<AdminSeller[]>(() => {
    const fromVendors: AdminSeller[] = vendorStore.vendors.map((v) => {
      let kycStatus: AdminSeller["kycStatus"] = "Pending";
      if (v.status === "approved") kycStatus = "Approved";
      else if (v.status === "rejected") kycStatus = "Rejected";
      else if (v.status === "changes_requested") kycStatus = "Changes Requested";
      else if (v.status === "suspended") kycStatus = "Suspended";

      return {
        id: v.id,
        businessName: v.storeName || v.businessName,
        ownerName: v.onboarding?.account?.fullName || v.businessName,
        phone: v.phone,
        email: v.email,
        city: (v.area || "Bengaluru") as any,
        gstin: v.onboarding?.tax?.gstExempt ? "EXEMPT" : (v.onboarding?.tax?.gstin || "N/A"),
        kycStatus,
        rejectionReason: v.rejectionReason,
        commissionRate: v.commissionRate,
        rating: v.rating,
        totalSales: v.totalSales,
        activeProductsCount: v.activeProductsCount,
        bankAccount: v.onboarding?.bank?.maskedAccountNumber || "Masked A/C",
        joinedDate: new Date(v.createdAt).toLocaleDateString("en-IN"),
        vendorRecord: v,
      };
    });

    const vendorIds = new Set(fromVendors.map((s) => s.id));
    const nonDuplicatedMocks = mockSellers.filter((s) => !vendorIds.has(s.id));
    return [...fromVendors, ...nonDuplicatedMocks];
  }, [vendorStore.vendors, mockSellers]);

  // Merge real vendor products with mock products
  const products = useMemo<AdminProduct[]>(() => {
    const fromVendorProducts: AdminProduct[] = vendorStore.products.map((vp) => {
      let status: AdminProduct["status"] = "Active";
      if (vp.status === "pending_review") status = "Pending Review";
      else if (vp.status === "live") {
        status = vp.stock <= (vp.minStockAlert || 5) ? "Low Stock" : "Active";
      } else {
        status = "Pending Review";
      }

      return {
        id: vp.id,
        title: vp.title,
        sku: vp.sku,
        category: mapCategoryToAdmin(vp.category),
        sellerId: vp.vendorId,
        sellerName: vp.vendorName,
        price: vp.mrp,
        discountPrice: vp.sellingPrice,
        stock: vp.stock,
        minStockThreshold: vp.minStockAlert,
        status,
        warrantyMonths: vp.warrantyMonths,
        specs: Object.fromEntries(
          Object.entries(vp.specs || {}).map(([k, v]) => [k, String(v)])
        ),
        compatibleBikes: vp.fits,
        imageUrl: vp.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewsCount: 0,
        salesCount: 0,
        vendorProductRecord: vp,
        pendingRevision: vp.pendingRevision,
      };
    });

    const vpIds = new Set(fromVendorProducts.map((p) => p.id));
    const nonDuplicatedMocks = mockProducts.filter((p) => !vpIds.has(p.id));
    return [...fromVendorProducts, ...nonDuplicatedMocks];
  }, [vendorStore.products, mockProducts]);

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    activeCities: ["Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai"],
    serviceRadiusKm: 25,
    baseDeliveryFee: 40,
    perKmRate: 12,
    freeDeliveryThreshold: 5000,
    surgeMultiplier: 1.0,
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: AdminOrder["status"], riderId?: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const matchedRider = riderId ? riders.find((r) => r.id === riderId) : undefined;
        return {
          ...o,
          status,
          riderId: riderId ?? o.riderId,
          riderName: matchedRider ? `${matchedRider.name} (${matchedRider.phone})` : o.riderName,
          notes: notes ?? o.notes,
        };
      })
    );
    toast.success(`Order status updated to ${status}`);
  }, [riders]);

  const cancelOrder = useCallback((orderId: string, reason = "Cancelled by operations") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled", notes: reason, paymentStatus: "Refunded" } : o))
    );
    toast.error("Order cancelled & refund queued");
  }, []);

  const refundOrder = useCallback((orderId: string, reason = "Refund approved by admin") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "Refunded", notes: reason } : o))
    );
    toast.success("Refund processed successfully via Razorpay");
  }, []);

  const reassignRider = useCallback((orderId: string, riderId: string) => {
    const rider = riders.find((r) => r.id === riderId);
    if (!rider) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, riderId: rider.id, riderName: `${rider.name} (${rider.phone})` } : o))
    );
    toast.success(`Assigned to ${rider.name}`);
  }, [riders]);

  const toggleCustomerBlock = useCallback((customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const nextStatus = c.status === "Blocked" ? "Active" : "Blocked";
        toast.info(`Customer account ${nextStatus.toLowerCase()}`);
        return { ...c, status: nextStatus };
      })
    );
  }, []);

  // Seller KYC Actions
  const approveSellerKyc = useCallback((sellerId: string, commissionRate = 10, tier: "Standard" | "Gold" | "Platinum" = "Standard") => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.approveVendor(sellerId, commissionRate, tier);
    } else {
      setMockSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Approved", rejectionReason: undefined, commissionRate } : s))
      );
      toast.success("Seller KYC approved successfully");
    }
  }, [vendorStore]);

  const requestSellerChanges = useCallback((sellerId: string, sections: string[], notes: string) => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.requestVendorChanges(sellerId, sections, notes);
    } else {
      setMockSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Changes Requested", rejectionReason: notes } : s))
      );
      toast.info("Changes requested from seller");
    }
  }, [vendorStore]);

  const rejectSellerKyc = useCallback((sellerId: string, reason: string) => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.rejectVendor(sellerId, reason);
    } else {
      setMockSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Rejected", rejectionReason: reason } : s))
      );
      toast.error("Seller KYC rejected");
    }
  }, [vendorStore]);

  const suspendSeller = useCallback((sellerId: string, reason = "Suspended by admin") => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.suspendVendor(sellerId, reason);
    } else {
      setMockSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Suspended", rejectionReason: reason } : s))
      );
      toast.error("Seller suspended");
    }
  }, [vendorStore]);

  const reinstateSeller = useCallback((sellerId: string) => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.reinstateVendor(sellerId);
    } else {
      setMockSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Approved", rejectionReason: undefined } : s))
      );
      toast.success("Seller reinstated to active status");
    }
  }, [vendorStore]);

  const updateSellerCommission = useCallback((sellerId: string, commissionRate: number) => {
    if (vendorStore.vendors.some((v) => v.id === sellerId)) {
      vendorStore.updateVendor(sellerId, { commissionRate });
    }
    setMockSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, commissionRate } : s)));
    toast.success(`Commission rate updated to ${commissionRate}%`);
  }, [vendorStore]);

  const toggleRiderStatus = useCallback((riderId: string, status: AdminRider["status"]) => {
    setRiders((prev) => prev.map((r) => (r.id === riderId ? { ...r, status } : r)));
    toast.info(`Rider status changed to ${status}`);
  }, []);

  const addProduct = useCallback((data: Omit<AdminProduct, "id" | "rating" | "reviewsCount" | "salesCount">) => {
    const newProd: AdminProduct = {
      ...data,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
    };
    setMockProducts((prev) => [newProd, ...prev]);
    toast.success("Product published to catalog");
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<AdminProduct>) => {
    if (vendorStore.products.some((p) => p.id === productId)) {
      vendorStore.updateProduct(productId, updates as any, { isStaffAction: true });
    }
    setMockProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    toast.success("Product updated successfully");
  }, [vendorStore]);

  const deleteProduct = useCallback((productId: string) => {
    if (vendorStore.products.some((p) => p.id === productId)) {
      vendorStore.deleteProduct(productId, { isStaffAction: true });
    }
    setMockProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.info("Product removed from catalog");
  }, [vendorStore]);

  // Product Approvals Queue Actions
  const approveProductReview = useCallback((productId: string, adminEdits?: Partial<AdminProduct>) => {
    if (vendorStore.products.some((p) => p.id === productId)) {
      vendorStore.approveProduct(productId, adminEdits as any);
    } else {
      setMockProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "Active", ...adminEdits } : p))
      );
      toast.success("Product approved and is now LIVE!");
    }
  }, [vendorStore]);

  const requestProductReviewChanges = useCallback((productId: string, comments: Record<string, string>) => {
    if (vendorStore.products.some((p) => p.id === productId)) {
      vendorStore.requestProductChanges(productId, comments);
    } else {
      toast.info("Requested revisions on product");
    }
  }, [vendorStore]);

  const rejectProductReview = useCallback((productId: string, reason: string) => {
    if (vendorStore.products.some((p) => p.id === productId)) {
      vendorStore.rejectProduct(productId, reason);
    } else {
      setMockProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.error("Product rejected from catalog");
    }
  }, [vendorStore]);

  const approveAllPending = useCallback(() => {
    // Approve all pending vendors
    vendorStore.vendors.filter((v) => v.status === "submitted" || v.status === "under_review").forEach((v) => {
      vendorStore.approveVendor(v.id, 10, "Standard");
    });
    // Approve all pending products
    vendorStore.products.filter((p) => p.status === "pending_review").forEach((p) => {
      vendorStore.approveProduct(p.id);
    });
    // Also approve mock products in pending review
    setMockProducts((prev) =>
      prev.map((p) => (p.status === "Pending Review" ? { ...p, status: "Active" } : p))
    );
    toast.success("Demo Mode: Approved all pending sellers and products!");
  }, [vendorStore]);

  const addCoupon = useCallback((data: Omit<AdminCoupon, "id" | "usageCount">) => {
    const newCoupon: AdminCoupon = {
      ...data,
      id: `cpn_${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    toast.success(`Coupon code ${data.code} created`);
  }, []);

  const toggleCouponActive = useCallback((couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
    toast.info("Coupon status updated");
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    toast.info("Coupon deleted");
  }, []);

  const replyToTicket = useCallback((ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newMsg = {
          id: `msg_${Date.now()}`,
          sender: "agent" as const,
          senderName: "Operations Support",
          text,
          timestamp: new Date().toISOString(),
        };
        return { ...t, messages: [...t.messages, newMsg], status: "In Progress" };
      })
    );
    toast.success("Reply sent to customer");
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: AdminTicket["status"]) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
    toast.info(`Ticket status: ${status}`);
  }, []);

  const moderateReview = useCallback((reviewId: string, status: AdminReview["status"]) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    toast.info(`Review ${status.toLowerCase()}`);
  }, []);

  const resolveWarrantyClaim = useCallback((claimId: string, status: AdminWarrantyClaim["status"], notes?: string) => {
    setWarrantyClaims((prev) =>
      prev.map((w) => (w.id === claimId ? { ...w, status, resolutionNotes: notes || w.resolutionNotes } : w))
    );
    toast.success(`Warranty claim updated: ${status}`);
  }, []);

  const inviteTeamMember = useCallback((data: Omit<AdminTeamMember, "id" | "lastActive" | "status" | "avatarInitials">) => {
    const initials = data.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const newMember: AdminTeamMember = {
      ...data,
      id: `team_${Date.now()}`,
      status: "Invited",
      lastActive: "Pending Invite",
      avatarInitials: initials,
    };
    setTeam((prev) => [...prev, newMember]);
    toast.success(`Invitation sent to ${data.email}`);
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== memberId));
    toast.info("Team member access revoked");
  }, []);

  const sendNotificationCampaign = useCallback(
    (title: string, body: string, channel: AdminNotificationHistory["channel"], targetAudience: AdminNotificationHistory["targetAudience"]) => {
      const reachCount = targetAudience === "All Customers" ? 2840 : targetAudience === "Bengaluru Users" ? 1420 : 640;
      const newNotif: AdminNotificationHistory = {
        id: `notif_${Date.now()}`,
        title,
        body,
        channel,
        targetAudience,
        sentAt: new Date().toISOString(),
        reachCount,
        openRate: "Pending",
      };
      setNotifications((prev) => [newNotif, ...prev]);
      toast.success(`Notification broadcast dispatched to ${reachCount} users`);
    },
    []
  );

  const updateDeliverySettings = useCallback((updates: Partial<DeliverySettings>) => {
    setDeliverySettings((prev) => ({ ...prev, ...updates }));
    toast.success("Delivery configuration updated");
  }, []);

  const value = useMemo<AdminStoreContextType>(
    () => ({
      theme,
      toggleTheme,
      bikes,
      customers,
      sellers,
      riders,
      products,
      orders,
      tickets,
      transactions,
      coupons,
      reviews,
      warrantyClaims,
      team,
      notifications,
      deliverySettings,
      updateOrderStatus,
      cancelOrder,
      refundOrder,
      reassignRider,
      toggleCustomerBlock,
      approveSellerKyc,
      requestSellerChanges,
      rejectSellerKyc,
      suspendSeller,
      reinstateSeller,
      updateSellerCommission,
      toggleRiderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      approveProductReview,
      requestProductReviewChanges,
      rejectProductReview,
      approveAllPending,
      addCoupon,
      toggleCouponActive,
      deleteCoupon,
      replyToTicket,
      updateTicketStatus,
      moderateReview,
      resolveWarrantyClaim,
      inviteTeamMember,
      removeTeamMember,
      sendNotificationCampaign,
      updateDeliverySettings,
    }),
    [
      theme,
      toggleTheme,
      bikes,
      customers,
      sellers,
      riders,
      products,
      orders,
      tickets,
      transactions,
      coupons,
      reviews,
      warrantyClaims,
      team,
      notifications,
      deliverySettings,
      updateOrderStatus,
      cancelOrder,
      refundOrder,
      reassignRider,
      toggleCustomerBlock,
      approveSellerKyc,
      requestSellerChanges,
      rejectSellerKyc,
      suspendSeller,
      reinstateSeller,
      updateSellerCommission,
      toggleRiderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      approveProductReview,
      requestProductReviewChanges,
      rejectProductReview,
      approveAllPending,
      addCoupon,
      toggleCouponActive,
      deleteCoupon,
      replyToTicket,
      updateTicketStatus,
      moderateReview,
      resolveWarrantyClaim,
      inviteTeamMember,
      removeTeamMember,
      sendNotificationCampaign,
      updateDeliverySettings,
    ]
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return ctx;
}
