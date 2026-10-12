import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Plus, K as Clock, M as Minus, W as CreditCard, _ as ShoppingCart, d as Store, h as Smartphone, rt as Banknote, s as Truck } from "../_libs/lucide-react.mjs";
import { D as useStore, S as inr, T as quoteCart, b as getProduct, x as getVendor } from "./bits-PIC53EAH.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-B1g9w38f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cart() {
	const { cart, setQty, placeOrder } = useStore();
	const nav = useNavigate();
	const [pay, setPay] = (0, import_react.useState)("UPI");
	const q = quoteCart(cart);
	if (cart.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mx-auto h-14 w-14 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Find a battery that fits your bike and add it here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground",
				children: "Shop parts"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl md:text-7xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [q.groups.length, " sellers · one order · one payment"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [q.groups.map((g) => {
						const v = getVendor(g.vendorId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card p-5 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 border-b border-border pb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: v.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-auto flex items-center gap-3 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }),
												g.km,
												" km · ",
												inr(g.fee)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												"~",
												g.eta,
												" min"
											]
										})]
									})
								]
							}), g.items.map((it) => {
								const p = getProduct(it.productId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											alt: p.name,
											loading: "lazy",
											width: 80,
											height: 80,
											className: "h-16 w-16 rounded-xl object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold leading-tight",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground",
												children: [inr(it.price), " each"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 rounded-full border border-border p-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Decrease",
													onClick: () => setQty(it.productId, g.vendorId, it.qty - 1),
													className: "grid h-7 w-7 place-items-center rounded-full hover:bg-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-5 text-center text-sm font-semibold",
													children: it.qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Increase",
													onClick: () => setQty(it.productId, g.vendorId, it.qty + 1),
													className: "grid h-7 w-7 place-items-center rounded-full hover:bg-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "w-24 text-right font-bold",
											children: inr(it.price * it.qty)
										})
									]
								}, it.productId);
							})]
						}, g.vendorId);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Delivery per seller = ",
							inr(40),
							" base + ",
							inr(12),
							"/km from the seller to you. One rider collects from all sellers."
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl",
							children: "Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Items",
									v: inr(q.itemsTotal)
								}),
								q.groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: `Delivery · ${getVendor(g.vendorId).area}`,
									v: inr(g.fee),
									muted: true
								}, g.vendorId)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "GST (18%)",
									v: inr(q.tax)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-border pt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Total",
										v: inr(q.total),
										big: true
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-2 rounded-2xl bg-accent/40 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary" }),
								" Estimated delivery in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [q.eta, " min"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm font-semibold",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-3 gap-2",
							children: [
								["UPI", Smartphone],
								["Card", CreditCard],
								["COD", Banknote]
							].map(([l, I]) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPay(l),
									className: `flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold ${pay === l ? "border-primary text-primary" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4" }), l]
								}, l);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								const o = placeOrder(pay);
								nav({
									to: "/track/$id",
									params: { id: o.id }
								});
							},
							className: "mt-6 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-glow",
							children: ["Place order · ", inr(q.total)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-[11px] text-muted-foreground",
							children: "Demo payment — no money is charged."
						})
					]
				})]
			})
		]
	}) });
}
function Row({ k, v, muted, big }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${muted ? "text-muted-foreground" : ""} ${big ? "text-xl font-bold" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
//#endregion
export { Cart as component };
