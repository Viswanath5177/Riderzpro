import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Truck,
  Clock,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DELIVERY_BASE, DELIVERY_PER_KM, getProduct, getVendor, inr } from "@/lib/data";
import { quoteCart, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Riderzpro" },
      {
        name: "description",
        content: "One order across many sellers with distance-based delivery pricing.",
      },
      { property: "og:title", content: "Your cart — Riderzpro" },
      { property: "og:description", content: "Review your multi-vendor EV parts order." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, placeOrder } = useStore();
  const nav = useNavigate();
  const [pay, setPay] = useState("UPI");
  const q = quoteCart(cart);

  if (cart.length === 0)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <ShoppingCart className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-5xl">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Find a battery that fits your bike and add it here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Shop parts
          </Link>
        </div>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="font-display text-5xl md:text-7xl">Checkout</h1>
        <p className="text-muted-foreground">{q.groups.length} sellers · one order · one payment</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {q.groups.map((g) => {
              const v = getVendor(g.vendorId);
              return (
                <div
                  key={g.vendorId}
                  className="rounded-3xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
                    <Store className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{v.name}</p>
                    <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {g.km} km · {inr(g.fee)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />~{g.eta} min
                      </span>
                    </span>
                  </div>
                  {g.items.map((it) => {
                    const p = getProduct(it.productId)!;
                    return (
                      <div key={it.productId} className="flex items-center gap-4 py-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          width={80}
                          height={80}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold leading-tight">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{inr(it.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border p-1">
                          <button
                            aria-label="Decrease"
                            onClick={() => setQty(it.productId, g.vendorId, it.qty - 1)}
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{it.qty}</span>
                          <button
                            aria-label="Increase"
                            onClick={() => setQty(it.productId, g.vendorId, it.qty + 1)}
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="w-24 text-right font-bold">{inr(it.price * it.qty)}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              Delivery per seller = {inr(DELIVERY_BASE)} base + {inr(DELIVERY_PER_KM)}/km from the
              seller to you. One rider collects from all sellers.
            </p>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
            <p className="font-display text-3xl">Summary</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row k="Items" v={inr(q.itemsTotal)} />
              {q.groups.map((g) => (
                <Row
                  key={g.vendorId}
                  k={`Delivery · ${getVendor(g.vendorId).area}`}
                  v={inr(g.fee)}
                  muted
                />
              ))}
              <Row k="GST (18%)" v={inr(q.tax)} />
              <div className="border-t border-border pt-3">
                <Row k="Total" v={inr(q.total)} big />
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-accent/40 p-3 text-sm">
              <Clock className="h-4 w-4 text-primary" /> Estimated delivery in <b>{q.eta} min</b>
            </div>
            <p className="mt-6 text-sm font-semibold">Payment</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ["UPI", Smartphone],
                ["Card", CreditCard],
                ["COD", Banknote],
              ].map(([l, I]) => {
                const Icon = I as typeof Smartphone;
                return (
                  <button
                    key={l as string}
                    onClick={() => setPay(l as string)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold ${pay === l ? "border-primary text-primary" : "border-border"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {l as string}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                const o = placeOrder(pay);
                nav({ to: "/track/$id", params: { id: o.id } });
              }}
              className="mt-6 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-glow"
            >
              Place order · {inr(q.total)}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Demo payment — no money is charged.
            </p>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function Row({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return (
    <div
      className={`flex justify-between ${muted ? "text-muted-foreground" : ""} ${big ? "text-xl font-bold" : ""}`}
    >
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
