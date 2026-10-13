import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Q as MessageCircle, Ut as Check, V as Phone, _ as Star, rt as Lock } from "../_libs/lucide-react.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as inr, b as riders, h as getVendor, m as getProduct } from "./data-C7OlInRR.mjs";
import { r as ORDER_STEPS, s as useStore } from "./bits-BhX7Ijve.mjs";
import { t as SiteLayout } from "./SiteLayout-Bzq_a5Ga.mjs";
import { t as LiveMap } from "./LiveMap-Df7tahlg.mjs";
import { t as Route } from "./track._id-wwJD7Bwl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track._id-TuQNLwbd.js
var import_jsx_runtime = require_jsx_runtime();
function Track() {
	const { id } = Route.useParams();
	const { orders, advanceOrder } = useStore();
	const o = orders.find((x) => x.id === id);
	if (!o) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl",
			children: "Order not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/orders",
			className: "text-primary",
			children: "See your orders"
		})]
	}) });
	const rider = o.riderId ? riders.find((r) => r.id === o.riderId) : null;
	const progress = o.status <= 2 ? 0 : o.status === 3 ? .45 : o.status === 4 ? .8 : 1;
	const remaining = Math.max(0, Math.round(o.eta * (1 - o.status / (ORDER_STEPS.length - 1))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-bold uppercase tracking-[0.25em] text-primary",
				children: ["Order ", o.id]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl md:text-7xl",
				children: o.status === 5 ? "Delivered!" : `Arriving in ${remaining} min`
			})] }), o.status < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => advanceOrder(o.id),
				className: "rounded-full border border-border px-4 py-2 text-sm hover:border-primary",
				children: "Simulate next step →"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
				stops: o.groups.length,
				progress: o.status >= 3 ? void 0 : progress,
				className: "aspect-[4/3] lg:aspect-auto lg:min-h-[520px]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border border-border bg-card p-5 shadow-card",
						children: rider ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Your rider"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground",
									children: rider.avatar
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: rider.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [
												rider.vehicle,
												" · ",
												rider.plate
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-warning text-warning" }), rider.rating]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${rider.phone}`,
									className: "flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "Call"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toast("Chat opened", { description: `Message ${rider.name}` }),
									className: "flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), "Chat"]
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" }), " Rider details appear once a rider accepts your delivery."]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border border-border bg-card p-5 shadow-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-4",
							children: ORDER_STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i <= o.status ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
										children: i < o.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: i <= o.status ? "font-semibold" : "text-muted-foreground",
										children: s
									}),
									i === o.status && o.status < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" })
								]
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-5 text-sm shadow-card",
						children: [o.groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border py-2 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: getVendor(g.vendorId).name
							}), g.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									it.qty,
									" × ",
									getProduct(it.productId)?.name
								]
							}, it.productId))]
						}, g.vendorId)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex justify-between font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Paid (",
								o.payment,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(o.total) })]
						})]
					})
				]
			})]
		})]
	}) });
}
//#endregion
export { Track as component };
