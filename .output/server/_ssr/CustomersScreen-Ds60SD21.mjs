import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, K as Package, an as Ban, et as MapPin, gt as Headphones, tn as Bike } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-Dvo5t1xh.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CustomersScreen-Ds60SD21.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersScreen() {
	const { customers, bikes, orders, tickets, toggleCustomerBlock } = useAdminStore();
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [showBlockDialog, setShowBlockDialog] = (0, import_react.useState)(false);
	const filterTabs = [
		{
			label: "All Customers",
			value: "ALL",
			count: customers.length
		},
		{
			label: "VIP Riders",
			value: "VIP",
			count: customers.filter((c) => c.status === "VIP").length
		},
		{
			label: "Active",
			value: "Active",
			count: customers.filter((c) => c.status === "Active").length
		},
		{
			label: "Blocked",
			value: "Blocked",
			count: customers.filter((c) => c.status === "Blocked").length
		}
	];
	const columns = [
		{
			key: "name",
			header: "Customer",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs",
					children: c.name.slice(0, 2).toUpperCase()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[#111111] text-sm",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#4B5563] font-medium",
					children: c.email
				})] })]
			})
		},
		{
			key: "phone",
			header: "Phone",
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[#111111] font-semibold text-xs",
				children: c.phone
			})
		},
		{
			key: "city",
			header: "City",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#111111] font-bold text-xs",
				children: c.city
			})
		},
		{
			key: "garageBikes",
			header: "Garage EVs",
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold text-[#111111] text-xs",
					children: [c.garageBikes.length, " registered"]
				})]
			})
		},
		{
			key: "totalSpend",
			header: "Total Spend",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: ["₹", c.totalSpend.toLocaleString("en-IN")]
			})
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: c.status,
				size: "sm"
			})
		}
	];
	const customerOrders = selectedCustomer ? orders.filter((o) => o.customerId === selectedCustomer.id) : [];
	const customerTickets = selectedCustomer ? tickets.filter((t) => t.customerId === selectedCustomer.id) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Customer Directory & EV Garages"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Manage registered EV owners, VIN vehicle telemetry, order histories and account statuses."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: customers,
				columns,
				searchPlaceholder: "Search customer by name, email, phone or city...",
				searchKey: (c) => `${c.name} ${c.email} ${c.phone} ${c.city}`,
				filterTabs,
				currentFilter: statusFilter,
				onFilterChange: setStatusFilter,
				filterPredicate: (c, filter) => c.status === filter,
				onRowClick: (cust) => setSelectedCustomer(cust),
				keyExtractor: (c) => c.id,
				exportFileName: "riderzpro_customers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedCustomer),
				onClose: () => setSelectedCustomer(null),
				width: "lg",
				title: selectedCustomer?.name,
				description: selectedCustomer ? `Member since ${selectedCustomer.registeredDate} · ${selectedCustomer.city}` : void 0,
				children: selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-display font-extrabold text-white text-base shadow-xs",
									children: selectedCustomer.name.slice(0, 2).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111] text-base",
											children: selectedCustomer.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
											status: selectedCustomer.status,
											size: "sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#4B5563] font-mono mt-0.5 font-medium",
										children: selectedCustomer.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#6B7280] font-medium",
										children: selectedCustomer.email
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: selectedCustomer.status === "Blocked" ? "primary" : "destructive",
								size: "sm",
								onClick: () => setShowBlockDialog(true),
								children: selectedCustomer.status === "Blocked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unblock Account" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Block Account" })] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] font-bold uppercase text-[#6B7280] mb-1 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Primary Delivery Address" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#111111] leading-relaxed font-semibold text-sm",
									children: selectedCustomer.address
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#4B5563] font-medium mt-1",
									children: [
										"Pincode: ",
										selectedCustomer.pincode,
										" · City: ",
										selectedCustomer.city
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Registered Garage EVs (",
									selectedCustomer.garageBikes.length,
									")"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: selectedCustomer.garageBikes.map((bikeId) => {
									const bike = bikes.find((b) => b.id === bikeId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-xl bg-gray-50/80 p-3 border border-[#E5E7EB]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111] text-sm",
											children: bike?.model || "Electric Vehicle"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-[#4B5563] font-medium",
											children: [
												bike?.brand,
												" · ",
												bike?.voltage,
												"V · Connector: ",
												bike?.connectorType
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5",
											children: "VIN Verified"
										})]
									}, bikeId);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Order History (",
									customerOrders.length,
									")"
								] })]
							}), customerOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B7280] py-2 font-medium",
								children: "No active orders found."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-[#F3F4F6]",
								children: customerOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-2.5 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-bold text-[#111111] text-xs",
										children: o.orderNumber
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#4B5563] font-medium",
										children: o.items[0]?.productName || "Parts"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-[#111111] text-xs",
											children: ["₹", o.totalAmount.toLocaleString("en-IN")]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
												status: o.status,
												size: "sm"
											})
										})]
									})]
								}, o.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Support Inquiries (",
									customerTickets.length,
									")"
								] })]
							}), customerTickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B7280] py-2 font-medium",
								children: "No open support tickets."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: customerTickets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-gray-50/80 p-3 border border-[#E5E7EB]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-[#111111] text-xs",
											children: t.ticketNumber
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
											status: t.status,
											size: "sm"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[#111111] font-semibold text-xs",
										children: t.subject
									})]
								}, t.id))
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				isOpen: showBlockDialog,
				onClose: () => setShowBlockDialog(false),
				onConfirm: () => {
					if (selectedCustomer) {
						toggleCustomerBlock(selectedCustomer.id);
						setSelectedCustomer({
							...selectedCustomer,
							status: selectedCustomer.status === "Blocked" ? "Active" : "Blocked"
						});
					}
				},
				title: selectedCustomer?.status === "Blocked" ? "Unblock Account?" : "Block Customer Account?",
				description: selectedCustomer?.status === "Blocked" ? "This will restore full ordering and garage access for this user." : "This user will not be able to place new orders or use doorstep fleet services.",
				confirmLabel: selectedCustomer?.status === "Blocked" ? "Unblock Account" : "Block Customer"
			})
		]
	});
}
//#endregion
export { CustomersScreen };
