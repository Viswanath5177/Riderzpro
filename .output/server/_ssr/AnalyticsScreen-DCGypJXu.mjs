import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, r as LineChart, s as Line } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnalyticsScreen-DCGypJXu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChartCard({ title, subtitle, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-3xl border border-[#E5E7EB] bg-white p-6 flex flex-col justify-between shadow-xs", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-bold text-[#111111] tracking-tight",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#4B5563] font-medium mt-0.5",
				children: subtitle
			})] }), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: action })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 w-full min-h-[220px] min-w-0 overflow-hidden",
			children
		})]
	});
}
/**
* Custom glass tooltip for Recharts components
*/
function GlassTooltip({ active, payload, label, prefix = "", suffix = "" }) {
	if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl text-xs text-[#111111]",
		children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-[#6B7280] border-b border-[#F3F4F6] pb-1 mb-1.5",
			children: label
		}), payload.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 py-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-2 rounded-full",
					style: { backgroundColor: entry.color }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[#4B5563] capitalize font-medium",
					children: [entry.name, ":"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold tabular-nums text-[#111111]",
					children: [
						prefix,
						typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value,
						suffix
					]
				})
			]
		}, `item-${index}`))]
	});
	return null;
}
var SLA_TREND = [
	{
		time: "09:00",
		avgMinutes: 32,
		deliveries: 45
	},
	{
		time: "11:00",
		avgMinutes: 36,
		deliveries: 88
	},
	{
		time: "13:00",
		avgMinutes: 44,
		deliveries: 120
	},
	{
		time: "15:00",
		avgMinutes: 39,
		deliveries: 95
	},
	{
		time: "17:00",
		avgMinutes: 48,
		deliveries: 140
	},
	{
		time: "19:00",
		avgMinutes: 41,
		deliveries: 165
	},
	{
		time: "21:00",
		avgMinutes: 35,
		deliveries: 80
	}
];
var COHORT_DATA = [
	{
		cohort: "Jan 2026",
		m0: 100,
		m1: 72,
		m2: 58,
		m3: 49
	},
	{
		cohort: "Feb 2026",
		m0: 100,
		m1: 76,
		m2: 63,
		m3: 55
	},
	{
		cohort: "Mar 2026",
		m0: 100,
		m1: 81,
		m2: 69,
		m3: 0
	},
	{
		cohort: "Apr 2026",
		m0: 100,
		m1: 85,
		m2: 0,
		m3: 0
	}
];
function AnalyticsScreen() {
	const [range, setRange] = (0, import_react.useState)("30d");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Analytics, Retention Cohorts & Delivery SLA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Operational speed telemetry, customer lifetime cohorts and regional fulfillment benchmarks."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1 text-xs",
					children: [
						"7d",
						"30d",
						"90d"
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setRange(r),
						className: `rounded-xl px-3 py-1 font-bold transition cursor-pointer ${range === r ? "bg-[#E31E24] text-white shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"}`,
						children: r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "Last 90 Days"
					}, r))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "On-Time Delivery SLA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums",
								children: "96.8%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "Under 45 minutes doorstep guarantee"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Repeat Purchase Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-[#E31E24] mt-1 tabular-nums",
								children: "48.2%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "EV owners ordering additional spares in 60d"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Average Order Value (AOV)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-extrabold text-sky-700 mt-1 tabular-nums",
								children: "₹3,380"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] font-medium mt-1",
								children: "+14.2% driven by battery chargers"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Delivery SLA & Rush-Hour Peak Times",
				subtitle: "Average minutes per dispatch vs delivery volume throughout the day",
				className: "min-w-0 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full min-w-0 overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 256,
						minWidth: 0,
						minHeight: 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: SLA_TREND,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "time",
									stroke: "#6B7280",
									fontSize: 11
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#6B7280",
									fontSize: 11,
									unit: "m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassTooltip, { suffix: " mins" }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "avgMinutes",
									name: "Avg Time",
									stroke: "#E31E24",
									strokeWidth: 3,
									dot: {
										r: 4,
										fill: "#E31E24"
									}
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-[#111111]",
						children: "Monthly Customer Retention Cohort Heatmap (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#4B5563] font-medium mt-0.5",
						children: "Percentage of customers returning to purchase parts or book garage services."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full",
						children: "Industry Benchmark: Top 5%"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-[#6B7280] uppercase font-bold border-b border-[#E5E7EB] bg-gray-50/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Cohort Month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Month 0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Month 1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Month 2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Month 3"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#F3F4F6] font-mono",
							children: COHORT_DATA.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 font-bold text-[#111111] font-sans",
									children: row.cohort
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 font-bold",
										children: "100%"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 font-bold",
										children: [row.m1, "%"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: row.m2 > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 font-bold",
										children: [row.m2, "%"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-400",
										children: "-"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: row.m3 > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 font-bold",
										children: [row.m3, "%"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-400",
										children: "-"
									})
								})
							] }, row.cohort))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { AnalyticsScreen };
