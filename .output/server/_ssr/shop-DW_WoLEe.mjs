import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as Search, g as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { D as useStore, a as ProductCard, d as bikes, u as bestOffer, w as products, y as getBike } from "./bits-PIC53EAH.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DW_WoLEe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"All",
	"Battery",
	"Charger",
	"BMS",
	"Motor",
	"Controller",
	"Brakes"
];
function Shop() {
	const { activeBikeId, setActiveBikeId } = useStore();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const [volt, setVolt] = (0, import_react.useState)(null);
	const [onlyFit, setOnlyFit] = (0, import_react.useState)(true);
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const list = (0, import_react.useMemo)(() => {
		let l = products.filter((p) => (cat === "All" || p.category === cat) && (!volt || p.voltage === volt) && (!onlyFit || !activeBikeId || p.fits.includes(activeBikeId)) && (q === "" || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase())));
		if (sort === "low") l = [...l].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
		if (sort === "high") l = [...l].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
		return l;
	}, [
		q,
		cat,
		volt,
		onlyFit,
		activeBikeId,
		sort
	]);
	const bike = activeBikeId ? getBike(activeBikeId) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.25em] text-primary",
					children: "Marketplace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-5xl md:text-7xl",
					children: "Batteries & parts"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex w-fit items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Shopping for"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: activeBikeId ?? "",
					onChange: (e) => setActiveBikeId(e.target.value || null),
					className: "bg-transparent font-semibold outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Any bike"
					}), bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: b.id,
						children: [
							b.make,
							" ",
							b.model
						]
					}, b.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-16 z-30 -mx-4 mt-6 border-b border-border px-4 py-3 glass md:mx-0 md:rounded-2xl md:border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:flex-row lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center gap-2 rounded-xl bg-muted px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search 60V battery, charger, BMS…",
							className: "h-10 w-full bg-transparent outline-none"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1 lg:pb-0",
						children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCat(c),
							className: `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`,
							children: c
						}, c))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-muted-foreground" }),
						[
							48,
							60,
							72
						].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setVolt(volt === v ? null : v),
							className: `rounded-lg border px-3 py-1 font-display text-lg leading-none ${volt === v ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
							children: [v, "V"]
						}, v)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "ml-2 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: onlyFit,
									onChange: (e) => setOnlyFit(e.target.checked),
									className: "accent-[var(--primary)]"
								}),
								" Only parts that fit ",
								bike ? `${bike.make} ${bike.model}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: sort,
							onChange: (e) => setSort(e.target.value),
							className: "ml-auto rounded-lg border border-border bg-card px-2 py-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "relevance",
									children: "Relevance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "low",
									children: "Price: low → high"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "high",
									children: "Price: high → low"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: [list.length, " results"]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-3xl border border-dashed border-border p-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: "No parts match"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Try turning off “Only parts that fit” or clearing filters."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			})
		]
	}) });
}
//#endregion
export { Shop as component };
