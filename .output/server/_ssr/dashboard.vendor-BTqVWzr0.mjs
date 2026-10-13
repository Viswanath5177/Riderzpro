import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { $ as Boxes, R as LayoutGrid, Z as Check, c as TriangleAlert, f as Star, i as Wallet, k as PackageOpen, n as X, v as ShoppingBag, z as IndianRupee } from "../_libs/lucide-react.mjs";
import { S as inr, d as bikes, w as products } from "./bits-PIC53EAH.mjs";
import { a as StatusPill, i as Stat, n as Panel, t as DashboardShell } from "./DashboardShell-DbLNxBtd.mjs";
import { n as Bars, r as series, t as AreaTrend } from "./Charts-Eozq3JuC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.vendor-BTqVWzr0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "overview",
		label: "Overview",
		Icon: LayoutGrid
	},
	{
		id: "orders",
		label: "Orders",
		Icon: ShoppingBag
	},
	{
		id: "inventory",
		label: "Inventory",
		Icon: Boxes
	},
	{
		id: "payouts",
		label: "Payouts",
		Icon: Wallet
	}
];
var mine = products.filter((p) => p.offers.some((o) => o.vendorId === "v1"));
function VendorDash() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [incoming, setIncoming] = (0, import_react.useState)([
		{
			id: "RZ48213",
			item: "VoltRide 60V 30Ah Li-ion Pack",
			qty: 1,
			amount: 59520,
			bike: "Ola S1 Pro 2023",
			status: "New"
		},
		{
			id: "RZ48207",
			item: "ChargeMax 3.3kW Fast Charger",
			qty: 2,
			amount: 27840,
			bike: "Bajaj Chetak 2022",
			status: "New"
		},
		{
			id: "RZ48199",
			item: "VoltEdge 48V 50Ah LiFePO4",
			qty: 1,
			amount: 51840,
			bike: "Ather 450X 2024",
			status: "Accepted"
		},
		{
			id: "RZ48188",
			item: "Wave Disc Brake Rotor",
			qty: 4,
			amount: 9200,
			bike: "Workshop order",
			status: "Delivered"
		}
	]);
	const act = (id, status) => {
		setIncoming((l) => l.map((o) => o.id === id ? {
			...o,
			status
		} : o));
		toast.success(`Order ${id} ${status.toLowerCase()}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "VoltHub Indiranagar",
		subtitle: "Vendor & dealership dashboard",
		sections,
		active: tab,
		onSelect: setTab,
		children: [
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Revenue (7d)",
								value: inr(412e3),
								delta: "+18%",
								Icon: IndianRupee
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Orders (7d)",
								value: "46",
								delta: "+9",
								Icon: ShoppingBag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Rating",
								value: "4.8",
								Icon: Star
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Low stock items",
								value: "3",
								Icon: TriangleAlert
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Revenue this week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTrend, { data: series([
								42,
								58,
								49,
								71,
								66,
								88,
								38
							].map((x) => x * 1e3)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "New orders",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderList, {
								list: incoming.filter((o) => o.status === "New"),
								act
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Top sellers by units",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: mine.slice(0, 6).map((p, i) => ({
							name: p.brand,
							value: [
								34,
								28,
								21,
								17,
								12,
								9
							][i]
						})) })
					})
				]
			}),
			tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "All orders",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderList, {
					list: incoming,
					act
				})
			}),
			tab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Inventory & fitment",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => toast("Add product form coming soon"),
					className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
					children: "+ Product"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Price" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Stock" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fits" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: mine.map((p) => {
								const o = p.offers.find((x) => x.vendorId === "v1");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "flex items-center gap-3 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											alt: "",
											loading: "lazy",
											width: 40,
											height: 40,
											className: "h-10 w-10 rounded-lg object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: p.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: inr(o.price) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: o.stock < 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: `Low · ${o.stock}` }) : o.stock }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-xs text-muted-foreground",
										children: p.fits.map((f) => bikes.find((b) => b.id === f)?.model).join(", ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast("Edit product"),
										className: "text-primary",
										children: "Edit"
									}) })
								] }, p.id);
							})
						})]
					})
				})
			}),
			tab === "payouts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Available balance",
						value: inr(186400),
						Icon: Wallet
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Next payout",
						value: "Oct 12",
						Icon: PackageOpen
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Paid this month",
						value: inr(624e3),
						Icon: IndianRupee
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Payout history",
						className: "lg:col-span-3",
						children: [
							"Oct 05",
							"Sep 28",
							"Sep 21"
						].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border py-3 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: inr([
										212e3,
										198500,
										176300
									][i])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: "Paid" })
							]
						}, d))
					})
				]
			})
		]
	});
}
function OrderList({ list, act }) {
	if (!list.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No orders here 🎉"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: list.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: o.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: o.status })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						o.qty,
						" × ",
						o.item
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"For ",
						o.bike,
						" · ",
						inr(o.amount)
					]
				}),
				o.status === "New" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => act(o.id, "Accepted"),
						className: "flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Accept"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => act(o.id, "Rejected"),
						className: "flex flex-1 items-center justify-center gap-1 rounded-xl border border-border py-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Reject"]
					})]
				})
			]
		}, o.id))
	});
}
//#endregion
export { VendorDash as component };
