import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ShieldCheck, g as Store, tn as Bike, u as TriangleAlert, un as ArrowRight, wt as Eye } from "../_libs/lucide-react.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, s as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardScreen-KouHtWV_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REVENUE_DATA_7D = [
	{
		date: "08 Apr",
		revenue: 54e4,
		orders: 182
	},
	{
		date: "09 Apr",
		revenue: 62e4,
		orders: 204
	},
	{
		date: "10 Apr",
		revenue: 59e4,
		orders: 195
	},
	{
		date: "11 Apr",
		revenue: 71e4,
		orders: 238
	},
	{
		date: "12 Apr",
		revenue: 84e4,
		orders: 280
	},
	{
		date: "13 Apr",
		revenue: 79e4,
		orders: 265
	},
	{
		date: "14 Apr",
		revenue: 734500,
		orders: 244
	}
];
var REVENUE_DATA_30D = [
	{
		date: "Week 1",
		revenue: 284e4,
		orders: 940
	},
	{
		date: "Week 2",
		revenue: 312e4,
		orders: 1040
	},
	{
		date: "Week 3",
		revenue: 389e4,
		orders: 1280
	},
	{
		date: "Week 4",
		revenue: 4824500,
		orders: 1428
	}
];
var CATEGORY_SHARE = [
	{
		name: "Electric Batteries",
		value: 42,
		color: "#E31E24"
	},
	{
		name: "Smart Chargers",
		value: 24,
		color: "#EA580C"
	},
	{
		name: "Brakes & Discs",
		value: 16,
		color: "#0284C7"
	},
	{
		name: "Bike Accessories",
		value: 12,
		color: "#7C3AED"
	},
	{
		name: "Riding Gear",
		value: 6,
		color: "#16A34A"
	}
];
var CITY_PERFORMANCE = [
	{
		city: "Bengaluru",
		orders: 620,
		revenue: 21.4,
		sla: "18m",
		color: "#E31E24"
	},
	{
		city: "Hyderabad",
		orders: 340,
		revenue: 11.8,
		sla: "26m",
		color: "#EA580C"
	},
	{
		city: "Chennai",
		orders: 240,
		revenue: 8.2,
		sla: "31m",
		color: "#0284C7"
	},
	{
		city: "Pune",
		orders: 180,
		revenue: 6.1,
		sla: "35m",
		color: "#7C3AED"
	},
	{
		city: "Mumbai",
		orders: 150,
		revenue: 5.2,
		sla: "38m",
		color: "#16A34A"
	}
];
function DashboardScreen() {
	const { orders, products, riders, bikes } = useAdminStore();
	const [selectedCity, setSelectedCity] = (0, import_react.useState)("Bengaluru");
	const [timeRange, setTimeRange] = (0, import_react.useState)("7d");
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [selectedBikeId, setSelectedBikeId] = (0, import_react.useState)(bikes[0]?.id || "ather-450x");
	const revenueData = timeRange === "7d" ? REVENUE_DATA_7D : REVENUE_DATA_30D;
	const recentOrders = (selectedCity === "All" ? orders : orders.filter((o) => o.customerCity.toLowerCase() === selectedCity.toLowerCase())).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#E31E24]/[0.05] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-amber-500/[0.04] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1 text-xs font-semibold text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative flex h-2 w-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative h-2 w-2 rounded-full bg-[#E31E24]" })]
										}), "128 riders delivering in Bengaluru now"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "100% Fitment Guaranteed"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#111111]",
									children: [
										"Power your fleet. ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-gradient-to-r from-[#E31E24] via-emerald-600 to-emerald-700 bg-clip-text text-transparent",
											children: "Parts that fit."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm sm:text-base text-[#6B7280] max-w-xl leading-relaxed",
									children: "Operations command center for EV batteries, smart chargers and verified replacement spares — matched to VIN, synchronized across sellers, delivered live."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2 max-w-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-1 items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: selectedBikeId,
												onChange: (e) => setSelectedBikeId(e.target.value),
												className: "w-full bg-transparent text-xs font-semibold text-[#111111] outline-none",
												children: bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: b.id,
													children: [
														b.brand,
														" ",
														b.model,
														" · ",
														b.voltage,
														"V Diagnostic"
													]
												}, b.id))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/fitment",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#E31E24] hover:bg-[#CC181E] px-4 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fitment Matrix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
											})
										})]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-[#6B7280] font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order #RZ48213" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-[#E31E24] font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" }), " Live"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 font-display text-2xl font-bold tracking-tight text-[#111111]",
										children: "Arriving in 18 min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 h-2 overflow-hidden rounded-full bg-gray-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-2/3 rounded-full bg-[#E31E24]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3.5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-9 w-9 place-items-center rounded-full bg-[#E31E24] font-bold text-white text-xs shadow-xs",
												children: "RK"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-[#111111]",
													children: "Ravi Kumar"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-[#6B7280]",
													children: "2 pickups · Ather Rizta · 92% Battery"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold",
											children: "On Route"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E31E24]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs font-bold text-[#E31E24]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fitment verified" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-300",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#6B7280] font-normal",
												children: "Chassis Validated"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-[#111111] mt-0.5 font-medium",
										children: ["VoltRide 60V 30Ah fits your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Ola S1 Pro 2023" })]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/products",
									className: "text-xs font-semibold text-[#E31E24] hover:underline",
									children: "View SKU →"
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5",
				children: [
					{
						label: "Total GMV (Apr)",
						value: "₹48.2L",
						trend: "+18.4%",
						positive: true
					},
					{
						label: "Orders Fulfilled",
						value: "1,428",
						trend: "+12.1%",
						positive: true
					},
					{
						label: "Active Riders",
						value: "142",
						trend: "118 on road",
						positive: true
					},
					{
						label: "Verified Sellers",
						value: "68",
						trend: "+4 this month",
						positive: true
					},
					{
						label: "Avg Delivery",
						value: "18m",
						trend: "-4m faster SLA",
						positive: true
					},
					{
						label: "Customer Rating",
						value: "4.82★",
						trend: "9.4k reviews",
						positive: true
					}
				].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:shadow-xs transition",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-bold tracking-tight text-[#E31E24] tabular-nums",
							children: stat.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-[#6B7280] font-medium",
							children: stat.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-700 font-semibold",
								children: stat.trend
							})
						})
					]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-[#111111]",
								children: "Revenue & Order Velocity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-red-50 text-[#E31E24] border border-red-200 px-2 py-0.5 text-[10px] font-bold",
								children: "₹ Lakhs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#6B7280] mt-0.5",
							children: "Gross merchandise value across verified spare vendors"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTimeRange("7d"),
								className: `px-3 py-1 rounded-lg text-xs font-semibold transition ${timeRange === "7d" ? "bg-[#E31E24] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111111]"}`,
								children: "7 Days"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTimeRange("30d"),
								className: `px-3 py-1 rounded-lg text-xs font-semibold transition ${timeRange === "30d" ? "bg-[#E31E24] text-white shadow-2xs" : "text-[#6B7280] hover:text-[#111111]"}`,
								children: "30 Days"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 w-full min-w-0 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 256,
							minWidth: 0,
							minHeight: 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: revenueData,
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "riderzproRedGradient",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "#E31E24",
											stopOpacity: .25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "#E31E24",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "#F3F4F6",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										stroke: "#9CA3AF",
										fontSize: 11,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#9CA3AF",
										fontSize: 11,
										tickLine: false,
										tickFormatter: (val) => `₹${val / 1e5}L`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const val = payload[0].value;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-red-200 bg-white p-3 shadow-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-gray-500",
													children: label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-bold text-[#E31E24] text-sm mt-0.5",
													children: ["₹", val.toLocaleString("en-IN")]
												})]
											});
										}
										return null;
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "revenue",
										stroke: "#E31E24",
										strokeWidth: 2.5,
										fillOpacity: 1,
										fill: "url(#riderzproRedGradient)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-gray-100 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-[#111111]",
								children: "Shop Departments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#6B7280] mt-0.5",
								children: "Category contribution to total dispatch volume"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-44 w-full min-w-0 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 176,
								minWidth: 0,
								minHeight: 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: CATEGORY_SHARE,
									cx: "50%",
									cy: "50%",
									innerRadius: 50,
									outerRadius: 70,
									paddingAngle: 4,
									dataKey: "value",
									children: CATEGORY_SHARE.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
										fill: entry.color,
										stroke: "#ffffff",
										strokeWidth: 2
									}, `cell-${index}`))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
									if (active && payload && payload.length) {
										const data = payload[0].payload;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-gray-200 bg-white p-2 shadow-md text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-[#111111]",
												children: data.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[#E31E24] font-semibold",
												children: [data.value, "% of orders"]
											})]
										});
									}
									return null;
								} })] })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 border-t border-gray-100 pt-3 text-xs",
							children: CATEGORY_SHARE.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2 w-2 rounded-full",
										style: { backgroundColor: cat.color }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563]",
										children: cat.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[#111111]",
									children: [cat.value, "%"]
								})]
							}, cat.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-gray-100 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-[#111111]",
							children: "Operational Hubs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#6B7280] mt-0.5",
							children: "5 metro corridors with express 3-hour doorstep delivery"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3 pt-1",
						children: CITY_PERFORMANCE.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setSelectedCity(city.city),
							className: `p-3 rounded-2xl border transition cursor-pointer ${selectedCity === city.city ? "border-[#E31E24] bg-red-50/40" : "border-gray-100 bg-gray-50/60 hover:border-gray-200"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#E31E24]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#111111]",
											children: city.city
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[#6B7280] font-normal",
											children: [
												"(",
												city.orders,
												" orders)"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#E31E24] font-bold",
									children: [
										"₹",
										city.revenue,
										"L"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between text-[11px] text-[#6B7280]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Avg Doorstep SLA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-emerald-700",
									children: [city.sla, " SLA"]
								})]
							})]
						}, city.city))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-gray-100 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-600 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-[#111111]",
								children: "Live Bengaluru EV Radar"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#6B7280] mt-0.5",
							children: "142 riders connected across Whitefield, Indiranagar, HSR, Koramangala & Bellandur"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/riders",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-100 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View All Fleet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-68 w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] overflow-hidden flex items-center justify-center select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 opacity-40",
								style: {
									backgroundImage: "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
									backgroundSize: "32px 32px"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-56 w-56 rounded-full border border-red-200/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-36 w-36 rounded-full border border-red-300/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-18 w-18 rounded-full border border-red-400/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 rounded-full bg-[#E31E24] text-white flex items-center justify-center shadow-md ring-4 ring-red-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-[#111111] shadow-2xs",
									children: "Indiranagar HQ Hub"
								})]
							}),
							riders.slice(0, 6).map((rider, i) => {
								const offsets = [
									{
										top: "25%",
										left: "28%"
									},
									{
										top: "68%",
										left: "72%"
									},
									{
										top: "35%",
										left: "75%"
									},
									{
										top: "72%",
										left: "25%"
									},
									{
										top: "22%",
										left: "64%"
									},
									{
										top: "54%",
										left: "20%"
									}
								];
								const pos = offsets[i % offsets.length];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute z-20 group cursor-pointer",
									style: {
										top: pos.top,
										left: pos.left
									},
									onClick: () => toast.info(`Rider: ${rider.name}`, { description: `Bike: ${rider.vehicle} · Battery: ${rider.batteryPct}% · Status: ${rider.status}` }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-transform hover:scale-125",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-[#111111] shadow-md z-30",
										children: [
											rider.name,
											" (",
											rider.batteryPct,
											"%)"
										]
									})]
								}, rider.id);
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-gray-100 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-[#111111]",
								children: "Live Orders Stream"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders",
							className: "text-xs font-semibold text-[#E31E24] hover:underline flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"View all ",
								orders.length,
								" orders"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-[#6B7280] font-semibold border-b border-gray-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Order #"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "City"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 text-right",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-gray-100",
								children: recentOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/80 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 font-mono font-bold text-[#111111]",
											children: order.orderNumber
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 font-semibold text-[#111111]",
											children: order.customerName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 text-[#6B7280]",
											children: order.customerCity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 font-bold text-[#111111] tabular-nums",
											children: ["₹", order.totalAmount.toLocaleString("en-IN")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
												status: order.status,
												size: "sm"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setSelectedOrder(order),
												className: "rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#E31E24] px-2.5 py-1 text-[11px] font-semibold text-[#111111] transition cursor-pointer inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect" })]
											})
										})
									]
								}, order.id))
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-gray-100 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-[#111111]",
								children: "Priority Actions"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold",
							children: "Action Required"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-red-200 bg-red-50/50 p-3.5 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between font-bold text-[#E31E24]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), "Low Inventory Warning"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px]",
										children: "8 SKUs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B7280] text-[11px] leading-relaxed",
									children: "VoltRide 60V NMC battery packs are below the safe buffer threshold in Bengaluru."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/products",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "w-full mt-1 rounded-xl bg-[#E31E24] hover:bg-[#CC181E] text-white font-semibold py-1.5 text-[11px] transition cursor-pointer",
										children: "Initiate Restock →"
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between font-bold text-amber-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }), "Seller KYC Verification"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px]",
										children: "2 Pending"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B7280] text-[11px] leading-relaxed",
									children: "Telangana Smart Telematics & NeoRide EV spares await verification."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/sellers",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "w-full mt-1 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-semibold py-1.5 text-[11px] transition cursor-pointer",
										children: "Review Seller Applications →"
									})
								})
							]
						})]
					})]
				})]
			}),
			selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedOrder),
				onClose: () => setSelectedOrder(null),
				title: `Order #${selectedOrder.orderNumber}`,
				description: `Customer: ${selectedOrder.customerName} · ${selectedOrder.customerCity}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-bold text-[#6B7280]",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-[#111111]",
								children: selectedOrder.status
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: selectedOrder.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-gray-100 bg-white p-4 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-[#111111]",
									children: "Delivery Address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#4B5563]",
									children: selectedOrder.shippingAddress
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280]",
									children: ["Phone: ", selectedOrder.customerPhone]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-gray-100 bg-white p-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-[#111111]",
								children: "Line Items"
							}), selectedOrder.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-1 border-b border-gray-100 last:border-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-[#111111]",
									children: item.productName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-[#6B7280]",
									children: ["Qty: ", item.quantity]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-[#111111]",
									children: ["₹", item.unitPrice.toLocaleString("en-IN")]
								})]
							}, i))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-red-100 bg-red-50/50 p-4 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-[#111111]",
								children: "Total Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-extrabold text-[#E31E24] text-base",
								children: ["₹", selectedOrder.totalAmount.toLocaleString("en-IN")]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { DashboardScreen };
