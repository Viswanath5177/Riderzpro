import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ct as FileCheck, Ft as CircleCheck, _ as Star, et as MapPin, rn as Battery, tn as Bike } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RidersScreen-CqW_fggI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RidersScreen() {
	const { riders, toggleRiderStatus } = useAdminStore();
	const [selectedRider, setSelectedRider] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [activeMapView, setActiveMapView] = (0, import_react.useState)(false);
	const filterTabs = [
		{
			label: "All Fleet",
			value: "ALL",
			count: riders.length
		},
		{
			label: "Delivering",
			value: "Delivering",
			count: riders.filter((r) => r.status === "Delivering").length
		},
		{
			label: "Online (Idle)",
			value: "Online",
			count: riders.filter((r) => r.status === "Online").length
		},
		{
			label: "Offline",
			value: "Offline",
			count: riders.filter((r) => r.status === "Offline").length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Delivery Fleet Operations & Live GPS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Real-time electric two-wheeler courier telemetry, battery monitoring and doorstep dispatch assignments."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					variant: activeMapView ? "primary" : "secondary",
					size: "sm",
					onClick: () => setActiveMapView(!activeMapView),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeMapView ? "Hide Live Radar" : "Show Bengaluru Radar" })]
				})]
			}),
			activeMapView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-[#111111]",
							children: "Live Bengaluru GPS Coordinates Radar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-[#6B7280] font-mono font-bold",
						children: "142 connected nodes"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-64 w-full rounded-2xl bg-gray-900 border border-gray-700 overflow-hidden flex items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-52 w-52 rounded-full border border-red-500/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-32 w-32 rounded-full border border-red-500/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-14 w-14 rounded-full border border-red-500/50" }),
						riders.map((r, i) => {
							const offsets = [
								{
									top: "18%",
									left: "22%"
								},
								{
									top: "28%",
									left: "55%"
								},
								{
									top: "68%",
									left: "30%"
								},
								{
									top: "75%",
									left: "68%"
								},
								{
									top: "45%",
									left: "80%"
								},
								{
									top: "52%",
									left: "15%"
								},
								{
									top: "82%",
									left: "45%"
								},
								{
									top: "35%",
									left: "38%"
								}
							];
							const pos = offsets[i % offsets.length];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setSelectedRider(r),
								className: "absolute cursor-pointer group",
								style: {
									top: pos.top,
									left: pos.left
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-5 w-5 items-center justify-center rounded-full bg-[#E31E24] text-white shadow-md animate-pulse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3 w-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden group-hover:inline-block absolute left-6 -top-2 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-bold text-[#111111] shadow-lg whitespace-nowrap z-20",
									children: [
										r.name,
										" · ",
										r.batteryPct,
										"% SoC"
									]
								})]
							}, r.id);
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: riders,
				columns: [
					{
						key: "name",
						header: "Rider",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs",
								children: r.name.slice(0, 2).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111] text-sm",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] font-medium",
								children: r.phone
							})] })]
						})
					},
					{
						key: "zone",
						header: "Assigned Zone",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] text-xs",
							children: r.zone
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-[#6B7280] font-medium",
							children: r.city
						})] })
					},
					{
						key: "vehicle",
						header: "Registered EV",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#111111] text-xs font-semibold",
								children: r.vehicle
							})]
						})
					},
					{
						key: "batteryPct",
						header: "Battery SoC",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-bold tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: `h-4 w-4 ${r.batteryPct > 50 ? "text-emerald-600" : "text-amber-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: r.batteryPct > 50 ? "text-emerald-700" : "text-amber-700",
								children: [r.batteryPct, "%"]
							})]
						})
					},
					{
						key: "todayEarnings",
						header: "Today Earnings",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-[#111111] tabular-nums text-xs",
							children: ["₹", r.todayEarnings.toLocaleString("en-IN")]
						})
					},
					{
						key: "rating",
						header: "Rating",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-[#B45309] flex items-center gap-0.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.rating })]
						})
					},
					{
						key: "status",
						header: "Status",
						sortable: true,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: r.status,
							size: "sm"
						})
					}
				],
				searchPlaceholder: "Search rider name, phone, zone or vehicle...",
				searchKey: (r) => `${r.name} ${r.phone} ${r.zone} ${r.vehicle} ${r.city}`,
				filterTabs,
				currentFilter: statusFilter,
				onFilterChange: setStatusFilter,
				filterPredicate: (r, filter) => r.status === filter,
				onRowClick: (rider) => setSelectedRider(rider),
				keyExtractor: (r) => r.id,
				exportFileName: "riderzpro_riders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedRider),
				onClose: () => setSelectedRider(null),
				width: "lg",
				title: selectedRider?.name,
				description: selectedRider ? `Assigned to ${selectedRider.zone} · ${selectedRider.city}` : void 0,
				children: selectedRider && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-base text-[#111111]",
									children: selectedRider.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#4B5563] font-mono mt-0.5 font-medium",
									children: selectedRider.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B7280] font-medium",
									children: selectedRider.vehicle
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: selectedRider.status,
									size: "md"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
									variant: selectedRider.status === "Offline" ? "primary" : "destructive",
									size: "sm",
									onClick: () => {
										const nextStatus = selectedRider.status === "Offline" ? "Online" : "Offline";
										toggleRiderStatus(selectedRider.id, nextStatus);
										setSelectedRider({
											...selectedRider,
											status: nextStatus
										});
									},
									children: selectedRider.status === "Offline" ? "Set Active" : "Suspend Shift"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "Today Payout"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-emerald-700 mt-1",
										children: ["₹", selectedRider.todayEarnings.toLocaleString("en-IN")]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "Deliveries"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-[#111111] mt-1",
										children: [selectedRider.completedDeliveries, " Trips"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "EV Battery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-[#B45309] mt-1",
										children: [selectedRider.batteryPct, "%"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Compliance Documents" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Driving Licence (Commercial):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), " Verified"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "EV Vehicle Registration Certificate (RC):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), " Verified"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Police Background Verification:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), " Passed"]
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { RidersScreen };
