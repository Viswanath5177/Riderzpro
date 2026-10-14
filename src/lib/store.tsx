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
import { getOrderStatusMetadata } from "./orderStatus";
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

  const customerName = del.customer_name || "Customer";
  const customerPhone = del.customer_phone || "";
  const street = del.dropoff_address || "";

  return {
    id: del.order_id || del.id,
    createdAt,
    groups: [
      {
        vendorId: del.vendor_id || "v1",
        items: [],
        subtotal: 0,
        km,
        fee: 0,
        eta,
      },
    ],
    itemsTotal: 0,
    deliveryTotal: 0,
    tax: 0,
    total: 0,
    eta,
    payment: "UPI · Paid Online",
    paymentStatus: del.status === "cancelled" ? "Refunded" : "Paid",
    status: numStatus,
    fulfillmentStatus,
    riderId: del.assigned_rider_id || del.assigned_rider?.id || riders[0]?.id,
    customerName: del.customer_name || "Customer",
    customerPhone: del.customer_phone || "",
    shipmentId: del.id,
    shippingAddress: {
      name: del.customer_name || "Customer",
      phone: del.customer_phone || "",
      street: del.dropoff_address || "",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
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
      description: `Delivery assigned to ${del.assigned_rider?.name || "Ravi Kumar"}`,
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
      name: del.vendor_name || "Delhi Central Hub",
      street: del.pickup_address,
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "+91 11 4123 9901",
    },
    destinationAddress: {
      name: del.customer_name || "Customer",
      street: del.dropoff_address,
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: del.customer_phone || "+91 98111 22334",
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
          lng: del.assigned_rider.current_lng || 77.2205,
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
  paymentStatus?: "Paid" | "Pending" | "Refunded" | "PAID" | "COD_PENDING";
  status: number;
  fulfillmentStatus?:
    "Awaiting Fulfillment" | "Preparing" | "Packed" | "Dispatched" | "Delivered" | "Cancelled";
  riderId?: string;
  shippingAddress?: AddressRef;
  customerName?: string;
  customerPhone?: string;
  shipmentId?: string;
  cancelReason?: string;
  refundReason?: string;
  source?: "api" | "legacy";
  apiOrderId?: string;
};

export function quoteCart(
  cart: CartItem[],
  discount = 0,
  loc: { lat: number; lng: number } = CUSTOMER_LOCATION,
) {
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
  syncApiOrders: (apiOrders: any[]) => void;
  placeOrder: (payment: string) => Order;
  placeOrderWithOptions: (options: {
    payment: string;
    paymentStatus?: "Paid" | "Pending" | "Refunded" | "PAID" | "COD_PENDING";
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
  updateShipmentStatus: (
    shipmentId: string,
    status: ShipmentStatus,
    newEvent?: ShipmentEvent,
  ) => void;
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
const KEY = "riderzpro-v8";

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
  city: "Delhi",
  state: "Delhi",
  pincode: "110001",
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
      // Purge obsolete mock store versions
      ["riderzpro-v7", "riderzpro-v6", "riderzpro-v5", "riderzpro_mock_orders"].forEach((oldKey) => {
        try { localStorage.removeItem(oldKey); } catch {}
      });
      const auth = localStorage.getItem("riderzpro_auth");
      const user = localStorage.getItem(KEY);
      if (
        user &&
        (user.includes("RZ-849201") ||
          user.includes("P6R1S1PR2PN000001") ||
          user.includes("delivery_noida_delhi") ||
          user.includes("delivery_vijayawada_amaravati_live"))
      ) {
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
      ["riderzpro-v7", "riderzpro-v6", "riderzpro-v5", "riderzpro_orders"].forEach((oldKey) => {
        try { localStorage.removeItem(oldKey); } catch {}
      });
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        // Clean out any legacy mock data if present
        const hasLegacyMock =
          (s.orders &&
            s.orders.some(
              (o: Order) =>
                o.id === "RZ-849201" ||
                o.id === "RZ-793420" ||
                o.id === "delivery_vijayawada_amaravati_live" ||
                o.id?.startsWith?.("delivery_noida_delhi")
            )) ||
          (s.shipments &&
            s.shipments.some(
              (shp: NormalizedShipment) =>
                shp.shipmentId === "delivery_vijayawada_amaravati_live" ||
                shp.orderId === "delivery_vijayawada_amaravati_live" ||
                shp.shipmentId?.startsWith?.("delivery_noida_delhi") ||
                shp.orderId?.startsWith?.("delivery_noida_delhi")
            )) ||
          (s.garage && s.garage.some((g: GarageBike) => g.vin === "P6R1S1PR2PN000001" || g.bikeId === "ola-s1pro")) ||
          (s.serviceBookings && s.serviceBookings.some((b: ServiceBooking) => b.id === "SB-1042"));

        if (!hasLegacyMock) {
          if (Array.isArray(s.cart)) setCart(s.cart);
          if (Array.isArray(s.garage)) setGarage(s.garage);
          if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
          if (Array.isArray(s.orders)) {
            setOrders(
              s.orders.filter(
                (o: Order) =>
                  o.id !== "delivery_vijayawada_amaravati_live" &&
                  !o.id?.startsWith?.("delivery_noida_delhi") &&
                  o.id !== "RZ-849201" &&
                  o.id !== "RZ-793420"
              )
            );
          }
          if (Array.isArray(s.shipments)) {
            setShipments(
              s.shipments.filter(
                (shp: NormalizedShipment) =>
                  shp.shipmentId !== "delivery_vijayawada_amaravati_live" &&
                  shp.orderId !== "delivery_vijayawada_amaravati_live" &&
                  !shp.shipmentId?.startsWith?.("delivery_noida_delhi") &&
                  !shp.orderId?.startsWith?.("delivery_noida_delhi")
              )
            );
          }
          if (s.inventoryStock) setInventoryStock(s.inventoryStock);
          if (Array.isArray(s.savedProductIds)) setSavedProductIds(s.savedProductIds);
          if (Array.isArray(s.serviceBookings)) setServiceBookings(s.serviceBookings);
          if (Array.isArray(s.notifications)) setNotifications(s.notifications);
          if (s.userProfile) {
            const isMock = s.userProfile.email === "aakash.sharma@example.com" || s.userProfile.name === "Aakash Sharma";
            if (!isMock) {
              setUserProfile({
                ...DEFAULT_PROFILE,
                ...s.userProfile,
                addresses: Array.isArray((s.userProfile as any).addresses) ? (s.userProfile as any).addresses : [],
                selectedAddressId: (s.userProfile as any).selectedAddressId || "",
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
        let customerIdentifier = "9811122334";
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
        orders: orders.filter((o) => o.source !== "api"),
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
  }, [
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
    loaded,
  ]);

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
          : o,
      ),
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
            actualDeliveryTimestamp: isDelivered
              ? new Date().toLocaleTimeString("en-IN")
              : s.actualDeliveryTimestamp,
            isDelayed: status === "Delayed",
          };
        }),
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
              : o,
          ),
        );
      }
    },
    [shipments],
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
    [shipments, updateShipmentStatus],
  );

  const syncApiOrders = useCallback((apiOrders: any[]) => {
    setOrders((prev) => {
      const legacyOrders = prev.filter((o) => o.source !== "api");
      const mappedApiOrders: Order[] = (apiOrders || []).map((ao) => {
        const meta = getOrderStatusMetadata(ao.status);
        const stepsIndex = meta.orderStepsIndex;
        const totalRupees = Math.round(ao.totalPaise / 100);
        const itemsTotalRupees = Math.round(ao.subtotalPaise / 100);
        const deliveryTotalRupees = Math.round(ao.deliveryPaise / 100);
        const discountRupees = Math.round((ao.discountPaise || 0) / 100);
        const taxRupees = Math.round(ao.taxPaise / 100);

        // Group items into VendorGroup[]
        const vendorMap = new Map<string, VendorGroup>();
        (ao.items || []).forEach((it: any) => {
          const vId = it.sellerId || "v1";
          let g = vendorMap.get(vId);
          if (!g) {
            g = {
              vendorId: vId,
              items: [],
              subtotal: 0,
              km: 5,
              fee: 49,
              eta: 35,
            };
            vendorMap.set(vId, g);
          }
          const priceRupees = Math.round(it.unitPricePaise / 100);
          g.items.push({
            productId: it.productId,
            qty: it.qty,
            price: priceRupees,
          });
          g.subtotal += priceRupees * it.qty;
        });

        const groups = Array.from(vendorMap.values());

        const paymentMethodStr = ao.payment?.method || "UPI";
        const paymentStatusStr =
          ao.payment?.status === "PAID"
            ? "Paid"
            : ao.payment?.status === "COD_DUE"
            ? "Pending"
            : "Pending";

        return {
          id: ao.orderNumber || ao.id,
          createdAt: ao.createdAt,
          groups,
          itemsTotal: itemsTotalRupees,
          deliveryTotal: deliveryTotalRupees,
          discountTotal: discountRupees,
          couponCode: ao.couponCode,
          tax: taxRupees,
          total: totalRupees,
          eta: 35,
          payment: paymentMethodStr,
          paymentStatus: paymentStatusStr,
          status: stepsIndex,
          fulfillmentStatus: meta.label as any,
          shippingAddress: {
            name: ao.contact?.name || "Customer",
            street: ao.shippingAddress?.street || "",
            city: ao.shippingAddress?.city || "Delhi",
            state: ao.shippingAddress?.state || "Delhi",
            pincode: ao.shippingAddress?.pincode || "110001",
            phone: ao.contact?.phone || "",
          },
          customerName: ao.contact?.name,
          customerPhone: ao.contact?.phone,
          source: "api" as const,
          apiOrderId: ao.id,
        };
      });

      return [...mappedApiOrders, ...legacyOrders];
    });
  }, []);

  /** @deprecated Use createOrder from src/lib/api/orders instead. Kept for legacy mode only. */
  const placeOrderWithOptions = useCallback(
    (options: {
      payment: string;
      paymentStatus?: "Paid" | "Pending" | "Refunded" | "PAID" | "COD_PENDING";
      shippingAddress: AddressRef;
      couponCode?: string;
      discount?: number;
      gstin?: string;
      businessName?: string;
    }) => {
      const mode = (import.meta as any).env?.VITE_ORDERS_API;
      if (mode !== "legacy") {
        if (import.meta.env.DEV) {
          console.error(
            "[Riderzpro store] placeOrderWithOptions is deprecated. Use createOrder from src/lib/api/orders.",
          );
        }
        return {} as Order;
      }

      const discount = options.discount || 0;
      const q = quoteCart(cart, discount);
      const newOrderId = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const isInterstate = options.shippingAddress?.state
        ? !options.shippingAddress.state.toLowerCase().includes("karnataka")
        : false;

      const defaultStatus = (options.payment.includes("COD") || options.payment.includes("Cash on Delivery"))
        ? "COD_PENDING"
        : "PAID";

      const order: Order = {
        id: newOrderId,
        createdAt: Date.now(),
        payment: options.payment,
        paymentStatus: options.paymentStatus || defaultStatus,
        status: 0,
        fulfillmentStatus: "Awaiting Fulfillment",
        shippingAddress: options.shippingAddress,
        customerName: options.shippingAddress.name,
        customerPhone: options.shippingAddress.phone,
        couponCode: options.couponCode,
        source: "legacy",
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

      // Derive dropoff coordinates from the order's shipping address or customer's confirmed userLocation
      const dropLat =
        options.shippingAddress.latitude ??
        options.shippingAddress.lat ??
        userLocation?.latitude ??
        userLocation?.lat ??
        16.5740;
      const dropLng =
        options.shippingAddress.longitude ??
        options.shippingAddress.lng ??
        userLocation?.longitude ??
        userLocation?.lng ??
        80.3575;
      const dropAddr = `${options.shippingAddress.street || userLocation?.address || userLocation?.name || "Amaravati"}, ${options.shippingAddress.city || userLocation?.city || "Amaravati"}`;

      // Auto-manifest initial shipment with real destination coordinates
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
        destinationAddress: {
          ...options.shippingAddress,
          latitude: dropLat,
          longitude: dropLng,
        },
        weightKg: 4.5,
        itemDescription: `${cart.length} EV Parts & Accessories`,
        orderValue: q.total,
      });

      order.shipmentId = autoShipment.shipmentId;

      setOrders((prev) => [order, ...prev]);
      setShipments((prev) => [autoShipment, ...prev]);
      setCart([]);

      // Asynchronously persist delivery task in real logistics backend with customer GPS destination
      const backendPayload = {
        order_id: newOrderId,
        customer_id: userProfile?.phone || "cust_demo",
        customer_name: options.shippingAddress.name || userProfile?.name || "Customer",
        customer_phone: options.shippingAddress.phone || userProfile?.phone || "+91 98111 22334",
        vendor_id: "vnd_nexgen_ev",
        vendor_name: "NexGen EV Logistics",
        pickup_address: "Vijayawada Central Hub (16.5062, 80.6480)",
        pickup_lat: 16.5062,
        pickup_lng: 80.6480,
        dropoff_address: dropAddr,
        dropoff_lat: dropLat,
        dropoff_lng: dropLng,
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

  /** @deprecated Use createOrder from src/lib/api/orders instead. Kept for legacy mode only. */
  const placeOrder = useCallback(
    (payment: string) => {
      const mode = (import.meta as any).env?.VITE_ORDERS_API;
      if (mode !== "legacy") {
        if (import.meta.env.DEV) {
          console.error(
            "[Riderzpro store] placeOrder is deprecated. Use createOrder from src/lib/api/orders.",
          );
        }
        return {} as Order;
      }
      return placeOrderWithOptions({
        payment,
        shippingAddress: DEFAULT_ADDRESS,
      });
    },
    [placeOrderWithOptions],
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
      }),
    );

    if (status === 5) {
      setShipments((prev) =>
        prev.map((s) =>
          s.shipmentId === id || s.orderId === id ? { ...s, status: "Delivered" as ShipmentStatus } : s
        )
      );
    }
  }, []);

  const cancelOrder = useCallback(
    (id: string, reason: string) => {
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
        }),
      );
    },
    [updateInventoryStock],
  );

  const refundOrder = useCallback((id: string, reason: string) => {
    setOrders((os) =>
      os.map((o) =>
        o.id === id
          ? {
              ...o,
              paymentStatus: "Refunded",
              refundReason: reason,
            }
          : o,
      ),
    );
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" as const } : b)),
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateUserProfile = useCallback((p: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const simulateDemoOrder = useCallback(() => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RZ-${randomSuffix}`;
    const demoOrder: Order = {
      id: orderId,
      createdAt: Date.now(),
      groups: [
        {
          vendorId: "v1",
          items: [{ productId: "p1", qty: 1, price: 1250 }],
          subtotal: 1250,
          km: 5.2,
          fee: 45,
          eta: 15,
        },
      ],
      itemsTotal: 1250,
      deliveryTotal: 45,
      tax: 225,
      total: 1520,
      eta: 15,
      payment: "UPI · Paid Online",
      paymentStatus: "Paid",
      status: 1,
      fulfillmentStatus: "Preparing",
      riderId: riders[0]?.id || "r1",
      customerName: userProfile?.name?.trim() || "Customer",
      customerPhone: userProfile?.phone?.trim() || "+91 98765 43210",
      shippingAddress: {
        name: userProfile?.name?.trim() || "Customer",
        phone: userProfile?.phone?.trim() || "+91 98765 43210",
        street: "Indiranagar 100ft Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
      },
    };

    setOrders((prev) => [demoOrder, ...prev.filter((o) => o.id !== demoOrder.id)]);
    return demoOrder;
  }, [userProfile]);

  const signIn = useCallback(() => setIsLoggedIn(true), []);
  const signOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("riderzpro_auth_user");
    localStorage.removeItem("riderzpro_auth_token");
    setOrders((prev) => prev.filter((o) => o.source !== "api"));
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("riderzpro_orders_session");
        // Clear all user-specific mock order keys
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith("riderzpro_mock_orders_")) {
            sessionStorage.removeItem(key);
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);
  const deleteOrder = useCallback(
    (id: string) => setOrders((os) => os.filter((o) => o.id !== id)),
    [],
  );
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
      syncApiOrders,
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
