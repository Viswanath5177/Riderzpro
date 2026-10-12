import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CUSTOMER_LOCATION,
  GST_RATE,
  deliveryFee,
  distanceKm,
  etaMinutes,
  getProduct,
  getVendor,
  riders,
} from "./data";

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
export type Role = "customer";

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
  tax: number;
  total: number;
  eta: number;
  payment: string;
  status: number;
  riderId?: string;
};

export function quoteCart(cart: CartItem[]) {
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
  const tax = Math.round(itemsTotal * GST_RATE);
  const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
  return { groups, itemsTotal, deliveryTotal, tax, total: itemsTotal + deliveryTotal + tax, eta };
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
  advanceOrder: (id: string) => void;
  simulateDemoOrder: () => Order;
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
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "riderzpro-v1";

const DEFAULT_PROFILE: UserProfile = {
  name: "Aakash Sharma",
  phone: "+91 98765 43210",
  email: "aakash.sharma@example.com",
  city: "Bengaluru, KA",
  address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
  points: 450,
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["p1", "p8"]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(DEFAULT_BOOKINGS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(DEFAULT_NOTIFICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [role, setRole] = useState<Role>("customer");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.cart) setCart(s.cart);
        if (s.garage) setGarage(s.garage);
        if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
        if (s.orders) setOrders(s.orders);
        if (s.savedProductIds) setSavedProductIds(s.savedProductIds);
        if (s.serviceBookings) setServiceBookings(s.serviceBookings);
        if (s.notifications) setNotifications(s.notifications);
        if (s.userProfile) setUserProfile(s.userProfile);
        if (s.role) setRole(s.role);
      }
      localStorage.removeItem("riderzpro-theme");
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
        savedProductIds,
        serviceBookings,
        notifications,
        userProfile,
        role,
      }),
    );
  }, [cart, garage, activeBikeId, orders, savedProductIds, serviceBookings, notifications, userProfile, role, loaded]);

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
          return { ...o, status, riderId: status >= 2 ? o.riderId ?? riders[0].id : undefined };
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

  const placeOrder = useCallback(
    (payment: string) => {
      const q = quoteCart(cart);
      const order: Order = { id: `RZ${Date.now().toString().slice(-6)}`, createdAt: Date.now(), payment, status: 0, ...q };
      setOrders((o) => [order, ...o]);
      setCart([]);
      return order;
    },
    [cart],
  );

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
      id: `RZ${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: Date.now() - 12 * 60 * 1000,
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
      payment: "UPI • Google Pay",
      status: 3,
      riderId: riders[0].id,
    };
    setOrders((prev) => [demoOrder, ...prev]);
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
      advanceOrder: (id) =>
        setOrders((os) =>
          os.map((o) =>
            o.id === id && o.status < ORDER_STEPS.length - 1
              ? { ...o, status: o.status + 1, riderId: o.status + 1 >= 2 ? riders[0].id : undefined }
              : o,
          ),
        ),
      simulateDemoOrder,
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
      simulateDemoOrder,
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
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
