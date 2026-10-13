import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { At as CircleAlert, Et as CircleX, L as Percent, Ot as CircleCheck, Vt as Building, m as Star } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-CQjqc3RE.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SellersScreen-Dm57kai8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SellersScreen() {
	const { sellers, approveSellerKyc, rejectSellerKyc, updateSellerCommission } = useAdminStore();
	const [selectedSeller, setSelectedSeller] = (0, import_react.useState)(null);
	const [kycFilter, setKycFilter] = (0, import_react.useState)("ALL");
	const [rejectModalSeller, setRejectModalSeller] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [commissionModalSeller, setCommissionModalSeller] = (0, import_react.useState)(null);
	const [newCommission, setNewCommission] = (0, import_react.useState)(10);
	const filterTabs = [
		{
			label: "All Sellers",
			value: "ALL",
			count: sellers.length
		},
		{
			label: "KYC Approved",
			value: "Approved",
			count: sellers.filter((s) => s.kycStatus === "Approved").length
		},
		{
			label: "KYC Pending",
			value: "Pending",
			count: sellers.filter((s) => s.kycStatus === "Pending").length
		},
		{
			label: "KYC Rejected",
			value: "Rejected",
			count: sellers.filter((s) => s.kycStatus === "Rejected").length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Seller Directory & KYC Approval Queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Verify verified manufacturer vendors, commission rates and seller payout settlement accounts."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: sellers,
				columns: [
					{
						key: "businessName",
						header: "Business Name",
						sortable: true,
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] text-sm",
							children: s.businessName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#4B5563] font-medium mt-0.5",
							children: [
								"Owner: ",
								s.ownerName,
								" · ",
								s.city
							]
						})] })
					},
					{
						key: "gstin",
						header: "GSTIN Tax ID",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[#111111] font-bold text-xs",
							children: s.gstin
						})
					},
					{
						key: "commissionRate",
						header: "Commission",
						sortable: true,
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-[#E31E24] tabular-nums text-xs",
							children: [s.commissionRate, "%"]
						})
					},
					{
						key: "totalSales",
						header: "Sales Volume",
						sortable: true,
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-[#111111] tabular-nums text-xs",
							children: ["₹", s.totalSales.toLocaleString("en-IN")]
						})
					},
					{
						key: "rating",
						header: "Rating",
						sortable: true,
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 font-bold text-[#B45309]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [s.rating, "★"] })]
						})
					},
					{
						key: "kycStatus",
						header: "KYC Status",
						sortable: true,
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: s.kycStatus,
							size: "sm"
						})
					},
					{
						key: "actions",
						header: "Actions",
						className: "text-right",
						render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-1.5",
							onClick: (e) => e.stopPropagation(),
							children: [s.kycStatus === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => approveSellerKyc(s.id),
								className: "rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 p-1.5 transition",
								title: "Approve KYC",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRejectModalSeller(s),
								className: "rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition",
								title: "Reject KYC",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setCommissionModalSeller(s);
									setNewCommission(s.commissionRate);
								},
								className: "rounded-lg bg-gray-100 text-[#374151] hover:bg-gray-200 p-1.5 transition cursor-pointer",
								title: "Edit Commission Rate",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-3.5 w-3.5" })
							})]
						})
					}
				],
				searchPlaceholder: "Search vendor business, owner name or GSTIN...",
				searchKey: (s) => `${s.businessName} ${s.ownerName} ${s.gstin} ${s.city}`,
				filterTabs,
				currentFilter: kycFilter,
				onFilterChange: setKycFilter,
				filterPredicate: (s, filter) => s.kycStatus === filter,
				onRowClick: (seller) => setSelectedSeller(seller),
				keyExtractor: (s) => s.id,
				exportFileName: "riderzpro_sellers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedSeller),
				onClose: () => setSelectedSeller(null),
				width: "lg",
				title: selectedSeller?.businessName,
				description: selectedSeller ? `Joined ${selectedSeller.joinedDate} · ${selectedSeller.city}` : void 0,
				children: selectedSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-base text-[#111111]",
									children: selectedSeller.businessName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#4B5563] font-medium mt-0.5",
									children: ["Managing Owner: ", selectedSeller.ownerName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280] font-mono mt-0.5",
									children: [
										selectedSeller.phone,
										" · ",
										selectedSeller.email
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: selectedSeller.kycStatus,
								size: "md"
							})]
						}),
						selectedSeller.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-red-200 bg-red-50 p-3.5 text-red-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-bold flex items-center gap-1.5 mb-1 text-red-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KYC Rejection Details:" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed",
								children: selectedSeller.rejectionReason
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GSTIN & Banking Credentials" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Registered GSTIN:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-[#111111]",
										children: selectedSeller.gstin
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Payout Settlement Account:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[#111111] font-semibold",
										children: selectedSeller.bankAccount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Active Platform Commission:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-[#E31E24]",
										children: [selectedSeller.commissionRate, "%"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "Total Sales"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-[#111111] mt-1",
										children: [
											"₹",
											(selectedSeller.totalSales / 1e5).toFixed(1),
											"L"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "Catalog Items"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-[#111111] mt-1",
										children: [selectedSeller.activeProductsCount, " Parts"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280] font-bold uppercase",
										children: "Vendor Rating"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-base font-bold text-[#B45309] mt-1",
										children: [selectedSeller.rating, "★"]
									})]
								})
							]
						}),
						selectedSeller.kycStatus === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "primary",
								size: "md",
								className: "flex-1",
								onClick: () => {
									approveSellerKyc(selectedSeller.id);
									setSelectedSeller({
										...selectedSeller,
										kycStatus: "Approved"
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve KYC Certificate" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "destructive",
								size: "md",
								className: "flex-1",
								onClick: () => setRejectModalSeller(selectedSeller),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject" })]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(rejectModalSeller),
				onClose: () => {
					setRejectModalSeller(null);
					setRejectReason("");
				},
				title: "Reject Seller KYC Application",
				description: "Provide a clear compliance reason to send back to the vendor.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-[#374151] font-bold mb-1.5 uppercase text-[10px]",
						children: "Compliance Rejection Reason"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: rejectReason,
						onChange: (e) => setRejectReason(e.target.value),
						placeholder: "e.g. GSTIN certificate blurred or bank passbook name does not match trade license.",
						className: "w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2.5 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "secondary",
							size: "sm",
							onClick: () => {
								setRejectModalSeller(null);
								setRejectReason("");
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "destructive",
							size: "sm",
							disabled: !rejectReason.trim(),
							onClick: () => {
								if (rejectModalSeller) {
									rejectSellerKyc(rejectModalSeller.id, rejectReason.trim());
									if (selectedSeller?.id === rejectModalSeller.id) setSelectedSeller({
										...selectedSeller,
										kycStatus: "Rejected",
										rejectionReason: rejectReason.trim()
									});
									setRejectModalSeller(null);
									setRejectReason("");
								}
							},
							children: "Confirm Rejection"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(commissionModalSeller),
				onClose: () => setCommissionModalSeller(null),
				title: "Update Marketplace Commission Rate",
				description: `Set custom platform fee % for ${commissionModalSeller?.businessName}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[#374151] font-bold mb-1.5 uppercase text-[10px]",
							children: "Commission Rate (%)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							type: "number",
							min: 2,
							max: 35,
							step: .5,
							value: newCommission,
							onChange: (e) => setNewCommission(parseFloat(e.target.value) || 0),
							rightElement: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#4B5563] font-bold",
								children: "%"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[#6B7280] text-[11px] font-medium",
							children: "Standard marketplace benchmark for EV batteries and parts is 8% to 12%."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2.5 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "secondary",
							size: "sm",
							onClick: () => setCommissionModalSeller(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "primary",
							size: "sm",
							onClick: () => {
								if (commissionModalSeller) {
									updateSellerCommission(commissionModalSeller.id, newCommission);
									if (selectedSeller?.id === commissionModalSeller.id) setSelectedSeller({
										...selectedSeller,
										commissionRate: newCommission
									});
									setCommissionModalSeller(null);
								}
							},
							children: "Save Commission"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SellersScreen };
