import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Yt as Building, cn as ArrowUpRight, tn as Bike } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-Dvo5t1xh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PaymentsScreen-PRMcYkZX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsScreen() {
	const { transactions } = useAdminStore();
	const [activeTab, setActiveTab] = (0, import_react.useState)("All");
	const [payoutConfirmTarget, setPayoutConfirmTarget] = (0, import_react.useState)(null);
	const filterTabs = [
		{
			label: "All Activity",
			value: "All",
			count: transactions.length
		},
		{
			label: "Customer Payments",
			value: "Payment",
			count: transactions.filter((t) => t.type === "Payment").length
		},
		{
			label: "Seller Payouts",
			value: "Seller Payout",
			count: transactions.filter((t) => t.type === "Seller Payout").length
		},
		{
			label: "Rider Payouts",
			value: "Rider Payout",
			count: transactions.filter((t) => t.type === "Rider Payout").length
		},
		{
			label: "Refunds",
			value: "Refund",
			count: transactions.filter((t) => t.type === "Refund").length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Payments, Settlement Payouts & Refunds"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Razorpay, Cashfree & UPI gateway reconciliations, automated seller commissions and rider weekly earnings."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
						variant: "primary",
						size: "sm",
						onClick: () => setPayoutConfirmTarget("All Verified Sellers (₹4.2 Lakhs)"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Process Seller Payout Batch" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => setPayoutConfirmTarget("Active Delivery Fleet (₹1.8 Lakhs)"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Process Rider Payout Batch" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Gross Volume (Apr)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-extrabold text-[#111111] mt-1 tabular-nums",
								children: "₹48,24,500"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" }), " +18.4% growth"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Pending Vendor Settlements"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-extrabold text-[#B45309] mt-1 tabular-nums",
								children: "₹4,20,000"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] mt-1 font-medium",
								children: "12 vendors scheduled for T+2"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Rider Fleet Payouts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-extrabold text-sky-700 mt-1 tabular-nums",
								children: "₹1,84,500"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] mt-1 font-medium",
								children: "142 riders on active cycle"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#6B7280] uppercase",
								children: "Total Refunds Processed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-extrabold text-red-700 mt-1 tabular-nums",
								children: "₹18,400"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#4B5563] mt-1 font-medium",
								children: "0.38% return rate"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: transactions,
				columns: [
					{
						key: "transactionRef",
						header: "Reference ID",
						sortable: true,
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-[#111111] text-xs",
							children: t.transactionRef
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[#6B7280] font-mono",
							children: ["Order: ", t.orderId]
						})] })
					},
					{
						key: "customerName",
						header: "Beneficiary / Source",
						sortable: true,
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] text-sm",
							children: t.customerName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#4B5563] font-medium",
							children: t.type
						})] })
					},
					{
						key: "amount",
						header: "Amount",
						sortable: true,
						render: (t) => {
							const isNegative = t.type === "Refund" || t.type === "Seller Payout" || t.type === "Rider Payout";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 font-bold tabular-nums text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: isNegative ? "text-amber-700" : "text-emerald-700",
									children: [
										isNegative ? "-" : "+",
										"₹",
										t.amount.toLocaleString("en-IN")
									]
								})
							});
						}
					},
					{
						key: "gateway",
						header: "Gateway / Rail",
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-[#111111] text-xs",
							children: t.gateway
						})
					},
					{
						key: "fee",
						header: "Platform Fee",
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[#4B5563] font-semibold text-xs",
							children: ["₹", t.fee]
						})
					},
					{
						key: "timestamp",
						header: "Date",
						sortable: true,
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#6B7280] font-medium",
							children: new Date(t.timestamp).toLocaleDateString("en-IN")
						})
					},
					{
						key: "status",
						header: "Status",
						sortable: true,
						render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: t.status,
							size: "sm"
						})
					}
				],
				searchPlaceholder: "Search reference ID, order # or customer...",
				searchKey: (t) => `${t.transactionRef} ${t.orderId} ${t.customerName} ${t.gateway}`,
				filterTabs,
				currentFilter: activeTab,
				onFilterChange: (v) => setActiveTab(v),
				filterPredicate: (t, f) => f === "All" ? true : t.type === f,
				keyExtractor: (t) => t.id,
				exportFileName: "riderzpro_financial_transactions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				isOpen: Boolean(payoutConfirmTarget),
				onClose: () => setPayoutConfirmTarget(null),
				onConfirm: () => {
					toast.success("Payout Batch Dispatched", { description: `Automated IMPS / UPI transfer executed for ${payoutConfirmTarget}.` });
					setPayoutConfirmTarget(null);
				},
				title: "Execute Payout Batch?",
				description: `This will trigger instant bank settlement via Cashfree API for ${payoutConfirmTarget}.`,
				confirmLabel: "Execute Transfer",
				variant: "primary"
			})
		]
	});
}
//#endregion
export { PaymentsScreen };
