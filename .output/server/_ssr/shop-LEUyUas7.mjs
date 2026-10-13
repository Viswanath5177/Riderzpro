import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { O as Search, n as X, y as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { b as products, c as bestOffer, h as getBike, o as ProductCard, t as ALL_PRODUCT_CATEGORIES, w as useStore } from "./bits-6XfYm-PF.mjs";
import { t as SiteLayout } from "./SiteLayout-CGSp9TSN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-LEUyUas7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"All",
	"Electric Bikes",
	"EV Batteries",
	"Car Accessories",
	"Bike Accessories"
];
var PAGE_SIZE = 40;
function Shop() {
	const { activeBikeId, setActiveBikeId } = useStore();
	const [q, setQ] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get("q") || "";
		return "";
	});
	const [cat, setCat] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const c = new URLSearchParams(window.location.search).get("cat");
			if (c && CATS.includes(c)) return c;
		}
		return "All";
	});
	const [subcat, setSubcat] = (0, import_react.useState)("All");
	const [volt, setVolt] = (0, import_react.useState)(null);
	const [onlyFit, setOnlyFit] = (0, import_react.useState)(false);
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		const handleUrl = () => {
			if (typeof window !== "undefined") {
				const p = new URLSearchParams(window.location.search);
				const urlQ = p.get("q");
				const urlCat = p.get("cat");
				if (urlQ !== null) setQ(urlQ);
				if (urlCat !== null && CATS.includes(urlCat)) setCat(urlCat);
			}
		};
		handleUrl();
		window.addEventListener("popstate", handleUrl);
		return () => window.removeEventListener("popstate", handleUrl);
	}, []);
	const list = (0, import_react.useMemo)(() => {
		let l = products.filter((p) => {
			const matchesCat = cat === "All" || cat === "Electric Bikes" && p.category === "Electric Bikes" || cat === "EV Batteries" && (p.category === "Battery" || p.category === "EV Batteries") || cat === "Car Accessories" && (p.vehicleType === "car" || p.vehicleType === "both" || p.category === "Car Accessories") || cat === "Bike Accessories" && (p.vehicleType === "bike" || p.vehicleType === "both" || p.category === "Bike Accessories");
			const matchesSubcat = subcat === "All" || p.category.toLowerCase() === subcat.toLowerCase() || p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase() || Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase());
			const matchesVolt = !volt || p.voltage === volt;
			const matchesFit = !onlyFit || !activeBikeId || p.fits.includes(activeBikeId);
			const matchesQ = q === "" || `${p.name} ${p.brand} ${p.category} ${p.subcategory || ""} ${p.description}`.toLowerCase().includes(q.toLowerCase());
			return matchesCat && matchesSubcat && matchesVolt && matchesFit && matchesQ;
		});
		if (sort === "low") l = [...l].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
		if (sort === "high") l = [...l].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
		return l;
	}, [
		q,
		cat,
		subcat,
		volt,
		onlyFit,
		activeBikeId,
		sort
	]);
	const bike = activeBikeId ? getBike(activeBikeId) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E31E24]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Catalog" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#6B7280]",
								children: "Automotive Retail"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-extrabold text-[#111111] sm:text-4xl",
						children: cat === "All" ? "All Products & Spares" : cat
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[#6B7280]",
						children: "Browse high-grade electric bikes, genuine spares, accessories, and certified fast chargers."
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border border-[#E5E7EB] bg-white px-4 py-3.5 rounded-xl shadow-2xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:flex-row lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-1 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 h-4 w-4 text-[#6B7280]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search across all automotive items...",
									className: "h-10 w-full rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] pl-10 pr-8 text-sm text-[#111111] placeholder:text-[#6B7280] focus:border-[#E31E24] focus:bg-white focus:outline-none"
								}),
								q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQ(""),
									className: "absolute right-3 text-gray-400 hover:text-gray-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-[#6B7280] hidden sm:inline whitespace-nowrap",
								children: "Category:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: subcat,
								onChange: (e) => {
									setSubcat(e.target.value);
									setVisibleCount(PAGE_SIZE);
								},
								"aria-label": "Filter by product category",
								className: "h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#111111] outline-none cursor-pointer hover:border-gray-400 max-w-[200px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "All",
									children: [
										"All Categories (",
										ALL_PRODUCT_CATEGORIES.length,
										")"
									]
								}), ALL_PRODUCT_CATEGORIES.map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: sc,
									children: sc
								}, sc))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none",
							children: CATS.map((c) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setCat(c);
										setVisibleCount(PAGE_SIZE);
									},
									className: `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-[#E31E24] text-white font-semibold shadow-2xs" : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300 hover:text-[#111111]"}`,
									children: c
								}, c);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5 text-[#6B7280]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#6B7280] font-medium",
							children: "Voltage:"
						}),
						[
							48,
							60,
							72
						].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setVolt(volt === v ? null : v);
								setVisibleCount(PAGE_SIZE);
							},
							className: `rounded-md border px-2.5 py-1 font-semibold leading-none ${volt === v ? "border-[#E31E24] bg-red-50 text-[#E31E24]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111111]"}`,
							children: [v, "V"]
						}, v)),
						bike && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "ml-3 flex items-center gap-1.5 cursor-pointer font-medium text-[#111111]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: onlyFit,
								onChange: (e) => {
									setOnlyFit(e.target.checked);
									setVisibleCount(PAGE_SIZE);
								},
								className: "rounded border-gray-300 accent-[#E31E24]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Only compatible with ",
								bike.make,
								" ",
								bike.model
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#6B7280]",
								children: "Sort by:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sort,
								onChange: (e) => setSort(e.target.value),
								className: "rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "relevance",
										children: "Relevance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "low",
										children: "Price: Low → High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "high",
										children: "Price: High → Low"
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between text-xs text-[#6B7280]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Showing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-[#111111]",
						children: Math.min(visibleCount, list.length)
					}),
					" of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-[#111111]",
						children: list.length
					}),
					" products",
					subcat !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-[#E31E24]",
						children: subcat
					})] })
				] }), (cat !== "All" || subcat !== "All" || q || volt !== null || onlyFit) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setCat("All");
						setSubcat("All");
						setQ("");
						setVolt(null);
						setOnlyFit(false);
						setVisibleCount(PAGE_SIZE);
					},
					className: "font-medium text-[#E31E24] hover:underline",
					children: "Reset all filters"
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold text-[#111111]",
						children: "No matching products found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[#6B7280]",
						children: "Try clearing filters or search query to explore the full inventory."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setCat("All");
							setSubcat("All");
							setQ("");
							setVolt(null);
							setOnlyFit(false);
							setVisibleCount(PAGE_SIZE);
						},
						className: "mt-4 rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-semibold text-white hover:bg-red-700",
						children: "View All Products"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: list.slice(0, visibleCount).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			}), visibleCount < list.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, list.length)),
					className: "rounded-xl border border-[#E5E7EB] bg-white px-6 py-2.5 text-xs font-bold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-gray-50 cursor-pointer transition",
					children: [
						"Load More Products (",
						list.length - visibleCount,
						" remaining)"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setVisibleCount(list.length),
					className: "rounded-xl bg-[#E31E24] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 cursor-pointer transition",
					children: [
						"Show All ",
						list.length,
						" Items"
					]
				})]
			})] })
		]
	}) });
}
//#endregion
export { Shop as component };
