import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, Et as CircleX, Kt as Bike, Ot as CircleCheck, Tt as Circle, a as User, j as RotateCcw, wt as Clock } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-CQjqc3RE.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-Dvo5t1xh.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OrdersScreen-Dr58rGQ4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Timeline({ steps, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-4", className),
		children: steps.map((step, idx) => {
			const isLast = idx === steps.length - 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex gap-3.5",
				children: [
					!isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("absolute left-4 top-8 -bottom-3 w-0.5", step.status === "complete" ? "bg-emerald-300" : "bg-gray-200"),
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
						children: [
							step.status === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
							}),
							step.status === "current" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-[#E31E24] border border-red-300 animate-pulse",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
							}),
							step.status === "upcoming" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#9CA3AF] border border-[#E5E7EB]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3 w-3" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-xs font-bold tracking-tight", step.status === "complete" && "text-[#111111]", step.status === "current" && "text-[#E31E24]", step.status === "upcoming" && "text-[#6B7280]"),
								children: step.title
							}), step.time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#6B7280] font-semibold tabular-nums",
								children: step.time
							})]
						}), step.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-[#4B5563] font-medium leading-relaxed",
							children: step.description
						})]
					})
				]
			}, step.title);
		})
	});
}
function OrdersScreen() {
	const { orders, riders, updateOrderStatus, cancelOrder, refundOrder, reassignRider } = useAdminStore();
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [showCancelDialog, setShowCancelDialog] = (0, import_react.useState)(false);
	const [showRefundDialog, setShowRefundDialog] = (0, import_react.useState)(false);
	const [newRiderId, setNewRiderId] = (0, import_react.useState)("");
	const filterTabs = [
		{
			label: "All Orders",
			value: "ALL",
			count: orders.length
		},
		{
			label: "Placed",
			value: "Placed",
			count: orders.filter((o) => o.status === "Placed").length
		},
		{
			label: "Processing",
			value: "Processing",
			count: orders.filter((o) => o.status === "Processing").length
		},
		{
			label: "In Transit",
			value: "In Transit",
			count: orders.filter((o) => o.status === "In Transit").length
		},
		{
			label: "Delivered",
			value: "Delivered",
			count: orders.filter((o) => o.status === "Delivered").length
		},
		{
			label: "Cancelled",
			value: "Cancelled",
			count: orders.filter((o) => o.status === "Cancelled").length
		}
	];
	const columns = [
		{
			key: "orderNumber",
			header: "Order ID",
			sortable: true,
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono font-bold text-[#111111] text-xs",
				children: o.orderNumber
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-[#6B7280] font-medium",
				children: new Date(o.date).toLocaleDateString("en-IN")
			})] })
		},
		{
			key: "customerName",
			header: "Customer",
			sortable: true,
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-[#111111] text-sm",
				children: o.customerName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-[#4B5563] font-medium",
				children: [
					o.customerCity,
					" · ",
					o.customerPhone
				]
			})] })
		},
		{
			key: "items",
			header: "Parts Ordered",
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[#111111] text-xs truncate",
					children: o.items[0]?.productName || "EV Parts"
				}), o.items.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-[#E31E24] font-bold",
					children: [
						"+",
						o.items.length - 1,
						" more items"
					]
				})]
			})
		},
		{
			key: "totalAmount",
			header: "Amount",
			sortable: true,
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: ["₹", o.totalAmount.toLocaleString("en-IN")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-[#6B7280] font-medium",
				children: o.paymentMethod
			})] })
		},
		{
			key: "courier",
			header: "Courier / Rider",
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-[#111111] text-xs",
				children: o.courier
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-[#4B5563] font-mono truncate",
				children: o.trackingNumber
			})] })
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: o.status,
				size: "sm"
			})
		}
	];
	const getTimelineSteps = (order) => {
		const currentIdx = [
			"Placed",
			"Processing",
			"Dispatched",
			"In Transit",
			"Delivered"
		].indexOf(order.status);
		if (order.status === "Cancelled") return [{
			title: "Order Placed",
			time: new Date(order.date).toLocaleTimeString("en-IN"),
			status: "complete"
		}, {
			title: "Order Cancelled & Refunded",
			description: order.notes || "Customer cancellation",
			status: "current"
		}];
		return [
			{
				title: "Order Placed & Payment Verified",
				description: `Verified via ${order.paymentMethod}`,
				time: new Date(order.date).toLocaleTimeString("en-IN"),
				status: currentIdx >= 0 ? "complete" : "upcoming"
			},
			{
				title: "Packed by Vendor Hub",
				description: order.items[0]?.sellerName || "Verified Seller",
				time: currentIdx >= 1 ? "1 hour later" : void 0,
				status: currentIdx > 1 ? "complete" : currentIdx === 1 ? "current" : "upcoming"
			},
			{
				title: "Dispatched with Carrier",
				description: `${order.courier} (AWB: ${order.trackingNumber})`,
				time: currentIdx >= 2 ? "2 hours later" : void 0,
				status: currentIdx > 2 ? "complete" : currentIdx === 2 ? "current" : "upcoming"
			},
			{
				title: "Out for Doorstep Delivery",
				description: order.riderName ? `Rider: ${order.riderName}` : "Courier Hub Driver assigned",
				status: currentIdx > 3 ? "complete" : currentIdx === 3 ? "current" : "upcoming"
			},
			{
				title: "Delivered to Customer",
				description: "Verified with OTP & fitment checklist",
				status: currentIdx >= 4 ? "complete" : "upcoming"
			}
		];
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Order Management & Live Dispatches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Real-time multi-vendor fulfillment, express courier tracking and doorstep SLA monitoring."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: orders,
				columns,
				searchPlaceholder: "Search order #, customer name, phone or tracking...",
				searchKey: (o) => `${o.orderNumber} ${o.customerName} ${o.customerPhone} ${o.trackingNumber} ${o.courier}`,
				filterTabs,
				currentFilter: statusFilter,
				onFilterChange: setStatusFilter,
				filterPredicate: (o, filter) => o.status === filter,
				onRowClick: (order) => setSelectedOrder(order),
				keyExtractor: (o) => o.id,
				exportFileName: "riderzpro_orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedOrder),
				onClose: () => setSelectedOrder(null),
				width: "xl",
				title: selectedOrder ? `Order #${selectedOrder.orderNumber}` : void 0,
				description: selectedOrder ? `Placed on ${new Date(selectedOrder.date).toLocaleString("en-IN")}` : void 0,
				children: selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#4B5563] font-bold",
									children: "Current Status:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: selectedOrder.status,
									size: "md"
								})]
							}), selectedOrder.status !== "Cancelled" && selectedOrder.status !== "Delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
									variant: "primary",
									size: "sm",
									onClick: () => {
										updateOrderStatus(selectedOrder.id, "Delivered");
										setSelectedOrder({
											...selectedOrder,
											status: "Delivered"
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mark Delivered" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
									variant: "destructive",
									size: "sm",
									onClick: () => setShowCancelDialog(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cancel" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-emerald-950",
									children: "100% Fitment Verified"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-emerald-800 font-medium",
									children: "Component tested against customer bike chassis specs."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full",
								children: "PASSED"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-[#111111] mb-3 flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Fulfillment Timeline" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { steps: getTimelineSteps(selectedOrder) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-[#111111] mb-3 text-sm",
									children: "Items Breakdown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-[#F3F4F6] space-y-2",
									children: selectedOrder.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 first:pt-0 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111]",
											children: item.productName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-[#6B7280] font-medium",
											children: [
												"Seller: ",
												item.sellerName,
												" · Qty: ",
												item.quantity,
												" · Fitment: ",
												item.bikeCompatible
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-[#111111] tabular-nums",
											children: ["₹", (item.unitPrice * item.quantity).toLocaleString("en-IN")]
										})]
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-[#F3F4F6] space-y-1.5 text-[#4B5563] text-[11px] font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#111111] font-bold",
												children: ["₹", selectedOrder.subtotal.toLocaleString("en-IN")]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated GST (12%):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#111111] font-bold",
												children: ["₹", selectedOrder.taxGst.toLocaleString("en-IN")]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery Fee:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#111111] font-bold",
												children: ["₹", selectedOrder.deliveryFee]
											})]
										}),
										selectedOrder.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-emerald-700 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Coupon Discount:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-₹", selectedOrder.discount] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E5E7EB]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#E31E24] tabular-nums font-extrabold text-base",
												children: ["₹", selectedOrder.totalAmount.toLocaleString("en-IN")]
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer Details" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-[#111111]",
										children: selectedOrder.customerName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#4B5563] font-medium",
										children: selectedOrder.customerPhone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#6B7280] leading-relaxed font-medium",
										children: selectedOrder.shippingAddress
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3.5 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] font-bold uppercase text-[#6B7280] flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 text-orange-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logistics Carrier" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-[#111111]",
										children: selectedOrder.courier
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[#4B5563] font-semibold",
										children: selectedOrder.trackingNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#111111] font-medium",
										children: selectedOrder.riderName ? `Assigned: ${selectedOrder.riderName}` : "Standard carrier routing"
									}),
									selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] text-[#4B5563] font-bold block mb-1",
											children: "Reassign Local Fleet Rider:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: newRiderId,
												onChange: (e) => setNewRiderId(e.target.value),
												className: "rounded-xl border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] text-[#111111] font-medium flex-1 outline-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select available rider..."
												}), riders.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: r.id,
													children: [
														r.name,
														" (",
														r.zone,
														")"
													]
												}, r.id))]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
												variant: "primary",
												size: "sm",
												disabled: !newRiderId,
												onClick: () => {
													reassignRider(selectedOrder.id, newRiderId);
													const r = riders.find((x) => x.id === newRiderId);
													if (r) setSelectedOrder({
														...selectedOrder,
														riderId: r.id,
														riderName: `${r.name} (${r.phone})`
													});
													setNewRiderId("");
												},
												children: "Assign"
											})]
										})]
									})
								]
							})]
						}),
						selectedOrder.status === "Cancelled" && selectedOrder.paymentStatus !== "Refunded" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							variant: "primary",
							size: "md",
							className: "w-full",
							onClick: () => setShowRefundDialog(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Process Customer Refund (₹",
								selectedOrder.totalAmount.toLocaleString("en-IN"),
								")"
							] })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				isOpen: showCancelDialog,
				onClose: () => setShowCancelDialog(false),
				onConfirm: () => {
					if (selectedOrder) {
						cancelOrder(selectedOrder.id, "Cancelled by Admin console request");
						setSelectedOrder({
							...selectedOrder,
							status: "Cancelled",
							paymentStatus: "Refunded"
						});
					}
				},
				title: "Cancel Order?",
				description: "Are you sure you want to cancel this order? This will halt dispatch and initiate an automated refund.",
				confirmLabel: "Cancel Order & Refund"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				isOpen: showRefundDialog,
				onClose: () => setShowRefundDialog(false),
				onConfirm: () => {
					if (selectedOrder) {
						refundOrder(selectedOrder.id);
						setSelectedOrder({
							...selectedOrder,
							paymentStatus: "Refunded"
						});
					}
				},
				title: "Approve Refund?",
				description: "This will send an instant settlement request to Razorpay for this customer.",
				confirmLabel: "Process Refund"
			})
		]
	});
}
//#endregion
export { OrdersScreen };
