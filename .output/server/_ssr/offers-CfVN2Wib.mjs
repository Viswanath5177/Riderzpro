import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ShieldCheck, Ut as Check, kt as Copy, m as Tag, un as ArrowRight } from "../_libs/lucide-react.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as inr, i as bestOffer, y as products } from "./data-C7OlInRR.mjs";
import { t as SiteLayout } from "./SiteLayout-Bzq_a5Ga.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offers-CfVN2Wib.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var coupons = [
	{
		code: "VOLT500",
		discount: "Flat ₹500 OFF",
		desc: "Valid on all 48V, 60V and 72V lithium battery packs above ₹10,000",
		category: "Battery"
	},
	{
		code: "FREESHIP",
		discount: "Free Delivery",
		desc: "Free 3-hour doorstep delivery on all orders above ₹999 across Bengaluru",
		category: "All"
	},
	{
		code: "GEAR10",
		discount: "10% OFF",
		desc: "Save 10% on certified helmets, armored jackets, gloves and alarms",
		category: "Riding Gear & Helmets"
	},
	{
		code: "SPARE200",
		discount: "Flat ₹200 OFF",
		desc: "Applicable on ceramic disc brake pads, wave rotors and Kevlar drive belts",
		category: "Spare Parts"
	}
];
function OffersPage() {
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const handleCopy = (code) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		toast.success(`Coupon code ${code} copied to clipboard!`);
		setTimeout(() => setCopiedCode(null), 2500);
	};
	const discountedProducts = products.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-[#f7f7f8] py-12 lg:py-16 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-bold text-[#e11d2a] mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Coupons" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]",
						children: "Deals, Promos & Vouchers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-[#6b7280] mt-2",
						children: "Apply these coupons during checkout to save on batteries, chargers, and parts."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5",
				children: coupons.map((c) => {
					const isCopied = copiedCode === c.code;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-5 shadow-xs transition hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-[#e11d2a]",
									children: c.discount
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-[#e11d2a]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl bg-[#f7f7f8] border border-[#ececec] p-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm font-extrabold text-[#111111]",
									children: c.code
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleCopy(c.code),
									className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#ececec] text-[#111111] hover:text-[#e11d2a] transition cursor-pointer",
									title: "Copy Coupon",
									children: isCopied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#6b7280] leading-relaxed",
								children: c.desc
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 pt-3 border-t border-[#ececec]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/shop",
								search: { cat: c.category !== "All" ? c.category : void 0 },
								className: "inline-flex items-center gap-1 text-xs font-semibold text-[#e11d2a] hover:text-[#c91823] transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop eligible items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
							})
						})]
					}, c.code);
				})
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-[#111111]",
					children: "Special Discounted Hardware"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#6b7280] mt-1",
					children: "Hand-picked high performance EV packs and equipment on sale"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore all" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
				children: discountedProducts.map((p) => {
					const offer = bestOffer(p);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-[#ececec] bg-white p-4 shadow-xs hover:shadow-md transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$id",
							params: { id: p.id },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-square rounded-xl bg-[#f7f7f8] overflow-hidden mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.image,
										alt: p.name,
										width: 400,
										height: 400,
										className: "h-full w-full object-cover transition-transform duration-300 hover:scale-105"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Fit" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-extrabold text-[#111111] mt-2",
									children: inr(offer.price)
								})
							]
						})
					}, p.id);
				})
			})]
		})
	})] });
}
//#endregion
export { OffersPage as component };
