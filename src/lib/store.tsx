import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CUSTOMER_LOCATION,
  GST_RATE,
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
export type Role = "customer" | "workshop" | "vendor" | "rider" | "admin";

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

export type UserAddress = {
  id: string;
  tag: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
};

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  points: number;
  addresses?: UserAddress[];
  selectedAddressId?: string;
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

export function quoteCart(cart: CartItem[], discount = 0) {
  const map = new Map<string, VendorGroup>();
  for (const c of cart) {
    const p = getProduct(c.productId);
    if (!p) continue;
    const offer = p.offers.find((o) => o.vendorId === c.vendorId) ?? p.offers[0];
    let g = map.get(c.vendorId);
    if (!g) {
      const v = getVendor(c.vendorId);
      const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
      g = { vendorId: c.vendorId, items: [], subtotal: 0, km, fee: deliveryFee(km), eta: etaMinutes(km, v.prepMins) };
      map.set(c.vendorId, g);
    }
    g.items.push({ productId: c.productId, qty: c.qty, price: offer.price });
    g.subtotal += offer.price * c.qty;
  }
  const groups = [...map.values()];
  const itemsTotal = groups.reduce((s, g) => s + g.subtotal, 0);
  const deliveryTotal = groups.reduce((s, g) => s + g.fee, 0);
  const discountedSubtotal = Math.max(0, itemsTotal - discount);
  const tax = Math.round(discountedSubtotal * GST_RATE);
  const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
  return { groups, itemsTotal, deliveryTotal, tax, discountTotal: discount, total: discountedSubtotal + deliveryTotal + tax, eta };
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
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  signIn: () => void;
  signOut: () => void;
  selectAddress: (id: string) => void;
  addAddress: (addr: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, updated: Partial<UserAddress>) => void;
  removeAddress: (id: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "riderzpro-v2";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Aakash Sharma",
  phone: "+91 98765 43210",
  email: "aakash.sharma@example.com",
  city: "Bengaluru, KA",
  address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
  points: 450,
  selectedAddressId: "addr-1",
  addresses: [
    {
      id: "addr-1",
      tag: "Home (Primary)",
      name: "Aakash Sharma",
      phone: "+91 98765 43210",
      street: "Flat 402, Green Glen Layout, Bellandur",
      city: "Bengaluru, KA",
      pincode: "560103",
    },
    {
      id: "addr-2",
      tag: "Office / Tech Park",
      name: "Aakash Sharma",
      phone: "+91 98765 43210",
      street: "Tower B, Prestige Tech Cloud, Outer Ring Road",
      city: "Bengaluru, KA",
      pincode: "560103",
    },
    {
      id: "addr-3",
      tag: "Workshop Garage",
      name: "Aakash Sharma",
      phone: "+91 98765 43210",
      street: "Plot 18, Electronic City Phase 1",
      city: "Bengaluru, KA",
      pincode: "560100",
    },
  ],
};

const DEFAULT_ADDRESS: AddressRef = {
  name: "Aakash Sharma",
  street: "Flat 402, Green Glen Layout, Bellandur",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560103",
  phone: "+91 98765 43210",
};

const DEFAULT_BOOKINGS: ServiceBooking[] = [
  {
    id: "SB-1042",
    bikeId: "ola-s1pro",
    serviceType: "24-Point EV Health & BMS Diagnostic",
    slot: "Tomorrow, 10:30 AM",
    location: "Doorstep (Bellandur)",
    status: "Confirmed",
    technician: "Manoj Swamy (Certified EV Tech)",
    cost: 299,
    createdAt: Date.now() - 3600000,
  },
];

const DEFAULT_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: "notif-1",
    title: "Technician Confirmed",
    message: "Manoj Swamy is assigned for your doorstep BMS diagnostic tomorrow at 10:30 AM.",
    time: "25m ago",
    read: false,
    type: "service",
  },
  {
    id: "notif-2",
    title: "Battery Health Alert",
    message: "Your Ola S1 Pro battery is running optimal at 96% state of health. Regular monsoon maintenance recommended.",
    time: "3h ago",
    read: false,
    type: "system",
  },
  {
    id: "notif-3",
    title: "Monsoon Exclusive Offer",
    message: "Get ₹500 off on 60V fast chargers with code EVSAFE. Valid until Sunday.",
    time: "1d ago",
    read: true,
    type: "offer",
  },
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: "RZ-849201",
    createdAt: Date.now() - 48 * 60 * 1000,
    groups: [
      {
        vendorId: "v1",
        items: [{ productId: "p7", qty: 1, price: 14500 }],
        subtotal: 14500,
        km: 4.2,
        fee: 90,
        eta: 25,
      },
    ],
    itemsTotal: 14500,
    deliveryTotal: 90,
    tax: 2610,
    total: 17200,
    eta: 25,
    payment: "UPI · Google Pay",
    paymentStatus: "Paid",
    status: 3, // Picked up / In transit
    fulfillmentStatus: "Dispatched",
    riderId: "r1",
    customerName: "Aakash Sharma",
    customerPhone: "+91 98765 43210",
    shippingAddress: DEFAULT_ADDRESS,
    shipmentId: "SHP-9201-DEL",
  },
  {
    id: "RZ-793420",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    groups: [
      {
        vendorId: "v3",
        items: [{ productId: "p12", qty: 1, price: 2400 }],
        subtotal: 2400,
        km: 3.1,
        fee: 77,
        eta: 30,
      },
    ],
    itemsTotal: 2400,
    deliveryTotal: 77,
    tax: 432,
    total: 2909,
    eta: 30,
    payment: "Credit Card (HDFC)",
    paymentStatus: "Paid",
    status: 5, // Delivered
    fulfillmentStatus: "Delivered",
    riderId: "r2",
    customerName: "Aakash Sharma",
    customerPhone: "+91 98765 43210",
    shippingAddress: DEFAULT_ADDRESS,
    shipmentId: "SHP-3420-BLU",
  },
];

export const DEFAULT_SHIPMENTS: NormalizedShipment[] = [
  {
    shipmentId: "SHP-9201-DEL",
    orderId: "RZ-849201",
    provider: "Delhivery",
    providerReference: "DEL-WAYBILL-984128471",
    trackingNumber: "DEL984128471",
    trackingUrl: "https://www.delhivery.com/track/package/DEL984128471",
    pickupAddress: {
      name: "VoltHub Indiranagar",
      street: "100ft Road, HAL 2nd Stage",
      city: "Bengaluru",
      pincode: "560038",
      phone: "+91 80 4123 9901",
    },
    destinationAddress: DEFAULT_ADDRESS,
    status: "In Transit",
    locationType: "Facility Checkpoint",
    latestLocation: "Bommasandra Hub Facility (Bengaluru)",
    lastEventTimestamp: "24m ago",
    estimatedDelivery: "Today, 5:30 PM",
    events: [
      {
        id: "evt-del-1",
        timestamp: "Today, 09:15 AM",
        status: "Manifested",
        location: "VoltHub Indiranagar",
        description: "Package Picked Up from Vendor Facility",
        isGps: false,
        facilityName: "Indiranagar Inbound Sort Hub",
      },
      {
        id: "evt-del-2",
        timestamp: "Today, 11:30 AM",
        status: "In Transit",
        location: "Central Sort Facility",
        description: "Inbound Scan & Sort Completed into Mother Bag",
        isGps: false,
        facilityName: "Central Sort Facility (Bengaluru East)",
      },
      {
        id: "evt-del-3",
        timestamp: "Today, 01:10 PM",
        status: "In Transit",
        location: "Bommasandra Hub Facility",
        description: "Bagging for Local Route Dispatch to Bellandur",
        isGps: false,
        facilityName: "Bommasandra Hub Facility",
      },
    ],
  },
  {
    shipmentId: "SHP-3420-BLU",
    orderId: "RZ-793420",
    provider: "Bluedart",
    providerReference: "BLU-AWB-7749021",
    trackingNumber: "BLU7749021",
    trackingUrl: "https://www.bluedart.com/tracking?trackNumber=BLU7749021",
    pickupAddress: {
      name: "EV Spares Jayanagar",
      street: "9th Block, Jayanagar",
      city: "Bengaluru",
      pincode: "560069",
      phone: "+91 80 2654 8831",
    },
    destinationAddress: DEFAULT_ADDRESS,
    status: "Delivered",
    locationType: "Facility Checkpoint",
    latestLocation: "Bellandur Destination Facility",
    lastEventTimestamp: "4 days ago",
    estimatedDelivery: "Delivered on Oct 8",
    actualDeliveryTimestamp: "Oct 8, 02:45 PM",
    events: [
      {
        id: "evt-blu-1",
        timestamp: "Oct 7, 03:00 PM",
        status: "Manifested",
        location: "Jayanagar Logistics Desk",
        description: "Air/Surface Manifest Created",
        isGps: false,
      },
      {
        id: "evt-blu-2",
        timestamp: "Oct 8, 10:00 AM",
        status: "Out for Delivery",
        location: "Bellandur Delivery Center",
        description: "Out for delivery with Blue Dart Field Executive",
        isGps: false,
      },
      {
        id: "evt-blu-3",
        timestamp: "Oct 8, 02:45 PM",
        status: "Delivered",
        location: "Customer Doorstep (Bellandur)",
        description: "Delivered & Signed by Aakash Sharma. OTP Verified.",
        isGps: false,
      },
    ],
    proofOfDelivery: {
      signedBy: "Aakash Sharma",
      timestamp: "Oct 8, 02:45 PM",
      otpVerified: true,
    },
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [garage, setGarage] = useState<GarageBike[]>([
    {
      bikeId: "ola-s1pro",
      year: 2023,
      nickname: "Daily Ride",
      vin: "P6R1S1PR2PN000001",
      regNo: "KA 01 EQ 8821",
      odoKm: 12450,
      batteryHealth: 96,
      nextServiceDays: 42,
    },
  ]);
  const [activeBikeId, setActiveBikeId] = useState<string | null>("ola-s1pro");
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [shipments, setShipments] = useState<NormalizedShipment[]>(DEFAULT_SHIPMENTS);
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    products.forEach((p) => {
      initial[p.id] = p.offers.reduce((s, o) => s + o.stock, 0) || 12;
    });
    return initial;
  });
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["p1", "p8"]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(DEFAULT_BOOKINGS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(DEFAULT_NOTIFICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [role, setRole] = useState<Role>("customer");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("riderzpro_auth") === "true";
    }
    return false;
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.cart) setCart(s.cart);
        if (s.garage) setGarage(s.garage);
        if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
        if (s.orders && s.orders.length > 0) setOrders(s.orders);
        if (s.shipments && s.shipments.length > 0) setShipments(s.shipments);
        if (s.inventoryStock) setInventoryStock(s.inventoryStock);
        if (s.savedProductIds) setSavedProductIds(s.savedProductIds);
        if (s.serviceBookings) setServiceBookings(s.serviceBookings);
        if (s.notifications) setNotifications(s.notifications);
        if (s.userProfile) {
          setUserProfile({
            ...DEFAULT_PROFILE,
            ...s.userProfile,
            addresses:
              s.userProfile.addresses && s.userProfile.addresses.length > 0
                ? s.userProfile.addresses
                : DEFAULT_PROFILE.addresses,
            selectedAddressId:
              s.userProfile.selectedAddressId || DEFAULT_PROFILE.selectedAddressId,
          });
        }
        if (s.role) setRole(s.role);
      }
      setTheme("light");
    } catch {}
    setLoaded(true);
  }, []);

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
      }),
    );
  }, [cart, garage, activeBikeId, orders, shipments, inventoryStock, savedProductIds, serviceBookings, notifications, userProfile, role, loaded]);

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

  const signIn = useCallback(() => {
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("riderzpro_auth", "true");
    }
  }, []);

  const signOut = useCallback(() => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("riderzpro_auth");
    }
  }, []);

  const updateUserProfile = useCallback((p: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const selectAddress = useCallback((id: string) => {
    setUserProfile((prev) => {
      const target = (prev.addresses || DEFAULT_PROFILE.addresses || []).find((a) => a.id === id);
      if (!target) return prev;
      return {
        ...prev,
        selectedAddressId: id,
        address: target.street,
        city: `${target.city} - ${target.pincode}`,
      };
    });
  }, []);

  const addAddress = useCallback((addr: Omit<UserAddress, "id">) => {
    const newAddr: UserAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setUserProfile((prev) => {
      const currentList = prev.addresses || DEFAULT_PROFILE.addresses || [];
      return {
        ...prev,
        addresses: [...currentList, newAddr],
        selectedAddressId: newAddr.id,
        address: newAddr.street,
        city: `${newAddr.city} - ${newAddr.pincode}`,
      };
    });
  }, []);

  const updateAddress = useCallback((id: string, updated: Partial<UserAddress>) => {
    setUserProfile((prev) => {
      const currentList = prev.addresses || DEFAULT_PROFILE.addresses || [];
      const newList = currentList.map((a) => (a.id === id ? { ...a, ...updated } : a));
      const target = newList.find((a) => a.id === id);
      const isCurrentlySelected = prev.selectedAddressId === id;
      return {
        ...prev,
        addresses: newList,
        address: isCurrentlySelected && target ? target.street : prev.address,
        city: isCurrentlySelected && target ? `${target.city} - ${target.pincode}` : prev.city,
      };
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUserProfile((prev) => {
      const currentList = prev.addresses || DEFAULT_PROFILE.addresses || [];
      const newList = currentList.filter((a) => a.id !== id);
      const fallback = newList[0];
      return {
        ...prev,
        addresses: newList,
        selectedAddressId: prev.selectedAddressId === id ? (fallback?.id || "") : prev.selectedAddressId,
        address: prev.selectedAddressId === id && fallback ? fallback.street : prev.address,
        city: prev.selectedAddressId === id && fallback ? `${fallback.city} - ${fallback.pincode}` : prev.city,
      };
    });
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
      customerName: "Aakash Sharma",
      customerPhone: "+91 98765 43210",
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
      isLoggedIn,
      setIsLoggedIn,
      signIn,
      signOut,
      selectAddress,
      addAddress,
      updateAddress,
      removeAddress,
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
      isLoggedIn,
      signIn,
      signOut,
      selectAddress,
      addAddress,
      updateAddress,
      removeAddress,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
