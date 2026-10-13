import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ShieldCheck, Ft as CircleCheck, K as Package, _ as Star, dn as ArrowLeft, et as MapPin, g as Store, jt as Clock, l as Truck } from "../_libs/lucide-react.mjs";
import { X as notFound, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as useCatalogue, p as getCatalogueVendor } from "./data-C7OlInRR.mjs";
import { i as ProductCard } from "./bits-BhX7Ijve.mjs";
import { t as SiteLayout } from "./SiteLayout-Bzq_a5Ga.mjs";
import { t as Route } from "./store._slug-DVP76Tmn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store._slug-Bg7wqf6T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VendorStorefrontPage() {
	const { slug } = Route.useParams();
	const { products: allLiveProducts, vendors } = useCatalogue();
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All");
	const vendor = (0, import_react.useMemo)(() => {
		return vendors.find((v) => v.storeSlug === slug || v.id === slug) || getCatalogueVendor(slug);
	}, [vendors, slug]);
	if (!vendor) throw notFound();
	const vendorProducts = (0, import_react.useMemo)(() => {
		return allLiveProducts.filter((p) => p.offers.some((o) => o.vendorId === vendor.id) || p.vendorStoreId === vendor.id);
	}, [allLiveProducts, vendor.id]);
	const categories = (0, import_react.useMemo)(() => {
		const cats = /* @__PURE__ */ new Set();
		vendorProducts.forEach((p) => cats.add(p.category));
		return ["All", ...Array.from(cats)];
	}, [vendorProducts]);
	const filteredProducts = (0, import_react.useMemo)(() => {
		if (selectedCategory === "All") return vendorProducts;
		return vendorProducts.filter((p) => p.category === selectedCategory);
	}, [vendorProducts, selectedCategory]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F5F6F8] pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-r from-zinc-900 via-neutral-900 to-red-950",
			children: [vendor.bannerUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: vendor.bannerUrl,
				alt: vendor.name,
				className: "h-full w-full object-cover opacity-60"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,30,36,0.25),transparent_70%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-4 left-4 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-white/90 backdrop-blur-md text-xs font-semibold hover:bg-black/60 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to Catalog"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 -mt-16 relative z-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start sm:items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-20 w-20 shrink-0 rounded-2xl border-2 border-white bg-red-50 shadow-md overflow-hidden flex items-center justify-center",
								children: vendor.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: vendor.logoUrl,
									alt: vendor.name,
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-10 w-10 text-[#E31E24]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl md:text-3xl font-extrabold text-[#111111]",
										children: vendor.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-blue-600" }), "Verified Merchant"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-500 mt-1 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-gray-700 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-gray-400" }), vendor.area]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 font-bold text-gray-900",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }),
												vendor.rating,
												" Rating"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-700 font-semibold",
											children: [vendorProducts.length, " Active Listings"]
										})
									]
								}),
								vendor.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-600 mt-2 italic font-medium",
									children: [
										"\"",
										vendor.tagline,
										"\""
									]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-red-50/60 rounded-2xl p-3 border border-red-100 text-center min-w-[100px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-[#E31E24] mx-auto mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-gray-500 font-medium",
											children: "Handling"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-bold text-gray-900",
											children: [
												"~",
												vendor.prepMins,
												" Mins"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center min-w-[100px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-gray-700 mx-auto mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-gray-500 font-medium",
											children: "Delivery"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-gray-900",
											children: "Hyperlocal"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 text-center min-w-[100px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 mx-auto mb-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-gray-500 font-medium",
											children: "Parts"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-emerald-800",
											children: "100% Genuine"
										})
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between flex-wrap gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-xl font-bold text-[#111111]",
						children: [
							"Catalog & Spares (",
							filteredProducts.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-gray-500 mt-0.5",
						children: [
							"Authentic automotive parts supplied and backed by ",
							vendor.name,
							"."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full",
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedCategory(c),
							className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${selectedCategory === c ? "bg-[#E31E24] text-white shadow-xs" : "bg-white text-gray-600 hover:text-black border border-gray-200"}`,
							children: c
						}, c))
					})]
				}),
				filteredProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
					children: filteredProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-12 w-12 text-gray-300 mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-gray-900",
							children: "No products found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-500 mt-1 max-w-sm mx-auto",
							children: [
								"No active listings found under \"",
								selectedCategory,
								"\". Try choosing another category tab above."
							]
						})
					]
				})
			]
		})]
	}) });
}
//#endregion
export { VendorStorefrontPage as component };
