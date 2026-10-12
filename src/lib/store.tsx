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
export type GarageBike = { bikeId: string; year?: number; vin?: string; nickname?: string };
export type Role = "customer" | "workshop" | "vendor" | "rider" | "admin";

export const ORDER_STEPS = ["Placed", "Vendor accepted", "Rider assigned", "Picked up", "On the way", "Delivered"] as const;

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
  role: Role;
  setRole: (r: Role) => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "riderzpro-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [garage, setGarage] = useState<GarageBike[]>([{ bikeId: "ola-s1pro", year: 2023, nickname: "Daily ride" }]);
  const [activeBikeId, setActiveBikeId] = useState<string | null>("ola-s1pro");
  const [orders, setOrders] = useState<Order[]>([]);
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
        if (s.role) setRole(s.role);
      }
      localStorage.removeItem("riderzpro-theme");
      setTheme("light");
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, garage, activeBikeId, orders, role }));
  }, [cart, garage, activeBikeId, orders, role, loaded]);

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
      role,
      setRole,
    }),
    [theme, cart, addToCart, setQty, garage, activeBikeId, orders, placeOrder, role],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
