import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as Map, R as LayoutGrid, Z as Check, a as Users, b as ShieldAlert, d as Store, it as BadgeCheck, n as X, s as Truck, x as Settings, z as IndianRupee } from "../_libs/lucide-react.mjs";
import { O as vendors, S as inr } from "./bits-PIC53EAH.mjs";
import { a as StatusPill, i as Stat, n as Panel, t as DashboardShell } from "./DashboardShell-DbLNxBtd.mjs";
import { n as Bars, r as series, t as AreaTrend } from "./Charts-Eozq3JuC.mjs";
import { t as LiveMap } from "./LiveMap-Df7tahlg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.admin-DVI6Gnr0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "overview",
		label: "Overview",
		Icon: LayoutGrid
	},
	{
		id: "approvals",
		label: "Approvals",
		Icon: BadgeCheck
	},
	{
		id: "live",
		label: "Live map",
		Icon: Map
	},
	{
		id: "disputes",
		label: "Disputes",
		Icon: ShieldAlert
	},
	{
		id: "settings",
		label: "Settings",
		Icon: Settings
	}
];
function AdminDash() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [queue, setQueue] = (0, import_react.useState)([
		{
			id: "a1",
			type: "Vendor",
			name: "PowerCell Electronics, HSR",
			status: "Pending"
		},
		{
			id: "a2",
			type: "Fitment",
			name: "VoltRide 60V 30Ah → Hero Vida V1",
			status: "Review"
		},
		{
			id: "a3",
			type: "Rider",
			name: "Imran Pasha · KA05 EV 7781",
			status: "Pending"
		},
		{
			id: "a4",
			type: "Fitment",
			name: "Titan 72V 60Ah → Revolt RV400",
			status: "Review"
		}
	]);
	const [base, setBase] = (0, import_react.useState)(40);
	const [perKm, setPerKm] = (0, import_react.useState)(12);
	const decide = (id, s) => {
		setQueue((q) => q.map((x) => x.id === id ? {
			...x,
			status: s
		} : x));
		toast.success(s);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "Control center",
		subtitle: "Admin dashboard",
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
								label: "GMV (7d)",
								value: inr(482e4),
								delta: "+22%",
								Icon: IndianRupee
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Active users",
								value: "12.4k",
								delta: "+640",
								Icon: Users
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Vendors",
								value: String(vendors.length + 42),
								Icon: Store
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Riders online",
								value: "128",
								Icon: Truck
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Orders per day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTrend, { data: series([
								310,
								420,
								380,
								510,
								470,
								620,
								290
							]) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Avg delivery time (min)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: series([
								41,
								38,
								36,
								39,
								35,
								33,
								37
							]) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Approval queue",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Queue, {
							queue,
							decide
						})
					})
				]
			}),
			tab === "approvals" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Approvals & fitment review",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Queue, {
					queue,
					decide
				})
			}),
			tab === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
					stops: 3,
					className: "aspect-[4/3] lg:min-h-[520px]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Live orders",
					children: [
						"RZ48213",
						"RZ48221",
						"RZ48225",
						"RZ48230"
					].map((id, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-b border-border py-3 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: [
							"On the way",
							"Picked up",
							"Rider assigned",
							"Placed"
						][i] })]
					}, id))
				})]
			}),
			tab === "disputes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Open disputes",
				children: [
					[
						"RZ48102",
						"Wrong battery delivered",
						"Dispute"
					],
					[
						"RZ48077",
						"Late delivery refund",
						"Review"
					],
					[
						"RZ48050",
						"Damaged charger",
						"Resolved — refunded"
					]
				].map(([id, t, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border py-3 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s })]
				}, id))
			}),
			tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Delivery pricing",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Fee per vendor = base + per-km × distance from vendor to customer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid max-w-md gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Base fee (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: base,
								onChange: (e) => setBase(+e.target.value),
								className: "mt-1 h-11 w-full rounded-xl border border-border bg-background px-3"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Per km (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: perKm,
								onChange: (e) => setPerKm(+e.target.value),
								className: "mt-1 h-11 w-full rounded-xl border border-border bg-background px-3"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: ["Example 8 km delivery: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: inr(base + perKm * 8) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => toast.success("Pricing saved"),
						className: "mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground",
						children: "Save"
					})
				]
			})
		]
	});
}
function Queue({ queue, decide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: queue.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 rounded-2xl border border-border p-3 sm:flex-row sm:items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-20 text-xs font-bold uppercase tracking-wider text-primary",
					children: q.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex-1 font-medium",
					children: q.name
				}),
				q.status === "Pending" || q.status === "Review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => decide(q.id, "Approved"),
						className: "flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), "Approve"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => decide(q.id, "Rejected"),
						className: "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), "Reject"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: q.status })
			]
		}, q.id))
	});
}
//#endregion
export { AdminDash as component };
