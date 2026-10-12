import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as MapPin, K as Clock, f as Star, s as Truck, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { D as useStore, S as inr, _ as etaMinutes, a as ProductCard, b as getProduct, d as bikes, g as distanceKm, h as deliveryFee, n as FitmentBadge, t as CUSTOMER_LOCATION, v as fitmentFor, w as products, x as getVendor, y as getBike } from "./bits-PIC53EAH.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./product._id-B5s6i8vd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-D2vKGS__.js
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { id } = Route.useParams();
	const p = getProduct(id);
	const { activeBikeId, addToCart } = useStore();
	const fit = fitmentFor(p, activeBikeId);
	const bike = activeBikeId ? getBike(activeBikeId) : null;
	const offers = p.offers.map((o) => {
		const v = getVendor(o.vendorId);
		const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
		return {
			...o,
			v,
			km,
			fee: deliveryFee(km),
			eta: etaMinutes(km, v.prepMins)
		};
	}).sort((a, b) => a.price + a.fee - (b.price + b.fee));
	const specs = [
		["Voltage", p.voltage ? `${p.voltage} V` : "—"],
		["Capacity", p.capacityAh ? `${p.capacityAh} Ah` : "—"],
		["Energy", p.voltage && p.capacityAh ? `${(p.voltage * p.capacityAh / 1e3).toFixed(2)} kWh` : "—"],
		["Chemistry", p.chemistry ?? "—"],
		["Est. range", p.rangeKm ? `${p.rangeKm} km` : "—"],
		["Weight", `${p.weightKg} kg`],
		["Warranty", `${p.warrantyMonths} months`],
		["Brand", p.brand]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "text-sm text-muted-foreground hover:text-primary",
				children: "← Back to shop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-3xl border border-border bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						width: 1024,
						height: 1024,
						className: "aspect-square w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-bold uppercase tracking-[0.25em] text-primary",
						children: [
							p.category,
							" · ",
							p.brand
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-5xl leading-none md:text-6xl",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: p.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FitmentBadge, { fit }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground",
							children: bike ? `for ${bike.make} ${bike.model}` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/garage",
								className: "text-primary",
								children: "Add your bike to check fit"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: ["Fits: ", p.fits.map((f) => bikes.find((b) => b.id === f)?.model).join(", ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 font-display text-3xl",
						children: "Sellers near you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3",
						children: offers.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${i === 0 ? "border-primary bg-accent/30" : "border-border bg-card"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: o.v.name
									}), i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground",
										children: "Best value"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-warning text-warning" }), o.v.rating]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
												o.km,
												" km"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }),
												inr(o.fee),
												" delivery"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												"~",
												o.eta,
												" min"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: o.stock > 0 ? "text-success" : "text-destructive",
											children: o.stock > 0 ? `${o.stock} in stock` : "Out of stock"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold",
									children: inr(o.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: o.stock === 0,
									onClick: () => {
										addToCart(p.id, o.vendorId);
										toast.success("Added to cart", { description: o.v.name });
									},
									className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
									children: "Add to cart"
								})]
							})]
						}, o.vendorId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 font-display text-3xl",
						children: "Specifications"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-border",
						children: specs.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border p-3 odd:border-r",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-semibold",
								children: v
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Genuine product · Seller-verified fitment · 7-day replacement"]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-20 font-display text-4xl",
				children: "You may also need"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: products.filter((x) => x.id !== p.id && x.fits.some((f) => p.fits.includes(f))).slice(0, 4).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p: x }, x.id))
			})
		]
	}) });
}
//#endregion
export { ProductPage as component };
