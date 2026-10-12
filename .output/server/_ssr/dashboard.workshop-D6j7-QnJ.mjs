import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { E as Plus, R as LayoutGrid, T as Repeat, _ as ShoppingCart, a as Users, i as Wallet, q as ClipboardList, r as Wrench } from "../_libs/lucide-react.mjs";
import { D as useStore, S as inr, u as bestOffer, w as products, y as getBike } from "./bits-PIC53EAH.mjs";
import { a as StatusPill, i as Stat, n as Panel, t as DashboardShell } from "./DashboardShell-DbLNxBtd.mjs";
import { n as Bars, r as series } from "./Charts-Eozq3JuC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.workshop-D6j7-QnJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "overview",
		label: "Overview",
		Icon: LayoutGrid
	},
	{
		id: "jobs",
		label: "Job cards",
		Icon: ClipboardList
	},
	{
		id: "bulk",
		label: "Bulk order",
		Icon: ShoppingCart
	},
	{
		id: "reorder",
		label: "Reorder",
		Icon: Repeat
	}
];
var jobs = [
	{
		id: "JC-1042",
		customer: "Priya S.",
		bike: "ather-450x",
		issue: "Battery range dropped to 40 km",
		status: "Waiting parts",
		parts: ["p2"]
	},
	{
		id: "JC-1043",
		customer: "Rahul M.",
		bike: "revolt-rv400",
		issue: "Controller fault, no throttle",
		status: "In progress",
		parts: ["p11"]
	},
	{
		id: "JC-1044",
		customer: "Deepa K.",
		bike: "ola-s1pro",
		issue: "Charger not charging",
		status: "New",
		parts: ["p7"]
	},
	{
		id: "JC-1039",
		customer: "Arjun P.",
		bike: "bajaj-chetak",
		issue: "Brake rotor replacement",
		status: "Done",
		parts: ["p12"]
	}
];
function WorkshopDash() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const { addToCart } = useStore();
	const [qty, setQty] = (0, import_react.useState)({});
	const addParts = (ids) => {
		ids.forEach((id) => {
			const p = products.find((x) => x.id === id);
			addToCart(id, bestOffer(p).vendorId);
		});
		toast.success("Parts added to cart");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "Manjunath Auto Works",
		subtitle: "Workshop & mechanic dashboard",
		sections,
		active: tab,
		onSelect: setTab,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => toast("New job card created"),
			className: "hidden items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Job card"]
		}),
		children: [
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Open jobs",
							value: "7",
							delta: "+2 today",
							Icon: Wrench
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Customers this month",
							value: "64",
							Icon: Users
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Parts spend (Oct)",
							value: inr(284e3),
							Icon: Wallet
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Avg. turnaround",
							value: "1.4d",
							delta: "-0.3d",
							Icon: ClipboardList
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Parts spend this week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: series([
							32,
							18,
							44,
							27,
							51,
							39,
							12
						].map((x) => x * 1e3)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Today's jobs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobList, { onParts: addParts })
					})]
				})]
			}),
			tab === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "All job cards",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobList, { onParts: addParts })
			}),
			tab === "bulk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Bulk order",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						Object.entries(qty).forEach(([id, q]) => q > 0 && addToCart(id, bestOffer(products.find((p) => p.id === id)).vendorId, q));
						toast.success("Bulk order added to cart");
						setQty({});
					},
					className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
					children: "Add all to cart"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: "",
								loading: "lazy",
								width: 48,
								height: 48,
								className: "h-12 w-12 rounded-lg object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold leading-tight",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Best ",
										inr(bestOffer(p).price),
										" · ",
										p.offers.length,
										" sellers"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: qty[p.id] ?? 0,
								onChange: (e) => setQty({
									...qty,
									[p.id]: +e.target.value
								}),
								className: "h-10 w-20 rounded-lg border border-border bg-background px-2 text-center"
							})
						]
					}, p.id))
				})
			}),
			tab === "reorder" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: products.slice(6, 12).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: "",
							loading: "lazy",
							width: 64,
							height: 64,
							className: "h-16 w-16 rounded-xl object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold leading-tight",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Ordered 6× this year"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => addParts([p.id]),
							className: "rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground",
							children: "Reorder"
						})
					]
				}, p.id))
			})
		]
	});
}
function JobList({ onParts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: jobs.map((j) => {
			const b = getBike(j.bike);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 rounded-2xl border border-border p-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: j.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: j.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								j.customer,
								" · ",
								b.make,
								" ",
								b.model
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: j.issue
						})
					]
				}), j.status !== "Done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onParts(j.parts),
					className: "rounded-xl border border-primary px-3 py-2 text-sm font-semibold text-primary",
					children: "Order parts"
				})]
			}, j.id);
		})
	});
}
//#endregion
export { WorkshopDash as component };
