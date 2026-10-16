import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type {
  Vendor,
  VendorProduct,
  VendorOnboarding,
  VendorNotification,
  VendorSupportTicket,
  ProductRevision,
  Settlement,
} from "./types";
import { SEED_VENDORS, SEED_VENDOR_PRODUCTS } from "./seedData";

export const VENDORS_STORAGE_KEY = "riderzpro_vendors";
export const VENDOR_PRODUCTS_STORAGE_KEY = "riderzpro_vendor_products";
export const VENDOR_NOTIFS_STORAGE_KEY = "riderzpro_vendor_notifications";
export const VENDOR_TICKETS_STORAGE_KEY = "riderzpro_vendor_tickets";

export interface VendorStoreContextType {
  vendors: Vendor[];
  products: VendorProduct[];
  notifications: VendorNotification[];
  tickets: VendorSupportTicket[];
  getVendor: (id: string) => Vendor | undefined;
  getVendorByPhone: (phone: string) => Vendor | undefined;
  getVendorByEmail: (email: string) => Vendor | undefined;
  saveVendorDraft: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  updateVendorOnboarding: (vendorId: string, partial: Partial<VendorOnboarding>) => void;
  updateOnboardingStep: (vendorId: string, step: number, stepData: Partial<VendorOnboarding>) => void;
  submitOnboarding: (vendorId: string) => void;
  // Admin actions
  approveVendor: (vendorId: string, commissionRate?: number, tier?: "Standard" | "Gold" | "Platinum") => void;
  requestVendorChanges: (vendorId: string, sections: string[], notes: string) => void;
  rejectVendor: (vendorId: string, reason: string) => void;
  suspendVendor: (vendorId: string, reason?: string) => void;
  reinstateVendor: (vendorId: string) => void;
  // Product actions
  addProduct: (productData: Omit<VendorProduct, "id" | "createdAt" | "updatedAt">) => VendorProduct;
  updateProduct: (id: string, updates: Partial<VendorProduct>, options?: { isStaffAction?: boolean }) => void;
  submitProductRevision: (id: string, revision: ProductRevision) => void;
  requestProductRevision?: (id: string, revision: ProductRevision) => void;
  approveProduct: (id: string, adminEdits?: Partial<VendorProduct>) => void;
  requestProductChanges: (id: string, comments: Record<string, string>) => void;
  rejectProduct: (id: string, reason: string) => void;
  deleteProduct: (id: string, options?: { isStaffAction?: boolean }) => void;
  toggleHolidayMode: (vendorId: string) => void;
  // Notifications & Support
  addNotification: (notif: Omit<VendorNotification, "id" | "time" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead?: () => void;
  settlements?: Settlement[];
  requestBankUpdate?: (vendorId: string, bankData: any) => void;
  createTicket: (vendorId: string, subject: string, category: VendorSupportTicket["category"], message: string) => void;
  replyTicket: (ticketId: string, text: string, sender: "vendor" | "admin", senderName: string) => void;
}

const VendorStoreContext = createContext<VendorStoreContextType | null>(null);

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel("riderzpro_vendor_bus");
  } catch (e) {
    console.warn("BroadcastChannel not supported", e);
  }
}

export function VendorStoreProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    if (typeof window === "undefined") return SEED_VENDORS;
    try {
      const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(SEED_VENDORS));
      return SEED_VENDORS;
    } catch {
      return SEED_VENDORS;
    }
  });

  const [products, setProducts] = useState<VendorProduct[]>(() => {
    if (typeof window === "undefined") return SEED_VENDOR_PRODUCTS;
    try {
      const stored = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(VENDOR_PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_VENDOR_PRODUCTS));
      return SEED_VENDOR_PRODUCTS;
    } catch {
      return SEED_VENDOR_PRODUCTS;
    }
  });

  const [notifications, setNotifications] = useState<VendorNotification[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(VENDOR_NOTIFS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: "notif_01",
          vendorId: "v1",
          title: "KYC Approved",
          message: "Your seller account has been approved. You can now list catalog items.",
          time: "Yesterday",
          read: true,
          type: "approval",
        },
      ];
    } catch {
      return [];
    }
  });

  const [tickets, setTickets] = useState<VendorSupportTicket[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(VENDOR_TICKETS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return [];
    } catch {
      return [];
    }
  });

  // Cross-tab synchronization
  const notifyBroadcast = useCallback((type: string, payload?: any) => {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {
        console.error("Broadcast failed:", e);
      }
    }
  }, []);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === VENDORS_STORAGE_KEY && e.newValue) {
        try {
          setVendors(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === VENDOR_PRODUCTS_STORAGE_KEY && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === VENDOR_NOTIFS_STORAGE_KEY && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch {}
      }
    }

    function handleChannelMessage(e: MessageEvent) {
      const { type } = e.data || {};
      if (type === "VENDORS_UPDATED") {
        const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
        if (stored) setVendors(JSON.parse(stored));
      } else if (type === "PRODUCTS_UPDATED") {
        const stored = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
        if (stored) setProducts(JSON.parse(stored));
      }
    }

    window.addEventListener("storage", handleStorage);
    if (broadcastChannel) {
      broadcastChannel.addEventListener("message", handleChannelMessage);
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener("message", handleChannelMessage);
      }
    };
  }, []);

  // Helper to persist vendors
  const persistVendors = useCallback((updated: Vendor[]) => {
    setVendors(updated);
    try {
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(updated));
      notifyBroadcast("VENDORS_UPDATED");
    } catch (e) {
      console.error("Failed to persist vendors:", e);
    }
  }, [notifyBroadcast]);

  // Helper to persist products
  const persistProducts = useCallback((updated: VendorProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(VENDOR_PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      notifyBroadcast("PRODUCTS_UPDATED");
    } catch (e) {
      console.error("Failed to persist products:", e);
    }
  }, [notifyBroadcast]);

  // Helper to persist notifications
  const persistNotifications = useCallback((updated: VendorNotification[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem(VENDOR_NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  // Helper to persist tickets
  const persistTickets = useCallback((updated: VendorSupportTicket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem(VENDOR_TICKETS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const getVendor = useCallback((id: string) => vendors.find((v) => v.id === id), [vendors]);

  const getVendorByPhone = useCallback(
    (phone: string) => {
      const clean = phone.replace(/\D/g, "").slice(-10);
      return vendors.find((v) => v.phone.replace(/\D/g, "").slice(-10) === clean);
    },
    [vendors]
  );

  const getVendorByEmail = useCallback(
    (email: string) => {
      const clean = email.trim().toLowerCase();
      return vendors.find((v) => v.email.toLowerCase() === clean);
    },
    [vendors]
  );

  const saveVendorDraft = useCallback(
    (vendor: Vendor) => {
      const existing = vendors.findIndex((v) => v.id === vendor.id);
      let updated: Vendor[];
      if (existing >= 0) {
        updated = vendors.map((v) => (v.id === vendor.id ? { ...vendor, updatedAt: Date.now() } : v));
      } else {
        updated = [...vendors, { ...vendor, createdAt: Date.now(), updatedAt: Date.now() }];
      }
      persistVendors(updated);
    },
    [vendors, persistVendors]
  );

  const updateVendor = useCallback(
    (id: string, updates: Partial<Vendor>) => {
      const updated = vendors.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: Date.now() } : v));
      persistVendors(updated);
    },
    [vendors, persistVendors]
  );

  const updateOnboardingStep = useCallback(
    (vendorId: string, step: number, stepData: Partial<VendorOnboarding>) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const currentCompleted = new Set(v.onboarding.completedSteps || []);
        currentCompleted.add(step);
        const nextStep = Math.min(6, Math.max(step + 1, v.onboarding.currentStep));

        const updatedOnboarding: VendorOnboarding = {
          ...v.onboarding,
          ...stepData,
          currentStep: nextStep,
          completedSteps: Array.from(currentCompleted),
        };

        // If step 3 store was updated, sync storeName and slug to root
        const rootUpdates: Partial<Vendor> = {};
        if (stepData.store?.storeName) {
          rootUpdates.storeName = stepData.store.storeName;
          rootUpdates.slug = stepData.store.slug;
        }
        if (stepData.shipping?.pickupAddress) {
          rootUpdates.lat = stepData.shipping.pickupAddress.lat;
          rootUpdates.lng = stepData.shipping.pickupAddress.lng;
          rootUpdates.area = stepData.shipping.pickupAddress.city;
        }
        if (stepData.shipping?.handlingTimeMins) {
          rootUpdates.prepMins = stepData.shipping.handlingTimeMins;
        }

        return {
          ...v,
          ...rootUpdates,
          onboarding: updatedOnboarding,
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);
    },
    [vendors, persistVendors]
  );

  const updateVendorOnboarding = useCallback(
    (vendorId: string, partial: Partial<VendorOnboarding>) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const rootUpdates: Partial<Vendor> = {};
        if (partial.store?.storeName) {
          rootUpdates.storeName = partial.store.storeName;
          rootUpdates.slug = partial.store.slug;
        }
        return {
          ...v,
          ...rootUpdates,
          onboarding: {
            ...v.onboarding,
            ...partial,
            store: { ...v.onboarding.store, ...partial.store },
            shipping: { ...v.onboarding.shipping, ...partial.shipping },
          },
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);
    },
    [vendors, persistVendors]
  );

  const submitOnboarding = useCallback(
    (vendorId: string) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const timeline = [
          ...v.auditTimeline,
          {
            id: `evt_${Date.now()}`,
            timestamp: Date.now(),
            actor: v.onboarding.account.fullName || "Vendor",
            actorRole: "vendor" as const,
            action: "Submitted onboarding verification application",
          },
        ];
        return {
          ...v,
          status: "submitted" as const,
          auditTimeline: timeline,
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);
      toast.success("Application submitted for admin verification!");
    },
    [vendors, persistVendors]
  );

  // Admin: Approve Vendor
  const approveVendor = useCallback(
    (vendorId: string, commissionRate = 10, tier: "Standard" | "Gold" | "Platinum" = "Standard") => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const timeline = [
          ...v.auditTimeline,
          {
            id: `evt_${Date.now()}`,
            timestamp: Date.now(),
            actor: "Admin Operations",
            actorRole: "admin" as const,
            action: `Approved KYC application. Commission: ${commissionRate}%, Tier: ${tier}`,
          },
        ];
        return {
          ...v,
          status: "approved" as const,
          commissionRate,
          tier,
          rejectionReason: undefined,
          changesRequestedSections: undefined,
          changesRequestedNotes: undefined,
          auditTimeline: timeline,
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);

      // Add vendor notification
      const newNotif: VendorNotification = {
        id: `notif_${Date.now()}`,
        vendorId,
        title: "KYC Approved 🎉",
        message: `Congratulations! Your seller account is approved at ${commissionRate}% commission. You can now add and manage catalog products.`,
        time: "Just now",
        read: false,
        type: "approval",
        link: "/vendor/dashboard/products",
      };
      persistNotifications([newNotif, ...notifications]);
      toast.success("Vendor approved successfully!");
    },
    [vendors, notifications, persistVendors, persistNotifications]
  );

  // Admin: Request Changes
  const requestVendorChanges = useCallback(
    (vendorId: string, sections: string[], notes: string) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const timeline = [
          ...v.auditTimeline,
          {
            id: `evt_${Date.now()}`,
            timestamp: Date.now(),
            actor: "Admin Compliance",
            actorRole: "admin" as const,
            action: `Requested changes on sections: ${sections.join(", ")}`,
            notes,
          },
        ];
        return {
          ...v,
          status: "changes_requested" as const,
          changesRequestedSections: sections,
          changesRequestedNotes: notes,
          auditTimeline: timeline,
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);

      const newNotif: VendorNotification = {
        id: `notif_${Date.now()}`,
        vendorId,
        title: "Changes Requested on Onboarding",
        message: `Admin requested updates on: ${sections.join(", ")}. Note: ${notes}`,
        time: "Just now",
        read: false,
        type: "policy",
        link: "/vendor/pending",
      };
      persistNotifications([newNotif, ...notifications]);
      toast.info("Changes requested from vendor.");
    },
    [vendors, notifications, persistVendors, persistNotifications]
  );

  // Admin: Reject Vendor
  const rejectVendor = useCallback(
    (vendorId: string, reason: string) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const timeline = [
          ...v.auditTimeline,
          {
            id: `evt_${Date.now()}`,
            timestamp: Date.now(),
            actor: "Admin Compliance",
            actorRole: "admin" as const,
            action: `Rejected seller onboarding`,
            notes: reason,
          },
        ];
        return {
          ...v,
          status: "rejected" as const,
          rejectionReason: reason,
          auditTimeline: timeline,
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);

      const newNotif: VendorNotification = {
        id: `notif_${Date.now()}`,
        vendorId,
        title: "Application Rejected",
        message: `Your seller onboarding was rejected. Reason: ${reason}`,
        time: "Just now",
        read: false,
        type: "policy",
        link: "/vendor/pending",
      };
      persistNotifications([newNotif, ...notifications]);
      toast.error("Seller onboarding rejected.");
    },
    [vendors, notifications, persistVendors, persistNotifications]
  );

  // Admin: Suspend Vendor
  const suspendVendor = useCallback(
    (vendorId: string, reason = "Suspended by admin") => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        return {
          ...v,
          status: "suspended" as const,
          rejectionReason: reason,
          auditTimeline: [
            ...v.auditTimeline,
            {
              id: `evt_${Date.now()}`,
              timestamp: Date.now(),
              actor: "Admin Compliance",
              actorRole: "admin" as const,
              action: `Suspended vendor account`,
              notes: reason,
            },
          ],
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);
      toast.error("Vendor account suspended.");
    },
    [vendors, persistVendors]
  );

  // Admin: Reinstate Vendor
  const reinstateVendor = useCallback(
    (vendorId: string) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        return {
          ...v,
          status: "approved" as const,
          rejectionReason: undefined,
          auditTimeline: [
            ...v.auditTimeline,
            {
              id: `evt_${Date.now()}`,
              timestamp: Date.now(),
              actor: "Admin Compliance",
              actorRole: "admin" as const,
              action: `Reinstated vendor account`,
            },
          ],
          updatedAt: Date.now(),
        };
      });
      persistVendors(updated);
      toast.success("Vendor account reinstated to active status.");
    },
    [vendors, persistVendors]
  );

  // Holiday Mode Toggle
  const toggleHolidayMode = useCallback(
    (vendorId: string) => {
      const updated = vendors.map((v) => {
        if (v.id !== vendorId) return v;
        const nextMode = !v.holidayMode;
        toast.info(nextMode ? "Holiday mode enabled: listings paused" : "Holiday mode disabled: listings resumed");
        return { ...v, holidayMode: nextMode, updatedAt: Date.now() };
      });
      persistVendors(updated);
    },
    [vendors, persistVendors]
  );

  // Product Actions (Enforce KYC Verification Approval Gate)
  const addProduct = useCallback(
    (productData: Omit<VendorProduct, "id" | "createdAt" | "updatedAt">): VendorProduct => {
      const vendor = vendors.find((v) => v.id === productData.vendorId);
      if (vendor && vendor.status !== "approved") {
        toast.error("Action blocked: Vendor must be KYC approved by admin before adding products.");
        throw new Error("KYC verification must be completed and approved by admin before adding products.");
      }
      const newProduct: VendorProduct = {
        ...productData,
        id: `vp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      persistProducts([newProduct, ...products]);
      toast.success(newProduct.status === "draft" ? "Draft saved" : "Product submitted for review!");
      return newProduct;
    },
    [vendors, products, persistProducts]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<VendorProduct>, options?: { isStaffAction?: boolean }) => {
      const targetProduct = products.find((p) => p.id === id);
      if (targetProduct && !options?.isStaffAction) {
        const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
        if (vendor && vendor.status !== "approved") {
          toast.error("Action blocked: Vendor must be KYC approved by admin before modifying products.");
          return;
        }
      }
      const updated = products.map((p) => {
        if (p.id !== id) return p;
        return { ...p, ...updates, updatedAt: Date.now() };
      });
      persistProducts(updated);
      toast.success("Product updated successfully");
    },
    [vendors, products, persistProducts]
  );

  const submitProductRevision = useCallback(
    (id: string, revision: ProductRevision) => {
      const targetProduct = products.find((p) => p.id === id);
      if (targetProduct) {
        const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
        if (vendor && vendor.status !== "approved") {
          toast.error("Action blocked: Vendor must be KYC approved by admin before submitting revisions.");
          return;
        }
      }
      const updated = products.map((p) => {
        if (p.id !== id) return p;
        return { ...p, pendingRevision: revision, updatedAt: Date.now() };
      });
      persistProducts(updated);
      toast.info("Product changes submitted for admin review.");
    },
    [vendors, products, persistProducts]
  );

  const approveProduct = useCallback(
    (id: string, adminEdits?: Partial<VendorProduct>) => {
      const updated = products.map((p) => {
        if (p.id !== id) return p;
        // If there was a pending revision, merge it into live
        let nextData = { ...p, ...adminEdits };
        if (p.pendingRevision) {
          nextData = {
            ...nextData,
            ...p.pendingRevision,
            pendingRevision: undefined,
          };
        }
        return {
          ...nextData,
          status: "live" as const,
          rejectionReason: undefined,
          changesRequestedComments: undefined,
          updatedAt: Date.now(),
        };
      });
      persistProducts(updated);
      toast.success("Product approved and is now LIVE!");
    },
    [products, persistProducts]
  );

  const requestProductChanges = useCallback(
    (id: string, comments: Record<string, string>) => {
      const updated = products.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: "changes_requested" as const,
          changesRequestedComments: comments,
          updatedAt: Date.now(),
        };
      });
      persistProducts(updated);
      toast.info("Requested changes on product");
    },
    [products, persistProducts]
  );

  const rejectProduct = useCallback(
    (id: string, reason: string) => {
      const updated = products.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: "rejected" as const,
          rejectionReason: reason,
          updatedAt: Date.now(),
        };
      });
      persistProducts(updated);
      toast.error("Product rejected from catalog");
    },
    [products, persistProducts]
  );

  const deleteProduct = useCallback(
    (id: string, options?: { isStaffAction?: boolean }) => {
      const targetProduct = products.find((p) => p.id === id);
      if (targetProduct && !options?.isStaffAction) {
        const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
        if (vendor && vendor.status !== "approved") {
          toast.error("Action blocked: Vendor must be KYC approved by admin before deleting products.");
          return;
        }
      }
      const updated = products.filter((p) => p.id !== id);
      persistProducts(updated);
      toast.info("Product removed");
    },
    [vendors, products, persistProducts]
  );

  const addNotification = useCallback(
    (notif: Omit<VendorNotification, "id" | "time" | "read">) => {
      const item: VendorNotification = {
        ...notif,
        id: `notif_${Date.now()}`,
        time: "Just now",
        read: false,
      };
      persistNotifications([item, ...notifications]);
    },
    [notifications, persistNotifications]
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      persistNotifications(updated);
    },
    [notifications, persistNotifications]
  );

  const createTicket = useCallback(
    (vendorId: string, subject: string, category: VendorSupportTicket["category"], message: string) => {
      const newTicket: VendorSupportTicket = {
        id: `tkt_v_${Date.now()}`,
        vendorId,
        subject,
        category,
        status: "open",
        createdAt: Date.now(),
        replies: [
          {
            sender: "vendor",
            senderName: "Store Owner",
            text: message,
            time: Date.now(),
          },
        ],
      };
      persistTickets([newTicket, ...tickets]);
      toast.success("Support ticket created!");
    },
    [tickets, persistTickets]
  );

  const replyTicket = useCallback(
    (ticketId: string, text: string, sender: "vendor" | "admin", senderName: string) => {
      const updated = tickets.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          replies: [...t.replies, { sender, senderName, text, time: Date.now() }],
        };
      });
      persistTickets(updated);
      toast.success("Reply submitted");
    },
    [tickets, persistTickets]
  );

  const value = useMemo<VendorStoreContextType>(
    () => ({
      vendors,
      products,
      notifications,
      tickets,
      getVendor,
      getVendorByPhone,
      getVendorByEmail,
      saveVendorDraft,
      updateVendor,
      updateVendorOnboarding,
      updateOnboardingStep,
      submitOnboarding,
      approveVendor,
      requestVendorChanges,
      rejectVendor,
      suspendVendor,
      reinstateVendor,
      addProduct,
      updateProduct,
      submitProductRevision,
      requestProductRevision: submitProductRevision,
      approveProduct,
      requestProductChanges,
      rejectProduct,
      deleteProduct,
      toggleHolidayMode,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      settlements: [],
      requestBankUpdate: () => {},
      createTicket,
      replyTicket,
    }),
    [
      vendors,
      products,
      notifications,
      tickets,
      getVendor,
      getVendorByPhone,
      getVendorByEmail,
      saveVendorDraft,
      updateVendor,
      updateVendorOnboarding,
      updateOnboardingStep,
      submitOnboarding,
      approveVendor,
      requestVendorChanges,
      rejectVendor,
      suspendVendor,
      reinstateVendor,
      addProduct,
      updateProduct,
      submitProductRevision,
      approveProduct,
      requestProductChanges,
      rejectProduct,
      deleteProduct,
      toggleHolidayMode,
      addNotification,
      markNotificationRead,
      createTicket,
      replyTicket,
    ]
  );

  return <VendorStoreContext.Provider value={value}>{children}</VendorStoreContext.Provider>;
}

export function useVendorStore() {
  const context = useContext(VendorStoreContext);
  if (!context) {
    throw new Error("useVendorStore must be used within VendorStoreProvider");
  }
  return context;
}
