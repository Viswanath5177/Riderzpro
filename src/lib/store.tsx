import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CUSTOMER_LOCATION,
  DEFAULT_LOCATION,
  type LocationArea,
  GST_RATE,
  DELIVERY_FLAT_FEE,
  deliveryFee,
  distanceKm,
  etaMinutes,
  getProduct,
  getVendor,
  products,
  riders,
} from "./data";
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
import {
  fetchDeliveries,
  createDelivery as apiCreateDelivery,
  updateDeliveryStatus as apiUpdateDeliveryStatus,
  type BackendDelivery,
} from "./api";

export function backendDeliveryToOrder(del: BackendDelivery): Order {
  let numStatus = 0;
  let fulfillmentStatus: Order["fulfillmentStatus"] = "Awaiting Fulfillment";
  switch (del.status) {
    case "pending":
      numStatus = 0;
      fulfillmentStatus = "Awaiting Fulfillment";
      break;
    case "assigned":
      numStatus = 2;
      fulfillmentStatus = "Packed";
      break;
    case "picked_up":
      numStatus = 3;
      fulfillmentStatus = "Dispatched";
      break;
    case "in_transit":
      numStatus = 4;
      fulfillmentStatus = "Dispatched";
      break;
    case "delivered":
      numStatus = 5;
      fulfillmentStatus = "Delivered";
      break;
    case "cancelled":
      numStatus = 0;
      fulfillmentStatus = "Cancelled";
      break;
    default:
      numStatus = 1;
      fulfillmentStatus = "Preparing";
  }

  const createdAt = del.created_at ? new Date(del.created_at).getTime() : Date.now();
  const km = del.latest_route?.distance_km || 18.4;
  const eta = Math.round(del.latest_route?.duration_minutes || 25);

  return {
    id: del.order_id || del.id,
    createdAt,
    groups: [
      {
        vendorId: del.vendor_id || "v1",
        items: [{ productId: "p7", qty: 1, price: 14500 }],
        subtotal: 14500,
        km,
        fee: 86,
        eta,
      },
    ],
    itemsTotal: 14500,
    deliveryTotal: 86,
    tax: 2610,
    total: 17196,
    eta,
    payment: "UPI · Paid Online",
    paymentStatus: del.status === "cancelled" ? "Refunded" : "Paid",
    status: numStatus,
    fulfillmentStatus,
    riderId: del.assigned_rider_id || del.assigned_rider?.id || riders[0]?.id,
    customerName: del.customer_name || "Aakash Sharma",
    customerPhone: del.customer_phone || "+91 98765 43210",
    shipmentId: del.id,
    shippingAddress: {
      name: del.customer_name || "Aakash Sharma",
      phone: del.customer_phone || "+91 98765 43210",
      street: del.dropoff_address || "Amaravati Capital Complex",
      city: "Amaravati",
      state: "Andhra Pradesh",
      pincode: "522237",
    },
  };
}

export function backendDeliveryToShipment(del: BackendDelivery): NormalizedShipment {
  let shipStatus: ShipmentStatus = "Manifested";
  switch (del.status) {
    case "pending":
    case "assigned":
      shipStatus = "Manifested";
      break;
    case "picked_up":
    case "in_transit":
      shipStatus = "In Transit";
      break;
    case "delivered":
      shipStatus = "Delivered";
      break;
    case "cancelled":
      shipStatus = "Cancelled";
      break;
    case "failed":
      shipStatus = "Delayed";
      break;
    default:
      shipStatus = "In Transit";
  }

  const events: ShipmentEvent[] = (del.status_history || []).map((sh, idx) => ({
    id: sh.id || `evt-${idx}`,
    timestamp: sh.created_at ? new Date(sh.created_at).toLocaleTimeString("en-IN") : "Recent",
    status: (sh.to_status === "delivered" ? "Delivered" : sh.to_status === "in_transit" ? "In Transit" : "Manifested") as ShipmentStatus,
    location: del.pickup_address,
    description: sh.reason || `Status updated to ${sh.to_status}`,
    isGps: true,
  }));

  if (events.length === 0) {
    events.push({
      id: "evt-initial",
      timestamp: "Just now",
      status: shipStatus,
      location: del.pickup_address,
      description: `Delivery assigned to ${del.assigned_rider?.name || "Sathesh Ittraju"}`,
      isGps: true,
    });
  }

  return {
    shipmentId: del.id,
    orderId: del.order_id || del.id,
    provider: "RiderzPro Fleet",
    providerReference: del.id.toUpperCase(),
    trackingNumber: del.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 14),
    trackingUrl: `/track/${del.id}`,
    pickupAddress: {
      name: del.vendor_name || "Vijayawada Central Hub",
      street: del.pickup_address,
      city: "Vijayawada",
      state: "Andhra Pradesh",
      pincode: "520001",
      phone: "+91 866 245 1100",
    },
    destinationAddress: {
      name: del.customer_name || "Aakash Sharma",
      street: del.dropoff_address,
      city: "Amaravati",
      state: "Andhra Pradesh",
      pincode: "522237",
      phone: del.customer_phone || "+91 98765 43210",
    },
    status: shipStatus,
    locationType: "Live GPS Telemetry",
    latestLocation: del.assigned_rider
      ? `${del.assigned_rider.name} en route (${del.dropoff_address})`
      : del.pickup_address,
    lastEventTimestamp: "Live GPS Active",
    estimatedDelivery: del.latest_route
      ? `Arriving in ~${Math.round(del.latest_route.duration_minutes)} mins`
      : "In Transit",
    currentGps: del.assigned_rider?.current_lat
      ? {
          lat: del.assigned_rider.current_lat,
          lng: del.assigned_rider.current_lng || 80.6480,
          speedKmph: 32,
          heading: 285,
        }
      : undefined,
    events,
  };
}

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

export const ORDER_STEPS = [
  "Placed",
  "Vendor accepted",
  "Rider assigned",
  "Picked up",
  "On the way",
  "Delivered",
] as const;

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
};

export type VendorGroup = {
  vendorId: string;
  items: { productId: string; qty: number; price: number }[];
  subtotal: number;
  km: number;
  fee: number;
  eta: number;
};

export type TaxBreakdown = {
  rate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  isInterstate: boolean;
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
  taxBreakdown?: TaxBreakdown;
  gstin?: string;
  businessName?: string;
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
      g = {
        vendorId: c.vendorId,
        items: [],
        subtotal: 0,
        km,
        fee: deliveryFee(km),
        eta: etaMinutes(km, v.prepMins),
      };
      map.set(c.vendorId, g);
    }
    g.items.push({ productId: c.productId, qty: c.qty, price: offer.price });
    g.subtotal += offer.price * c.qty;
  }
  const groups = [...map.values()];
  const itemsTotal = groups.reduce((s, g) => s + g.subtotal, 0);
  const deliveryTotal = cart.length > 0 ? DELIVERY_FLAT_FEE : 0;
  const discountedSubtotal = Math.max(0, itemsTotal - discount);
  const taxableBase = discountedSubtotal + deliveryTotal;
  const tax = Math.round(taxableBase * GST_RATE);
  const cgst = Math.round(tax / 2);
  const sgst = tax - cgst;
  const taxBreakdown: TaxBreakdown = {
    rate: GST_RATE,
    taxableAmount: taxableBase,
    cgst,
    sgst,
    igst: tax,
    isInterstate: false,
  };
  const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
  return {
    groups,
    itemsTotal,
    deliveryTotal,
    tax,
    taxBreakdown,
    discountTotal: discount,
    total: taxableBase + tax,
    eta,
  };
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
    gstin?: string;
    businessName?: string;
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
  toggleSaved: (id: string) => void;
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
  name: "Rider",
  phone: "",
  email: "",
  city: "Bengaluru, KA",
  address: "",
  points: 0,
};

const DEFAULT_ADDRESS: AddressRef = {
  name: "Rider",
  street: "",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  phone: "",
};

export const DEFAULT_GARAGE: GarageBike[] = [];
const DEFAULT_BOOKINGS: ServiceBooking[] = [];
const DEFAULT_NOTIFICATIONS: CustomerNotification[] = [];
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
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [role, setRole] = useState<Role>("customer");
  // Hydrates auth state and purges legacy mock user profiles
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("riderzpro_auth");
      const user = localStorage.getItem(KEY);
      if (user && (user.includes("RZ-849201") || user.includes("P6R1S1PR2PN000001"))) {
        localStorage.removeItem(KEY);
      }
      return auth === "true";
    }
    return false;
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationArea>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        // Clean out any legacy mock data if present
        const hasLegacyMock =
          (s.orders && s.orders.some((o: Order) => o.id === "RZ-849201" || o.id === "RZ-793420")) ||
          (s.garage && s.garage.some((g: GarageBike) => g.vin === "P6R1S1PR2PN000001" || g.bikeId === "ola-s1pro")) ||
          (s.serviceBookings && s.serviceBookings.some((b: ServiceBooking) => b.id === "SB-1042"));

        if (!hasLegacyMock) {
          if (Array.isArray(s.cart)) setCart(s.cart);
          if (Array.isArray(s.garage)) setGarage(s.garage);
          if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
          if (Array.isArray(s.orders)) setOrders(s.orders);
          if (Array.isArray(s.shipments)) setShipments(s.shipments);
          if (s.inventoryStock) setInventoryStock(s.inventoryStock);
          if (Array.isArray(s.savedProductIds)) setSavedProductIds(s.savedProductIds);
          if (Array.isArray(s.serviceBookings)) setServiceBookings(s.serviceBookings);
          if (Array.isArray(s.notifications)) setNotifications(s.notifications);
          if (s.userProfile) {
            const isMock = s.userProfile.email === "aakash.sharma@example.com";
            if (!isMock) {
              setUserProfile({
                ...DEFAULT_PROFILE,
                ...s.userProfile,
                addresses: Array.isArray(s.userProfile.addresses) ? s.userProfile.addresses : [],
                selectedAddressId: s.userProfile.selectedAddressId || "",
              });
            } else {
              setUserProfile(DEFAULT_PROFILE);
            }
          }
          if (s.role) setRole(s.role);
          if (s.userLocation && s.userLocation.name) setUserLocation(s.userLocation);
        } else {
          // Reset legacy mock state
          localStorage.removeItem(KEY);
          setUserProfile(DEFAULT_PROFILE);
          setOrders([]);
          setShipments([]);
          setGarage([]);
          setActiveBikeId(null);
          setServiceBookings([]);
          setNotifications([]);
          setSavedProductIds([]);
        }
      }

      // Hydrate user profile from active auth session
      const authRaw = localStorage.getItem("riderzpro_auth_user");
      if (authRaw) {
        try {
          const authUser = JSON.parse(authRaw);
          if (authUser?.name) {
            setUserProfile((prev) => ({
              ...prev,
              name: authUser.name,
              email: authUser.email || prev.email,
              phone: authUser.phone || prev.phone,
            }));
            setIsLoggedIn(true);
          }
        } catch {}
      }

      const t = localStorage.getItem("riderzpro-theme");
      if (t === "light" || t === "dark") setTheme(t);
      else setTheme("light");
    } catch (_err) {}
    setLoaded(true);
  }, []);

  // Sync deliveries from real backend
  useEffect(() => {
    async function syncBackendDeliveries() {
      try {
        const rawAuth = typeof window !== "undefined" ? localStorage.getItem("riderzpro_auth_user") : null;
        let customerIdentifier = "9876543210";
        if (rawAuth) {
          try {
            const parsed = JSON.parse(rawAuth);
            if (parsed.phone) customerIdentifier = parsed.phone;
            else if (parsed.id) customerIdentifier = parsed.id;
          } catch {}
        } else if (userProfile?.phone) {
          customerIdentifier = userProfile.phone;
        }

        const res = await fetchDeliveries({ customer_id: customerIdentifier });
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          const backendOrders = res.items.map(backendDeliveryToOrder);
          const backendShipments = res.items.map(backendDeliveryToShipment);

          setOrders((prev) => {
            const backendOrderIds = new Set(backendOrders.map((o) => o.id));
            const backendShipmentIds = new Set(backendOrders.map((o) => o.shipmentId).filter(Boolean));
            const remainingLocal = prev.filter(
              (o) => !backendOrderIds.has(o.id) && !backendShipmentIds.has(o.shipmentId || "")
            );
            return [...backendOrders, ...remainingLocal];
          });

          setShipments((prev) => {
            const backendShipIds = new Set(backendShipments.map((s) => s.shipmentId));
            const remainingLocal = prev.filter((s) => !backendShipIds.has(s.shipmentId));
            return [...backendShipments, ...remainingLocal];
          });
        }
      } catch (err) {
        console.warn("Could not sync deliveries from backend:", err);
      }
    }

    if (loaded) {
      syncBackendDeliveries();
    }
  }, [loaded, userProfile?.phone, isLoggedIn]);

  useEffect(() => {
    if (!loaded) return;
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

  // simulate live order progress
  useEffect(() => {
    const t = setInterval(() => {
      setOrders((os) =>
        os.map((o) => {
          if (o.status >= ORDER_STEPS.length - 1) return o;
          if (Date.now() - o.createdAt < (o.status + 1) * 12000) return o;
          const status = o.status + 1;
          return { ...o, status, riderId: status >= 2 ? (o.riderId ?? riders[0].id) : undefined };
        }),
      );
    }, 3000);
    return () => clearInterval(t);
  }, []);

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
      gstin?: string;
      businessName?: string;
    }) => {
      const discount = options.discount || 0;
      const q = quoteCart(cart, discount);
      const newOrderId = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const isInterstate = options.shippingAddress?.state
        ? !options.shippingAddress.state.toLowerCase().includes("karnataka")
        : false;

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
        gstin: options.gstin,
        businessName: options.businessName,
        ...q,
        taxBreakdown: q.taxBreakdown
          ? {
              ...q.taxBreakdown,
              isInterstate,
            }
          : undefined,
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

      // Asynchronously persist delivery task in real logistics backend
      const backendPayload = {
        order_id: newOrderId,
        customer_id: userProfile?.phone || "cust_demo",
        customer_name: options.shippingAddress.name || userProfile?.name || "Customer",
        customer_phone: options.shippingAddress.phone || userProfile?.phone || "+91 98765 43210",
        vendor_id: "vnd_nexgen_ev",
        vendor_name: "NexGen EV Logistics",
        pickup_address: "Vijayawada Central Hub (16.5062, 80.6480)",
        pickup_lat: 16.5062,
        pickup_lng: 80.6480,
        dropoff_address: `${options.shippingAddress.street || "Amaravati"}, ${options.shippingAddress.city || "Amaravati"}`,
        dropoff_lat: 16.5740,
        dropoff_lng: 80.3575,
        package_weight_kg: 4.5,
        priority: "normal",
      };

      apiCreateDelivery(backendPayload)
        .then((createdDelivery) => {
          if (createdDelivery?.id) {
            setOrders((prev) =>
              prev.map((o) => (o.id === newOrderId ? { ...o, shipmentId: createdDelivery.id } : o))
            );
            setShipments((prev) =>
              prev.map((s) => (s.orderId === newOrderId ? { ...s, shipmentId: createdDelivery.id } : s))
            );
          }
        })
        .catch((err) => {
          console.warn("Async backend delivery creation failed:", err);
        });

      return order;
    },
    [cart, updateInventoryStock, userProfile]
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
        if (o.id !== id && o.shipmentId !== id) return o;
        let fulfillmentStatus = o.fulfillmentStatus;
        if (status === 1) fulfillmentStatus = "Preparing";
        else if (status === 2) fulfillmentStatus = "Packed";
        else if (status >= 3 && status < 5) fulfillmentStatus = "Dispatched";
        else if (status === 5) fulfillmentStatus = "Delivered";

        const targetDeliveryId = o.shipmentId || o.id;
        if (status === 5 && targetDeliveryId) {
          apiUpdateDeliveryStatus(targetDeliveryId, "delivered").catch(() => {});
        }

        return {
          ...o,
          status,
          fulfillmentStatus,
          riderId: status >= 2 ? o.riderId || riders[0].id : undefined,
        };
      })
    );

    if (status === 5) {
      setShipments((prev) =>
        prev.map((s) =>
          s.shipmentId === id || s.orderId === id ? { ...s, status: "Delivered" as ShipmentStatus } : s
        )
      );
    }
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

  const toggleSaved = useCallback((id: string) => {
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

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
  }, []);

  const simulateDemoOrder = useCallback(() => {
    const demoOrder: Order = {
      id: "delivery_vijayawada_amaravati_live",
      createdAt: Date.now() - 25 * 60 * 1000,
      groups: [
        {
          vendorId: "v1",
          items: [{ productId: "p7", qty: 1, price: 14500 }],
          subtotal: 14500,
          km: 18.4,
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
      status: 4,
      fulfillmentStatus: "Dispatched",
      riderId: riders[0]?.id || "r1",
      customerName: userProfile?.name?.trim() || "Aakash Sharma",
      customerPhone: userProfile?.phone?.trim() || "+91 98765 43210",
      shippingAddress: {
        name: "Aakash Sharma",
        phone: "+91 98765 43210",
        street: "Amaravati Secretariat / City Center",
        city: "Amaravati",
        state: "Andhra Pradesh",
        pincode: "522237",
      },
      shipmentId: "delivery_vijayawada_amaravati_live",
    };

    const demoShipment: NormalizedShipment = {
      shipmentId: "delivery_vijayawada_amaravati_live",
      orderId: "delivery_vijayawada_amaravati_live",
      provider: "RiderzPro Fleet",
      providerReference: "VIJ-AMA-LIVE",
      trackingNumber: "RZPVJA849201",
      trackingUrl: `/track/delivery_vijayawada_amaravati_live`,
      pickupAddress: {
        name: "Vijayawada Central Hub",
        street: "MG Road, Vijayawada Central Hub",
        city: "Vijayawada",
        pincode: "520001",
        phone: "+91 866 245 1100",
      },
      destinationAddress: {
        name: "Aakash Sharma",
        street: "Amaravati Secretariat / City Center",
        city: "Amaravati",
        pincode: "522237",
        phone: "+91 98765 43210",
      },
      status: "In Transit",
      locationType: "Live GPS Telemetry",
      latestLocation: "Sathesh Ittraju en route (Seed Access Road)",
      lastEventTimestamp: "Live GPS Active",
      estimatedDelivery: "Arriving in 24 mins",
      currentGps: { lat: 16.5182, lng: 80.6050, speedKmph: 32.5, heading: 285 },
      events: [
        {
          id: "evt-vja-1",
          timestamp: "20m ago",
          status: "Manifested",
          location: "Vijayawada Central Hub",
          description: "Rider Sathesh Ittraju accepted order and collected package",
          isGps: true,
          coordinates: { lat: 16.5062, lng: 80.6480 },
        },
        {
          id: "evt-vja-2",
          timestamp: "Live",
          status: "In Transit",
          location: "Krishna River Crossing / Prakasam Barrage",
          description: "Live GPS broadcast: En route to Amaravati Secretariat",
          isGps: true,
          coordinates: { lat: 16.5182, lng: 80.6050 },
        },
      ],
    };

    setOrders((prev) => [demoOrder, ...prev.filter((o) => o.id !== demoOrder.id && o.shipmentId !== demoOrder.shipmentId)]);
    setShipments((prev) => [demoShipment, ...prev.filter((s) => s.shipmentId !== demoShipment.shipmentId)]);

    // Trigger async fetch from backend to refresh live data
    fetchDeliveries({ customer_id: "9876543210" })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          const liveDel = res.items.find((d) => d.id === "delivery_vijayawada_amaravati_live") || res.items[0];
          const ord = backendDeliveryToOrder(liveDel);
          const shp = backendDeliveryToShipment(liveDel);
          setOrders((p) => [ord, ...p.filter((o) => o.id !== ord.id && o.shipmentId !== ord.shipmentId)]);
          setShipments((p) => [shp, ...p.filter((s) => s.shipmentId !== shp.shipmentId)]);
        }
      })
      .catch(() => {});

    return demoOrder;
  }, [userProfile]);

  const signIn = useCallback(() => setIsLoggedIn(true), []);
  const signOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("riderzpro_auth_user");
    localStorage.removeItem("riderzpro_auth_token");
  }, []);
  const deleteOrder = useCallback((id: string) => setOrders((os) => os.filter((o) => o.id !== id)), []);
  const clearOrders = useCallback(() => setOrders([]), []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      cart,
      addToCart,
      setQty,
      clearCart: () => setCart([]),
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
        setOrders((os) => {
          const target = os.find((o) => o.id === id);
          if (!target || target.status >= ORDER_STEPS.length - 1) return os;
          const nextStatusNum = target.status + 1;
          const statusMap = ["pending", "assigned", "assigned", "picked_up", "in_transit", "delivered"];
          const backendStatus = statusMap[nextStatusNum] || "in_transit";
          const deliveryId = target.shipmentId || target.id;

          apiUpdateDeliveryStatus(deliveryId, backendStatus).catch((err) =>
            console.warn("Could not sync advanceOrder to backend:", err)
          );

          setShipments((prev) =>
            prev.map((s) =>
              s.shipmentId === deliveryId || s.orderId === target.id
                ? {
                    ...s,
                    status: (nextStatusNum === 5
                      ? "Delivered"
                      : nextStatusNum >= 3
                      ? "In Transit"
                      : "Manifested") as ShipmentStatus,
                  }
                : s
            )
          );

          return os.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status: nextStatusNum,
                  fulfillmentStatus:
                    nextStatusNum === 5
                      ? "Delivered"
                      : nextStatusNum >= 3
                      ? "Dispatched"
                      : nextStatusNum === 2
                      ? "Packed"
                      : "Preparing",
                  riderId: nextStatusNum >= 2 ? o.riderId || riders[0].id : undefined,
                }
              : o
          );
        }),
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
