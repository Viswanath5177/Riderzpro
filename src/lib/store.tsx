import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CUSTOMER_LOCATION,
  DEFAULT_LOCATION,
  type LocationArea,
  GST_RATE,
  deliveryFee,
  distanceKm,
  etaMinutes,
  getProduct,
  getVendor,
  products,
  riders,
} from "./data";
import { reverseGeocodeCoords } from "./location";
import type {
  AddressRef,
  CreateShipmentParams,
  NormalizedShipment,
  ShipmentEvent,
  ShipmentStatus,
} from "./logistics/types";
import {
  createNormalizedShipment,
  processCourierWebhookEvent,
  type WebhookResult,
} from "./logistics/adapters";

export type CartItem = { productId: string; vendorId: string; qty: number };
export type GarageBike = {
  bikeId: string;
  year?: number;
  vin?: string;
  nickname?: string;
  regNo?: string;
  odoKm?: number;
  batteryHealth?: number;
  nextServiceDays?: number;
};
export type Role = "customer" | "seller" | "admin";

export const ORDER_STEPS = ["Placed", "Vendor accepted", "Rider assigned", "Picked up", "On the way", "Delivered"] as const;

export type ServiceBooking = {
  id: string;
  bikeId: string;
  serviceType: string;
  slot: string;
  location: string;
  status: "Confirmed" | "In progress" | "Completed" | "Cancelled";
  technician: string;
  cost: number;
  createdAt: number;
};

export type CustomerNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "service" | "offer" | "system";
  actionUrl?: string;
};

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  points: number;
  role?: Role | string;
};

export type VendorGroup = {
  vendorId: string;
  items: { productId: string; qty: number; price: number }[];
  subtotal: number;
  km: number;
  fee: number;
  eta: number;
};

export type Order = {
  id: string;
  createdAt: number;
  groups: VendorGroup[];
  itemsTotal: number;
  deliveryTotal: number;
  discountTotal?: number;
  couponCode?: string;
  tax: number;
  total: number;
  eta: number;
  payment: string;
  paymentStatus?: "Paid" | "Pending" | "Refunded";
  status: number;
  fulfillmentStatus?: "Awaiting Fulfillment" | "Preparing" | "Packed" | "Dispatched" | "Delivered" | "Cancelled";
  riderId?: string;
  shippingAddress?: AddressRef;
  customerName?: string;
  customerPhone?: string;
  shipmentId?: string;
  cancelReason?: string;
  refundReason?: string;
};

export function quoteCart(cart: CartItem[], discount = 0, loc: { lat: number; lng: number } = CUSTOMER_LOCATION) {
  const map = new Map<string, VendorGroup>();
  for (const c of cart) {
    const p = getProduct(c.productId);
    if (!p) continue;
    const offer = p.offers.find((o) => o.vendorId === c.vendorId) ?? p.offers[0];
    let g = map.get(c.vendorId);
    if (!g) {
      const v = getVendor(c.vendorId);
      const km = Math.round(distanceKm(v, loc) * 10) / 10;
      g = { vendorId: c.vendorId, items: [], subtotal: 0, km, fee: deliveryFee(km), eta: etaMinutes(km, v.prepMins) };
      map.set(c.vendorId, g);
    }
    g.items.push({ productId: c.productId, qty: c.qty, price: offer.price });
    g.subtotal += offer.price * c.qty;
  }
  const groups = [...map.values()];
  const itemsTotal = groups.reduce((s, g) => s + g.subtotal, 0);
  if (itemsTotal === 0) {
    return { groups: [], itemsTotal: 0, deliveryTotal: 0, tax: 0, discountTotal: 0, total: 0, eta: 0 };
  }
  const deliveryTotal = groups.reduce((s, g) => s + g.fee, 0);
  const validDiscount = Math.min(Math.max(0, discount), itemsTotal);
  const discountedSubtotal = Math.max(0, itemsTotal - validDiscount);
  const tax = Math.round(discountedSubtotal * GST_RATE);
  const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
  return { groups, itemsTotal, deliveryTotal, tax, discountTotal: validDiscount, total: discountedSubtotal + deliveryTotal + tax, eta };
}

type Ctx = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (productId: string, vendorId: string, qty?: number) => void;
  setQty: (productId: string, vendorId: string, qty: number) => void;
  clearCart: () => void;
  garage: GarageBike[];
  addBike: (b: GarageBike) => void;
  removeBike: (bikeId: string) => void;
  activeBikeId: string | null;
  setActiveBikeId: (id: string | null) => void;
  orders: Order[];
  placeOrder: (payment: string) => Order;
  placeOrderWithOptions: (options: {
    payment: string;
    shippingAddress: AddressRef;
    couponCode?: string;
    discount?: number;
  }) => Order;
  advanceOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: number) => void;
  cancelOrder: (id: string, reason: string) => void;
  refundOrder: (id: string, reason: string) => void;
  simulateDemoOrder: () => Order;
  // Logistics & Shipments
  shipments: NormalizedShipment[];
  createShipment: (params: CreateShipmentParams) => NormalizedShipment;
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, newEvent?: ShipmentEvent) => void;
  processWebhook: (payload: any) => WebhookResult;
  // Inventory
  inventoryStock: Record<string, number>;
  updateInventoryStock: (productId: string, delta: number) => void;
  savedProductIds: string[];
  wishlistItems: any[];
  isLoadingWishlist: boolean;
  wishlistError: string | null;
  fetchWishlist: () => Promise<void>;
  toggleSaved: (id: string, productData?: any) => Promise<boolean>;
  isSaved: (id: string) => boolean;
  serviceBookings: ServiceBooking[];
  bookService: (b: Omit<ServiceBooking, "id" | "createdAt">) => ServiceBooking;
  cancelServiceBooking: (id: string) => void;
  notifications: CustomerNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  userProfile: UserProfile;
  updateUserProfile: (p: Partial<UserProfile>) => void;
  role: Role;
  setRole: (r: Role) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  deleteOrder: (id: string) => void;
  clearOrders: () => void;
  userLocation: LocationArea;
  setUserLocation: (loc: LocationArea) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "riderzpro-v7";

const DEFAULT_PROFILE: UserProfile = {
  name: "User",
  phone: "",
  email: "",
  city: "",
  address: "",
  points: 0,
};

const DEFAULT_ADDRESS: AddressRef = {
  name: "User",
  street: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export const DEFAULT_GARAGE: GarageBike[] = [];
export const DEFAULT_NOTIFICATIONS: CustomerNotification[] = [];
export const DEFAULT_ORDERS: Order[] = [];
export const DEFAULT_SHIPMENTS: NormalizedShipment[] = [];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [garage, setGarage] = useState<GarageBike[]>([]);
  const [activeBikeId, setActiveBikeId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<NormalizedShipment[]>([]);
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>({});
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(DEFAULT_NOTIFICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [role, setRole] = useState<Role>("customer");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationArea>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      let storedUserEmail = "";
      let storedIsLoggedIn = false;
      if (raw) {
        const s = JSON.parse(raw);
        storedUserEmail = s?.userProfile?.email || "";
        storedIsLoggedIn = Boolean(s?.isLoggedIn);
        if (s.cart && Array.isArray(s.cart)) {
          const valid = s.cart
            .filter((i: any) => Boolean(getProduct(i.productId)))
            .map((i: any) => ({
              productId: i.productId,
              vendorId: i.vendorId || "v_01",
              qty: Math.max(1, Number(i.qty) || 1),
            }));
          setCart(valid);
        }
        if (s.garage && s.garage.length > 0) setGarage(s.garage);
        if ("activeBikeId" in s && s.activeBikeId) setActiveBikeId(s.activeBikeId);
        if (s.shipments && s.shipments.length > 0) {
          const sanitized = s.shipments.map((sh: any) => ({
            ...DEFAULT_SHIPMENTS[0],
            ...sh,
            pickupAddress: sh.pickupAddress?.name ? sh.pickupAddress : DEFAULT_SHIPMENTS[0].pickupAddress,
            destinationAddress: sh.destinationAddress?.name ? sh.destinationAddress : DEFAULT_SHIPMENTS[0].destinationAddress,
            events: Array.isArray(sh.events) ? sh.events : DEFAULT_SHIPMENTS[0].events,
          }));
          setShipments(sanitized);
        }
        if (s.inventoryStock) setInventoryStock(s.inventoryStock);
        if (s.savedProductIds && s.savedProductIds.length > 0) setSavedProductIds(s.savedProductIds);
        if (s.serviceBookings && s.serviceBookings.length > 0) setServiceBookings(s.serviceBookings);
        if (s.notifications && s.notifications.length > 0) {
          // Merge to ensure admin offers are always accessible
          const existingIds = new Set(s.notifications.map((n: any) => n.id));
          const missingOffers = DEFAULT_NOTIFICATIONS.filter((n) => !existingIds.has(n.id));
          setNotifications([...s.notifications, ...missingOffers]);
        } else {
          setNotifications(DEFAULT_NOTIFICATIONS);
        }
        if (s.userProfile) {
          setUserProfile((prev) => ({
            ...prev,
            ...s.userProfile,
            name: s.userProfile.name || "User",
          }));
        }
        if (s.role) setRole(s.role);
        if (s.userLocation && s.userLocation.name) setUserLocation(s.userLocation);
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
      setTheme("light");

      // Synchronize verified user profile directly from database
      fetch("/api/customer/profile", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.profile && d.profile.email) {
            setUserProfile({
              name: d.profile.name || "User",
              phone: d.profile.phone || "",
              email: d.profile.email || "",
              city: d.profile.city || "",
              address: d.profile.address || "",
              points: d.profile.points || 0,
            });
          }
        })
        .catch(() => {});

      // Hydrate cart from database - backend is single source of truth
      fetch("/api/cart", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.items)) {
            const valid = d.items
              .map((it: any) => ({
                productId: it.productId || it.product_id,
                vendorId: it.vendorId || it.vendor_id || "v_01",
                qty: Math.max(1, Number(it.qty || it.quantity) || 1),
              }))
              .filter((it: any) => Boolean(getProduct(it.productId)));
            setCart(valid);
          } else {
            setCart([]);
          }
        })
        .catch(() => {});

      // Hydrate wishlist from database (authoritative source of truth)
      setIsLoadingWishlist(true);
      const emailQuery = storedUserEmail ? `?email=${encodeURIComponent(storedUserEmail)}` : "";
      fetch(`/api/wishlist${emailQuery}`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.items)) {
            if (d.items.length > 0 || storedIsLoggedIn) {
              const ids = Array.from(new Set(d.items.map((it: any) => it.product_id || it.id))) as string[];
              setSavedProductIds(ids);
              setWishlistItems(d.items);
            }
          }
        })
        .catch((err) => {
          setWishlistError(err?.message || "Failed to load wishlist");
        })
        .finally(() => {
          setIsLoadingWishlist(false);
        });

      // Hydrate delivery location: default saved address from DB or device GPS
      fetch("/api/customer/addresses", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data) && d.data.length > 0) {
            const def = d.data.find((a: any) => a.is_default) || d.data[0];
            setUserLocation({
              id: def.id,
              name: `${def.label || "Saved"}: ${def.street_address || def.city}`,
              city: def.city || "Bengaluru",
              pincode: def.pincode || "560001",
              lat: 12.9716,
              lng: 77.5946,
              tag: def.label || "Saved Address",
            });
          } else if (typeof window !== "undefined" && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const { latitude, longitude } = pos.coords;
                let geocoded;
                try {
                  geocoded = await reverseGeocodeCoords(latitude, longitude);
                } catch {
                  geocoded = { name: "Current Location", city: "India" };
                }
                setUserLocation({
                  id: `gps-auto`,
                  name: geocoded.name || geocoded.city || "Current Location",
                  city: geocoded.city || "India",
                  pincode: geocoded.pincode || "",
                  lat: latitude,
                  lng: longitude,
                  tag: "Device GPS",
                });
              },
              () => {},
              { enableHighAccuracy: true, timeout: 8000 }
            );
          }
        })
        .catch(() => {});
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (!isLoggedIn && cart.length === 0 && garage.length === 0 && orders.length === 0) {
      try {
        localStorage.removeItem(KEY);
      } catch {}
      return;
    }
    localStorage.setItem(
      KEY,
      JSON.stringify({
        cart,
        garage,
        activeBikeId,
        orders,
        shipments,
        inventoryStock,
        savedProductIds,
        serviceBookings,
        notifications,
        userProfile,
        role,
        userLocation,
      }),
    );

    // Persist cart to PostgreSQL backend
    try {
      const customerId = userProfile?.email || "usr_customer_demo";
      fetch(`/api/cart?customer_id=${encodeURIComponent(customerId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      }).catch(() => {});
    } catch {}
  }, [cart, garage, activeBikeId, orders, shipments, inventoryStock, savedProductIds, serviceBookings, notifications, userProfile, role, userLocation, loaded]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, [theme, loaded]);

  const addToCart = useCallback((productId: string, vendorId: string, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.productId === productId && i.vendorId === vendorId);
      if (ex) return c.map((i) => (i === ex ? { ...i, qty: i.qty + qty } : i));
      return [...c, { productId, vendorId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, vendorId: string, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !(i.productId === productId && i.vendorId === vendorId))
        : c.map((i) => (i.productId === productId && i.vendorId === vendorId ? { ...i, qty } : i)),
    );
  }, []);

  const updateInventoryStock = useCallback((productId: string, delta: number) => {
    setInventoryStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] ?? 10) + delta),
    }));
  }, []);

  const createShipment = useCallback((params: CreateShipmentParams) => {
    const newShipment = createNormalizedShipment(params);
    setShipments((prev) => [newShipment, ...prev]);

    // Link shipment to order
    setOrders((prev) =>
      prev.map((o) =>
        o.id === params.orderId
          ? {
              ...o,
              shipmentId: newShipment.shipmentId,
              status: Math.max(o.status, 2),
              fulfillmentStatus: "Dispatched",
            }
          : o
      )
    );

    return newShipment;
  }, []);

  const updateShipmentStatus = useCallback(
    (shipmentId: string, status: ShipmentStatus, newEvent?: ShipmentEvent) => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.shipmentId !== shipmentId) return s;
          const updatedEvents = newEvent ? [newEvent, ...s.events] : s.events;
          const isDelivered = status === "Delivered";
          return {
            ...s,
            status,
            events: updatedEvents,
            latestLocation: newEvent?.location || s.latestLocation,
            lastEventTimestamp: newEvent?.timestamp || "Just now",
            actualDeliveryTimestamp: isDelivered ? new Date().toLocaleTimeString("en-IN") : s.actualDeliveryTimestamp,
            isDelayed: status === "Delayed",
          };
        })
      );

      // Synchronize back to order status
      const targetShipment = shipments.find((s) => s.shipmentId === shipmentId);
      if (targetShipment) {
        let orderNumericStatus = 3;
        let fulfillmentStatus: Order["fulfillmentStatus"] = "Dispatched";
        if (status === "Delivered") {
          orderNumericStatus = 5;
          fulfillmentStatus = "Delivered";
        } else if (status === "Out for Delivery") {
          orderNumericStatus = 4;
          fulfillmentStatus = "Dispatched";
        } else if (status === "In Transit") {
          orderNumericStatus = 3;
          fulfillmentStatus = "Dispatched";
        } else if (status === "Manifested") {
          orderNumericStatus = 2;
          fulfillmentStatus = "Packed";
        }

        setOrders((prev) =>
          prev.map((o) =>
            o.id === targetShipment.orderId
              ? {
                  ...o,
                  status: orderNumericStatus,
                  fulfillmentStatus,
                }
              : o
          )
        );
      }
    },
    [shipments]
  );

  const processWebhook = useCallback(
    (payload: any): WebhookResult => {
      const res = processCourierWebhookEvent(payload);
      if (res.success && !res.isDuplicate && res.updatedStatus) {
        // Find matching shipment by tracking number
        const s = shipments.find((item) => item.trackingNumber === payload.trackingNumber);
        if (s) {
          updateShipmentStatus(s.shipmentId, res.updatedStatus, res.newEvent);
        }
      }
      return res;
    },
    [shipments, updateShipmentStatus]
  );

  const placeOrderWithOptions = useCallback(
    (options: {
      payment: string;
      shippingAddress: AddressRef;
      couponCode?: string;
      discount?: number;
    }) => {
      const discount = options.discount || 0;
      const q = quoteCart(cart, discount);
      if (!q.total || q.total <= 0) {
        throw new Error("Order amount cannot be ₹0. Please add items to your cart.");
      }
      const newOrderId = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;

      const order: Order = {
        id: newOrderId,
        createdAt: Date.now(),
        payment: options.payment,
        paymentStatus: options.payment.includes("COD") ? "Pending" : "Paid",
        status: 0,
        fulfillmentStatus: "Awaiting Fulfillment",
        shippingAddress: options.shippingAddress,
        customerName: options.shippingAddress.name,
        customerPhone: options.shippingAddress.phone,
        couponCode: options.couponCode,
        ...q,
      };

      // Decrement inventory transactional check
      cart.forEach((c) => {
        updateInventoryStock(c.productId, -c.qty);
      });

      // Auto-manifest initial shipment
      const autoShipment = createNormalizedShipment({
        orderId: newOrderId,
        provider: "Delhivery",
        pickupAddress: {
          name: "RiderzPro Central Hub",
          street: "Electronic City Phase 1",
          city: "Bengaluru",
          pincode: "560100",
          phone: "+91 80 4000 1100",
        },
        destinationAddress: options.shippingAddress,
        weightKg: 4.5,
        itemDescription: `${cart.length} EV Parts & Accessories`,
        orderValue: q.total,
      });

      order.shipmentId = autoShipment.shipmentId;

      setOrders((prev) => [order, ...prev]);
      setShipments((prev) => [autoShipment, ...prev]);
      setCart([]);
      return order;
    },
    [cart, updateInventoryStock]
  );

  const placeOrder = useCallback(
    (payment: string) => {
      return placeOrderWithOptions({
        payment,
        shippingAddress: DEFAULT_ADDRESS,
      });
    },
    [placeOrderWithOptions]
  );

  const updateOrderStatus = useCallback((id: string, status: number) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o;
        let fulfillmentStatus = o.fulfillmentStatus;
        if (status === 1) fulfillmentStatus = "Preparing";
        else if (status === 2) fulfillmentStatus = "Packed";
        else if (status >= 3 && status < 5) fulfillmentStatus = "Dispatched";
        else if (status === 5) fulfillmentStatus = "Delivered";

        return {
          ...o,
          status,
          fulfillmentStatus,
          riderId: status >= 2 ? o.riderId || riders[0].id : undefined,
        };
      })
    );
  }, []);

  const cancelOrder = useCallback((id: string, reason: string) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o;
        // Restock inventory
        o.groups.forEach((g) => {
          g.items.forEach((it) => {
            updateInventoryStock(it.productId, it.qty);
          });
        });
        return {
          ...o,
          fulfillmentStatus: "Cancelled",
          cancelReason: reason,
        };
      })
    );
  }, [updateInventoryStock]);

  const refundOrder = useCallback((id: string, reason: string) => {
    setOrders((os) =>
      os.map((o) =>
        o.id === id
          ? {
              ...o,
              paymentStatus: "Refunded",
              refundReason: reason,
            }
          : o
      )
    );
  }, []);

  const fetchWishlist = useCallback(async () => {
    setIsLoadingWishlist(true);
    setWishlistError(null);
    try {
      const emailQuery = userProfile?.email ? `?email=${encodeURIComponent(userProfile.email)}` : "";
      const res = await fetch(`/api/wishlist${emailQuery}`, { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        if (data.items.length > 0 || isLoggedIn) {
          const ids = Array.from(new Set(data.items.map((it: any) => it.product_id || it.id))) as string[];
          setSavedProductIds(ids);
          setWishlistItems(data.items);
        }
      }
    } catch (err: any) {
      console.error("[fetchWishlist Error]:", err);
      setWishlistError(err?.message || "Failed to load wishlist");
    } finally {
      setIsLoadingWishlist(false);
    }
  }, [userProfile?.email, isLoggedIn]);

  const toggleSaved = useCallback(
    async (id: string, productData?: any): Promise<boolean> => {
      const alreadySaved = savedProductIds.includes(id);
      const prevIds = [...savedProductIds];
      const prevItems = [...wishlistItems];

      // Optimistic state update
      if (alreadySaved) {
        setSavedProductIds((prev) => prev.filter((x) => x !== id));
        setWishlistItems((prev) => prev.filter((it) => (it.product_id || it.id) !== id));
      } else {
        setSavedProductIds((prev) => Array.from(new Set([...prev, id])));
        if (productData) {
          setWishlistItems((prev) => [
            {
              id: productData.id || id,
              product_id: id,
              name: productData.name,
              price: productData.price,
              mrp: productData.mrp,
              discount_percent: productData.discountPercent || productData.discount_percent,
              image_url: productData.image || productData.image_url,
              stock: productData.stock ?? 10,
              is_active: true,
              brand: productData.brand,
              category: productData.category,
              description: productData.description,
            },
            ...prev.filter((it) => (it.product_id || it.id) !== id),
          ]);
        }
      }

      try {
        const res = await fetch("/api/wishlist", {
          method: alreadySaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
          product_id: id,
          action: alreadySaved ? "remove" : "add",
          email: userProfile?.email || undefined,
          customer_id: userProfile?.email || undefined,
        }),
        });
        const data = await res.json();
        if (!res.ok || (!data.success && !data.guest)) {
          throw new Error(data.error || "Failed to update wishlist");
        }
        return true;
      } catch (err: any) {
        // Rollback optimistic update
        setSavedProductIds(prevIds);
        setWishlistItems(prevItems);
        toast.error("Wishlist operation failed. State restored.");
        return false;
      }
    },
    [savedProductIds, wishlistItems]
  );

  const isSaved = useCallback((id: string) => savedProductIds.includes(id), [savedProductIds]);

  const bookService = useCallback((b: Omit<ServiceBooking, "id" | "createdAt">) => {
    const booking: ServiceBooking = {
      ...b,
      id: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: Date.now(),
    };
    setServiceBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const cancelServiceBooking = useCallback((id: string) => {
    setServiceBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" as const } : b))
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateUserProfile = useCallback((p: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
    // Synchronize to backend database
    fetch("/api/customer/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(p),
    }).catch(() => {});
  }, []);

  const simulateDemoOrder = useCallback(() => {
    const demoOrder: Order = {
      id: `RZ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: Date.now() - 15 * 60 * 1000,
      groups: [
        {
          vendorId: "v1",
          items: [{ productId: "p7", qty: 1, price: 14500 }],
          subtotal: 14500,
          km: 3.8,
          fee: 86,
          eta: 25,
        },
      ],
      itemsTotal: 14500,
      deliveryTotal: 86,
      tax: 2610,
      total: 17196,
      eta: 25,
      payment: "UPI · Google Pay",
      paymentStatus: "Paid",
      status: 3,
      fulfillmentStatus: "Dispatched",
      riderId: riders[0].id,
      customerName: userProfile.name || "User",
      customerPhone: userProfile.phone || "",
      shippingAddress: DEFAULT_ADDRESS,
      shipmentId: "SHP-DEMO-FLEET",
    };

    const demoShipment: NormalizedShipment = {
      shipmentId: "SHP-DEMO-FLEET",
      orderId: demoOrder.id,
      provider: "RiderzPro Fleet",
      providerReference: "FLEET-FAST-9021",
      trackingNumber: "RZP9021334",
      trackingUrl: `/track/${demoOrder.id}`,
      pickupAddress: {
        name: "VoltHub Indiranagar",
        street: "100ft Road",
        city: "Bengaluru",
        pincode: "560038",
        phone: "+91 80 4123 9901",
      },
      destinationAddress: DEFAULT_ADDRESS,
      status: "In Transit",
      locationType: "Live GPS Telemetry",
      latestLocation: "Indiranagar 100ft Rd -> Koramangala Ring Rd",
      lastEventTimestamp: "2m ago",
      estimatedDelivery: "Arriving in 18 mins",
      currentGps: { lat: 12.9554, lng: 77.625, speedKmph: 32, heading: 140 },
      events: [
        {
          id: "evt-fl-1",
          timestamp: "12m ago",
          status: "Manifested",
          location: "VoltHub Indiranagar",
          description: "Rider Ravi Kumar accepted order and collected package",
          isGps: true,
          coordinates: { lat: 12.9784, lng: 77.6408 },
        },
        {
          id: "evt-fl-2",
          timestamp: "2m ago",
          status: "In Transit",
          location: "Intermediate Ring Road",
          description: "Live GPS broadcast: En route to Bellandur doorstep",
          isGps: true,
          coordinates: { lat: 12.9554, lng: 77.625 },
        },
      ],
    };

    setOrders((prev) => [demoOrder, ...prev]);
    setShipments((prev) => [demoShipment, ...prev]);
    return demoOrder;
  }, []);

  const signIn = useCallback(() => setIsLoggedIn(true), []);
  const signOut = useCallback(() => {
    setIsLoggedIn(false);
    setCart([]);
    setGarage([]);
    setActiveBikeId(null);
    setOrders([]);
    setShipments([]);
    setSavedProductIds([]);
    setWishlistItems([]);
    setServiceBookings([]);
    setNotifications([]);
    setUserProfile(DEFAULT_PROFILE);
    setRole("customer");
    setUserLocation(DEFAULT_LOCATION);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      localStorage.removeItem("riderzpro_token");
      localStorage.removeItem("riderzpro_admin_session");
      localStorage.removeItem("riderzpro_seller_store_confirmed");
      localStorage.removeItem("riderzpro_active_bike");
      try {
        sessionStorage.clear();
      } catch {}
    } catch {}
  }, []);

  useEffect(() => {
    const handleSignOutEvent = () => {
      signOut();
    };
    window.addEventListener("riderzpro:signout", handleSignOutEvent);
    return () => window.removeEventListener("riderzpro:signout", handleSignOutEvent);
  }, [signOut]);
  const deleteOrder = useCallback((id: string) => setOrders((os) => os.filter((o) => o.id !== id)), []);
  const clearOrders = useCallback(() => setOrders([]), []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      cart,
      addToCart,
      setQty,
      clearCart: () => {
        setCart([]);
        fetch("/api/cart", {
          method: "DELETE",
          credentials: "include",
        }).catch(() => {});
      },
      garage,
      addBike: (b) => {
        setGarage((g) => [...g.filter((x) => x.bikeId !== b.bikeId), b]);
        setActiveBikeId(b.bikeId);
      },
      removeBike: (id) => setGarage((g) => g.filter((x) => x.bikeId !== id)),
      activeBikeId,
      setActiveBikeId,
      orders,
      placeOrder,
      placeOrderWithOptions,
      advanceOrder: (id) =>
        setOrders((os) =>
          os.map((o) =>
            o.id === id && o.status < ORDER_STEPS.length - 1
              ? { ...o, status: o.status + 1, riderId: o.status + 1 >= 2 ? riders[0].id : undefined }
              : o,
          ),
        ),
      updateOrderStatus,
      cancelOrder,
      refundOrder,
      simulateDemoOrder,
      deleteOrder,
      clearOrders,
      shipments,
      createShipment,
      updateShipmentStatus,
      processWebhook,
      inventoryStock,
      updateInventoryStock,
      savedProductIds,
      wishlistItems,
      isLoadingWishlist,
      wishlistError,
      fetchWishlist,
      toggleSaved,
      isSaved,
      serviceBookings,
      bookService,
      cancelServiceBooking,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      userProfile,
      updateUserProfile,
      role,
      setRole,
      isCartOpen,
      setIsCartOpen,
      isLoggedIn,
      signIn,
      signOut,
      userLocation,
      setUserLocation,
      isLocationModalOpen,
      setIsLocationModalOpen,
    }),
    [
      theme,
      cart,
      addToCart,
      setQty,
      garage,
      activeBikeId,
      orders,
      placeOrder,
      placeOrderWithOptions,
      updateOrderStatus,
      cancelOrder,
      refundOrder,
      simulateDemoOrder,
      shipments,
      createShipment,
      updateShipmentStatus,
      processWebhook,
      inventoryStock,
      updateInventoryStock,
      savedProductIds,
      wishlistItems,
      isLoadingWishlist,
      wishlistError,
      fetchWishlist,
      toggleSaved,
      isSaved,
      serviceBookings,
      bookService,
      cancelServiceBooking,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      userProfile,
      updateUserProfile,
      role,
      isCartOpen,
      setIsCartOpen,
      deleteOrder,
      clearOrders,
      isLoggedIn,
      signIn,
      signOut,
      userLocation,
      isLocationModalOpen,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
