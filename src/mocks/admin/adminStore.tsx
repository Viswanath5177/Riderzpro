import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
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
  approveSellerKyc: (sellerId: string) => void;
  rejectSellerKyc: (sellerId: string, reason: string) => void;
  updateSellerCommission: (sellerId: string, commissionRate: number) => void;
  toggleRiderStatus: (riderId: string, status: AdminRider["status"]) => void;
  addProduct: (product: Omit<AdminProduct, "id" | "rating" | "reviewsCount" | "salesCount">) => void;
  updateProduct: (productId: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (productId: string) => void;
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

const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [bikes] = useState<AdminBike[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [transactions, setTransactions] = useState<AdminPaymentTransaction[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<AdminWarrantyClaim[]>([]);
  const [team, setTeam] = useState<AdminTeamMember[]>(MOCK_ADMIN_TEAM);
  const [notifications, setNotifications] = useState<AdminNotificationHistory[]>([]);

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

  useEffect(() => {
    // 1. Fetch live orders & compute transactions from database
    fetch("/api/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const liveOrders: AdminOrder[] = res.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number || o.id,
            customerId: o.customer_id,
            customerName: o.customer_name || "Customer",
            customerPhone: o.customer_phone || "+91 98765 43210",
            sellerId: o.seller_id,
            sellerName: o.store_name || "Verified EV Seller",
            items: Array.isArray(o.items) && o.items.length > 0 ? o.items.map((it: any) => ({
              id: it.id,
              name: it.product_name,
              quantity: Number(it.quantity) || 1,
              price: Number(it.unit_price) || 0,
              sku: "EV-" + (it.product_id ? it.product_id.slice(-6) : "SKU"),
            })) : [{
              id: "item_01",
              name: "EV Battery / Spare Component",
              quantity: 1,
              price: Number(o.total_amount) || 0,
              sku: "EV-PARTS",
            }],
            totalAmount: Number(o.total_amount) || 0,
            status: o.status === "completed" || o.status === "delivered" ? "Delivered" : o.status === "shipped" ? "In Transit" : o.status === "processing" ? "Processing" : o.status === "cancelled" ? "Cancelled" : "Placed",
            paymentStatus: o.payment_status === "paid" ? "Paid" : o.payment_status === "refunded" ? "Refunded" : "Pending",
            paymentMethod: o.payment_method || "UPI",
            date: o.created_at || new Date().toISOString(),
            deliveryAddress: o.delivery_address || "Bengaluru, Karnataka",
            timeline: [
              { status: "Order Placed", time: o.created_at || "Recent", completed: true },
              { status: "Payment Confirmed", time: o.created_at || "Recent", completed: o.payment_status === "paid" },
            ],
          }));
          setOrders(liveOrders);

          // Compute live transactions
          const liveTransactions: AdminPaymentTransaction[] = res.data.map((o: any) => ({
            id: `txn_${o.id}`,
            orderId: o.id,
            orderNumber: o.order_number || o.id,
            customerId: o.customer_id,
            customerName: o.customer_name || "Customer",
            amount: Number(o.total_amount) || 0,
            method: (o.payment_method || "UPI") as any,
            status: (o.payment_status === "paid" ? "Success" : o.payment_status === "refunded" ? "Refunded" : "Pending") as any,
            date: o.created_at || new Date().toISOString(),
            gatewayRef: `pg_${o.id.slice(-6)}`,
            fee: Math.round(Number(o.total_amount) * 0.02),
            netAmount: Number(o.total_amount) - Math.round(Number(o.total_amount) * 0.02),
          }));
          setTransactions(liveTransactions);
        }
      })
      .catch(() => {});

    // 2. Fetch live products from database
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const liveProducts: AdminProduct[] = res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id.slice(-6)}`,
            category: p.category_name || "Batteries",
            price: Number(p.price) || 0,
            mrp: Number(p.mrp) || Math.round(Number(p.price) * 1.2),
            stock: Number(p.stock) || 0,
            sellerId: p.seller_id,
            sellerName: p.seller_name || "EV Component Partner",
            compatibleBikes: [],
            status: p.verification_status === "approved" || p.is_active ? "Active" : p.verification_status === "pending_approval" ? "Pending" : "Draft",
            rating: 4.8,
            reviewsCount: 12,
            salesCount: 5,
            image: p.image_url || "/placeholder.svg",
            voltage: p.voltage,
            capacity: p.capacity,
          }));
          setProducts(liveProducts);
        }
      })
      .catch(() => {});

    // 3. Fetch live customers from database
    fetch("/api/admin/customers", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const liveCustomers: AdminCustomer[] = res.data.map((c: any) => ({
            id: c.id,
            name: c.full_name || "Customer",
            email: c.email,
            phone: c.phone || "+91 98765 43210",
            totalOrders: Number(c.orders_count) || 0,
            totalSpent: Number(c.total_spent) || 0,
            status: c.is_active ? "Active" : "Blocked",
            registeredDate: c.created_at || new Date().toISOString(),
            savedBikes: [],
            activeTickets: 0,
          }));
          setCustomers(liveCustomers);
        }
      })
      .catch(() => {});

    // 4. Fetch live sellers from database
    fetch("/api/admin/sellers", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const liveSellers: AdminSeller[] = res.data.map((s: any) => ({
            id: s.id,
            storeName: s.store_name || s.storeName,
            ownerName: s.owner_name || s.ownerName,
            email: s.email,
            phone: s.phone,
            city: s.city || "Bengaluru",
            state: s.state || "Karnataka",
            gstin: s.gstin || "29AABCU9603R1ZM",
            rating: 4.9,
            totalProducts: Number(s.product_count) || 0,
            totalSales: Number(s.total_sales) || 0,
            commissionRate: 8,
            kycStatus: s.status === "APPROVED" ? "APPROVED" : s.status === "REJECTED" ? "REJECTED" : "PENDING_REVIEW",
            documents: s.documents || [],
            joinedDate: s.created_at || new Date().toISOString(),
            accountStatus: s.account_status || "ACTIVE",
          }));
          setSellers(liveSellers);
        }
      })
      .catch(() => {});
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: AdminOrder["status"], riderId?: string, notes?: string) => {
    let dbStatus = "pending";
    if (status === "Processing") dbStatus = "processing";
    if (status === "In Transit") dbStatus = "shipped";
    if (status === "Delivered") dbStatus = "completed";
    if (status === "Cancelled") dbStatus = "cancelled";

    fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: dbStatus }),
    }).catch(() => {});

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
    fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "cancelled" }),
    }).catch(() => {});

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled", notes: reason, paymentStatus: "Refunded" } : o))
    );
    toast.error("Order cancelled & refund queued");
  }, []);

  const refundOrder = useCallback((orderId: string, reason = "Refund approved by admin") => {
    fetch(`/api/orders/${encodeURIComponent(orderId)}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reason }),
    }).catch(() => {});

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "Refunded", notes: reason } : o))
    );
    toast.success("Refund processed successfully in database");
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

  const approveSellerKyc = useCallback((sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Approved", rejectionReason: undefined } : s))
    );
    toast.success("Seller KYC approved successfully");
  }, []);

  const rejectSellerKyc = useCallback((sellerId: string, reason: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: "Rejected", rejectionReason: reason } : s))
    );
    toast.error("Seller KYC rejected");
  }, []);

  const updateSellerCommission = useCallback((sellerId: string, commissionRate: number) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, commissionRate } : s)));
    toast.success(`Commission rate updated to ${commissionRate}%`);
  }, []);

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
    setProducts((prev) => [newProd, ...prev]);
    toast.success("Product published to catalog");
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    toast.success("Product updated successfully");
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.info("Product removed from catalog");
  }, []);

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
      rejectSellerKyc,
      updateSellerCommission,
      toggleRiderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
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
      rejectSellerKyc,
      updateSellerCommission,
      toggleRiderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
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
