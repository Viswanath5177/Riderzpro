import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, Y as MapPin, c as Truck, m as Star, wt as Clock } from "../_libs/lucide-react.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as getVendor, b as products, d as deliveryFee, f as distanceKm, g as getProduct, h as getBike, l as bikes, m as fitmentFor, n as CUSTOMER_LOCATION, o as ProductCard, p as etaMinutes, r as FitmentBadge, w as useStore, y as inr } from "./bits-6XfYm-PF.mjs";
import { t as SiteLayout } from "./SiteLayout-CGSp9TSN.mjs";
import { t as Route } from "./product._id-Bc2lvtRv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BlQ3WiIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { id } = Route.useParams();
	const p = getProduct(id);
	const [imageFailed, setImageFailed] = (0, import_react.useState)(false);
	const { activeBikeId, addToCart } = useStore();
	const fit = fitmentFor(p, activeBikeId);
	const bike = activeBikeId ? getBike(activeBikeId) : null;
	const hasValidImage = Boolean(p.image && p.image.trim() !== "" && !imageFailed);
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
		["Weight", p.weightKg > 0 ? `${p.weightKg} kg` : "—"],
		["Warranty", p.warrantyMonths > 0 ? `${p.warrantyMonths} months` : "—"],
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
					className: "relative aspect-square overflow-hidden rounded-3xl border border-border bg-[#F5F6F8] flex items-center justify-center p-4",
					children: hasValidImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						width: 1024,
						height: 1024,
						onError: () => setImageFailed(true),
						className: "h-full w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full w-full flex-col items-center justify-center gap-3 text-center p-6 bg-gradient-to-b from-[#FAFAFA] to-[#F1F3F5] rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-20 w-20 place-items-center rounded-3xl bg-white border border-[#E5E7EB] text-4xl shadow-sm",
							children: "🧰"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold text-[#111111]",
							children: "Product image not available"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-[#6B7280]",
							children: ["Genuine catalog item · ", p.brand]
						})] })]
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
					p.fits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: ["Verified bike fit: ", p.fits.map((f) => bikes.find((b) => b.id === f)?.model).filter(Boolean).join(", ")]
					}) : p.vehicleType !== "car" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-amber-700",
						children: "Bike fitment has not been verified. Confirm compatibility with the seller before ordering."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 font-display text-3xl",
						children: "Sellers near you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3",
						children: offers.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${i === 0 ? "border-[#E31E24] bg-red-50/60 shadow-2xs" : "border-[#E5E7EB] bg-white shadow-2xs"}`,
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
