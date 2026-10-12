import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { I as MapPin, R as LayoutGrid, d as Store, et as Bike, f as Star, i as Wallet, j as Navigation, u as Timer, z as IndianRupee } from "../_libs/lucide-react.mjs";
import { S as inr } from "./bits-PIC53EAH.mjs";
import { a as StatusPill, i as Stat, n as Panel, t as DashboardShell } from "./DashboardShell-DbLNxBtd.mjs";
import { n as Bars, r as series } from "./Charts-Eozq3JuC.mjs";
import { t as LiveMap } from "./LiveMap-Df7tahlg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.rider-DKD39kZA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "jobs",
		label: "Jobs",
		Icon: LayoutGrid
	},
	{
		id: "active",
		label: "Active",
		Icon: Navigation
	},
	{
		id: "earnings",
		label: "Earnings",
		Icon: Wallet
	}
];
var STEPS = [
	"Heading to pickup",
	"Picked up",
	"On the way",
	"Delivered"
];
function RiderDash() {
	const [tab, setTab] = (0, import_react.useState)("jobs");
	const [online, setOnline] = (0, import_react.useState)(true);
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "Ravi Kumar",
		subtitle: "Delivery rider dashboard",
		sections,
		active: tab,
		onSelect: setTab,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOnline(!online),
			className: `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${online ? "bg-success" : "bg-muted-foreground"}` }), online ? "Online" : "Offline"]
		}),
		children: [
			tab === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Today's earnings",
							value: inr(1240),
							Icon: IndianRupee
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Deliveries",
							value: "9",
							Icon: Bike
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Online time",
							value: "6h 20m",
							Icon: Timer
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Rating",
							value: "4.9",
							Icon: Star
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: online ? "Nearby requests" : "You're offline",
					children: !online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Go online to receive delivery requests."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							{
								id: "RZ48213",
								pickups: ["VoltHub Indiranagar", "ChargeKart Koramangala"],
								drop: "MG Road",
								km: 9.4,
								pay: 168
							},
							{
								id: "RZ48221",
								pickups: ["Riderz Dealer Malleshwaram"],
								drop: "Rajajinagar",
								km: 4.1,
								pay: 92
							},
							{
								id: "RZ48225",
								pickups: [
									"EV Spares Jayanagar",
									"VoltHub Indiranagar",
									"Ampere Auto Hebbal"
								],
								drop: "Yelahanka",
								km: 21.8,
								pay: 342
							}
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col rounded-2xl border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: r.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl text-primary",
										children: inr(r.pay)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-1 text-sm",
									children: [r.pickups.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5 text-muted-foreground" }), p]
									}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), r.drop]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										r.pickups.length,
										" pickups · ",
										r.km,
										" km"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setActive({
											id: r.id,
											step: 0
										});
										setTab("active");
										toast.success("Delivery accepted — customer can now see your details");
									},
									className: "mt-4 rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground",
									children: "Accept"
								})
							]
						}, r.id))
					})
				})]
			}),
			tab === "active" && (active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
					stops: 2,
					className: "aspect-[4/3] lg:min-h-[480px]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: `Order ${active.id}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-3",
							children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-3 w-3 rounded-full ${i <= active.step ? "bg-primary" : "bg-muted"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: i <= active.step ? "font-semibold" : "text-muted-foreground",
									children: s
								})]
							}, s))
						}),
						active.step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActive({
								...active,
								step: active.step + 1
							}),
							className: "mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground",
							children: [
								"Mark “",
								STEPS[active.step + 1],
								"”"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: "Delivered" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+919900000000",
							className: "mt-2 block w-full rounded-xl border border-border py-3 text-center font-semibold",
							children: "Call customer"
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "No active delivery",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Accept a request from the Jobs tab."
				})
			})),
			tab === "earnings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "This week",
							value: inr(8420),
							delta: "+12%",
							Icon: Wallet
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Distance",
							value: "312 km",
							Icon: Navigation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Tips",
							value: inr(640),
							Icon: IndianRupee
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Daily earnings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: series([
						980,
						1320,
						1110,
						1540,
						1240,
						1690,
						540
					]) })
				})]
			})
		]
	});
}
//#endregion
export { RiderDash as component };
